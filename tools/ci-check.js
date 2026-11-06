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
      // assets/www и build/ — сгенерированные копии сайта для APK
      const norm = full.split(path.sep).join('/');
      if (norm.includes('/android/app/src/main/assets') || norm.includes('/android/app/build')
          || norm.includes('/android/.gradle')) continue;
      listFiles(full, filter, out);
    } else if (filter(full)) {
      out.push(full);
    }
  }
  return out;
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

const htmlFiles = fs
  .readdirSync(ROOT)
  // model_test.html — генерируемая копия model.html для проверок геометрии
  .filter((n) => n.toLowerCase().endsWith('.html') && n !== 'model_test.html');
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
// 2. Область видимости скриптов страниц
//
// Классические <script src> делят одну глобальную область. Два файла, каждый из
// которых объявляет на верхнем уровне `const API`, роняют страницу с
// "Identifier 'API' has already been declared" — при этом в Node всё работает,
// потому что там модули изолированы. Ошибка уже случалась дважды, поэтому она
// проверяется, а не запоминается.
//
// Правила:
//   - один и тот же верхний уровень объявлен в двух подключаемых файлах — ошибка;
//   - файл, который умеет быть и модулем (есть module.exports), и скриптом,
//     обязан быть обёрнут в IIFE — иначе его имена утекают в общую область.
// ---------------------------------------------------------------------------
function scriptRefs() {
  // какие js-файлы реально подключаются тегом <script src> со страниц
  const out = new Map();      // rel-путь → список страниц
  for (const h of htmlFiles) {
    const src = readText(P(h));
    const re = /<script[^>]*\bsrc="([^":]+\.js)"/gi;
    let m;
    while ((m = re.exec(src))) {
      const relPath = m[1].replace(/^\.\//, '');
      if (!out.has(relPath)) out.set(relPath, []);
      out.get(relPath).push(h);
    }
  }
  return out;
}

function topLevelNames(src) {
  const names = new Set();
  const lines = src.split('\n');
  for (const line of lines) {
    if (/^\s/.test(line)) continue;                        // объявление внутри функции/блока
    const t = line.trim();
    if (!t || t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    let m;
    if ((m = t.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)/))) names.add(m[1]);
    else if ((m = t.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/))) names.add(m[1]);
    else if ((m = t.match(/^class\s+([A-Za-z_$][\w$]*)/))) names.add(m[1]);
  }
  return names;
}

