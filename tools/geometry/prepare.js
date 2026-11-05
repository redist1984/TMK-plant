#!/usr/bin/env node
/*
 * Готовит model_test.html — копию model.html, которая дополнительно выставляет
 * window.__T с внутренними объектами сцены. Нужен только проверкам геометрии:
 * в самом model.html этих объектов наружу не отдаётся намеренно.
 *
 * Запуск:  node tools/geometry/prepare.js [--print]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const MARKER = 'KIP.set=setKip;';
const EXPOSE =
  'window.__T={byTag,flowObjs,KIP,P,ptsOf,runsOf,rOf,camera,controls,flyTo,scene,CRANES};';

function prepare() {
  const src = fs.readFileSync(path.join(ROOT, 'model.html'), 'utf8');
  const at = src.indexOf(MARKER);
  if (at < 0) {
    throw new Error(`в model.html не найден маркер "${MARKER}" — обновите prepare.js`);
  }
  const cut = at + MARKER.length;
  const out = src.slice(0, cut) + '\n' + EXPOSE + src.slice(cut);
  fs.writeFileSync(path.join(ROOT, 'model_test.html'), out);
  return { bytes: out.length, at };
}

if (require.main === module) {
  const r = prepare();
  console.log(`model_test.html: ${(r.bytes / 1024).toFixed(0)} КБ, __T вставлен после маркера (позиция ${r.at})`);
  if (process.argv.includes('--print')) console.log(EXPOSE);
}

module.exports = { prepare, ROOT, MARKER, EXPOSE };
