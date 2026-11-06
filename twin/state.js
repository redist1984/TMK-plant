'use strict';
// Оборачиваем в IIFE: файл подключается и как модуль Node, и как
// обычный <script>, а классические скрипты делят глобальную область.
(function () {
/*
 * Состояние процесса для проверки блокировок.
 *
 * Блокировка сравнивает сигнал с уставкой. Двойник знает не всё: он считает
 * материальный баланс, но не уровни в баках, не давление масла и не состояние
 * каждой задвижки. Поэтому здесь два списка: что подставляется из модели и что
 * задаётся вручную. Всё остальное честно помечается «нет сигнала» — и
 * блокировка на таком сигнале получает статус unknown, а не «в норме».
 */

/** Раскрывает групповой тег «LIAS-11401A/B/C» в список одиночных. */
function expandTag(tag) {
  const m = String(tag).match(/^(.*?)([A-Z])(?:\/([A-Z]))+$/);
  if (!m) return [tag];
  const head = m[1];
  const letters = String(tag).slice(head.length).split('/');
  return letters.map((l) => head + l);
}

/**
 * @param {object} m результат TwinModel.solve()
 * @param {object} [extra] ручные сигналы: { 'PP-11302': false, 'LIAS-11401A': 120, ... }
 * @returns {object} состояние: тег → число или булево
 */
function build(m, extra) {
  const st = {};
  const running = !!(m && !m.error && m.acid && m.acid.product_t_h > 0);

  // Насосы кислоты работают, пока идёт выработка: без циркуляции абсорбция
  // невозможна, а модель считает именно работающий режим.
  ['PP-11301', 'PP-11302', 'PP-11303'].forEach((t) => { st[t] = running; });
  ['PP-11301A', 'PP-11301B', 'PP-11302A', 'PP-11302B', 'PP-11303A', 'PP-11303B'].forEach((t) => { st[t] = running; });

  // Воздуходувка: работает, пока есть воздух на горение
  st['BO-11301'] = !!(m && !m.error && m.gas && m.gas.o2_burner_nm3 > 0);
  st['VT-BO-11301 / TE-BO-11301'] = st['BO-11301'];

  // Серу подаём, пока есть расход
  st['YL-BO-11301'] = !!(m && !m.error && m.sulfur_t_h > 0);
  st['YL-PP-11301'] = st['YL-BO-11301'];
  st['YL-PP-11303'] = st['YL-BO-11301'];

  Object.assign(st, extra || {});
  return st;
}

/**
 * Какие теги нужны блокировкам и чего в состоянии не хватает.
 * @returns {{needed: string[], missing: string[]}}
 */
function coverage(data, state) {
  const needed = new Set();
  for (const it of data.items) {
    for (const c of it.causes) expandTag(c.tag).forEach((t) => needed.add(t));
  }
  const missing = [...needed].filter((t) => state[t] === undefined);
  return { needed: [...needed], missing };
}

const API = { build, expandTag, coverage };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinState = API;
})();