function isWrapped(src) {
  const strip = (s) => s
    .replace(/^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*/, '')   // ведущие комментарии
    .replace(/^\s*['"]use strict['"];\s*/, '')                  // «use strict» перед обёрткой
    .replace(/^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*)*/, '');
  const s = strip(src);
  return /^\(\s*function\b/.test(s) || /^\(\s*\(\s*\)\s*=>/.test(s);
}

function checkScriptScope() {
  const refs = scriptRefs();
  const declared = new Map();      // имя → список файлов

  for (const [file, pages] of refs) {
    const abs = P(file);
    if (!fs.existsSync(abs)) continue;                     // битые ссылки ловит другая проверка
    const src = readText(abs);
    const wrapped = isWrapped(src);

    // В IIFE всё внутреннее: имена наружу не утекают. Файл без обёртки, наоборот,
    // объявляет в общей области — именно такие и сравниваем между собой.
    if (!wrapped) {
      for (const name of topLevelNames(src)) {
        if (!declared.has(name)) declared.set(name, []);
        declared.get(name).push(file);
      }
    }

    // модуль, подключаемый тегом, обязан быть в IIFE
    if (/module\.exports/.test(src) && !wrapped) {
      fail('scope', `${file}: подключается как <script src> (${pages.join(', ')}), но не обёрнут в IIFE — ` +
        'объявления утекут в общую область и столкнутся с другим файлом. ' +
        'Оберните: (function () { ... })();');
    }
  }

  for (const [name, files] of declared) {
    const uniq = [...new Set(files)];
    if (uniq.length > 1) {
      fail('scope', `имя «${name}» объявлено на верхнем уровне в ${uniq.length} подключаемых файлах: ` +
        `${uniq.join(', ')} — страница упадёт с "Identifier already declared". ` +
        'Оберните файлы в IIFE или переименуйте.');
    }
  }
}

// ---------------------------------------------------------------------------
// 3. Service worker
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
      // Внешние шрифты — прямой запрет: приложение должно работать офлайн,
      // а шрифты лежат в fonts/ и раздаются из репозитория.
      if (/fonts\.(?:googleapis|gstatic)\.com/i.test(ref)) {
        const at = src.slice(0, m.index).split('\n').length;
        fail('links', `${h}:${at} внешний шрифт вместо локального: ${ref}`);
        continue;
      }
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
// 7. Секреты: репозиторий публичный, ключи в нём недопустимы.
//    Проверяем текст всех файлов, которые вообще могут их содержать.
// ---------------------------------------------------------------------------
const SECRET_PATTERNS = [
  // Литерал «AIza…» собирается из двух кусков намеренно: иначе этот самый
  // шаблон находился бы собственным поиском и ложно срабатывал.
  { re: new RegExp('AIza' + 'Sy[0-9A-Za-z_-]{30,}', 'g'), what: 'API-ключ Google' },
  { re: new RegExp('googleapis\\.com' + '/drive', 'g'), what: 'обращение к Google Drive API' },
  { re: new RegExp('drive\\.google\\.com' + '/drive/folders', 'g'), what: 'ссылка на папку Google Диска' },
  { re: new RegExp('-----BEGIN (?:RSA |EC |OPENSSH )?' + 'PRIVATE KEY-----', 'g'), what: 'приватный ключ' },
];

function checkSecrets() {
  const skip = /\.(?:png|jpe?g|gif|pdf|zip|woff2?|apk|jar|ico)$/i;
  const files = listFiles(ROOT, (p) => !skip.test(p) && !p.includes(`${path.sep}.git${path.sep}`));

  for (const f of files) {
    let text;
    try {
      text = readText(f);
    } catch (e) {
      continue; // бинарный файл
    }
    for (const { re, what } of SECRET_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(text)) fail('secret', `${rel(f)}: похоже на ${what}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 8. Android-проект: контент должен собираться из корня, а не лежать копией.
// ---------------------------------------------------------------------------
function checkAndroid() {
  const dir = P('android');
  if (!fs.existsSync(dir)) return;

  for (const f of ['settings.gradle', 'build.gradle', 'gradlew', 'gradlew.bat',
    path.join('gradle', 'wrapper', 'gradle-wrapper.jar'),
    path.join('app', 'build.gradle'),
    path.join('app', 'src', 'main', 'java', 'com', 'tmkplant', 'app', 'MainActivity.java')]) {
    if (!fs.existsSync(path.join(dir, f))) fail('android', `android/${f.split(path.sep).join('/')}: нет файла`);
  }

  if (!fs.existsSync(P('tools', 'build-android-assets.js'))) {
    fail('android', 'tools/build-android-assets.js: нет скрипта сборки контента для APK');
  }

  // Сгенерированная копия сайта не должна попадать в репозиторий.
  const gi = P('android', '.gitignore');
  const ignoreText = fs.existsSync(gi) ? readText(gi) : '';
  if (!ignoreText.includes('app/src/main/assets/www/')) {
    fail('android', 'android/.gitignore: не игнорирует app/src/main/assets/www/');
  }
}

// ---------------------------------------------------------------------------
// 12. README не расходится с реальностью
//
// README ссылается на команды и файлы. Скрипт мог быть переименован, файл —
// удалён, а README об этом не узнает: такие расхождения находил человек.
// Проверяем ровно то, что можно проверить машинно: npm-скрипты и пути node.
// ---------------------------------------------------------------------------
function checkReadme() {
  const abs = P('README.md');
  if (!fs.existsSync(abs)) return;
  const md = readText(abs);

  let pkg = null;
  try {
    pkg = JSON.parse(readText(P('package.json')));
  } catch (e) {
    fail('readme', 'package.json не разбирается: ' + e.message);
    return;
  }
  const scripts = (pkg && pkg.scripts) || {};

  for (const m of md.matchAll(/npm run ([a-z][\w:-]*)/g)) {
    if (!scripts[m[1]]) {
      fail('readme', `README ссылается на «npm run ${m[1]}», но такого скрипта в package.json нет`);
    }
  }

  for (const m of md.matchAll(/\bnode (tools\/[\w./-]+\.js)/g)) {
    if (!fs.existsSync(P(m[1]))) {
      fail('readme', `README ссылается на «${m[1]}», но файла нет`);
    }
  }
}

// ---------------------------------------------------------------------------
// Запуск
// ---------------------------------------------------------------------------
checkSyntax();
checkScriptScope();
const sw = parseServiceWorker();
checkPrecache(sw);
checkDocs();
checkHtmlLinks();
checkImgs();
checkRulesets();
checkSecrets();
checkAndroid();
checkReadme();

const checks = ['syntax', 'scope', 'sw', 'precache', 'docs', 'links', 'img', 'ruleset', 'secret', 'android', 'readme'];
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
