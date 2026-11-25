import numpy as np, soundfile as sf, json
from scipy.signal import butter, sosfilt, resample_poly
SR=48000; T=75.0; N=int(SR*T); rng=np.random.default_rng(1)
t=np.arange(N)/SR
def env(n,a,r):
    e=np.ones(n); A=min(int(a*SR),n); R=min(int(r*SR),n); e[:A]=np.linspace(0,1,A); e[n-R:]*=np.linspace(1,0,R); return e
def add(buf,x,at,g=1.0):
    i=int(at*SR); j=min(N,i+len(x)); 
    if i<N: buf[i:j]+=x[:j-i]*g
def note(f,dur,bright=4,a=.8,r=1.2):
    n=int(dur*SR); tt=np.arange(n)/SR; y=np.zeros(n)
    for k in range(1,9):
        for d in(-0.004,0.004): y+=np.sin(2*np.pi*f*k*(1+d)*tt+k)*np.exp(-k/bright)/k
    return y*env(n,a,r)
def pluck(f,dur=.9):
    n=int(dur*SR); tt=np.arange(n)/SR
    return (np.sin(2*np.pi*f*tt)+.35*np.sin(4*np.pi*f*tt)+.1*np.sin(6*np.pi*f*tt))*np.exp(-tt*5)*env(n,.004,.05)
m2f=lambda m:440*2**((m-69)/12)
music=np.zeros(N); bar=2.5
CH={'D':[50,57,62,64,66],'Bm':[47,54,59,62,66],'G':[43,55,59,62,66],'A':[45,57,61,64,69],'Asus':[45,57,62,64,69],'Em':[40,55,59,62,67],'F#':[42,54,58,61,66]}
prog=['D','Bm','G','Asus']*2+['D','Bm','G','A']*5+['Bm','G','Em','F#','Bm','G']+['G','A','Bm','D','G','A','D','D']
pos=0.0;i=0
while pos<T:
    c=prog[i%len(prog)]; dark=51<=pos<63; final=pos>=63
    for m in CH[c][1:]: add(music,note(m2f(m),bar+1.2,2.5 if dark else 3.5),pos,.05)
    add(music,note(m2f(CH[c][0]-12 if CH[c][0]>45 else CH[c][0]),bar+1,1.5),pos,.12)
    if 7<=pos<51 or pos>=63:
        tones=[m+12 for m in CH[c][1:]]+[CH[c][2]+24]
        for s in range(8):
            add(music,pluck(m2f(tones[[0,1,2,3,4,3,2,1][s]])),pos+s*bar/8,.05 if pos<17 else .07)
    if (17<=pos<51 or 63<=pos<71):
        for s in range(2):
            n=int(.35*SR); tt=np.arange(n)/SR; k=np.sin(2*np.pi*(45+80*np.exp(-tt*25))*tt)*np.exp(-tt*9); add(music,k,pos+s*bar/2,.22)
        for s in range(8):
            n=int(.06*SR); nz=rng.standard_normal(n)*np.exp(-np.arange(n)/SR*60); add(music,sosfilt(butter(2,6000,'hp',fs=SR,output='sos'),nz),pos+s*bar/8+bar/16,.025)
    if dark:
        n=int(bar*SR); tt=np.arange(n)/SR; add(music,np.sin(2*np.pi*36.7*tt)*.5*env(n,.5,.5),pos,.15)
    pos+=bar;i+=1
music*=env(N,1.0,2.5)
# SFX
sfx=np.zeros(N)
def noise(d): return rng.standard_normal(int(d*SR))
def whoosh(at,d=1.0,g=.25,f0=300,f1=3000):
    x=noise(d); n=len(x); y=np.zeros(n); cut=np.geomspace(f0,f1,n)
    # time-varying one-pole lowpass
    a=np.exp(-2*np.pi*cut/SR); s=0.0
    for k in range(n): s=a[k]*s+(1-a[k])*x[k]; y[k]=s
    e=np.sin(np.pi*np.linspace(0,1,n))**2; add(sfx,y*e/np.abs(y).max(),at,g)
def boom(at,g=.5):
    n=int(1.6*SR); tt=np.arange(n)/SR; add(sfx,np.sin(2*np.pi*(38+70*np.exp(-tt*8))*tt)*np.exp(-tt*2.5),at,g)
