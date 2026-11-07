'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Движок времени тренажёра.
 *
 * Сделан по образцу промышленных тренажёров (в том числе того, что нам
 * показывали), но написан с нуля под нашу модель: фиксированный шаг, ускорение,
 * пауза, история параметров, тревоги с квитированием и журнал событий.
 *
 * Почему фиксированный шаг: модель считает «за секунду», а экран обновляется
 * как получится. Если шагать по реальному времени, при просадке кадров модель
 * поедет. Поэтому копим реальное время в acc и внутри выполняем целые шаги.
 *
 * Модуль ничего не знает про DOM: его можно проверять в Node.
 */

const DEFAULTS = {
  stepSeconds: 1,      // модельный шаг
  maxStepsPerFrame: 40, // защита от «спирали смерти» при долгой паузе
  historyEvery: 1,     // каждый N-й шаг пишем в историю
  historyLimit: 900,   // точек на тег (15 мин при шаге 1 с)
};

/**
 * @param {object} o
 *   compute: (controls) => plain      — расчёт модели
 *   controls: () => object            — текущие управления
 *   vessels: модуль ёмкостей (advance/list/forState)
 *   interlocks: { items, evaluate }   — набор блокировок
 *   series: (plain) => {tag: value}   — что писать в историю
 */
function create(o) {
  const opt = Object.assign({}, DEFAULTS, o || {});
  const series = opt.series || (() => ({}));

  const S = {
    t: 0,                 // модельное время, с
    speed: 1,             // ускорение
    paused: true,
    acc: 0,
    ticks: 0,
    history: new Map(),   // тег → [{t, v}]
    alarms: new Map(),    // id → {id, title, active, ack, since, cleared}
    events: [],           // [{t, kind, text}]
    timers: [],           // [{at, fn}]
    last: null,           // последний расчёт
  };

  const log = (kind, text) => {
    S.events.push({ t: S.t, kind, text });
    if (S.events.length > 300) S.events.shift();
  };

  const push = (tag, v) => {
    if (v == null || !isFinite(v)) return;
    if (!S.history.has(tag)) S.history.set(tag, []);
    const arr = S.history.get(tag);
    arr.push({ t: S.t, v: Math.round(v * 100) / 100 });
    if (arr.length > opt.historyLimit) arr.shift();
  };

  /** Один модельный шаг. */
  function tickOnce() {
    S.t += opt.stepSeconds;
    S.ticks++;
    try {
      S.last = opt.compute(opt.controls ? opt.controls() : {});
    } catch (e) {
      log('ОШИБКА', 'расчёт: ' + e.message);
      return;
    }
    if (opt.vessels && opt.vessels.advance) {
      opt.vessels.advance({ melt_t_h: S.last.sulfur_t_h || 0, burn_t_h: S.last.sulfur_t_h || 0 },
        opt.stepSeconds / 60);
    }
    if (S.ticks % opt.historyEvery === 0) {
      const vals = series(S.last);
      for (const [k, v] of Object.entries(vals)) push(k, v);
    }
    // отложенные события
    for (let i = S.timers.length - 1; i >= 0; i--) {
      if (S.t >= S.timers[i].at) {
        const fn = S.timers[i].fn;
        S.timers.splice(i, 1);
        try { fn(); } catch (e) { log('ОШИБКА', 'таймер: ' + e.message); }
      }
    }
    evaluateAlarms();
  }

  /** Тревоги: считаем по блокировкам и по границам процесса. */
  function evaluateAlarms() {
    if (!opt.interlocks || !opt.interlocks.evaluate) return;
    let res;
    try {
      res = opt.interlocks.evaluate(S.last);
    } catch (e) {
      return;
    }
    const seen = new Set();
    for (const item of (res.list || [])) {
      const id = item.id;
      seen.add(id);
      const active = item.status === 'active' || item.status === 'latched';
      const a = S.alarms.get(id);
      if (!a) {
        S.alarms.set(id, { id, title: item.title || id, active, ack: !active, since: active ? S.t : null, cleared: !active });
        if (active) log('ТРЕВОГА', (item.title || id) + ' — сработала');
      } else {
        if (active && !a.active) {
          a.active = true; a.ack = false; a.since = S.t; a.cleared = false;
          log('ТРЕВОГА', (item.title || id) + ' — сработала');
        } else if (!active && a.active) {
          a.active = false; a.cleared = true;
          log('ТРЕВОГА', (item.title || id) + ' — снялась');
        }
      }
    }
    // блокировка, которая исчезла из расчёта (условия стали неизвестны)
    for (const [id, a] of S.alarms) {
      if (!seen.has(id) && a.active) { a.active = false; a.cleared = true; }
    }
  }

  return {
    state: S,

    /** Продвинуть реальное время (мс). Возвращает число сделанных шагов. */
    advance(realMs) {
      if (S.paused) return 0;
      S.acc += (realMs / 1000) * S.speed;
      let n = 0;
      while (S.acc >= opt.stepSeconds && n < opt.maxStepsPerFrame) {
        S.acc -= opt.stepSeconds;
        tickOnce();
        n++;
      }
      if (n === opt.maxStepsPerFrame) S.acc = 0;   // догонять бесконечно не надо
      return n;
    },

    play() { S.paused = false; log('РЕЖИМ', 'пуск модели'); },
    pause() { S.paused = true; log('РЕЖИМ', 'пауза'); },
    setSpeed(x) { S.speed = Math.max(0.25, Math.min(20, x)); log('РЕЖИМ', 'ускорение ×' + S.speed); },
    reset() {
      S.t = 0; S.acc = 0; S.ticks = 0; S.history.clear(); S.alarms.clear(); S.events.length = 0;
      S.timers.length = 0; S.paused = true;
      log('РЕЖИМ', 'сброс модели');
    },

    /** Запланировать событие через dt секунд модельного времени. */
    after(seconds, fn) { S.timers.push({ at: S.t + seconds, fn }); },

    history(tag) { return S.history.get(tag) || []; },
    tags() { return [...S.history.keys()]; },

    /** Активные неквитированные тревоги. */
    activeAlarms() { return [...S.alarms.values()].filter((a) => a.active); },
    pendingAlarms() { return [...S.alarms.values()].filter((a) => a.active && !a.ack); },

    ack(id) {
      const a = S.alarms.get(id);
      if (a) { a.ack = true; log('КВИТ', a.title); }
    },
    ackAll() {
      let n = 0;
      for (const a of S.alarms.values()) if (a.active && !a.ack) { a.ack = true; n++; }
      if (n) log('КВИТ', 'квитировано тревог: ' + n);
      return n;
    },

    /** Снимок для интерфейса. */
    snap() {
      return {
        t: S.t, speed: S.speed, paused: S.paused,
        alarms: this.activeAlarms().length,
        pending: this.pendingAlarms().length,
        last: S.last,
      };
    },

    events: () => S.events.slice(-50),
  };
}

const API = { create };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinEngine = API;
})();
