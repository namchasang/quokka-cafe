// ---------- Town look on the 3D overworld (Look Lab ?ow2 / ?lab, Paul Nov 2026) ----------
// The overworld borrows the town maps' look: the game's own pixel plant sprites (LOOK2 repaint, golden rim, wind) as chunked billboards,
// houses and towers with pixel skins from texture atlases (windows light up at dusk), landmark miniatures (CBD skyline and bell tower,
// Fremantle harbour and the round limestone gaol-house, South Perth's mill and foreshore, the airport, a lighthouse island across the water),
// crisp ground grain and grass tufts near Kip, a turquoise pixel sea with a foam line, the towns' post look (depth outline, warm light /
// cool shade) on top of the Blender bake, and the red outback desert inland (the little car can't go off-road into it).
var OWT=null;
function OWTOWN(){if(!LOOK2||/[?&#]noowt\b/.test(location.search+location.hash))return;
const O={S:SOUTH,towns:TOWNS,glow:[],chunks:[],t:0,glowK:0,warnT:0,lastX:ST.x,lastZ:ST.z,dir:[0,-1]};OWT=O;
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,w|0);c.height=Math.max(1,h|0);const x=c.getContext('2d');x.imageSmoothingEnabled=false;return c;};
const TX=(c,rep)=>{const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.encoding=THREE.sRGBEncoding;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;}return t;};
const PP=(x,c,X,Y,W=1,Hh=1)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,Hh|0);};
// ---------- road kit (Paul, Nov 2026: crisp markings, one system): every road texture is drawn here in world units, power-of-two canvases,
// nearest pixels up close, mip-mapped + anisotropic far away (no shimmer). One marking spec: edge and lane lines .125 wide, stop lines .25,
// zebra bars .3, dashes 1.25 long (1 on the suburban arterials). ----------
const RK=(()=>{const hs=(a,b)=>L2hash(a*1.37+.11,b*.91+.7);const A=['#56585d','#4a4c50','#606268','#6a6c70','#505256'],W='#f4f2e8',KB='#c8c4b8',LW=.125,DASH=1.25;
  const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];};
  const P=(x,c,X,Y,w,h)=>{x.fillStyle=c;const X0=Math.round(X),Y0=Math.round(Y);x.fillRect(X0,Y0,Math.max(1,Math.round(X+w)-X0),Math.max(1,Math.round(Y+h)-Y0));};
  const asph=(x,X,Y,w,h,sd)=>{P(x,A[0],X,Y,w,h);const n=(w*h*.17)|0;for(let k=0;k<n;k++)P(x,A[1+(k%4)],X+Math.floor(hs(k,sd)*w),Y+Math.floor(hs(sd+3,k*1.7)*h),1,1);};
  const R={LW,aniso:8,made:[]};
  R.tex=c=>{const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;t.anisotropy=R.aniso;t.encoding=THREE.sRGBEncoding;t.userData={rk:1};R.made.push(t);return t;};
  R.mip=t=>{if(!t||!t.image||(t.userData&&t.userData.rk))return;const w=t.image.width,h=t.image.height,pot=v=>(v&(v-1))===0;if(!pot(w)||!pot(h))return;t.generateMipmaps=true;t.minFilter=THREE.LinearMipmapLinearFilter;t.anisotropy=R.aniso;t.needsUpdate=true;};
  // a two-lane road ribbon w units wide, the texture repeats every w units along (ribbon uv)
  R.ribbon=w=>{const S=128,k=S/w,[c,x]=cv(S,S);asph(x,0,0,S,S,7);for(const o of[-w/4,w/4])P(x,'#4c4e52',(w/2+o-.18)*k,0,.36*k,S);
    P(x,KB,0,0,.1*k,S);P(x,KB,S-.1*k,0,.1*k,S);P(x,W,.26*k,0,LW*k,S);P(x,W,S-(.26+LW)*k,0,LW*k,S);P(x,W,(w/2-LW/2)*k,(w-DASH)/2*k,LW*k,DASH*k);return c;};
  // one freeway carriageway (two lanes, 4 wide, repeats every 4); o: the tail where the left lane merges (dashed edge on one side)
  R.fwy=e=>{const S=128,w=4,k=S/w,[c,x]=cv(S,S);asph(x,0,0,S,S,11);for(const o of[-1,1])P(x,'#4c4e52',(w/2+o-.18)*k,0,.36*k,S);
    const L=(u,d)=>{if(d)for(let v=0;v<w;v+=w/2)P(x,W,u*k,(v+.35)*k,LW*k,.6*k);else P(x,W,u*k,0,LW*k,S);};
    L(.2,e===1);L(w-.2-LW,e===0);P(x,W,(w/2-LW/2)*k,(w-DASH)/2*k,LW*k,DASH*k);return c;};
  // suburban arterial, 6.5 wide (footpaths, verges, two carriageways, planted median), repeats every 2
  R.art=()=>{const SW=256,SH=64,w=6.5,k=SW/w,kv=SH/2,[c,x]=cv(SW,SH);const g=['#6a9a44','#78a64c','#86b252'];for(let X=0;X<SW;X++)for(let y=0;y<SH;y++)P(x,g[(hs(X,y)*3)|0],X,y,1,1);
    [[.0625,.4375],[6.0,.4375]].forEach(([u,d])=>{P(x,'#d8d2c4',u*k,0,d*k,SH);for(let y=0;y<SH;y+=7)P(x,'#c4bcac',u*k,y,d*k,1);});
    [[.8125,2.25],[3.4375,2.25]].forEach(([u,d])=>{asph(x,u*k,0,d*k,SH,u*10);P(x,KB,(u-.0625)*k,0,.0625*k,SH);P(x,KB,(u+d)*k,0,.0625*k,SH);P(x,W,(u+.08)*k,0,LW*k,SH);P(x,W,(u+d-.08-LW)*k,0,LW*k,SH);P(x,W,(u+d/2-LW/2)*k,.5*kv,LW*k,1*kv);});
    P(x,KB,3.0625*k,0,.375*k,SH);P(x,'#5a8a3a',3.125*k,0,.25*k,SH);for(let y=0;y<SH;y+=3)P(x,'#6aa040',(3.14+(y%5)*.04)*k,y,2,2);return c;};
  // local street, 2.5 wide (grass, footpath, kerb, asphalt), repeats every 1.25; no lines
  R.street=()=>{const SW=128,SH=64,w=2.5,k=SW/w,[c,x]=cv(SW,SH);const g=['#6a9a44','#78a64c'];for(let X=0;X<SW;X++)for(let y=0;y<SH;y++)P(x,g[hs(X,y)<.5?0:1],X,y,1,1);
    [[.094,.344],[2.0625,.344]].forEach(([u,d])=>{P(x,'#d8d2c4',u*k,0,d*k,SH);for(let y=0;y<SH;y+=10)P(x,'#c4bcac',u*k,y,d*k,1);P(x,'#e8e2d4',u*k,0,1,SH);});
    asph(x,.5625*k,0,1.375*k,SH,5);P(x,KB,.53*k,0,.0625*k,SH);P(x,KB,1.906*k,0,.0625*k,SH);P(x,'#8a8680',.594*k,0,2,SH);P(x,'#8a8680',1.875*k-2,0,2,SH);return c;};
  R.lane=()=>{const S=32,[c,x]=cv(S,S);asph(x,0,0,S,S,9);for(let q=0;q<30;q++)P(x,'#8a8070',hs(q,40)*S,hs(q,41)*S,1,1);P(x,'#6a6c66',0,0,1,S);P(x,'#6a6c66',S-1,0,1,S);return c;};
  R.ramp=()=>{const SW=64,SH=64,w=1.5,k=SW/w,[c,x]=cv(SW,SH);P(x,'#6a9a44',0,0,SW,SH);asph(x,.125*k,0,1.25*k,SH,13);P(x,KB,.0625*k,0,.0625*k,SH);P(x,KB,1.375*k,0,.0625*k,SH);P(x,W,.2*k,0,LW*k,SH);P(x,W,(1.3-LW)*k,0,LW*k,SH);return c;};
  R.asph=()=>{const S=64,[c,x]=cv(S,S);asph(x,0,0,S,S,17);return c;};
  // junction boxes: zebra crossings on every arm, a stop line on the approach half, turn arrows; drawn for the top arm, then turned
  const box=(S,w,road,zeb0,zeb1,stop0,arrows)=>{const k=S/w,[c,x]=cv(S,S);asph(x,0,0,S,S,19);
    for(let r=0;r<4;r++){x.save();x.translate(S/2,S/2);x.rotate(r*Math.PI/2);x.translate(-S/2,-S/2);
      for(let u=road[0];u+.3<=road[1]+.01;u+=.6)P(x,W,u*k,zeb0*k,.3*k,(zeb1-zeb0)*k);P(x,W,road[0]*k,stop0*k,(w/2-road[0]-.15)*k,.25*k);
      if(arrows){const ax=(road[0]+w/2)/2*k,ay=(stop0+.6)*k;P(x,W,ax-.06*k,ay,.12*k,.7*k);P(x,W,ax-.22*k,ay+.62*k,.44*k,.12*k);P(x,W,ax-.12*k,ay+.74*k,.24*k,.1*k);}x.restore();}return c;};
  R.city=()=>box(256,11,[1.5,9.5],.25,1.15,1.45,true);
  R.cityW=w=>box(256,w,[.12,w-.12],.08,.5,.62,true);// a crossroads exactly as wide as its roads (Paul, Nov 2026)
  R.cross=()=>box(256,6.5,[.85,5.65],.12,.7,.95,false);
  // street crossroads (Paul, Nov 2026, from his photos): one arm 2.5 across x 4.5 along; the middle 2.5 is the whole crossing (both carriageways,
  // footpath corners) so the two crossed arms match there; the arm ends carry the zebra crossing and a stop line on the inbound half
  R.xarm=()=>{const SW=128,w=2.5,L=4.5,k=SW/w,SH=Math.round(L*k),[c,x]=cv(SW,SH),a0=.5625,a1=1.9375,m0=(L-w)/2,m1=m0+w;const g=['#6a9a44','#78a64c'];
    for(let X=0;X<SW;X++)for(let y=0;y<SH;y++)P(x,g[hs(X,y)<.5?0:1],X,y,1,1);
    [[.094,.344],[2.0625,.344]].forEach(([u,d])=>{P(x,'#d8d2c4',u*k,0,d*k,SH);for(let y=0;y<SH;y+=10)P(x,'#c4bcac',u*k,y,d*k,1);});
    P(x,'#d8d2c4',0,m0*k,SW,w*k);asph(x,a0*k,0,(a1-a0)*k,SH,29);asph(x,0,(m0+a0)*k,SW,(a1-a0)*k,31);
    [[a0-.03,0,.0625,m0+a0],[a1-.03,0,.0625,m0+a0],[a0-.03,m0+a1,.0625,L-m0-a1],[a1-.03,m0+a1,.0625,L-m0-a1]].forEach(([u,v,du,dv])=>P(x,KB,u*k,v*k,du*k,dv*k));
    [[0,m0+a0-.03],[a1,m0+a0-.03],[0,m0+a1-.03],[a1,m0+a1-.03]].forEach(([u,v])=>P(x,KB,u*k,v*k,a0*k,.0625*k));
    for(const[e,dir]of[[0,1],[L,-1]]){for(let u=a0+.08;u+.16<=a1-.06;u+=.3)P(x,W,u*k,(dir>0?e+.18:e-.18-.62)*k,.16*k,.62*k);
      const sv=dir>0?e+.92:e-.92-.1;P(x,W,(dir>0?a0+.06:(a0+a1)/2+.02)*k,sv*k,((a1-a0)/2-.08)*k,.1*k);}
    return c;};
  // a street tee: the side street's mouth (2.5 across x 3 along); the bottom of the canvas is the through street's centre line
  R.tarm=()=>{const SW=128,w=2.5,L=3,k=SW/w,SH=Math.round(L*k),[c,x]=cv(SW,SH),a0=.5625,a1=1.9375,Y=v=>SH-v*k;const g=['#6a9a44','#78a64c'];
    for(let X=0;X<SW;X++)for(let y=0;y<SH;y++)P(x,g[hs(X,y)<.5?0:1],X,y,1,1);
    [[.094,.344],[2.0625,.344]].forEach(([u,d])=>P(x,'#d8d2c4',u*k,0,d*k,Y(1.25)));P(x,'#d8d2c4',0,Y(1.25),SW,(1.25-.6875)*k);
    asph(x,0,Y(.6875),SW,.6875*k,37);asph(x,a0*k,0,(a1-a0)*k,Y(.6875),41);
    P(x,KB,0,Y(.6875)-.03*k,a0*k,.0625*k);P(x,KB,a1*k,Y(.6875)-.03*k,SW-a1*k,.0625*k);P(x,KB,(a0-.03)*k,0,.0625*k,Y(.6875));P(x,KB,(a1-.03)*k,0,.0625*k,Y(.6875));
    for(let u=a0+.08;u+.16<=a1-.06;u+=.3)P(x,W,u*k,Y(1.95),.16*k,.62*k);P(x,W,(a0+.06)*k,Y(1.32),((a1-a0)/2-.08)*k,.1*k);
    for(let v=.1;v<1.1;v+=.3)P(x,W,((a0+a1)/2+.02)*k,Y(v+.15),((a1-a0)/2-.1)*k,.06*k);return c;};
  R.tee=()=>{const S=128,[c,x]=cv(S,S);asph(x,0,0,S,S,23);return c;};
  const MC={};R.mat=(key,mk,o)=>MC[key]||(MC[key]=new THREE.MeshLambertMaterial(Object.assign({map:R.tex(mk())},o||{})));
  return R;})();

const shc=(c,f)=>PXK.sh(c,f);
const rng=s=>{let a=s|0||1;return()=>(a=(a*16807)%2147483647)/2147483647;};
const HSH=(a,b)=>L2hash(a*1.37+.11,b*.91+.7);
const N=NORTH;
const bakeAt=(x,z)=>{if(!OWBAKE_ON)return 1;if(z<0&&N){const D=N.data;let i=(x-N.X0)/N.CE,r=-z/N.CE;i=Math.max(0,Math.min(N.NC-1.001,i));r=Math.max(0,Math.min(N.NRW-1.001,r));const k=(r|0)*N.NC+(i|0);return D.BKN[k];}return bakeMain(x,z);};
const litMat=(day,glowC,o)=>{const m=new THREE.MeshLambertMaterial(Object.assign({map:TX(day)},o||{}));if(glowC){m.emissive=new THREE.Color(0xffffff);m.emissiveMap=TX(glowC);m.emissiveIntensity=0;O.glow.push(m);}return m;};

