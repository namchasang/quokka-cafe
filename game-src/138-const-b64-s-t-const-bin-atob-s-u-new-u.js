const b64=(s,T)=>{const bin=atob(s),u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new T(u.buffer);};
// limestone skin: 64 px = 2 m tile; light neutral so each spire's own tint (honey, grey, tan) shows through; layers, pits, drip streaks
function stoneTile(){const W=64,[c,x]=cvs(W,W);const img=x.createImageData(W,W),D=img.data;
  for(let y=0;y<W;y++)for(let X=0;X<W;X++){const band=pn(X*.3,y,5,64,31),n=pn(X,y,6,64/6|0,32),f=pn(X,y,3,64/3|0,33);
    let l=.86+(band-.5)*.12+(n-.5)*.14;if(((y+Math.round(3*Math.sin(X*Math.PI*2/32)))%9)===0)l-=.06;
    const streak=pn(X,y*.15,4,16,34);if(streak>.72)l-=.08;if(f>.8)l+=.06;l=Math.round(l*12)/12;
    const q=(y*W+X)*4;D[q]=cl(l*248,0,255);D[q+1]=cl(l*236,0,255);D[q+2]=cl(l*214,0,255);D[q+3]=255;}
  x.putImageData(img,0,0);const r=mulberry32(64);
  for(let i=0;i<120;i++){const X=r()*W|0,Y=r()*W|0,s=r()<.25?2:1;x.fillStyle='rgba(70,52,34,.55)';x.fillRect(X,Y,s,s);x.fillStyle='rgba(255,246,220,.5)';x.fillRect(X,Y+s,s,1);}
  for(let i=0;i<14;i++){const X=r()*W|0,Y=r()*W|0;x.fillStyle='rgba(110,120,96,.45)';x.fillRect(X,Y,2,1);x.fillRect(X+1,Y+1,1,1);}
  return c;}
const STEX=ctex(stoneTile(),{rep:[1,1]});STEX.magFilter=THREE.NearestFilter;
const SPM=new THREE.MeshLambertMaterial({map:STEX,vertexColors:true,emissive:new THREE.Color(0,0,0),emissiveMap:STEX});PIN.spireM=SPM;
const SHAPES={};
for(const k in SPD){const d=SPD[k],P=b64(d.p,Int16Array),U=b64(d.u,Int16Array),A=new Uint8Array(atob(d.a).split('').map(ch=>ch.charCodeAt(0))),I=b64(d.i,Uint16Array);
  const pos=[],uv=[],col=[];
  for(let t=0;t<I.length;t+=3){const ids=[I[t],I[t+1],I[t+2]];let us=ids.map(i=>U[i*2]/1e4);if(Math.max(...us)-Math.min(...us)>.5)us=us.map(u=>u<.5?u+1:u);
    ids.forEach((i,q)=>{const y=P[i*3+1]/1e3;pos.push(P[i*3]/1e3,y,P[i*3+2]/1e3);uv.push(us[q]*d.t,U[i*2+1]/1e4);
      const a=.38+.62*(A[i]/255),foot=1-ss((y+.1)/.55);col.push(a*(1-foot*.06),a*(1-foot*.16),a*(1-foot*.32));});}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();
  SHAPES[k]={g,h:d.h,r:d.r};}
// where spires may stand
const KEEP=[[1023,27,4],[1046,29.5,2.5],[1078,-17,4.2],[1007,-19,3.4],[1092,-24,8.6]];
function free(x,z,m){if(x<X1+3||x>X2-3||z<Z1+4||z>Z2-3)return false;if(loopD(x,z)<3.1+m||trailD(x,z)<1.5+m)return false;if(inR(x,z,{x1:1001,x2:1030,z1:23.5,z2:43},m)||inR(x,z,CP,2+m))return false;
  for(const [a,b,r] of KEEP)if(Math.hypot(x-a,z-b)<r+m)return false;return true;}
