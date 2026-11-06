'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Тепловой блок: сколько пара даёт участок и сколько тепла уходит в газ.
 *
 * Считается из энергии реакций, а не «по коэффициенту»:
 *
 *   горение серы   S(ж) + O2 → SO2(г)          ΔH ≈ −297 кДж/моль S
 *   конверсия      SO2 + ½O2 → SO3             ΔH ≈ −99 кДж/моль SO2
 *
 * Тепло реакций идёт на испарение питательной воды. Доля, которая реально
 * доходит до пара (КПД котла-утилизатора), калибруется по проектному балансу:
 * на номинале должно получиться 85,1 т/ч пара 6,4 МПа / 450 °C при 87,75 т/ч
 * питательной воды и продувке 2,63 т/ч (лист 2, потоки 103–112).
 *
 * Мощность турбины — оценка: изобарно-адиабатный КПД задан допущением и так и
 * помечен. Выдавать её за расчёт нельзя: в балансе мощности нет.
 */

const MB = {
  burn: 297.0,        // кДж/моль S (жидкая сера → SO2 газ)
  conv: 99.0,         // кДж/моль SO2 → SO3
  hSteam: 3300,       // кДж/кг, пар 6,4 МПа / 450 °C (перегретый)
  hFeed: 567,         // кДж/кг, питательная вода 135 °C
  mS: 32.06,
  mSO2: 64.058,
  blowdownShare: 2.63 / 87.75,   // продувка по балансу, лист 2
  turbineEta: 0.82,              // ДОПУЩЕНИЕ для оценки мощности
};

// КПД котла подбирается так, чтобы на проекте вышло 85,1 т/ч пара
const DESIGN_STEAM_T_H = 85.1;
const DESIGN_S_FEED_T_H = 20.48;

/** Тепло реакций для текущего режима, МВт. */
function reactionHeat(model) {
  const nS = (model.sulfur_t_h * 1000) / MB.mS;               // кмоль/ч серы
  const nSO2 = (model.gas.so2_burner_nm3 || 0) / 22.414;      // кмоль/ч SO2 в газе печи
  const nSO3 = (model.gas.so3_burner_nm3 || 0) / 22.414;
  const so2Left = (model.stack.so2_nm3 || 0) / 22.414;        // ушло в трубу
  // превращено SO2 → SO3: всё, что вошло и не ушло в трубу (SO3 из него же)
  const convKmol = Math.max(0, nSO2 - so2Left);
  // кДж/моль × кмоль = кДж × 1000; делим на 3600 — получаем кВт
  const qBurnKw = (nS * MB.burn * 1000) / 3600;
  const qConvKw = (convKmol * MB.conv * 1000) / 3600;
  return { nS, nSO2, nSO3, convKmol, qBurnKw, qConvKw, totalKw: qBurnKw + qConvKw };
}

/** Проектная точка: тепло и пар по балансу. */
function designHeat() {
  const nS = (DESIGN_S_FEED_T_H * 1000) / MB.mS;
  const nSO2 = 13922 / 22.414;
  const so2Left = 11.4 / 22.414;
  const convKmol = Math.max(0, nSO2 - so2Left);
  const totalKw = (nS * MB.burn * 1000 + convKmol * MB.conv * 1000) / 3600;
  const steam = DESIGN_STEAM_T_H * 1000;                        // кг/ч
  const qSteam = (steam * (MB.hSteam - MB.hFeed)) / 3600;       // кВт
  return { totalKw, qSteamKw: qSteam, eta: qSteam / totalKw };
}

const ETA = designHeat().eta;   // КПД котла, подобранный по проектному балансу

/**
 * @param {object} model результат TwinModel.solve()
 * @returns {object} тепло и пар
 */
function solve(model) {
  if (!model || model.stopped || model.error) {
    return {
      stopped: true,
      heatKw: 0, heatMw: 0,
      steam_t_h: 0, feedwater_t_h: 0, blowdown_t_h: 0,
      turbinePowerMw: 0, turbineAssumed: true,
      eta: ETA,
    };
  }
  const r = reactionHeat(model);
  const qSteamKw = r.totalKw * ETA;
  const steam_kg_h = (qSteamKw * 3600) / (MB.hSteam - MB.hFeed);
  const blowdown = steam_kg_h * MB.blowdownShare;

  // Оценка мощности: разница энтальпий на турбине при допущении КПД.
  // 6,4 МПа / 450 °C → 0,8 МПа (отбор): h1 = 3300, h2s ≈ 2870 кДж/кг
  const dh = (MB.hSteam - 2870) * MB.turbineEta;
  const turbineMw = (steam_kg_h / 3600) * dh / 1000;

  return {
    stopped: false,
    heatKw: round(r.totalKw, 0),
    heatMw: round(r.totalKw / 1000, 1),
    burnMw: round(r.qBurnKw / 1000, 1),
    convMw: round(r.qConvKw / 1000, 1),
    steam_t_h: round(steam_kg_h / 1000, 2),
    feedwater_t_h: round((steam_kg_h + blowdown) / 1000, 2),
    blowdown_t_h: round(blowdown / 1000, 2),
    turbinePowerMw: round(turbineMw, 1),
    turbineAssumed: true,
    eta: round(ETA, 4),
  };
}

function round(v, d) {
  const k = 10 ** d;
  return Math.round(v * k) / k;
}

const API = { solve, designHeat, reactionHeat, MB, ETA };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinHeat = API;
})();
