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
checks.forEach((c) => console.log(c.s));
console.log('');
console.log('общая конверсия:', r.conversion, '% (проект 99,8)');
console.log('пределы:', JSON.stringify(r.limits));
if (bad.length) {
  console.log('\nПРОВАЛ: %d проверок', bad.length);
  process.exit(1);
}
console.log('\nМодель воспроизводит проектный баланс.');
