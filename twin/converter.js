'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Конверсия SO2 → SO3 из равновесия, а не из ползунка.
 *
 * Реакция: SO2 + ½O2 ⇌ SO3. Константа равновесия:
 *
 *     lg Kp = 5186/T − 4,987        (Kp в атм^−0,5, T в кельвинах)
 *
 * Проверка формулы: при 1000 K Kp ≈ 1,6 атм^−0,5 — совпадает с табличной.
 *
 * Слой катализатора адиабатический: чем больше превратилось, тем горячее газ,
 * а равновесие с ростом температуры смещается назад. Поэтому выход слоя — это
 * компромисс между теплом реакции и равновесием при температуре выхода.
 *
 * Считаем так: для ряда степеней превращения X берём температуру выхода из
 * теплового баланса и проверяем, достигнуто ли равновесие. Найденное X_равн
 * умножаем на «степень приближения» — долю от равновесия, которую даёт реальный
 * объём катализатора. Эта доля калибруется по проектным данным.
 */

const NM3 = 22.414;

/** lg Kp = 5186/T − 4,987 */
function lgKp(T) {
  return 5186 / T - 4.987;
}
function Kp(T) {
  return 10 ** lgKp(T);
}

/**
 * Равновесная степень превращения при заданных T, P и составе.
 * @param {number} T температура, K
 * @param {number} P абсолютное давление, атм
 * @param {object} n кмоль: {SO2, SO3, O2, N2}
 * @returns {number} X в долях от SO2 на входе
 */
function eqConversion(T, P, n) {
  const kp = Kp(T);
  const so2_0 = n.SO2 || 0;
  if (so2_0 <= 0) return 0;

  const q = (X) => {
    const so2 = so2_0 * (1 - X);
    const so3 = (n.SO3 || 0) + so2_0 * X;
    const o2 = (n.O2 || 0) - 0.5 * so2_0 * X;
    if (so2 <= 0 || o2 <= 0) return Infinity;
    const total = so2 + so3 + o2 + (n.N2 || 0);
    const pSO3 = (so3 / total) * P;
    const pSO2 = (so2 / total) * P;
    const pO2 = (o2 / total) * P;
    return pSO3 / (pSO2 * Math.sqrt(pO2));
  };

  // бисекция: Q(X) растёт с превращением, поэтому ищем, где Q = Kp
  let lo = 0;
  let hi = 0.999;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (q(mid) > kp) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

const API = { Kp, lgKp, eqConversion, NM3 };

const HC = (typeof module !== 'undefined' && module.exports)
  ? require('./heatcap.js')
  : self.TwinTemps;

/**
 * Превращение в одном слое катализатора с учётом адиабатического разогрева.
 *
 * Итерация: превращение → температура выхода из теплового баланса →
 * равновесие при этой температуре → превращение как доля от равновесия.
 *
 * @param {object} n кмоль на входе слоя: {SO2, SO3, O2, N2}
 * @param {number} Tin входная температура, °C
 * @param {number} P абсолютное давление, атм
 * @param {number} approach степень приближения к равновесию (0…1)
 * @returns {{X:number, Tout:number, Xeq:number, approach:number}}
 */
function stage(n, Tin, P, approach) {
  const DH = 99.0;                       // кДж/моль SO2 → SO3
  const so2_0 = n.SO2 || 0;
  if (so2_0 <= 0) return { X: 0, Tout: Tin, Xeq: 0, approach };

  const compAt = (X) => ({
    SO2: so2_0 * (1 - X),
    SO3: (n.SO3 || 0) + so2_0 * X,
    O2: (n.O2 || 0) - 0.5 * so2_0 * X,
    N2: n.N2 || 0,
  });

  const toutAt = (X) => {
    const comp = compAt(X);
    const heat = X * so2_0 * DH * 1000;                       // кДж/ч
    return HC.TfromH(comp, HC.mixH(comp, Tin + 273.15) + heat);
  };

  // Простая подстановка X ← approach·X_равн раскачивается (температура и
  // равновесие связаны обратной связью), поэтому решаем уравнение:
  //     f(X) = approach · X_равн(T_out(X)) − X = 0
  // f убывает по X, корень ищем бисекцией.
  const f = (X) => approach * eqConversion(toutAt(X), P, n) - X;
  let lo = 0;
  let hi = 0.999;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  const X = (lo + hi) / 2;
  const Tout = toutAt(X);
  return {
    X: Math.round(X * 1e5) / 1e5,
    Tout: Math.round((Tout - 273.15) * 10) / 10,
    Xeq: Math.round(eqConversion(Tout, P, n) * 1e5) / 1e5,
    approach,
  };
}

Object.assign(API, { stage });

if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinConverter = API;
})();
