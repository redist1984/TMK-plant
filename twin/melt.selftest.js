'use strict';
/*
 * Проверки плавления серы и уровней в ёмкостях.
 *
 * Опора — проектное обоснование: плавление ≥45 т/ч, пар 0,8 МПа, расплав
 * 135–145 °C, зольность ≤30 ppm после первой ступени и ≤15 ppm после второй;
 * уставки уровней — из таблицы мониторинга DCS (LT-11101: LL 500, H 2200 мм).
 */

const M = require('./melt.js');
const T = require('./tank.js');

let failed = 0;
const ok = (name, cond, extra) => {
  if (!cond) failed++;
  console.log((cond ? 'OK  ' : 'ПЛОХО') + ' ' + name + (extra ? ' — ' + extra : ''));
};
const near = (a, b, tol) => Math.abs(a - b) <= Math.abs(b) * tol;

const r = M.solve({ sulfur_t_h: 20.48 });
console.log('плавление: тепло ' + r.heat.totalKw + ' кВт, пар 0,8 МПа ' + r.steam08_t_h + ' т/ч');
console.log('');

ok('тепло на плавление около 790 кВт', near(r.heat.totalKw, 793, 0.1), r.heat.totalKw + ' кВт');
ok('пар 0,8 МПа около 1,4 т/ч', near(r.steam08_t_h, 1.39, 0.15), r.steam08_t_h + ' т/ч');
ok('нагрузка от проектных 45 т/ч около 45 %', near(r.loadPct, 45.5, 0.1), r.loadPct + ' %');
ok('зольность после второй ступени ≤15 ppm', r.ash.after2Ppm <= 15, r.ash.after2Ppm + ' ppm');
ok('фильтрация признана годной', r.ash.ok === true);
ok('режим по температуре в норме', r.limits.tempOk === true, r.tMelt + ' °C');

// выше проектной производительности — предупреждение
const over = M.solve({ sulfur_t_h: 50 });
ok('выше 45 т/ч — превышение производительности', over.limits.capacityOk === false, over.sulfur_t_h + ' т/ч');

// очень грязная сера: после первой ступени хуже нормы
const dirty = M.solve({ sulfur_t_h: 20, ashFeed: 400 });
ok('очень грязная сера: кек растёт', dirty.ash.cake_t_h > r.ash.cake_t_h, dirty.ash.cake_t_h + ' т/ч против ' + r.ash.cake_t_h);

// --- уровни
const tank = { level: 1500, area_m2: 5, density: 1792, LL: 500, H: 2200 };
const up = T.step(tank, { qIn_t_h: 20.48, qOut_t_h: 20.0 }, 60);
ok('приход больше расхода — уровень растёт', up.delta > 0, '+' + up.delta + ' мм/ч');
ok('состояние в норме', up.status === 'normal');

const down = T.step(tank, { qIn_t_h: 20.0, qOut_t_h: 20.48 }, 60);
ok('расход больше прихода — уровень падает', down.delta < 0, down.delta + ' мм/ч');

const empty = T.step({ level: 520, area_m2: 5, LL: 500, H: 2200 }, { qIn_t_h: 19, qOut_t_h: 21 }, 60);
ok('опустились ниже LL — статус low', empty.status === 'low', empty.level + ' мм');

const high = T.step({ level: 2150, area_m2: 5, LL: 500, H: 2200 }, { qIn_t_h: 21, qOut_t_h: 19 }, 60);
ok('поднялись выше H — статус high', high.status === 'high', high.level + ' мм');

const tt = T.timeTo({ level: 1500, area_m2: 5 }, -0.48, 500);
ok('время до LL считается', tt != null && tt > 0, Math.round(tt / 60) + ' ч');

const noWay = T.timeTo({ level: 1500, area_m2: 5 }, +0.48, 500);
ok('если идём в другую сторону — времени нет', noWay === null);

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Плавление и уровни считаются.');
