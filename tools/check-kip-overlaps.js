// Пересечения приборов слоя КИП с оборудованием, трубами и зданиями (кроме собственной трассы и аппарата-хозяина) и друг с другом.
// Нужен model_test.html = model.html + window.__T={byTag,flowObjs,KIP,P,ptsOf,runsOf,rOf,camera,controls,flyTo,scene} после «KIP.set=setKip;».
// Запуск: python3 -m http.server 8765 &  node tools/check-kip-overlaps.js [тег-приборов ...]
const {chromium}=require('/opt/node22/lib/node_modules/playwright');(async()=>{const only=process.argv.slice(2);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox']});
const p=await b.newPage();await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(9000);
const r=await p.evaluate(only=>{const T=window.__T,S=T.scene,K=T.KIP;const out=[];
 const kipSet=new Set();K.g.traverse(o=>kipSet.add(o));
 const owner=m=>{let x=m;while(x){if(x.userData&&x.userData.tag)return x.userData.tag;x=x.parent}return m.userData&&m.userData.flow?('труба '+(m.userData.flow.code||([m.userData.flow.ea||m.userData.flow.a,m.userData.flow.eb||m.userData.flow.b].map(x=>Array.isArray(x)?x[0]:x).join('>')))).slice(0,40):'?'};
 const isB=m=>{let x=m;while(x){if(x.userData&&x.userData.info&&x.userData.info.kind==='bldg')return true;x=x.parent}return false};
 const meshes=[];S.traverse(o=>{if(o.isMesh&&o.geometry&&o.visible!==false&&!kipSet.has(o)&&!(o.userData&&o.userData.dot)&&!isB(o)){o.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(o);if(!bb.isEmpty())meshes.push({o,bb})}});
 const rc=new THREE.Raycaster();const dirs=[new THREE.Vector3(1,0,0),new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1)];
 const inside=(pt,m)=>{let n=0;for(const d of dirs){rc.set(pt,d);rc.far=200;const h=rc.intersectObject(m.o,false);if(h.length%2===1)n++}return n>=2};
 K.items.forEach(it=>{const sp=it.sp;if(only.length&&!only.includes(sp.tag))return;
  const hf=sp.fo&&sp.fo.f;const hostTube=new Set();if(sp.fo&&sp.fo.tube){if(sp.fo.tube.traverse)sp.fo.tube.traverse(o=>hostTube.add(o));else hostTube.add(sp.fo.tube)}
  const hostEq=new Set();const he=sp.host&&sp.host.eq;if(he&&T.byTag[he])T.byTag[he].forEach(g=>g.traverse(o=>hostEq.add(o)));
  const pts=[];it.g.updateMatrixWorld(true);it.g.traverse(o=>{if(o.isMesh&&o.geometry&&!o.userData.kipHit){const pa=o.geometry.attributes.position;const st=Math.max(1,Math.floor(pa.count/14));for(let i=0;i<pa.count;i+=st)pts.push(new THREE.Vector3().fromBufferAttribute(pa,i).applyMatrix4(o.matrixWorld))}});
  const bad={};pts.forEach(pt=>{for(const m of meshes){if(hostEq.has(m.o)||hostTube.has(m.o)||(hf&&hf.code&&m.o.userData&&m.o.userData.flow&&m.o.userData.flow.code===hf.code))continue;if(!m.bb.containsPoint(pt))continue;if(inside(pt,m)){const w=owner(m.o);bad[w]=(bad[w]||0)+1;break}}});
  if(Object.keys(bad).length)out.push([sp.tag,bad]);
  // прибор с прибором
  const B=new THREE.Box3().setFromObject(it.g).expandByScalar(-.02);K.items.forEach(j=>{if(j===it||j.sp.tag<sp.tag)return;const C=new THREE.Box3().setFromObject(j.g).expandByScalar(-.02);if(B.intersectsBox(C))out.push([sp.tag,{['прибор '+j.sp.tag]:1}])})});
 return out},only);
console.log(r.length?r.map(x=>x[0]+' '+JSON.stringify(x[1])).join('\n'):'пересечений нет');await b.close()})();
