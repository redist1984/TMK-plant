'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Тревоги процесса.
 *
 * Сделано без движка времени: тревоги пересчитываются на каждое изменение
 * расчёта, поэтому работают и без прокрутки модели. Когда движок включат,
 * он просто будет вызывать update() чаще.
 *
 * Тревога помнит три состояния: активна, квитирована, снялась. Квитирование
 * не убирает тревогу — оно только подтверждает, что оператор её видел;
 * пока условие держится, строка остаётся в списке.
 */

const LIMITS = {
  so2_mg: 300,        // мг/нм³, норма выброса
  conv_pct: 99.8,     // общая конверсия по проекту
  load_hi: 105,       // % от проектного расхода серы
  load_lo: 50,
};

function create() {
  const items = new Map();   // id → {id, title, detail, active, ack, since}
  let seq = 0;

  const set = (id, title, detail, active) => {
    const a = items.get(id);
    if (!a) {
      if (!active) return;
      items.set(id, { id, title, detail, active: true, ack: false, since: ++seq });
      return;
    }
    if (active && !a.active) { a.active = true; a.ack = false; a.since = ++seq; }
    else if (!active && a.active) { a.active = false; }
    a.detail = detail;
  };

  return {
    /** Пересчитать по текущему расчёту модели и уровням. */
    update(model, levels) {
      if (!model || model.error) return [];
      const so2 = model.stack ? model.stack.so2_mg : null;
      const conv = model.conversion;
      const load = model.load != null ? model.load * 100 : null;

      set('so2', 'Выброс SO₂ выше нормы',
        so2 != null ? Math.round(so2) + ' мг/нм³ при норме ' + LIMITS.so2_mg : '—',
        so2 != null && so2 > LIMITS.so2_mg);

      set('conv', 'Конверсия ниже проектной',
        conv != null ? conv + ' % при проекте ' + LIMITS.conv_pct : '—',
        conv != null && conv < LIMITS.conv_pct);

      set('load', 'Нагрузка вне проектного диапазона',
        load != null ? Math.round(load) + ' %' : '—',
        load != null && (load > LIMITS.load_hi || load < LIMITS.load_lo));

      // уровни из модели ёмкостей
      for (const v of (levels || [])) {
        if (v.mode !== 'calc') continue;
        const low = v.sp && v.sp.LL != null && v.level <= v.sp.LL;
        const high = v.sp && v.sp.H != null && v.level >= v.sp.H;
        set('lvl-' + v.tag, (low ? 'Низкий уровень' : 'Высокий уровень') + ': ' + v.name
          + ' (' + v.tag + ')',
          Math.round(v.level) + ' мм' + (v.sp && v.sp.LL != null ? ', уставка LL ' + v.sp.LL : ''),
          low || high);
      }
      return this.list();
    },

    /** Все активные, свежие сверху. */
    list() {
      return [...items.values()]
        .filter((a) => a.active)
        .sort((x, y) => (x.ack === y.ack ? y.since - x.since : x.ack ? 1 : -1));
    },
    pending() { return this.list().filter((a) => !a.ack); },
    ack(id) { const a = items.get(id); if (a) a.ack = true; },
    ackAll() { let n = 0; for (const a of items.values()) if (a.active && !a.ack) { a.ack = true; n++; } return n; },
    reset() { items.clear(); seq = 0; },
    LIMITS,
  };
}

const API = { create, LIMITS };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinAlarms = API;
})();
