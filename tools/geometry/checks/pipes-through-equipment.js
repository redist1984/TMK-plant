'use strict';

// Трубы сквозь аппараты: точки трассы потока внутри тела оборудования,
// которое не является ни её концом, ни потоком с тем же кодом.
module.exports = {
  name: 'pipes-through-equipment',
  title: 'Трубы сквозь оборудование',
  evaluate: () => {
    const T = window.__T;
    const meshes = [];
    T.scene.traverse((o) => {
      if (o.isMesh && !(o.userData && o.userData.flow) && o.geometry
          && o.geometry.type !== 'ShapeGeometry' && o.visible) {
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => { if (m) m.side = THREE.DoubleSide; });
        meshes.push(o);
      }
    });
    const owner = (m) => {
      let x = m;
      while (x) {
        if (x.userData && x.userData.tag) return x.userData.tag;
        x = x.parent;
      }
      return null;
    };
    const rc = new THREE.Raycaster();
    const dirs = [[1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]].map((d) => new THREE.Vector3(...d));
    const out = {};
    T.flowObjs.forEach((fo) => {
      const n = Math.ceil(fo.len / 0.4);
      for (let i = 1; i < n; i++) {
        const pt = fo.path.getPointAt(i / n);
        let tag = null, ok = true;
        for (const d of dirs) {
          rc.set(pt, d);
          rc.far = 40;
          const hits = rc.intersectObjects(meshes, false);
          let f = null;
          for (const x of hits) { if (x.face) { f = x; break; } }
          if (!f) { ok = false; break; }
          const nrm = f.face.normal.clone().transformDirection(f.object.matrixWorld);
          if (nrm.dot(d) <= 0) { ok = false; break; }
          const t = owner(f.object);
          if (!t || (tag && t !== tag)) { ok = false; break; }
          tag = t;
        }
        const ends = [fo.f.a, fo.f.b].map((e) => (Array.isArray(e) && typeof e[0] === 'string' ? e[0] : null));
        if (ok && tag && !ends.includes(tag) && !/^b\d/.test(tag) && !/^EXT-/.test(tag)) {
          const k = (fo.f.code || fo.f.s) + '|' + tag;
          (out[k] = out[k] || { n: 0, a: fo.f.a, b: fo.f.b, at: [+pt.x.toFixed(1), +pt.y.toFixed(1), +pt.z.toFixed(1)] }).n++;
        }
      }
    });
    return out;
  },
  extract: (r) =>
    Object.entries(r).map(([k, v]) => `${k}  ×${v.n}  у [${v.at.join(', ')}]`),
};
