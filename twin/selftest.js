'use strict';
/*
 * Самопроверка модели: на проектных коэффициентах она обязана воспроизвести
 * баланс листа 3 (газ) и листа 1 (кислота). Если разойдётся — модель врёт,
 * и строить на ней двойник нельзя.
 */

const { solve } = require('./model');
const B = require('./balance.json');

const g = B.gas_streams;

function row(name, model, design, unit, tolPct) {
  const d = design === 0 ? Math.abs(model) : Math.abs((model - design) / design) * 100;
  const ok = d <= tolPct;
  const s = `${ok ? 'OK ' : 'ПЛОХО'} ${name.padEnd(34)} модель ${String(model).padStart(9)} | баланс ${String(design).padStart(9)} ${unit} | откл ${d.toFixed(2)} %`;
  return { ok, s };
}

const r = solve({});
const checks = [];

checks.push(row('Сера', r.sulfur_t_h, B.acid_streams['50'].flow, 'т/ч', 1));
checks.push(row('SO2 в газе печи', r.gas.so2_burner_nm3, g['5'].SO2, 'нм3/ч', 1));
checks.push(row('SO3 в газе печи', r.gas.so3_burner_nm3, g['5'].SO3, 'нм3/ч', 2));
checks.push(row('O2 в газе печи', r.gas.o2_burner_nm3, g['5'].O2, 'нм3/ч', 1));
checks.push(row('SO2 после 1-й ступени', r.stages[0].so2_out, g['10'].SO2, 'нм3/ч', 2));
checks.push(row('SO2 после 2-й ступени', r.stages[1].so2_out, g['12'].SO2, 'нм3/ч', 2));
checks.push(row('SO2 после 3-й ступени', r.stages[2].so2_out, g['14'].SO2, 'нм3/ч', 2));
checks.push(row('SO2 после 4-й ступени', r.stages[3].so2_out, g['20'].SO2, 'нм3/ч', 3));
checks.push(row('Кислота 100 %', r.acid.h2so4_100_t_h, 62.5, 'т/ч', 1));
checks.push(row('Товарная кислота', r.acid.product_t_h, B.acid_streams['64'].flow, 'т/ч', 1));
checks.push(row('SO2 в трубе', r.stack.so2_nm3, g['24'].SO2, 'нм3/ч', 2));
checks.push(row('SO2 в трубе', r.stack.so2_mg, 287, 'мг/нм3', 5));

const bad = checks.filter((c) => !c.ok);
console.log('');
console.log('общая конверсия:', r.conversion, '% (проект 99,8)');
console.log('пределы:', JSON.stringify(r.limits));

// --- конверсия из равновесия
const designConv = [64.0, 65.7, 58.3, 97.0];
const convOk = r.stagesConv.every((v, i) => Math.abs(v - designConv[i]) < 1.0);
console.log('');
console.log('конверсии по ступеням:', r.stagesConv.join(' / '), '(проект ' + designConv.join(' / ') + ')');
checks.push({ ok: convOk, s: (convOk ? 'OK  ' : 'ПЛОХО') + ' конверсия из равновесия совпала с проектом (±1 п.п.)' });

const moreAir = solve({ air_excess: 1.3 });
checks.push({
  ok: moreAir.stagesConv[0] > r.stagesConv[0],
  s: 'OK  больше воздуха — выше конверсия: ' + moreAir.stagesConv[0] + ' % против ' + r.stagesConv[0] + ' %',
});
const lessAir = solve({ air_excess: 0.8 });
checks.push({
  ok: lessAir.stagesConv[0] < r.stagesConv[0],
  s: 'OK  меньше воздуха — ниже конверсия: ' + lessAir.stagesConv[0] + ' %',
});
const manual = solve({ autoConv: false, conv1: 0.5 });
checks.push({
  ok: Math.abs(manual.stagesConv[0] - 50) < 0.5 && manual.autoConv === false,
  s: 'OK  при autoConv=false работает ползунок: ' + manual.stagesConv[0] + ' %',
});

checks.forEach((c) => console.log(c.s));

if (checks.some((c) => !c.ok)) {
  console.log('\nПРОВАЛ: ' + checks.filter((c) => !c.ok).length);
  process.exit(1);
}if (bad.length) {
  console.log('\nПРОВАЛ: %d проверок', bad.length);
  process.exit(1);
}
console.log('\nМодель воспроизводит проектный баланс.');
