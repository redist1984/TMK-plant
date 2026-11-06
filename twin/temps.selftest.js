'use strict';
/*
 * Проверка температур газа: расчёт обязан сойтись с проектом там, где проектный
 * баланс сам согласован, и обязан честно показать, где не сходится.
 */

const T = require('./temps.js');
const { solve } = require('./model.js');

let failed = 0;
const ok = (name, cond, extra) => {
  if (!cond) failed++;
  console.log((cond ? 'OK  ' : 'ПЛОХО') + ' ' + name + (extra ? ' — ' + extra : ''));
};

const p = T.gasPath(solve({}));
console.log('');
p.points.forEach((x) => {
  console.log('  ' + x.name.padEnd(24) + String(x.t).padStart(5) + ' °C' +
    (x.design != null ? '  проект ' + String(x.design).padStart(4) : '        ') +
    (x.computed ? '  расчёт' : '  уставка') + (x.suspect ? '  (расхождение в балансе)' : ''));
});
console.log('');

const get = (id) => p.compare.find((c) => c.id === id) || {};

ok('в печи около 1080 °C (±5 %)', Math.abs(get('burner').dev) < 5, get('burner').model + ' °C, откл ' + get('burner').dev + ' %');
ok('после 1-й ступени около 608 °C (±5 %)', Math.abs(get('stage1').dev) < 5, get('stage1').model + ' °C, откл ' + get('stage1').dev + ' %');
ok('после 2-й ступени около 518 °C (±5 %)', Math.abs(get('stage2').dev) < 5, get('stage2').model + ' °C, откл ' + get('stage2').dev + ' %');
ok('после 3-й ступени около 457 °C (±5 %)', Math.abs(get('stage3').dev) < 5, get('stage3').model + ' °C, откл ' + get('stage3').dev + ' %');
ok('максимальное отклонение по надёжным точкам < 5 %', p.maxDev < 5, p.maxDev + ' %');

// 4-я ступень: проект противоречив, расчёт обязан это показать
const s4 = get('stage4');
ok('4-я ступень помечена как расхождение в балансе', s4.suspect === true);
ok('4-я ступень расходится с проектом заметно', Math.abs(s4.dev) > 10, 'расчёт ' + s4.model + ' против проекта ' + s4.design);

// теплосъёмы положительны и растут по тракту не хаотично
const whb = p.duties.find((d) => d.id === 'whb');
ok('котёл-утилизатор снимает тепло', whb && whb.mw > 20, whb ? whb.mw + ' МВт' : 'нет');
ok('теплосъёмы после ступеней положительны', p.duties.filter((d) => d.id !== 'whb').every((d) => d.mw >= 0));

// при остановке горения температур нет
ok('останов: точек нет', T.gasPath({ stopped: true }).stopped === true);

// при 70 % нагрузки адиабатическая температура печи та же — она не зависит от
// расхода (тепло и теплоёмкость масштабируются одинаково). Это физика, а не баг.
const low = T.gasPath(solve({ load: 0.7 }));
const burnerLow = low.points.find((x) => x.id === 'burner');
const burnerNom = p.points.find((x) => x.id === 'burner');
ok('на 70 % нагрузки температура печи та же (адиабата не зависит от расхода)',
  Math.abs(burnerLow.t - burnerNom.t) < 3, burnerLow.t + ' против ' + burnerNom.t);
ok('теплосъём котла на 70 % ниже', low.duties.find((d) => d.id === 'whb').mw < whb.mw,
  low.duties.find((d) => d.id === 'whb').mw + ' против ' + whb.mw + ' МВт');

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Температуры газа сходятся с проектом.');
