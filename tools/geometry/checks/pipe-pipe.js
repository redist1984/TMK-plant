'use strict';

// Трубы друг в друге: оси двух разных потоков ближе суммы радиусов дольше 1 м
// (не у концов трасс).
module.exports = {
  name: 'pipe-pipe',
  title: 'Пересечения труб между собой',
  evaluate: () => {
    const T = window.__T;
    const pts = [];
    const C = 1;
    const grid = new Map();
    T.flowObjs.forEach((fo, i) => {
      const r = fo.f.r || 0.1;
      const n = Math.ceil(fo.len / 0.25);
      for (let k = 0; k <= n; k++) {
        const t = k / n;
        const q = fo.path.getPointAt(t);
        const L = t * fo.len;
        const e = Math.min(L, fo.len - L);
        if (e < 1.5) continue;
        const rec = { i, x: q.x, y: q.y, z: q.z, r };
        const key = [Math.floor(q.x / C), Math.floor(q.y / C), Math.floor(q.z / C)].join();
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(rec);
        pts.push(rec);
      }
    });
    const pairs = {};
    const nm = (fo) => fo.f.s + ':' + String(fo.f.code || '').slice(0, 22) + ' ['
      + [fo.f.a, fo.f.b].map((e) => (Array.isArray(e) ? (typeof e[0] === 'string' ? e[0] : 'xyz') : e)).join('>') + ']';
    pts.forEach((a) => {
      const cx = Math.floor(a.x / C), cy = Math.floor(a.y / C), cz = Math.floor(a.z / C);
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
          for (let dz = -1; dz <= 1; dz++) {
            (grid.get([cx + dx, cy + dy, cz + dz].join()) || []).forEach((c) => {
              if (c.i <= a.i) return;
              const d = Math.hypot(a.x - c.x, a.y - c.y, a.z - c.z);
              if (d < (a.r + c.r) * 0.9) {
                const k = a.i + '|' + c.i;
                if (!pairs[k]) pairs[k] = { n: 0, at: [+(5300 - a.z).toFixed(1), +(a.x + 2400).toFixed(1), +a.y.toFixed(1)] };
                pairs[k].n++;
              }
            });
          }
    });
    const out = [];
    for (const k in pairs) {
      if (pairs[k].n * 0.25 >= 1) {
        const [i, j] = k.split('|');
        out.push([nm(T.flowObjs[i]), nm(T.flowObjs[j]), pairs[k].n * 0.25, pairs[k].at]);
      }
    }
    return out;
  },
  extract: (r) =>
    r.sort((a, b) => b[2] - a[2]).map((x) => `${x[2].toFixed(1)} м  ${x[0]} ↔ ${x[1]}  у [${x[3].join(', ')}]`),
};
