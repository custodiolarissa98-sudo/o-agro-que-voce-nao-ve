import numpy as np
from PIL import Image
from scipy.spatial import cKDTree
rng=np.random.default_rng(7)
def noise(n,s,seed):
    r=np.random.default_rng(seed); g=r.random((n//s+3,n//s+3))
    im=Image.fromarray((g*255).astype(np.uint8)).resize((n+3*s,n+3*s),Image.BICUBIC)
    return np.asarray(im,dtype=np.float32)[:n,:n]/255
# epidermis 2048 tile with stomata holes recorded
N=2048
pts=rng.random((260,2))*N
yy,xx=np.mgrid[0:N,0:N].astype(np.float32)
wx=xx+(noise(N,64,1)-.5)*70; wy=yy+(noise(N,64,2)-.5)*70
P=np.concatenate([pts+[dx,dy] for dx in(-N,0,N) for dy in(-N,0,N)])
t=cKDTree(P); d,_=t.query(np.stack([wx.ravel(),wy.ravel()],1),k=2)
e=(d[:,1]-d[:,0]).reshape(N,N)
b=np.clip(e/40,0,1); b=1-(1-b)**2.2
h=noise(N,16,3)*.15
r=(30+b*95+h*60); g=(70+b*150+h*80); bl=(25+b*60+h*30)
spec=np.clip((b-.7)/.3,0,1)**3*60
img=np.stack([r+spec,g+spec,bl+spec*.6],-1)
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('epi.jpg',quality=90)
# leaf vein net 1024
N=1024; pts=rng.random((500,2))*N
yy,xx=np.mgrid[0:N,0:N].astype(np.float32)
P=np.concatenate([pts+[dx,dy] for dx in(-N,0,N) for dy in(-N,0,N)])
d,_=cKDTree(P).query(np.stack([xx.ravel(),yy.ravel()],1),k=2)
e=(d[:,1]-d[:,0]).reshape(N,N); v=np.exp(-e/2.2)
a=(v*150).astype(np.uint8)
Image.fromarray(np.stack([np.full_like(a,215),np.full_like(a,240),np.full_like(a,150),a],-1),'RGBA').save('veins.png')
# cracked soil 1024
pts=rng.random((140,2))*N; P=np.concatenate([pts+[dx,dy] for dx in(-N,0,N) for dy in(-N,0,N)])
d,_=cKDTree(P).query(np.stack([xx.ravel(),yy.ravel()],1),k=2)
e=(d[:,1]-d[:,0]).reshape(N,N); c=np.clip(e/10,0,1); n=noise(N,8,5)
img=np.stack([90+c*90+n*30,60+c*65+n*25,35+c*40+n*15],-1)*(.35+.65*np.clip(e/4,0,1))[...,None]
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('soil.jpg',quality=88)
