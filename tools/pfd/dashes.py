"""Штрихпунктирные линии (пар, вода, КИП): короткие тонкие чёрточки/точки, выстроенные в ряд.
Сохраняем их как отрезки (в SVG рисуются штрихом) и ищем рядом наконечники стрелок."""
import numpy as np, cv2

def find(g, skip, thr=200):
    """skip — маска, где ничего не искать (трубы, ромбы, круги). Возвращает (отрезки [x1,y1,x2,y2], стрелки [x,y,dx,dy])."""
    b=(g<thr).astype(np.uint8); b[skip>0]=0
    n,lab,st,cen=cv2.connectedComponentsWithStats(b,connectivity=8)
    items=[]
    for i in range(1,n):
        x,y,w,h,a=st[i]
        if min(w,h)<=5 and 3<=max(w,h)<=60 and a>=3: items.append((i,x,y,w,h))
    def sup(it):  # есть ли «соседи» на той же линии
        i,x,y,w,h=it; hor=w>=h; c=0
        for j,x2,y2,w2,h2 in items:
            if j==i: continue
            if hor and abs((y+h/2)-(y2+h2/2))<=3.5 and (0<x2-(x+w)<=90 or 0<x-(x2+w2)<=90): c+=1
            if (not hor) and abs((x+w/2)-(x2+w2/2))<=3.5 and (0<y2-(y+h)<=90 or 0<y-(y2+h2)<=90): c+=1
        return c
    segs=[]
    for it in items:
        if sup(it)>=1:
            i,x,y,w,h=it
            segs.append([int(v) for v in ([x,y+h//2,x+w,y+h//2] if w>=h else [x+w//2,y,x+w//2,y+h])])
    return segs

def runs(segs, gap=120, minn=3, minlen=120):
    """Склеивает отрезки в протяжённые линии: [['h',y,x1,x2]|['v',x,y1,y2]]; одиночный мусор отбрасывается."""
    out=[]
    for o in 'hv':
        it=[]
        for x1,y1,x2,y2 in segs:
            horiz=(y1==y2) and (x2-x1)>=(y2-y1) and (x2-x1)>0 or (y1==y2)
            if (o=='h')==(y1==y2 and x2!=x1) : it.append((y1 if o=='h' else x1, x1 if o=='h' else y1, x2 if o=='h' else y2))
        it.sort()
        used=[False]*len(it)
        for i,t in enumerate(it):
            if used[i]: continue
            ch=[t]; used[i]=True
            for j in range(i+1,len(it)):
                u=it[j]
                if used[j]: continue
                if abs(u[0]-ch[0][0])<=3 and 0<=u[1]-ch[-1][2]<=gap: ch.append(u); used[j]=True
            L=ch[-1][2]-ch[0][1]
            if len(ch)>=minn and L>=minlen: out.append([o,round(sum(c[0] for c in ch)/len(ch)),ch[0][1],ch[-1][2]])
    return out

def join(rs, snap=60):
    """Достраивает углы: концы горизонтальной и вертикальной линий, лежащие рядом, сводятся в точку пересечения."""
    hs=[r for r in rs if r[0]=='h']; vs=[r for r in rs if r[0]=='v']
    for h in hs:
        for v in vs:
            px,py=v[1],h[1]
            for hi in (2,3):
                for vi in (2,3):
                    if abs(h[hi]-px)<=snap and abs(v[vi]-py)<=snap:
                        h[hi]=px; v[vi]=py
    return rs
