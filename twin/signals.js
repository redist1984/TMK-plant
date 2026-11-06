'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Уставки из таблицы мониторинга DCS.
 *
 * В схемах блокировок часть уставок закрыта (`> ** °C`, `≥ ※ мм`). Настоящие
 * значения нашлись в «Таблице мониторинга данных DCS» (3147-5N100-03): там по
 * каждому прибору есть диапазон и уставки HH / H / L / LL.
 *
 * Теги двух документов записаны по-разному: в блокировках это логические метки
 * (`LIAS-11101`, `VT-PP-11301`, `TIAS-11350~51`), в таблице — полевые приборы
 * (`LT-11101`, `TE-11301`). Сопоставляем по типу прибора и номеру позиции:
 * LIAS/LIA/LT/LS → LT, TIAS/TIA/TE/TI → TE и так далее.
 *
 * Проверка на реальном совпадении: блокировка I-101 требует «< 500 мм», а
 * LT-11101 в таблице DCS имеет LL = 500 мм. Значения сошлись из двух
 * независимых документов.
 */

const DATA = (typeof module !== 'undefined' && module.exports)
  ? require('./dcs-signals.data.js')
  : self.TWIN_SIGNALS;

// логическая метка → тип полевого прибора
const TYPE = {
  LIAS: 'LT', LIA: 'LT', LS: 'LT', LT: 'LT',
  TIAS: 'TE', TIA: 'TE', TG: 'TG', TE: 'TE', TI: 'TE',
  PIAS: 'PT', PIS: 'PT', PIA: 'PT', PT: 'PT', PI: 'PT',
  FIAS: 'FT', FIA: 'FT', FT: 'FT', FI: 'FT',
  AIA: 'AT', AT: 'AT',
  VT: 'VT', SC: 'SC', SI: 'SI',
};

/** Разбор тега: тип, номер, буквенный суффикс. */
function parseTag(tag) {
  const s = String(tag || '').trim();
  // «TE-PP11301»: между типом и номером бывает вставка (PP — насос), её пропускаем
  const m = s.match(/^([A-Z]{1,5})[\s-]*(?:[A-Z]{0,3}[\s-]*)?([\d.]+)\s*([A-Z/~,]*)/);
  if (!m) return null;
  const rawType = m[1];
  let type = null;
  // берём самый длинный известный префикс
  for (const k of Object.keys(TYPE).sort((a, b) => b.length - a.length)) {
    if (rawType.startsWith(k)) { type = TYPE[k]; break; }
  }
  return { type, number: m[2].replace(/\.$/, ''), suffix: m[3] || '' };
}

/** Буквы из суффикса: «A~C» → [A,B,C], «A/B/C» → [A,B,C], «B» → [B]. */
function suffixLetters(sfx) {
  if (!sfx) return [];
  const out = new Set();
  for (const part of String(sfx).split('/')) {
    const m = part.match(/^([A-Z])~([A-Z])$/);
    if (m) {
      for (let c = m[1].charCodeAt(0); c <= m[2].charCodeAt(0); c++) out.add(String.fromCharCode(c));
    } else {
      for (const ch of part) if (/[A-Z]/.test(ch)) out.add(ch);
    }
  }
  return [...out];
}

const INDEX = new Map();   // "LT:11101" → [{tag, rec}]
for (const [tag, rec] of Object.entries(DATA.signals)) {
  const p = parseTag(tag);
  if (!p || !p.type) continue;
  const key = p.type + ':' + p.number;
  if (!INDEX.has(key)) INDEX.set(key, []);
  INDEX.get(key).push({ tag, rec, letters: suffixLetters(p.suffix) });
}

/** Найти полевой прибор по логической метке блокировки. */
function find(tag) {
  const p = parseTag(tag);
  if (!p || !p.type) return null;
  const list = INDEX.get(p.type + ':' + p.number);
  if (!list || !list.length) return null;
  const want = suffixLetters(p.suffix);
  if (want.length) {
    const exact = list.find((x) => want.every((l) => x.letters.includes(l)));
    if (exact) return { tag: exact.tag, rec: exact.rec, exact: true };
  }
  return { tag: list[0].tag, rec: list[0].rec, exact: want.length === 0 };
}

const NEG = /^[<>≤≥]=?/;

/**
 * Подобрать уставку под направление условия.
 * @param {object} rec запись прибора из таблицы DCS
 * @param {string} op оператор условия: '<', '<=', '>', '>='
 */
function pick(rec, op) {
  if (!rec) return null;
  if (op === '<' || op === '<=') {
    if (rec.LL != null) return { value: rec.LL, which: 'LL' };
    if (rec.L != null) return { value: rec.L, which: 'L' };
  }
  if (op === '>' || op === '>=') {
    if (rec.HH != null) return { value: rec.HH, which: 'HH' };
    if (rec.H != null) return { value: rec.H, which: 'H' };
  }
  if (rec.sp != null) return { value: rec.sp, which: 'SP' };
  return null;
}

/**
 * Уставка для условия блокировки.
 * @returns {{op:string, value:number, unit:string, which:string, tag:string}|null}
 */
function setpoint(cond, tag) {
  if (!cond) return null;
  const opMatch = String(cond.text || '').match(NEG);
  const op = (cond.op && cond.op !== '=' ? cond.op : (opMatch ? opMatch[0].replace('≤', '<=').replace('≥', '>=') : null));
  if (!op || op === '=') return null;
  const found = find(tag);
  if (!found) return null;
  const p = pick(found.rec, op);
  if (!p) return null;
  return { op, value: p.value, unit: found.rec.unit || '', which: p.which, tag: found.tag };
}

/** Сколько условий блокировок можно закрыть данными DCS (для отчёта). */
function stats(items) {
  let total = 0, found = 0, withSp = 0;
  for (const it of items) {
    for (const c of it.causes) {
      total++;
      const f = find(c.tag);
      if (f) {
        found++;
        if (f.rec.HH != null || f.rec.H != null || f.rec.L != null || f.rec.LL != null) withSp++;
      }
    }
  }
  return { total, found, withSp };
}

const API = { find, setpoint, pick, parseTag, suffixLetters, stats, DATA };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinSignals = API;
})();