def chime(at,g=.06,f=None):
    f=f or rng.choice([1568,1760,2093,2349]); n=int(1.0*SR); tt=np.arange(n)/SR
    y=(np.sin(2*np.pi*f*tt)+.4*np.sin(2*np.pi*f*2.01*tt)+.2*np.sin(2*np.pi*f*3.02*tt))*np.exp(-tt*5); add(sfx,y,at,g)
def pop(at,g=.08):
    n=int(.06*SR); tt=np.arange(n)/SR; f=350+rng.random()*300; add(sfx,np.sin(2*np.pi*np.cumsum(f+f*2*tt/.06)/SR)*np.exp(-tt*50),at,g)
def chirp(at,g=.05):
    for q in range(3):
        n=int(.07*SR); tt=np.arange(n)/SR; f=np.linspace(4200,2600,n)+rng.random()*500; add(sfx,np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/.07),at+q*.11,g)
def riser(a,b,g=.2):
    n=int((b-a)*SR); tt=np.arange(n)/SR; f=np.geomspace(200,1400,n); y=np.sin(2*np.pi*np.cumsum(f)/SR)*.3+sosfilt(butter(2,[800,5000],'bp',fs=SR,output='sos'),noise(b-a))*.6
    add(sfx,y*np.linspace(0,1,n)**2,a,g)
# ambience
wind=sosfilt(butter(2,500,'lp',fs=SR,output='sos'),noise(T))*(.6+.4*np.sin(2*np.pi*.15*t))
amb=np.zeros(N); m=((t<6.8)|(t>72.0)).astype(float); m=np.convolve(m,np.ones(SR)/SR,'same'); sfx+=wind*m*.12
for at in [0.4,1.6,2.9,4.1,72.6,73.7,74.4]: chirp(at)
for at,d in [(2.7,.9),(12.0,1.6),(23.2,1.1),(29.3,.8),(34.0,.9),(40.3,.9),(51.0,1.0),(53.1,.8),(56.5,.8),(62.9,1.0),(70.3,1.6),(71.9,1.0)]: whoosh(at,d,.28)
riser(5.2,7.0,.25); whoosh(6.2,1.0,.3,500,6000); boom(6.95,.6); boom(59.0,.45); boom(65.3,.4); boom(72.5,.55); boom(51.15,.35)
cues=json.load(open('build/cues.json'))
for c in cues:
    if c not in (2.5,59,65.3,72.5): chime(c)
chime(2.5,.08,2093); chime(72.6,.1,1760); chime(73.4,.08,2349)
for k in np.arange(17.6,23.4,.38): pop(k+rng.random()*.1)
for k in np.arange(30,34,.33): pop(k+rng.random()*.1,.05)
for k in np.arange(35,40,.45): pop(k,.035)
for k in np.arange(42.4,46.4,.3): pop(k,.04)
for k in np.arange(47.8,50.2,.35): pop(k,.035)
# guard cell swell tones
for a,b,f0,f1 in [(42.4,46.4,110,190),(47.8,50.3,190,100)]:
    n=int((b-a)*SR); f=np.linspace(f0,f1,n); add(sfx,np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*np.linspace(0,1,n)),a,.07)
# narration
O=[0.2,7.4,17.6,29.5,40.6,51.4,63.3,70.6]; nar=np.zeros(N)
for i,o in enumerate(O):
    x,sr=sf.read(f'tts/n{i}.wav'); x=resample_poly(x,2,1) if sr==24000 else x; add(nar,x,o)
nar=sosfilt(butter(2,80,'hp',fs=SR,output='sos'),nar); nar*=0.89/np.abs(nar).max()
e=np.convolve(np.abs(nar),np.ones(int(.3*SR))/(.3*SR),'same'); duck=1-0.55*np.clip(e/0.03,0,1)
music=music/np.abs(music).max()*0.32
mixd=nar+music*duck+sfx*duck**.5*0.9
mixd/=max(1,np.abs(mixd).max()/0.97)
sf.write('build/mix.wav',np.stack([mixd,mixd],1),SR)
print('ok',np.abs(mixd).max())
