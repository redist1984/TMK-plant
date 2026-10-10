/* PFD WZ-POT-262: библиотека схемных символов оборудования (векторные, в стиле схемы потоков).
   Каждый символ — функция (g, s): g — SVG-группа, s — параметры из pfd-data.js (sym[].p).
   Координаты — в пикселях листа PFD (см. tools/pfd/sym.py). */
(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';
function mk(t,a,p){const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
const P=(g,d,c)=>mk('path',{d,class:c||'sl'},g);
const R=(g,x,y,w,h,c,rx)=>mk('rect',Object.assign({x,y,width:w,height:h,class:c||'sb'},rx?{rx}:{}),g);
const L=(g,x1,y1,x2,y2,c)=>mk('line',{x1,y1,x2,y2,class:c||'sl'},g);
const G=(p,c)=>mk('g',c?{class:c}:{},p);
const poly=(g,pts,c)=>mk('polygon',{points:pts.map(p=>p.join(',')).join(' '),class:c||'sb'},g);
const T=(g,x,y,t,c)=>{const e=mk('text',{x,y,class:c||'sn'},g);e.textContent=t;return e};

/* вертикальный фланец (штуцер) сбоку: от стенки наружу */
function nozzle(g,x,y,dir,len,h){len=len||14;h=h||22;
  const xs=dir>0?x:x-len;R(g,xs,y-5,len,10,'sb');
  const xf=dir>0?x+len-4:x-len;R(g,xf,y-h/2,4,h,'sf')}

const S={};

/* ---------- кожухотрубный теплообменник (горизонтальный) ---------- */
S.hx=(g,s)=>{const h=s.y1-s.y0,ry=h/2,n=s.n||Math.max(5,Math.round(h/9)-1);
  P(g,`M${s.fa},${s.y0}H${s.fb}A${s.x1-s.fb},${ry} 0 0 1 ${s.fb},${s.y1}H${s.fa}A${s.fa-s.x0},${ry} 0 0 1 ${s.fa},${s.y0}Z`,'sb');
  R(g,s.ta,s.y0,s.tb-s.ta,h,'sx');
  for(let i=1;i<=n;i++){const y=s.y0+h*i/(n+1);L(g,s.ta,y,s.tb,y,'st')}
  L(g,s.fa,s.y0,s.fa,s.y1);L(g,s.fb,s.y0,s.fb,s.y1);
  L(g,s.ta,s.y0,s.ta,s.y1,'sl2');L(g,s.tb,s.y0,s.tb,s.y1,'sl2');
  if(s.sp){const m=(s.fa+s.ta)/2;L(g,m,s.y0,m,s.y1,'st')}};

/* ---------- котёл-утилизатор: барабан + жаротрубный пучок с газовой камерой ---------- */
S.boiler=(g,s)=>{const[dx0,dy0,dx1,dy1]=s.dr,[xl,xb,xe,xc,y0,y1]=s.sh,[f0,f1,xf]=s.fl,h=y1-y0,rx=Math.min(22,(dx1-dx0)/6),ry=(dy1-dy0)/2;
  s.ris.forEach(x=>R(g,x-s.rw/2,dy1-2,s.rw,y0-dy1+4,'sb'));
  P(g,`M${dx0+rx},${dy0}H${dx1-rx}A${rx},${ry} 0 0 1 ${dx1-rx},${dy1}H${dx0+rx}A${rx},${ry} 0 0 1 ${dx0+rx},${dy0}Z`,'sb');
  L(g,dx0+rx+4,dy0+2,dx0+rx+4,dy1-2,'st');L(g,dx1-rx-4,dy0+2,dx1-rx-4,dy1-2,'st');
  R(g,xl,y0,xb-xl,h,'sb');
  poly(g,[[xe,y0],[xc,f0],[xc,f1],[xe,y1]],'sb');
  R(g,xb,y0,xe-xb,h,'sb');R(g,xb,y0,xe-xb,h,'sx');
  const n=Math.round(h/7);for(let i=1;i<n;i++){const y=y0+h*i/n;L(g,xb,y,xe,y,'st')}
  L(g,xb,y0,xb,y1,'sl2');L(g,xe,y0,xe,y1,'sl2');
  R(g,xc,f0,xf-xc,f1-f0,'sb');};

/* ---------- колонна с насадкой (скруббер/абсорбер) ----------
   xm — ось; pr — правая половина контура сверху вниз [[полуширина,y],…] до wb;
   beds — слои каплеуловителя; bands — слои насадки-полос; spray — оросительный коллектор;
   pk — насадочная секция с крестом; wb — низ цилиндра; db — низ днища */
S.tower=(g,s)=>{const xm=s.xm,hw=s.hw,x0=xm-hw,x1=xm+hw,ds=s.db-s.wb;
  const pr=s.pr,right=pr.map(p=>[xm+p[0],p[1]]),left=pr.map(p=>[xm-p[0],p[1]]).reverse();
  let d='M'+right.map(p=>p.join(',')).join('L')+`L${x1},${s.wb}A${hw},${ds} 0 0 1 ${x0},${s.wb}L`+left.map(p=>p.join(',')).join('L')+'Z';
  P(g,d,'sb');
  if(s.bn){R(g,xm-s.bn,s.db-1,s.bn*2,9,'sb');L(g,xm,s.db+8,xm,s.db+16,'sl')}
  if(s.tn){R(g,xm-s.tn,s.pr[0][1]-9,s.tn*2,9,'sb')}
  if(s.beds){const b=s.beds,iw=hw*2-14,w=iw/b.n*0.62,gap=(iw-w*b.n)/(b.n-1);
    for(let i=0;i<b.n;i++)R(g,x0+7+i*(w+gap),b.y0,w,b.y1-b.y0,'sd');
    L(g,x0,b.y1+2,x1,b.y1+2,'sl2')}
  if(s.bands)s.bands.forEach(b=>{R(g,xm-s.bw,b[0],s.bw*2,b[1]-b[0],'sd')});
  if(s.spray){const y=s.spray,n=s.ns||7;L(g,x0,y,x1,y,'sl2');
    for(let i=0;i<n;i++){const x=x0+hw*2*(i+.5)/n;poly(g,[[x,y+1],[x-5,y+11],[x+5,y+11]],'sf')}}
  if(s.pk){const k=s.pk;
    R(g,x0,k.y0,hw*2,k.y1-k.y0,'sx');
    L(g,x0,k.y0,x1,k.y0,'sl2');
    L(g,x0+1,k.y0,x1-1,k.y1,'st');L(g,x1-1,k.y0,x0+1,k.y1,'st');
    P(g,`M${x0},${k.y1}Q${xm},${k.y1+k.sag*2} ${x1},${k.y1}`,'sl2')}
  if(s.duct)P(g,'M'+s.duct.map(p=>p.join(',')).join('L'),'sl');
  (s.side||[]).forEach(q=>nozzle(g,q[1]==='r'?x1:x0,q[0],q[1]==='r'?1:-1,q[2],q[3]));};

/* ---------- колонна-теплообменник с змеевиком (вертикальная, с крышей-конусом) ---------- */
S.col=(g,s)=>{const x0=s.x0,x1=s.x1,yt=s.yt,yb=s.yb,b=s.base;
  if(s.roof){const r=s.roof;poly(g,[[x0,yt],[r.x0,r.y],[r.x1,r.y],[x1,yt]],'sb');
    if(r.X){L(g,x0,yt,r.x1,r.y,'st');L(g,x1,yt,r.x0,r.y,'st')}
    if(r.pl)R(g,r.pl[0],r.pl[1],r.pl[2]-r.pl[0],r.pl[3]-r.pl[1],'sb',2)}
  if(b)P(g,`M${x0},${yt}H${x1}V${b.y0}H${b.x1}V${b.y1}H${x0}Z`,'sb');
  else R(g,x0,yt,x1-x0,yb-yt,'sb');
  if(s.dv)L(g,x0,s.dv,x1,s.dv,'sl');
  if(b&&b.d)L(g,x0,b.y0,x1,b.y0,'st');
  [].concat(s.co||[]).forEach(c=>{
    if(c.k==='z')P(g,'M'+c.pts.map(p=>p.join(',')).join('L'),'sc0');
    else{const r=(c.ys[1]-c.ys[0])/2,xs=c.rev?[c.xb,c.xa]:[c.xa,c.xb];let d=`M${xs[0]},${c.ys[0]}`;
      for(let i=0;i<c.ys.length;i++){const xe=xs[i%2===0?1:0];d+=`H${xe}`;
        if(i<c.ys.length-1)d+=`A${r},${r} 0 0 ${xe===c.xb?1:0} ${xe},${c.ys[i+1]}`}
      P(g,d,'sc')}
    (c.lead||[]).forEach(l=>L(g,l[0],l[1],l[2],l[1],'sc0'))});
  if(s.out)poly(g,s.out,'sb');
  if(s.fd)R(g,s.fd[0],s.fd[2],s.fd[1]-s.fd[0],5,'sf');};

/* ---------- вертикальный аппарат с рубашками (EX-11203/04) ---------- */
S.vx=(g,s)=>{const x0=s.x0,x1=s.x1;
  let top;
  if(s.cone)top=[[x0,s.ys],[s.cone.x0,s.cone.y],[s.cone.x1,s.cone.y],[x1,s.ys]];
  if(top)poly(g,top,'sb');
  else P(g,`M${x0},${s.ys}A${(x1-x0)/2},${s.dome} 0 0 1 ${x1},${s.ys}Z`,'sb');
  R(g,x0,s.ys,x1-x0,s.yb-s.ys,'sb');
  s.rings.forEach(r=>R(g,x0-s.rd,r[0],x1-x0+s.rd*2,r[1]-r[0],'sb',5));
  if(s.cone)R(g,s.cone.x0-2,s.cone.y-4,s.cone.x1-s.cone.x0+4,4,'sf')};

/* ---------- реактор с четырьмя слоями катализатора ---------- */
S.re=(g,s)=>{const[x0,y0,x1,y1]=s.b;R(g,x0,y0,x1-x0,y1-y0,'sb');
  s.beds.forEach(b=>{R(g,x0,b[0],x1-x0,b[1]-b[0],'sx');R(g,x0,b[0],x1-x0,b[1]-b[0],'sd2');T(g,(x0+x1)/2,(b[0]+b[1])/2,b[2],'sn2')});
  s.seps.forEach(y=>L(g,x0,y,x1,y,'sl'));
  s.beds.forEach(b=>{L(g,x0,b[0],x1,b[0],'sl2');L(g,x0,b[1],x1,b[1],'sl2')})};

/* ---------- сосуд горизонтальный/вертикальный с эллиптическими днищами ---------- */
S.hv=(g,s)=>{const h=s.y1-s.y0,rx=s.rx,ry=h/2;
  P(g,`M${s.x0+rx},${s.y0}H${s.x1-rx}A${rx},${ry} 0 0 1 ${s.x1-rx},${s.y1}H${s.x0+rx}A${rx},${ry} 0 0 1 ${s.x0+rx},${s.y0}Z`,'sb');
  if(!s.nofl){L(g,s.x0+rx,s.y0+1,s.x0+rx,s.y1-1,'st');L(g,s.x1-rx,s.y0+1,s.x1-rx,s.y1-1,'st')}
  if(s.dome){const d=s.dome;P(g,`M${d.x0},${s.y0+1}V${d.y0+(d.x1-d.x0)/2}A${(d.x1-d.x0)/2},${(d.x1-d.x0)/2} 0 0 1 ${d.x1},${d.y0+(d.x1-d.x0)/2}V${s.y0+1}Z`,'sb');
    R(g,d.x0-1,s.y0-1,d.x1-d.x0+2,4,'sb')}};
S.vv=(g,s)=>{const w=s.x1-s.x0,ry=s.ry;
  P(g,`M${s.x0},${s.y0}A${w/2},${ry} 0 0 1 ${s.x1},${s.y0}V${s.y1}A${w/2},${ry} 0 0 1 ${s.x0},${s.y1}Z`,'sb');
  L(g,s.x0,s.y0,s.x1,s.y0,'st');L(g,s.x0,s.y1,s.x1,s.y1,'st')};

/* ---------- ёмкость-резервуар (прямоугольная) ---------- */
S.tank=(g,s)=>{R(g,s.x0,s.y0,s.x1-s.x0,s.y1-s.y0,'sb',s.r||8);
  L(g,s.x0+8,s.y0+14,s.x1-8,s.y0+14,'st')};

/* ---------- центробежный насос / воздуходувка ---------- */
S.pump=(g,s)=>{const{cx,cy,r}=s;
  poly(g,[[cx-r*1.45,cy+r+s.bh],[cx+r*1.45,cy+r+s.bh],[cx+r*.55,cy+r*.8],[cx-r*.55,cy+r*.8]],'sb');
  if(s.vol)poly(g,s.vol,'sb');
  mk('circle',{cx,cy,r,class:'sb'},g);
  mk('circle',{cx,cy,r:r*.42,class:'sl2',fill:'none'},g);
  mk('circle',{cx,cy,r:r*.12,class:'sf'},g);
  L(g,cx-r*1.55,cy+r+s.bh+2,cx+r*1.55,cy+r+s.bh+2,'sl2');
  if(s.sn){R(g,s.sn[0]-9,s.sn[1],18,s.sn[2],'sb')}};

/* ---------- погружной вертикальный насос (чаша + вал + напорная колонна) ---------- */
S.sp=(g,s)=>{const[bx0,by0,bx1,by1]=s.bowl;
  L(g,s.sh,s.sh0,s.sh,by0,'sl');
  R(g,s.ri-4,s.ri0,8,by0-s.ri0,'sb');
  R(g,s.ri-12,s.fl-3,24,6,'sf');
  R(g,bx0,by0,bx1-bx0,by1-by0,'sb',(by1-by0)/2)};

/* ---------- дымовая труба на решётчатой башне ---------- */
S.stack=(g,s)=>{const xm=s.xm,w=s.w/2;
  const lt=s.lat,tw0=lt.w0/2,tw1=lt.w1/2,ys=lt.ys;
  const wd=(y)=>tw0+(tw1-tw0)*(y-ys[0])/(ys[ys.length-1]-ys[0]);
  L(g,xm-wd(ys[0]),ys[0],xm-wd(ys[ys.length-1]),ys[ys.length-1],'sl');
  L(g,xm+wd(ys[0]),ys[0],xm+wd(ys[ys.length-1]),ys[ys.length-1],'sl');
  ys.forEach((y,i)=>{L(g,xm-wd(y),y,xm+wd(y),y,'st');
    if(i){const y0=ys[i-1];L(g,xm-wd(y0),y0,xm+wd(y),y,'st');L(g,xm+wd(y0),y0,xm-wd(y),y,'st')}});
  P(g,`M${xm-w},${s.y0}V${s.y1-w}A${w},${w} 0 0 0 ${xm+w},${s.y1-w}V${s.y0}Z`,'sb');
  R(g,xm-w-3,s.y0-3,w*2+6,5,'sf');
  R(g,xm-lt.w1/2-4,ys[ys.length-1],lt.w1+8,4,'sf');
  if(s.duct)P(g,'M'+s.duct.map(p=>p.join(',')).join('L'),'sl');
  (s.arr||[]).forEach(a=>{const[x,y,dx,dy]=a;poly(g,[[x,y],[x-dx*14-dy*6,y-dy*14+dx*6],[x-dx*14+dy*6,y-dy*14-dx*6]],'sf')})};

/* ---------- печь (камера сжигания серы) ---------- */
S.fu=(g,s)=>{const[x0,y0,x1,y1]=s.b;
  R(g,x0,y0,x1-x0,y1-y0,'sb');
  s.pt.forEach(x=>{R(g,x-3,s.pt0,6,y1-s.pt0,'sx');L(g,x,s.pt0,x,y1,'sl')});
  const sx=x0-22;R(g,sx,y0-19,22,63,'sb');
  poly(g,[[sx-5,y0-39],[x0+5,y0-39],[x0,y0-19],[sx,y0-19]],'sb');
  L(g,sx+11,y0-39,sx+11,y0-19,'st');
  L(g,sx,y0+8,x0,y0+8,'st');L(g,sx,y0+26,x0,y0+26,'st');
  R(g,sx-2,y1-22,24,16,'sb');R(g,sx-8,y1-19,7,10,'sf');
  mk('path',{d:`M${x0+10},${y1-8}q10,-16 0,-30q16,10 18,30z`,class:'fire'},g)};

/* ---------- фильтр с сетчатой насадкой ---------- */
S.filter=(g,s)=>{R(g,s.x0,s.y0,s.x1-s.x0,s.y1-s.y0,'sd3',3);
  R(g,s.x0,s.y0,s.x1-s.x0,s.y1-s.y0,'sl0',3)};

/* ---------- система очистки (блок-схема, пунктир) ---------- */
S.dbox=(g,s)=>{mk('rect',{x:s.x0,y:s.y0,width:s.x1-s.x0,height:s.y1-s.y0,rx:5,class:'sdb'},g)};

const DEFS=`<pattern id="pfdH" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="var(--hatch)" stroke-width="2.4"/></pattern>
<pattern id="pfdD" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="var(--ink2)"/><path d="M0 0L6 6M6 0L0 6" stroke="var(--eqf)" stroke-width="1.2"/></pattern>
<pattern id="pfdN" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="var(--eqf)"/><path d="M0 0H12M0 0V12" stroke="var(--ink)" stroke-width="2.6"/></pattern>`;

window.PFDSYM={
  defs(svg){if(svg.querySelector('defs'))return;const d=document.createElementNS(NS,'defs');d.innerHTML=DEFS;svg.insertBefore(d,svg.firstChild)},
  draw(parent,sym){const g=G(parent,'sym');g.setAttribute('data-t',sym.tag);const f=S[sym.t];if(f)f(g,sym.p);return g}
};
})();
