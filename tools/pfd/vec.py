"""Векторизация линий аппаратуры со скана (без труб, текста и ромбов потоков)."""
import cv2, numpy as np
from skimage.morphology import skeletonize

def _walk(sk):
    ys,xs=np.nonzero(sk); pts=set(zip(xs.tolist(),ys.tolist()))
    def nb(p):
        x,y=p; return [(x+dx,y+dy) for dx in(-1,0,1) for dy in(-1,0,1) if (dx or dy) and (x+dx,y+dy) in pts]
    deg={p:len(nb(p)) for p in pts}
    nodes={p for p,d in deg.items() if d!=2}
    seen=set(); paths=[]
    def go(start,first):
        path=[start,first]; prev,cur=start,first
        while True:
            if cur in nodes: break
            nxt=[q for q in nb(cur) if q!=prev and q not in path[-3:]]
            if not nxt: break
            # prefer 4-neighbour continuation
            prev,cur=cur,nxt[0]; path.append(cur)
            if (prev,cur) in seen: break
        return path
    for s in sorted(nodes):
        for q in nb(s):
            if (s,q) in seen: continue
            p=go(s,q)
            for a,b in zip(p,p[1:]): seen.add((a,b)); seen.add((b,a))
            paths.append(p)
    # closed loops without nodes
    left=[p for p in pts if all(((p,q) not in seen) for q in nb(p))]
    for s in left:
        if any(((s,q) in seen) for q in nb(s)): continue
        if not nb(s): continue
        q=nb(s)[0]; p=go(s,q)
        for a,b in zip(p,p[1:]): seen.add((a,b)); seen.add((b,a))
        paths.append(p)
    return paths

def vectorize(g, drop_mask, eps=1.6, minlen=10, thr=197):
    """g — серое изображение листа; drop_mask — что убрать (трубы, ромбы, текст). Возвращает (paths, fills)."""
    b=(g<165).astype(np.uint8); b[drop_mask>0]=0
    bt=(g<thr).astype(np.uint8); bt[drop_mask>0]=0
    # толстые закрашенные места (фильтры, стрелки, блоки) — контурами, остальное — скелетом
    op=cv2.morphologyEx(b,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
    cs,_=cv2.findContours(op,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
    fills=[]
    for c in cs:
        if cv2.contourArea(c)<120: continue
        a=cv2.approxPolyDP(c,1.5,True).reshape(-1,2)
        if len(a)>=3: fills.append(a.tolist())
    thick=cv2.dilate(op,np.ones((5,5),np.uint8))
    thin=bt&(1-thick)
    thin=cv2.morphologyEx(thin,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    sk=skeletonize(thin>0)
    paths=[]
    for p in _walk(sk):
        if len(p)<minlen: continue
        a=cv2.approxPolyDP(np.array(p,np.int32).reshape(-1,1,2),eps,False).reshape(-1,2)
        paths.append(a.tolist())
    return paths,fills
