'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Уровни по аппаратам.
 *
 * Три категории:
 *
 *   calc   — уровень считается моделью (есть приход и расход): чаны фильтрации
 *            получают расплав и отдают его на горелку.
 *   manual — прибор и уставки есть (таблица DCS), но модели прихода/расхода нет:
 *            уровень задаёт оператор, блокировка при этом работает по-настоящему.
 *   none   — нет ни модели, ни уставок: показываем честно, что сигнала нет.
 *
 * Уставки (LL/L/H/HH) берутся из таблицы мониторинга DCS, а не придумываются.
 */

const SIG = (typeof module !== 'undefined' && module.exports)
  ? require('./dcs-signals.data.js')
  : self.TWIN_SIGNALS;

const TANK = (typeof module !== 'undefined' && module.exports)
  ? require('./tank.js')
  : self.TwinTank;

// Аппараты с моделью потоков. Площадь зеркала — параметр (в документах её нет),
// выбран по типовым размерам чана; уставки придут из DCS.
const CALC = [
  { tag: 'LT-11101', area: 5, init: 1500, name: { ru: 'Чан фильтрации 1-й ступени', uz: '1-bosqich filtr chani' } },
  { tag: 'LT-11102', area: 5, init: 1500, name: { ru: 'Промежуточный чан фильтрации', uz: 'Oraliq filtr chani' } },
  { tag: 'LT-11103', area: 5, init: 1500, name: { ru: 'Чан фильтрации 2-й ступени', uz: '2-bosqich filtr chani' } },
  { tag: 'LT-11104', area: 5, init: 1500, name: { ru: 'Бак жидкой серы', uz: 'Suyuq oltingugurt baki' } },
];

// Аппараты, где модель потоков не построена: уровень задаётся вручную.
const MANUAL = [
  { tag: 'LT-11105', init: 1200, name: { ru: 'Конденсатный бак', uz: 'Kondensat baki' } },
  { tag: 'LT-11106', init: 1600, name: { ru: 'Бак кислотной воды', uz: 'Kislotali suv baki' } },
  { tag: 'LT-11301', init: 1500, name: { ru: 'Комбинированный кислотный жёлоб', uz: 'Kombinatsiyalangan kislota novi' } },
  { tag: 'LT-11302', init: 1000, name: { ru: 'Сборник кислоты', uz: 'Kislota yig‘gichi' } },
  { tag: 'LT-11303', init: 1000, name: { ru: 'Бак продукта', uz: 'Mahsulot baki' } },
  { tag: 'LT-12202', init: 1000, name: { ru: 'Резервуар жидкой серы', uz: 'Suyuq oltingugurt rezervuari' } },
  { tag: 'LT-12203', init: 1000, name: { ru: 'Резервуар жидкой серы', uz: 'Suyuq oltingugurt rezervuari' } },
  { tag: 'LT-12201A', init: 6000, name: { ru: 'Резервуар жидкой серы (склад)', uz: 'Suyuq oltingugurt rezervuari (ombor)' } },
  { tag: 'LT-12201B', init: 6000, name: { ru: 'Резервуар жидкой серы (склад), дубль', uz: 'Suyuq oltingugurt rezervuari (ombor), zaxira' } },
  { tag: 'LT-114.151A,B', init: 800, name: { ru: 'Деаэраторная ёмкость', uz: 'Deaеratsiya sig‘imi' } },
  { tag: 'LT-11401A~C', init: 0, name: { ru: 'Барабан котла-утилизатора', uz: 'Utilizator qozoni barabani' } },
  { tag: 'LT-13101', init: 2000, name: { ru: 'Резервуар исходной воды', uz: 'Boshlang‘ich suv rezervuari' } },
  { tag: 'LT-13301', init: 1500, name: { ru: 'Бассейн циркуляционной воды', uz: 'Aylanma suv basseyni' } },
  { tag: 'LT-13401', init: 1500, name: { ru: 'Бассейн воды генератора', uz: 'Generator suv basseyni' } },
];

function spOf(tag) {
  const r = SIG && SIG.signals ? SIG.signals[tag] : null;
  if (!r) return { LL: null, L: null, H: null, HH: null, unit: 'мм', range: null };
  return { LL: r.LL, L: r.L, H: r.H, HH: r.HH, unit: r.unit || 'мм', range: r.range };
}

/** Состояние уровня по уставкам. */
function status(level, sp) {
  if (level == null) return 'none';
  if (sp.LL != null && level <= sp.LL) return 'low';
  if (sp.HH != null && level >= sp.HH) return 'high-high';
  if (sp.H != null && level >= sp.H) return 'high';
  if (sp.L != null && level <= sp.L) return 'low';
  return 'normal';
}

const state = {};
CALC.forEach((t) => { state[t.tag] = t.init; });
MANUAL.forEach((t) => { state[t.tag] = t.init; });

/**
 * Список аппаратов для панели.
 * @param {object} flows {melt_t_h, burn_t_h}
 * @param {string} lang 'ru' | 'uz'
 */
function list(flows, lang) {
  const out = [];
  for (const t of CALC) {
    const sp = spOf(t.tag);
    out.push({
      tag: t.tag,
      name: (t.name[lang] || t.name.ru),
      level: state[t.tag],
      mode: 'calc',
      sp,
      status: status(state[t.tag], sp),
    });
  }
  for (const t of MANUAL) {
    const sp = spOf(t.tag);
    out.push({
      tag: t.tag,
      name: (t.name[lang] || t.name.ru),
      level: state[t.tag],
      mode: 'manual',
      sp,
      status: status(state[t.tag], sp),
    });
  }
  return out;
}

/** Продвинуть уровни на dt минут. Считаются только аппараты с моделью потоков. */
function advance(flows, dt_min) {
  const inT = flows.melt_t_h || 0;
  const outT = flows.burn_t_h || 0;
  for (const t of CALC) {
    const sp = spOf(t.tag);
    const r = TANK.step({ level: state[t.tag], area_m2: t.area, LL: sp.LL, H: sp.H, HH: sp.HH },
      { qIn_t_h: inT, qOut_t_h: outT }, dt_min);
    state[t.tag] = r.level;
  }
  return list(flows, 'ru');
}

function setLevel(tag, value) {
  state[tag] = Math.max(0, value);
}

/** Значения уровней для вычислителя блокировок: и LT-, и LIAS-теги. */
function forState() {
  const m = {};
  for (const [tag, v] of Object.entries(state)) {
    m[tag] = v;
    // Логические метки блокировок: LIAS-11101 ← LT-11101,
    // LIAS-11401A ← LT-11401A~C, LIAS-114.151B ← LT-114.151A,B
    const p = tag.match(/^[A-Z]+-?([\d.]+)([A-Z~,/]*)/);
    if (!p) continue;
    const num = p[1].replace(/\.$/, '');
    m['LIAS-' + num] = v;
    const letters = new Set();
    for (const part of String(p[2] || '').split(',')) {
      const rng = part.match(/^([A-Z])~([A-Z])$/);
      if (rng) {
        for (let c = rng[1].charCodeAt(0); c <= rng[2].charCodeAt(0); c++) letters.add(String.fromCharCode(c));
      } else {
        for (const ch of part) if (/[A-Z]/.test(ch)) letters.add(ch);
      }
    }
    for (const l of letters) m['LIAS-' + num + l] = v;
    // и полевые метки по буквам: LT-11401A/B/C раскрывается в A, B, C
    for (const l of letters) m['LT-' + num + l] = v;
  }
  return m;
}

const API = { list, advance, setLevel, forState, status, state, CALC, MANUAL };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinVessels = API;
})();
