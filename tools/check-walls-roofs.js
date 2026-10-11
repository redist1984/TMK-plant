const {chromium}=require('/opt/node-tools/node_modules/playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();await p.goto('http://localhost:8765/model_test.html');await p.waitForTimeout(6000);
const r=await p.evaluate(()=>{const T=window.__T,out=[];const eq=[];T.scene.traverse(o=>{const u=o.userData;if(u&&u.info&&u.info.kind==='eq')eq.push(o)});
 const parts=[];BLD.forEach(bd=>(bd.parts||[]).forEach(pt=>{if(pt.open)return;const H=pt.eaves||pt.h||bd.h;parts.push({id:bd.id,x:pt.x||bd.x,y:pt.y||bd.y,H,ridge:pt.ridge||H})}));
 const m=.2;
 eq.forEach(o=>{const B=new THREE.Box3().setFromObject(o);if(B.isEmpty())return;const X0=5300-B.max.z,X1=5300-B.min.z,Y0=B.min.x+2400,Y1=B.max.x+2400;
  parts.forEach(pt=>{const[x0,x1]=pt.x,[y0,y1]=pt.y;const ox=Math.min(X1,x1)-Math.max(X0,x0),oy=Math.min(Y1,y1)-Math.max(Y0,y0);if(ox<=m||oy<=m)return;if(B.min.y>pt.ridge)return;
   const st=[];if(X0<x0-m&&X1>x0+m)st.push('W(X'+x0+')');if(X0<x1-m&&X1>x1+m)st.push('E(X'+x1+')');if(Y0<y0-m&&Y1>y0+m)st.push('S(Y'+y0+')');if(Y0<y1-m&&Y1>y1+m)st.push('N(Y'+y1+')');
   const inside=X0>=x0-m&&X1<=x1+m&&Y0>=y0-m&&Y1<=y1+m;if(B.max.y>pt.ridge+.2&&ox>1&&oy>1)st.push('roof '+B.max.y.toFixed(1)+'>'+pt.ridge);
   if(st.length)out.push([o.userData.tag,pt.id,st.join(' ')])})});return out});
const seen=new Set();r.forEach(x=>{const k=x.join('|');if(!seen.has(k)){seen.add(k);console.log(x.join('  '))}});await b.close()})()
