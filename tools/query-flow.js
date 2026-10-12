// Точки трассы потока (план X/Y/отм.) по подстроке кода: node tools/query-flow.js CWS-11306 [шаг_м]
const {chromium}=require('/opt/node-tools/node_modules/playwright');(async()=>{const q=process.argv[2],st=+(process.argv[3]||2);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(6000);
const r=await p.evaluate(([q,st])=>{const T=window.__T;return T.flowObjs.filter(fo=>String(fo.f.code||'').includes(q)).map(fo=>{const pts=[];const n=Math.ceil(fo.len/st);for(let i=0;i<=n;i++){const v=fo.path.getPointAt(i/n);pts.push([+(5300-v.z).toFixed(2),+(v.x+2400).toFixed(2),+v.y.toFixed(2)])}return {code:fo.f.code,a:fo.f.a,b:fo.f.b,len:+fo.len.toFixed(1),pts}})},[q,st]);
console.log(JSON.stringify(r));await b.close()})()
