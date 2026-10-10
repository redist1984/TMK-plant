#!/usr/bin/env python3
"""Сборка вкладки PFD: python3 tools/pfd/build.py <WZ-POT-262.pdf>
Требуется: poppler (pdfimages), numpy, pillow, opencv-python-headless.
Результат: pfd/sheet1..3.jpg и pfd/pfd-data.js (позиции, потоки, линии, карточки)."""
import sys, os, json, subprocess, tempfile
import numpy as np, cv2
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.abspath(os.path.join(HERE,'..','..'))
sys.path.insert(0,HERE)
import trace as T
from eqboxes import EQ
import tables as TB

pdf=sys.argv[1]; OUT=os.path.join(ROOT,'pfd'); os.makedirs(OUT,exist_ok=True)
tmp=tempfile.mkdtemp(prefix='pfd_'); T.SHEET_DIR=tmp
subprocess.check_call(['pdfimages','-j',pdf,os.path.join(tmp,'im')])
# страница PDF → номер листа в основной надписи: стр.3 = лист 1, стр.1 = лист 2, стр.2 = лист 3
IMG={'1':'im-002.jpg','2':'im-000.jpg','3':'im-001.jpg'}
CROP=(220,170,3230,2310)   # поле чертежа; в этих координатах работает вся разметка
W,H=CROP[2]-CROP[0],CROP[3]-CROP[1]
for sh,f in IMG.items():
    a=np.asarray(Image.open(os.path.join(tmp,f)).convert('RGB')).astype(np.float32)
    g=np.clip((a[...,0]-70)/(238-70),0,1)*255      # канал R: красная печать гаснет, цифры под ней читаются
    im=Image.fromarray(g.astype(np.uint8)).crop(CROP)
    im.save(os.path.join(tmp,f'sheet{sh}.png'))
    im.save(os.path.join(OUT,f'sheet{sh}.jpg'),quality=80,optimize=True)

# номера потоков в ромбах: найденные по растру ромбы → номер (сверено по контактным листам вручную)
ID={'1':{1:22,2:74,3:16,4:15,5:21,6:10,7:24,8:3,9:12,10:9,11:18,12:11,13:19,14:4,15:20,16:13,17:23,18:17,19:7,20:73,21:14,22:8,23:6,24:5,25:50},
'2':{0:62,1:55,2:71,3:87,4:88,10:63,11:54,12:51,13:68,14:69,15:64,16:65,17:77,18:76,19:78,20:75,21:70,22:61,23:84,24:83,25:56,27:82,28:81,29:57,31:86,32:85,33:102,34:101,35:58,36:52,37:66,39:59,40:60},
'3':{0:114,2:103,3:101,4:102,5:117,6:115,7:116,8:113,9:104,10:107,11:105,12:112,13:22,14:10,15:8,16:6,17:16,18:111,19:106,20:108,21:21,22:15,23:11,24:20,25:110}}
MAN={'1':{1:(374,984),2:(526,988),72:(2748,466)},'2':{53:(484,724),67:(2492,734)},'3':{109:(928,192)}}
# линии, которые автотрассировка не нашла (рисуем вручную по растру): (лист, поток) → ломаная
MANUAL_LINES={('1',16):[(2027,1000),(2027,782),(2105,782),(2105,845),(2115,845)],
              ('1',17):[(2220,595),(2220,550),(2105,550),(2105,757),(1925,757)]}
REF3={6,8,10,11,15,16,20,21,22}      # газовые потоки: на листе 3 только отсылка к листу 1
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

APP={'FR-11301':'SM-11301','PP-11304':'PP-11304AB','DA-11401':'DA-114.101','PP-11401':'PP-114.101AB'}
KIND3={'Обессоленная вода':'water','Питательная вода':'water','Охлаждающая вода':'water','Питательная вода котла':'water','Продувка барабана':'water','Продувка':'water'}
streams={}; sheets=[]
for sh in '123':
    segs,members=T.build(sh); d=diamonds(sh)
    pos={ID[sh][i]:d[i] for i in ID[sh]}; pos.update(MAN[sh])
    lines={}
    for sid,(x,y) in pos.items():
        if sh=='3' and sid in REF3: lines[sid]=[]; continue
        order=T.trace(segs,members,x,y)
        lines[sid]=[[int(v) for p in T.pts(segs[k]) for v in p] for k in order]
        if (sh,sid) in MANUAL_LINES:
            m=MANUAL_LINES[(sh,sid)]; lines[sid]=[[*m[i],*m[i+1]] for i in range(len(m)-1)]
    boxes={t:tosheet(b) for t,b in EQ[sh].items()}
    eq=[]
    for t,b in boxes.items():
        near=[]
        for sid,(x,y) in pos.items():
            hit=(b[0]-40<=x<=b[2]+40 and b[1]-40<=y<=b[3]+40)
            for l in lines[sid]:
                for px,py in ((l[0],l[1]),(l[2],l[3])):
                    if b[0]-24<=px<=b[2]+24 and b[1]-24<=py<=b[3]+24: hit=True
            if hit and not (sh=='3' and sid in REF3): near.append(sid)
        eq.append(dict(tag=t,app=APP.get(t,t),box=b,streams=sorted(near)))
    st=[]
    for sid,(x,y) in sorted(pos.items()):
        st.append(dict(id=sid,c=[x,y],lines=lines[sid],ref=int(sh=='3' and sid in REF3)))
        if sh=='3' and sid in REF3: continue
        r=streams.setdefault(sid,dict(sh=[]))
        r['sh'].append(int(sh))
        if sh=='1':
            if sid in TB.GAS:
                r.update(k='gas',n='Воздух' if sid<=4 else ('Хвостовой газ' if sid>=23 else 'Технологический газ'),g=TB.GAS[sid])
            elif sid==50: pass
            else:
                n,wt,th,rho,m3,t=TB.REAG[sid]; r.update(k='reagent',n=n,th=th,rho=rho,m3=m3,t=t)
        elif sh=='2':
            if sid in (101,102): continue
            n,wt,th,rho,m3,t=TB.ACID[sid]
            k='sulfur' if sid==50 else 'acid' if n=='Серная кислота' else 'water'
            r.update(k=k,n=n,th=th,rho=rho,m3=m3,t=t); 
            if wt: r['wt']=wt
        else:
            n,p,t,th=TB.STEAM[sid]
            r.update(k='steam' if 'пар' in n.lower() else 'water',n=n,p=p,t=t,th=th)
    sheets.append(dict(n=int(sh),img=f'pfd/sheet{sh}.jpg',w=W,h=H,eq=eq,st=st))
# жидкая сера (50) описана в таблице листа 2; на листе 1 — тот же поток
n,wt,th,rho,m3,t=TB.ACID[50]; streams[50].update(k='sulfur',n=n,th=th,rho=rho,m3=m3,t=t)
# 101/102 нарисованы на листах 2 и 3; параметры — по таблице листа 3
for sid in (101,102):
    n,p,t,th=TB.STEAM[sid]; streams[sid].update(k='water',n=n,p=p,t=t,th=th)

# карточки аппаратов из данных модели
src=open(os.path.join(ROOT,'model.html'),encoding='utf8').read().split('\n')
line=[l for l in src if l.startswith('const DATA = ')][0]
DATA=json.loads(line[len('const DATA = '):].rstrip(';'))
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
print('ok',len(js),'bytes; streams',len(streams),'eq',sum(len(s['eq']) for s in sheets),'no-lines',[(s['n'],x['id']) for s in sheets for x in s['st'] if not x['lines'] and not x['ref']])
print('cards',sorted(cards),'missing',sorted(apps-set(cards)))
