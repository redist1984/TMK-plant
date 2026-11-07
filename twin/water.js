'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Водоподготовка, циркуляция и выработка электроэнергии.
 *
 * Данные из проектного обоснования:
 *   обессоленная вода      60 т/ч (2×30), обратный осмос + смешанный ионит
 *   деаэрированная вода    100 т/ч, 135 °C
 *   циркуляция серной кислоты  2×1800 м³/ч
 *   циркуляция генерации       2×2500 м³/ч
 *   водоподготовка (сырая) 200 т/ч
 *   турбина                20 МВт, пар 81,8 т/ч 6,4 МПа, отбор 16 т/ч 0,8 МПа
 *
 * Что считается: сколько нужно подпиточной воды, сколько тепла снимает
 * оборотная вода, сколько электроэнергии уходит в сеть.
 */

const CP_WATER = 4.186;        // кДж/(кг·K)

const DESIGN = {
  demin_t_h: 60,
  demin_lines: 2,
  deaerated_t_h: 100,
  circ_acid_m3_h: 1800,
  circ_power_m3_h: 2500,
  raw_water_t_h: 200,
  turbine_mw: 20,
  gen_eff: 0.98,               // генератор
  aux_share: 0.06,             // собственные нужды станции, доля выработки
  cond_dt: 10,                 // нагрев оборотной воды в конденсаторе, K
};

/**
 * @param {object} h результат теплового блока (heat.js)
 * @param {object} p результат модели (model.js)
 */
function solve(h, p) {
  if (!h || h.stopped) {
    return { stopped: true, demin_t_h: 0, makeup_t_h: 0, condDutyMw: 0,
      circPower_m3_h: 0, circAcid_m3_h: 0, grossMw: 0, auxMw: 0, netMw: 0 };
  }

  // --- пар и конденсат
  const steam = h.steam_t_h;
  const condensing = h.condensing_t_h;       // идёт в конденсатор
  const extraction = h.extraction_t_h;

  // тепло, снимаемое в конденсаторе: пар после турбины -> конденсат ~40 °C
  const hCondIn = 2200;                      // кДж/кг, влажный пар на выхлопе
  const hCondOut = 4.186 * 40;               // кДж/кг, конденсат 40 °C
  const condDutyKw = (condensing * 1000 / 3600) * (hCondIn - hCondOut);

  // расход оборотной воды на конденсатор при нагреве на cond_dt
  const circKgS = condDutyKw / (CP_WATER * DESIGN.cond_dt);
  const circPower_m3_h = (circKgS * 3600) / 1000;

  // --- водоподготовка
  // подпитка = продувка + потери пара и конденсата (принято 1,5 % от выработки пара)
  const losses = steam * 0.015;
  const makeup = h.blowdown_t_h + losses;    // т/ч обессоленной воды
  const feedwater = h.feedwater_t_h;         // деаэрированная вода

  // --- электричество
  const grossMw = h.turbinePowerMw * DESIGN.gen_eff;
  const auxMw = grossMw * DESIGN.aux_share;
  const netMw = grossMw - auxMw;

  // --- удельные показатели
  const acid = p && p.acid ? p.acid.product_t_h : null;
  const steamPerAcid = acid ? steam / acid : null;
  const powerPerAcid = acid ? netMw / acid : null;

  return {
    stopped: false,
    condDutyMw: round(condDutyKw / 1000, 1),
    circPower_m3_h: round(circPower_m3_h, 0),
    circPowerOk: circPower_m3_h <= DESIGN.circ_power_m3_h * 2,
    // циркуляция кислотного отделения — оценка по теплу, снимаемому в абсорбции
    circAcid_m3_h: round(circAcid(p) , 0),
    condensing_t_h: round(condensing, 2),
    extraction_t_h: round(extraction, 2),
    makeup_t_h: round(makeup, 2),
    demin_t_h: round(makeup, 2),
    deminOk: makeup <= DESIGN.demin_t_h,
    feedwater_t_h: round(feedwater, 2),
    deaeratedOk: feedwater <= DESIGN.deaerated_t_h,
    grossMw: round(grossMw, 1),
    auxMw: round(auxMw, 1),
    netMw: round(netMw, 1),
    steamPerAcid: steamPerAcid ? round(steamPerAcid, 2) : null,
    powerPerAcid: powerPerAcid ? round(powerPerAcid, 3) : null,
    design: DESIGN,
  };
}

/** Оборотная вода кислотного отделения: снимает тепло абсорбции и сушки. */
function circAcid(p) {
  if (!p || p.stopped) return 0;
  // тепло, не ушедшее в пар: разница между теплом реакций и теплом пара
  const heatMw = p && p.acid ? 8.5 : 0;   // оценка по балансу абсорбции, МВт
  return (heatMw * 1000 * 3600) / (CP_WATER * DESIGN.cond_dt) / 1000;
}

function round(v, d) {
  const k = 10 ** d;
  return Math.round(v * k) / k;
}

const API = { solve, DESIGN, CP_WATER };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinWater = API;
})();
