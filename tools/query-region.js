// Габариты всех аппаратов в прямоугольнике плана: node tools/query-region.js x0 x1 y0 y1
const {chromium}=require('/opt/node-tools/node_modules/playwright');(async()=>{const [x0,x1,y0,y1]=process.argv.slice(2).map(Number);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(6000);
const r=await p.evaluate(([x0,x1,y0,y1])=>{const T=window.__T,out=[];for(const t in T.byTag){const bb=new THREE.Box3();T.byTag[t].forEach(g=>{g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh&&!(o.userData&&o.userData.flow)&&o.geometry&&o.geometry.type!=='ShapeGeometry')bb.expandByObject(o)})});if(bb.isEmpty())continue;
 const mn=[5300-bb.max.z,bb.min.x+2400,bb.min.y],mx=[5300-bb.min.z,bb.max.x+2400,bb.max.y];if(mx[0]<x0||mn[0]>x1||mx[1]<y0||mn[1]>y1)continue;out.push(t+' X'+mn[0].toFixed(1)+'..'+mx[0].toFixed(1)+' Y'+mn[1].toFixed(1)+'..'+mx[1].toFixed(1)+' H'+mn[2].toFixed(1)+'..'+mx[2].toFixed(1))}return out},[x0,x1,y0,y1]);
console.log(r.join('\n'));await b.close()})()
