'use strict';
/*
 * Проверка теплового блока: на проектном режиме он обязан воспроизвести
 * пар и питательную воду из баланса (лист 2, потоки 103, 112, 111).
 */

const H = require('./heat.js');
const { solve } = require('./model.js');

let failed = 0;
const ok = (name, cond, extra) => {
  if (!cond) failed++;
  console.log((cond ? 'OK  ' : 'ПЛОХО') + ' ' + name + (extra ? ' — ' + extra : ''));
};
const near = (a, b, tol) => Math.abs(a - b) <= Math.abs(b) * tol;

const nom = H.solve(solve({}));
const d = H.designHeat();

console.log('проект: тепло ' + (d.totalKw / 1000).toFixed(1) + ' МВт, КПД котла ' + d.eta.toFixed(3));
console.log('номинал: пар ' + nom.steam_t_h + ' т/ч, питательная вода ' + nom.feedwater_t_h + ' т/ч, продувка ' + nom.blowdown_t_h + ' т/ч');
console.log('');

ok('пар на номинале 85,1 т/ч', near(nom.steam_t_h, 85.1, 0.02), nom.steam_t_h + ' т/ч');
ok('питательная вода 87,75 т/ч', near(nom.feedwater_t_h, 87.75, 0.02), nom.feedwater_t_h + ' т/ч');
ok('продувка 2,63 т/ч', near(nom.blowdown_t_h, 2.63, 0.1), nom.blowdown_t_h + ' т/ч');
ok('тепло реакций около 70 МВт', near(nom.heatMw, 69.8, 0.05), nom.heatMw + ' МВт');
ok('КПД котла в разумных пределах 0,85…0,97', d.eta > 0.85 && d.eta < 0.97, d.eta.toFixed(3));

// пар падает вместе с нагрузкой и связан с ней почти линейно
const low = H.solve(solve({ load: 0.7 }));
ok('на 70 % нагрузки пар падает', low.steam_t_h < nom.steam_t_h, low.steam_t_h + ' т/ч');
ok('пар на 70 % около 70 % от номинала', near(low.steam_t_h, nom.steam_t_h * 0.7, 0.06), low.steam_t_h + ' т/ч');

// --- турбина с отбором
ok('отбор на плавление и обогрев 16 т/ч', near(nom.extraction_t_h, 16, 0.05), nom.extraction_t_h + ' т/ч');
ok('в конденсатор идёт пар минус отбор', near(nom.condensing_t_h, nom.steam_t_h - nom.extraction_t_h, 0.01),
  nom.condensing_t_h + ' т/ч');
ok('мощность турбины около 20 МВт', near(nom.turbinePowerMw, 20, 0.1), nom.turbinePowerMw + ' МВт');
ok('КПД турбины в разумных пределах 0,75…0,95', nom.turbineEta > 0.75 && nom.turbineEta < 0.95, nom.turbineEta);

// без отбора мощность выше — пар дорабатывает до конденсатора
const noExt = H.solve(solve({}), { extraction_t_h: 0 });
ok('без отбора мощность выше', noExt.turbinePowerMw > nom.turbinePowerMw, noExt.turbinePowerMw + ' против ' + nom.turbinePowerMw);

// отбор больше выработки пара не отбирается
const over = H.solve(solve({}), { extraction_t_h: 200 });
ok('отбор не больше выработки пара', over.extraction_t_h === over.steam_t_h, over.extraction_t_h + ' из ' + over.steam_t_h);

// при остановке горения пара нет
const stop = H.solve({ stopped: true });
ok('при остановке пара нет', stop.steam_t_h === 0 && stop.heatMw === 0);

// мощность турбины помечена как оценка
ok('мощность турбины помечена допущением', nom.turbineAssumed === true, nom.turbinePowerMw + ' МВт');

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Тепловой блок сходится с проектным балансом.');
