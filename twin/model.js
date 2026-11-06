'use strict';
// Оборачиваем в IIFE: файл подключается и как модуль Node, и как
// обычный <script>, а классические скрипты делят глобальную область.
(function () {
/*
 * Стационарная модель линии серы: сера → сжигание → конверсия → абсорбция.
 *
 * Считает материальный баланс по стехиометрии и степеням конверсии, а не по
 * «подогнанным» числам: единственные входные допущения — состав газа из печи
 * (доля SO3), коэффициенты конверсии по ступеням и избыток воздуха. Всё
 * остальное выводится из расхода серы.
 *
 * Проектная точка (twin/balance.json, листы 1 и 3) воспроизводится из
 * 20,48 т/ч серы: 62,5 т/ч H2SO4, 11,4 нм³/ч SO2 в трубе ≈ 287 мг/нм³.
 *
 * Единицы: расходы жидкости — т/ч, газа — нм³/ч, температуры — °C.
 */

const M = { S: 32.06, O2: 31.998, SO2: 64.058, SO3: 80.056, N2: 28.013, H2SO4: 98.079 };
const NM3 = 22.414;            // нм³ в кмоль
// Отношение азота к кислороду взято из баланса (лист 3, поток 3: 102942/27278),
// а не из «физического» 3,76: в проектном газе есть примеси, и так сходятся N2 и объёмы.
const N2_PER_O2 = 102942 / 27278;

// Проектные коэффициенты (получены из баланса листа 3, см. balance.json)
const DESIGN = {
  load: 1.0,
  sulfur_t_h: 20.48,
  so3_share: 379 / (13922 + 379),   // доля SO3 в газе печи
  conv1: (13922 - 5006) / 13922,     // 1-я ступень
  conv2: (5006 - 1716) / 5006,       // 2-я ступень
  conv3: (1716 - 715) / 1716,        // 3-я ступень
  conv4: (715 - 21.5) / 715,         // 4-я ступень (вторая стадия)
  air_o2_kmol: 27278 / NM3,          // кислород в воздухе на входе
  acid_conc: 98.5,
  absorb1: 1.0,                      // доля улавливания SO3 в 1-й абсорбции
  absorb2: 0.999,                    // и во 2-й
  scrubber: (21.5 - 11.4) / 21.5,    // щелочная промывка снимает остаток SO2
  stack_h2o_nm3: 4791,               // влага в дымовых газах (поток 24)
};

const num = (v, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

/**
 * @param {object} c управления: load, so3_share, conv1..conv4, air_excess,
 *                        absorb1, absorb2, acid_conc, sulfur_t_h
 */
function solve(c = {}) {
  // --- входы
  const load = clamp(c.load ?? DESIGN.load, 0.1, 1.3);
  const sulfur_t_h = c.sulfur_t_h ?? DESIGN.sulfur_t_h * load;
  const nS = (sulfur_t_h * 1000) / M.S;               // кмоль S/ч

  // воздух: по умолчанию — проектный, масштабируется нагрузкой и избытком
  const excess = c.air_excess ?? 1;
  const nAirO2 = (c.air_o2_kmol ?? DESIGN.air_o2_kmol * load) * excess;
  const nAirN2 = nAirO2 * N2_PER_O2;

  // --- печь: сера → SO2 + SO3
  const so3Share = c.so3_share ?? DESIGN.so3_share;
  const nSO3_0 = nS * so3Share;
  const nSO2_0 = nS - nSO3_0;
  const o2Used0 = nSO2_0 + 1.5 * nSO3_0;              // S+O2 и S+1,5O2
  const nO2_0 = nAirO2 - o2Used0;
  if (nO2_0 < 0) {
    return { error: 'Воздуха не хватает на сжигание серы', need_o2_kmol: num(o2Used0, 1), air_o2: num(nAirO2, 1) };
  }

  // --- конверсия: 4 ступени, между 3-й и 4-й — 1-я абсорбция (SO3 убирается)
  const stages = [];
  let s2 = nSO2_0, s3 = nSO3_0, o2 = nO2_0;
  const conv = [c.conv1 ?? DESIGN.conv1, c.conv2 ?? DESIGN.conv2, c.conv3 ?? DESIGN.conv3, c.conv4 ?? DESIGN.conv4];

  function stage(i, absorbBefore) {
    const cIn = conv[i];
    const cut = s2 * clamp(cIn, 0, 1);
    s2 -= cut;
    s3 += cut;
    o2 -= 0.5 * cut;
    stages.push({ n: i + 1, conv: cut / (s2 + cut || 1), so2_in: num((s2 + cut) * NM3, 0), so2_out: num(s2 * NM3, 0), so3_out: num(s3 * NM3, 0), o2: num(o2 * NM3, 0), absorbed_before: !!absorbBefore });
    return cut;
  }

  stage(0, false);
  stage(1, false);
  stage(2, false);

  // 1-я абсорбция: SO3 улавливается в кислоту
  const a1 = clamp(c.absorb1 ?? DESIGN.absorb1, 0, 1);
  const so3ToAcid1 = s3 * a1;
  s3 *= (1 - a1);

  stage(3, true);

  // 2-я абсорбция
  const a2 = clamp(c.absorb2 ?? DESIGN.absorb2, 0, 1);
  const so3ToAcid2 = s3 * a2;
  s3 *= (1 - a2);

  // Щелочная промывка: снимает остаток SO2 перед трубой
  const scrub = clamp(c.scrubber ?? DESIGN.scrubber, 0, 1);
  const so2BeforeScrub = s2;
  s2 *= (1 - scrub);

  // --- продукт: SO3 + H2O → H2SO4
  const nH2SO4 = so3ToAcid1 + so3ToAcid2;            // кмоль/ч
  const acid100_t_h = (nH2SO4 * M.H2SO4) / 1000;
  const conc = clamp(c.acid_conc ?? DESIGN.acid_conc, 70, 100);
  const product_t_h = (acid100_t_h * 100) / conc;

  // --- труба
  const nN2 = nAirN2;
  const h2o = (c.stack_h2o_nm3 ?? DESIGN.stack_h2o_nm3) * load;
  const wet = (s2 + s3 + o2 + nN2) * NM3 + h2o;
  const so2Mass = (s2 * M.SO2);
  const so3Mass = (s3 * M.SO3);
  const stack_so2 = wet > 1 ? (so2Mass * 1e6) / wet : 0;    // мг/нм³
  const stack_so3 = wet > 1 ? (so3Mass * 1e6) / wet : 0;    // мг/нм³ (унос после 2-й абсорбции)
  const conversion = (nSO2_0 - s2) / (nSO2_0 || 1);

  const out = {
    load: num(load, 3),
    sulfur_t_h: num(sulfur_t_h),
    gas: {
      so2_burner_nm3: num(nSO2_0 * NM3, 0),
      so3_burner_nm3: num(nSO3_0 * NM3, 0),
      o2_burner_nm3: num(o2 * 0 + nO2_0 * NM3, 0),
      n2_burner_nm3: num(nAirN2 * NM3, 0),
      o2_dry_pct: num((nO2_0 / (nSO2_0 + nSO3_0 + nO2_0 + nAirN2)) * 100, 1),
      so2_dry_pct: num((nSO2_0 / (nSO2_0 + nSO3_0 + nO2_0 + nAirN2)) * 100, 1),
    },
    stages,
    stack: {
      so2_nm3: num(s2 * NM3, 1),
      so2_mg: num(stack_so2, 0),
      so3_nm3: num(s3 * NM3, 1),
      so3_mg: num(stack_so3, 0),
      wet_nm3: num(wet, 0),
      o2_pct: num((o2 / (s2 + s3 + o2 + nN2)) * 100, 1),
    },
    acid: {
      so3_to_acid1_kmol: num(so3ToAcid1, 1),
      so3_to_acid2_kmol: num(so3ToAcid2, 1),
      h2so4_100_t_h: num(acid100_t_h),
      product_t_h: num(product_t_h),
      product_t_day: num(product_t_h * 24, 0),
      conc,
    },
    conversion: num(conversion * 100, 2),
    limits: {
      stack_ok: stack_so2 <= 300,
      conversion_ok: conversion * 100 >= 99.8,
      load_ok: load >= 0.7 && load <= 1.1,
    },
  };
  return out;
}

/** Проектная точка: то, с чем сверяемся. */
function designPoint() {
  return solve({});
}

/** Разница между сценарием и проектной точкой — то, что показываем оператору. */
function delta(a, b = designPoint()) {
  const rows = [];
  const add = (name, before, after, unit, digits = 2) => {
    if (before == null || after == null || Number.isNaN(before) || Number.isNaN(after)) return;
    const d = after - before;
    if (Math.abs(d) < 10 ** -digits / 2) return;
    rows.push({ name, before: num(before, digits), after: num(after, digits), delta: num(d, digits), unit });
  };
  add('Сера', b.sulfur_t_h, a.sulfur_t_h, 'т/ч');
  add('SO₂ в газе печи', b.gas.so2_burner_nm3, a.gas.so2_burner_nm3, 'нм³/ч', 0);
  add('O₂ в газе печи', b.gas.o2_dry_pct, a.gas.o2_dry_pct, '%', 1);
  add('Общая конверсия', b.conversion, a.conversion, '%', 2);
  add('Кислота 100 %', b.acid.h2so4_100_t_h, a.acid.h2so4_100_t_h, 'т/ч');
  add('Товарная кислота', b.acid.product_t_h, a.acid.product_t_h, 'т/ч');
  add('SO₂ в трубе', b.stack.so2_mg, a.stack.so2_mg, 'мг/нм³', 0);
  return rows;
}

// В Node — обычный модуль; в браузере (вкладка «Двойник») тот же файл
// подключается через <script>, поэтому API уходит в глобальную область.
const API = { solve, designPoint, delta, DESIGN, M, NM3 };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinModel = API;
})();
