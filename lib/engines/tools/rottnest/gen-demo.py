import json,math,random
d=json.load(open('/home/claude/rott/data.json'))
G=d['grid'];x0,z0,st=G['x0'],G['z0'],G['step'];R=G['rows']
def H(x,z):
    i=round((x-x0)/st);j=round((z-z0)/st)
    if j<0 or j>=len(R) or i<0 or i>=len(R[0]):return -6
    return R[j][i]
ext=d['ext'];cx=(ext[0]+ext[2])/2;cz=(ext[1]+ext[3])/2
k=224/(ext[2]-ext[0])
E=lambda p:[round(-(p[0]-cx)*k,2),round((p[1]-cz)*k,2)]
CS=2;N=121
raw=[]
for j in range(N):
    for i in range(N):
        x=(i-60)*CS;z=(j-60)*CS;raw.append(H(cx-x/k,cz+z/k))
# distance to water (sea or lake) in cells, then a gentle beach and low rolling ground (the game's bed is flat inland)
from collections import deque
INF=9999;dist=[INF]*(N*N);q=deque()
for n,v in enumerate(raw):
    if v<=0 or v<=-8.9:dist[n]=0;q.append(n)
while q:
    n=q.popleft();i,j=n%N,n//N
    for a,b in((1,0),(-1,0),(0,1),(0,-1)):
        ii,jj=i+a,j+b
        if 0<=ii<N and 0<=jj<N and dist[ii+jj*N]>dist[n]+1:dist[ii+jj*N]=dist[n]+1;q.append(ii+jj*N)
def noise(x,z):return (math.sin(x*.045+1.3)*math.cos(z*.06-.7)+.5*math.sin(x*.11-z*.07+2.1))*.5
h=[]
for n,v in enumerate(raw):
    i,j=n%N,n//N;x=(i-60)*CS;z=(j-60)*CS
    if v<=-8.9:h.append(-.7);continue
    if v<=0:h.append(round(max(v*k*1.5-.2,-6),2));continue
    dd=dist[n];b=min(1.3,.25+.2*dd);hill=max(0,noise(x,z))*min(1,max(0,(dd-5)/6))*1.6
    h.append(round(b+hill,2))
Hl=lambda x,z:h[min(N-1,max(0,round(z/CS+60)))*N+min(N-1,max(0,round(x/CS+60)))]
# lanes merged end to end
L=[l[:] for l in d['lanes']]
same=lambda a,b:math.hypot(a[0]-b[0],a[1]-b[1])<1.2
m=True
while m:
    m=False
    for a in range(len(L)):
        for b in range(a+1,len(L)):
            A,B=L[a],L[b]
            if same(A[-1],B[0]):L[a]=A+B[1:];del L[b];m=True;break
            if same(B[-1],A[0]):L[a]=B+A[1:];del L[b];m=True;break
            if same(A[-1],B[-1]):L[a]=A+B[::-1][1:];del L[b];m=True;break
            if same(A[0],B[0]):L[a]=A[::-1]+B[1:];del L[b];m=True;break
        if m:break
roads=[{'pts':[E(p) for p in l],'type':'island'} for l in L if len(l)>1]
paths=[{'pts':[E(q) for q in p],'w':1.1,'kind':'path'} for p in d['paths']]
rail=[E(p) for p in d['rail']]
# buildings from boxes
bld=[];placed=[]
def free(x,z,r):return all(math.hypot(x-a,z-b)>r+c for a,b,c in placed)
cafe=E(d['cafe'][:2]);bld.append({'s':'cafe','x':cafe[0],'z':cafe[1],'r':0,'sign':'QUOKKA CAFE','fixed':1});placed.append((cafe[0],cafe[1],5))
boxes=sorted(d['boxes'],key=lambda b:-(b[2]-b[0])*(b[3]-b[1]))
lh=max(d['boxes'],key=lambda b:b[4])
p=E(((lh[0]+lh[2])/2,(lh[1]+lh[3])/2));bld.append({'s':'lighthouse','x':p[0],'z':p[1],'r':0,'fixed':1});placed.append((p[0],p[1],4))
for b in boxes:
    w,dd,hh=b[2]-b[0],b[3]-b[1],b[4]
    if w<1.6 or dd<1.4 or hh>6:continue
    c=E(((b[0]+b[2])/2,(b[1]+b[3])/2))
    a=w*dd
    s='heritage' if a>60 else 'pub' if a>35 else 'islandcottage' if a>5 else 'cabin'
    r=4.8 if a>35 else 3.8
    if not free(c[0],c[1],r):continue
    if Hl(c[0],c[1])<=.3:continue
    bld.append({'s':s,'x':c[0],'z':c[1],'r':0 if w>=dd else round(math.pi/2,3)});placed.append((c[0],c[1],r))
# jetty: shore end toward the sea end
J=d['JETTY'];a=((J['x1'],(J['z1']+J['z2'])/2));bb=((J['x2'],(J['z1']+J['z2'])/2))
sh,sea_=(a,bb) if H(*a)>H(*bb) else (bb,a)
print('jetty ends',H(*a),H(*bb))
s0=E(sh);s1=E(sea_);ang=math.atan2(s1[0]-s0[0],s1[1]-s0[1])
props=[{'k':'jetty','x':s0[0],'z':s0[1],'r':round(ang,3),'fixed':1}]
random.seed(7);trees=[]
while len(trees)<70:
    x=random.uniform(-110,110);z=random.uniform(-48,48);v=Hl(x,z)
    if v>.6 and free(x,z,1.5) and all(math.hypot(x-q[0],z-q[1])>3 for r_ in roads for q in r_['pts'][::1]):
        trees.append({'k':random.choice(['pine','pine','gum','pepper']),'x':round(x,2),'z':round(z,2)})
demo=json.load(open('/home/claude/quokka-cafe/lib/engines/editor/demo-map.json'))
out=dict(v=1,name='Rottnest Island',sea=0,h=h,paths=paths,roads=roads,props=props,bld=bld,trees=trees,fol=demo['fol'],cars=4,life=demo['life'],veh=[],sky={'hour':10,'wx':'sunny'},layers={},money=25000,day=1,clock=0,biz=[],costs=True,gm=False,rail=rail,gridfix=1,railclean=1,ver=4,real=1)
json.dump(out,open('/home/claude/rott/rott-map.json','w'))
print('k',round(k,3),'roads',len(roads),[len(r['pts']) for r in roads],'paths',len(paths),'bld',len(bld),'rail',len(rail),'jetty',props[0],'lh',lh[:2])
