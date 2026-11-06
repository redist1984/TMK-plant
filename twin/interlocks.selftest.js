'use strict';
/*
 * Проверки вычислителя блокировок: по одному случаю на каждое правило.
 * Запуск: node twin/interlocks.selftest.js
 */

const DATA = require('./interlocks.data.js');
const { evaluate, makeMemory, reset, bypass } = require('./logic.js');
const { build, coverage } = require('./state.js');
const { solve } = require('./model.js');

let failed = 0;
function ok(name, cond, extra) {
  const mark = cond ? 'OK  ' : 'ПЛОХО';
  if (!cond) failed++;
  console.log(`${mark} ${name}${extra ? ' — ' + extra : ''}`);
}

// --- 1. Простая блокировка по уровню: I-101, «< 500 мм»
{
  const st = { 'LIAS-11101': 400 };
  const r = evaluate(DATA, st, makeMemory());
  const it = r.list.find((x) => x.id === 'I-101');
  ok('I-101 срабатывает при уровне 400 мм', it.status === 'active' || it.status === 'latched', 'статус ' + it.status);
  ok('I-101 останавливает оба насоса', it.effects.length >= 2, 'следствий ' + it.effects.length);

  const st2 = { 'LIAS-11101': 900 };
  const r2 = evaluate(DATA, st2, makeMemory());
  const it2 = r2.list.find((x) => x.id === 'I-101');
  ok('I-101 не срабатывает при 900 мм', it2.status === 'idle', 'статус ' + it2.status);
}

// --- 2. Аналоговый порог «≥ 0,3 мкСм/см»: ищем запись с таким условием
{
  const item = DATA.items.find((i) => i.causes.some((c) => c.cond.type === 'analog' && c.cond.op === '>=' && c.cond.value === 0.3));
  if (item) {
    const tag = item.causes.find((c) => c.cond.op === '>=' && c.cond.value === 0.3).tag;
    const rHi = evaluate(DATA, { [tag]: 0.5 }, makeMemory());
    const rLo = evaluate(DATA, { [tag]: 0.1 }, makeMemory());
    const hi = rHi.list.find((x) => x.id === item.id);
    const lo = rLo.list.find((x) => x.id === item.id);
    ok(`порог ≥ 0,3 (${item.id}) срабатывает при 0,5`, hi.fired === true, 'статус ' + hi.status);
    ok(`порог ≥ 0,3 (${item.id}) молчит при 0,1`, lo.fired === false, 'статус ' + lo.status);
  } else {
    ok('нашлась запись с порогом ≥ 0,3', false);
  }
}

// --- 3. Голосование 2 из 3: H-LEVEL, барабан котла
{
  const item = DATA.items.find((i) => i.join === '2oo3');
  const tags = item.causes[0].tag;
  const vals = { 'LIAS-11401A': 200, 'LIAS-11401B': 200, 'LIAS-11401C': 50 };
  const r2 = evaluate(DATA, vals, makeMemory());
  const i2 = r2.list.find((x) => x.id === item.id);
  ok(`2oo3 (${item.id}) срабатывает при 2 из 3`, i2.fired === true, 'статус ' + i2.status);

  const r1 = evaluate(DATA, { 'LIAS-11401A': 200, 'LIAS-11401B': 50, 'LIAS-11401C': 50 }, makeMemory());
  const i1 = r1.list.find((x) => x.id === item.id);
  ok(`2oo3 (${item.id}) молчит при 1 из 3`, i1.fired === false, 'статус ' + i1.status);
}

// --- 4. Латч: сработала — держится после снятия условия, сбрасывается кнопкой
{
  const item = DATA.items.find((i) => i.reset && i.causes.some((c) => c.cond.type === 'analog' && !c.cond.setpointUnknown));
  const cause = item.causes.find((c) => c.cond.type === 'analog' && !c.cond.setpointUnknown);
  const tag = cause.tag;
  const fired = cause.cond.op === '<' ? cause.cond.value - 10 : cause.cond.value + 10;
  const clear = cause.cond.op === '<' ? cause.cond.value + 10 : cause.cond.value - 10;
  const mem = makeMemory();

  evaluate(DATA, { [tag]: fired }, mem);
  const held = evaluate(DATA, { [tag]: clear }, mem).list.find((x) => x.id === item.id);
  ok(`латч (${item.id}) держится без условия`, held.fired === true, 'статус ' + held.status);

  reset(mem, item.id);
  const after = evaluate(DATA, { [tag]: clear }, mem).list.find((x) => x.id === item.id);
  ok(`латч (${item.id}) снимается кнопкой сброса`, after.fired === false, 'статус ' + after.status);
}

// --- 5. BYPASS отключает запись
{
  const item = DATA.items.find((i) => i.bypass);
  const mem = makeMemory();
  bypass(mem, item.id, true);
  const r = evaluate(DATA, {}, mem);
  const it = r.list.find((x) => x.id === item.id);
  ok(`BYPASS (${item.id}) отключает блокировку`, it.status === 'bypassed', 'статус ' + it.status);
  ok(`BYPASS (${item.id}) не даёт следствий`, it.effects.length === 0);
}

