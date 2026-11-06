'use strict';
/*
 * Вычислитель блокировок: условие → связка → латч → действие.
 *
 * Правила взяты из interlocks-data.js и схем АСУТП (там видны элементы AND/OR,
 * триггер S/R и кнопки BYPASS / AM / RESET):
 *
 *  - условие аналоговое (сигнал OP уставка) или качественное («остановлена»);
 *  - причины объединяются связкой or / and / 2oo3;
 *  - запись с кнопкой сброса держится (латч) до RESET, без кнопки — самовозврат;
 *  - BYPASS отключает запись целиком, пока включён;
 *  - если сигнала нет или уставка в исходнике закрыта (**, ※) — статус unknown,
 *    а не «в норме»: иначе щит показывал бы спокойствие там, где не знает.
 */

// В Node — require, в браузере state.js подключён отдельным <script> раньше.
const expandTag = (typeof module !== 'undefined' && module.exports)
  ? require('./state.js').expandTag
  : (self.TwinState ? self.TwinState.expandTag : (t) => [t]);

const OPS = {
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  '=': (a, b) => Math.abs(a - b) < 1e-9,
};

// «остановлена», «отключён», «закрыт» — условие выполнено, когда сигнала нет
const NEGATIVE = /остановлен|остановлена|отключ|закрыт|не\s+в\s+работе/i;
// «в норме», «готова», «выполнено» — выполнено, когда сигнал есть
const POSITIVE = /в\s+норме|готова|готов\s|выполнено|в\s+положении|запущен|работает/i;

function cmpValue(op, a, b) {
  const fn = OPS[op];
  if (!fn) return null;
  return fn(a, b);
}

/** Проверка одной причины. Возвращает {ok, why, unknown}. */
function checkCause(cause, state) {
  const cond = cause.cond || {};
  if (cond.setpointUnknown) {
    return { ok: null, unknown: true, why: 'уставка в исходнике закрыта: ' + cond.text };
  }
  const tags = expandTag(cause.tag);
  const values = tags.map((t) => state[t]);
  const missing = tags.filter((t, i) => values[i] === undefined);
  if (missing.length === tags.length) {
    return { ok: null, unknown: true, why: 'нет сигнала ' + tags.join(', ') };
  }

  if (cond.type === 'analog') {
    const hit = tags.map((t, i) => {
      const v = values[i];
      if (v === undefined) return null;
      return cmpValue(cond.op, Number(v), cond.value);
    });
    const known = hit.filter((h) => h !== null);
    if (!known.length) return { ok: null, unknown: true, why: 'нет числового сигнала ' + tags.join(', ') };
    // голосование «2 из 3» — внутри одной причины по группе датчиков
    if (cond.voting) {
      const need = cond.voting.k;
      const yes = known.filter(Boolean).length;
      return {
        ok: yes >= need,
        unknown: known.length < cond.voting.n,
        why: `${yes} из ${known.length} ${cond.op} ${cond.value} ${cond.unit || ''}`.trim(),
      };
    }
    return { ok: known.some(Boolean), unknown: false, why: `${cond.op} ${cond.value} ${cond.unit || ''}`.trim() };
  }

  // качественное условие
  const txt = String(cond.text || '');
  const want = NEGATIVE.test(txt) ? false : POSITIVE.test(txt) ? true : true;
  const hits = values.map((v) => (typeof v === 'boolean' ? v === want : Boolean(v) === want));
  return { ok: hits.some(Boolean), unknown: false, why: txt || 'состояние' };
}

/** Объединение причин связкой. */
function combine(join, results) {
  // В исходнике «2 из 3» бывает записано и в связке, и внутри условия
  // («2 из 3 выше 150 мм» при одной причине-группе). Если причина одна,
  // связка ничего не решает: голосование уже учтено в самой причине.
  if (results.length === 1) return { ok: results[0].ok, unknown: results[0].unknown };
  const known = results.filter((r) => r.ok !== null);
  const yes = known.filter((r) => r.ok).length;
  if (!known.length) return { ok: null, unknown: true };
  if (join === 'and') return { ok: yes === results.length, unknown: known.length < results.length };
  if (join === '2oo3') return { ok: yes >= 2, unknown: known.length < 3 };
  return { ok: yes > 0, unknown: false };  // or
}

function makeMemory() {
  return { latched: {}, bypassed: {}, manual: {} };
}

/**
 * @param {object} data twin/interlocks.data.js
 * @param {object} state сигналы
 * @param {object} mem память между вызовами (латчи, bypass)
 * @param {object} [opts] { honourBypass: true }
 */
function evaluate(data, state, mem, opts) {
  mem = mem || makeMemory();
  const honourBypass = !(opts && opts.honourBypass === false);
  const out = [];
  const effects = [];

  for (const it of data.items) {
    if (honourBypass && (mem.bypassed[it.id] || mem.manual[it.id] === 'bypass')) {
      out.push({ id: it.id, title: it.title, kind: it.kind, sheet: it.sheet, join: it.join, status: 'bypassed', fired: false, reset: !!it.reset, causes: [], effects: [], detail: 'отключена оператором (BYPASS)' });
      continue;
    }

    const causes = it.causes.map((c) => Object.assign({ tag: c.tag, text: c.cond.text }, checkCause(c, state)));
    const comb = combine(it.join, causes);

    let status;
    let fired = false;
    if (comb.ok === null) {
      status = 'unknown';
    } else if (comb.ok) {
      fired = true;
      if (it.reset) {
        mem.latched[it.id] = true;
        status = 'latched';
      } else {
        status = 'active';
      }
    } else if (mem.latched[it.id]) {
      status = 'latched';
      fired = true;                       // держится до сброса
    } else {
      status = 'idle';
    }

    const eff = fired ? it.effects.map((e) => ({ tag: e.tag, action: e.action, text: e.text })) : [];
    if (eff.length) effects.push({ id: it.id, title: it.title, kind: it.kind, effects: eff });

    out.push({ id: it.id, title: it.title, kind: it.kind, sheet: it.sheet, join: it.join, status, fired, reset: !!it.reset, causes, effects: eff });
  }

  return {
    list: out,
    effects,
    counts: {
      active: out.filter((x) => x.status === 'active').length,
      latched: out.filter((x) => x.status === 'latched').length,
      bypassed: out.filter((x) => x.status === 'bypassed').length,
      unknown: out.filter((x) => x.status === 'unknown').length,
      idle: out.filter((x) => x.status === 'idle').length,
      total: out.length,
    },
  };
}

/** Сброс латча (кнопка RESET на щите). */
function reset(mem, id) {
  if (id) delete mem.latched[id];
  else mem.latched = {};
  return mem;
}

/** Включение/снятие BYPASS. */
function bypass(mem, id, on) {
  if (on) mem.bypassed[id] = true;
  else delete mem.bypassed[id];
  return mem;
}

const API = { evaluate, checkCause, combine, makeMemory, reset, bypass };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinLogic = API;
