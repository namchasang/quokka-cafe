// ---------- Day trip: Cervantes (zone cer, x 1450..1570) · a small crayfish town on the coast, Nok's Thai Kitchen, the Crayside Holiday Park ----------
// North (-z): the Indian Ocean, white sand, a low dune with beach paths, the timber jetty with cray boats. Then the foreshore: grassy parkland with
// free electric BBQs and picnic shelters (west), the Sandpiper General Store, Nok's Thai Kitchen with its lantern terrace, the jetty approach, the
// Saltbush Cray Co-op shed with pot stacks, the boat ramp. Cadiz Street runs east-west. South (+z): the Crayside Holiday Park (reception + kiosk,
// boom gate, cabins, powered sites among banksias, camp kitchen + herb garden, amenities, playground), the car park with Kip's hire car, houses,
// and the brown tourist sign to the Pinnacles.
var TRIP_BUILD=TRIP_BUILD||{};TRIP_BUILD.cer=function(G,K){
  G.__pxSkip=1;const PPM=32,R=mulberry32(77031),rr=(a,b)=>a+(b-a)*R(),pick=a=>a[(R()*a.length)|0];
  const sh=PXK.sh,mix=PXK.mix,rnd=PXK.rnd;
  const P=(x,c,X,Y,W=1,H=1)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,H|0);};
  const cvs=(w,h)=>{const c=mk(Math.max(2,Math.round(w)),Math.max(2,Math.round(h)));const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];};
  const hex2=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
  const sm=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
  // ===== the lie of the land =====
  const TOWN=1.0,JX0=1521.6,JX1=1524.4,JZ=-33,TH=[1518.4,-36.2,1527.6,-32.4],DECK=1.45;
  const shoreZ=x=>-13+.8*Math.sin((x-1450)*.05)+.4*Math.sin((x-1450)*.15+1);
  const PATHS=[1470,1517.2],RAMP0=1551,RAMP1=1557;
  const duneF=x=>{let d=99;PATHS.forEach(p=>d=Math.min(d,Math.abs(x-p)));if(x>RAMP0-1.5&&x<RAMP1+1.5)d=0;if(x>JX0-1&&x<JX1+1)d=0;return sm(1.1,2.8,d);};
  const duneA=x=>.6+.3*Math.sin(x*.083)+.14*Math.sin(x*.31+2);
  function hT(x,z){const s=shoreZ(x);if(z<s)return Math.max(-1.8,-(s-z)*.09);if(z<-1){const t=(z-s)/(-1-s),lin=TOWN*Math.pow(t,1.25);return lin+duneA(x)*duneF(x)*Math.exp(-Math.pow((z+3.8)/1.45,2))*sm(-1,-2.2,z);}return TOWN;}
  const deckY=z=>z>-1?TOWN:z>-4?TOWN+(-1-z)/3*(DECK-TOWN):DECK;
  const onDeck=(x,z)=>(x>JX0&&x<JX1&&z>JZ-.2&&z<=-1)||(x>TH[0]&&x<TH[2]&&z>TH[1]&&z<TH[3]);
  const band=(x,z)=>(x>JX0-.5&&x<JX1+.5&&z<-1&&z>JZ)||(x>TH[0]-.5&&x<TH[2]+.5&&z>TH[1]-.5&&z<TH[3]+.5);
  K.walk=(x,z)=>{if(x<1452||x>1568||z<-44||z>44)return false;if(onDeck(x,z))return true;if(band(x,z))return false;return z>shoreZ(x)-3.6;};
  K.h=(x,z)=>onDeck(x,z)||(x>JX0&&x<JX1&&z<=-1&&z>JZ)?deckY(z):hT(x,z);
  K.arrive=[1529.2,16.6];K.van=[1529.2,19.4];K.nok=[1508.6,7.8];
  // ===== pixel painters, 32 px per metre =====
  const planks=(x,W,H,b,horiz,bw)=>{bw=bw||5;const L=horiz?H:W,M=horiz?W:H;for(let p=0;p<L;p+=bw){const seg=[];let s=-(rnd()*30|0);while(s<M){const e=s+24+(rnd()*40|0);seg.push([s,e]);s=e;}
      seg.forEach(([a,e])=>{const g=.9+rnd()*.16;const R2=(u,v,w,h,c)=>horiz?P(x,c,u,v,w,h):P(x,c,v,u,h,w);R2(a,p,e-a,bw,sh(b,g));R2(a,p,e-a,1,sh(b,g*1.14));R2(a,p+bw-1,e-a,1,sh(b,.5));R2(e-1,p,1,bw,sh(b,.62));
        for(let k=0;k<(e-a)/9;k++)R2(a+(rnd()*(e-a)|0),p+1+(rnd()*(bw-2)|0),2+(rnd()*3|0),1,sh(b,g*.84));});}};
  const PAINT={
    wood:(x,W,H,b)=>planks(x,W,H,b,W>=H,5),deck:(x,W,H,b)=>planks(x,W,H,b,true,6),
    pile:(x,W,H,b)=>{for(let X=0;X<W;X++)P(x,sh(b,.82+((X*7)%5)*.05+rnd()*.06),X,0,1,H);const wl=H*.72;for(let y=wl|0;y<H;y++)for(let X=0;X<W;X++)if(rnd()<.6)P(x,rnd()<.3?'#7a8a4a':rnd()<.5?'#4a5a34':'#5a4a3a',X,y);P(x,sh(b,.55),0,0,W,2);},
    metal:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/14;i++)P(x,sh(b,rnd()<.5?.93:1.06),rnd()*W,rnd()*H);P(x,sh(b,1.3),0,0,W,1);},
    paint:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/10;i++)P(x,sh(b,rnd()<.5?.92:1.07),rnd()*W,rnd()*H);P(x,sh(b,1.25),0,0,W,1);},
    tin:(x,W,H,b)=>{for(let X=0;X<W;X+=4){P(x,sh(b,.86),X,0,1,H);P(x,sh(b,1.0),X+1,0,1,H);P(x,sh(b,1.16),X+2,0,1,H);P(x,sh(b,.95),X+3,0,1,H);}for(let i=0;i<W*H/50;i++)P(x,sh(b,rnd()<.5?.8:1.2),rnd()*W,rnd()*H);
      for(let i=0;i<W/14;i++){const X=rnd()*W|0;for(let y=H*.6|0;y<H;y++)if(rnd()<.5)P(x,'rgba(120,70,40,.35)',X,y);}},
    tinH:(x,W,H,b)=>{for(let Y=0;Y<H;Y+=4){P(x,sh(b,.86),0,Y,W,1);P(x,sh(b,1.0),0,Y+1,W,1);P(x,sh(b,1.16),0,Y+2,W,1);P(x,sh(b,.95),0,Y+3,W,1);}},
    stone:(x,W,H,b)=>PXK.blocks(x,W,H,b,{rowH:6,minW:8,varW:7}),
    brick:(x,W,H,b)=>PXK.bricks(x,W,H,b),
    sand:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/3;i++)P(x,sh(b,[.9,.94,1.05,1.08][rnd()*4|0]),rnd()*W,rnd()*H);},
    glass:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let X=-H;X<W;X+=14){for(let k=0;k<H;k++){P(x,'rgba(160,200,220,.28)',X+k,H-k,3,1);}}P(x,'#1c2228',0,0,W,1);P(x,'#1c2228',0,H-1,W,1);},
    mesh:(x,W,H,b)=>{P(x,'rgba(0,0,0,0)',0,0,W,H);for(let X=0;X<W;X+=3)P(x,sh(b,.8),X,0,1,H);for(let Y=0;Y<H;Y+=3)P(x,sh(b,.8),0,Y,W,1);P(x,'#3a3e44',0,0,W,2);P(x,'#3a3e44',0,H-2,W,2);P(x,'#3a3e44',0,0,2,H);P(x,'#3a3e44',W-2,0,2,H);},
    stripe:(x,W,H,b)=>{const c2=b.split('|');for(let X=0;X<W;X+=8)P(x,c2[(X/8|0)%2],X,0,8,H);P(x,'rgba(255,255,255,.25)',0,0,W,1);P(x,'rgba(0,0,0,.25)',0,H-1,W,1);}};
  const TC={};
  const texC=(kind,base,wm,hm)=>{const W=Math.max(2,Math.round(wm*PPM)),H=Math.max(2,Math.round(hm*PPM));const[c,x]=cvs(W,H);PXK.seed(W*31+H*7+base.length*13+kind.length);PAINT[kind](x,W,H,base);
    if(W>4&&H>4&&kind!=='sand'&&kind!=='deck'&&kind!=='mesh'&&kind!=='glass'){P(x,'rgba(255,255,255,.14)',0,0,W,1);P(x,'rgba(0,0,0,.28)',0,H-1,W,1);P(x,'rgba(0,0,0,.18)',W-1,0,1,H);}return c;};
  const tex=(kind,base,wm,hm)=>{const q=v=>Math.max(.125,Math.round(v*8)/8);wm=q(wm);hm=q(hm);const k=kind+base+wm+'x'+hm;if(TC[k])return TC[k];
    const m=new THREE.MeshLambertMaterial({map:ctex(texC(kind,base,wm,hm))});if(kind==='mesh'){m.transparent=true;m.alphaTest=.4;m.side=THREE.DoubleSide;}return TC[k]=m;};
  const fin=(m,par)=>{m.__pxSkip=1;m.castShadow=true;m.receiveShadow=true;(par||G).add(m);return m;};
  const pb=(w,h,d,kind,base,x,y,z,o)=>{o=o||{};const sd=tex(kind,base,d,h),fr=tex(kind,base,w,h),tp=tex(o.top||kind,o.topBase||base,w,d);
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sd,sd,tp,tp,fr,fr]);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const pc=(r1,r2,h,kind,base,x,y,z,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,o.seg||8),tex(kind,base,Math.PI*2*Math.max(r1,r2),h));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const grp=(x,y,z,ry,par)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;g.__pxSkip=1;(par||G).add(g);return g;};
  const MC={};const flat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const halos=[],lanterns=[];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.4,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:1});})();
  const halo=(x,y,z,s,par,col)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0,color:col||0xffffff}));m.position.set(x,y,z);m.scale.set(s,s,1);m.__pxSkip=1;(par||G).add(m);halos.push(m);return m;};
  const lampHead=(x,y,z,s,par)=>{const l=new THREE.Mesh(new THREE.BoxGeometry(s||.16,(s||.16)*1.1,s||.16),new THREE.MeshBasicMaterial({color:'#e8d8a8'}));l.position.set(x,y,z);l.__pxSkip=1;(par||G).add(l);PXB_LAMPS.push(l);return l;};
  const signM=(lines,bg,fg,W)=>{const L=Array.isArray(lines)?lines:[lines];const t=makeSign(L,W||Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return new THREE.MeshLambertMaterial({map:t,emissive:0x333333,emissiveMap:t});};
  // a sign readable from both sides (two planes back to back)
  const signP=(lines,bg,fg,w,h,x,y,z,ry,par,two)=>{const mt=signM(lines,bg,fg);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mt);m.position.set(x,y,z);m.rotation.y=ry||0;m.__pxSkip=1;(par||G).add(m);
    if(two){const b=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mt);b.position.copy(m.position);b.rotation.y=(ry||0)+Math.PI;b.__pxSkip=1;(par||G).add(b);}return m;};
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const bbS=(v,x,z,w,h,y,par)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,y==null?K.h(x,z)-.05:y,z);m.__pxSkip=1;(par||G).add(m);BB.push(m);return m;};
  const fadeDo=fn=>{if(transit)return;transit=true;fadeTarget=.95;setTimeout(()=>{try{fn();}catch(e){console.error(e);}updateCamera(0,true);fadeTarget=0;transit=false;save();},850);};

  // ===== plants: Norfolk pines, peppermints, banksias, saltbush, spinifex (sprites at the game's pixel size) =====
  const PINE_C=['#1f3a26','#2a4c30','#386238','#4c7a44','#6a9650'];
  const pineC=seed=>{const r=mulberry32(seed),W=36,H=100,c=mk(W,H),x=c.getContext('2d');
    for(let y=6;y<H;y++){x.fillStyle=y%4?'#5a3e28':'#4a3220';x.fillRect(17,y,2,1);x.fillStyle='#7a5636';x.fillRect(17,y,1,1);}x.fillStyle='#3a2416';x.fillRect(15,H-3,6,3);
    for(let y=3;y<H-12;y+=4+(r()*2|0)){const t=y/(H-12),half=2+t*13+r()*2;for(const s of[-1,1]){const len=half*(.75+r()*.3);for(let k=0;k<=len;k++){const px=18+s*k,py=y+Math.round(k*k*.012)-(k>len-2?1:0);
          x.fillStyle=PINE_C[Math.min(4,Math.max(0,(s<0?3:2)-(k>len*.7?0:1)+(r()<.2?1:0)))];x.fillRect(px,py,1,2);if(r()<.6){x.fillStyle=PINE_C[s<0?4:3];x.fillRect(px,py-1,1,1);}if(r()<.4){x.fillStyle=PINE_C[0];x.fillRect(px,py+2,1,1);}}}}
    x.fillStyle=PINE_C[3];x.fillRect(17,0,2,4);return c;};
  const pepC=seed=>{const r=mulberry32(seed);const bl=[];for(let i=0;i<8;i++)bl.push([20+(r()-.5)*24,13+(r()-.5)*9,6+r()*4]);const PP=['#2e4a26','#3e6230','#527a3a','#6e9448'];const c=canopy(40,40,bl,PP,r,[18,24]);const x=c.getContext('2d');
    for(let k=0;k<44;k++){const sx=3+r()*34,sy=9+r()*12,len=5+r()*12;for(let t=0;t<len;t++){x.fillStyle=PP[(k+t)%4];x.fillRect(sx+Math.sin(t*.35)*.8|0,sy+t|0,1,1);}}
    x.fillStyle='#4a3220';x.fillRect(18,26,4,14);x.fillStyle='#6a4a30';x.fillRect(19,26,2,14);return c;};
  // old banksia: gnarled grey trunk, stiff olive leaves, yellow-orange candle flowers
  const banksiaC=seed=>{const r=mulberry32(seed);const bl=[];for(let i=0;i<9;i++)bl.push([20+(r()-.5)*26,14+(r()-.5)*12,5+r()*4]);const BP=['#3a4a2a','#4e6236','#687c44','#8a9a5a'];const c=canopy(40,44,bl,BP,r,null);const x=c.getContext('2d');
    x.fillStyle='#5a544a';x.fillRect(18,22,4,22);x.fillStyle='#7a746a';x.fillRect(19,22,1,22);x.fillStyle='#5a544a';x.fillRect(13,24,6,2);x.fillRect(21,20,7,2);x.fillRect(12,22,2,3);x.fillRect(27,18,2,3);x.fillStyle='#3a3630';x.fillRect(16,41,8,3);
    for(let k=0;k<11;k++){const fx=6+r()*28|0,fy=4+r()*18|0;x.fillStyle='#c88a2a';x.fillRect(fx,fy,3,5);x.fillStyle='#f2c44a';x.fillRect(fx,fy,2,4);x.fillStyle='#fff0a0';x.fillRect(fx,fy+1,1,1);x.fillStyle='#6a5a2a';x.fillRect(fx+1,fy+5,1,1);}return c;};
  const saltC=seed=>{const r=mulberry32(seed);const bl=[];for(let i=0;i<5;i++)bl.push([12+(r()-.5)*14,9+(r()-.5)*3,4+r()*2.5]);const c=canopy(24,14,bl,['#5a6a5a','#7a8a78','#9aa898','#bcc8b8'],r,null);return c;};
  const spinC=seed=>{const r=mulberry32(seed),c=mk(26,14),x=c.getContext('2d');const C=['#6a7a3a','#8a9a4a','#aab468','#d0c88a'];for(let k=0;k<40;k++){const bx=13+(r()-.5)*16,h=3+r()*10,lean=(bx-13)*.09+(r()-.5)*.3;for(let t=0;t<h;t++){x.fillStyle=C[Math.min(3,(t/h*3.4+r()*.6)|0)];x.fillRect(bx+lean*t|0,13-t,1,1);}}return c;};
  const herbC=seed=>{const r=mulberry32(seed),c=mk(14,10),x=c.getContext('2d');const C=pick([['#3a6a2a','#5a9a3a','#8ac45a'],['#4a6a5a','#6a9a7a','#9ac8a8'],['#3a5a2a','#4a8a3a','#7ab454']]);for(let k=0;k<26;k++){const X=2+r()*10|0,Y=1+r()*8|0;x.fillStyle=C[(r()*3)|0];x.fillRect(X,Y,2,1);x.fillRect(X,Y+1,1,1);}if(r()<.5)for(let k=0;k<4;k++){x.fillStyle=pick(['#f4f0e6','#c8a8e8','#f4d04a']);x.fillRect(2+r()*10|0,1+r()*4|0,1,1);}return c;};
  const PINES=[0,1,2].map(i=>sprMat(pineC(731+i))),PEPS=[0,1].map(i=>sprMat(pepC(841+i))),BANK=[0,1,2].map(i=>sprMat(banksiaC(951+i))),SALT=[0,1].map(i=>sprMat(saltC(1061+i))),SPIN=[0,1,2].map(i=>sprMat(spinC(1171+i))),HERB=[0,1,2,3].map(i=>sprMat(herbC(1281+i)));
  const PLANTS=[];
  const pine=(x,z,s)=>{s=s||.95+R()*.2;PLANTS.push(bbS(PINES[(R()*3)|0],x,z,3.6*s,10*s));col(x-.2,z-.2,x+.2,z+.2);};
  const pep=(x,z,s)=>{s=s||.9+R()*.3;PLANTS.push(bbS(PEPS[(R()*2)|0],x,z,4.2*s,4.2*s));col(x-.22,z-.22,x+.22,z+.22);};
  const bank=(x,z,s)=>{s=s||.85+R()*.3;PLANTS.push(bbS(BANK[(R()*3)|0],x,z,3.8*s,4.2*s));col(x-.22,z-.22,x+.22,z+.22);};
  const pineSpots=[[1455,-.2],[1462,6.4],[1476.5,-.4],[1484.5,6.2],[1489,-.6],[1527.6,6.8],[1567.6,7.0],[1459,15.6],[1546,15.4]];
  pineSpots.forEach(([x,z])=>pine(x,z));
  [[1499.5,-.4],[1514.6,4.6],[1567.2,-.8]].forEach(([x,z])=>pep(x,z));
  // ===== ground: one painted terrain mesh, 16 px per metre =====
  const GX0=1440,GX1=1580,GZ0=-17,GZ1=45,GP=16;
  const zr1=X=>25.8+1.1*Math.sin((X-1452)*.13),zr2=X=>37.2+1.0*Math.sin((X-1452)*.1+1.5);
  const inCP=(X,z)=>X>1452&&X<1518.6&&z>14.6&&z<44;
  const cpRoad=(X,z)=>inCP(X,z)&&((X>1455&&X<1516&&(Math.abs(z-zr1(X))<1.2||Math.abs(z-zr2(X))<1.2))||(X>1486.4&&X<1488.8&&z<zr1(X))||(Math.abs(X-1456.6)<1.15&&z>zr1(X)&&z<zr2(X))||(Math.abs(X-1514.4)<1.15&&z>zr1(X)&&z<zr2(X)));
  const inPark=(X,z)=>X>1519.4&&X<1545&&z>14.6&&z<26.2;
  const parkPath=X=>3.4+1.2*Math.sin(X*.15);
  const SITES=[];// powered sites: [x,z,kind]
  const pads=[];
  {const A=[1460.5,1467.5,1474.5,1481.5],B=[1460,1467,1474,1481,1494,1501,1508];A.forEach((x,i)=>SITES.push([x,zr1(x)+4.4,i%2?'cv':'van']));B.forEach((x,i)=>SITES.push([x,zr2(x)+3.8,['cv','camper','tent','cv','van','cv','camper'][i]]));SITES.push([1494,zr1(1494)+4.4,'camper']);
    SITES.forEach(([x,z])=>pads.push([x-2.4,z-2.2,x+2.4,z+1.6]));}
  const onPad=(X,z)=>{for(const p of pads)if(X>p[0]&&X<p[2]&&z>p[1]&&z<p[3])return true;return false;};
  const SHADE=[];// contact shadows painted in: [x,z,rx,rz]
  let groundC;
  {const W=(GX1-GX0)*GP,H=(GZ1-GZ0)*GP,c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
    const C=hs=>hs.map(hex2);const SAND=C(['#e4d8b8','#dccfae','#eadfc2','#d2c4a0']),WET=C(['#cdbf9c','#d6c8a6','#c2b290']),GR=C(['#4f8a3a','#5e9a42','#6aa648','#7ab454','#8cc060']),DRY=C(['#8a9a4a','#a0a858','#b8b470','#c8c08a']),
      PAV=C(['#c8bc9e','#bdaf90','#d0c4a6','#a89878']),BRK=C(['#b8604a','#a8543e','#c87058']),ASP=C(['#4a4d55','#52555d','#44474e']),CON=C(['#aaa494','#a09a8a','#b4ae9e','#8e887a']),GRV=C(['#c8b89a','#bba98a','#d4c6aa','#a8987a']);
    const bay=L2_BAYER;const cS=[],cD=[],cN1=[],cN2=[],cPP=[],cR1=[],cR2=[];for(let i=0;i<W;i++){const X=GX0+(i+.5)/GP;cS.push(shoreZ(X));cD.push(duneF(X));cN1.push(l2noise(X,0,2,4));cN2.push(l2noise(X,0,3,9));cPP.push(parkPath(X));cR1.push(zr1(X));cR2.push(zr2(X));}
    const cpR=(i,X,z)=>{if(!inCP(X,z))return false;const a=cR1[i],b2=cR2[i];return (X>1455&&X<1516&&(Math.abs(z-a)<1.2||Math.abs(z-b2)<1.2))||(X>1486.4&&X<1488.8&&z<a)||(Math.abs(X-1456.6)<1.15&&z>a&&z<b2)||(Math.abs(X-1514.4)<1.15&&z>a&&z<b2);};
    for(let j=0;j<H;j++){const z=GZ0+(j+.5)/GP;for(let i=0;i<W;i++){const X=GX0+(i+.5)/GP;const h=l2hash(i,j,9),b=bay[(i&3)+((j&3)<<2)]/16;let col;
      if(z<-1){const s=cS[i],d=z-s;
        if(X>RAMP0&&X<RAMP1&&z>s-1){col=CON[(h*3)|0];if(((z*4)|0)%2===0&&(z*4)%1<.25)col=CON[3];if(d<1.5)col=col.map(v=>v*.8|0);}
        else if(d<0)col=WET[0];
        else if(d<1.3+.3*cN1[i]){col=WET[(h*3)|0];if(d<.35&&h<.3)col=[214,202,174];if(Math.sin(X*9+z*2.5+l2noise(X,z,1,8)*3)>.86)col=WET[0];}
        else{const n=l2noise(X,z,1.4,21);col=SAND[Math.min(3,((n*3.2+b*.8)|0))];
          if(Math.abs(d-2.6-.6*cN2[i])<.2&&h<.5)col=h<.18?[96,86,50]:[138,118,70];
          if(h>.995)col=pick([[250,246,236],[240,200,190],[230,226,214]]);
          const dn=cD[i]*sm(-7.5,-4.5,z);if(dn>.2){const q=l2noise(X,z,1.1,33)*dn;if(q>.42)col=DRY[Math.min(3,((q-.42)*9+b)|0)];if(q>.5&&h<.25)col=GR[0];}
          if(z>-2.4){const t=(z+2.4)/1.4;if(h<t*.6)col=GR[1+((h*3)|0)];}}}
      else if(z>9&&z<13){col=ASP[(h*3)|0];if(Math.abs(z-11)<.06&&(X%3)<1.7)col=[236,232,220];if(Math.abs(z-9.3)<.05||Math.abs(z-12.7)<.05)col=[214,210,200];if(h<.01)col=[70,72,78];}
      else if((z>8.85&&z<=9)||(z>=13&&z<13.15))col=CON[3];
      else if((z>7.6&&z<=8.85)||(z>=13.15&&z<14.6)){const u=X*3,v=z*3;col=PAV[(h*3)|0];if((v-Math.floor(v))<.08||((u+(Math.floor(v)&1)*.5)%1)<.05)col=PAV[3];}
      else if(z>=-1&&z<=7.6){
        if(X<1486||(X>1514&&X<1520.4)){const pp=cPP[i];if(X<1486&&Math.abs(z-pp)<.5)col=CON[(h*3)|0];else if(X>1516.4&&X<1518&&z<6)col=SAND[(h*3)|0];
          else{const n=l2noise(X,z,3.2,11),m=l2noise(X,z,.9,5);let k=1+((n*2.4+m*.9+b*.6)|0);k=Math.max(0,Math.min(4,k));if(((X/1.6)|0)&1)k=Math.min(4,k+1);col=GR[k];if(h<.006)col=pick([[248,240,220],[242,200,80],[232,150,180]]);
            if(z<.4){const t=(.4-z)/1.4;if(h<t*.7)col=SAND[(h*4)|0];}}}
        else if(X<1499)col=z>5.6?CON[(h*3)|0]:CON[(h*3)|0];
        else if(X<1503.2){const u=X*4,v=z*4;col=BRK[(h*3)|0];if((v%1)<.12||((u+(Math.floor(v)&1)*.5)%1)<.06)col=[214,200,180];}
        else if(X<1514)col=CON[(h*3)|0];
        else if(X<1526.6){const u=X*2,v=z*2;col=PAV[(h*3)|0];if((v%1)<.08||(u%1)<.05)col=PAV[3];}
        else if(X<RAMP0-.4){col=CON[(h*3)|0];if(l2noise(X,z,1.2,44)>.72&&h<.6)col=[150,146,136];if(Math.abs(X%4)<.04)col=CON[3];}
        else if(X<RAMP1+.4){col=CON[(h*3)|0];if(((z*4)|0)%2===0&&(z*4)%1<.25)col=CON[3];}
        else col=GRV[(h*4)|0];}
      else{// south of the street
        if(cpR(i,X,z)){col=GRV[(h*4)|0];if(h<.08)col=[150,138,112];}
        else if(inCP(X,z)&&onPad(X,z))col=GRV[2+((h*2)|0)];
        else if(inCP(X,z)){const k=((((X+z*.2)/1.4)|0)&1);const n=l2noise(X,z,2.6,13);col=GR[Math.max(0,Math.min(4,1+k+((n*1.6+b*.5)|0)))];if(h<.004)col=[248,240,220];}
        else if(inPark(X,z)){col=ASP[(h*3)|0];const lx=(X-1519.4)%2.8;if(lx<.08&&(z<17.4||z>20.6))col=[236,234,226];if(Math.abs(z-17.4)<.05||Math.abs(z-23.4)<.05)col=[200,198,190];}
        else{const n=l2noise(X,z,3,17);if(n<.4){col=SAND[(h*3)|0].map(v=>v*.92|0);if(h<.1)col=DRY[0];}else{let k=((n-.4)*6+b)|0;col=GR[Math.max(0,Math.min(4,k))];}}}
      const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;}}
    x.putImageData(img,0,0);
    const toP=(X,Z)=>[(X-GX0)*GP,(Z-GZ0)*GP];
    // footprints on the beach, tyre tracks down the boat ramp
    for(let t=0;t<11;t++){let X=1455+R()*110,Z=shoreZ(X)+1.5+R()*5,a=R()*6.28;for(let k=0;k<40;k++){a+=(R()-.5)*.6;X+=Math.cos(a)*.45;Z+=Math.sin(a)*.3;if(Z<shoreZ(X)+.4||Z>-3)a+=Math.PI;if(X>JX0-1&&X<JX1+1)continue;const[px,py]=toP(X,Z);x.fillStyle='rgba(150,130,96,.5)';x.fillRect(px+(k&1?2:-2)|0,py|0,2,1);}}
    K._shade=(X,Z,rx,rz,a)=>{const[px,py]=toP(X,Z);for(let yy=-rz*GP;yy<rz*GP;yy++)for(let xx=-rx*GP;xx<rx*GP;xx++){const d=(xx/(rx*GP))**2+(yy/(rz*GP))**2;if(d>1)continue;if(bay[((xx+64)&3)+(((yy+64)&3)<<2)]/16<(a||.8)*(1.2-d)){x.fillStyle='rgba(20,30,20,.26)';x.fillRect(px+xx,py+yy,1,1);}}};
    pineSpots.forEach(([X,Z])=>K._shade(X+.4,Z+.3,1.4,.6,.8));groundC=c;}
  const terrain=(()=>{const NX=140,NZ=124,pos=[],uv=[],idx=[];for(let j=0;j<=NZ;j++){const z=GZ0+(GZ1-GZ0)*j/NZ;for(let i=0;i<=NX;i++){const X=GX0+(GX1-GX0)*i/NX;pos.push(X,hT(X,z),z);uv.push((X-GX0)/(GX1-GX0),1-(z-GZ0)/(GZ1-GZ0));}}
    for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const a=j*(NX+1)+i,b=a+1,c=a+NX+1,d=c+1;idx.push(a,c,b,b,c,d);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:null}));m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;})();
  // land beyond the edges (so the zoomed-out view has no void)
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(300,60),flat('#7a9a48'));m.rotation.x=-Math.PI/2;m.position.set(1510,TOWN-.02,44.9+30);m.receiveShadow=true;m.__pxSkip=1;G.add(m);}

  // ===== water: turquoise shallows to deep blue, a reef line, glints that twinkle, a foam line that laps the sand =====
  {const WX0=1440,WXX=1580,WZ0=-62,WZ1=-6,WP=8,W=(WXX-WX0)*WP,H=(WZ1-WZ0)*WP,c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
    const BANDS=[[-9,'#b8ecd8'],[.4,'#a2e6d6'],[1.6,'#7ad8d0'],[3.6,'#52cad0'],[7,'#3ab8cc'],[12,'#2aa2c6'],[20,'#2288bc'],[32,'#1f70aa'],[50,'#1a5e9a'],[999,'#1a5e9a']].map(([d,h])=>[d,hex2(h)]);
    const wS=[];for(let i=0;i<W;i++)wS.push(shoreZ(WX0+(i+.5)/WP));
    for(let j=0;j<H;j++){const z=WZ0+(j+.5)/WP;for(let i=0;i<W;i++){const X=WX0+(i+.5)/WP,d=wS[i]-z+(l2noise(X,z,6,2)-.5)*2;let q=0;while(q<BANDS.length-2&&d>BANDS[q+1][0])q++;
      const t=Math.max(0,Math.min(1,(d-BANDS[q][0])/(BANDS[q+1][0]-BANDS[q][0]))),b=L2_BAYER[(i&3)+((j&3)<<2)]/16;let col=(t>b?BANDS[q+1]:BANDS[q])[1].slice();
      if(d>9&&d<30){const n=l2noise(X,z,4,31)*.7+l2noise(X,z,1.3,32)*.3;if(n>.62)col=n>.68?[44,110,110]:((i+j)&1?[44,110,110]:col);}
      if(d>28&&d<40&&Math.abs(d-34-3*l2noise(X,0,8,7))<1.2){const n=l2hash(i,j,3);if(n<.4)col=[230,248,250];else if(n<.7)col=col.map(v=>Math.min(255,v+30));}
      if(d<4.5&&d>0){const rp=Math.sin(d*5.5+l2noise(X,z,2,5)*4);if(rp>.82)col=col.map(v=>Math.min(255,v+18));}
      const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;}}
    x.putImageData(img,0,0);const base=new THREE.Mesh(new THREE.PlaneGeometry(WXX-WX0,WZ1-WZ0),new THREE.MeshLambertMaterial({map:ctex(c)}));base.rotation.x=-Math.PI/2;base.position.set((WX0+WXX)/2,0,(WZ0+WZ1)/2);base.receiveShadow=true;base.__pxSkip=1;G.add(base);
    const far=new THREE.Mesh(new THREE.PlaneGeometry(420,260),flat('#1a64a2'));far.rotation.x=-Math.PI/2;far.position.set(1510,-.01,-62-129.9);far.__pxSkip=1;G.add(far);}
  const glintT=[0,1,2,3].map(f=>{const c=mk(64,64),x=c.getContext('2d'),r=mulberry32(61);for(let k=0;k<34;k++){const X=r()*64|0,Y=r()*64|0,L=2+(r()*4|0),ph=(r()*4)|0,on=(ph+f)%4;if(on===3)continue;x.fillStyle=on===0?'rgba(255,255,255,.85)':on===1?'rgba(220,250,255,.6)':'rgba(200,240,250,.35)';x.fillRect(X,Y,on===2?L-1:L,1);}
    const t=ctex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(420/4,240/4);return t;});
  const glint=new THREE.Mesh(new THREE.PlaneGeometry(420,240),new THREE.MeshBasicMaterial({map:glintT[0],transparent:true,depthWrite:false,opacity:.8}));glint.rotation.x=-Math.PI/2;glint.position.set(1510,.02,-10-120);glint.__pxSkip=1;glint.renderOrder=1;G.add(glint);
  const foamT=[0,1,2].map(f=>{const c=mk(64,24),x=c.getContext('2d'),r=mulberry32(77+f);for(let X=0;X<64;X++){const y0=8+Math.round(Math.sin((X+f*7)*.3)*1.5+Math.sin(X*.11+f)*1.2);x.fillStyle='rgba(255,255,255,.95)';x.fillRect(X,y0,1,2);x.fillStyle='rgba(240,252,255,.6)';x.fillRect(X,y0+2,1,1);
      for(let k=0;k<3;k++){if(r()<.45){x.fillStyle='rgba(255,255,255,'+(.25+r()*.4)+')';x.fillRect(X,y0-2-(r()*7|0),1,1);}}}const t=ctex(c);t.wrapS=THREE.RepeatWrapping;return t;});
  const foam=(()=>{const N=280,pos=new Float32Array((N+1)*2*3),uv=new Float32Array((N+1)*2*2),idx=[];for(let i=0;i<=N;i++){const X=GX0+(GX1-GX0)*i/N;uv.set([X/4,1,X/4,0],i*4);if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:foamT[0],transparent:true,depthWrite:false}));m.__pxSkip=1;m.renderOrder=2;m.frustumCulled=false;G.add(m);
    m.set=t=>{const p=g.attributes.position.array;for(let i=0;i<=N;i++){const X=GX0+(GX1-GX0)*i/N,s=shoreZ(X),w=.34*Math.sin(t*.9+X*.03)+.12*Math.sin(t*2.1+X*.2);p.set([X,.04,s+w-1.0,X,.04,s+w+.5],i*6);}g.attributes.position.needsUpdate=true;g.computeBoundingSphere();};m.set(0);return m;})();
  // the reef break: a white line of surf further out
  const surf=(()=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(140,1.4),new THREE.MeshBasicMaterial({map:foamT[1],transparent:true,depthWrite:false,opacity:.6}));m.rotation.x=-Math.PI/2;m.position.set(1510,.03,-46);m.__pxSkip=1;m.renderOrder=2;G.add(m);return m;})();

  // ===== buildings: low-poly boxes with PXK façades, gable roofs, verandahs =====
  const gable=(g,w,d,h,o)=>{const e=o.eave==null?.35:o.eave,rise=o.rise==null?d*.3:o.rise,a=Math.atan2(rise,d/2),run=d/2+e;const L=run/Math.cos(a);
    const rm=new THREE.MeshLambertMaterial({map:ctex(PXK.roof(w+2*e,L,{base:o.roofBase||'#9aa4ac',kind:o.roofKind||'tin',seed:(w*5+d)|0}))});
    [1,-1].forEach(s=>{const sl=new THREE.Mesh(new THREE.BoxGeometry(w+2*e,.08,L),rm);sl.rotation.x=s*a;sl.position.set(0,h+rise-run*Math.tan(a)/2+.04,s*run/2);fin(sl,g);});
    const gc=PXK.wall(d,rise,{base:o.base,kind:o.kind,win:0,cornice:false,plinth:false,quoins:false,moss:false,seed:9});const gm=new THREE.MeshLambertMaterial({map:ctex(gc),side:THREE.DoubleSide});
    [1,-1].forEach(s=>{const geo=new THREE.BufferGeometry();const X=s*w/2;geo.setAttribute('position',new THREE.Float32BufferAttribute([X,h,-d/2,X,h,d/2,X,h+rise,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));geo.computeVertexNormals();fin(new THREE.Mesh(geo,gm),g);});
    pb(w+2*e+.04,.1,.14,'paint',o.ridge||sh(o.roofBase||'#9aa4ac',.8),0,h+rise+.06,0,{par:g});
    if(o.thai){// gold barge boards with upswept chofa horns at the peak and hang hong tips at the eaves
      [1,-1].forEach(sx=>{[1,-1].forEach(s=>{const bb=pb(.07,.16,L+.1,'paint','#e8b830',sx*(w/2+e-.03),h+rise-run*Math.tan(a)/2+.1,s*run/2,{par:g});bb.rotation.x=s*a;});
        const ch=pb(.07,.5,.07,'paint','#f4c840',sx*(w/2+e-.03),h+rise+.32,0,{par:g});ch.rotation.x=0;const ct=pb(.07,.07,.24,'paint','#f4c840',sx*(w/2+e-.03),h+rise+.56,-.08,{par:g});
        [1,-1].forEach(s=>{const tip=pb(.07,.3,.07,'paint','#f4c840',sx*(w/2+e-.03),h+rise-run*Math.tan(a)+.2,s*(run-.02),{par:g});tip.rotation.x=-s*.5;});});}
    return rise;};
  const bld=o=>{const g=grp(o.x,o.y==null?TOWN:o.y,o.z,o.ry||0);const h=o.h,w=o.w,d=o.d;
    const face=(ww,opt)=>litMat(lit=>PXK.wall(ww,h,Object.assign({base:o.base,kind:o.kind,lit,seed:(ww*13+h*7+(o.seed||0))|0,cornice:o.cornice},opt||{})));
    const fr=face(w,o.front),bk=face(w,o.back||{win:Math.max(0,Math.floor(w/3.2))}),sd=face(d,o.side||{win:Math.max(0,Math.floor(d/3.4))});
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sd,sd,flat(sh(o.base,.8)),flat(o.base),fr,bk]);m.position.y=h/2;fin(m,g);
    if(o.roof!==false)gable(g,w,d,h,o);else pb(w+.3,.16,d+.3,'paint',o.parapet||sh(o.base,.85),0,h+.08,0,{par:g});
    if(!o.nocol){const c=Math.abs(Math.sin(o.ry||0))>.5;const hw=(c?d:w)/2,hd=(c?w:d)/2;col(o.x-hw,o.z-hd,o.x+hw,o.z+hd);}
    K._shade(o.x+.5,o.z+.4,(Math.abs(Math.sin(o.ry||0))>.5?d:w)/2+.6,(Math.abs(Math.sin(o.ry||0))>.5?w:d)/2+.5,.7);return g;};
  // verandah on the front (+z) side: posts with brackets, a skillion tin roof
  const verandah=(g,w,dep,hh,z0,o)=>{o=o||{};const pcol=o.post||'#f4f0e6';const n=Math.max(2,Math.round(w/2.6)+1);
    for(let i=0;i<n;i++){const x=-w/2+.1+(w-.2)*i/(n-1);pb(.1,hh,.1,'paint',pcol,x,hh/2,z0+dep-.08,{par:g});if(i<n-1){const br=pb(.5,.06,.06,'paint',pcol,x+.24,hh-.22,z0+dep-.08,{par:g});br.rotation.z=.6;}if(i>0){const br=pb(.5,.06,.06,'paint',pcol,x-.24,hh-.22,z0+dep-.08,{par:g});br.rotation.z=-.6;}}
    const rf=pb(w+.2,.06,dep+.15,'tin',o.roof||'#c8ccd0',0,hh+.12,z0+dep/2,{par:g});rf.rotation.x=.12;pb(w+.2,.12,.05,'paint',o.fascia||pcol,0,hh+.06,z0+dep+.02,{par:g});
    if(o.deck)pb(w,.14,dep,'deck',o.deck,0,.07,z0+dep/2,{par:g});return rf;};
  // chairs, tables, umbrellas
  const chair=(x,z,c,ry,y,par)=>{const g=grp(x,y==null?K.h(x,z):y,z,ry||0,par);pb(.42,.05,.4,'paint',c,0,.42,0,{par:g});pb(.42,.42,.05,'paint',c,0,.65,-.2,{par:g});[[-.18,-.16],[.18,-.16],[-.18,.16],[.18,.16]].forEach(([a,b])=>pb(.04,.42,.04,'metal','#3a3e44',a,.21,b,{par:g}));return g;};
  const ptable=(x,z,c,ry,y,par)=>{const g=grp(x,y==null?K.h(x,z):y,z,ry||0,par);pb(1.8,.07,.8,'wood',c||'#8a6a4a',0,.74,0,{par:g});[-.45,.45].forEach(b=>pb(1.8,.06,.3,'wood',c||'#8a6a4a',0,.44,b*1.4,{par:g}));[-.75,.75].forEach(a=>{pb(.08,.74,.6,'wood',sh(c||'#8a6a4a',.8),a,.37,0,{par:g});});return g;};
  const umbrella=(x,z,c,y,par)=>{const g=grp(x,y==null?K.h(x,z):y,z,0,par);pc(.03,.03,2.1,'metal','#f4f0e6',0,1.05,0,{par:g});const u=new THREE.Mesh(new THREE.ConeGeometry(1.1,.45,8,1,true),new THREE.MeshLambertMaterial({map:ctex(texC('stripe',c,7,.5)),side:THREE.DoubleSide}));u.position.set(0,2.0,0);fin(u,g);return g;};

  // ===== Sandpiper General Store (x 1488..1497) =====
  {const g=bld({x:1492.5,z:3.3,w:9,d:5.6,h:3.4,base:'#e8dcc0',kind:'board',front:{win:2,door:true,doorAt:.5,doorCol:'#2f6fb0',winW:30,winH:30},roofBase:'#b8bcc0',rise:1.2,seed:3});
    verandah(g,9.2,1.5,2.7,2.8,{post:'#f4f0e6',roof:'#c8ccd0',fascia:'#2f6fb0'});
    signP(['SANDPIPER GENERAL STORE'],'#2f6fb0','#ffffff',4.6,.5,1492.5,TOWN+3.2,6.13,0);
    signP(['ICE','BAIT','PAPERS'],'#f4f0e6','#c8344a',.7,.8,1488.6,TOWN+.6,7.2,0);
    const fr=grp(1495.6,TOWN,6.75);pb(1.4,1.0,.6,'paint','#f4f0e6',0,.5,0,{par:fr});signP(['ICE'],'#2f9ad8','#ffffff',.9,.26,0,.75,.31,0,fr);
    pb(.9,.5,.5,'paint','#c8344a',1491,TOWN+.25,6.9);pb(.9,.06,.5,'wood','#8a6a4a',1491,TOWN+.52,6.9);
    lampHead(1490,TOWN+2.6,6.0,.14);lampHead(1495,TOWN+2.6,6.0,.14);halo(1492.5,TOWN+2.3,6.6,3.2);col(1494.8,6.4,1496.4,7.1);}

  // ===== Nok's Thai Kitchen (x 1503.5..1513.5, terrace x 1498.6..1503) =====
  const NOK={tables:[],lant:[]};
  {const g=bld({x:1508.5,z:3,w:10,d:6,h:3.4,base:'#f4ecd8',kind:'plaster',seed:5,front:{win:3,door:true,doorAt:.5,doorCol:'#a8303a',winW:26,winH:30},
      roofBase:'#c9473f',roofKind:'tin',ridge:'#e8b830',rise:1.7,thai:1});
    // red and gold trim: a frieze under the eave, gold corner boards, a red plinth
    const fz=texC('paint','#a8303a',10.1,.3);{const x=fz.getContext('2d');for(let X=0;X<fz.width;X+=8){P(x,'#e8b830',X,3,4,4);P(x,'#f4d04a',X+1,4,2,2);}P(x,'#e8b830',0,0,fz.width,2);P(x,'#e8b830',0,fz.height-2,fz.width,2);}
    const fzm=new THREE.MeshLambertMaterial({map:ctex(fz)});[[0,3.25,3.02,10.1,.3,.04],[0,3.25,-3.02,10.1,.3,.04]].forEach(([x,y,z,w,h,d])=>fin(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),fzm),g).position.set(x,y,z));
    [[-5.03,0],[5.03,0]].forEach(([x])=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.04,.3,6.04),fzm);s.position.set(x,3.25,0);fin(s,g);});
    [-5,5].forEach(x=>[-3,3].forEach(z=>pb(.14,3.4,.14,'paint','#e8b830',x,1.7,z,{par:g})));pb(10.06,.3,6.06,'paint','#a8303a',0,.15,0,{par:g});
    // verandah with red posts and lanterns
    verandah(g,10.2,1.4,2.8,3,{post:'#a8303a',roof:'#c9473f',fascia:'#e8b830'});
    const lantMat=()=>{const m=new THREE.MeshLambertMaterial({color:'#d8282a',emissive:new THREE.Color('#ff5030'),emissiveIntensity:.15});return m;};
    const lantern=(x,y,z,par)=>{const lm=lantMat();const l=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.3,8),lm);l.scale.set(1,1,1);l.position.set(x,y,z);fin(l,par);l.castShadow=false;
      const t=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.05,6),flat('#e8b830'));t.position.set(x,y+.17,z);fin(t,par);const b=t.clone();b.position.y=y-.17;fin(b,par);
      const ts=new THREE.Mesh(new THREE.BoxGeometry(.03,.14,.03),flat('#f4d04a'));ts.position.set(x,y-.27,z);fin(ts,par);const cd=new THREE.Mesh(new THREE.BoxGeometry(.015,.25,.015),flat('#2a2230'));cd.position.set(x,y+.3,z);fin(cd,par);
      lanterns.push({m:lm,h:halo(x,y,z,1.1,par,0xff8060)});return l;};
    [-4.4,-2.6,-.8,.8,2.6,4.4].forEach(x=>lantern(x,2.45,4.3,g));
    // the shop sign with a little gold border, and a Thai menu board on an easel
    {const c=mk(160,28),x=c.getContext('2d');x.fillStyle='#a8303a';x.fillRect(0,0,160,28);x.fillStyle='#e8b830';x.fillRect(0,0,160,2);x.fillRect(0,26,160,2);x.fillRect(0,0,2,28);x.fillRect(158,0,2,28);
      x.fillStyle='#fff0b0';x.font='bold 12px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('NOK’S THAI KITCHEN',80,10);x.fillStyle='#f4d04a';x.font='8px "Pixelify Sans", monospace';x.fillText('• dine in • takeaway • by the beach •',80,21);
      const t=ctex(c);const s=new THREE.Mesh(new THREE.PlaneGeometry(4.4,.78),new THREE.MeshLambertMaterial({map:t,emissive:0x442222,emissiveMap:t}));s.position.set(1508.5,TOWN+3.25,7.5);s.__pxSkip=1;G.add(s);NOK.sign=s;}
    {const e=grp(1505.2,TOWN,7.35,-.15);pb(.06,1.3,.06,'wood','#6a4a2a',-.36,.65,.06,{par:e});pb(.06,1.3,.06,'wood','#6a4a2a',.36,.65,.06,{par:e});pb(.06,1.3,.06,'wood','#6a4a2a',0,.62,-.25,{par:e,rx:-.35});
      const c=mk(28,40),x=c.getContext('2d');x.fillStyle='#24302a';x.fillRect(0,0,28,40);x.fillStyle='#8a6a4a';x.fillRect(0,0,28,1);x.fillRect(0,39,28,1);x.fillRect(0,0,1,40);x.fillRect(27,0,1,40);
      x.fillStyle='#f4d04a';x.font='bold 6px monospace';x.textAlign='center';x.fillText('MENU',14,7);x.fillStyle='#f4f0e6';x.font='4px monospace';['PAD THAI','GREEN CURRY','TOM YUM','MASSAMAN','SOM TUM','MANGO RICE'].forEach((s,i)=>x.fillText(s,14,13+i*4.2));
      x.fillStyle='#ff8a6a';x.fillText('CRAYFISH',14,37.5-1);x.fillStyle='#ff8a6a';x.fillText('GREEN CURRY!',14,39.5-.5);
      const s=new THREE.Mesh(new THREE.PlaneGeometry(.78,1.1),new THREE.MeshLambertMaterial({map:ctex(c)}));s.position.set(0,.8,.1);s.rotation.x=-.12;s.__pxSkip=1;e.add(s);}
    // takeaway window with a little awning and a bell
    {pb(1.2,.06,.5,'stripe','#c9473f|#f4ecd8',1511.4,TOWN+2.15,6.3,{rx:.25});pb(1.2,.08,.36,'wood','#8a5a36',1511.4,TOWN+1.1,6.2);signP(['ORDER HERE'],'#e8b830','#a8303a',1.0,.2,1511.4,TOWN+1.95,6.05,0);}
    // herb pots along the front: lemongrass, Thai basil, chilli, kaffir lime
    [1503.9,1504.6,1512.6,1513.3].forEach((x,i)=>{pc(.22,.16,.36,'paint',i%2?'#b8604a':'#c87058',x,TOWN+.18,6.5);PLANTS.push(bbS(HERB[i%4],x,6.5,.7,.5,TOWN+.34));if(i%2===0)bbS(SPIN[0],x+.02,6.52,.5,.5,TOWN+.34);});
    [[1498.9,.9],[1498.9,3],[1498.9,5.1]].forEach(([x,z])=>{pc(.3,.24,.5,'paint','#a8543e',x,TOWN+.25,z);PLANTS.push(bbS(HERB[(R()*4)|0],x,z,.9,.66,TOWN+.48));});
    // the terrace: a timber deck, three tables with chairs, string lights between poles
    pb(4.4,.14,6.6,'deck','#b08a5a',1500.8,TOWN+.07,4.0);
    [[1500.8,1.6],[1500.8,4.0],[1500.8,6.4]].forEach(([x,z],i)=>{const t=grp(x,TOWN+.14,z);pc(.45,.45,.06,'wood','#8a5a36',0,.74,0,{par:t});pc(.05,.08,.74,'metal','#3a3e44',0,.37,0,{par:t});
      pc(.46,.46,.02,'paint','#c9473f',0,.785,0,{par:t});chair(x-.75,z,'#e8b830',Math.PI/2,TOWN+.14);chair(x+.75,z,'#e8b830',-Math.PI/2,TOWN+.14);NOK.tables.push([x,z]);});
    [[1498.8,.8],[1498.8,7.2],[1503.1,7.2]].forEach(([x,z])=>pb(.08,2.6,.08,'wood','#6a4a2a',x,TOWN+1.3,z));
    const bulb=(x,y,z)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.05,6,4),new THREE.MeshBasicMaterial({color:'#e8d8a8'}));b.position.set(x,y,z);b.__pxSkip=1;G.add(b);PXB_LAMPS.push(b);};
    [[[1498.8,.8],[1498.8,7.2]],[[1498.8,7.2],[1503.1,7.2]],[[1503.1,7.2],[1503.6,6.2]]].forEach(([a,b])=>{for(let k=0;k<=8;k++){const t=k/8;bulb(a[0]+(b[0]-a[0])*t,TOWN+2.45-Math.sin(t*Math.PI)*.35,a[1]+(b[1]-a[1])*t);}});
    halo(1500.8,TOWN+2,4,6);halo(1508.5,TOWN+2.2,4.6,4.6);
    col(1498.5,.5,1499.3,5.6);}

  // ===== Saltbush Cray Co-op: a big tin shed with roller doors, pot stacks, ice bins, a little truck =====
  {const g=grp(1538,TOWN,2.4);const w=16,d=8,h=4.6;
    const front=(()=>{const[c,x]=cvs(w*PPM,h*PPM);PAINT.tin(x,c.width,c.height,'#9aaab4');[[2.2,4.6],[8.8,4.6]].forEach(([X,W])=>{const x0=X*PPM,w0=W*PPM,y0=c.height-3.5*PPM;for(let y=y0;y<c.height;y+=4){P(x,'#c8ccd0',x0,y,w0,3);P(x,'#8a9096',x0,y+3,w0,1);}P(x,'#3a3e44',x0-2,y0-2,w0+4,2);P(x,'#3a3e44',x0-2,y0,2,c.height-y0);P(x,'#3a3e44',x0+w0,y0,2,c.height-y0);});
      P(x,'#3a3e44',14.2*PPM,c.height-2.3*PPM,1*PPM,2.3*PPM);P(x,'#4a6a80',14.3*PPM,c.height-2.1*PPM,.8*PPM,.8*PPM);return new THREE.MeshLambertMaterial({map:ctex(c)});})();
    const side=tex('tin','#9aaab4',d,h);const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[side,side,flat('#8a9aa4'),flat('#8a9aa4'),front,side]);m.position.y=h/2;fin(m,g);
    gable(g,w,d,h,{base:'#9aaab4',kind:'board',roofBase:'#c8ccd0',rise:1.2,eave:.3});
    signP(['SALTBUSH CRAY CO-OP','fresh rock lobster · since 1968'],'#1d3a6e','#f4f0e6',5.2,.9,1538,TOWN+h+.15,6.66,0);
    col(1530,-1.6,1546,6.4);K._shade(1538.5,2.8,8.6,4.6,.7);
    // inside the open doors: a glimpse of the sorting bench and blue tubs
    lampHead(1534.5,TOWN+3.8,6.5,.18);lampHead(1541,TOWN+3.8,6.5,.18);halo(1534.5,TOWN+3.4,7,3.5);halo(1541,TOWN+3.4,7,3.5);}
  // lobster pots: steel frames with mesh, stacked, with orange floats and rope coils
  const potM=tex('mesh','#c8ccd0',.9,.5),potTop=tex('mesh','#c8ccd0',.9,.9);
  const pot=(x,y,z,ry)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.9,.5,.9),[potM,potM,potTop,potTop,potM,potM]);m.position.set(x,y+.25,z);m.rotation.y=ry||0;fin(m);const n=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.06,8),flat('#2a2a30'));n.position.set(x,y+.51,z);fin(n);return m;};
  const potStack=(x,z,nx,nz,ny)=>{for(let i=0;i<nx;i++)for(let k=0;k<nz;k++){const hgt=ny-((i+k)%2&&R()<.5?1:0);for(let j=0;j<hgt;j++)pot(x+i*.95,TOWN+j*.52,z+k*.95,(R()-.5)*.08);}col(x-.5,z-.5,x+nx*.95-.45,z+nz*.95-.45);};
  potStack(1547.2,-1.2,2,3,4);potStack(1528.2,4.6,1,2,3);potStack(1547.2,4.8,2,1,2);
  const float=(x,y,z,c)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),flat(c||'#f08a3a'));m.position.set(x,y,z);fin(m);return m;};
  for(let i=0;i<9;i++)float(1546.8+R()*2.4,TOWN+.17,6.6+R()*.6,pick(['#f08a3a','#e2584f','#f2c84a']));
  [[1544.6,6.9],[1529.6,6.6]].forEach(([x,z])=>{pc(.35,.35,.16,'paint','#d8b878',x,TOWN+.08,z);pc(.22,.22,.18,'paint','#c8a868',x,TOWN+.18,z);});
  [[1543,6.6,'#2f8ad8'],[1543.9,6.7,'#2f8ad8'],[1531.2,7.0,'#f4f0e6']].forEach(([x,z,c])=>pb(.7,.55,.5,'paint',c,x,TOWN+.27,z));col(1542.6,6.3,1544.3,7);
  // the co-op truck
  {const g=grp(1536,TOWN,-3.6+0,Math.PI);pb(1.5,1.4,1.9,'paint','#f4f0e6',-1.8,.95,0,{par:g});pb(.2,.6,1.7,'glass','#2a3a4a',-2.55,1.25,0,{par:g});pb(3.6,1.8,2,'paint','#e8e8e2',.8,1.2,0,{par:g});
    signP(['SALTBUSH CRAY CO-OP'],'#f4f0e6','#1d3a6e',2.8,.3,.8,1.4,1.01,0,g);[[-1.9,1],[1.6,1],[-1.9,-1],[1.6,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.24,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.34,s*.95);fin(w,g);});}
  // the boat ramp: a boat on a trailer behind a ute, and two empty trailers
  const ute=(x,z,ry,c)=>{const g=grp(x,K.h(x,z),z,ry);pb(2.3,.45,1.0,'paint',c,0,.48,0,{par:g});pb(.95,.42,.92,'paint',c,.48,.9,0,{par:g});pb(.97,.32,.94,'glass','#2a3a4a',.48,.94,0,{par:g});pb(1.05,.06,.98,'metal','#3a3e44',-.62,.72,0,{par:g});
    [[.7,1],[-.7,1],[.7,-1],[-.7,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.22,s*.5);fin(w,g);});
    lampHead(1.16,.55,.32,.08,g);lampHead(1.16,.55,-.32,.08,g);return g;};

  // ===== cray boats: pointed hull, white wheelhouse, an A-frame davit, pots on the back deck =====
  const boats=[];
  const hullShape=(L,W)=>{const s=new THREE.Shape();s.moveTo(-L/2,-W/2);s.lineTo(L*.2,-W/2);s.quadraticCurveTo(L*.45,-W*.35,L/2,0);s.quadraticCurveTo(L*.45,W*.35,L*.2,W/2);s.lineTo(-L/2,W/2);s.lineTo(-L/2,-W/2);return s;};
  const crayBoat=(x,z,ry,hc,name)=>{const g=grp(x,0,z,ry);const L=7,W=2.5;const hm=tex('paint',hc,1,1);hm.map.wrapS=hm.map.wrapT=THREE.RepeatWrapping;
    const geo=new THREE.ExtrudeGeometry(hullShape(L,W),{depth:1.1,bevelEnabled:false});geo.rotateX(-Math.PI/2);const h=new THREE.Mesh(geo,[tex('deck','#c8b08a',2,2),hm]);h.position.y=-.4;fin(h,g);
    const geo2=new THREE.ExtrudeGeometry(hullShape(L*1.01,W*1.03),{depth:.14,bevelEnabled:false});geo2.rotateX(-Math.PI/2);const st=new THREE.Mesh(geo2,flat('#1d3a6e'));st.position.y=.56;fin(st,g);
    const geo3=new THREE.ExtrudeGeometry(hullShape(L*1.005,W*1.015),{depth:.3,bevelEnabled:false});geo3.rotateX(-Math.PI/2);const bt=new THREE.Mesh(geo3,flat('#a8303a'));bt.position.y=-.42;fin(bt,g);
    const wh=grp(.8,.7,0,0,g);pb(2.2,1.4,1.9,'paint','#f4f0e6',0,.7,0,{par:wh});pb(.06,.55,1.7,'glass','#2a3a4a',1.12,1.0,0,{par:wh});pb(2,.06,.04,'glass','#2a3a4a',0,1.0,.96,{par:wh});pb(2,.55,.04,'glass','#2a3a4a',0,1.0,.96,{par:wh});pb(2,.55,.04,'glass','#2a3a4a',0,1.0,-.96,{par:wh});
    pb(2.5,.08,2.1,'paint','#e8e8e2',.1,1.44,0,{par:wh});pc(.04,.04,1.8,'metal','#e8e8e2',.2,2.3,0,{par:wh});pb(.6,.04,.04,'metal','#e8e8e2',.2,2.9,0,{par:wh});
    const lt=lampHead(.2,3.22,0,.1,wh);
    [[-1],[1]].forEach(([s])=>{const a=pb(.08,2.0,.08,'metal','#e8b830',-2.6,1.6,s*.95,{par:g});a.rotation.x=s*.18;a.rotation.z=-.2;});pb(.08,.08,2,'metal','#e8b830',-2.8,2.55,0,{par:g});
    for(let i=0;i<2;i++)for(let k=0;k<2;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.8,.45,.8),[potM,potM,potTop,potTop,potM,potM]);m.position.set(-1.5-i*.9,.95+.22,(k-.5)*.9);fin(m,g);}
    {const fb=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),flat('#f08a3a'));fb.position.set(-3.2,1.1,.8);fin(fb,g);}
    if(name)signP([name],hc,'#1d3a6e',1.6,.22,1.6,.3,W/2+.01,0,g);
    boats.push({g,ph:R()*6,y:0});return g;};
  crayBoat(1528.4,-15,-Math.PI/2+.04,'#f4f0e6','SOUTHERN STAR');crayBoat(1528.6,-24.5,-Math.PI/2-.03,'#e8f0f2','MISS NOK');crayBoat(1516.2,-21,Math.PI/2+.1,'#f2e8d0','KESTREL II');
  {const g=grp(1505,0,-22,.6);const m=new THREE.Mesh(new THREE.CylinderGeometry(.55,.4,2.6,8,1,false,0,Math.PI),flat('#2f8ad8'));m.rotation.z=Math.PI/2;m.rotation.x=Math.PI;m.position.y=.25;fin(m,g);boats.push({g,ph:2,y:0});}
  [[1534,-10],[1511,-16],[1540,-26],[1500,-30]].forEach(([x,z],i)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),flat(i%2?'#f08a3a':'#e2584f'));b.position.set(x,.06,z);fin(b);boats.push({g:b,ph:i*2,y:.06});});

  // ===== the jetty: timber piles, headstocks, a plank deck, railings, lamps, a T-head for fishing =====
  {const deckM=tex('deck','#b0906a',1,1);const pileM=tex('pile','#7a5a3e',.3,3);
    const deck=(x0,z0,x1,z1,y,ry)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,.16,z1-z0),[tex('wood','#8a6a4a',z1-z0,.16),tex('wood','#8a6a4a',z1-z0,.16),tex('deck','#b0906a',x1-x0,z1-z0),deckM,tex('wood','#8a6a4a',x1-x0,.16),tex('wood','#8a6a4a',x1-x0,.16)]);m.position.set((x0+x1)/2,y-.08,(z0+z1)/2);return fin(m);};
    deck(JX0,JZ,JX1,-4,DECK);deck(TH[0],TH[1],TH[2],TH[3],DECK);
    {const L=3.1,a=Math.atan2(DECK-TOWN,3),m=deck(JX0,-4.05,JX1,-.95,(DECK+TOWN)/2);m.scale.z=1/Math.cos(a)*1.0;m.rotation.x=a;}
    for(let z=-5;z>JZ;z-=3)[JX0+.15,JX1-.15].forEach(x=>{const gy=hT(x,z);const hgt=DECK-.15-gy+.3;const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,hgt,6),pileM);p.position.set(x,gy-.3+hgt/2,z);fin(p);});
    for(let x=TH[0]+.2;x<TH[2];x+=2.25)[TH[1]+.2,TH[3]-.2].forEach(z=>{const gy=hT(x,z),hgt=DECK-.15-gy+.3;const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,hgt,6),pileM);p.position.set(x,gy-.3+hgt/2,z);fin(p);});
    for(let z=-5;z>JZ;z-=3)pb(JX1-JX0+.5,.2,.22,'wood','#6a4a2e',(JX0+JX1)/2,DECK-.26,z);
    // railings
    const rail=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),ry=Math.atan2(-(z1-z0),x1-x0);[.55,1.0].forEach(y=>pb(L,.07,.06,'wood','#d8c8a8',(x0+x1)/2,DECK+y,(z0+z1)/2,{ry}));
      const n=Math.max(1,Math.round(L/1.5));for(let i=0;i<=n;i++){const t=i/n;pb(.09,1.05,.09,'wood','#d8c8a8',x0+(x1-x0)*t,DECK+.52,z0+(z1-z0)*t);}};
    rail(JX0+.05,-4,JX0+.05,TH[3]);rail(JX1-.05,-4,JX1-.05,TH[3]);rail(TH[0]+.05,TH[3],JX0,TH[3]);rail(JX1,TH[3],TH[2]-.05,TH[3]);rail(TH[0]+.05,TH[1]+.05,TH[2]-.05,TH[1]+.05);rail(TH[0]+.05,TH[1],TH[0]+.05,TH[3]);rail(TH[2]-.05,TH[1],TH[2]-.05,TH[3]);
    [-10,-20,-30].forEach(z=>{pb(.1,2.6,.1,'metal','#3a3e44',JX1-.06,DECK+1.3,z);pb(.4,.06,.06,'metal','#3a3e44',JX1-.24,DECK+2.6,z);lampHead(JX1-.4,DECK+2.5,z,.14);halo(JX1-.4,DECK+2.3,z,2.6);});
    // bollards and a bench on the T-head, a cleaning table for the catch
    [[TH[0]+.6,TH[3]-.5],[TH[2]-.6,TH[3]-.5],[JX1-.3,-14],[JX1-.3,-24]].forEach(([x,z])=>pc(.1,.12,.4,'paint','#2a2a30',x,DECK+.2,z));
    pb(1.6,.08,.4,'wood','#8a6a4a',1523,DECK+.45,-35.6);pb(1.4,.9,.7,'metal','#c8ccd0',1526.2,DECK+.45,-34.0);col(1525.5,-34.4,1526.9,-33.6);
    signP(['CERVANTES JETTY','no diving · fish rules apply'],'#1d3a6e','#f4f0e6',1.6,.5,1520.9,TOWN+1.3,-.6,0);pb(.08,1.0,.08,'metal','#9aa0a6',1520.9,TOWN+.5,-.65);}

  // ===== foreshore parkland: free electric BBQs, shade shelters, picnic tables, playground-free lawn for kids =====
  const smoke=[];
  const shelter=(x,z,w,d,c)=>{const g=grp(x,TOWN,z);[[-w/2+.15,-d/2+.15],[w/2-.15,-d/2+.15],[-w/2+.15,d/2-.15],[w/2-.15,d/2-.15]].forEach(([a,b])=>pc(.07,.07,2.5,'metal','#3a3e44',a,1.25,b,{par:g}));
    gable(g,w,d,2.5,{base:'#8a6a4a',kind:'board',roofBase:c||'#3e7d5c',rise:.8,eave:.25});pb(w,.08,d,'paint','#c8c2b4',0,.04,0,{par:g});return g;};
  const bbq=(x,z)=>{const g=grp(x,TOWN,z);pb(1.6,.9,.7,'stone','#c8b89a',0,.45,0,{par:g});pb(1.0,.06,.5,'metal','#3a3e44',0,.93,0,{par:g});pb(.3,.06,.5,'metal','#9aa0a6',.66,.93,0,{par:g});pb(.16,.12,.05,'paint','#e2584f',-.6,.7,.36,{par:g});
    signP(['FREE BBQ','push to start'],'#3e7d5c','#f4f0e6',.5,.24,-.5,.6,.36,0,g);col(x-.85,z-.4,x+.85,z+.4);smoke.push({x,z,t:R()*3});return g;};
  shelter(1468,2.2,4.6,3.4,'#3e7d5c');bbq(1467.2,1.4);ptable(1469,2.8,'#8a6a4a',0);
  shelter(1479,3.8,4.2,3.2,'#2f6a74');ptable(1479,3.8,'#8a6a4a',0);bbq(1483.4,1.2);
  ptable(1458,3.6,'#7a5a3a',.2);ptable(1462.2,1.2,'#7a5a3a',-.3);ptable(1474,6,'#7a5a3a',0);
  [[1469,2.8],[1479,3.8],[1458,3.6],[1462.2,1.2],[1474,6]].forEach(([x,z])=>col(x-.9,z-.65,x+.9,z+.65));
  // a bin, a tap, a sign about the BBQs, a bench facing the sea
  pc(.25,.22,.8,'paint','#3e7d5c',1472,TOWN+.4,6.8);pc(.04,.04,.9,'metal','#9aa0a6',1465,TOWN+.45,4.6);
  pb(1.6,.08,.4,'wood','#8a6a4a',1486.8,TOWN+.45,-.4);pb(1.6,.4,.06,'wood','#8a6a4a',1486.8,TOWN+.7,-.2);
  signP(['FORESHORE PARK','free electric BBQs · please clean up'],'#3e7d5c','#f4f0e6',2.4,.5,1456.6,TOWN+1.4,7.2,0);pb(.08,1.2,.08,'metal','#9aa0a6',1456.6,TOWN+.6,7.15);
  // dune scrub along the beach, beach access paths with fence posts
  for(let x=1453;x<1567;x+=.9+R()*1.4){const f=duneF(x);if(f<.5)continue;const z=-3.6+(R()-.5)*3.4;const s=.8+R()*.5;if(R()<.45)bbS(SALT[(R()*2)|0],x,z,1.5*s,.88*s);else bbS(SPIN[(R()*3)|0],x,z,1.1*s,.6*s);}
  for(let x=1453;x<1567;x+=2.6+R()*2){const f=duneF(x);if(f<.5)continue;bbS(SPIN[(R()*3)|0],x,-6.4+R()*1.2,.9,.5);}
  PATHS.forEach(px=>{for(let z=-1.2;z>-6.5;z-=1.3)[-1.3,1.3].forEach(s=>pb(.08,.7,.08,'wood','#8a7a5a',px+s,hT(px+s,z)+.3,z));});
  signP(['BEACH ACCESS','keep to path · dunes are fragile'],'#3e7d5c','#f4f0e6',1.6,.42,1468.5,TOWN+1.2,-.8,0);pb(.06,1.0,.06,'metal','#9aa0a6',1468.5,TOWN+.5,-.85);

  // ===== Cadiz Street: lamps, a bench, a bus-shelter style seat, the Pinnacles sign =====
  for(let x=1462;x<1568;x+=14){pc(.06,.08,4.2,'metal','#5a5e6a',x,TOWN+2.1,14.0);pb(1.0,.08,.08,'metal','#5a5e6a',x,TOWN+4.1,13.55);lampHead(x,TOWN+4.0,13.1,.2);halo(x,TOWN+3.6,12.6,4);col(x-.1,13.9,x+.1,14.1);}
  {const g=grp(1564.2,TOWN,14.0);pb(.1,2.6,.1,'metal','#9aa0a6',-.9,1.3,0,{par:g});pb(.1,2.6,.1,'metal','#9aa0a6',.9,1.3,0,{par:g});
    signP(['THE PINNACLES  19 km →','NAMBUNG NATIONAL PARK'],'#6a3a22','#f4f0e6',2.4,.7,0,2.2,.06,0,g,1);signP(['INDIAN OCEAN DRIVE'],'#2f6a3e','#ffffff',2.0,.32,0,1.55,.06,0,g,1);col(1563.2,13.9,1565.2,14.1);}
  // ===== Crayside Holiday Park =====
  // the entrance: reception + kiosk (coffee, bait, ice), a boom gate on the entry road
  {const g=bld({x:1492.6,z:18.2,w:6.2,d:4.4,h:3.0,base:'#f4f0e6',kind:'board',seed:11,front:{win:2,door:true,doorAt:.5,doorCol:'#2f8a8a',winW:30,winH:28},back:{win:2},roofBase:'#5a8a9a',rise:1.0});
    verandah(g,6.4,1.4,2.5,2.2,{post:'#f4f0e6',roof:'#9ac8d0',fascia:'#2f8a8a',deck:'#b08a5a'});
    signP(['CRAYSIDE HOLIDAY PARK','reception · kiosk'],'#2f8a8a','#ffffff',3.6,.62,1492.6,TOWN+3.3,20.48,0);
    signP(['COFFEE · BAIT · ICE'],'#f4f0e6','#2f8a8a',2.4,.3,1492.6,TOWN+2.95,15.94,Math.PI);
    pb(1.2,.9,.6,'paint','#f4f0e6',1495.1,TOWN+.45,21.6);signP(['ICE'],'#2f9ad8','#ffffff',.8,.24,1495.1,TOWN+.68,21.92,0);pb(.7,1.2,.5,'paint','#3a3e44',1490.2,TOWN+.6,21.6);signP(['BAIT'],'#f2c84a','#2a2230',.5,.2,1490.2,TOWN+1.0,21.86,0);
    col(1494.4,21.2,1495.8,22);col(1489.8,21.3,1490.6,21.9);chair(1491.4,21.9,'#2f8a8a',0);chair(1493.8,21.9,'#2f8a8a',0);
    lampHead(1491,TOWN+2.3,21.4,.14);lampHead(1494.2,TOWN+2.3,21.4,.14);halo(1492.6,TOWN+2,21.8,3.4);
    // entrance sign on the street (two-sided) on timber posts with a bed of saltbush
    const sg=grp(1484.6,TOWN,15.3);pb(.16,1.6,.16,'wood','#6a4a2a',-1.3,.8,0,{par:sg});pb(.16,1.6,.16,'wood','#6a4a2a',1.3,.8,0,{par:sg});signP(['CRAYSIDE HOLIDAY PARK','cabins · powered sites · camp kitchen'],'#2f8a8a','#ffffff',2.8,.7,0,1.25,0,0,sg,1);col(1483.2,15.2,1486,15.4);
    bbS(SALT[0],1482.8,15.8,1.4,.8);bbS(SALT[1],1486.2,15.8,1.3,.75);}
  const boom=(()=>{const g=grp(1489.3,TOWN,17.0);pb(.3,1.0,.3,'paint','#f2c84a',0,.5,0,{par:g});const arm=grp(0,.9,0,0,g);const a=pb(3.0,.1,.1,'stripe','#c8344a|#f4f0e6',-1.5,0,0,{par:arm});col(1489.1,16.8,1489.5,17.2);return arm;})();
  // cabins of several sizes: studios, a 2-bedroom cabin with a deck (rentable), a modern cube cabin; colourful doors, corrugated roofs, timber decks
  const CAB=[];
  const cabin=(x,z,w,d,base,door,roof,o)=>{o=o||{};const g=bld({x,z,w,d,h:o.h||2.6,base,kind:o.kind||'board',seed:(x*3)|0,front:{win:o.win==null?1:o.win,door:true,doorAt:o.doorAt==null?.7:o.doorAt,doorCol:door,winW:28,winH:26},roof:o.roof,parapet:o.parapet,roofBase:roof,rise:o.rise==null?.9:o.rise,eave:.3});
    if(o.deck!==false){pb(w+.4,.22,1.6,'deck','#b08a5a',0,.11,d/2+.8,{par:g});[-w/2,w/2].forEach(a=>pb(.06,.7,1.5,'wood','#d8c8a8',a,.56,d/2+.8,{par:g}));pb(w+.4,.06,.06,'wood','#d8c8a8',0,.9,d/2+1.58,{par:g});pb(.06,.7,.06,'wood','#d8c8a8',-w/2,.56,d/2+1.58,{par:g});
      chair(x-w/2+.8,z+d/2+.9,pick(['#f2c84a','#2f8a8a','#e2584f']),.3,TOWN+.22);if(o.awning!==false){const a=pb(w+.4,.05,1.7,'tin',roof,0,(o.h||2.6)+.02,d/2+.85,{par:g});a.rotation.x=.18;}}
    lampHead(x+w/2-.4,TOWN+(o.h||2.6)-.3,z+d/2+.04,.12);CAB.push({x,z:z+d/2+1.9});return g;};
  cabin(1457.6,19.4,4.2,3.6,'#bfe0d8','#e2584f','#8a9aa4');                // studio
  cabin(1465.2,19.2,6.4,4.4,'#f2e2a8','#2f6fb0','#5a6a7a',{win:2,doorAt:.5}); // 2-bedroom (rentable)
  {const g=cabin(1473.4,19.6,3.8,3.6,'#3a3e44','#f2c84a','#2a2e34',{roof:false,parapet:'#2a2e34',h:3.0,kind:'board',win:1,awning:false});pb(1.6,1.6,.04,'glass','#3a5a6a',-.5,1.4,1.82,{par:g});pb(.3,3.1,3.8,'wood','#b08a5a',1.95,1.55,0,{par:g});} // cube
  cabin(1480.4,19.4,4.2,3.6,'#e8c8d8','#2f8a8a','#8a9aa4');                // studio
  signP(['CABINS 1-4'],'#2f8a8a','#ffffff',1.1,.26,1462,TOWN+.9,23.4,0);pb(.06,.8,.06,'metal','#9aa0a6',1462,TOWN+.4,23.36);
  // amenities and laundry block (brick, tin roof), with a dump point sign by the road
  {const g=bld({x:1506.6,z:18.6,w:9,d:4.4,h:2.8,base:'#d8b89a',kind:'brick',seed:21,front:{win:3,door:true,doorAt:.5,doorCol:'#3e7d5c',winW:20,winH:12},roofBase:'#9aa4ac',rise:.9});
    signP(['AMENITIES · LAUNDRY'],'#3e7d5c','#ffffff',2.4,.3,1506.6,TOWN+2.5,20.82,0);pb(.6,.9,.5,'paint','#f4f0e6',1510.4,TOWN+.45,21.1);col(1510,20.8,1510.8,21.4);}
  {const g=grp(1490.4,TOWN,23.4);pb(.08,1.4,.08,'metal','#9aa0a6',0,.7,0,{par:g});signP(['DUMP POINT →'],'#2f6fb0','#ffffff',1.0,.26,0,1.25,.05,0,g,1);pc(.3,.3,.1,'metal','#7a7e86',.8,.05,.2,{par:g});}
  // the central camp kitchen: open shelter, benches, sinks, BBQs, a fridge, a long dining table; a herb garden in timber beds beside it
  {const x=1500.4,z=31.2;const g=shelter(x,z,7.2,4.6,'#a8303a');pb(6.6,.95,.6,'paint','#e8e2d6',0,.48,-1.9,{par:g});pb(6.6,.05,.64,'metal','#c8ccd0',0,.97,-1.9,{par:g});
    [-2,0].forEach(a=>pb(.5,.08,.4,'metal','#9aa0a6',a,.99,-1.9,{par:g}));pb(1.2,.06,.5,'metal','#3a3e44',2.2,1.0,-1.9,{par:g});pb(.7,1.8,.6,'paint','#f4f0e6',-3.1,.9,-1.6,{par:g});
    ptable(x-1.2,z+.6,'#8a6a4a',0);ptable(x+1.6,z+.6,'#8a6a4a',0);signP(['CAMP KITCHEN'],'#a8303a','#ffffff',1.8,.3,x,TOWN+2.72,z+2.12,0);
    lampHead(x,TOWN+2.4,z,.16);halo(x,TOWN+2.2,z+.4,5);col(x-3.6,z-2.3,x+3.6,z-1.5);col(x-2.1,z+.1,x+2.5,z+1.1);
    [[1505.6,29.6],[1505.6,31.6],[1505.6,33.6]].forEach(([hx,hz],i)=>{pb(1.4,.4,1.4,'wood','#8a6a4a',hx,TOWN+.2,hz);pb(1.3,.04,1.3,'sand','#6a4a2a',hx,TOWN+.41,hz);for(let k=0;k<3;k++)PLANTS.push(bbS(HERB[(i+k)%4],hx-.4+k*.4,hz+(k%2?.25:-.25),.6,.45,TOWN+.42));col(hx-.7,hz-.7,hx+.7,hz+.7);});
    signP(['HERB GARDEN','help yourself'],'#3e7d5c','#f4f0e6',1.1,.36,1507,TOWN+.8,34.5,0);}
  // a small playground: swing, slide, a spring rocker
  const swings=[];{const x=1511.4,z=31;pb(.08,2.2,.08,'metal','#2f6fb0',x-1.2,TOWN+1.1,z);pb(.08,2.2,.08,'metal','#2f6fb0',x+1.2,TOWN+1.1,z);pb(2.5,.08,.08,'metal','#2f6fb0',x,TOWN+2.2,z);
    [-.5,.5].forEach(a=>{const s=grp(x+a,TOWN+2.2,z);pb(.02,1.6,.02,'metal','#c8ccd0',-.15,-.8,0,{par:s});pb(.02,1.6,.02,'metal','#c8ccd0',.15,-.8,0,{par:s});pb(.4,.05,.2,'paint','#e2584f',0,-1.6,0,{par:s});swings.push(s);});
    const sl=pb(.6,.06,2.4,'metal','#f2c84a',x+.6,TOWN+.7,z+2.2,{rx:.55});pb(.7,1.3,.7,'paint','#e2584f',x+.6,TOWN+.65,z+3.4);col(x-1.4,z-.2,x+1.4,z+.2);col(x+.2,z+3,x+1,z+3.8);
    pb(1.6,.04,4.6,'sand','#d8c08a',x,TOWN+.02,z+1.6);}
  // banksias and peppermints in the grassy pockets
  [[1453.6,24],[1462,23.8],[1470.2,24.2],[1484,23.4],[1471,31.6],[1478,34.4],[1458,33.6],[1488,32.6],[1453.5,30],[1496,39],[1505,41.4],[1516.8,24.8],[1516.6,39.6],[1491.6,35.4]].forEach(([x,z],i)=>i%3===2?pep(x,z):bank(x,z));
  for(let i=0;i<16;i++){const x=1453+R()*64,z=15.4+R()*2;if(x>1481&&x<1497)continue;bbS(SALT[i%2],x,z,1.3,.75);}
  // powered sites: power posts, caravans with awnings and camp chairs, camper vans, a tent, cars
  const campers=[];
  const powerPost=(x,z,lamp)=>{pb(.18,.9,.14,'paint','#3e7d5c',x,TOWN+.45,z);pb(.2,.12,.16,'paint','#2a5a3a',x,TOWN+.92,z);if(lamp){lampHead(x,TOWN+1.05,z,.1);halo(x,TOWN+1,z,1.8);}col(x-.1,z-.08,x+.1,z+.08);};
  const caravan=(x,z,c)=>{const g=grp(x,TOWN,z);const L=4.2,W=2.0,H=1.8;const sk=(()=>{const[cc,xx]=cvs(L*PPM,H*PPM);P(xx,'#f4f0e6',0,0,cc.width,cc.height);P(xx,c,0,cc.height*.52,cc.width,6);P(xx,sh(c,.7),0,cc.height*.52+6,cc.width,2);
      [[.4,1.2],[2.6,1.0]].forEach(([a,w])=>{P(xx,'#2a3a4a',a*PPM,10,w*PPM,16);P(xx,'#4a6a80',a*PPM+2,12,w*PPM-4,3);});P(xx,'#c8c2b4',1.9*PPM,12,18,cc.height-14);P(xx,'#9aa0a6',1.9*PPM+14,cc.height*.6,2,2);P(xx,'rgba(0,0,0,.25)',0,cc.height-1,cc.width,1);return new THREE.MeshLambertMaterial({map:ctex(cc)});})();
    const end=tex('paint','#f4f0e6',W,H);const b=new THREE.Mesh(new THREE.BoxGeometry(L,H,W),[end,end,flat('#e8e8e2'),flat('#9aa0a6'),sk,sk]);b.position.y=.42+H/2;fin(b,g);
    pb(L-.2,.12,W-.2,'paint','#e8e8e2',0,.42+H+.06,0,{par:g});[[.3,1],[.3,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.18,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.3,s*(W/2-.05));fin(w,g);});
    pb(1.2,.08,.08,'metal','#3a3e44',-L/2-.6,.45,0,{par:g});pc(.08,.08,.4,'metal','#3a3e44',-L/2-1.1,.2,0,{par:g});
    const aw=pb(L-.4,.04,2.2,'stripe',c+'|#f4f0e6',0,2.05,W/2+1.1,{par:g});aw.rotation.x=.16;[-1,1].forEach(s=>pc(.025,.025,1.9,'metal','#c8ccd0',s*(L/2-.4),.95,W/2+2.1,{par:g}));
    pb(3.2,.02,1.8,'stripe','#2f6a74|#4e8a94',0,.02,W/2+1.2,{par:g});col(x-L/2-1.3,z-W/2,x+L/2,z+W/2);
    chair(x-.8,z+W/2+1.3,pick(['#2f6fb0','#3e7d5c','#e2584f','#2a2230']),.3);chair(x+.6,z+W/2+1.4,pick(['#2f6fb0','#3e7d5c','#e2584f','#f2c84a']),-.3);
    {const t=grp(x-.1,TOWN,z+W/2+1.8);pb(.8,.04,.6,'paint','#e8e2d6',0,.62,0,{par:t});[[-.35,-.25],[.35,-.25],[-.35,.25],[.35,.25]].forEach(([a,bq])=>pb(.03,.62,.03,'metal','#9aa0a6',a,.31,bq,{par:t}));}
    lampHead(L/2-.3,1.95,W/2+.02,.1,g);return g;};
  const campervan=(x,z,c,ry)=>{const g=grp(x,TOWN,z,ry||0);const L=4.4,W=1.8;pb(L,1.5,W,'paint','#f4f0e6',0,1.0,0,{par:g});pb(L,.32,W+.01,'paint',c,0,.7,0,{par:g});pb(.06,.6,1.6,'glass','#2a3a4a',L/2,1.3,0,{par:g});pb(1.2,.45,.04,'glass','#2a3a4a',-.6,1.3,W/2+.01,{par:g});pb(2.4,.3,1.4,'paint','#e8e8e2',-.4,1.9,0,{par:g});
    [[1.4,1],[-1.4,1],[1.4,-1],[-1.4,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.18,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.3,s*(W/2-.05));fin(w,g);});
    const aw=pb(2.6,.04,1.6,'stripe',c+'|#f4f0e6',-.4,1.9,W/2+.8,{par:g});aw.rotation.x=.18;[-1.6,.8].forEach(a=>pc(.025,.025,1.8,'metal','#c8ccd0',a,.9,W/2+1.55,{par:g}));
    chair(x-.6,z+W/2+1,pick(['#2f6fb0','#3e7d5c','#e2584f']),.2);col(x-L/2,z-W/2,x+L/2,z+W/2);return g;};
  const tent=(x,z,c)=>{const g=grp(x,TOWN,z);const m=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,6,0,Math.PI*2,0,Math.PI/2),tex('paint',c,4,2));m.scale.set(1.2,.85,1);fin(m,g);const fly=new THREE.Mesh(new THREE.CircleGeometry(.45,10,0,Math.PI),flat('#2a2230'));fly.position.set(0,0,1.0);fin(fly,g);
    col(x-1.2,z-1,x+1.2,z+1);chair(x+1.6,z+1,'#f2c84a',-.4);
    // a little campfire ring with a flicker
    const ring=grp(x-1.8,TOWN,z+1.2);for(let a=0;a<6.28;a+=.8)pc(.08,.1,.12,'stone','#8a8a8a',Math.cos(a)*.32,.06,Math.sin(a)*.32,{par:ring});const fl=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,5),new THREE.MeshBasicMaterial({color:'#f8a040'}));fl.position.set(x-1.8,TOWN+.25,z+1.2);fl.__pxSkip=1;G.add(fl);K._fire=fl;halo(x-1.8,TOWN+.4,z+1.2,2.4,null,0xff9040);return g;};
  const CC=['#2f6fb0','#3e7d5c','#e2584f','#2f8a8a','#9478d4','#f08a3a'];
  SITES.forEach(([x,z,k],i)=>{powerPost(x+2.3,z-1.6,i%2===0);if(k==='cv')caravan(x+.3,z-.6,CC[i%CC.length]);else if(k==='camper')campervan(x,z-.4,CC[(i+2)%CC.length]);else if(k==='tent')tent(x,z,'#f2c84a');else{campervan(x,z-.4,'#e8e8e2');}
    if(k==='cv'&&i%3===0){const u=ute(x+.3-3.6,z-1.9,0,pick(['#f4f0e6','#2a2a30','#9aa4ac','#c8344a']));col(x-4.6,z-2.5,x-2.2,z-1.3);}});

  // ===== The Cray Shack: a casual seafood shack by the boat ramp, blue tables on a timber deck, beach behind =====
  {const g=bld({x:1562.6,z:1.2,w:6.4,d:4.2,h:2.8,base:'#7fb3ad',kind:'board',seed:41,front:{win:1,door:true,doorAt:.85,doorCol:'#f2c84a',winW:40,winH:22},back:{win:2},roofBase:'#c9473f',rise:1.0});
    verandah(g,6.6,1.3,2.4,2.1,{post:'#f4f0e6',roof:'#e8e2d6',fascia:'#c9473f'});
    signP(['THE CRAY SHACK','cray rolls · fish & chips · seafood baskets'],'#c9473f','#fff0b0',3.6,.62,1562.6,TOWN+2.95,4.75,0);
    // a big red cray on the roof ridge
    {const c=mk(40,24),x=c.getContext('2d');const Rd=['#8a1c1c','#c8344a','#e2584f','#f08a6a'];x.fillStyle=Rd[1];x.fillRect(12,9,18,6);x.fillStyle=Rd[2];x.fillRect(13,9,16,2);x.fillStyle=Rd[1];x.fillRect(30,10,5,4);x.fillRect(35,8,3,8);
      for(let k=0;k<4;k++){x.fillStyle=Rd[0];x.fillRect(14+k*4,15,1,4);x.fillRect(14+k*4,5,1,4);}x.fillStyle=Rd[1];x.fillRect(4,4,9,3);x.fillRect(4,17,9,3);x.fillRect(1,2,4,4);x.fillRect(1,18,4,4);x.fillStyle=Rd[3];x.fillRect(2,3,2,1);x.fillRect(2,19,2,1);
      x.fillStyle='#2a2230';x.fillRect(11,10,1,1);x.fillRect(11,13,1,1);x.fillStyle=Rd[0];x.fillRect(0,11,11,1);x.fillRect(0,12,11,1);
      const t=ctex(c);const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,1.3),new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.5,side:THREE.DoubleSide,emissive:0x331111,emissiveMap:t}));m.position.set(1562.6,TOWN+4.35,1.2);m.__pxSkip=1;G.add(m);K._cray=m;}
    pb(1.6,.08,.4,'wood','#8a5a36',1561.6,TOWN+1.05,3.5);signP(['ORDER HERE'],'#f2c84a','#2a2230',1.0,.2,1561.6,TOWN+2.0,3.33,0);pb(.8,.9,.5,'paint','#f4f0e6',1559.4,TOWN+.45,3.7);signP(['ICE CREAM'],'#5cc6d8','#ffffff',.7,.2,1559.4,TOWN+.7,3.96,0);col(1559,3.4,1559.8,4);
    pb(8.4,.14,3.0,'deck','#b08a5a',1562.4,TOWN+.07,5.9);
    [[1559.6,5.6],[1562.4,6.2],[1565.2,5.6]].forEach(([x,z],i)=>{ptable(x,z,'#2f8ad8',0,TOWN+.14);umbrella(x,z,['#2f8ad8|#f4f0e6','#c9473f|#f4f0e6','#f2c84a|#f4f0e6'][i],TOWN+.14);col(x-.9,z-.65,x+.9,z+.65);
      const t=grp(x,TOWN+.14+.8,z);pb(.36,.08,.26,'paint','#e8e2d6',-.3,.04,0,{par:t});pb(.14,.06,.08,'paint','#e2584f',-.3,.1,0,{par:t});pb(.3,.05,.2,'paint','#f2c84a',.35,.03,.1,{par:t});});
    for(let k=0;k<10;k++)pb(.06,.7,.06,'wood','#d8c8a8',1558.4+k*.9,TOWN+.35,7.38);pb(8.4,.06,.05,'wood','#d8c8a8',1562.4,TOWN+.68,7.38);
    lampHead(1560,TOWN+2.2,3.4,.14);lampHead(1565.2,TOWN+2.2,3.4,.14);halo(1562.6,TOWN+2,4.4,5);K._shade(1562.4,6,4.4,1.8,.5);}

  // ===== the car park with Kip's hire car, some locals' utes =====
  const hire=(()=>{const[x,z]=K.van;const g=grp(x,TOWN,z,Math.PI/2);const M=c=>tex('paint',c,1,1);
    pb(2.0,.42,1.0,'paint','#e2584f',0,.42,0,{par:g});pb(1.2,.36,.92,'paint','#e2584f',-.1,.8,0,{par:g});pb(1.22,.26,.94,'glass','#2a3a4a',-.1,.82,0,{par:g});pb(1.1,.06,.88,'paint','#e2584f',-.1,1.0,0,{par:g});
    [[-.62,1],[.62,1],[-.62,-1],[.62,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.14,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.19,s*.5);fin(w,g);});
    lampHead(1.01,.5,.32,.08,g);lampHead(1.01,.5,-.32,.08,g);col(x-.55,z-1.05,x+.55,z+1.05);
    const tag=signP(['KIP’S HIRE CAR'],'#2f6fb0','#ffffff',1.2,.22,x,TOWN+1.45,z,0,null,1);return g;})();
  [[1523.6,19.6,'#f4f0e6'],[1534.8,19.6,'#2a2a30'],[1540.4,19.6,'#9aa4ac']].forEach(([x,z,c])=>{const g=ute(x,z,Math.PI/2,c);col(x-.55,z-1.2,x+.55,z+1.2);});
  // (the boat on a trailer in the car park was taken out, Paul Nov 2026)
  signP(['P','CAR PARK'],'#2f6fb0','#ffffff',.7,.6,1520.2,TOWN+1.5,15.4,0,null,1);pb(.06,1.3,.06,'metal','#9aa0a6',1520.2,TOWN+.65,15.38);

  // ===== houses of the town: weatherboard and fibro, tin roofs, picket fences =====
  [[1557,19.6,'#e8dcc0','#2f6fb0','#8a3a2a'],[1528,33.4,'#cfe0e8','#e2584f','#5a6a7a'],[1543,34.6,'#f2e2a8','#3e7d5c','#8a9aa4'],[1558,35,'#e8c8b8','#2f8a8a','#a8303a']].forEach(([x,z,b,d,r],i)=>{
    const g=bld({x,z,w:7.4,d:5.6,h:2.9,base:b,kind:'board',seed:30+i,front:{win:2,door:true,doorAt:.5,doorCol:d,winW:28,winH:26},back:{win:2},roofBase:r,rise:1.4});verandah(g,7.6,1.6,2.4,2.8,{post:'#f4f0e6',roof:'#c8ccd0',fascia:'#f4f0e6'});
    for(let k=0;k<12;k++){const fx=x-3.7+k*.66;if(Math.abs(fx-x)<.6)continue;pb(.08,.7,.06,'paint','#f4f0e6',fx,TOWN+.35,z+5.2);}pb(7.6,.06,.04,'paint','#f4f0e6',x,TOWN+.58,z+5.2);
    pb(.6,1.0,.4,'paint','#3e7d5c',x+3.2,TOWN+.5,z+5.4);bbS(bushVariants[i%2],x-2.6,z+4.6,1.6,1.0);if(i%2)pep(x+4.8,z+1);});
  [[1547,15.6],[1568,24],[1522,40],[1552,42]].forEach(([x,z])=>bank(x,z));

  // ===== people, Nok, birds =====
  const SK=['#f1c7a0','#e2b48a','#c68a5e','#8d5a3b'],HR=['#2a1d16','#6b4226','#d9b25a','#9b3b22','#1b1b2b','#c9c2b4'],SH=['#e45a5a','#3f86d6','#f1c64a','#5bb48a','#c46ad6','#ffffff','#f08a3c','#5cc6d8','#f2a0c0'];
  const person=(x,z,o)=>{o=o||{};const kid=o.kid;const v={skin:o.skin||pick(SK),hair:o.hair||pick(HR),shirt:o.shirt||pick(SH),pants:o.pants||pick(['#2f3b5c','#c9b68a','#3e7d5c','#2a2a30','#5cc6d8','#e8457a']),hat:o.hat===undefined?(R()<.35?pick(['#f3e2b0','#f4f0e6','#2f6fb0']):null):o.hat,long:o.long,trim:o.trim};
    const fr=humanFrames(v);if(o.paint)o.paint(fr);const m=spriteMesh(fr,kid?.66:.95,kid?1.1:1.58);m.position.set(x,o.y==null?K.h(x,z):o.y,z);m.__pxSkip=1;G.add(m);return m;};
  const sitterC=(skin,hair,shirt,shorts,hat,kid)=>{const P2=painter(22,24),Sk=RAMP(skin),Hr=RAMP(hair,4),Sh=RAMP(shirt),Sd=RAMP(shorts,4);
    const s=kid?.78:1;P2.ell(11,20,7*s,3.6,Sd);P2.ell(11,14.5,6*s,6.5*s,Sh);P2.ell(4.4+(1-s)*3,15,1.8,4,Sk);P2.ell(17.6-(1-s)*3,15,1.8,4,Sk);P2.ell(11,6.5+(1-s)*3,4.4*s,4.4*s,Hr);
    if(hat){const H2=RAMP(hat,4);P2.ell(11,4.2+(1-s)*3,6.4*s,1.6,H2);P2.ell(11,3+(1-s)*3,3.6*s,2.4,H2);}return P2.done();};
  const sprite1=(c,w,h,x,z,y)=>{const m=spriteMesh([c],w,h);m.position.set(x,y==null?K.h(x,z):y,z);m.__pxSkip=1;G.add(m);return m;};
  // Nok: a young Thai woman, long black hair, red top with gold trim, a cream chef's apron with a red tie
  const apron=fr=>{[3,4,5].forEach(i=>{const x=fr[i].getContext('2d');x.fillStyle='#f4ecd8';x.fillRect(12,31,9,13);x.fillRect(13,44,7,3);x.fillStyle='#e0d4bc';x.fillRect(12,43,9,1);x.fillRect(20,31,1,13);
      x.fillStyle='#f4ecd8';x.fillRect(13,26,1,5);x.fillRect(19,26,1,5);x.fillStyle='#c9473f';x.fillRect(12,35,9,1);x.fillRect(15,36,3,1);x.fillStyle='#e8b830';x.fillRect(15,38,3,2);});
    [0,1,2].forEach(i=>{const x=fr[i].getContext('2d');x.fillStyle='#f4ecd8';x.fillRect(19,32,3,12);x.fillStyle='#c9473f';x.fillRect(14,35,8,1);});};
  const NOKP=[1509.4,6.9];
  const nok=person(NOKP[0],NOKP[1],{skin:'#e6b98e',hair:'#16121c',shirt:'#c9473f',pants:'#2a2230',hat:null,long:true,trim:'#f4d04a',paint:apron,y:TOWN});NOK.m=nok;
  // diners on the terrace, a takeaway customer
  NOK.tables.forEach(([x,z],i)=>{if(i===1)return;sprite1(sitterC(pick(SK),pick(HR),pick(SH),'#2f3b5c',null),.62,.68,x-.7,z,TOWN+.32);if(i!==2)sprite1(sitterC(pick(SK),pick(HR),pick(SH),'#c9b68a',R()<.5?'#f3e2b0':null),.62,.68,x+.7,z,TOWN+.32);});
  {const t=grp(NOK.tables[1][0],TOWN+.14+.8,NOK.tables[1][1]);const bowl=pc(.18,.12,.1,'paint','#f4f0e6',0,.05,0,{par:t});pc(.15,.15,.02,'paint','#6a9a3a',0,.1,0,{par:t});const cr=pb(.16,.06,.1,'paint','#e2584f',0,.13,0,{par:t});pc(.12,.1,.08,'paint','#f4f0e6',.3,.04,.15,{par:t});pc(.1,.1,.02,'paint','#f4f0e6',-.3,.06,-.1,{par:t});t.visible=false;NOK.curry=t;}
  person(1512.6,8.1,{});
  // the town: walkers along Cadiz Street and the beach, kids on the grass, swimmers, fishers on the jetty, co-op workers in hi-vis
  const walkers=[];
  const walker=(pts,o)=>{const m=person(pts[0][0],pts[0][1],o);walkers.push({m,pts,i:0,f:1,sp:.8+R()*.4,wait:R()*3,t:R()*9});return m;};
  walker([[1455,8.2],[1566,8.3]]);walker([[1560,14.0],[1456,13.9]],{hat:'#f4f0e6'});walker([[1500,13.8],[1540,13.9]]);walker([[1488,18],[1488,24],[1470,25.6],[1458,25.6]]);
  walker([[1460,shoreZ(1460)+2],[1512,shoreZ(1512)+2.4]]);walker([[1540,shoreZ(1540)+3],[1566,shoreZ(1566)+2]],{kid:1});walker([[1523,-6],[1523,-31]]);walker([[1517.2,1],[1517.2,-6.6],[1508,shoreZ(1508)+2.2]]);
  walker([[1535,7.2],[1546,7.4]],{shirt:'#f08a3a',hat:'#f4f0e6'});walker([[1532,-2.8],[1546,-2.6]],{shirt:'#f2c84a',hat:null});
  const kids=[];
  [[1462,5],[1474,3.4],[1505,36],[1478,29]].forEach(([x,z],i)=>{const k=person(x,z,{kid:1,hat:null});kids.push({m:k,x0:x,z0:z,r:1.6+R(),t:R()*9,sp:.8+R()*.4});});
  // families at the BBQs
  [[1559.6,5.6],[1562.4,6.2],[1565.2,5.6]].forEach(([x,z],i)=>{sprite1(sitterC(pick(SK),pick(HR),pick(SH),'#2f3b5c',R()<.5?'#f3e2b0':null),.62,.68,x,z-.75,TOWN+.46);if(i!==1)sprite1(sitterC(pick(SK),pick(HR),pick(SH),'#c9b68a',null,i===2),.56,.62,x+.4,z+.8,TOWN+.46);});person(1563.2,4.2,{shirt:'#ffffff',hat:'#c9473f'});
  person(1466.8,2.4,{shirt:'#2f6fb0',hat:'#f3e2b0'});sprite1(sitterC(pick(SK),pick(HR),'#e8457a','#2f3b5c',null),.62,.68,1469,3.5,TOWN+.32);sprite1(sitterC(pick(SK),pick(HR),'#5bb48a','#2a2a30',null,true),.5,.58,1469.6,2.1,TOWN+.32);
  sprite1(sitterC(pick(SK),pick(HR),'#f1c64a','#c9b68a','#f4f0e6'),.62,.68,1479.6,4.5,TOWN+.32);person(1483.4,2.2,{shirt:'#ffffff',hat:'#2f6fb0'});
  sprite1(sitterC(pick(SK),pick(HR),'#c46ad6','#2f3b5c',null),.62,.68,1500,32,TOWN+.32);person(1502.2,29.8,{});
  // campers in their chairs (seen from behind, looking out)
  SITES.forEach(([x,z,k],i)=>{if(i%2)return;sprite1(sitterC(pick(SK),pick(HR),pick(SH),pick(['#2f3b5c','#c9b68a']),R()<.4?'#f3e2b0':null),.62,.68,x-.8,z+1.2+.3,TOWN+.32);});
  const swim=[];
  [[1462,2.4],[1474,3.2],[1490,1.8],[1505,3.6],[1540,2.6],[1560,2.2]].forEach(([x,dd],i)=>{const z=shoreZ(x)-dd;const m=person(x,z,{kid:i%2===0,hat:null});m.position.y=hT(x,z)+(i%2?.06:.1);swim.push({m,x,z,ph:R()*6,base:m.position.y});});
  // a family on the beach under an umbrella
  [[1478,'#e8457a'],[1500,'#2f6fb0'],[1546,'#f2c84a']].forEach(([x,c])=>{const z=shoreZ(x)+4.4;umbrella(x,z,c+'|#fff6ea');const t=new THREE.Mesh(new THREE.PlaneGeometry(1,1.7),flat(pick(['#f2c84a','#5cc6d8','#e2584f'])));t.rotation.x=-Math.PI/2;t.position.set(x+.8,hT(x+.8,z)+.03,z);t.__pxSkip=1;G.add(t);
    sprite1(sitterC(pick(SK),pick(HR),pick(SH),'#2f3b5c',R()<.5?'#f3e2b0':null),.62,.68,x+.8,z+.4);});
  const rods=[];
  const fisher=(x,z,rx,rz,o)=>{const m=person(x,z,o||{hat:'#f3e2b0'});col(x-.25,z-.25,x+.25,z+.25);const y=K.h(x,z);
    const L=2.4,rod=new THREE.Mesh(new THREE.CylinderGeometry(.012,.02,L,4),flat('#2a2a30'));rod.position.set(x+rx*L*.42,y+1.25,z+rz*L*.42);rod.quaternion.copy(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(rx*.85,.55,rz*.85).normalize()));fin(rod);
    const tip=new THREE.Vector3(x+rx*L*.85,y+1.05+L*.47,z+rz*L*.85);const line=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,tip.y,3),flat('#e8e8e8'));line.position.set(tip.x,tip.y/2,tip.z);fin(line);rods.push({line,ph:R()*6});};
  fisher(TH[0]+.5,-35.6,-1,0);fisher(TH[2]-.5,-35.4,1,0,{hat:'#2f6fb0'});fisher(1520.4,-35.8,0,-1,{hat:null});
  const birds=[];const PEL=pelican32(),G0=gull32(0),G1=gull32(1);
  [[1512,shoreZ(1512)+.8],[1513.3,shoreZ(1513.3)+.5],[1548,shoreZ(1548)+.7]].forEach(([x,z])=>{const m=sprite1(PEL,1.05,1.05,x,z);birds.push({m,kind:'pel'});});
  [[JX0+.15,-11],[JX1-.15,-26]].forEach(([x,z])=>{const m=sprite1(PEL,1.0,1.0,x,z,DECK+.12);birds.push({m,kind:'perch'});});
  [[1531,-18],[1508,-26]].forEach(([x,z])=>{const m=sprite1(PEL,1.0,1.0,x,z,-.25);birds.push({m,kind:'float',x,z,ph:R()*6});});
  [[1490,shoreZ(1490)+1.4],[1494,shoreZ(1494)+2],[1532,6.9],[1548,7.6],[1470,1]].forEach(([x,z],i)=>{const m=sprite1(G0,.62,.31,x,z);birds.push({m,kind:'gull'});});
  for(let i=0;i<7;i++){const m=spriteMesh([G0,G1],.7,.35);m.__pxSkip=1;G.add(m);birds.push({m,kind:'fly',cx:i<3?1540+(R()-.5)*12:1460+R()*100,cz:i<3?2+R()*6:-14+R()*10,r:3+R()*5,a:R()*6.28,v:(.25+R()*.3)*(R()<.5?-1:1),y:4+R()*3});}

  // ===== things to do =====
  const W1=t=>({who:'Nok',text:t});
  const DIN={on:0,t:0};
  const nokTalk=()=>{S.road=S.road||{};
    if(!S.road.nok){S.road.nok=1;save();say([W1('Kip?! KIP!! สวัสดี Kip! You actually drove all the way up!'),W1('Look at you, a real café owner now. Come here, hug first, then food. กินข้าวยัง? Have you eaten?'),
      W1('This is my little kitchen. The crays come straight off the boats at the co-op, so my green curry is the freshest on the whole coast.'),W1('Stay as long as you like. The caravan park over the road has cute cabins, and there’s a free BBQ by the beach if you get hungry at midnight. หิวก็มาหานะ!')]);return;}
    const seen=S.seenZ||{};
    if(!S.road.dinner&&seen.pin&&seen.lan){dinner();return;}
    if(!S.road.dinner){const left=[!seen.pin&&'the Pinnacles',!seen.lan&&'the Lancelin dunes'].filter(Boolean);
      say([W1(pick(['Kip! Did you go yet? ','Hey you! ','ไง Kip! '])+'First '+left.join(' and ')+', then come back here for dinner. I’m saving the biggest cray for you!'),W1('Your car is in the car park over the road. The Pinnacles are just down Indian Ocean Drive, follow the brown signs.')]);return;}
    say([W1(pick(['The curry pot is always on for you, Kip. มาบ่อยๆ นะ!','Tell your Mum and Dad there’s a table here for them too.','Busy night! The crayfish boats came in heavy today.','You should put a Thai iced tea on your café menu. Just saying!']))]);};
  const dinner=()=>fadeDo(()=>{if((S.time%1440)<1150)S.time=Math.floor(S.time/1440)*1440+1150;const[tx,tz]=NOK.tables[1];player.x=tx-.75;player.z=tz+.9;player.bike=false;player.carry=null;
    NOK.m.position.set(tx+.75,TOWN+.14,tz);NOK.curry.visible=true;DIN.on=1;DIN.t=45;S.road.dinner=1;
    setTimeout(()=>say([{who:'',text:'The sun slips into the sea. Red lanterns glow along the terrace, and Nok carries out a steaming pot.'},W1('Ta-daa! Crayfish green curry. Fresh cray from the co-op, Thai basil from my pots, a little extra chilli for you. กินเยอะๆ นะ!'),
      {who:'Kip',text:'Nok… this is the best thing I’ve ever eaten. Can I put it on my café menu?'},W1('Only if you call it “Nok’s curry”! Cheers, Kip. To little businesses by the sea.')],()=>{eat(40,'crayfish green curry with jasmine rice');}),900);});
  const DISH=[['pad Thai with prawns',8,24],['a green curry with jasmine rice',9,26],['tom yum soup',7,20],['massaman beef curry',10,28],['som tum and sticky rice',6,18],['mango sticky rice',5,14]];
  K.targets=T=>{
    T.push({x:K.nok[0],z:K.nok[1],r:1.5,label:!(S.road&&S.road.nok)?'Talk to Nok':(!(S.road&&S.road.dinner)&&S.seenZ&&S.seenZ.pin&&S.seenZ.lan)?'Dinner at Nok’s · crayfish green curry':'Talk to Nok',act:nokTalk});
    T.push({x:1511.4,z:7.5,r:1.2,label:'Nok’s Thai Kitchen · order Thai food',act:()=>{const d=pick(DISH);if(!pay(d[1]))return;popText('อร่อย!',{x:player.x,y:2.4+TOWN,z:player.z});eat(d[2],d[0]);S.cerFood=(S.cerFood||0)+1;}});
    T.push({x:1492.5,z:7.9,r:1.3,label:'Sandpiper General Store · ice-cream and snacks (4 coins)',act:()=>{if(!pay(4))return;eat(12,pick(['a choc-top ice-cream','a meat pie with sauce','a bag of hot chips','a lamington and a cold milk']));}});
    T.push({x:1536,z:7.4,r:1.6,label:'Saltbush Cray Co-op · watch the crays being sorted',act:()=>say(['The co-op is loud and cold and smells of the sea. Workers in orange sort crays into blue tubs by size.','Worker: Western rock lobster, mate. The boats pull the pots at dawn and we ship them out live the same day.','Worker: Too small, back in the sea. Too big, back in too. Only the middle ones come home with us.'])});
    T.push({x:1561.6,z:4.1,r:1.4,label:'The Cray Shack · seafood lunch (12 coins)',act:()=>{if(!pay(12))return;popText('Yum!',{x:player.x,y:2.4+TOWN,z:player.z});eat(32,pick(['a seafood basket: half a grilled cray, prawns, calamari and chips','a cray roll and a bucket of prawns','fish and chips with a squeeze of lemon','grilled cray tails with garlic butter and salad']));S.cerShack=(S.cerShack||0)+1;}});
    T.push({x:1544.6,z:7.8,r:1.2,label:'Cray Co-op shop · cray roll (10 coins)',act:()=>{if(!pay(10))return;eat(26,'a fresh cray roll with lemon mayo');}});
    T.push({x:1523,z:-34.6,r:1.6,label:'Fish off the Cervantes jetty',act:()=>startFishing({name:'the end of the Cervantes jetty'})});
    T.push({x:1462,z:shoreZ(1462)+1.2,r:1.6,label:'Beach fishing in the surf',act:()=>startFishing({name:'the beach at Cervantes'})});
    T.push({x:1467.2,z:2.3,r:1.3,label:'Free electric BBQ · cook a sausage sizzle',act:()=>{smoke.forEach(s=>{if(Math.abs(s.x-1467.2)<1)s.boost=6;});say(['Kip presses the big red button. The hotplate warms up with a tick-tick-tick.','Sizzle! Snags, onions, a slice of bread, a squiggle of sauce. The perfect Aussie sausage sizzle.'],()=>eat(18,'a sausage sizzle with onions'));S.cerSizzle=(S.cerSizzle||0)+1;}});
    T.push({x:1483.4,z:2.1,r:1.2,label:'Free electric BBQ · cook a sausage sizzle',act:()=>{smoke.forEach(s=>{if(Math.abs(s.x-1483.4)<1)s.boost=6;});say(['Sizzle! Two snags in bread and some fried onion. A gull watches every bite.'],()=>eat(18,'a sausage sizzle'));}});
    T.push({x:1492.6,z:21.9,r:1.3,label:'Crayside reception · a flat white from the kiosk (3 coins)',act:()=>{if(!pay(3))return;eat(8,'a flat white from the park kiosk');}});
    const cb=CAB[1];T.push({x:cb.x,z:cb.z-.4,r:1.5,label:'Rent a cottage for the night (30 coins)',act:()=>{if(!pay(30))return;fadeDo(()=>{if((S.time%1440)>=OPEN){S.time=1440+OPEN+20;newDay();}else S.time=OPEN+20;S.stamina=STAM_MAX;S.stamWarn=0;player.x=cb.x;player.z=cb.z;S.cerNights=(S.cerNights||0)+1;
      setTimeout(()=>say(['Kip sleeps like a log in the little cabin. Morning: magpies, the smell of someone’s bacon, and the sound of surf across the road.','Full stamina!']),900);});}});
    T.push({x:1500.4,z:30,r:1.6,label:'Camp kitchen · make a cuppa',act:()=>say(['Kip boils the kettle in the camp kitchen. A grey nomad couple share a packet of Tim… of chocolate biscuits.','Camper: Been all round Australia, love. Cervantes is still our favourite. The sunsets!'],()=>eat(6,'a cuppa and a biscuit'))});
    T.push({x:1564.2,z:14.9,r:1.4,label:'Read the sign to the Pinnacles',act:()=>say(['THE PINNACLES 19 km · Nambung National Park.','Kip: Thousands of stone spires in yellow sand. Nok says sunset is best. The car is in the car park.'])});
    T.push({x:1513,z:shoreZ(1513)+1.8,r:1.4,label:'Say hello to the pelicans',act:()=>say(['The pelicans eye Kip, then the co-op. They know where the scraps come from.'])});
    {const px=player.x,pz=player.z;if(pz<shoreZ(px)-.8&&!band(px,pz))T.push({x:px,z:pz,r:1.2,label:'Float in the turquoise water',act:()=>say(['Kip floats on his back. The water is clear as glass, and a cray boat putters home past the reef.'])});}
    // the car (framework target): when Kip came some other way (e.g. a loaded save), the car still drives back to Victoria Park
    if(!OWTRIP&&!TOUR)for(const t of T)if(/^Tour van/.test(t.label||'')){t.label='Kip’s hire car · drive back';t.act=()=>{if(typeof openWorld==='function'){OWTRIP='cer';owTripBack();}else{toast('Drive back from the outer world map',2);}};}};

  // ===== the map =====
  K.zone={rects:[[1450,-45,1570,45,'#2490c0'],[1450,-30,1570,-8,'#3ab8cc'],[1450,-14,1570,-10,'#a2e6d6'],[1450,-11,1570,-1,'#f4eedc'],[1450,-1,1570,8.85,'#6aa648'],[1486,-1,1499,7.6,'#c8c2b4'],[1526.6,-1,1558,7.6,'#c8c2b4'],[1559.4,-.9,1565.8,3.3,'#7fb3ad'],[1558.2,4.4,1566.6,7.4,'#b08a5a'],[1450,8.85,1570,13.15,'#4a4d55'],[1450,7.6,1570,8.85,'#d8ccae'],[1450,13.15,1570,14.6,'#d8ccae'],
      [1452,14.6,1518.6,44,'#7ab454'],[1519.4,14.6,1545,26.2,'#5a5d64'],[1545,14.6,1570,45,'#a0a858'],[1518.6,26.2,1545,45,'#a0a858'],
      [1488,.6,1497,6.2,'#2f6fb0'],[1503.5,0,1513.5,6,'#c9473f'],[1498.6,.7,1503,7.3,'#b08a5a'],[1530,-1.6,1546,6.4,'#9aaab4'],[JX0,JZ,JX1,-1,'#8a6a4a'],[TH[0],TH[1],TH[2],TH[3],'#8a6a4a'],[RAMP0,-13,RAMP1,7.6,'#c8c2b4'],
      [1489.5,16,1495.7,20.4,'#2f8a8a'],[1455.5,17.6,1482.5,21.4,'#f2e2a8'],[1502,16.4,1511,20.8,'#d8b89a'],[1496.8,28.9,1504,33.5,'#a8303a']],
    labels:[['Nok’s Thai Kitchen',1508.5,3,1],['Cervantes Jetty',1523,-20,1],['Indian Ocean',1480,-30,1],['Cray Co-op',1538,2.4,0],['General Store',1492.5,3.4,0],['Foreshore BBQs',1470,3,0],['Cadiz Street',1530,11,0],
      ['Crayside Holiday Park',1485,30,1],['Cabins',1468,19.5,0],['Camp kitchen',1500,31,0],['Car park · your car',1532,21,0],['Boat ramp',1554,-4,0],['The Cray Shack',1562.6,1.2,0],['To the Pinnacles →',1560,16,0]]};

  // ===== animation =====
  let gF=0,fF=0;const smokeT=(()=>{const c=mk(8,8),x=c.getContext('2d');x.fillStyle='rgba(240,240,236,.8)';x.fillRect(2,1,4,6);x.fillRect(1,2,6,4);return ctex(c);})();
  const puffs=[];for(let i=0;i<10;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeT,transparent:true,depthWrite:false,opacity:0}));m.__pxSkip=1;m.scale.set(.3,.3,1);G.add(m);puffs.push({m,t:R()*2,s:smoke[i%smoke.length]});}
  K.tick=(dt,t)=>{const n=typeof NIGHT==='number'?NIGHT:0,h=(S.time%1440)/60,dusk=Math.max(0,Math.min(1,(h-17.4)/1.2)),k=Math.max(n,dusk*.6);
    if(DIN.on){DIN.t-=dt;if(DIN.t<=0&&!dlgOpen()){DIN.on=0;NOK.m.position.set(NOKP[0],TOWN,NOKP[1]);NOK.curry.visible=false;}}
    const lk=DIN.on?1:k;halos.forEach(m=>m.material.opacity=k*.75);lanterns.forEach((L,i)=>{const f=.85+.15*Math.sin(t*3+i*1.7);L.m.emissiveIntensity=.15+lk*1.2*f;L.h.material.opacity=lk*.9*f;});
    if(NOK.sign)NOK.sign.material.emissive.setScalar(.27+k*.5);
    const gi=((t*3.2)|0)%4;if(gi!==gF){gF=gi;glint.material.map=glintT[gi];}glintT.forEach(tx=>tx.offset.set(Math.floor(t*1.5)/64,Math.floor(t*.7)/64));glint.material.opacity=.8-n*.5;
    const fi=((t*2)|0)%3;if(fi!==fF){fF=fi;foam.material.map=foamT[fi];}foam.set(t);foam.material.opacity=1-n*.45;surf.material.opacity=.45+.25*Math.sin(t*.8);surf.position.z=-46+Math.sin(t*.5)*.4;
    walkers.forEach(w=>{if(w.wait>0){w.wait-=dt;setFrame(w.m,0);return;}const p=w.m.position,tg=w.pts[w.i+w.f];if(!tg){w.f=-w.f;w.wait=2+R()*5;return;}
      const dx=tg[0]-p.x,dz=tg[1]-p.z,d=Math.hypot(dx,dz);if(d<.1){w.i+=w.f;if(!w.pts[w.i+w.f]){w.f=-w.f;w.wait=2+R()*6;}return;}const s=Math.min(d,w.sp*dt);p.x+=dx/d*s;p.z+=dz/d*s;p.y=K.h(p.x,p.z);w.t+=dt;setFrame(w.m,[0,1,0,2][((w.t*6)|0)%4]);});
    kids.forEach(q=>{q.t+=dt*q.sp;const p=q.m.position;p.x=q.x0+Math.cos(q.t*.7)*q.r;p.z=q.z0+Math.sin(q.t*1.4)*q.r*.5;p.y=K.h(p.x,p.z);setFrame(q.m,[0,1,0,2][((t*7)|0)%4]);});
    swim.forEach(s=>{s.m.position.y=s.base+Math.sin(t*1.3+s.ph)*.05;});
    boats.forEach(b=>{b.g.position.y=b.y+Math.sin(t*.9+b.ph)*.05;b.g.rotation.z=Math.sin(t*.7+b.ph)*.025;});
    rods.forEach(r=>{r.line.position.y=r.line.geometry.parameters.height/2+Math.sin(t*1.1+r.ph)*.02;});
    birds.forEach(b=>{if(b.kind==='fly'){b.a+=b.v*dt;b.m.position.set(b.cx+Math.cos(b.a)*b.r,b.y+Math.sin(t*1.3+b.a)*.3,b.cz+Math.sin(b.a)*b.r*.6);setFrame(b.m,((t*5+b.r)|0)%2);}
      else if(b.kind==='float'){b.m.position.y=-.28+Math.sin(t*1.1+b.ph)*.04;b.m.position.x=b.x+Math.sin(t*.12+b.ph)*1.5;}});
    swings.forEach((s,i)=>s.rotation.x=Math.sin(t*1.8+i*1.3)*(i?.45:.2));
    // the boom gate lifts when someone walks up the entry road
    {const near=Math.abs(player.x-1487.6)<2.6&&Math.abs(player.z-17)<3;boom.rotation.z+=((near?-1.35:0)-boom.rotation.z)*Math.min(1,dt*3);}
    if(K._fire){K._fire.scale.set(1,.8+.4*Math.abs(Math.sin(t*7.3)),1);K._fire.visible=k>.2;}
    smoke.forEach(s=>{if(s.boost)s.boost=Math.max(0,s.boost-dt);});
    puffs.forEach(p=>{p.t+=dt*.6;if(p.t>1.6)p.t=0;const on=p.s&&(p.s.boost>0||k>.5);p.m.position.set(p.s.x+Math.sin(p.t*3)*.15,TOWN+1.0+p.t*1.2,p.s.z);p.m.material.opacity=on?(1-p.t/1.6)*.7:0;p.m.scale.setScalar(.25+p.t*.35);});};
  terrain.material.map=ctex(groundC);terrain.material.needsUpdate=true;
  if(typeof LOOK2!=='undefined'&&LOOK2.on&&typeof plant2Apply==='function'){const keep=BB.slice();BB.length=0;PLANTS.forEach(m=>BB.push(m));try{plant2Apply();}catch(e){console.error(e);}BB.length=0;keep.forEach(m=>BB.push(m));}
};
