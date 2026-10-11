// Подписи линий схемы потоков: пересечение плашки подписи с чужими линиями и блоками.
// node tools/check-flow-labels.js [--fix]
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../flow.html','utf8');
const grab=n=>{const i=s.indexOf('const '+n+' = [');const st=s.indexOf('[',i);let d=0,j=st;for(;j<s.length;j++){if(s[j]==='[')d++;else if(s[j]===']'){d--;if(!d)break}}return eval(s.slice(st,j+1))};
const NODES=grab('NODES'),EDGES=grab('EDGES');
const nodes=NODES.map(n=>({id:n[0],x:n[2],y:n[3],w:n[4],h:n[5]}));
const segs=[];EDGES.forEach((e,i)=>{for(let k=0;k<e[1].length-1;k++){const a=e[1][k],b=e[1][k+1];segs.push({i,x1:Math.min(a[0],b[0]),x2:Math.max(a[0],b[0]),y1:Math.min(a[1],b[1]),y2:Math.max(a[1],b[1])})}});
const box=(o)=>({x:o.lx-4,y:o.ly-11,w:o.label.length*5.5+16,h:15});
const hitSeg=(b,i)=>segs.filter(g=>g.i!==i&&g.x2>=b.x&&g.x1<=b.x+b.w&&g.y2>=b.y&&g.y1<=b.y+b.h).length;
const hitNode=b=>nodes.filter(n=>n.x<b.x+b.w&&n.x+n.w>b.x&&n.y<b.y+b.h&&n.y+n.h>b.y).length;
const labs=EDGES.map((e,i)=>({i,o:e[2]||{},e})).filter(l=>l.o.label);
const boxes=labs.map(l=>box(l.o));
const hitLab=(b,k)=>boxes.filter((c,m)=>m!==k&&c.x<b.x+b.w&&c.x+c.w>b.x&&c.y<b.y+b.h&&c.y+c.h>b.y).length;
let bad=0;labs.forEach((l,k)=>{const b=boxes[k],h=[hitSeg(b,l.i),hitNode(b),hitLab(b,k)];if(h.some(x=>x)){bad++;console.log(l.i,JSON.stringify(l.o.label),'lx',l.o.lx,'ly',l.o.ly,'линий/блоков/подписей',h.join('/'))}});
console.log('подписей',labs.length,'с наложением',bad);
// подбор свободного места: сетка 6 px, не дальше 45 px от своей линии
if(process.argv.includes('--fix'))labs.forEach((l,k)=>{const b0=boxes[k];if(!(hitSeg(b0,l.i)||hitNode(b0)||hitLab(b0,k)))return;const W=l.o.label.length*5.5+16;let best=null;const P=l.e[1];
 const dEdge=(x,y)=>{let m=1e9;for(let q=0;q<P.length-1;q++){const a=P[q],c=P[q+1];const dx=Math.max(Math.min(a[0],c[0])-x,0,x-Math.max(a[0],c[0])),dy=Math.max(Math.min(a[1],c[1])-y,0,y-Math.max(a[1],c[1]));m=Math.min(m,Math.hypot(dx,dy))}return m};
 for(let lx=l.o.lx-250;lx<=l.o.lx+250;lx+=6)for(let ly=l.o.ly-120;ly<=l.o.ly+120;ly+=6){const b={x:lx-4,y:ly-11,w:W,h:15};
  const d=Math.min(dEdge(b.x+b.w/2,b.y+b.h/2),dEdge(b.x,b.y+b.h/2),dEdge(b.x+b.w,b.y+b.h/2));if(d>45)continue;
  const h=hitSeg(b,l.i)+hitNode(b)+hitLab(b,k);const sc=h*1000+d+Math.hypot(lx-l.o.lx,ly-l.o.ly)/10;if(!best||sc<best.sc)best={sc,h,lx,ly}}
 console.log('->',l.i,JSON.stringify(l.o.label),JSON.stringify(best))});
