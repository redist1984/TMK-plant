'use strict';
/*
 * Проверки движка времени: шаг, ускорение, история, таймеры, тревоги.
 * Всё считается без DOM — движок специально от него не зависит.
 */

const E = require('./engine.js');

let failed = 0;
const ok = (n, c, e) => {
  if (!c) failed++;
  console.log((c ? 'OK  ' : 'ПЛОХО') + ' ' + n + (e ? ' — ' + e : ''));
};

// простая модель: значение растёт на 1 в секунду
let value = 0;
const eng = E.create({
  compute: () => ({ v: value }),
  controls: () => ({}),
  series: (p) => ({ v: p.v }),
  interlocks: {
    evaluate: () => ({
      list: [{ id: 'X-1', title: 'Проверка', status: value > 5 ? 'active' : 'idle' }],
    }),
  },
});

ok('создан и на паузе', eng.state.paused === true);

// на паузе время не идёт
eng.advance(5000);
ok('на паузе шагов нет', eng.state.t === 0, 't=' + eng.state.t);

eng.play();
eng.advance(3000);
ok('3 секунды → 3 шага', eng.state.t === 3, 't=' + eng.state.t);
ok('история пишется', eng.history('v').length === 3, 'точек ' + eng.history('v').length);

// ускорение ×5
const before = eng.state.t;
eng.setSpeed(5);
eng.advance(1000);
ok('ускорение ×5 даёт 5 шагов', eng.state.t - before === 5, 'шагов ' + (eng.state.t - before));

// таймер
eng.setSpeed(1);
let fired = 0;
eng.after(2, () => { fired++; });
eng.advance(1000);
ok('таймер не сработал раньше времени', fired === 0);
eng.advance(1500);
ok('таймер сработал', fired === 1, 'раз: ' + fired);

// тревога: value ещё 0, но поднимем руками и прогоним
value = 10;
for (let i = 0; i < 3; i++) { eng.advance(1000); }
ok('тревога поднялась', eng.activeAlarms().length === 1, 'активных: ' + eng.activeAlarms().length);
ok('тревога ждёт квитирования', eng.pendingAlarms().length === 1);
eng.ackAll();
ok('после квитирования не ждёт', eng.pendingAlarms().length === 0);
ok('но остаётся активной', eng.activeAlarms().length === 1);

// снятие условия
value = 0;
for (let i = 0; i < 3; i++) { eng.advance(1000); }
ok('тревога снялась', eng.activeAlarms().length === 0);

// журнал и сброс
ok('журнал наполняется', eng.events().length > 3, 'записей ' + eng.events().length);
eng.reset();
ok('сброс обнуляет время и историю', eng.state.t === 0 && eng.history('v').length === 0);

// ограничение истории
const eng2 = E.create({ compute: () => ({ v: 1 }), series: () => ({ v: 1 }), historyLimit: 5 });
eng2.play();
eng2.advance(20000);
ok('история не растёт бесконечно', eng2.history('v').length === 5, 'точек ' + eng2.history('v').length);

console.log('');
if (failed) { console.log('ПРОВАЛ: ' + failed); process.exit(1); }
console.log('Движок времени работает.');
