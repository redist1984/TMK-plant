#!/usr/bin/env node
/*
 * Дымовой тест приложения: открывает его в браузере и проверяет, что все
 * вкладки реально работают.
 *
 *   node tools/smoke-test.js                       собрать из корня и проверить
 *   node tools/smoke-test.js --url http://...      проверить внешний адрес
 *   node tools/smoke-test.js --offline dist-offline/TMK-plant-offline.html
 *
 * Что проверяется:
 *   1. Страница поднимается без ошибок JS (шум WebGL игнорируется).
 *   2. В оболочке 9 вкладок, каждая открывается и что-то содержит.
 *   3. Данные на месте: схема PFD, блокировки, анализы, КИП, ссылки на PDF.
 *
 * Зачем: это единственный тест, который ловит поломку вроде упавшего
 * vessel() — статический анализ её не видит, а пользователь видит пустой экран.
 */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const arg = (name, fallback) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
};
const OFFLINE = arg('--offline', null);
const URL_ARG = arg('--url', null);

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

function serve(root) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(root, rel);
    if (!file.startsWith(root)) return res.writeHead(403).end();
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end('not found');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    });
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

// вкладка → iframe и что в ней должно быть (минимум, не равенство: рост не поломка)
const TABS = [
  { name: 'model', iframe: 'f-model', expr: "document.querySelectorAll('canvas').length", min: 1, what: 'canvas 3D' },
  { name: 'flow', iframe: 'f-flow', expr: "document.querySelectorAll('canvas, svg *').length", min: 1, what: 'элементов схемы' },
  { name: 'pfd', iframe: 'f-pfd', expr: "document.querySelectorAll('svg *').length", min: 200, what: 'элементов PFD' },
  { name: 'interlocks', iframe: 'f-ilk', expr: "document.querySelectorAll('.card').length", min: 20, what: 'карточек блокировок' },
  { name: 'analyses', iframe: 'f-anl', expr: "document.querySelectorAll('li, tr').length", min: 15, what: 'точек анализов' },
  { name: 'kip', iframe: 'f-kip', expr: "document.querySelectorAll('li, tr').length", min: 100, what: 'строк КИП' },
  { name: 'docs', iframe: 'f-docs', expr: "document.querySelectorAll('a[href^=\"docs_pdf/\"]').length", min: 100, what: 'ссылок на PDF' },
  { name: 'settings', iframe: 'f-settings', expr: null },
  { name: 'help', iframe: 'f-help', expr: null },
];

(async () => {
  let chromium;
  try {
    ({ chromium } = require('playwright-core'));
  } catch (e) {
    console.error('Нет playwright-core: npm install');
    process.exit(2);
  }

  let server = null;
  let target;
  if (OFFLINE) {
    const abs = path.resolve(ROOT, OFFLINE);
    if (!fs.existsSync(abs)) {
      console.error('Нет файла: ' + abs);
      process.exit(2);
    }
    // отдаём каталог сборки по http, а не открываем file:// — иначе iframe
    // считаются чужим origin и внутрь не заглянуть
    server = await serve(path.dirname(abs));
    target = 'http://127.0.0.1:' + server.address().port + '/' + encodeURIComponent(path.basename(abs));
  } else if (URL_ARG) {
    target = URL_ARG;
  } else {
    server = await serve(ROOT);
    target = 'http://127.0.0.1:' + server.address().port + '/index.html';
  }

  const browser = await chromium.launch({
    channel: process.env.TMK_BROWSER || 'chrome',
    args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
  });
  const page = await browser.newPage();
  const errors = [];
  const IGN = /WebGL|shader|GL_INVALID|WebGLProgram|WebGLShader|THREE\.WebGLRenderer/i;
  page.on('pageerror', (e) => {
    const t = String(e);
    if (!IGN.test(t)) errors.push(t.slice(0, 200));
  });
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (!IGN.test(t)) errors.push(t.slice(0, 200));
  });

  console.log('открываю: ' + target);
  await page.goto(target, { waitUntil: 'load', timeout: 180000 });

  const failures = [];
  const tabCount = await page.evaluate(() => document.querySelectorAll('#tabs button').length);
  console.log('вкладок в оболочке: ' + tabCount);
  if (tabCount !== 9) failures.push('вкладок ' + tabCount + ', ожидалось 9');

  for (const t of TABS) {
    const clicked = await page.evaluate((n) => {
      const btn = document.querySelector('#tabs button[data-t="' + n + '"]');
      if (!btn) return false;
      btn.click();
      return true;
    }, t.name);
    if (!clicked) {
      failures.push(t.name + ': кнопки вкладки нет');
      continue;
    }
    await page.waitForTimeout(t.name === 'model' ? 9000 : 1600);

    if (!t.expr) {
      console.log('  ✔ ' + t.name.padEnd(11) + ' открыта');
      continue;
    }

    // заглядываем внутрь iframe: по http это тот же origin
    const value = await page.evaluate(
      ({ id, expr }) => {
        const f = document.getElementById(id);
        const doc = f && f.contentDocument;
        if (!doc) return null;
        try {
          return new Function('document', 'window', 'return (' + expr + ')')(doc, f.contentWindow);
        } catch (e) {
          return -1;
        }
      },
      { id: t.iframe, expr: t.expr }
    );

    const ok = typeof value === 'number' && value >= t.min;
    console.log(
      '  ' + (ok ? '✔' : '✖') + ' ' + t.name.padEnd(11) + ' ' + t.what + ': ' + value + ' (минимум ' + t.min + ')'
    );
    if (!ok) failures.push(t.name + ': ' + t.what + ' = ' + value + ', ожидалось >= ' + t.min);
  }

  await browser.close();
  if (server) server.close();

  if (errors.length) {
    console.log('\nошибки JS: ' + errors.length);
    errors.slice(0, 8).forEach((e) => console.log('   ' + e));
    failures.push('ошибок JS: ' + errors.length);
  }

  if (failures.length) {
    console.log('\nПРОВАЛ:');
    failures.forEach((f) => console.log('  - ' + f));
    process.exit(1);
  }
  console.log('\nДымовой тест пройден.');
})().catch((e) => {
  console.error('FAIL: ' + e.message);
  process.exit(2);
});
