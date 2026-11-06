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

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Вычислитель блокировок работает.');
