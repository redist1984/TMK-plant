// Трубы сквозь аппараты: точки трассы потока внутри тела оборудования (не своего).
// Запуск: python3 tools/mk_test.py; python3 -m http.server 8765; node tools/check-pipes-through-equipment.js
const {chromium}=require('/opt/node-tools/node_modules/playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(6000);
const r=await p.evaluate(()=>{const T=window.__T;const meshes=[];
 T.scene.traverse(o=>{if(o.isMesh&&!(o.userData&&o.userData.flow)&&o.geometry&&o.geometry.type!=='ShapeGeometry'&&o.visible){const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(m)m.side=THREE.DoubleSide});meshes.push(o)}});
 const owner=m=>{let x=m;while(x){if(x.userData&&x.userData.tag)return x.userData.tag;x=x.parent}return null};
 const rc=new THREE.Raycaster();const dirs=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]].map(d=>new THREE.Vector3(...d));
 const out={};
 T.flowObjs.forEach(fo=>{const n=Math.ceil(fo.len/0.4);for(let i=1;i<n;i++){const pt=fo.path.getPointAt(i/n);let tag=null,ok=true;
  for(const d of dirs){rc.set(pt,d);rc.far=40;const h=rc.intersectObjects(meshes,false);let f=null;for(const x of h){if(x.face){f=x;break}}
   if(!f){ok=false;break}const nrm=f.face.normal.clone().transformDirection(f.object.matrixWorld);if(nrm.dot(d)<=0){ok=false;break}
   const t=owner(f.object);if(!t||(tag&&t!==tag)){ok=false;break}tag=t}
  const ends=[fo.f.a,fo.f.b].map(e=>Array.isArray(e)&&typeof e[0]==='string'?e[0]:null);if(ok&&tag&&!ends.includes(tag)&&!/^b\d/.test(tag)&&!/^EXT-/.test(tag)){const k=(fo.f.code||fo.f.s)+'|'+tag;(out[k]=out[k]||{n:0,a:fo.f.a,b:fo.f.b,at:[+pt.x.toFixed(1),+pt.y.toFixed(1),+pt.z.toFixed(1)]}).n++}}});
 return out});
console.log(JSON.stringify(r,null,0).replace(/\},"/g,'},\n"'));console.log('ERRORS',JSON.stringify(errs));await b.close()})()
