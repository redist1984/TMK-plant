'use strict';
/*
 * Проверки тревог: появление, квитирование, снятие, уровни из ёмкостей.
 */

const A = require('./alarms.js');

let failed = 0;
const ok = (n, c, e) => {
  if (!c) failed++;
  console.log((c ? 'OK  ' : 'ПЛОХО') + ' ' + n + (e ? ' — ' + e : ''));
};

const al = A.create();
const model = (so2, conv, load) => ({ stack: { so2_mg: so2 }, conversion: conv, load });

al.update(model(288, 99.92, 1.0), []);
ok('в норме тревог нет', al.list().length === 0, 'тревог ' + al.list().length);

al.update(model(1264, 99.92, 1.0), []);
ok('SO2 выше нормы — тревога', al.list().length === 1, al.list().map((x) => x.id).join(','));
ok('она не квитирована', al.pending().length === 1);

al.ackAll();
ok('после квитирования не ждёт', al.pending().length === 0);
ok('но тревога остаётся активной', al.list().length === 1);

al.update(model(200, 99.92, 1.0), []);
ok('условие ушло — тревога снялась', al.list().length === 0);

al.update(model(288, 99.5, 1.0), []);
ok('низкая конверсия — отдельная тревога', al.list().some((x) => x.id === 'conv'));

al.update(model(288, 99.92, 1.2), []);
ok('перегрузка — тревога нагрузки', al.list().some((x) => x.id === 'load'));

// уровни из модели ёмкостей
const lvl = (level) => ([{ tag: 'LT-11101', name: 'Чан', mode: 'calc', level, sp: { LL: 500, H: 2200 } }]);
al.reset();
al.update(model(288, 99.92, 1.0), lvl(1500));
ok('нормальный уровень — тихо', al.list().length === 0);
al.update(model(288, 99.92, 1.0), lvl(400));
ok('низкий уровень — тревога', al.list().some((x) => x.id === 'lvl-LT-11101'), al.list().map((x) => x.id).join(','));
ok('в тексте есть уставка', /LL 500/.test(al.list().find((x) => x.id === 'lvl-LT-11101').detail));

al.update(model(288, 99.92, 1.0), lvl(2300));
ok('высокий уровень — тоже тревога', al.list().some((x) => x.id === 'lvl-LT-11101'));

// повторное появление сбрасывает квитирование
al.ackAll();
al.update(model(288, 99.92, 1.0), lvl(1500));   // условие ушло — тревога снялась
ok('после снятия тревог нет', al.list().length === 0);
al.update(model(288, 99.92, 1.0), lvl(400));    // снова низкий уровень
ok('повтор после снятия снова ждёт квитирования', al.pending().length >= 1,
  'ожидают ' + al.pending().length);

console.log('');
if (failed) { console.log('ПРОВАЛ: ' + failed); process.exit(1); }
console.log('Тревоги работают.');
