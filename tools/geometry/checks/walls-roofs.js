'use strict';

// Аппараты, протыкающие стены и крыши зданий: пересечение по плану с частью
// здания (BLD[].parts) и верх аппарата выше конька.
module.exports = {
  name: 'walls-roofs',
  title: 'Аппараты сквозь стены и крыши',
  evaluate: () => {
    const T = window.__T;
    const out = [];
    const eq = [];
    T.scene.traverse((o) => {
      const u = o.userData;
      if (u && u.info && u.info.kind === 'eq') eq.push(o);
    });

    const parts = [];
    BLD.forEach((bd) => (bd.parts || []).forEach((pt) => {
      if (pt.open) return;
      const H = pt.eaves || pt.h || bd.h;
      parts.push({
        id: bd.id,
        x: pt.x || bd.x,
        y: pt.y || bd.y,
        H,
        ridge: pt.ridge || H,
      });
    }));

    const m = 0.2;
    eq.forEach((o) => {
      const B = new THREE.Box3().setFromObject(o);
      if (B.isEmpty()) return;
      const X0 = 5300 - B.max.z, X1 = 5300 - B.min.z;
      const Y0 = B.min.x + 2400, Y1 = B.max.x + 2400;
      parts.forEach((pt) => {
        const [x0, x1] = pt.x, [y0, y1] = pt.y;
        const ox = Math.min(X1, x1) - Math.max(X0, x0);
        const oy = Math.min(Y1, y1) - Math.max(Y0, y0);
        if (ox <= m || oy <= m) return;
        if (B.min.y > pt.ridge) return;
        const st = [];
        if (X0 < x0 - m && X1 > x0 + m) st.push('W(X' + x0 + ')');
        if (X0 < x1 - m && X1 > x1 + m) st.push('E(X' + x1 + ')');
        if (Y0 < y0 - m && Y1 > y0 + m) st.push('S(Y' + y0 + ')');
        if (Y0 < y1 - m && Y1 > y1 + m) st.push('N(Y' + y1 + ')');
        if (B.max.y > pt.ridge + 0.2 && ox > 1 && oy > 1) st.push('roof ' + B.max.y.toFixed(1) + '>' + pt.ridge);
        if (st.length) out.push([o.userData.tag, pt.id, st.join(' ')]);
      });
    });
    return out;
  },
  extract: (r) => {
    const seen = new Set();
    const lines = [];
    r.forEach((x) => {
      const k = x.join('|');
      if (seen.has(k)) return;
      seen.add(k);
      lines.push(`${x[0]}  ${x[1]}  ${x[2]}`);
    });
    return lines;
  },
};
