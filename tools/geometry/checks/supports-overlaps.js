'use strict';

// Опоры: аппарат «висит в воздухе» (ближайшая поверхность под ним дальше 1,05 м),
// взаимные пересечения аппаратов по объёму и аппараты, влезшие в стены зданий.
module.exports = {
  name: 'supports-overlaps',
  title: 'Опоры, пересечения аппаратов и стен',
  evaluate: () => {
    const T = window.__T;
    const S = T.scene;
    const eq = [], bl = [];
    S.traverse((o) => {
      const u = o.userData;
      if (u && u.info && u.tag) {
        if (u.info.kind === 'eq') eq.push(o);
        if (u.info.kind === 'bldg') bl.push(o);
      }
    });
    const meshes = [];
    S.traverse((o) => { if (o.isMesh) meshes.push(o); });
    const owner = (m) => {
      let x = m;
      while (x) {
        if (x.userData && x.userData.tag) return x;
        x = x.parent;
      }
      return null;
    };
    const rc = new THREE.Raycaster();
    const out = { float: [], ov: [], wall: [] };
    const bx = eq.map((o) => new THREE.Box3().setFromObject(o));

    eq.forEach((o, i) => {
      const B = bx[i];
      if (B.isEmpty() || B.min.y < 0.25) return;
      const c = B.getCenter(new THREE.Vector3());
      const sx = (B.max.x - B.min.x) * 0.3, sz = (B.max.z - B.min.z) * 0.3;
      let best = 1e9, who = '';
      for (const [dx, dz] of [[0, 0], [sx, sz], [-sx, sz], [sx, -sz], [-sx, -sz],
        [sx * 1.5, 0], [-sx * 1.5, 0], [0, sz * 1.5], [0, -sz * 1.5]]) {
        rc.set(new THREE.Vector3(c.x + dx, B.min.y + 0.7, c.z + dz), new THREE.Vector3(0, -1, 0));
        rc.far = 60;
        const h = rc.intersectObjects(meshes, false)
          .filter((hit) => owner(hit.object) !== o && !(hit.object.userData && hit.object.userData.flow));
        if (h.length && h[0].distance < best) {
          best = h[0].distance;
          const w = owner(h[0].object);
          who = w ? w.userData.tag : ('untagged@' + h[0].point.y.toFixed(2) + ':' + h[0].object.geometry.type);
        }
      }
      if (best > 1.05) out.float.push([o.userData.tag, +B.min.y.toFixed(2), +best.toFixed(2), who]);
    });

    const vol = (B) => (B.max.x - B.min.x) * (B.max.y - B.min.y) * (B.max.z - B.min.z);
    for (let i = 0; i < eq.length; i++)
      for (let j = i + 1; j < eq.length; j++) {
        if (eq[i].userData.tag === eq[j].userData.tag) continue;
        const I = bx[i].clone().intersect(bx[j]);
        if (I.isEmpty()) continue;
        const v = vol(I);
        const m = Math.min(vol(bx[i]), vol(bx[j]));
        if (v > 0.3 && v > 0.2 * m) {
          out.ov.push([eq[i].userData.tag, eq[j].userData.tag, +v.toFixed(1), +(v / m).toFixed(2)]);
        }
      }

    bl.forEach((g) => {
      const G = new THREE.Box3().setFromObject(g);
      eq.forEach((o, i) => {
        const B = bx[i];
        const I = B.clone().intersect(G);
        if (I.isEmpty()) return;
        const fr = vol(I) / vol(B);
        if (fr > 0.05 && fr < 0.9) out.wall.push([o.userData.tag, g.userData.tag, +fr.toFixed(2)]);
      });
    });
    return out;
  },
  extract: (r) => [
    ...r.float.map((x) => `висит: ${x[0]} низ ${x[1]} м, до опоры ${x[2]} м (${x[3]})`),
    ...r.ov.map((x) => `пересечение: ${x[0]} ↔ ${x[1]}, ${x[2]} м³ (${x[3]} от меньшего)`),
    ...r.wall.map((x) => `в стене: ${x[0]} в ${x[1]}, ${x[2]} объёма`),
  ],
};
