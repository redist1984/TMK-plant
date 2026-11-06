'use strict';
// IIFE: файл подключается и как модуль Node, и как обычный <script>.
(function () {
/*
 * Температуры газа по тракту — из теплового расчёта.
 *
 * Что считается физикой (без подгонки):
 *   - температура в печи: адиабатическая по теплу горения и подогреву воздуха;
 *   - нагрев в каждой ступени конвертера: тепло конверсии делится на
 *     теплоёмкость газа при текущей температуре.
 *
 * Что задаётся уставкой (и это честно, так и работает АСУТП):
 *   - температуры на входе ступеней — их держат перегреватели и экономайзеры;
 *   - температура перед первой абсорбцией.
 *
 * Отсюда выходит полезная величина: сколько тепла должен снять аппарат между
 * ступенями. Это не подгонка, а требование баланса.
 */

const C = (typeof module !== 'undefined' && module.exports) ? require('./heatcap.js') : self.TwinTemps;

const K = 273.15;
const CP_S_LIQ = 28.2e-3;          // кДж/(моль·K), жидкая сера
const DH_BURN = 297.0;              // кДж/моль S
const DH_CONV = 99.0;               // кДж/моль SO2 → SO3

// Уставки входа ступеней по проекту (лист 3: потоки 9, 11, 14)
const SETPOINT = { stage1: 410, stage2: 445, stage3: 435, stage4: 311 };

function gasOf(model, which) {
  const g = model.gas;
  if (which === 'burner') return C.composition({ SO2: g.so2_burner_nm3, SO3: g.so3_burner_nm3, O2: g.o2_burner_nm3, N2: g.n2_burner_nm3 || 102942 * (model.load || 1) });
  return null;
}

/**
 * Полный расчёт температур по тракту.
 * @param {object} model результат TwinModel.solve()
 * @returns {object} температуры, теплосъёмы, отклонения от проекта
 */
function gasPath(model) {
  if (!model || model.stopped || model.error) return { stopped: true, points: [], duties: [] };

  const nS = (model.sulfur_t_h * 1000) / 32.06;          // кмоль/ч серы
  const nN2 = (model.gas.n2_burner_nm3 || 0) / 22.414;

  // --- печь
  // кислород на входе = остаток в газе + израсходованный: S+O2→SO2 (1 моль) и S+1,5O2→SO3
  const airIn = C.composition({
    O2: model.gas.o2_burner_nm3 + model.gas.so2_burner_nm3 + 1.5 * model.gas.so3_burner_nm3,
    N2: model.gas.n2_burner_nm3,
  });
  const burnerGas = C.composition({
    SO2: model.gas.so2_burner_nm3,
    SO3: model.gas.so3_burner_nm3,
    O2: model.gas.o2_burner_nm3,
    N2: model.gas.n2_burner_nm3,
  });
  const hAir = C.mixH(airIn, 398.15);                    // воздух 125 °C
  const hSulfur = nS * CP_S_LIQ * (408.15 - 298.15) * 1000;
  const qBurn = nS * DH_BURN * 1000;
  const Hburner = hAir + hSulfur + qBurn;
  const T_burner = C.TfromH(burnerGas, Hburner);

  const points = [
    { id: 'burner', name: 'Печь, выход', t: T_burner - K, design: 1080, computed: true },
  ];
  const duties = [];

  // --- котёл-утилизатор: сколько тепла снимает, чтобы дойти до уставки 374 °C
  const afterWhb = C.composition({ SO2: model.gas.so2_burner_nm3, SO3: model.gas.so3_burner_nm3, O2: model.gas.o2_burner_nm3, N2: model.gas.n2_burner_nm3 });
  const qWhb = C.mixH(afterWhb, T_burner) - C.mixH(afterWhb, 374 + K);
  duties.push({ id: 'whb', name: 'Котёл-утилизатор', mw: qWhb / 3.6e6, design: null, computed: true });
  points.push({ id: 'whb', name: 'После котла', t: 374, design: 374, computed: false, setpoint: true });

  // --- ступени конвертера: нагрев от тепла конверсии
  const st = model.stages || [];
  const inletSet = [SETPOINT.stage1, SETPOINT.stage2, SETPOINT.stage3, SETPOINT.stage4];
  const designOut = [608, 518, 457, 415];
  const stageNames = ['1-я ступень', '2-я ступень', '3-я ступень', '4-я ступень'];

  for (let i = 0; i < 4; i++) {
    const conv = st[i];
    if (!conv) continue;
    const cut = (conv.so2_in - conv.so2_out) / 22.414;            // кмоль SO2 превращено
    const gas = C.composition({
      SO2: conv.so2_out,
      SO3: conv.so3_out,
      O2: conv.o2,
      N2: model.gas.n2_burner_nm3,
    });
    const q = cut * DH_CONV * 1000;                               // кДж/ч
    const Tin = inletSet[i] + K;                                  // вход — уставка ступени
    const Tout = C.TfromH(gas, C.mixH(gas, Tin) + q);
    points.push({
      id: 'stage' + (i + 1),
      name: stageNames[i] + ', выход',
      t: Tout - K,
      design: designOut[i],
      computed: true,
      // 4-я ступень в проектном балансе не согласуется: рост 311 → 415 °C требует
      // ~104 K, а тепло конверсии 30,9 кмоль SO2 в 4900 кмоль газа даёт около 19 K.
      suspect: i === 3,
    });

    // сколько тепла надо снять после ступени, чтобы выйти на следующую уставку
    const nextIn = (i < 3 ? inletSet[i + 1] : 275) + K;           // 275 °C — вход 1-й абсорбции
    const duty = (C.mixH(gas, Tout) - C.mixH(gas, nextIn)) / 3.6e6;
    duties.push({
      id: 'cool' + (i + 1),
      name: i < 3 ? 'Охладить перед ' + (i + 2) + '-й ступенью' : 'Охладить перед 1-й абсорбцией',
      mw: duty > 0 ? duty : 0,
      design: null,
      computed: true,
    });
  }

  // --- сравнение с проектом (подозрительные точки считаем отдельно)
  const cmp = points
    .filter((p) => p.computed && p.design != null)
    .map((p) => ({
      id: p.id,
      model: round(p.t, 0),
      design: p.design,
      dev: round(((p.t - p.design) / p.design) * 100, 1),
      suspect: !!p.suspect,
    }));
  const solid = cmp.filter((c) => !c.suspect);

  return {
    stopped: false,
    points: points.map((p) => ({ id: p.id, name: p.name, t: round(p.t, 0), design: p.design, computed: p.computed, suspect: !!p.suspect })),
    duties: duties.map((d) => ({ id: d.id, name: d.name, mw: round(d.mw, 1) })),
    compare: cmp,
    maxDev: solid.length ? Math.max(...solid.map((c) => Math.abs(c.dev))) : 0,
  };
}

function round(v, d) { const k = 10 ** d; return Math.round(v * k) / k; }

const API = { gasPath, SETPOINT, DH_BURN, DH_CONV };
if (typeof module !== 'undefined' && module.exports) module.exports = API;
else self.TwinGasPath = API;
})();
