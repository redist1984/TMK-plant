'use strict';
/*
 * Проверки уровней по аппаратам.
 *
 * Уставки — из таблицы мониторинга DCS, площади чанов — параметр модели.
 * Проверяем: аппараты на месте, уровни считаются, ручная установка работает,
 * логические метки блокировок получают значения.
 */

const V = require('./vessels.js');
const S = require('./signals.js');
const St = require('./state.js');
const DATA = require('./interlocks.data.js');

let failed = 0;
const ok = (name, cond, extra) => {
  if (!cond) failed++;
  console.log((cond ? 'OK  ' : 'ПЛОХО') + ' ' + name + (extra ? ' — ' + extra : ''));
};

const list = V.list({}, 'ru');
ok('аппаратов в панели не меньше 15', list.length >= 15, list.length);
ok('чаны фильтрации считаются моделью', list.filter((x) => x.mode === 'calc').length === 4);
ok('уставки пришли из DCS', list.some((x) => x.tag === 'LT-11101' && x.sp.LL === 500));

// продвижение уровня при дисбалансе
V.setLevel('LT-11101', 1500);
V.advance({ melt_t_h: 20.48, burn_t_h: 9 }, 60);
const after = V.list({}, 'ru').find((x) => x.tag === 'LT-11101');
ok('при притоке больше расхода уровень вырос', after.level > 1500, after.level + ' мм');
ok('уровень выше H даёт статус high', after.status === 'high' || after.status === 'high-high', after.status);

// ручная установка и статус по уставке
V.setLevel('LT-13101', 300);
const manual = V.list({}, 'ru').find((x) => x.tag === 'LT-13101');
ok('ручной уровень установлен', manual.level === 300);
ok('ниже LL — статус low', manual.status === 'low', 'LL ' + manual.sp.LL + ', уровень ' + manual.level);

// покрытие уровневых причин блокировок
const st = V.forState();
let total = 0;
let covered = 0;
for (const it of DATA.items) {
  for (const c of it.causes) {
    if (!/^(L|LIAS|LIA|LS)/.test(c.tag)) continue;
    total++;
    if (St.expandTag(c.tag).some((t) => st[t] !== undefined)) covered++;
  }
}
ok('уровневых причин закрыто больше половины', covered / total > 0.5, covered + ' из ' + total);

// без прибора — честно unknown
const noSignal = DATA.items
  .flatMap((i) => i.causes)
  .find((c) => c.tag === 'LS-11361');
ok('причина без прибора остаётся без сигнала', !!noSignal && !st['LS-11361']);

console.log('');
if (failed) {
  console.log('ПРОВАЛ: ' + failed);
  process.exit(1);
}
console.log('Уровни аппаратов считаются.');
