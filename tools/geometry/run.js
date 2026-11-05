/*
 * Запуск проверок геометрии 3D-модели.
 *
 *   node tools/geometry/run.js                  все проверки
 *   node tools/geometry/run.js --only pipe-pipe
 *   node tools/geometry/run.js --update-baseline
 *   node tools/geometry/run.js --browser msedge
 *
 * Что делает: генерирует model_test.html, поднимает статический сервер на
 * свободном порту, открывает его в установленном Chrome/Edge (через
 * playwright-core, браузер не скачивается), прогоняет проверки и сравнивает
 * число находок с tools/geometry/baseline.json. Превышение базовой линии —
 * ошибка (код возврата 1).
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { prepare, ROOT } = require('./prepare');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const CHECKS = [
  require('./checks/pipes-through-equipment'),
  require('./checks/pipe-pipe'),
  require('./checks/supports-overlaps'),
  require('./checks/walls-roofs'),
  require('./checks/kip-overlaps'),
];

const BASELINE_FILE = path.join(__dirname, 'baseline.json');

(async () => {
  const only = arg('--only', null);
  const channel = arg('--browser', process.env.TMK_BROWSER || 'chrome');
  const updateBaseline = process.argv.includes('--update-baseline');

  let chromium;
  try {
    ({ chromium } = require('playwright-core'));
  } catch (e) {
    console.error('Нет playwright-core. Установите:  npm install');
    process.exit(2);
  }

  prepare();
  const server = await serve();
  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/model_test.html`;
  console.log(`сервер: ${url}`);
  console.log(`браузер: ${channel}`);

  const browser = await chromium.launch({
    channel,
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage();
  const pageErrors = [];
  // Шейдерные ошибки swiftshader в headless — особенность окружения, а не
  // проблема модели: геометрия к этому моменту уже построена, проверки её видят.
  const IGNORE = /WebGL|shader|GL_INVALID|WebGLProgram|WebGLShader|WebGLRenderer/i;
  page.on('pageerror', (e) => {
    const t = String(e);
    if (!IGNORE.test(t)) pageErrors.push(t.slice(0, 200));
  });
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (IGNORE.test(t)) return;
    pageErrors.push(t.slice(0, 200));
  });

  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  try {
    await page.waitForFunction(() => !!window.__T, null, { timeout: 120000 });
  } catch (e) {
    console.error('window.__T не появился — модель не инициализировалась');
    pageErrors.slice(0, 5).forEach((t) => console.error('  ', t));
    await browser.close();
    server.close();
    process.exit(2);
  }
  // даём сцене достроиться (KIP-слой собирается асинхронно)
  await page.waitForTimeout(4000);

  const baseline = fs.existsSync(BASELINE_FILE)
    ? JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8'))
    : {};
  const next = {};
  let failed = 0;

  for (const check of CHECKS) {
    if (only && check.name !== only) continue;
    const started = Date.now();
    let result;
    try {
      result = await page.evaluate(check.evaluate, check.args || null);
    } catch (e) {
      console.log(`\n✖ ${check.title}: ошибка выполнения — ${e.message}`);
      failed++;
      continue;
    }
    const items = check.extract ? check.extract(result) : result;
    const count = items.length;
    next[check.name] = count;

    const allowed = baseline[check.name];
    const over = typeof allowed === 'number' && count > allowed;
    if (over) failed++;

    const mark = over ? '✖' : count > 0 ? '•' : '✔';
    console.log(
      `\n${mark} ${check.title}: ${count}` +
        (typeof allowed === 'number' ? ` (базовая линия ${allowed})` : ' (нет базовой линии)') +
        `, ${Date.now() - started} мс`
    );
    for (const line of items.slice(0, 12)) console.log('   ' + line);
    if (items.length > 12) console.log(`   … ещё ${items.length - 12}`);
  }

  await browser.close();
  server.close();

  if (pageErrors.length) {
    console.log(`\n✖ ошибки в консоли страницы: ${pageErrors.length}`);
    pageErrors.slice(0, 5).forEach((t) => console.log('   ' + t));
    failed++;
  }

  if (updateBaseline) {
    const merged = Object.assign({}, baseline, next);
    fs.writeFileSync(BASELINE_FILE, JSON.stringify(merged, null, 2) + '\n');
    console.log(`\nбазовая линия обновлена: ${path.relative(ROOT, BASELINE_FILE)}`);
    process.exit(0);
  }

  console.log(failed ? `\nПровалено проверок: ${failed}` : '\nВсе проверки в пределах базовой линии.');
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(2);
});
