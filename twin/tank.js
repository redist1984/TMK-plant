'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Ёмкость с уровнем: первая динамика в двойнике.
 *
 * До сих пор модель была стационарной. Уровень — величина, которая зависит от
 * времени: сколько пришло минус сколько ушло, делённое на площадь зеркала.
 *
 *   dh/dt = (q_приход − q_расход) · 1000 / (площадь · плотность)
 *
 * Уровень в миллиметрах, расходы в т/ч, площадь в м², плотность в кг/м³.
 * Шаг по времени явный: за один шаг уровень меняется на dh/dt · dt.
 *
 * Отсюда же берутся сигналы для блокировок по уровню: LL и H заданы в таблице
 * мониторинга DCS (например, LT-11101: LL = 500 мм, H = 2200 мм).
 */

const DEFAULT = {
  area_m2: 5.0,        // площадь зеркала чана фильтрации (параметр, не из проекта)
  density: 1792,       // кг/м³, жидкая сера при 135 °C
};

/** Скорость изменения уровня, мм/ч. */
function rate(net_t_h, area_m2, density) {
  if (!area_m2 || !density) return 0;
  return (net_t_h * 1e6) / (area_m2 * density);
}

/**
 * @param {object} t состояние ёмкости: {level, area_m2, density, LL, H, HH}
 * @param {object} flows {qIn_t_h, qOut_t_h}
 * @param {number} dt_min шаг, минут
 */
function step(t, flows, dt_min) {
  const area = t.area_m2 || DEFAULT.area_m2;
  const density = t.density || DEFAULT.density;
  const net = (flows.qIn_t_h || 0) - (flows.qOut_t_h || 0);
  const dh = rate(net, area, density) * (dt_min / 60);
  let level = (t.level || 0) + dh;
  if (level < 0) level = 0;

  const status = level <= (t.LL ?? -Infinity) ? 'low'
    : level >= (t.HH ?? Infinity) ? 'high-high'
      : level >= (t.H ?? Infinity) ? 'high'
        : 'normal';

  return {
    level: Math.round(level * 10) / 10,
    delta: Math.round(dh * 10) / 10,
    net_t_h: Math.round(net * 100) / 100,
    rate_mm_h: Math.round(rate(net, area, density) * 10) / 10,
    status,
    area_m2: area,
    density,
    LL: t.LL ?? null,
    H: t.H ?? null,
    HH: t.HH ?? null,
  };
}

/**
 * Сколько времени до уставки при текущем дисбалансе.
 * @returns {number|null} минут, или null если дисбаланса нет/уставка недостижима
 */
function timeTo(t, net_t_h, target) {
  if (target == null) return null;
  const r = rate(net_t_h, t.area_m2 || DEFAULT.area_m2, t.density || DEFAULT.density);
  if (!r) return null;
  const dLevel = target - (t.level || 0);
  if (dLevel === 0) return 0;
  if (Math.sign(dLevel) !== Math.sign(r)) return null;   // идём в другую сторону
  return Math.abs(dLevel / r) * 60;                      // минут
}

const API = { step, rate, timeTo, DEFAULT };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinTank = API;
})();
