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
// 6. Rulesets (.github/rulesets/*.json) — импортируются в GitHub вручную,
//    поэтому единственная возможность поймать опечатку — здесь.
// ---------------------------------------------------------------------------
const RULE_TYPES = new Set([
  'creation', 'update', 'deletion', 'non_fast_forward', 'required_linear_history',
  'required_signatures', 'pull_request', 'required_status_checks', 'merge_queue',
  'required_deployments', 'commit_message_pattern', 'commit_author_email_pattern',
  'committer_email_pattern', 'branch_name_pattern', 'tag_name_pattern', 'workflows',
  'code_scanning', 'file_path_restriction', 'max_file_size', 'license_credit_requirement',
]);
const ENFORCEMENT = new Set(['active', 'disabled', 'evaluate']);

function checkRulesets() {
  const dir = P('.github', 'rulesets');
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort();
  if (files.length === 0) return;

  for (const f of files) {
    const where = `.github/rulesets/${f}`;
    let rs;
    try {
      rs = JSON.parse(readText(path.join(dir, f)));
    } catch (e) {
      fail('ruleset', `${where}: невалидный JSON — ${e.message}`);
      continue;
    }

    if (!rs.name) fail('ruleset', `${where}: нет поля name`);
    if (rs.target !== 'branch') fail('ruleset', `${where}: target должен быть "branch", а не ${JSON.stringify(rs.target)}`);
    if (!ENFORCEMENT.has(rs.enforcement)) fail('ruleset', `${where}: enforcement = ${JSON.stringify(rs.enforcement)}`);

    const include = rs.conditions && rs.conditions.ref_name && rs.conditions.ref_name.include;
    if (!Array.isArray(include) || include.length === 0) {
      // Пустой include — частая ловушка: ruleset выглядит активным,
      // но не применяется ни к одной ветке. Для «всех ветвей» нужен "~ALL".
      fail('ruleset', `${where}: пустой conditions.ref_name.include — правила не применятся ни к одной ветке`);
    } else if (/main-protection/.test(f) && !include.includes('refs/heads/main')) {
      fail('ruleset', `${where}: файл про защиту main, а include = ${JSON.stringify(include)}`);
    }

    if (!Array.isArray(rs.rules) || rs.rules.length === 0) {
      fail('ruleset', `${where}: пустой список rules`);
      continue;
    }
    for (const r of rs.rules) {
      if (!RULE_TYPES.has(r.type)) fail('ruleset', `${where}: неизвестный тип правила ${JSON.stringify(r.type)}`);
      if (r.type === 'pull_request') {
        const n = r.parameters && r.parameters.required_approving_review_count;
        if (typeof n !== 'number') fail('ruleset', `${where}: у pull_request нет числового required_approving_review_count`);
      }
      if (r.type === 'required_status_checks') {
        const list = r.parameters && r.parameters.required_status_checks;
        if (!Array.isArray(list) || list.length === 0) {
          fail('ruleset', `${where}: у required_status_checks пустой список проверок`);
        } else {
          for (const c of list) if (!c || !c.context) fail('ruleset', `${where}: проверка без context`);
        }
      }
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
checkRulesets();

const checks = ['syntax', 'sw', 'precache', 'docs', 'links', 'img', 'ruleset'];
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
