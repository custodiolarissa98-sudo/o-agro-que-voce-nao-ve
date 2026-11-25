import soundfile as sf, numpy as np, json, re
L=open('tts/gen.py').read().split('L=[')[1].split(']\nd=')[0]
L=[s.strip().strip('"') for s in L.split('",\n')]
O=[0.2,7.4,17.6,29.5,40.6,51.4,63.3,70.6]
out=[]
for i,t in enumerate(L):
    a,sr=sf.read(f'tts/n{i}.wav'); hop=int(sr*.02)
    r=np.array([np.sqrt(np.mean(a[j:j+hop]**2)) for j in range(0,len(a)-hop,hop)])
    sil=r<r.max()*0.03
    gaps=[];j=0
    while j<len(sil):
        if sil[j]:
            k=j
            while k<len(sil) and sil[k]:k+=1
            if (k-j)>=6 and j>0 and k<len(sil): gaps.append(((j+k)/2*.02,(k-j)))
            j=k
        else:j+=1
    nz=np.where(~sil)[0]; st,en=nz[0]*.02,(nz[-1]+1)*.02
    sents=[s for s in re.split(r'(?<=[.?!])\s+',t) if s]
    g=sorted(sorted(gaps,key=lambda x:-x[1])[:len(sents)-1]); b=[st]+[x[0] for x in g]+[en]
    for si,s in enumerate(sents):
        w=s.split(); ch=[];cur=[]
        for x in w:
            cur.append(x)
            if len(' '.join(cur))>=18 or x[-1] in ',.?!': ch.append(' '.join(cur)); cur=[]
        if cur: ch.append(' '.join(cur))
        # merge tiny chunks
        m=[]
        for c in ch:
            if m and len(c)<7 and not m[-1][-1] in '.?!': m[-1]+=' '+c
            else: m.append(c)
        wt=[len(c)+ (6 if c[-1] in ',.?!' else 0) for c in m]; tot=sum(wt); s0,s1=b[si],b[si+1]; acc=0
        for c,ww in zip(m,wt):
            out.append(dict(t0=round(O[i]+s0+(s1-s0)*acc/tot,2),t1=round(O[i]+s0+(s1-s0)*(acc+ww)/tot,2),text=c)); acc+=ww
for k in range(len(out)-1): out[k]['t1']=max(out[k]['t1'],min(out[k+1]['t0'],out[k]['t1']+0.4))
json.dump(out,open('build/subs.json','w'),ensure_ascii=False,indent=0)
for o in out: print(o)
