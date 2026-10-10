#!/usr/bin/env python3
"""Сборка вкладки PFD: python3 tools/pfd/build.py <WZ-POT-262.pdf>
Требуется: poppler (pdfimages), numpy, pillow, opencv-python-headless, scikit-image.
Результат:
  pfd/pfd-data.js        — векторная схема (линии аппаратов, трубы, стрелки, ромбы, подписи), потоки, карточки
  pfd/scan/sheet1..3.jpg — очищенный скан (только для сверки: кнопка «Скан» во вкладке)
Разметка (зоны аппаратов, направления потоков, пунктиры, подписи) — в eqboxes.py и manual.py."""
import sys, os, json, subprocess, tempfile, re
import numpy as np, cv2
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
sys.path.insert(0,HERE)
import trace as T
import vec
from eqboxes import EQ
from sym import SYM,targets
import tables as TB
import manual as M

pdf=sys.argv[1]; OUT=os.path.join(ROOT,'pfd'); os.makedirs(os.path.join(OUT,'scan'),exist_ok=True)
tmp=tempfile.mkdtemp(prefix='pfd_'); T.SHEET_DIR=tmp
subprocess.check_call(['pdfimages','-j',pdf,os.path.join(tmp,'im')])
IMG={'1':'im-002.jpg','2':'im-000.jpg','3':'im-001.jpg'}   # лист основной надписи → страница PDF
CROP=(220,170,3230,2310)
W,H=CROP[2]-CROP[0],CROP[3]-CROP[1]
for sh,f in IMG.items():
    a=np.asarray(Image.open(os.path.join(tmp,f)).convert('RGB')).astype(np.float32)
    g=np.clip((a[...,0]-70)/(238-70),0,1)*255      # канал R: красная печать гаснет
    im=Image.fromarray(g.astype(np.uint8)).crop(CROP)
    im.save(os.path.join(tmp,f'sheet{sh}.png'))
    im.resize((W*2//3,H*2//3),Image.LANCZOS).save(os.path.join(OUT,'scan',f'sheet{sh}.jpg'),quality=72,optimize=True)

def diamonds(sh):
    g=cv2.imread(os.path.join(tmp,f'sheet{sh}.png'),0)
    cs,_=cv2.findContours((g<140).astype(np.uint8)*255,cv2.RETR_LIST,cv2.CHAIN_APPROX_SIMPLE)
    out=[]
    for c in cs:
        a=cv2.contourArea(c)
        if a<500 or a>5000: continue
        p=cv2.approxPolyDP(c,0.06*cv2.arcLength(c,True),True)
        if len(p)!=4: continue
        (cx,cy),(w,h),ang=cv2.minAreaRect(c)
        if abs(w-h)>0.2*max(w,h) or not 30<abs(ang)%90<60: continue
        if all(abs(cx-d[0])+abs(cy-d[1])>10 for d in out): out.append((int(cx),int(cy)))
    return out
def tosheet(b): return [2*b[0]-220,2*b[1]-170,2*b[2]-220,2*b[3]-170]
def dbox(p,b):   # расстояние от точки до прямоугольника
    dx=max(b[0]-p[0],0,p[0]-b[2]); dy=max(b[1]-p[1],0,p[1]-b[3]); return (dx*dx+dy*dy)**.5

APP={'FR-11301':'SM-11301','PP-11304':'PP-11304AB','DA-11401':'DA-114.101','PP-11401':'PP-114.101AB'}
streams={}; sheets=[]; RINGS={}
CUT={'1':1262,'2':1462,'3':1420}   # ниже — подписи под схемой и таблицы (рисуем свои)
src=open(os.path.join(ROOT,'model.html'),encoding='utf8').read().split('\n')
DATA=json.loads([l for l in src if l.startswith('const DATA = ')][0][len('const DATA = '):].rstrip(';'))

def kind_of(sh,sid):
    if sh=='1': return 'air' if sid<=4 else 'sulfur' if sid==50 else 'alkali' if sid in (72,74) else 'water' if sid==73 else 'gas'
    if sh=='2': return 'sulfur' if sid==50 else 'acid' if 51<=sid<=71 else 'water'
    return 'steam' if sid in (109,110,111) else 'steamlp' if sid in (113,115,116) else 'water'

for sh in '123':
    segs,members=T.build(sh)
    d=diamonds(sh)
    pos={M.ID[sh][i]:d[i] for i in M.ID[sh]}; pos.update(M.MAN[sh])
    boxes={t:tosheet(b) for t,b in EQ[sh].items()}
    # --- трассировка потоков
    trace={}
    for sid,(x,y) in pos.items():
        if sh=='3' and sid in M.REF3: trace[sid]=[]; continue
        trace[sid]=T.trace(segs,members,x,y)
    owner={}
    for sid,order in trace.items():
        for k in order:
            c=owner.get(k)
            if c is None or (pos[sid][0]-(segs[k]['a']+segs[k]['b'])/2)**2<(pos[c][0]-(segs[k]['a']+segs[k]['b'])/2)**2: owner[k]=sid
    # --- продолжение: неразмеченные куски, связанные с потоком (участки магистрали между тройниками и т.п.)
    ext={}
    def near_outline(i):
        (x1,y1),(x2,y2)=T.pts(segs[i])
        for b in boxes.values():
            if segs[i]['o']=='h' and (abs(y1-b[1])<=9 or abs(y1-b[3])<=9) and b[0]-9<=x1<=b[2]+9 and b[0]-9<=x2<=b[2]+9: return True
            if segs[i]['o']=='v' and (abs(x1-b[0])<=9 or abs(x1-b[2])<=9) and b[1]-9<=y1<=b[3]+9 and b[1]-9<=y2<=b[3]+9: return True
        return False
    stack=list(owner.items())
    while stack:
        k,sid=stack.pop()
        for nd in segs[k]['n']:
            for j in members[nd]:
                if j not in owner and j not in ext and not near_outline(j):
                    ext[j]=sid; stack.append((j,sid))
    # --- привязка углов: общий узел → точное пересечение
    for nd,mem in members.items():
        hs=[segs[i]['c'] for i in mem if segs[i]['o']=='h']; vs=[segs[i]['c'] for i in mem if segs[i]['o']=='v']
        nx=float(np.mean(vs)) if vs else None; ny=float(np.mean(hs)) if hs else None
        for i in mem:
            s=segs[i]; ei=s['n'].index(nd)
            if s['o']=='h' and nx is not None: s['a' if ei==0 else 'b']=nx
            if s['o']=='v' and ny is not None: s['a' if ei==0 else 'b']=ny
    def P(i): return [round(v) for p in T.pts(segs[i]) for v in p]
    # --- концы потоков и стрелки направления
    ends={}
    for sid,order in trace.items():
        cnt={}
        for k in order:
            for nd in segs[k]['n']: cnt[nd]=cnt.get(nd,0)+1
        ends[sid]=[nd for nd,c in cnt.items() if c==1 or len(members[nd])!=2]
    nodepos={}
    for k,s in enumerate(segs):
        for ei,p in enumerate(T.pts(s)): nodepos[s['n'][ei]]=p
    def end_dir(nd):
        for k in members[nd]:
            s=segs[k]; ei=s['n'].index(nd)
            if k in trace_all: pass
            return (1 if ei==1 else -1,0) if s['o']=='h' else (0,1 if ei==1 else -1)
    trace_all=set(k for o in trace.values() for k in o)
    def free_end(nd,sid):
        p=nodepos[nd]; return len(members[nd])==1 and all(dbox(p,b)>40 for b in boxes.values())
    def dist(nd,sid,spec):
        p=nodepos[nd]
        if spec in ('IN','OUT'): return 0 if free_end(nd,sid) else 9999
        if isinstance(spec,tuple): return ((p[0]-spec[0])**2+(p[1]-spec[1])**2)**.5
        return dbox(p,boxes[spec]) if spec in boxes else 9999
    arrows=[]; warn=[]
    for sid,(srcs,dst) in M.DIR[sh].items():
        es=ends.get(sid,[])
        if len(es)<2: warn.append(('нет концов',sh,sid)); continue
        ed=min(es,key=lambda n:dist(n,sid,dst)); es2=[n for n in es if n!=ed]
        es_=min(es2,key=lambda n:dist(n,sid,srcs)) if es2 else None
        if dist(ed,sid,dst)>140: warn.append(('далеко приёмник',sh,sid,dst,round(dist(ed,sid,dst))))
        if es_ is not None and dist(es_,sid,srcs)>140: warn.append(('далеко источник',sh,sid,srcs,round(dist(es_,sid,srcs))))
        p=nodepos[ed]; dx,dy=end_dir(ed)
        # направление — вдоль крайнего куска потока, наружу от трубы
        for k in trace[sid]:
            if ed in segs[k]['n']:
                s=segs[k]; ei=s['n'].index(ed); dx,dy=((1 if ei==1 else -1),0) if s['o']=='h' else (0,(1 if ei==1 else -1)); break
        arrows.append([round(p[0]),round(p[1]),dx,dy,kind_of(sh,sid),sid])
    # --- стрелки по скану на свободных концах (где на чертеже есть наконечник)
    g=cv2.imread(os.path.join(tmp,f'sheet{sh}.png'),0)
    bw=(g<150).astype(np.uint8)
    op=cv2.morphologyEx(bw,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(7,7)))
    n,lab,st,cen=cv2.connectedComponentsWithStats(op,connectivity=8)
    blobs=[(cen[i][0],cen[i][1]) for i in range(1,n) if 40<=st[i][4]<=500 and st[i][2]<45 and st[i][3]<45]
    drawn=set(trace_all)|set(ext)
    for k in drawn:
        s=segs[k]
        for ei,p in enumerate(T.pts(s)):
            nd=s['n'][ei]
            if len(members[nd])!=1: continue
            if any(abs(a[0]-p[0])+abs(a[1]-p[1])<24 for a in arrows): continue
            if any((bx-p[0])**2+(by-p[1])**2<=14**2 for bx,by in blobs):
                dx,dy=((1 if ei==1 else -1),0) if s['o']=='h' else (0,(1 if ei==1 else -1))
                sid=owner.get(k,ext.get(k)); arrows.append([round(p[0]),round(p[1]),dx,dy,kind_of(sh,sid),sid,'e'])
    # --- какие аппараты рядом с потоком
    eq=[]
    for t,b in boxes.items():
        near=[]
        for sid,(x,y) in pos.items():
            if sh=='3' and sid in M.REF3: continue
            hit=(b[0]-40<=x<=b[2]+40 and b[1]-40<=y<=b[3]+40)
            for k in trace[sid]:
                for p in T.pts(segs[k]):
                    if b[0]-24<=p[0]<=b[2]+24 and b[1]-24<=p[1]<=b[3]+24: hit=True
            if hit: near.append(sid)
        eq.append(dict(tag=t,app=APP.get(t,t),box=b,streams=sorted(near)))
    # --- линии аппаратов: векторизация без труб, текста и ромбов
    drop=np.zeros(g.shape,np.uint8)
    for k in drawn:
        (a,b_),(c,e)=T.pts(segs[k]); cv2.line(drop,(int(a),int(b_)),(int(c),int(e)),255,13)
    for sid,(x,y) in pos.items(): cv2.circle(drop,(int(x),int(y)),36,255,-1)
    for k,s in enumerate(segs):                      # подчёркивания подписей: одиночные короткие горизонтали
        if k in drawn or s['o']!='h' or s['b']-s['a']>300: continue
        if all(len(members[nd])==1 for nd in s['n']):
            (a,b_),(c,e)=T.pts(s)
            if any(bx[0]-12<=a and c<=bx[2]+12 and bx[1]-12<=b_<=bx[3]+12 for bx in boxes.values()): continue
            cv2.line(drop,(int(a),int(b_)),(int(c),int(e)),255,11)
    b0=(g<165).astype(np.uint8); b0[drop>0]=0
    n,lab,st,cen=cv2.connectedComponentsWithStats(b0,connectivity=8)
    dil=cv2.dilate(b0,np.ones((3,3),np.uint8),iterations=2)
    n2,lab2,st2,_=cv2.connectedComponentsWithStats(dil,connectivity=8)
    rings=[]
    for i in range(1,n2):
        x,y,w,h,a=st2[i]
        if 34<=w<=72 and 34<=h<=72 and abs(w-h)<=10 and int(b0[y:y+h,x:x+w].sum())<0.62*w*h*0.5+0.1*w*h: rings.append((x,y,w,h))
    RINGS[sh]=[(x+w//2,y+h//2,max(w,h)//2) for x,y,w,h in rings]
    inring=lambda cx,cy:False
    text=np.zeros_like(drop)
    for i in range(1,n):
        x,y,w,h,a=st[i]
        if min(w,h)<=6 and max(w,h)>=30 and any(bx[0]<=x+w/2<=bx[2] and bx[1]<=y+h/2<=bx[3] for bx in boxes.values()): continue   # тонкие штрихи внутри аппарата — линии рисунка, не текст
        if w<=62 and h<=40 and not inring(x+w/2,y+h/2):
            if not (20<=w<=36 and 14<=h<=34 and a/(w*h)>0.42): text[lab==i]=255
    drop|=cv2.dilate(text,np.ones((3,3),np.uint8))
    drop[CUT[sh]:,:]=255; drop[:,:178]=255; drop[:,2915:]=255; drop[:112,:]=255
    for tag,t,p,z in SYM.get(sh,[]):
        for q in (z if isinstance(z[0],list) else [z]): drop[q[1]:q[3],q[0]:q[2]]=255      # контур этого аппарата рисует символ
    paths,fills=vec.vectorize(g,drop)
    art='M'.join('%d %dL'%(p[0][0],p[0][1])+'L'.join('%d %d'%(x,y) for x,y in p[1:]) for p in paths if len(p)>1)
    art='M'+art
    fillp=''.join('M'+'L'.join('%d %d'%(x,y) for x,y in f)+'Z' for f in fills)
    pipes=[]
    for k in sorted(drawn):
        sid=owner.get(k); mainline=k in owner
        sid2=sid if mainline else ext[k]
        pipes.append([sid2 if mainline else 0,kind_of(sh,sid2),*P(k)])
    # выпрямляем «ступеньки» на выводах: короткий кусок той же линии, сдвинутый по y на 12 px или меньше (скан), ставим на линию
    for a in pipes:
        if a[3]!=a[5]: continue
        for q in pipes:
            if q is a or q[0]!=a[0] or q[1]!=a[1] or q[3]!=q[5] or q[3]==a[3] or abs(q[3]-a[3])>12: continue
            if abs(a[4]-a[2])>abs(q[4]-q[2]): continue
            gap=min(abs(a[2]-q[4]),abs(a[2]-q[2]),abs(a[4]-q[2]),abs(a[4]-q[4]))
            if gap<=16:
                a[3]=a[5]=q[3]
                if a[2]>q[4]: a[2]=q[4]
                elif a[4]<q[2]: a[4]=q[2]
                break
    # концы труб и стрелок, не дошедшие до корпуса или штуцера символа (скан обрывал их у фланца), дотягиваем до него
    tg=[r for tag,t,p,z in SYM.get(sh,[]) for r in targets(t,p)]
    def reach(x,y,dx,dy):
        for x0,y0,x1,y1 in tg:
            if dy>0 and y<y0 and y0-y<=26 and x0-2<=x<=x1+2: return (x,y0)
            if dy<0 and y>y1 and y-y1<=26 and x0-2<=x<=x1+2: return (x,y1)
            if dx>0 and x<x0 and x0-x<=26 and y0-2<=y<=y1+2: return (x0,y)
            if dx<0 and x>x1 and x-x1<=26 and y0-2<=y<=y1+2: return (x1,y)
    sg=lambda v:(v>0)-(v<0)
    for a in pipes:
        for e,o in ((2,4),(4,2)):
            ex,ey=a[e],a[e+1];ox,oy=a[o],a[o+1]
            if ex!=ox and ey!=oy: continue
            r=reach(ex,ey,sg(ex-ox),sg(ey-oy))
            if r: a[e],a[e+1]=r[0],r[1]
    for ar in arrows:
        x,y,dx,dy=ar[:4]
        r=reach(x,y,dx,dy)
        if r:
            for a in pipes:
                for e in (2,4):
                    if abs(a[e]-x)<=4 and abs(a[e+1]-y)<=4: a[e],a[e+1]=r[0],r[1]
            ar[0],ar[1]=r[0],r[1]
    stl=[dict(id=sid,c=list(pos[sid]),ref=int(sh=='3' and sid in M.REF3),lines=[P(k) for k in trace[sid]]) for sid in sorted(pos)]
    for sid in sorted(pos):
        if sh=='3' and sid in M.REF3: continue
        r=streams.setdefault(sid,dict(sh=[])); r['sh'].append(int(sh))
        if sh=='1':
            if sid in TB.GAS: r.update(k=kind_of(sh,sid),n='Воздух' if sid<=4 else ('Хвостовой газ' if sid>=23 else 'Технологический газ'),g=TB.GAS[sid])
            elif sid in TB.REAG:
                n_,wt,th,rho,m3,t=TB.REAG[sid]; r.update(k=kind_of(sh,sid),n=n_,th=th,rho=rho,m3=m3,t=t)
        elif sh=='2':
            if sid in (101,102): continue
            n_,wt,th,rho,m3,t=TB.ACID[sid]
            r.update(k=kind_of(sh,sid),n=n_,th=th,rho=rho,m3=m3,t=t)
            if wt: r['wt']=wt
        else:
            n_,p_,t,th=TB.STEAM[sid]; r.update(k=kind_of(sh,sid),n=n_,p=p_,t=t,th=th)
    fe=[(nodepos[nd],nd) for k in drawn for nd in segs[k]['n'] if len(members[nd])==1]
    terms=[]
    for x,y,fl,txt,lx,ly,*anc in M.TERMS.get(sh,[]):
        opt=anc[1] if len(anc)>1 else {}
        anc=anc[0] if anc else 'start'
        (ex,ey),nd=min(fe,key=lambda t:(t[0][0]-x)**2+(t[0][1]-y)**2)
        if ((ex-x)**2+(ey-y)**2)**.5>130:       # трубы нет (пунктирный вывод): ставим по чертежу
            ex,ey,ux,uy=(300,y,-1,0) if x<1500 else (x-29,y,1,0)
        else:
            k0=members[nd][0]; s0=segs[k0]; ei=s0['n'].index(nd)
            ux,uy=((1 if ei==1 else -1),0) if s0['o']=='h' else (0,(1 if ei==1 else -1))
        for pp in pipes:
            if pp[3]==pp[5] and abs(pp[3]-ey)<=12 and (abs(pp[2]-ex)<=3 or abs(pp[4]-ex)<=3): ey=pp[3]
        if 'ex' in opt:                                  # торец вывода по чертежу: лишний кусок трубы за ним убираем
            pipes[:]=[pp for pp in pipes if not (pp[3]==pp[5] and abs(pp[3]-ey)<=3 and pp[2]>=opt['ex']-3)]
            ex=opt['ex']
        terms.append([round(ex),round(ey),ux,uy,fl,txt,lx,ly,anc])
    # --- привязка элементов к среде: для показа только выбранной среды (pfd.html)
    def dseg(px,py,a):
        x1,y1,x2,y2=a[2],a[3],a[4],a[5];dx,dy=x2-x1,y2-y1;L=dx*dx+dy*dy
        t=0 if not L else max(0,min(1,((px-x1)*dx+(py-y1)*dy)/L))
        return ((px-x1-t*dx)**2+(py-y1-t*dy)**2)**.5
    def kind_at(px,py,r):
        best=(r+1,'')
        for a in pipes:
            d=dseg(px,py,a)
            if d<best[0]: best=(d,a[1])
        return best[1] if best[0]<=r else ''
    dpos=[(pos[sid],kind_of(sh,sid)) for sid in pos]
    def kind_pts(pts,r):
        best=(r+1,'')
        for px,py in pts[::max(1,len(pts)//12)]+[pts[-1]]:
            for a in pipes:
                d=dseg(px,py,a)
                if d<best[0]: best=(d,a[1])
            for (dx_,dy_),k in dpos:
                d=((px-dx_)**2+(py-dy_)**2)**.5-32
                if d<best[0]: best=(d,k)
        return best[1] if best[0]<=r else ''
    eqbox=list(boxes.values())
    art_eq=[];art_k={}
    for p in paths:
        if len(p)<2: continue
        xs=[q[0] for q in p];ys=[q[1] for q in p]
        inbox=any(b[0]-12<=min(xs) and max(xs)<=b[2]+12 and b[1]-12<=min(ys) and max(ys)<=b[3]+12 for b in eqbox)
        under=(max(ys)-min(ys)<=6 and max(xs)-min(xs)<=140)
        k='' if inbox or under else kind_pts(p,70)
        txt='M'+'L'.join('%d %d'%(x,y) for x,y in p)
        if k: art_k[k]=art_k.get(k,'')+txt
        else: art_eq.append(txt)
    art_eq=''.join(art_eq)
    def kind_txt(txt):
        l=txt.lower()
        for w,k in (('сера','sulfur'),('натр','alkali'),('кислот','acid'),('воздух','air'),('вода','water'),('пар','steam'),('atm','gas'),('vent','gas')):
            if w in l: return k
        return ''
    terms=[t+[kind_at(t[0],t[1],60) or kind_txt(t[5])] for t in terms]
    vlv=[list(v)[:4]+[kind_at(v[0],v[1],16)] for v in M.VALVES.get(sh,[])]
    txs=[list(t)+[kind_txt(t[2]) or kind_at(t[0],t[1],90)] for t in M.TEXTS.get(sh,[])]
    ins=[list(c)+[kind_at(c[0],c[1],c[2]+22)] for c in M.INSTR.get(sh,[])]
    tpos=[((t[0],t[1]),t[9]) for t in terms if t[9]]
    def dash_kind(pts):
        best=(71,'')
        for px,py in pts:
            for (cx,cy),k in dpos+tpos:
                d=((px-cx)**2+(py-cy)**2)**.5-(32 if (cx,cy) in [q for q,_ in dpos] else 0)
                if d<best[0]: best=(d,k)
            for a in pipes:
                d=dseg(px,py,a)
                if d<best[0]: best=(d,a[1])
        return best[1]
    dsh=M.DASHM.get(sh,[])
    dman=M.DASHK.get(sh)
    near=lambda p,q,r:((p[0]-q[0])**2+(p[1]-q[1])**2)**.5<=r
    dshk=[next((k for (cx,cy),k in tpos if near(d[0],(cx,cy),45) or near(d[-1],(cx,cy),45)),'') for d in dsh]
    ch=True
    while ch:                         # пунктиры, соединённые концами с уже определённым, той же среды
        ch=False
        for i,d in enumerate(dsh):
            if dshk[i]: continue
            for j,e in enumerate(dsh):
                if dshk[j] and any(near(p,q,40) for p in d for q in e): dshk[i]=dshk[j];ch=True;break
    dshk=dman or [k or dash_kind(d) for k,d in zip(dshk,dsh)]
    def seg_d(px,py,d):
        r=1e9
        for (x1,y1),(x2,y2) in zip(d,d[1:]):
            dx,dy=x2-x1,y2-y1;L=dx*dx+dy*dy;t=0 if not L else max(0,min(1,((px-x1)*dx+(py-y1)*dy)/L));r=min(r,((px-x1-t*dx)**2+(py-y1-t*dy)**2)**.5)
        return r
    def darr_kind(a):
        b=(41,'')
        for d,k in zip(dsh,dshk):
            e=seg_d(a[0],a[1],d)
            if e<b[0]: b=(e,k)
        return b[1]
    dak=[darr_kind(a) for a in M.DARR.get(sh,[])]
    sheets.append(dict(n=int(sh),w=W,h=H,eq=eq,st=stl,art=art_eq,artk=art_k,fill=fillp,pipes=pipes,
                       arrows=arrows,dash=[],darr=M.DARR.get(sh,[]),valves=vlv,dashm=dsh,dashk=dshk,darrk=dak,lines=M.LINES.get(sh,[]),terms=terms,texts=txs,instr=ins,sym=[dict(tag=tag,t=t,p=p) for tag,t,p,z in SYM.get(sh,[])]))
    print('лист',sh,'потоков',len(pos),'кусков труб',len(pipes),'стрелок',len(arrows),'линий-аппаратов',len(paths),'заливок',len(fills),'предупреждений',len(warn))
    for w in warn: print('  ',w)
# 50 (сера) указана в таблице листа 2; 101/102 — по таблице листа 3
n_,wt,th,rho,m3,t=TB.ACID[50]; streams[50].update(k='sulfur',n=n_,th=th,rho=rho,m3=m3,t=t)
for sid in (101,102):
    n_,p_,t,th=TB.STEAM[sid]; streams[sid].update(k='water',n=n_,p=p_,t=t,th=th)
# карточки аппаратов из данных модели
cards={}
apps={e['app'] for s in sheets for e in s['eq']}
for e in DATA['eq']:
    if e['t'] in apps:
        sec=DATA['sections'][e['s']]
        reg=[{k:r[k] for k in ('n','nu','f','T','P','L','o') if r.get(k)} for r in DATA['reg'] if e['t'] in r['t']]
        cards[e['t']]=dict(n=e['n'],nu=e.get('nu',''),s=e['s'],sec=sec['code']+' · '+sec['name'],secu=sec.get('nameu',''),q=e['q'],w=e['w'],d=e['d'][:8],m=1 if e.get('m') else 0,reg=reg)
meta=dict(code='WZ-POT-262',title='Технологическая схема материальных потоков (PFD)',rev='A',date='2025.5',
 sheets=[dict(n=1,name='Дымогазовая система (режим 1)',nameu='Tutun-gaz tizimi (1-rejim)'),
         dict(n=2,name='Кислотная система (режим 1)',nameu='Kislota tizimi (1-rejim)'),
         dict(n=3,name='Паровая система (режим 1)',nameu='Bug‘ tizimi (1-rejim)')])
js='window.TMK_PFD='+json.dumps(dict(meta=meta,sheets=sheets,streams={str(k):v for k,v in sorted(streams.items())},cards=cards),ensure_ascii=False,separators=(',',':'))+';\n'
open(os.path.join(OUT,'pfd-data.js'),'w',encoding='utf8').write(js)
print('ok',len(js),'байт; потоков',len(streams),'аппаратов',sum(len(s['eq']) for s in sheets))
