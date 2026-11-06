'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Температуры газа из теплового расчёта, а не из проекта.
 *
 * Основа — энтальпия компонентов газа: h(T) = ∫cp dT по табличным значениям
 * теплоёмкости (J/моль·K). Таблицы взяты для N2, O2, SO2, SO3, H2O(г) в
 * диапазоне 300…1500 K с шагом 200 K и интегрируются трапециями. Это грубее
 * полиномов NASA, но прозрачно: любую точку можно проверить руками.
 *
 * Теплосъём аппаратов (котёл-утилизатор, перегреватели, экономайзеры) задан
 * по проекту и масштабируется расходом газа — то есть «сколько тепла снимает
 * аппарат» берётся из баланса, а «какая получится температура» считается.
 */

const R = 8.314;

// cp, J/(моль·K)
const CP = {
  N2:   [29.1, 29.6, 30.7, 32.1, 33.4, 34.5, 35.4],
  O2:   [29.4, 30.1, 31.5, 33.0, 34.3, 35.4, 36.3],
  SO2:  [39.9, 43.4, 46.5, 49.1, 51.2, 52.9, 54.3],
  SO3:  [50.6, 56.0, 60.5, 64.2, 67.3, 69.9, 72.0],
  H2O:  [33.6, 34.3, 35.5, 37.0, 38.6, 40.2, 41.6],
};
const T_GRID = [300, 500, 700, 900, 1100, 1300, 1500];

const clampT = (T) => Math.min(T_GRID[T_GRID.length - 1], Math.max(T_GRID[0], T));

/** cp компонента при температуре T (K), линейная интерполяция по таблице. */
function cp(comp, T) {
  const tab = CP[comp];
  if (!tab) return 0;
  const t = clampT(T);
  for (let i = 1; i < T_GRID.length; i++) {
    if (t <= T_GRID[i]) {
      const f = (t - T_GRID[i - 1]) / (T_GRID[i] - T_GRID[i - 1]);
      return tab[i - 1] + f * (tab[i] - tab[i - 1]);
    }
  }
  return tab[tab.length - 1];
}

/** h(T) = ∫cp dT от 300 K до T, кДж/моль. */
function h(comp, T) {
  const t = clampT(T);
  let sum = 0;
  let prevT = T_GRID[0];
  let prevC = cp(comp, prevT);
  for (let i = 1; i < T_GRID.length; i++) {
    const nextT = Math.min(t, T_GRID[i]);
    if (nextT <= prevT) break;
    const nextC = cp(comp, nextT);
    sum += ((prevC + nextC) / 2) * (nextT - prevT) * 1e-3;   // J/моль → кДж/моль
    prevT = nextT;
    prevC = nextC;
    if (t <= T_GRID[i]) break;
  }
  return sum;
}

/** Энтальпия смеси: состав {N2, O2, SO2, SO3, H2O} в кмоль, T в K → кДж. */
function mixH(comp, T) {
  let s = 0;
  for (const k of Object.keys(comp)) {
    if (!CP[k]) continue;
    // h — кДж/моль, состав — кмоль: 1 кмоль = 1000 моль
    s += (comp[k] || 0) * h(k, T) * 1000;
  }
  return s;
}

/** Температура смеси с энтальпией H (кДж), методом деления пополам. */
function TfromH(comp, H) {
  let lo = 300;
  let hi = 1600;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (mixH(comp, mid) < H) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Состав газа в КМОЛЬ по результатам модели (Nm3/h → кмоль/ч). */
function composition(nm3) {
  return {
    N2: (nm3.N2 || 0) / 22.414,
    O2: (nm3.O2 || 0) / 22.414,
    SO2: (nm3.SO2 || 0) / 22.414,
    SO3: (nm3.SO3 || 0) / 22.414,
    H2O: (nm3.H2O || 0) / 22.414,
  };
}

const API = { cp, h, mixH, TfromH, composition, CP, T_GRID, R };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinTemps = API;
})();
