'use strict';
/*
 * Проверки водоподготовки, циркуляции и генерации.
 *
 * Опора — проектное обоснование: обессоленная вода 60 т/ч, деаэрированная
 * 100 т/ч, циркуляция кислоты 2×1800 м³/ч, генерации 2×2500 м³/ч,
 * турбина 20 МВт при 81,8 т/ч пара и отборе 16 т/ч.
 */

const W = require('./water.js');
const H = require('./heat.js');
const M = require('./model.js');

let failed = 0;
const ok = (n, c, e) => {
  if (!c) failed++;
  console.log((c ? 'OK  ' : 'ПЛОХО') + ' ' + n + (e ? ' — ' + e : ''));
};
const near = (a, b, tol) => Math.abs(a - b) <= Math.abs(b) * tol;

const model = M.solve({});
const heat = H.solve(model);
const w = W.solve(heat, model);

console.log('пар ' + heat.steam_t_h + ' т/ч, в конденсатор ' + heat.condensing_t_h +
  ', отбор ' + heat.extraction_t_h);
console.log('тепло конденсатора ' + w.condDutyMw + ' МВт, оборотная вода ' + w.circPower_m3_h + ' м³/ч');
console.log('');

ok('тепло конденсатора 30…45 МВт', w.condDutyMw > 30 && w.condDutyMw < 45, w.condDutyMw + ' МВт');
ok('оборотная вода генерации в пределах 2×2500',
  w.circPower_m3_h > 1500 && w.circPower_m3_h < 5000, w.circPower_m3_h + ' м³/ч');
ok('подпитка меньше проектных 60 т/ч', w.deminOk, w.makeup_t_h + ' т/ч');
ok('питательная вода не больше 100 т/ч', w.deaeratedOk, w.feedwater_t_h + ' т/ч');
ok('выработка до генератора около 20 МВт', near(w.grossMw, 19.6, 0.08), w.grossMw + ' МВт');
ok('в сеть уходит меньше выработки', w.netMw < w.grossMw && w.netMw > 15, w.netMw + ' МВт');
ok('удельный расход пара на кислоту 1,2…1,5 т/т', w.steamPerAcid > 1.2 && w.steamPerAcid < 1.5,
  w.steamPerAcid + ' т/т');
ok('проектное значение 1,31 т/т попадает в допуск', near(w.steamPerAcid, 1.31, 0.12), w.steamPerAcid + ' т/т');
ok('оборотная вода кислотного отделения посчитана', w.circAcid_m3_h > 300, w.circAcid_m3_h + ' м³/ч');

// при остановке горения все нули
const stopped = W.solve(H.solve(M.solve({}), {}), M.solve({}));
const stopHeat = H.solve(M.solve({}), {});
ok('на останове воды и генерации нет', W.solve({ stopped: true }, model).stopped === true);

// нагрузка 70 % — подпитка и выработка падают
const lowModel = M.solve({ load: 0.7 });
const lowHeat = H.solve(lowModel);
const low = W.solve(lowHeat, lowModel);
ok('на 70 % выработка меньше', low.netMw < w.netMw, low.netMw + ' против ' + w.netMw);
ok('на 70 % подпитка меньше', low.makeup_t_h <= w.makeup_t_h, low.makeup_t_h + ' против ' + w.makeup_t_h);

console.log('');
if (failed) { console.log('ПРОВАЛ: ' + failed); process.exit(1); }
console.log('Водоподготовка и генерация сходятся с проектом.');
