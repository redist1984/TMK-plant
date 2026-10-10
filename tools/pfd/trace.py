import cv2, numpy as np, json, sys, os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from eqboxes import EQ
SHEET_DIR='.'
GAP=30
def segments(sh):
    g=cv2.imread(f'{SHEET_DIR}/sheet{sh}.png',0)
    b=(g<175).astype(np.uint8)
    b[1400:,:]=0 if sh!='3' else b[1400:,:]*0
    b[:, :178]=0; b[:, 2915:]=0; b[:112,:]=0
    # remove equipment interiors
    for t,(x0,y0,x1,y1) in EQ[sh].items():
        b[2*y0-170+3:2*y1-170-3, 2*x0-220+3:2*x1-220-3]=0
    H=cv2.morphologyEx(b,cv2.MORPH_OPEN,np.ones((1,36),np.uint8))
    V=cv2.morphologyEx(b,cv2.MORPH_OPEN,np.ones((36,1),np.uint8))
    H=cv2.morphologyEx(H,cv2.MORPH_CLOSE,np.ones((1,GAP),np.uint8))
    V=cv2.morphologyEx(V,cv2.MORPH_CLOSE,np.ones((GAP,1),np.uint8))
    segs=[]
    for o,M in (('h',H),('v',V)):
        n,lab,st,_=cv2.connectedComponentsWithStats(M,connectivity=8)
        for i in range(1,n):
            x,y,w,h,a=st[i]
            if o=='h':
                if h>14 or w<40: continue
                ys,xs=np.nonzero(lab[y:y+h,x:x+w]==i)
                segs.append(dict(o='h',a=int(x),b=int(x+w-1),c=float(ys.mean()+y)))
            else:
                if w>14 or h<40: continue
                ys,xs=np.nonzero(lab[y:y+h,x:x+w]==i)
                segs.append(dict(o='v',a=int(y),b=int(y+h-1),c=float(xs.mean()+x)))
    return segs
def pts(s):
    return ((s['a'],s['c']),(s['b'],s['c'])) if s['o']=='h' else ((s['c'],s['a']),(s['c'],s['b']))
def dist(s,cx,cy):
    (x1,y1),(x2,y2)=pts(s)
    dx=max(min(x1,x2)-cx,0,cx-max(x1,x2)); dy=max(min(y1,y2)-cy,0,cy-max(y1,y2))
    return (dx*dx+dy*dy)**.5
TOL=9
def split(segs):
    """split segments at tee points; returns pieces"""
    cuts={i:set() for i in range(len(segs))}
    for i,s in enumerate(segs):
        for j,t in enumerate(segs):
            if s['o']==t['o']: continue
            # s through-line, t ending on it
            for (px,py) in pts(t):
                if s['o']=='h':
                    if abs(py-s['c'])<=TOL and s['a']+TOL<px<s['b']-TOL: cuts[i].add(round(px))
                else:
                    if abs(px-s['c'])<=TOL and s['a']+TOL<py<s['b']-TOL: cuts[i].add(round(py))
    out=[]
    for i,s in enumerate(segs):
        c=sorted(cuts[i])
        # merge cuts within TOL*2 (same junction twice, e.g. branches both sides)
        cc=[]
        for v in c:
            if not cc or v-cc[-1]>2*TOL: cc.append(v)
        pos=[s['a']]+cc+[s['b']]
        for k in range(len(pos)-1):
            out.append(dict(o=s['o'],a=pos[k],b=pos[k+1],c=s['c']))
    return out
def build(sh):
    segs=split(segments(sh))
    # nodes: cluster endpoints
    ends=[]
    for i,s in enumerate(segs):
        for ei,p in enumerate(pts(s)): ends.append((p,i,ei))
    node=[-1]*len(ends); nodes=[]
    for k,(p,i,ei) in enumerate(ends):
        for ni,np_ in enumerate(nodes):
            if abs(p[0]-np_[0])<=TOL+2 and abs(p[1]-np_[1])<=TOL+2:
                node[k]=ni; break
        else:
            nodes.append(p); node[k]=len(nodes)-1
    members={n:[] for n in range(len(nodes))}
    for k,(p,i,ei) in enumerate(ends): members[node[k]].append(i)
    for s in segs: s['n']=[None,None]
    for k,(p,i,ei) in enumerate(ends): segs[i]['n'][ei]=node[k]
    return segs,members
def trace(segs,members,cx,cy,r=36):
    ds=sorted((dist(s,cx,cy),i) for i,s in enumerate(segs))
    start=[i for d,i in ds if d<=r and d<=ds[0][0]+8]
    seen=set(); order=[]
    stack=list(start)
    while stack:
        i=stack.pop()
        if i in seen: continue
        seen.add(i); order.append(i)
        for n in segs[i]['n']:
            m=set(members[n])
            if len(m)==2:
                for j in m:
                    if j not in seen: stack.append(j)
    return order
if __name__=='__main__':
    for sh in '123':
        segs,adj=build(sh); print(sh,len(segs))
