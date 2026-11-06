'use strict';
// Оборачиваем в IIFE: файл подключается и как модуль Node, и как
// обычный <script>, а классические скрипты делят глобальную область.
(function () {
/*
 * Связь блокировок с расчётом (шаг 4).
 *
 * Блокировка, которая просто загорается красным и не меняет баланс, — декорация.
 * Здесь её следствия переводятся в ограничения модели. Переход только там, где
 * физика очевидна:
 *
 *   BO-11301 остановлена   → воздуха нет, горения нет: кислота 0, выброс 0
 *   PP-11302 остановлен    → нет орошения 1-й абсорбции: SO3 уходит во 2-ю
 *   PP-11303 остановлен    → нет орошения 2-й абсорбции: SO3 уносится в трубу
 *
 * Остальное (сушильная башня PP-11301, клапаны, сигнализация) в модели не
 * описано — такие следствия помечаются «не смоделировано» и не влияют на цифры,
 * чтобы не выдавать выдумку за расчёт.
 */

// В Node — require, в браузере model.js подключён отдельным <script>.
const solve = (typeof module !== 'undefined' && module.exports)
  ? require('./model.js').solve
  : self.TwinModel.solve;

// что делает каждое следствие с моделью
const EFFECTS = {
  'BO-11301': { stop: 'noCombustion', start: null },
  'YSS-BO-11301': { stop: 'noCombustion' },
  'PP-11302': { stop: 'noAbsorb1' },
  'PP-11303': { stop: 'noAbsorb2' },
  'PP-11301': { stop: null, note: 'сушка газа: в модели не описана' },
};

/** Вычислитель отдаёт следствия группами по блокировке; приводим к плоскому списку. */
function flatten(list) {
  const out = [];
  for (const x of list || []) {
    if (x && Array.isArray(x.effects)) out.push(...x.effects);
    else if (x && x.tag) out.push(x);
  }
  return out;
}

/**
 * @param {Array} effects следствия из вычислителя блокировок (плоские или группами)
 * @returns {{noCombustion:boolean,noAbsorb1:boolean,noAbsorb2:boolean,notes:Array}}
 */
function constraints(effects) {
  const c = { noCombustion: false, noAbsorb1: false, noAbsorb2: false, notes: [], tags: [] };
  for (const e of flatten(effects)) {
    const rule = EFFECTS[e.tag];
    if (!rule) continue;
    const key = rule[e.action];
    if (key === 'noCombustion') c.noCombustion = true;
    else if (key === 'noAbsorb1') c.noAbsorb1 = true;
    else if (key === 'noAbsorb2') c.noAbsorb2 = true;
    c.tags.push(e.tag);
    c.notes.push({
      tag: e.tag,
      action: e.action,
      modelled: !!key,
      text: rule.note || (key
        ? (key === 'noCombustion' ? 'горение прекращено' : key === 'noAbsorb1' ? 'орошение 1-й абсорбции снято' : 'орошение 2-й абсорбции снято')
        : 'влияние не смоделировано'),
    });
  }
  return c;
}

/** Модель остановленного горения: цифры честные нули, а не «примерно». */
function stopped(controls) {
  const load = (controls && controls.load) || 1;
  return {
    stopped: true,
    load,
    sulfur_t_h: 0,
    gas: { so2_burner_nm3: 0, so3_burner_nm3: 0, o2_burner_nm3: 0, o2_dry_pct: 0, so2_dry_pct: 0 },
    stages: [],
    stack: { so2_nm3: 0, so2_mg: 0, so3_nm3: 0, so3_mg: 0, wet_nm3: 0, o2_pct: 0 },
    acid: { h2so4_100_t_h: 0, product_t_h: 0, product_t_day: 0, conc: (controls && controls.acid_conc) || 98.5, so3_to_acid1_kmol: 0, so3_to_acid2_kmol: 0 },
    conversion: 0,
    limits: { stack_ok: true, conversion_ok: false, load_ok: false },
  };
}

/**
 * Расчёт с учётом ограничений от блокировок.
 * @param {object} controls управления вкладки
 * @param {object} cons результат constraints()
 */
function run(controls, cons) {
  if (cons && cons.noCombustion) return stopped(controls);
  const c = Object.assign({}, controls);
  if (cons && cons.noAbsorb1) c.absorb1 = 0;
  if (cons && cons.noAbsorb2) c.absorb2 = 0;
  return solve(c);
}

const API = { constraints, run, stopped, EFFECTS };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinApply = API;
})();
