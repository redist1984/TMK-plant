"""Стрелки направления потоков, которых нет на скане (пилотная расстановка по таблице FLOW).
make(sheet, streams, kind_of) -> список стрелок [x,y,dx,dy,среда,поток,'f'] для sheet['arrows'].
Ломаная потока берётся из sheet['st'][i]['lines'], направление — из sheet['flow'] (откуда/куда, насос на линии)
или из выводов sheet['terms']; наконечник ставится у приёмника, на длинных линиях — ещё и по середине."""
import math

def _d(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])
def _dbox(p,b):
    dx=max(b[0]-p[0],0,p[0]-b[2]); dy=max(b[1]-p[1],0,p[1]-b[3]); return math.hypot(dx,dy)

def chains(lines):
    segs=[((a,b),(c,d)) for a,b,c,d in lines if (a,b)!=(c,d)]
    out=[]
    while segs:
        s=segs.pop(0); ch=[s[0],s[1]]; ext=True
        while ext:
            ext=False
            for i,t in enumerate(segs):
                for a,b in (t,t[::-1]):
                    if _d(a,ch[-1])<4: ch.append(b); segs.pop(i); ext=True; break
                    if _d(a,ch[0])<4: ch.insert(0,b); segs.pop(i); ext=True; break
                if ext: break
        out.append(ch)
    return out

def _at(ch,t):  # точка и направление на расстоянии t вдоль ломаной
    for a,b in zip(ch,ch[1:]):
        L=_d(a,b)
        if t<=L or (a,b)==(ch[-2],ch[-1]):
            u=((b[0]-a[0])/L,(b[1]-a[1])/L) if L else (1,0)
            return (a[0]+u[0]*min(t,L),a[1]+u[1]*min(t,L)),u
        t-=L
def _len(ch): return sum(_d(a,b) for a,b in zip(ch,ch[1:]))

def make(sh,kind_of,sheetno,frm=None,skip=()):   # skip — потоки, у которых стрелки заданы вручную (manual.ARROWS)
    frm=frm or {}
    boxes={e['tag']:e['box'] for e in sh['eq']}
    flow=sh.get('flow',{}); terms=sh['terms']
    obst=[tuple(x['c']) for x in sh['st']]+[(v[0],v[1]) for v in sh['valves']]+[(i[0],i[1]) for i in sh['instr']]+[(a[0],a[1]) for a in sh['arrows']]
    res=[]; log=[]
    for x in sh['st']:
        sid=x['id']
        if x.get('ref') or not x['lines'] or sid in skip: continue
        src,dst,thru=[],[],[]
        if str(sid) in flow: src,dst,thru=flow[str(sid)]
        for ch in chains(x['lines']):
            def score(c):
                s=0;n=0
                if dst: s+=min(_dbox(c[-1],boxes[t]) for t in dst if t in boxes);n+=1
                if src: s+=min(_dbox(c[0],boxes[t]) for t in src if t in boxes);n+=1
                if (sheetno,sid) in frm: s+=min(_d(c[0],frm[(sheetno,sid)]),300)*2;n+=1
                for t in terms:
                    p=(t[0],t[1])
                    if t[4]=='in': s+=0.5*min(_d(c[0],p),200)
                    elif t[4]=='out': s+=0.5*min(_d(c[-1],p),200)
                return s
            f,r=score(ch),score(ch[::-1])
            if not (dst or src or (sheetno,sid) in frm or any(_d(ch[i],(t[0],t[1]))<160 for i in (0,-1) for t in terms)):
                log.append(('нет направления',sheetno,sid)); continue
            if abs(f-r)<1e-6: log.append(('неясно',sheetno,sid)); continue
            c=ch if f<r else ch[::-1]
            kd=kind_of(str(sheetno),sid); new=[]
            # наконечник у приёмника (или вывода «out»), если конец рядом
            e=c[-1]; near_dst=any(t in boxes and _dbox(e,boxes[t])<30 for t in dst) or any(t[4]=='out' and _d(e,(t[0],t[1]))<160 for t in terms)
            if near_dst and len(c)>=2:
                _,u=_at(c[::-1],0)  # направление последнего звена
                a,b=c[-2],c[-1]; L=_d(a,b); u=((b[0]-a[0])/L,(b[1]-a[1])/L)
                new.append((e,u))
            # промежуточные: минимум одна на линию, далее каждые ~900 px
            Ltot=_len(c); n=max(1,int(Ltot//900)+ (0 if near_dst and Ltot<500 else 0))
            if near_dst and Ltot<500: n=0
            for k in range(n):
                target=Ltot*(k+1)/(n+1); best=None
                for dt in range(-int(Ltot/(n+1)/2),int(Ltot/(n+1)/2),10):
                    t=target+dt
                    if t<28 or t>Ltot-28: continue
                    p,u=_at(c,t)
                    p2,u2=_at(c,t-22);p3,u3=_at(c,t+22)
                    if abs(u2[0]-u3[0])+abs(u2[1]-u3[1])>.01: continue   # только прямой участок
                    m=min([_d(p,o) for o in obst]+[_dbox(p,b) for b in boxes.values()]+[_d(p,q) for q,_ in new]+[400])
                    if best is None or m>best[0]: best=(m,p,u)
                if best and best[0]>=34: new.append((best[1],best[2]))
            if not new and len(c)>=2:   # короткая линия: наконечник на дальнем от источника конце
                a,b=c[-2],c[-1]; L=_d(a,b)
                if L>=24 and all(_d(b,o)>26 for o in obst): new.append((b,((b[0]-a[0])/L,(b[1]-a[1])/L)))
            for p,u in new:
                res.append([round(p[0]),round(p[1]),round(u[0]),round(u[1]),kd,sid,'f'])
                obst.append(p)
            if not new: log.append(('нет места',sheetno,sid))
    return res,log
