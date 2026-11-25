# Texturas procedurais do episódio 02: tecido do estilo-estigma (células alongadas) e grânulos de amido
import numpy as np
from PIL import Image
from scipy.spatial import cKDTree
rng=np.random.default_rng(3)
def noise(n,m,s,seed):
    r=np.random.default_rng(seed); g=r.random((m//s+3,n//s+3))
    return np.asarray(Image.fromarray((g*255).astype(np.uint8)).resize((n+3*s,m+3*s),Image.BICUBIC),dtype=np.float32)[:m,:n]/255
# silk tissue: elongated cells, tileable 2048x512 (stretch x by 4)
Wd,Ht=2048,512; pts=rng.random((180,2))*[Wd,Ht]
yy,xx=np.mgrid[0:Ht,0:Wd].astype(np.float32)
P=np.concatenate([pts+[dx,dy] for dx in(-Wd,0,Wd) for dy in(-Ht,0,Ht)])
sc=np.array([0.25,1.0])
d,_=cKDTree(P*sc).query(np.stack([xx.ravel()*.25,yy.ravel()],1)+np.stack([(noise(Wd,Ht,32,1).ravel()-.5)*12,(noise(Wd,Ht,32,2).ravel()-.5)*12],1),k=2)
e=(d[:,1]-d[:,0]).reshape(Ht,Wd); b=np.clip(e/14,0,1); b=1-(1-b)**2.5; h=noise(Wd,Ht,8,3)*.12
img=np.stack([150+b*85+h*60,150+b*95+h*60,80+b*70+h*40],-1)
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('silk.jpg',quality=90)
