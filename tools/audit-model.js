#!/usr/bin/env node
/*
 * Аудит полноты данных 3D-модели.
 *
 *   node tools/audit-model.js                 сводка в консоль + отчёт в docs/model-coverage.md
 *   node tools/audit-model.js --no-report     только сводка
 *
 * Что проверяется по каждому аппарату из DATA.eq:
 *   - есть ли фото/чертежи (IMGS);
 *   - есть ли описание (d);
 *   - переведены ли название и каждая строка описания на узбекский (nu, EQ_UZ);
 *   - существует ли его раздел в DATA.sections;
 *   - указан ли вес (w) и количество (q);
 *   - упомянут ли он в регламенте (DATA.reg[].t).
 *
 * Ничего не меняет — только читает model.html и eq-uz.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);
const html = fs.readFileSync(P('model.html'), 'utf8');

const WRITE_REPORT = !process.argv.includes('--no-report');
const REPORT = P('docs', 'model-coverage.md');

// --- вытащить JS-объект по маркеру (DATA / IMGS) -----------------------
function extractJson(marker) {
  const start = html.indexOf(marker);
  if (start < 0) throw new Error('не найден маркер ' + marker);
  const i = html.indexOf('{', start);
  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let k = i; k < html.length; k++) {
    const c = html[k];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') { inStr = true; continue; }
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) { end = k + 1; break; }
    }
  }
  return JSON.parse(html.slice(i, end));
}

const DATA = extractJson('const DATA = ');
const IMGS = extractJson('const IMGS = ');

// --- переводы описаний -------------------------------------------------
function loadEqUz() {
  const src = fs.readFileSync(P('eq-uz.js'), 'utf8');
  const win = {};
  const sandbox = { window: win, console };
  win.window = win;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  new vm.Script(src, { filename: 'eq-uz.js' }).runInContext(sandbox);
  return win.EQ_UZ || {};
}
const EQ_UZ = loadEqUz();

// --- проверка ----------------------------------------------------------
const sections = new Set(Object.keys(DATA.sections));
const regTags = new Set();
for (const r of DATA.reg) for (const t of r.t || []) regTags.add(t);

// «Есть ли аппарат в 3D» определяется не полем m в DATA.eq, а тем, попал ли тег
// в массив геометрии: модель при построении регистрирует объекты через reg() и
// показывает «не показан в 3D» только если byTag[tag] пуст. Поэтому ищем
// определения вида {t:'DM-01', k:"ptank", ...} во всём файле вне блока DATA.
const dataSpan = html.slice(html.indexOf('const DATA = '), html.indexOf('const IMGS = '));
const outsideData = html.replace(dataSpan, '');
const inScene = new Set();
// тег может содержать «/», «~», «…» (PP-13208A/B, SM-12303A~D, RW-1…6),
// поэтому берём всё до закрывающей кавычки
for (const m of outsideData.matchAll(/\bt\s*:\s*['"]([^'"]+)['"]/g)) {
  inScene.add(m[1]);
}
// regSub(mesh,'TAG') — привязка тега к детали, построенной внутри родителя
// (патронный фильтр и насос ВД на раме обратного осмоса). Скобки в аргументах
// вложенные, поэтому ищем парную закрывающую скобку, а тег берём последним.
for (let i = outsideData.indexOf('regSub('); i >= 0; i = outsideData.indexOf('regSub(', i + 1)) {
  let depth = 0;
  let end = -1;
  for (let k = i + 'regSub'.length; k < outsideData.length; k++) {
    const c = outsideData[k];
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) { end = k; break; }
    }
  }
  if (end < 0) continue;
  const args = outsideData.slice(i, end);
  const tail = args.match(/,\s*['"]([^'"]+)['"]\s*$/);
  if (tail) inScene.add(tail[1]);
}

const rows = [];
for (const e of DATA.eq) {
  const tag = e.t;
  const desc = Array.isArray(e.d) ? e.d : [];
  const untranslated = desc.filter((line) => line && !EQ_UZ[line]);
  rows.push({
    tag,
    section: e.s,
    name: e.n || '',
    imgs: (IMGS[tag] || []).length,
    descLines: desc.length,
    untranslated: untranslated.length,
    untranslatedList: untranslated,
    // m:true — аппарат есть в 3D-модели; при false карточка помечается «не показан в 3D»
    notIn3d: !inScene.has(tag),
    badSection: !sections.has(e.s),
    noWeight: !String(e.w || '').trim(),
    noQty: !String(e.q || '').trim(),
    noNameUz: !String(e.nu || '').trim(),
    inReg: regTags.has(tag),
  });
}

const total = rows.length;
const stat = {
  'не показан в 3D': rows.filter((r) => r.notIn3d),
  'нет фото/чертежей': rows.filter((r) => r.imgs === 0),
  'нет описания': rows.filter((r) => r.descLines === 0),
  'описание без перевода': rows.filter((r) => r.untranslated > 0),
  'название без перевода': rows.filter((r) => r.noNameUz),
  'раздел не из DATA.sections': rows.filter((r) => r.badSection),
  'не указан вес (справочно)': rows.filter((r) => r.noWeight),
  'не указано количество': rows.filter((r) => r.noQty),
  'нет в регламенте (справочно)': rows.filter((r) => !r.inReg),
};

const pct = (n) => ((n / total) * 100).toFixed(0) + '%';

console.log('Аппаратов в DATA.eq: ' + total + ', разделов: ' + sections.size +
  ', тегов с фото/чертежами: ' + Object.keys(IMGS).length);
console.log('');
for (const [name, list] of Object.entries(stat)) {
  console.log('  ' + name.padEnd(28) + String(list.length).padStart(4) + '  (' + pct(list.length) + ')');
}

// разрезы по отделениям
const bySection = {};
for (const r of rows) {
  const s = r.section;
  const v = bySection[s] || (bySection[s] = { total: 0, noImgs: 0, noDesc: 0, notIn3d: 0 });
  v.total++;
  if (!r.imgs) v.noImgs++;
  if (!r.descLines) v.noDesc++;
  if (r.notIn3d) v.notIn3d++;
}
console.log('\nпо отделениям (всего / не в 3D / без фото / без описания):');
for (const [s, v] of Object.entries(bySection).sort((a, b) => b[1].total - a[1].total)) {
  const title = (DATA.sections[s] && DATA.sections[s].code) || s;
  console.log('  ' + String(title).padEnd(10) + String(v.total).padStart(4) +
    String(v.notIn3d).padStart(7) + String(v.noImgs).padStart(10) + String(v.noDesc).padStart(14));
}

// --- отчёт -------------------------------------------------------------
if (WRITE_REPORT) {
  const list = (arr, fmt) => arr.map(fmt).join('\n');
  const md = [];
  md.push('# Полнота данных 3D-модели');
  md.push('');
  md.push('Сгенерировано `node tools/audit-model.js`. Не редактировать вручную.');
  md.push('');
  md.push('Аппаратов в перечне: **' + total + '**, тегов с фото/чертежами: **' +
    Object.keys(IMGS).length + '**.');
  md.push('');
  md.push('| Чего не хватает | Сколько | Доля |');
  md.push('|---|---|---|');
  for (const [name, l] of Object.entries(stat)) {
    md.push('| ' + name + ' | ' + l.length + ' | ' + pct(l.length) + ' |');
  }
  md.push('');
  md.push('## По отделениям');
  md.push('');
  md.push('| Отделение | Всего | Не в 3D | Без фото | Без описания |');
  md.push('|---|---|---|---|---|');
  for (const [s, v] of Object.entries(bySection).sort((a, b) => b[1].total - a[1].total)) {
    const title = (DATA.sections[s] && DATA.sections[s].code) || s;
    md.push('| ' + title + ' | ' + v.total + ' | ' + v.notIn3d + ' | ' + v.noImgs + ' | ' + v.noDesc + ' |');
  }
  for (const [name, l] of Object.entries(stat)) {
    if (!l.length) continue;
    md.push('');
    md.push('## ' + name + ' (' + l.length + ')');
    md.push('');
    md.push(list(l, (r) => '- `' + r.tag + '` — ' + (r.name || '(без названия)') + ' [' + r.section + ']'));
  }
  fs.mkdirSync(path.dirname(REPORT), { recursive: true });
  fs.writeFileSync(REPORT, md.join('\n') + '\n', 'utf8');
  console.log('\nотчёт: ' + path.relative(ROOT, REPORT));
}
