s=open('model.html',encoding='utf-8').read()
s=s.replace(" // chips\n const chips=$('chips');"," window.THREE=THREE;window.__P=P;window.__T={SU,scene,camera,controls,byTag,reg,flowObjs,SUPf:()=>SUP,suApply,sel:t=>select(t),cutEqF:t=>cutEq(E.find(x=>x.t===t)),setCutF:m=>setCut(m)};\n // chips\n const chips=$('chips');",1)
open('model_test.html','w',encoding='utf-8').write(s)
