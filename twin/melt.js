'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Плавление серы и её фильтрация.
 *
 * Считается из теплоты процесса, а не «по нормативу»:
 *
 *   нагрев твёрдой серы   36 → 115 °C   cp ≈ 0,705 кДж/(кг·K)
 *   плавление             115 °C         ΔH ≈ 53,7 кДж/кг (1,72 кДж/моль)
 *   перегрев расплава     115 → 145 °C   cp ≈ 1,0 кДж/(кг·K)
 *
 * Пар: 0,8 МПа (насыщенный, 170 °C) — плавление; 0,5 МПа — обогрев чанов
 * и трасс. Конденсат возвращается, его тепло не учитываем (возврат в цикл).
 *
 * Данные — из проектного обоснования: производительность плавления ≥45 т/ч,
 * пар 0,8 МПа, расплав ~145 °C, двухступенчатая фильтрация с зольностью
 * ≤30 ppm после первой ступени и ≤15 ppm после второй.
 */

const MB = {
  cpSolid: 0.705,      // кДж/(кг·K)
  cpLiquid: 1.0,       // кДж/(кг·K)
  dhFusion: 53.7,      // кДж/кг
  tMelt: 115,          // °C, температура плавления
  tSteam08: 170.2,     // °C, насыщенный пар 0,8 МПа
  hSteam08: 2769,      // кДж/кг
  hCond08: 721,        // кДж/кг (конденсат при 0,8 МПа)
  tSteam05: 151.8,     // °C, насыщенный пар 0,5 МПа
  hSteam05: 2749,
  hCond05: 640,
  designCapacity: 45,  // т/ч, проектная производительность плавления
  ashAfter1: 30,       // ppm, после первой ступени
  ashAfter2: 15,       // ppm, после второй ступени
};

/** Тепло на плавление, кВт. */
function heatNeed(sulfur_t_h, tFeed, tMeltTarget) {
  const m = sulfur_t_h * 1000;              // кг/ч
  const t1 = Math.min(tFeed, MB.tMelt);
  const qSolid = m * MB.cpSolid * Math.max(0, MB.tMelt - t1);
  const qFusion = m * MB.dhFusion;
  const qLiquid = m * MB.cpLiquid * Math.max(0, tMeltTarget - MB.tMelt);
  const totalKjH = qSolid + qFusion + qLiquid;
  return {
    solidKw: round(qSolid / 3600, 1),
    fusionKw: round(qFusion / 3600, 1),
    liquidKw: round(qLiquid / 3600, 1),
    totalKw: round(totalKjH / 3600, 1),
    totalKjH: totalKjH,
  };
}

/**
 * @param {object} c управления: sulfur_t_h, tFeed, tMelt, ashFeed, tracing
 * @returns {object} тепло, пар, зольность, кек
 */
function solve(c) {
  const sulfur = Math.max(0, c.sulfur_t_h != null ? c.sulfur_t_h : 20.48);
  const tFeed = c.tFeed != null ? c.tFeed : 36;          // сера со склада
  const tMelt = c.tMelt != null ? c.tMelt : 145;         // расплав на выходе
  const ashFeed = c.ashFeed != null ? c.ashFeed : 120;   // ppm в исходной сере

  const heat = heatNeed(sulfur, tFeed, tMelt);
  const steam08_kg_h = heat.totalKjH / (MB.hSteam08 - MB.hCond08);
  const steam08 = steam08_kg_h / 1000;

  // обогрев чанов и трасс: оценка по доле от плавления (проект: 16 т/ч на
  // плавление + обогрев + деаэратор, из них плавление ≈1,4 т/ч)
  const tracing = c.tracing != null ? c.tracing : 0.6;   // т/ч, обогрев
  const steam05 = tracing;

  // зола: вход → кек + фильтрат. Считаем, что ступени снимают до проектных
  // значений, если вход не слишком грязный.
  const ashAfter1 = Math.min(MB.ashAfter1, ashFeed);
  const ashAfter2 = Math.min(MB.ashAfter2, ashAfter1);
  // масса золы: ppm × т/ч → кг/ч
  const ashIn = (ashFeed * sulfur) / 1000;
  const ashOut = (ashAfter2 * sulfur) / 1000;
  const ashRemoved = Math.max(0, ashIn - ashOut);

  // диатомит: расход по проекту не задан, оцениваем как 1,5 массы снятой золы
  const diatomite = ashRemoved * 1.5;
  const cake = ashRemoved + diatomite;

  const loadPct = (sulfur / MB.designCapacity) * 100;

  return {
    sulfur_t_h: round(sulfur, 2),
    tFeed: round(tFeed, 1),
    tMelt: round(tMelt, 1),
    heat: heat,
    steam08_t_h: round(steam08, 2),
    steam05_t_h: round(steam05, 2),
    steamTotal_t_h: round(steam08 + steam05, 2),
    ash: {
      feedPpm: round(ashFeed, 0),
      after1Ppm: round(ashAfter1, 1),
      after2Ppm: round(ashAfter2, 1),
      removed_kg_h: round(ashRemoved, 2),
      cake_t_h: round(cake / 1000, 3),
      diatomite_kg_h: round(diatomite, 2),
      ok: ashAfter2 <= MB.ashAfter2,
    },
    loadPct: round(loadPct, 1),
    limits: {
      capacityOk: sulfur <= MB.designCapacity,
      ashOk: ashAfter2 <= MB.ashAfter2,
      tempOk: tMelt >= 135 && tMelt <= 145,
    },
  };
}

function round(v, d) {
  const k = 10 ** d;
  return Math.round(v * k) / k;
}

const API = { solve, heatNeed, MB };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinMelt = API;
})();