// --- 6. Нет сигнала или закрытая уставка — unknown, а не «в норме»
{
  const r = evaluate(DATA, {}, makeMemory());
  const unknown = r.list.filter((x) => x.status === 'unknown').length;
  ok('без сигналов часть записей — unknown', unknown > 0, 'unknown ' + unknown + ' из ' + r.counts.total);
  ok('без сигналов ни одна запись не «в норме» ошибочно', r.list.every((x) => x.status !== 'active'));

  const closed = DATA.items.find((i) => i.causes.some((c) => c.cond.setpointUnknown));
  if (closed) {
    const it = evaluate(DATA, {}, makeMemory()).list.find((x) => x.id === closed.id);
    ok(`закрытая уставка (${closed.id}) даёт unknown`, it.status === 'unknown', 'статус ' + it.status);
  }
}

// --- 7. Состояние из модели: работающий завод держит насосы включёнными
{
  const m = solve({});
  const st = build(m);
  ok('насосы кислоты работают при выработке', st['PP-11302'] === true);
  const cov = coverage(DATA, st);
  ok('покрытие сигналов посчитано', cov.needed.length > 50, cov.needed.length + ' тегов, нет сигнала у ' + cov.missing.length);
}

// --- 8. Цепочка с расчётом: останов насоса 2-й абсорбции глушит воздуходувку
{
  const A = require('./apply.js');
  const m0 = solve({});
  // сигналы: насос 2-й абсорбции остановлен
  const st = build(m0, { 'YL-PP-11303': false });
  const r = evaluate(DATA, st, makeMemory());
  const proc = r.list.find((x) => x.id === 'B-PROC');
  ok('B-PROC срабатывает при останове PP-11303', proc.fired === true, 'статус ' + proc.status);

  const cons = A.constraints(r.effects);
  ok('следствие дошло до модели: горение снято', cons.noCombustion === true);
  const stoppedModel = A.run({}, cons);
  ok('останов воздуходувки даёт 0 кислоты', stoppedModel.acid.product_t_h === 0);
  ok('останов воздуходувки даёт 0 выброса', stoppedModel.stack.so2_mg === 0);

  // без блокировки цепочки нет
  const ok1 = evaluate(DATA, build(m0, { 'YL-PP-11303': true }), makeMemory()).list.find((x) => x.id === 'B-PROC');
  ok('при работающем PP-11303 блокировка не срабатывает', ok1.fired === false, 'статус ' + ok1.status);
}

// --- 9. Останов 2-й абсорбции без воздуходувки: SO3 уходит в трубу
{
  const A = require('./apply.js');
  const m = A.run({}, { noAbsorb1: false, noAbsorb2: true, notes: [] });
  const base = solve({});
  ok('без 2-й абсорбции SO3 в трубе растёт', m.stack.so3_mg > base.stack.so3_mg * 10, `было ${base.stack.so3_mg}, стало ${m.stack.so3_mg} мг/нм³`);
  ok('без 2-й абсорбции кислота падает', m.acid.h2so4_100_t_h < base.acid.h2so4_100_t_h);
}

// --- 10. Уставки из таблицы мониторинга DCS
{
  const S = require('./signals.js');
  const st = S.stats(DATA.items);
  ok('условий привязано к приборам DCS', st.found >= 30, st.found + ' из ' + st.total);
  ok('из них с уставками HH/H/L/LL', st.withSp >= 20, st.withSp);

  // перекрёстная проверка: схема говорит «< 500 мм», таблица DCS даёт LL = 500 мм
  const sp = S.setpoint({ text: '< 500 мм', op: '<' }, 'LIAS-11101');
  ok('LIAS-11101 → LT-11101, LL = 500 мм', sp && sp.value === 500 && sp.which === 'LL' && sp.tag === 'LT-11101',
    sp ? `${sp.tag} ${sp.which}=${sp.value} ${sp.unit}` : 'не найдено');

  // Закрытые в схемах уставки — это уставки защит (ПАЗ). В таблице мониторинга
  // DCS их приборов нет: это другой комплект. Проверяем именно это, чтобы не
  // создалось впечатление, будто пробел закрыт.
  let closed = 0, closedResolved = 0;
  for (const it of DATA.items) {
    for (const c of it.causes) {
      if (!c.cond.setpointUnknown) continue;
      closed++;
      if (S.setpoint(c.cond, c.tag)) closedResolved++;
    }
  }
  ok('закрытые уставки таблицей DCS не закрываются (это комплект ПАЗ)',
    closed > 0 && closedResolved === 0, `закрыто ${closed}, из них нашлось ${closedResolved}`);

  // чего нет в таблице — честно остаётся без уставки
  const none = S.setpoint({ text: '> ** °C', op: null, setpointUnknown: true }, 'VT-PP-11301');
  ok('вибрация VT- нет в таблице — уставки нет', none === null);
}

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Вычислитель блокировок работает.');
