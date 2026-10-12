// Габариты (Box3 в координатах плана X/Y/отм.) тел аппаратов по тегам: node tools/query-bbox.js XX-11501 TW-11304
const {chromium}=require('/opt/node-tools/node_modules/playwright');(async()=>{const tags=process.argv.slice(2);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(6000);
const r=await p.evaluate(tags=>{const T=window.__T;const out={};tags.forEach(t=>{const gs=T.byTag[t];if(!gs){out[t]=null;return}
 const parts=[];gs.forEach(g=>{g.updateMatrixWorld(true);g.traverse(o=>{if(o.isMesh&&!(o.userData&&o.userData.flow)&&o.geometry){const bb=new THREE.Box3().setFromObject(o);parts.push(bb)}})});
 const bb=new THREE.Box3();parts.forEach(x=>bb.union(x));const f=v=>[+(5300-v.z).toFixed(2),+(v.x+2400).toFixed(2),+v.y.toFixed(2)];
 // x_plan=5300-z, y_plan=2400+x, elev=y
 out[t]={min:[+(5300-bb.max.z).toFixed(2),+(bb.min.x+2400).toFixed(2),+bb.min.y.toFixed(2)],max:[+(5300-bb.min.z).toFixed(2),+(bb.max.x+2400).toFixed(2),+bb.max.y.toFixed(2)]}});return out},tags);
console.log(JSON.stringify(r,null,1));await b.close()})()
