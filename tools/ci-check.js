#!/usr/bin/env node
/*
 * Проверки целостности проекта для CI.
 *
 * Запуск:  node tools/ci-check.js
 * Код возврата: 0 — всё чисто, 1 — есть ошибки (печатаются).
 *
 * Что проверяется:
 *   1. Синтаксис всех .js и inline-скриптов во всех .html (без запуска кода).
 *   2. service-worker.js: каждая запись ASSETS существует на диске; все скрипты,
 *      подключённые страницами, попадают в precache; нет дублей; версия CACHE задана.
 *   3. docs.html: все ссылки docs_pdf/* существуют, и каждый PDF на диске проиндексирован.
 *   4. Атрибуты src/href во всех .html указывают на существующие файлы.
 *   5. Галереи IMGS в model.html/flow.html ссылаются на существующие sec_img/*.
 *
 * Зависимостей нет — только stdlib Node.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);

const errors = [];
const fail = (check, msg) => errors.push(`[${check}] ${msg}`);

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function listFiles(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      listFiles(full, filter, out);
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const htmlFiles = fs.readdirSync(ROOT).filter((n) => n.toLowerCase().endsWith('.html'));
const jsFiles = listFiles(ROOT, (p) => p.endsWith('.js') && !p.includes('node_modules'));

// ---------------------------------------------------------------------------
// 1. Синтаксис
// ---------------------------------------------------------------------------
function checkSyntax() {
  for (const f of jsFiles) {
    const src = readText(f);
    try {
      new vm.Script(src, { filename: rel(f) });
    } catch (e) {
      fail('syntax', `${rel(f)}: ${e.message}`);
    }
  }

  for (const h of htmlFiles) {
    const src = readText(P(h));
    const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    let i = 0;
    while ((m = re.exec(src))) {
      i++;
      const body = m[1];
      if (!body.trim()) continue;
      try {
        new vm.Script(body, { filename: `${h}#inline${i}` });
      } catch (e) {
        const line = src.slice(0, m.index).split('\n').length;
        fail('syntax', `${h}: inline <script> #${i} (около строки ${line}): ${e.message}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Service worker
// ---------------------------------------------------------------------------
function parseServiceWorker() {
  const file = P('service-worker.js');
  if (!fs.existsSync(file)) {
    fail('sw', 'service-worker.js отсутствует');
    return null;
  }
  const src = readText(file);

  const cacheMatch = src.match(/const\s+CACHE\s*=\s*['"]([^'"]+)['"]/);
  if (!cacheMatch) fail('sw', 'не найдена константа CACHE');
  else if (!/^tmk-plant-v\d+$/.test(cacheMatch[1])) {
    fail('sw', `версия кэша "${cacheMatch[1]}" не соответствует шаблону tmk-plant-v<N>`);
  }

  const start = src.indexOf('const ASSETS');
  const open = src.indexOf('[', start);
  const close = src.indexOf('];', open);
  if (start < 0 || open < 0 || close < 0) {
    fail('sw', 'не удалось разобрать массив ASSETS');
    return null;
  }
  const body = src.slice(open + 1, close);
  const assets = [];
  for (const m of body.matchAll(/["']([^"']+)["']/g)) assets.push(m[1]);

  const seen = new Set();
  for (const a of assets) {
    if (seen.has(a)) fail('sw', `дубль в ASSETS: ${a}`);
    seen.add(a);
    if (!fs.existsSync(P(a))) fail('sw', `ASSETS указывает на отсутствующий файл: ${a}`);
  }
  return { assets, set: seen, cache: cacheMatch ? cacheMatch[1] : null };
}

// ---------------------------------------------------------------------------
// 3. docs.html
// ---------------------------------------------------------------------------
function checkDocs() {
  const file = P('docs.html');
  if (!fs.existsSync(file)) {
    fail('docs', 'docs.html отсутствует');
    return;
  }
  const src = readText(file);
  const referenced = new Set();
  for (const m of src.matchAll(/["']docs_pdf\/([^"'\\]+)["']/g)) referenced.add(m[1]);

  for (const r of referenced) {
    if (!fs.existsSync(P('docs_pdf', r))) fail('docs', `ссылка на отсутствующий PDF: docs_pdf/${r}`);
  }

  const dir = P('docs_pdf');
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.toLowerCase().endsWith('.pdf')) continue;
      if (!referenced.has(f)) fail('docs', `PDF есть на диске, но не проиндексирован в docs.html: docs_pdf/${f}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Ссылки в HTML
// ---------------------------------------------------------------------------
const EXTERNAL = /^(?:https?:|mailto:|tel:|data:|blob:|javascript:|#|\/\/)/i;

function checkHtmlLinks() {
  for (const h of htmlFiles) {
    const src = readText(P(h));
    const dir = path.dirname(P(h));
    const seen = new Set();

    const re = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
    let m;
    while ((m = re.exec(src))) {
      let ref = m[1].trim();
      if (!ref || EXTERNAL.test(ref)) continue;
      if (ref.includes('${')) continue; // шаблонная строка, собирается в рантайме
      if (seen.has(ref)) continue;
      seen.add(ref);

      ref = ref.split('#')[0].split('?')[0];
      if (!ref) continue;
      const candidates = [path.resolve(dir, ref), P(decodeURIComponent(ref)), P('sec_img', path.basename(ref))];
      if (candidates.some((c) => fs.existsSync(c))) continue;
      const line = src.slice(0, m.index).split('\n').length;
      fail('links', `${h}:${line} нет файла: ${m[1]}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Галереи IMGS -> sec_img/*
// ---------------------------------------------------------------------------
function checkImgs() {
  for (const h of ['model.html', 'flow.html']) {
    const file = P(h);
    if (!fs.existsSync(file)) continue;
    const src = readText(file);
    const at = src.indexOf('const IMGS');
    if (at < 0) continue;
    const end = src.indexOf('\n', at);
    const line = src.slice(at, end);
    const seen = new Set();
    for (const m of line.matchAll(/\[\s*["']([^"'/]+\.(?:jpe?g|png))["']/gi)) {
      const name = m[1];
      if (seen.has(name)) continue;
      seen.add(name);
      if (!fs.existsSync(P('sec_img', name))) fail('img', `${h}: IMGS ссылается на отсутствующий sec_img/${name}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 2b. Все скрипты, подключённые страницами, должны быть в precache
// ---------------------------------------------------------------------------
function checkPrecache(sw) {
  if (!sw) return;
  const required = new Set();
  for (const h of htmlFiles) {
    const src = readText(P(h));
    const dir = path.relative(ROOT, path.dirname(P(h))) || '.';
    for (const m of src.matchAll(/<script[^>]+src\s*=\s*["']([^"']+)["']/gi)) {
      const ref = m[1];
      if (EXTERNAL.test(ref) || ref.includes('${')) continue;
      required.add(path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, ref)));
    }
  }

  for (const r of required) {
    if (!fs.existsSync(P(r))) {
      fail('precache', `страница подключает отсутствующий скрипт: ${r}`);
      continue;
    }
    if (!sw.set.has(r)) {
      fail('precache', `скрипт не попадёт в офлайн-кэш (нет в ASSETS): ${r}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Запуск
// ---------------------------------------------------------------------------
checkSyntax();
const sw = parseServiceWorker();
checkPrecache(sw);
checkDocs();
checkHtmlLinks();
checkImgs();

const checks = ['syntax', 'sw', 'precache', 'docs', 'links', 'img'];
const byCheck = Object.fromEntries(checks.map((c) => [c, 0]));
for (const e of errors) {
  const key = e.slice(1, e.indexOf(']'));
  byCheck[key] = (byCheck[key] || 0) + 1;
}

console.log('Проверено:');
console.log(`  html: ${htmlFiles.length}, js: ${jsFiles.length}`);
if (sw) console.log(`  precache: ${sw.assets.length} файлов, кэш ${sw.cache}`);
console.log('');

if (errors.length === 0) {
  console.log('✔ Все проверки пройдены.');
  process.exit(0);
}

for (const e of errors) console.log('✖ ' + e);
console.log('');
console.log(`Итого ошибок: ${errors.length} ` +
  `(${checks.filter((c) => byCheck[c]).map((c) => `${c}: ${byCheck[c]}`).join(', ')})`);
process.exit(1);
