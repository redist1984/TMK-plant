'use strict';
/*
 * Генератор twin/interlocks.data.js: берёт interlocks-data.js (там 42 записи
 * для вкладки «Блокировки») и раскладывает условия на машинные поля.
 *
 *   node twin/gen-interlocks.js
 *
 * Условия в исходнике записаны по-разному: «< 500 мм», «2 из 3 ≥ ** мм»,
 * «остановлена». Поэтому разбор терпимый: где видно сравнение с числом и
 * единицей — получаем аналоговое условие; где нет — качественное, с исходным
 * текстом. Уставки, закрытые в исходнике как ** или *, помечаются как
 * неизвестные: подставлять вместо них числа было бы выдумкой.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'interlocks.data.js');

const src = fs.readFileSync(path.join(ROOT, 'interlocks-data.js'), 'utf8');
const win = {};
const sandbox = { window: win, console };
win.window = win;
vm.createContext(sandbox);
new vm.Script(src, { filename: 'interlocks-data.js' }).runInContext(sandbox);
const ILK = win.ILK;

// единицы, которые встречаются в условиях
const UNITS = ['мкСм/см', 'мм/с', 'м³/ч', '°C', '°С', 'МПа', 'кПа', 'мкм', 'мм', '%'];

function parseCond(text) {
  const raw = String(text || '').trim();
  let body = raw;
  // «2 из 3 ≥ ** мм», «2 из 3 выше 150 мм» — голосование по трём датчикам
  let voting = null;
  const vm3 = body.match(/^(\d)\s*из\s*(\d)\s+(.*)$/);
  if (vm3) {
    voting = { k: +vm3[1], n: +vm3[2] };
    body = vm3[3].trim();
  }
  // словесные сравнения → операторы
  const WORDS = [
    [/^не\s+более\s+/, '<='],
    [/^не\s+менее\s+/, '>='],
    [/^выше\s+/, '>'],
    [/^ниже\s+/, '<'],
    [/^более\s+/, '>'],
    [/^менее\s+/, '<'],
  ];
  for (const [re, op] of WORDS) {
    if (re.test(body)) { body = body.replace(re, ''); body = op + ' ' + body; break; }
  }
  // сравнение с числом: «< 500 мм», «>= 0,3 мкСм/см», «упало до 850 кПа»
  const m = body.match(/^(?:упало до\s*)?([<>≤≥]=?)?\s*([\d]+(?:[.,]\d+)?)\s*([^\s:]*)?/);
  if (m && m[2] && m[2].length) {
    const opMap = { '<': '<', '≤': '<=', '>': '>', '≥': '>=' };
    let op = m[1] ? (opMap[m[1]] || m[1]) : '=';
    const unit = m[3] && UNITS.includes(m[3]) ? m[3] : null;
    if (op === '=' && /упало до/.test(body)) op = '<=';
    return { type: 'analog', op, value: parseFloat(m[2].replace(',', '.')), unit, setpointUnknown: false, voting, text: raw };
  }
  // числовое сравнение с закрытой уставкой: «> ** МПа», «≥ ※ или < ※»
  if (/[<>≤≥]/.test(body) && /[*＊※]/.test(body)) {
    return { type: 'analog', op: null, value: null, unit: null, setpointUnknown: true, voting, text: raw };
  }
  // остальное — качественное: «остановлена», «полностью закрыт», «в норме»
  return { type: 'discrete', op: null, value: null, unit: null, setpointUnknown: false, voting, text: raw };
}

const items = ILK.items.map((it) => ({
  id: it.id,
  sheet: it.sh,
  title: it.t,
  kind: it.k,                    // stop | trip | valve | start | alarm | info
  join: it.j || 'or',            // or | and | 2oo3
  causes: (it.c || []).map((c) => ({
    tag: c[0],
    text: c[1],
    cond: parseCond(c[2]),
  })),
  effects: (it.e || []).map((e) => ({ tag: e[0], text: e[1], action: e[2] })),
  bypass: it.by || null,
  reset: it.rs ? (it.rst || 'RESET') : null,
  manual: it.man || null,
  applied: it.ea || [],
  equip: it.eq || [],
  plain: it.p || '',
  note: it.n || '',
  verify: !!it.v,
}));

const out = [
  '/* Сгенерировано node twin/gen-interlocks.js — не править вручную. */',
  '(function (root) {',
  '  var D = ' + JSON.stringify({ source: 'interlocks-data.js', count: items.length, items }, null, 1) + ';',
  "  if (typeof module !== 'undefined' && module.exports) module.exports = D;",
  '  else root.TWIN_ILK = D;',
  "})(typeof self !== 'undefined' ? self : this);",
  '',
].join('\n');

fs.writeFileSync(OUT, out, 'utf8');

const analog = items.reduce((n, i) => n + i.causes.filter((c) => c.cond.type === 'analog').length, 0);
const unknownSp = items.reduce((n, i) => n + i.causes.filter((c) => c.cond.setpointUnknown).length, 0);
const discrete = items.reduce((n, i) => n + i.causes.filter((c) => c.cond.type === 'discrete').length, 0);
console.log('записей:', items.length, '| условий: аналоговых', analog, '(из них с закрытой уставкой', unknownSp + ')', '| качественных', discrete);
console.log('файл:', OUT);
