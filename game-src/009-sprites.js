// ---------- sprites ----------
const BB=[];const DECOR_MATS=new Set();
// 4-direction sprites: characters carry 9 frames [side x3, front x3, back x3]; materials are built the first time a frame shows
const DIR4=[];
function mkFrame(f){if(f.m)return f;const t=ctex(f.c);f.t=t;f.m=f.o.basic?new THREE.MeshBasicMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,fog:false}):new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.2,.19,.18),emissiveMap:t});
  f.d=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5});return f;}
function spriteMesh(canvases,w,h,opts){opts=opts||{};
  const frames=canvases.map(c=>({c,o:opts}));mkFrame(frames[0]);
  const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);
  const mesh=new THREE.Mesh(g,frames[0].m);mesh.customDepthMaterial=frames[0].d;mesh.castShadow=opts.shadow!==false;
  mesh.userData.frames=frames;mesh.userData.cur=0;mesh.userData.step=0;BB.push(mesh);
  if(frames.length===9){mesh.userData.dir=canvases[0].height>40?0:2;mesh.userData.cur=-1;DIR4.push(mesh);showFrame(mesh);}
  return mesh;}
function showFrame(m){const u=m.userData,F=u.frames;let i=u.step;if(F.length===9)i+=u.dir===0?3:u.dir===1?6:0;if(u.cur===i||!F[i])return;const f=mkFrame(F[i]);m.material=f.m;m.customDepthMaterial=f.d;u.cur=i;}
function setFrame(m,i){m.userData.step=i;showFrame(m);}
// ---------- Plants v2 and HD people (Look Lab layer: ?lab or ?hd2 until LOOK2_LIVE is true) ----------
// Plants: crowns painted from leaf clumps, leafy edges, tapered trunks with roots, knots and branches, a golden rim
// that follows the time of day, per-tree size/shade variety and contact shadows, species details (gum, pine, palm,
// jacaranda, boab), seasonal leaves and blossom, and leaves or petals blowing in the wind.
// People: every character frame at twice the pixels with smoothed diagonals, a thin outline, soft volume and eye shine.
const LOOK2_LIVE=true;
var LEAF3_LIVE=false;const LEAF3_ON=LEAF3_LIVE||/[?&#](lab|leaf3)\b/.test(location.search+location.hash);// Look Lab: plants painted leaf by leaf
const LOOK2={on:LOOK2_LIVE||/[?&#](lab|hd2)\b/.test(location.search+location.hash),plants:true,people:true,tex:[],mats:[],frames:[],season:-1,shadows:null,leaves:null,petals:[]};
function l2hash(a,b,s){let h=(a*374761393+b*668265263+(s|0)*2246822519)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;}
function l2noise(x,y,s,seed){const gx=Math.floor(x/s),gy=Math.floor(y/s),fx=x/s-gx,fy=y/s-gy,a=l2hash(gx,gy,seed),b=l2hash(gx+1,gy,seed),c=l2hash(gx,gy+1,seed),d=l2hash(gx+1,gy+1,seed),u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function l2hsl(r,g,b){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?((g-b)/d+(g<b?6:0)):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60;}return[h,s,l];}
const L2_BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
// read a plant sprite once: kinds of pixel, leaf colours, bark, trunk rows, species
function plantParse(src){const W=src.width,H=src.height,sx=src.getContext('2d').getImageData(0,0,W,H).data;
  const T=new Uint8Array(W*H),Lm=new Float32Array(W*H),hb=new Float32Array(12);
  for(let i=0;i<W*H;i++){const o=i*4;if(sx[o+3]<128)continue;const[h,s,l]=l2hsl(sx[o],sx[o+1],sx[o+2]);Lm[i]=l;const x=i%W,y=(i/W)|0;
    const edge=x===0||y===0||x===W-1||y===H-1||sx[o-1]<128||sx[o+7]<128||sx[o-W*4+3]<128||sx[o+W*4+3]<128;if(l<.2&&edge){T[i]=1;continue;}if(s>.12&&h>=60&&h<=320)hb[Math.floor(h/30)%12]+=1+s;}
  let fb=0;for(let i=1;i<12;i++)if(hb[i]>hb[fb])fb=i;if(!hb[fb])return null;const fh=fb*30+15;const fol=[];let lo=1,hi=0;
  for(let i=0;i<W*H;i++){const o=i*4;if(sx[o+3]<128||T[i]===1)continue;const[h,s,l]=l2hsl(sx[o],sx[o+1],sx[o+2]);let dh=Math.abs(h-fh);dh=Math.min(dh,360-dh);
    if((h>=12&&h<=58&&s<.6&&!(l>.88))||(s<.1&&l<.9))T[i]=3;else if(s>.08&&dh<70){T[i]=2;fol.push(i);lo=Math.min(lo,l);hi=Math.max(hi,l);}else T[i]=4;}
  if(fol.length<W*H*.04)return null;
  const pick=f=>{let best=fol[0],bd=9;for(const i of fol){const d=Math.abs(Lm[i]-f);if(d<bd){bd=d;best=i;}}const o=best*4;return[sx[o],sx[o+1],sx[o+2]];};
  // trunk rows: the bark pixels below the crown (or the widest bark run)
  const rows=[];let bn=0,br=0,bg=0,bb=0,bl=0;for(let y=0;y<H;y++){let a=-1,b=-1;for(let x=0;x<W;x++){const i=y*W+x;if(T[i]===3){if(a<0)a=x;b=x;bn++;const o=i*4;br+=sx[o];bg+=sx[o+1];bb+=sx[o+2];bl+=Lm[i];}}rows.push(a<0?null:[a,b]);}
  const barkC=bn?[br/bn,bg/bn,bb/bn]:[107,68,40],barkL=bn?bl/bn:.3;let tw=0;rows.forEach(r=>{if(r)tw=Math.max(tw,r[1]-r[0]+1);});
  // crown width profile, for pines
  let top=H,bot=0,mw=0,mwY=0;const cw=[];for(let y=0;y<H;y++){let n=0;for(let x=0;x<W;x++){const t=T[y*W+x];if(t===2||t===1||t===4)n++;}cw.push(n);if(n){top=Math.min(top,y);bot=Math.max(bot,y);}if(n>mw){mw=n;mwY=y;}}
  const ch=bot-top+1;const narrowTop=cw[Math.min(H-1,top+Math.round(ch*.15))]<mw*.4&&mwY>top+ch*.5;
  const purple=fh>=240&&fh<=320,bush=!bn&&H<=24,grass=W<=14;
  let crownArea=0;for(let y=top;y<=bot;y++)crownArea+=cw[y];const fill=crownArea/Math.max(1,ch*mw);
  const kind=grass?'grass':bush?'bush':purple?'jac':barkL>.45?'gum':(tw>=W*.4)?'boab':(W<=24&&H>=40&&ch<H*.45&&tw<=4)?'palm':narrowTop?'pine':'broad';
  return{W,H,sx,T,Lm,fh,dk:pick(lo),lt:pick(hi),lo,hi,rows,barkC,barkL,tw,top,bot,kind};}
function l2ramp(dk,lt){const mix=(a,b,t)=>a.map((v,k)=>v+(b[k]-v)*t);const R=[];for(let k=0;k<7;k++){const t=k/6;let c=mix(dk.map(v=>v*.74),lt.map(v=>Math.min(255,v*1.1)),t);c=[c[0]+(t-.5)*16,c[1]+(t-.5)*6,c[2]-(t-.5)*18].map(v=>Math.max(0,Math.min(255,Math.round(v))));R.push(c);}return R;}
const L2_AUTUMNS=[l2ramp([92,40,22],[244,196,92]),l2ramp([104,36,18],[250,150,64]),l2ramp([86,22,22],[232,96,62])],L2_AUTUMN=L2_AUTUMNS[0],L2_GREEN=l2ramp([45,90,44],[160,200,100]),L2_WINTER=l2ramp([40,64,48],[132,160,110]);
// paint one plant (season 0 summer, 1 autumn, 2 winter, 3 spring); returns the picture and a rim-light mask
function plantPaint(P,season,seed){const{W,H,sx,T}=P,W2=W*2,H2=H*2,kind=P.kind;const rnd=mulberry32(seed|0);const R=()=>rnd();
  let RAMP=l2ramp(P.dk,P.lt);const blend=(A,B,t)=>A.map((c,i)=>c.map((v,k)=>Math.round(v+(B[i][k]-v)*t)));
  const deciduous=kind==='broad'||kind==='bush';
  if(season===1&&deciduous)RAMP=blend(RAMP,L2_AUTUMNS[Math.abs(seed)%3],kind==='bush'?.35:.86);
  if(season===2&&deciduous)RAMP=blend(RAMP,L2_WINTER,.35);
  let jacMix=0;if(kind==='jac'){jacMix=season===3?0:season===0?.5:1;}// jacaranda: purple in spring, half in summer, green after
  const OUTC=P.dk.map(v=>Math.round(v*.48)),OUTL=OUTC.map(v=>Math.round(v*1.4));
  const img=new Uint8ClampedArray(W2*H2*4),IDX=new Int8Array(W2*H2).fill(-1),KIND=new Uint8Array(W2*H2),RIM=new Uint8Array(W2*H2);
  const put=(x,y,c,k)=>{if(x<0||y<0||x>=W2||y>=H2)return;const i=y*W2+x,o=i*4;img[o]=c[0];img[o+1]=c[1];img[o+2]=c[2];img[o+3]=255;KIND[i]=k;};
  // crown mask at 2x (smooth silhouette)
  const crownAt=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return 0;const t=T[y*W+x];if(t===2||t===4)return 1;if(t!==1)return 0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W&&Y<H){const q=T[Y*W+X];if(q===2||q===4)return 1;}}return 0;};
  const M=new Uint8Array(W2*H2);let cx0=0,cy0=0,cn=0,minY=H2,maxY=0;
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const fx=(x+.5)/2-.5,fy=(y+.5)/2-.5,x0=Math.floor(fx),y0=Math.floor(fy),tx=fx-x0,ty=fy-y0;
    const a=crownAt(x0,y0)*(1-tx)*(1-ty)+crownAt(x0+1,y0)*tx*(1-ty)+crownAt(x0,y0+1)*(1-tx)*ty+crownAt(x0+1,y0+1)*tx*ty;if(a>=.5){M[y*W2+x]=1;cx0+=x;cy0+=y;cn++;minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}
  if(!cn)return null;cx0/=cn;cy0/=cn;
  const BK=(()=>{const c=P.barkC;const gum=kind==='gum';return(gum?[.62,.8,.94,1.06]:[.46,.7,.95,1.2]).map(k=>c.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))));})();
  const PEEL=[[150,136,116],[176,160,136]];
  // trunk: taper, root flare, bark streaks, knots (palm: rings, gum: peeling patches, boab: a fat bottle)
  let tTop=-1,tCx=W2/2;{const rows=P.rows;let first=-1,last=-1;rows.forEach((r,y)=>{if(r){if(first<0)first=y;last=y;}});
    if(first>=0){tTop=first*2;const knots=[];for(let k=0;k<2;k++)knots.push([R(),R()]);
      for(let y2=first*2;y2<H2;y2++){const r=rows[Math.min(last,Math.floor(y2/2))]||rows[last];if(!r)continue;let a=r[0]*2,b=r[1]*2+1;const t=(y2-first*2)/Math.max(1,H2-first*2);
        if(kind!=='boab'&&kind!=='palm'){const w=b-a,shrink=Math.round((1-t)*w*.18);a+=shrink;b-=shrink;}
        const fl=H2-y2;if(fl<=5&&kind!=='palm'){const e=6-fl;a-=e;b+=e;}
        const w=b-a+1;tCx=(a+b)/2;
        for(let x=a;x<=b;x++){if(fl<=5&&kind!=='palm'){// roots: bumps at the base
            const rx=(x-a)/w;if(fl>1&&Math.abs(rx-.5)>.3&&l2hash(x>>1,0,seed)<.45)continue;}
          const e=(x-a)/Math.max(1,w-1);let s=e<.16?0:e<.42?1:e<.78?2:3;
          if(kind==='palm'){if(y2%5===0)s=Math.max(0,s-1);if(y2%5===1&&s<3)s++;}
          else{if(l2hash(x,y2>>2,seed)<.22)s=Math.max(0,s-1);if(l2hash(x,y2>>3,seed+5)>.9)s=Math.min(3,s+1);}
          let c=BK[s];
          if(kind==='gum'&&l2noise(x,y2,3.2,seed)>.6)c=PEEL[s>1?1:0];
          for(const[kx,ky]of knots){const kxp=a+w*(.3+kx*.4),kyp=first*2+(H2-first*2)*(.25+ky*.45);const dx=(x-kxp)/1.6,dy=(y2-kyp)/2.4;const dd=dx*dx+dy*dy;if(dd<1)c=dd<.4?BK[0]:BK[1];else if(dd<1.6&&dy<0)c=BK[3];}
          if(x===a||x===b)c=OUTC;put(x,y2,c,3);}}}}
  // branches up into the crown (seen through gaps)
  if(tTop>=0&&kind!=='palm'&&kind!=='bush'&&kind!=='grass'){const n=kind==='pine'?2:4;for(let k=0;k<n;k++){const dir=k%2?1:-1,len=(tTop-minY)*(.55+R()*.4),spread=(.35+R()*.5)*dir;
      let x=tCx,y=tTop+4;for(let t=0;t<1;t+=.02){x+=spread*.9+Math.sin(t*6+k)*.2;y-=len/50;const w=t<.4?2:1;for(let q=0;q<w;q++)if(M[(y|0)*W2+(x|0)+q])put((x|0)+q,y|0,BK[t<.5?1:2],3);
        if(t>.5&&l2hash(k,t*100|0,seed)>.93){let tx=x,ty=y;for(let s=0;s<5;s++){tx+=dir;ty-=1;if(M[(ty|0)*W2+(tx|0)])put(tx|0,ty|0,BK[2],3);}}}}}
  // LEAF3 (Look Lab ?leaf3): the crown is painted leaf by leaf instead of in round clumps. Every leaf has its own shape
  // (oval with a midrib, long drooping gum leaf, needle spray, palm leaflet, grass blade), its own tone from the light,
  // a lit edge on the side facing the sun and a darker midrib; leaves are laid back to front so the crown has depth.
  if(LEAF3_ON&&kind!=='palm'&&kind!=='pine'){
    const SP={broad:{n:1.7,L:[5.5,8.5],Wd:[2.3,3.2],droop:.35,round:.9,rib:1},gum:{n:1.15,L:[6,9],Wd:[1.2,1.7],droop:.95,round:.55,rib:0},
      jac:{n:2,L:[3,4.5],Wd:[1.1,1.5],droop:.25,round:.8,rib:0},pine:{n:1.5,L:[3.5,5.5],Wd:[.7,.95],droop:.15,round:.3,rib:0},
      bush:{n:1.8,L:[3.2,4.8],Wd:[1.6,2.2],droop:.2,round:1,rib:0},grass:{n:1.4,L:[6,10],Wd:[.7,1],droop:-1,round:.3,rib:0},boab:{n:1.5,L:[4,6],Wd:[1.8,2.4],droop:.3,round:.9,rib:1}}[kind]||{n:1,L:[4.5,7],Wd:[1.9,2.7],droop:.35,round:.9,rib:1};
    const area=cn,count=Math.round(area/(SP.L[0]*SP.Wd[0]*1.15)*SP.n*(season===2&&deciduous?.7:1));const LV=[];
    const cells=[];for(let i=0;i<W2*H2;i++)if(M[i])cells.push(i);
    for(let k=0;k<count;k++){const i=cells[(R()*cells.length)|0],x=i%W2,y=(i/W2)|0;
      const ox=x-cx0,oy=y-cy0,out=Math.atan2(oy,ox);let a;
      if(kind==='grass'){a=-Math.PI/2+(ox/(W2*.5))*.9+(R()-.5)*.5;}
      else if(kind==='pine'){a=(ox<0?Math.PI:0)+(R()-.5)*.6+SP.droop*(ox<0?-1:1)*.3;}
      else{a=out+(R()-.5)*1.1;const dn=Math.PI/2;let d=dn-a;d=Math.atan2(Math.sin(d),Math.cos(d));a+=d*SP.droop*.5;}
      const L=SP.L[0]+R()*(SP.L[1]-SP.L[0]),Wd=SP.Wd[0]+R()*(SP.Wd[1]-SP.Wd[0]);
      const dc=Math.hypot(ox/(W2*.5),oy/(H2*.5));LV.push({x,y,a,L,Wd,d:R()*.5+(1-Math.min(1,dc))*.3+(oy>0?.1:0),purple:kind==='jac'?(R()>=jacMix):false});}
    LV.sort((p,q)=>p.d-q.d);
    for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x;if(!M[i])continue;const e=(y>0&&!M[i-W2])||(x>0&&!M[i-1])||(x<W2-1&&!M[i+1])||(y<H2-1&&!M[i+W2]);if(e&&kind!=='gum')continue;if(kind==='gum'&&l2hash(x>>1,y>>1,seed+3)<.35)continue;const gl=(1-x/W2)*.3+(1-(y-minY)/Math.max(1,maxY-minY))*.46;const s=Math.max(0,Math.min(2,Math.floor(gl*2.6+(L2_BAYER[(y&3)*4+(x&3)]/16-.5)*.6)));put(x,y,(kind==='jac'?L2_GREEN:RAMP)[s],2);IDX[i]=s;}
    const LX=-.62,LY=-.78;// light from the top left
    for(const f of LV){const ca=Math.cos(f.a),sa=Math.sin(f.a),ramp=kind==='jac'&&!f.purple?L2_GREEN:RAMP;
      // the leaf starts at its stalk (f.x,f.y) and runs along angle a
      const x0=Math.floor(Math.min(f.x,f.x+ca*f.L)-f.Wd-1),x1=Math.ceil(Math.max(f.x,f.x+ca*f.L)+f.Wd+1),y0=Math.floor(Math.min(f.y,f.y+sa*f.L)-f.Wd-1),y1=Math.ceil(Math.max(f.y,f.y+sa*f.L)+f.Wd+1);
      const side=-(LX*-sa+LY*ca);// which half of the leaf faces the light
      const gl=(1-f.x/W2)*.3+(1-(f.y-minY)/Math.max(1,maxY-minY))*.46;
      for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=W2||y>=H2)continue;
        const rx=x+.5-f.x,ry=y+.5-f.y,u=(rx*ca+ry*sa)/f.L,v=(-rx*sa+ry*ca);if(u<0||u>1)continue;
        const prof=Math.pow(Math.sin(Math.PI*Math.min(1,u*(1+SP.round*.25))),SP.round)*(1-u*.15);const half=f.Wd*prof;if(Math.abs(v)>half||half<.35)continue;
        // stay within a pixel or two of the crown outline (tips may poke out)
        if(!M[y*W2+x]){let near=false;for(const[a2,b2]of[[1,0],[-1,0],[0,1],[0,-1],[0,-2],[2,0],[-2,0]]){const X=x+a2,Y=y+b2;if(X>=0&&Y>=0&&X<W2&&Y<H2&&M[Y*W2+X]){near=true;break;}}if(!near)continue;}
        const vn=v/Math.max(.5,half);
        let val=.17+gl*.55+f.d*.3+(vn*side>0?.15:-.09)+(u>.7?.07:0)+(l2hash(x,y,seed+7)-.5)*.08;
        if(SP.rib&&Math.abs(v)<.5&&u>.12&&u<.85)val-=.16;// midrib
        if(Math.abs(vn)>.78)val-=.07;// leaf edge
        val=Math.max(0,Math.min(.999,val));let s=Math.floor(val*7+(L2_BAYER[(y&3)*4+(x&3)]/16-.5)*.55);s=Math.max(0,Math.min(6,s));
        put(x,y,ramp[s],2);IDX[y*W2+x]=s;}}
    // a few darker gaps between the leaf layers, so the crown reads as many leaves, not one shape
    for(let y=1;y<H2-1;y++)for(let x=1;x<W2-1;x++){const i=y*W2+x;if(KIND[i]!==2||!M[i])continue;if(IDX[i]>=4&&IDX[i+W2]>=0&&IDX[i+W2]<=1&&l2hash(x,y,seed+41)<.5){const s=Math.max(0,IDX[i+W2]-1);put(x,y+1,RAMP[s],2);IDX[i+W2]=s;}}
  }else{
  // leaf clumps
  const base=Math.max(1.4,W2/22)*(kind==='grass'?.7:kind==='palm'?.55:1);const cl=[];
  const step=base*(kind==='gum'?1.25:1.05);
  for(let y=minY-1;y<=maxY;y+=step)for(let x=0;x<W2;x+=step){const px=x+(R()-.5)*step*.9,py=y+(R()-.5)*step*.9;const xi=px|0,yi=py|0;if(xi<0||yi<0||xi>=W2||yi>=H2||!M[yi*W2+xi])continue;
    if(kind==='gum'&&R()<.22)continue;if(season===2&&deciduous&&kind==='broad'&&R()<.3)continue;
    let rx=base*(.85+R()*.6),ry=rx;if(kind==='gum'){ry*=1.35;rx*=.85;}if(kind==='pine'){rx*=1.6;ry*=.62;}if(kind==='grass'){ry*=1.5;rx*=.6;}
    const dc=Math.hypot((px-cx0)/(W2*.5),(py-cy0)/(H2*.5));cl.push({x:px,y:py,rx,ry,d:R()*.55+(1-Math.min(1,dc))*.45,purple:kind==='jac'?(R()>=jacMix):false});}
  cl.sort((a,b)=>a.d-b.d);
  const tierH=Math.max(5,base*2.4);
  for(const c of cl){const x0=Math.floor(c.x-c.rx-2),x1=Math.ceil(c.x+c.rx+2),y0=Math.floor(c.y-c.ry-2),y1=Math.ceil(c.y+c.ry+2);
    const ramp=kind==='jac'&&!c.purple?L2_GREEN:RAMP;
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=W2||y>=H2)continue;const dx=(x+.5-c.x)/c.rx,dy=(y+.5-c.y)/c.ry;let dd=dx*dx+dy*dy;
      const jag=(l2hash(x,y,seed+11)-.5)*.5;if(dd>1+jag)continue;
      // only spill 1-2px past the crown outline (leaf tips), never far
      if(!M[y*W2+x]){let near=false;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1],[2,0],[-2,0],[0,-2]]){const X=x+a,Y=y+b;if(X>=0&&Y>=0&&X<W2&&Y<H2&&M[Y*W2+X]){near=true;break;}}if(!near||dd>.75)continue;}
      const local=-dx*.55-dy*.8;const gl=(1-x/W2)*.32+(1-(y-minY)/Math.max(1,maxY-minY))*.5;
      let v=.12+gl*.5+c.d*.24+local*.2+(l2hash(x>>1,y,seed+3)-.5)*.14;
      if(kind==='pine'){const tp=((y-minY)%tierH)/tierH;v+=tp<.3?.12:tp>.75?-.18:0;}
      v=Math.max(0,Math.min(.999,v));let s=Math.floor(v*7+(L2_BAYER[(y&3)*4+(x&3)]/16-.5)*.5);s=Math.max(0,Math.min(6,s));
      if(dd>.62&&local<-.2)s=Math.max(0,s-1);// clump underside: separates the clumps
      put(x,y,ramp[s],2);IDX[y*W2+x]=s;}}
  }
  // palm fronds get leaflets hanging off them
  if(kind==='palm'){const cp=img.slice();for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x;if(KIND[i]!==2||(x+y)%2)continue;if(y<H2-2&&!KIND[i+W2]){const s=Math.max(0,IDX[i]-1);put(x,y+1,RAMP[s],2);if(l2hash(x,y,seed)>.5)put(x+((x>cx0)?1:-1),y+2,RAMP[Math.max(0,s-1)],2);}}}
  // blossoms in spring, berries on bushes
  if((season===3&&deciduous)||(kind==='bush'&&season===0)){const cols=season===3?[[248,236,240],[244,170,200]]:[[214,52,58],[240,200,70]];for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x;if(KIND[i]!==2)continue;if(l2hash(x,y,seed+29)<(season===3?.035:.012)){put(x,y,cols[l2hash(x,y,seed)>.5?1:0],4);if(y>0&&KIND[i-W2]===2)put(x,y-1,[255,250,250],4);}}}
  // flowers and berries already in the sprite (flower bushes) come back on top
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(T[i]!==4)continue;const o=i*4,c=[sx[o],sx[o+1],sx[o+2]];put(x*2,y*2,c.map(v=>Math.min(255,v+36)),4);put(x*2+1,y*2,c,4);put(x*2,y*2+1,c,4);put(x*2+1,y*2+1,c.map(v=>v*.8|0),4);}
  // sunlit rim, shade beside gaps, then a 1px outline (never around holes inside the crown)
  const solid=i=>img[i*4+3]>0;
  for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x;if(KIND[i]!==2)continue;const up=y>0&&solid(i-W2),lf=x>0&&solid(i-1);
    if((!up||!lf)&&x<cx0+W2*.18&&y<minY+(maxY-minY)*.7){const s=Math.min(6,IDX[i]+2);const ramp=kind==='jac'?RAMP:RAMP;const o=i*4;const c=ramp[s];img[o]=c[0];img[o+1]=c[1];img[o+2]=c[2];RIM[i]=1;}}
  const out=img.slice();for(let y=0;y<H2;y++)for(let x=0;x<W2;x++){const i=y*W2+x,o=i*4;if(img[o+3])continue;
    const n=(x<W2-1&&img[o+7])||(y<H2-1&&img[o+W2*4+3]),m=(x>0&&img[o-1])||(y>0&&img[o-W2*4+3]);if(!n&&!m)continue;
    if(M[i]){const s=y>0&&img[o-W2*4+3];if(s)continue;}// a gap inside the crown stays open
    const c=n?OUTC:OUTL;out[o]=c[0];out[o+1]=c[1];out[o+2]=c[2];out[o+3]=255;}
  const cv=mk(W2,H2),cx=cv.getContext('2d'),id=cx.createImageData(W2,H2);id.data.set(out);cx.putImageData(id,0,0);
  // rim mask for the time-of-day glow: gold on the rim, a dim copy elsewhere
  const rv=mk(W2,H2),rx=rv.getContext('2d'),rd=rx.createImageData(W2,H2);for(let i=0;i<W2*H2;i++){const o=i*4;if(!out[o+3])continue;if(RIM[i]){rd.data[o]=210;rd.data[o+1]=172;rd.data[o+2]=110;}else{rd.data[o]=out[o]*.5;rd.data[o+1]=out[o+1]*.5;rd.data[o+2]=out[o+2]*.5;}rd.data[o+3]=255;}rx.putImageData(rd,0,0);
  return{img:cv,rim:rv};}