const SGRID=new Map(),SC=2,skey=(i,j)=>i*4096+j;
function spAdd(x,z,r){const i=Math.floor(x/SC),j=Math.floor(z/SC),k=skey(i,j);let a=SGRID.get(k);if(!a)SGRID.set(k,a=[]);a.push([x,z,r]);}
function spHit(x,z,pad){const i=Math.floor(x/SC),j=Math.floor(z/SC);for(let a=i-1;a<=i+1;a++)for(let b=j-1;b<=j+1;b++){const L=SGRID.get(skey(a,b));if(!L)continue;for(const s of L){const dx=x-s[0],dz=z-s[1];if(dx*dx+dz*dz<(s[2]+pad)*(s[2]+pad))return true;}}return false;}
PIN.spHit=spHit;
const TYPES=[['spireA',.07],['spireB',.09],['colA',.07],['colB',.09],['midA',.15],['stumpA',.13],['stumpB',.14],['domeA',.1],['wedgeA',.06]];
const TW=TYPES.reduce((s,t)=>s+t[1],0);
const pickType=()=>{let v=R()*TW;for(const t of TYPES){v-=t[1];if(v<=0)return t[0];}return 'midA';};
const INST={};for(const k in SHAPES)INST[k]=[];
const TINTS=['#eadcb8','#e2d0a4','#d8c8a4','#cfc4aa','#c6bca8','#e6d2a0','#dcc49a','#d2c0a0'];
let nSp=0;
for(let tries=0;tries<26000&&nSp<1900;tries++){const x=rr(X1+3,X2-3),z=rr(Z1+4,Z2-3);
  const dens=.35+.65*nz(x,z,11,5),hw=heathW(x,z);if(R()>dens*(1-hw*.8))continue;
  const k=pickType(),S0=SHAPES[k];const big=S0.h>1.8;const sc=(big?.75+R()*.45:.7+R()*.6)*(nz(x,z,14,8)>.6?1.12:1);const rad=S0.r*sc*.92;
  if(!free(x,z,rad*.5))continue;if(spHit(x,z,rad+.75))continue;
  spAdd(x,z,rad);nSp++;
  const y=Math.min(H(x,z),H(x+rad,z),H(x-rad,z),H(x,z+rad),H(x,z-rad))-.03;
  const t=new THREE.Color(pick(TINTS));const g=nz(x,z,9,41);t.lerp(new THREE.Color('#b8b4a8'),g>.6?(g-.6)*1.6:0);
  INST[k].push({x,y,z,ry:R()*6.283,sx:sc*(.9+R()*.2),sy:sc*(.85+R()*.35),tilt:(R()-.5)*.08,c:t});}
// broken lumps and little stones scattered round the spires
for(let i=0;i<700;i++){const x=rr(X1+3,X2-3),z=rr(Z1+4,Z2-3);if(!free(x,z,0)||heathW(x,z)>.5)continue;const sc=.8+R()*2.6;
  INST.pebble.push({x,y:H(x,z)-.03,z,ry:R()*6.283,sx:sc*(.8+R()*.5),sy:sc*(.6+R()*.5),tilt:0,c:new THREE.Color(pick(TINTS))});}
// the lines of small pale stones along both edges of the loop (photo: pinnacle1)
{let acc=0;for(let i=0;i<LP.length;i++){const p=LP[i],q=LP[(i+1)%LP.length];acc+=.5;if(acc<.75+R()*.45)continue;acc=0;if(inR(p.x,p.z,CP,1))continue;let tx=q.x-p.x,tz=q.z-p.z;const L=Math.hypot(tx,tz)||1;tx/=L;tz/=L;
  [-1,1].forEach(sd=>{if(R()<.08)return;const off=2.45+R()*.25,x=p.x-tz*off*sd+(R()-.5)*.2,z=p.z+tx*off*sd+(R()-.5)*.2;const sc=1.1+R()*1.1;
    INST.pebble.push({x,y:H(x,z)-.02,z,ry:R()*6.283,sx:sc,sy:sc*(.7+R()*.4),tilt:0,c:new THREE.Color(pick(['#f2e6c8','#eadcb8','#f6ecd6','#e2d2ae']))});});}}
// the trail is edged with stones too, further apart
{let acc=0;for(let i=0;i<TP.length;i++){const p=TP[i],q=TP[Math.min(i+1,TP.length-1)];acc+=.5;if(acc<1.4)continue;acc=0;let tx=q.x-p.x,tz=q.z-p.z;const L=Math.hypot(tx,tz)||1;tx/=L;tz/=L;
  [-1,1].forEach(sd=>{const x=p.x-tz*.85*sd,z=p.z+tx*.85*sd,sc=.9+R()*.8;INST.pebble.push({x,y:H(x,z)-.02,z,ry:R()*6.283,sx:sc,sy:sc*.7,tilt:0,c:new THREE.Color('#ece0c4')});});}}
{const O=new THREE.Object3D();
  for(const k in INST){const L=INST[k];if(!L.length)continue;const im=new THREE.InstancedMesh(SHAPES[k].g,SPM,L.length);
    L.forEach((s,i)=>{O.position.set(s.x,s.y,s.z);O.rotation.set(s.tilt,s.ry,s.tilt*.6);O.scale.set(s.sx,s.sy,s.sx*(.9+((i*7)%5)*.05));O.updateMatrix();im.setMatrixAt(i,O.matrix);im.setColorAt(i,s.c);});
    im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=k!=='pebble';im.receiveShadow=true;im.frustumCulled=false;im.__pxSkip=1;im.__engSkip=true;im.name='pin_spires_'+k;G.add(im);}}
PIN.nSp=nSp;
