// ---------- Day trip: Busselton Jetty (zone bus, x 1150..1270) · a long timber pile jetty on Geographe Bay ----------
// Shore (south, +z): road and car park, a grassy foreshore with Norfolk pines, peppermint trees and a playground, the promenade,
// the Jetty Centre and a kiosk at the jetty plaza, a row of painted boatsheds, and the beach. North (-z): the jetty runs ~60 m out
// over turquoise water with a little open-carriage train, a mid-jetty fishing bay, and the far platform with the round Underwater Observatory.
var TRIP_BUILD=TRIP_BUILD||{};TRIP_BUILD.bus=function(G,K){
  G.__pxSkip=1;const PPM=32,R=mulberry32(52801),rr=(a,b)=>a+(b-a)*R(),pick=a=>a[(R()*a.length)|0];
  const sh=PXK.sh,mix=PXK.mix,rnd=PXK.rnd;
  const P=(x,c,X,Y,W=1,H=1)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,H|0);};
  const cvs=(w,h)=>{const c=mk(Math.max(2,Math.round(w)),Math.max(2,Math.round(h)));const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];};
  const hex2=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
  // ===== the lie of the land =====
  const JX=1203.9,WX1=1204.95,WX2=1206.45,DX1=1202.9,DX2=1207.0,DECK=1.7,PLZ=1.0,BEND=-35.1;
  const shoreZ=x=>13.6+.9*Math.sin((x-1150)*.045)+.5*Math.sin((x-1150)*.13+1);
  const deckY=z=>z>=24?PLZ:z>18?PLZ+(24-z)/6*(DECK-PLZ):DECK;
  const bump=(x,z)=>(x<1191&&z>27.4&&z<39.4&&!(x>1163.5&&x<1185.5&&z>28.6&&z<37.9))?.16*Math.sin(x*.21+.4)*Math.sin(z*.33+.6):0;
  function hT(x,z){const s=shoreZ(x);if(z<s)return Math.max(-1.8,-(s-z)*.09);if(z<22.6)return(z-s)*.068;const b=(22.6-s)*.068;if(z<24.4){const t=(z-22.6)/1.8,e=t*t*(3-2*t);return b+(PLZ-b)*e;}return PLZ+bump(x,z);}
  const onDeck=(x,z)=>(x>WX1&&x<WX2&&z>BEND-.1&&z<24.3)||(x>1206.3&&x<1208.65&&z>-11&&z<-5)||(x>1199.45&&x<1209.25&&z>-43.65&&z<BEND+.05&&!(x>DX1+.2&&x<WX1&&z>-36.9));
  const band=(x,z)=>x>DX1-.45&&x<DX2+.45&&z<24.3;
  K.walk=(x,z)=>{if(x<1151.5||x>1268.5||z<-44||z>43.5)return false;if(onDeck(x,z))return true;if(band(x,z))return false;return z>shoreZ(x)-4.6;};
  K.h=(x,z)=>(onDeck(x,z)||band(x,z)||(x>1199&&x<1209.5&&z<BEND+.1))?deckY(z):hT(x,z);
  K.arrive=[1222.6,36.3];K.van=[1226.4,36.3];
  // ===== pixel painters, 32 px per metre =====
  const planks=(x,W,H,b,horiz,bw)=>{bw=bw||5;const L=horiz?H:W,M=horiz?W:H;for(let p=0;p<L;p+=bw){const f=.88+rnd()*.18;const seg=[];let s=-(rnd()*30|0);while(s<M){const e=s+24+(rnd()*40|0);seg.push([s,e]);s=e;}
      seg.forEach(([a,e])=>{const g=.95+rnd()*.1;const R2=(u,v,w,h,c)=>horiz?P(x,c,u,v,w,h):P(x,c,v,u,h,w);R2(a,p,e-a,bw,sh(b,f*g));R2(a,p,e-a,1,sh(b,f*g*1.14));R2(a,p+bw-1,e-a,1,sh(b,.5));R2(e-1,p,1,bw,sh(b,.62));
        for(let k=0;k<(e-a)/9;k++)R2(a+(rnd()*(e-a)|0),p+1+(rnd()*(bw-2)|0),2+(rnd()*3|0),1,sh(b,f*.84));if(rnd()<.25)R2(a+2,p+(bw>>1),1,1,sh(b,.45));});}};
  const PAINT={
    wood:(x,W,H,b)=>planks(x,W,H,b,W>=H,5),slat:(x,W,H,b)=>planks(x,W,H,b,W>=H,4),
    deck:(x,W,H,b)=>planks(x,W,H,b,true,6),
    pile:(x,W,H,b)=>{for(let X=0;X<W;X++){const f=.82+((X*7)%5)*.05+rnd()*.06;P(x,sh(b,f),X,0,1,H);}for(let i=0;i<W*H/16;i++)P(x,sh(b,rnd()<.5?.7:1.15),rnd()*W,rnd()*H,1,2+rnd()*4);
      const wl=H*.7;for(let y=wl|0;y<H;y++){const t=(y-wl)/(H-wl);for(let X=0;X<W;X++){if(rnd()<.55+t*.4)P(x,rnd()<.3?'#7a8a4a':rnd()<.5?sh('#4a5a34',.9+rnd()*.3):sh('#5a4a3a',.8),X,y);if(rnd()<.05)P(x,'#e8e2d0',X,y);}}
      P(x,sh(b,.55),0,0,W,2);},
    metal:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/14;i++)P(x,sh(b,rnd()<.5?.93:1.06),rnd()*W,rnd()*H);P(x,sh(b,1.3),0,0,W,1);P(x,sh(b,1.15),0,0,1,H);},
    paint:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/10;i++)P(x,sh(b,rnd()<.5?.92:1.07),rnd()*W,rnd()*H);P(x,sh(b,1.25),0,0,W,1);},
    board:(x,W,H,b)=>{PXK.weatherboard(x,W,H,b);},
    tin:(x,W,H,b)=>{for(let Y=0;Y<H;Y+=3){const f=Y%6?.9:1.1;P(x,sh(b,f),0,Y,W,3);P(x,sh(b,f*1.18),0,Y,W,1);}for(let i=0;i<W*H/60;i++)P(x,sh(b,.8),rnd()*W,rnd()*H);},
    stone:(x,W,H,b)=>PXK.blocks(x,W,H,b,{rowH:6,minW:8,varW:7}),
    rubber:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/3;i++)P(x,sh(b,rnd()<.5?.82:1.15),rnd()*W,rnd()*H);},
    sand:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/3;i++)P(x,sh(b,[.9,.94,1.05,1.08][rnd()*4|0]),rnd()*W,rnd()*H);},
    stripe:(x,W,H,b)=>{const c2=b.split('|');for(let X=0;X<W;X+=6)P(x,c2[(X/6|0)%2],X,0,6,H);for(let i=0;i<W*H/20;i++)P(x,'rgba(0,0,0,.08)',rnd()*W,rnd()*H);P(x,'rgba(255,255,255,.25)',0,0,W,1);}};
  const TC={};
  const texC=(kind,base,wm,hm)=>{const W=Math.max(2,Math.round(wm*PPM)),H=Math.max(2,Math.round(hm*PPM));const[c,x]=cvs(W,H);PXK.seed(W*31+H*7+base.length*13+kind.length);PAINT[kind](x,W,H,base);
    if(W>4&&H>4&&kind!=='sand'&&kind!=='rubber'&&kind!=='deck'){P(x,'rgba(255,255,255,.14)',0,0,W,1);P(x,'rgba(0,0,0,.28)',0,H-1,W,1);P(x,'rgba(0,0,0,.18)',W-1,0,1,H);}return c;};
  const tex=(kind,base,wm,hm)=>{const q=v=>Math.max(.125,Math.round(v*8)/8);wm=q(wm);hm=q(hm);const k=kind+base+wm+'x'+hm;if(TC[k])return TC[k];return TC[k]=new THREE.MeshLambertMaterial({map:ctex(texC(kind,base,wm,hm))});};
  const fin=(m,par)=>{m.__pxSkip=1;m.castShadow=true;m.receiveShadow=true;(par||G).add(m);return m;};
  const pb=(w,h,d,kind,base,x,y,z,o)=>{o=o||{};const sd=tex(kind,base,d,h),fr=tex(kind,base,w,h),tp=tex(o.top||kind,o.topBase||base,w,d);
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sd,sd,tp,tp,fr,fr]);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const pc=(r1,r2,h,kind,base,x,y,z,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,o.seg||8),tex(kind,base,Math.PI*2*Math.max(r1,r2),h));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const grp=(x,y,z,ry,par)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;g.__pxSkip=1;(par||G).add(g);return g;};
  const MC={};const flat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const M4=(x,y,z,rx,ry,rz)=>new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(1,1,1));
  // merge many small parts into one mesh per material (piles, rails, sleepers): one draw call each
  const merge=parts=>{let n=0;const ps=parts.map(([g,m])=>{const q=g.index?g.toNonIndexed():g;q.applyMatrix4(m);n+=q.attributes.position.count;return q;});
    const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let o=0;ps.forEach(q=>{pos.set(q.attributes.position.array,o*3);nor.set(q.attributes.normal.array,o*3);uv.set(q.attributes.uv.array,o*2);o+=q.attributes.position.count;q.dispose();});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.computeBoundingSphere();return g;};
  const lamps=[],halos=[];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.4,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:1});})();
  const halo=(x,y,z,s,par)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0}));m.position.set(x,y,z);m.scale.set(s,s,1);m.__pxSkip=1;(par||G).add(m);halos.push(m);return m;};
  const lampHead=(x,y,z,s,par)=>{const l=new THREE.Mesh(new THREE.BoxGeometry(s||.16,(s||.16)*1.1,s||.16),new THREE.MeshBasicMaterial({color:'#e8d8a8'}));l.position.set(x,y,z);l.__pxSkip=1;(par||G).add(l);PXB_LAMPS.push(l);lamps.push(l);return l;};
  const signM=(lines,bg,fg,W)=>{const L=Array.isArray(lines)?lines:[lines];const t=makeSign(L,W||Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide,emissive:0x333333,emissiveMap:t});};
  const signP=(lines,bg,fg,w,h,x,y,z,ry,par)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),signM(lines,bg,fg));m.position.set(x,y,z);m.rotation.y=ry||0;m.__pxSkip=1;m.castShadow=true;(par||G).add(m);return m;};
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const bbS=(v,x,z,w,h,y,par)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,y==null?K.h(x,z):y,z);m.__pxSkip=1;(par||G).add(m);BB.push(m);return m;};

  // ===== plants (sprites at the game's original pixel size; the plant passes repaint them in the one look) =====
  const PINE_C=['#1f3a26','#2a4c30','#386238','#4c7a44','#6a9650'];
  const pineC=seed=>{const r=mulberry32(seed),W=36,H=100,c=mk(W,H),x=c.getContext('2d');
    for(let y=6;y<H;y++){x.fillStyle=y%4?'#5a3e28':'#4a3220';x.fillRect(17,y,2,1);x.fillStyle='#7a5636';x.fillRect(17,y,1,1);}x.fillStyle='#3a2416';x.fillRect(15,H-3,6,3);
    for(let y=3;y<H-12;y+=4+(r()*2|0)){const t=y/(H-12),half=2+t*13+r()*2;for(const s of[-1,1]){const len=half*(.75+r()*.3);for(let k=0;k<=len;k++){const px=18+s*k,py=y+Math.round(k*k*.012)-(k>len-2?1:0);
          const col=PINE_C[Math.min(4,Math.max(0,(s<0?3:2)-(k>len*.7?0:1)+(r()<.2?1:0)))];x.fillStyle=col;x.fillRect(px,py,1,2);if(r()<.6){x.fillStyle=PINE_C[s<0?4:3];x.fillRect(px,py-1,1,1);}if(r()<.4){x.fillStyle=PINE_C[0];x.fillRect(px,py+2,1,1);}}}}
    x.fillStyle=PINE_C[3];x.fillRect(17,0,2,4);x.fillStyle=PINE_C[4];x.fillRect(17,0,1,2);return c;};
  const pepC=seed=>{const r=mulberry32(seed);const bl=[];for(let i=0;i<8;i++)bl.push([20+(r()-.5)*24,13+(r()-.5)*9,6+r()*4]);const c=canopy(40,40,bl,['#2e4a26','#3e6230','#527a3a','#6e9448'],r,[18,24]);const x=c.getContext('2d');
    const PP=['#2e4a26','#3e6230','#527a3a','#6e9448'];for(let k=0;k<44;k++){const sx=3+r()*34,sy=9+r()*12,len=5+r()*12;for(let t=0;t<len;t++){x.fillStyle=PP[(k+t)%4];x.fillRect(sx+Math.sin(t*.35)*.8|0,sy+t|0,1,1);}}
    x.fillStyle='#4a3220';x.fillRect(18,26,4,14);x.fillStyle='#6a4a30';x.fillRect(19,26,2,14);x.fillRect(15,30,3,1);x.fillRect(22,28,3,1);return c;};
  const grassC=seed=>{const r=mulberry32(seed),c=mk(28,16),x=c.getContext('2d');const C=['#4a6a2c','#6a8a3a','#8aa64c','#b4bc6a'];for(let k=0;k<38;k++){const bx=3+r()*22,h=4+r()*11,lean=(r()-.5)*1.1;for(let t=0;t<h;t++){x.fillStyle=C[Math.min(3,(t/h*3.4+r()*.6)|0)];x.fillRect(bx+lean*t*(t/h)|0,15-t,1,1);}}return c;};
  const PINES=[0,1,2].map(i=>sprMat(pineC(700+i))),PEPS=[0,1].map(i=>sprMat(pepC(810+i))),GRASS=[0,1,2].map(i=>sprMat(grassC(900+i)));
  const pineSpots=[[1156,27.6],[1165,27.4],[1174.5,27.6],[1184,27.4],[1188.6,33.2],[1221.5,27.4],[1231,27.6],[1240.5,27.4],[1250,27.6],[1259.5,27.4],[1267,27.8],[1156,39],[1190,39.1],[1218.6,39.2]];
  const pepSpots=[[1160,35.2],[1162.4,29.6],[1187,30.6],[1186.4,37.4],[1214.8,35.6],[1219.5,31.2],[1196,35.6],[1203,36.6]];
  const PLANTS=[];pineSpots.forEach(([x,z],i)=>{const s=.9+R()*.25;PLANTS.push(bbS(PINES[i%3],x,z,3.6*s,10*s));col(x-.2,z-.2,x+.2,z+.2);});
  pepSpots.forEach(([x,z],i)=>{const s=.9+R()*.3;PLANTS.push(bbS(PEPS[i%2],x,z,4.2*s,4.2*s));col(x-.22,z-.22,x+.22,z+.22);});
  for(let x=1152;x<1268;x+=2.2+R()*2.4){if(x>1201.5&&x<1208.5)continue;const z=22.4+R()*1.6;bbS(GRASS[(R()*3)|0],x,z,.95+R()*.3,.55+R()*.15);}
  for(let i=0;i<10;i++){const v=bushVariants[i%2],x=pick([1191.2,1219.8,1158,1188,1163,1214])+(R()-.5)*2.4,z=pick([26.9,33.8,38.6,29])+(R()-.5)*.8;PLANTS.push(bbS(v,x,z,1.5,.95));}

  // ===== ground: one painted terrain mesh, 16 px per metre =====
  const GX0=1136,GX1=1284,GZ0=9,GZ1=45,GP=16;
  const inPlay=(x,z)=>x>1164&&x<1185&&z>29&&z<37.5;
  const inPark=(x,z)=>x>1220&&x<1232&&z>32.8&&z<39.6;
  const CAMP_SITES=[1242.6,1248.4,1252.8],CAMP_COT=[1239.6,1246.4,1253.2],CAMP_X0=1232.6;
  const inPlaza=(x,z)=>x>1191&&x<1219&&z>26.6&&z<33.6;
  {const W=(GX1-GX0)*GP,H=(GZ1-GZ0)*GP,c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
    const C=hexs=>hexs.map(hex2);const SAND=C(['#d6b97c','#dec488','#e4cc94','#c9ac6e']),WET=C(['#a48858','#b09464','#ba9e6e']),GR=C(['#4f8a3a','#5e9a42','#6aa648','#7ab454','#8cc060']),PAV=C(['#d8ccae','#cdbf9e','#e2d6ba','#b8a888']),ASP=C(['#4a4d55','#52555d','#44474e']),CON=C(['#c8c2b4','#bdb6a6','#d2ccbe']),RUB=C(['#3f7fc0','#4a8ac8','#5a9ad0','#2f6aa8']),RUBG=C(['#4f9a48','#5aa850','#428a3e']);
    const bay=L2_BAYER;
    for(let j=0;j<H;j++){const z=GZ0+(j+.5)/GP;for(let i=0;i<W;i++){const X=GX0+(i+.5)/GP;const h=l2hash(i,j,7),b=bay[(i&3)+((j&3)<<2)]/16;let col;const s=shoreZ(X);
      if(z>40.3&&z<43.2){col=ASP[(h*3)|0];if(z<40.45||z>43.05)col=CON[0];else if(Math.abs(z-41.75)<.06&&(X%3)<1.6)col=[236,232,220];}
      else if(z>39.6&&z<=40.3){col=CON[(h*3)|0];if((X%1.5)<.07)col=[160,154,140];}
      else if(inPark(X,z)){col=ASP[(h*3)|0];const lx=(X-1220)%2.6;if(lx<.08&&(z<35.3||z>37.3))col=[236,234,226];if(Math.abs(z-35.3)<.05||Math.abs(z-37.3)<.05)col=[200,198,190];if(X>1222.6&&X<1230.2&&z>35.5&&z<37.1){if(z<35.6||z>37.0||X<1222.7||X>1230.1)col=[242,196,74];}}
      else if(z>24.6&&z<26.6||inPlaza(X,z)||(X>1219&&X<1222.4&&z>31&&z<35.6)||(X>1172.8&&X<1174.6&&z>26.6&&z<29)){const u=X*4,v=z*4,row=Math.floor(v),off=(row&1)*.5,cu=u*.5+off;col=PAV[(h*3)|0];
        if(inPlaza(X,z)){const du=X%1.2,dv=z%1.2;col=(du<.06||dv<.06)?PAV[3]:((Math.floor(X/1.2)+Math.floor(z/1.2))&1)?PAV[0]:PAV[2];if(Math.abs(X-1205.6)<1.9&&z>26.6){col=PAV[(h*2)|0];if(Math.abs(X-1205.6)>1.75)col=[168,102,74];}
}
        else if((v-row)<.07||(cu-Math.floor(cu))<.035)col=PAV[3];}
      else if(X>1232&&X<1268.5&&z>34.6&&z<36.2){const GV=[[196,180,150],[184,168,138],[206,192,162],[170,154,124]];col=GV[(h*4)|0];if((Math.abs(z-35.0)<.13||Math.abs(z-35.8)<.13)&&h<.7)col=[150,134,104];}
      else if((X>1238.9&&X<1240.3&&z>26.6&&z<34.6)||(X>1256.6&&X<1262&&z>31.4&&z<34.4)){col=PAV[(h*3)|0];if(((X*2.5)%1)<.06||((z*2.5)%1)<.06)col=PAV[3];}
      else if(X>1233&&z>29.4&&z<34.6&&CAMP_SITES.some(c=>Math.abs(X-c)<1.45)){col=CON[(h*3)|0];if((z*4%2)<.06)col=[176,170,158];}
      else if(z>36.2&&z<39.6&&CAMP_COT.some(c=>Math.abs(X-c-1.95)<.4)){col=PAV[(h*3)|0];if(((z*3.3)%1)<.08)col=PAV[3];}
      else if(inPlay(X,z)){const e=Math.min(X-1164,1185-X,z-29,37.5-z);const ORB=[[232,120,64],[240,140,80],[220,108,58]];col=e<.15?[214,206,190]:(X<1176?RUB:((X>1179.5&&z>33.6&&z<37)?RUBG:ORB))[(h*3)|0];if(e>=.15&&h<.02)col=[242,200,80];}
      else if(z>=22.6+.9+(l2noise(X,z,1.6,3)-.5)*1.6||z>24.4){const n=l2noise(X,z,3.2,11),m=l2noise(X,z,.9,5);let k=1+((n*2.4+m*.9+b*.6)|0);k=Math.max(0,Math.min(4,k));if(((X/1.6)|0)&1)k=Math.min(4,k+1);col=GR[k];
        if(h<.006)col=pick([[248,240,220],[242,200,80],[232,150,180]]);}
      else if(z>=s){const d=z-s;if(d<1.3+.3*l2noise(X,0,2,4)){col=WET[(h*3)|0];if(d<.35&&h<.3)col=[214,200,168];if(Math.sin(X*9+z*2.5+l2noise(X,z,1,8)*3)>.86)col=WET[0];}
        else{const n=l2noise(X,z,1.4,21);col=SAND[Math.min(3,((n*3.2+b*.8)|0))];if(Math.abs(d-2.5-.6*l2noise(X,0,3,9))<.18&&h<.45)col=h<.15?[96,86,50]:[128,112,62];if(h>.996)col=pick([[250,246,236],[240,200,190]]);}
        if(z>21.8){const t=(z-21.8)/.8;if(h<t*.35)col=GR[0];}}
      else col=WET[0];
      const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;}}
    x.putImageData(img,0,0);
    const toP=(X,Z)=>[(X-GX0)*GP,(Z-GZ0)*GP];
    // footprints along the beach and the sand trails of kids, contact shadows under trees and walls
    for(let t=0;t<9;t++){let X=1154+R()*110,Z=shoreZ(X)+1.5+R()*5,a=R()*6.28;for(let k=0;k<40;k++){a+=(R()-.5)*.6;X+=Math.cos(a)*.45;Z+=Math.sin(a)*.3;if(Z<shoreZ(X)+.4||Z>22)a+=Math.PI;if(X>1202&&X<1208)continue;const[px,py]=toP(X,Z);x.fillStyle='rgba(120,96,56,.55)';x.fillRect(px+(k&1?2:-2)|0,py|0,2,1);}}
    const shadowAt=(X,Z,rx,rz,a)=>{const[px,py]=toP(X,Z);for(let yy=-rz*GP;yy<rz*GP;yy++)for(let xx=-rx*GP;xx<rx*GP;xx++){const d=(xx/(rx*GP))**2+(yy/(rz*GP))**2;if(d>1)continue;if(bay[((xx+64)&3)+(((yy+64)&3)<<2)]/16<a*(1.2-d)){x.fillStyle='rgba(20,30,20,.28)';x.fillRect(px+xx,py+yy,1,1);}}};
    pineSpots.forEach(([X,Z])=>shadowAt(X+.4,Z+.3,1.4,.6,.8));pepSpots.forEach(([X,Z])=>shadowAt(X+.3,Z+.3,1.9,.9,.85));
    K._paintGround=(fn)=>{fn(x,toP);};K._groundC=c;}
  const terrain=(()=>{const NX=148,NZ=72,pos=[],uv=[],idx=[];for(let j=0;j<=NZ;j++){const z=GZ0+(GZ1-GZ0)*j/NZ;for(let i=0;i<=NX;i++){const X=GX0+(GX1-GX0)*i/NX;pos.push(X,hT(X,z),z);uv.push((X-GX0)/(GX1-GX0),1-(z-GZ0)/(GZ1-GZ0));}}
    for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const a=j*(NX+1)+i,b=a+1,c=a+NX+1,d=c+1;idx.push(a,c,b,b,c,d);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:null}));m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;})();

  // ===== water: painted shallows to deep blue, seagrass meadows, glints that twinkle, a foam line that laps the sand =====
  {const WX0=1136,WXX=1284,WZ0=-60,WZ1=19,WP=8,W=(WXX-WX0)*WP,H=(WZ1-WZ0)*WP,c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;
    const BANDS=[[-9,'#9ad8c4'],[.5,'#84d4c4'],[1.8,'#66ccc6'],[4,'#48c2c8'],[8,'#34b4c8'],[14,'#2a9ec4'],[24,'#2486bc'],[40,'#1f70aa'],[62,'#1a5e9a'],[999,'#1a5e9a']].map(([d,h])=>[d,hex2(h)]);
    for(let j=0;j<H;j++){const z=WZ0+(j+.5)/WP;for(let i=0;i<W;i++){const X=WX0+(i+.5)/WP,d=shoreZ(X)-z+(l2noise(X,z,6,2)-.5)*2.2;let q=0;while(q<BANDS.length-2&&d>BANDS[q+1][0])q++;
      const t=Math.max(0,Math.min(1,(d-BANDS[q][0])/(BANDS[q+1][0]-BANDS[q][0]))),b=L2_BAYER[(i&3)+((j&3)<<2)]/16;let col=(t>b?BANDS[q+1]:BANDS[q])[1].slice();
      if(d>5&&d<44){const n=l2noise(X,z,5,31)*.7+l2noise(X,z,1.6,32)*.3;if(n>.6)col=n>.66?[40,118,112]:((i+j)&1?[40,118,112]:col);}
      if(d>30){const n=l2noise(X,z,7,41);if(n>.62&&((i+j)&1||n>.7))col=col.map(v=>v*.86|0);else if(n<.3&&((i^j)&2))col=col.map(v=>Math.min(255,v*1.08|0));}
      if(d<4.5&&d>0){const rp=Math.sin(d*5.5+l2noise(X,z,2,5)*4);if(rp>.82)col=col.map(v=>Math.min(255,v+16));}
      const k=(j*W+i)*4;D[k]=col[0];D[k+1]=col[1];D[k+2]=col[2];D[k+3]=255;}}
    x.putImageData(img,0,0);const base=new THREE.Mesh(new THREE.PlaneGeometry(WXX-WX0,WZ1-WZ0),new THREE.MeshLambertMaterial({map:ctex(c)}));base.rotation.x=-Math.PI/2;base.position.set((WX0+WXX)/2,0,(WZ0+WZ1)/2);base.receiveShadow=true;base.__pxSkip=1;G.add(base);
    const far=new THREE.Mesh(new THREE.PlaneGeometry(420,260),flat('#1a64a2'));far.rotation.x=-Math.PI/2;far.position.set(1210,-.01,-60-129.9);far.receiveShadow=true;far.__pxSkip=1;G.add(far);}
  const glintT=[0,1,2,3].map(f=>{const c=mk(64,64),x=c.getContext('2d'),r=mulberry32(61);for(let k=0;k<34;k++){const X=r()*64|0,Y=r()*64|0,L=2+(r()*4|0),ph=(r()*4)|0,on=(ph+f)%4;if(on===3)continue;x.fillStyle=on===0?'rgba(255,255,255,.85)':on===1?'rgba(220,250,255,.6)':'rgba(200,240,250,.35)';x.fillRect(X,Y,on===2?L-1:L,1);if(on===0&&L>3){x.fillStyle='rgba(255,255,255,.5)';x.fillRect(X+1,Y-1,L-2,1);}}
    const t=ctex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(420/4,280/4);return t;});
  const glint=new THREE.Mesh(new THREE.PlaneGeometry(420,280),new THREE.MeshBasicMaterial({map:glintT[0],transparent:true,depthWrite:false,opacity:.8}));glint.rotation.x=-Math.PI/2;glint.position.set(1210,.02,19-140);glint.__pxSkip=1;glint.renderOrder=1;G.add(glint);
  const foamT=[0,1,2].map(f=>{const c=mk(64,24),x=c.getContext('2d'),r=mulberry32(77+f);for(let X=0;X<64;X++){const y0=8+Math.round(Math.sin((X+f*7)*.3)*1.5+Math.sin(X*.11+f)*1.2);x.fillStyle='rgba(255,255,255,.95)';x.fillRect(X,y0,1,2);x.fillStyle='rgba(240,252,255,.6)';x.fillRect(X,y0+2,1,1);
      for(let k=0;k<3;k++){if(r()<.45){x.fillStyle='rgba(255,255,255,'+(.25+r()*.4)+')';x.fillRect(X,y0-2-(r()*7|0),1,1);}}}const t=ctex(c);t.wrapS=THREE.RepeatWrapping;t.repeat.set(1,1);return t;});
  const foam=(()=>{const N=300,pos=new Float32Array((N+1)*2*3),uv=new Float32Array((N+1)*2*2),idx=[];for(let i=0;i<=N;i++){const X=GX0+(GX1-GX0)*i/N;uv.set([X/4,1,X/4,0],i*4);if(i<N){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);
    const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:foamT[0],transparent:true,depthWrite:false}));m.__pxSkip=1;m.renderOrder=2;m.frustumCulled=false;G.add(m);
    m.set=t=>{const p=g.attributes.position.array;for(let i=0;i<=N;i++){const X=GX0+(GX1-GX0)*i/N,s=shoreZ(X),w=.32*Math.sin(t*.9+X*.03)+.12*Math.sin(t*2.1+X*.2),y=.04;p.set([X,y,s+w-1.0,X,y,s+w+.5],i*6);}g.attributes.position.needsUpdate=true;g.computeBoundingSphere();};m.set(0);return m;})();

  // ===== the jetty: timber piles in bents, headstocks, braces, stringers, a plank deck, railings, the train track =====
  const PILE='#6a5a46',TIMB='#8a7a62',RAIL='#b8aa8c';
  {const piles=[],caps=[],rails=[],sleep=[],steel=[];
    const pile=(x,z,top,r)=>{const h=top+.9;piles.push([new THREE.CylinderGeometry(r||.13,(r||.13)*1.08,h,7),M4(x,top-h/2,z)]);};
    for(let z=22;z>BEND;z-=3){const y=deckY(z);[1203.15,1204.35,1205.55,1206.75].forEach(x=>pile(x,z,y-.18));caps.push([new THREE.BoxGeometry(4.35,.22,.3),M4(1204.95,y-.27,z)]);
      if(z<17){const L=Math.hypot(3.6,y-.6);[[1,0],[-1,0]].forEach(([s])=>caps.push([new THREE.BoxGeometry(L,.12,.08),M4(1204.95,(y-.4+0.0)/2,z+.16,0,0,s*Math.atan2(y-.6,3.6))]));}}
    for(let z=-36.5;z>-44;z-=2.4)for(let x=1199.7;x<1209.4;x+=2.4){pile(x,z,DECK-.18);}
    for(let x=1199.7;x<1209.4;x+=2.4)caps.push([new THREE.BoxGeometry(.3,.22,8.8),M4(x,DECK-.27,-39.4)]);
    [[1207.5,-10.6],[1208.4,-10.6],[1207.5,-5.4],[1208.4,-5.4]].forEach(([x,z])=>pile(x,z,DECK-.18));caps.push([new THREE.BoxGeometry(.24,.22,6.2),M4(1208.4,DECK-.27,-8)]);
    // stringers along the deck
    [1203.4,1205,1206.6].forEach(x=>{caps.push([new THREE.BoxGeometry(.18,.22,18+35.1),M4(x,DECK-.2,(18+BEND)/2)]);caps.push([new THREE.BoxGeometry(.18,.22,6.05),M4(x,(PLZ+DECK)/2-.2,21,Math.atan2(DECK-PLZ,6))]);});
    const pm=new THREE.Mesh(merge(piles),tex('pile',PILE,.85,2.6));fin(pm);const cm=new THREE.Mesh(merge(caps),tex('wood','#5e4e3c',2,.3));fin(cm);
    // deck: planks across the jetty
    const dT=(w,d)=>{const c=texC('deck',TIMB,4.1,4);const t=ctex(c,{rep:[w/4.1,d/4]});t.magFilter=THREE.NearestFilter;return new THREE.MeshLambertMaterial({map:t});};
    const side=tex('wood','#6a5a46',4,.14);
    const deckBox=(w,d,x,z,y,rx)=>{const top=dT(w,d);const m=new THREE.Mesh(new THREE.BoxGeometry(w,.14,d),[side,side,top,side,side,side]);m.position.set(x,y-.07,z);if(rx)m.rotation.x=rx;return fin(m);};
    deckBox(DX2-DX1,18-BEND,(DX1+DX2)/2,(18+BEND)/2,DECK);deckBox(DX2-DX1,Math.hypot(6,DECK-PLZ),(DX1+DX2)/2,21,(PLZ+DECK)/2,Math.atan2(DECK-PLZ,6));
    deckBox(1209.3-1199.4,43.75+BEND,(1199.4+1209.3)/2,(BEND-43.75)/2,DECK);deckBox(1.8,6.3,1207.9,-8,DECK);
    // railings: posts every 1.5 m, a top rail and a mid rail
    const post=(x,z,y)=>rails.push([new THREE.BoxGeometry(.09,.98,.09),M4(x,y+.49,z)]);
    const runZ=(x,z1,z2)=>{for(let z=z1;z>=z2-.01;z-=1.5)post(x,z,deckY(z));const seg=(a,b)=>{const ya=deckY(a),yb=deckY(b),L=Math.hypot(a-b,ya-yb),rx=Math.atan2(yb-ya,a-b);[.95,.5].forEach(o=>rails.push([new THREE.BoxGeometry(.06,.07,L),M4(x,(ya+yb)/2+o,(a+b)/2,rx)]));};
      if(z1>18&&z2<18){seg(z1,Math.max(18,z2));seg(18,z2);}else seg(z1,z2);};
    const runX=(z,x1,x2)=>{for(let x=x1;x<=x2+.01;x+=1.5)post(x,z,DECK);[.95,.5].forEach(o=>rails.push([new THREE.BoxGeometry(x2-x1,.07,.06),M4((x1+x2)/2,DECK+o,z)]));};
    runZ(DX1+.05,23.8,BEND);runZ(DX2-.05,23.8,-4.85);runZ(DX2-.05,-11.15,BEND);
    runX(-4.85,DX2,1208.7);runX(-11.15,DX2,1208.7);runZ(1208.7,-4.85,-11.15);
    runZ(1199.4,BEND,-43.7);runX(-43.7,1199.4,1209.25);runZ(1209.25,BEND,-38.6);runZ(1209.25,-40.6,-43.7);runX(BEND,1199.4,DX1);runX(BEND,DX2,1209.25);
    fin(new THREE.Mesh(merge(rails),tex('paint',RAIL,.3,1)));
    // the narrow-gauge track: sleepers and two steel rails from the plaza to the buffer stop
    for(let z=33.4;z>-36.7;z-=.55){const y=deckY(z);sleep.push([new THREE.BoxGeometry(1.0,.07,.16),M4(JX,y+.035,z,z>18&&z<24?Math.atan2(DECK-PLZ,6):0)]);}
    const rseg=(a,b)=>{const ya=deckY(a),yb=deckY(b),L=Math.hypot(a-b,ya-yb),rx=Math.atan2(yb-ya,a-b);[-.3,.3].forEach(o=>steel.push([new THREE.BoxGeometry(.06,.07,L),M4(JX+o,(ya+yb)/2+.1,(a+b)/2,rx)]));};
    rseg(33.5,24);rseg(24,18);rseg(18,-36.7);
    fin(new THREE.Mesh(merge(sleep),tex('wood','#4a3a2c',1,.16)));fin(new THREE.Mesh(merge(steel),flat('#8a8e94')));
    // buffer stop at the far end
    pb(1.1,.4,.25,'paint','#c8344a',JX,DECK+.32,-36.85);pb(.12,.5,.5,'paint','#3a3e44',JX-.42,DECK+.25,-36.75);pb(.12,.5,.5,'paint','#3a3e44',JX+.42,DECK+.25,-36.75);
    // lamps along the east rail, warm at night
    for(let z=21;z>BEND;z-=9){const y=deckY(z);pc(.045,.06,2.3,'metal','#2f4a3e',DX2-.05,y+1.15,z);pb(.5,.05,.05,'metal','#2f4a3e',DX2-.27,y+2.28,z);lampHead(DX2-.48,y+2.18,z,.18);halo(DX2-.48,y+2.1,z,1.8);}
    // distance plaques: the real jetty is about 1.8 km long
    [[12,'400 m'],[-3,'800 m'],[-19,'1200 m'],[-31,'1600 m']].forEach(([z,t])=>{pb(.1,.7,.1,'wood','#5e4e3c',DX2-.05,DECK+.35,z);signP([t],'#1d3a6e','#ffffff',.5,.2,DX2-.05,DECK+.62,z+.07,0);});}

  // ===== the jetty gate, the plaza and the train station =====
  {const g=grp(1205.7,PLZ,24.3);[-1.05,1.05].forEach(o=>{pb(.22,2.6,.22,'wood','#3f6a5a',o,1.3,0,{par:g});pb(.34,.2,.34,'paint','#e8dcc0',o,2.66,0,{par:g});});
    pb(2.5,.5,.12,'wood','#3f6a5a',0,2.35,0,{par:g});signP(['BUSSELTON JETTY'],'#f4ecd8','#1d3a6e',2.3,.36,0,2.35,.07,0,g);signP(['BUSSELTON JETTY'],'#f4ecd8','#1d3a6e',2.3,.36,0,2.35,-.07,Math.PI,g);
    col(1204.45,24.15,1204.8,24.45);col(1206.6,24.15,1206.95,24.45);}
  // station shelter on the platform side of the track
  {const g=grp(1206.9,PLZ,29.4);[[-.25,-1.6],[-.25,1.6],[.6,-1.6],[.6,1.6]].forEach(([x,z])=>pb(.1,2.2,.1,'paint','#2f6a46',x,1.1,z,{par:g}));
    const rf=pb(1.4,.08,3.8,'tin','#c8344a',.18,2.25,0,{par:g,rz:.12});pb(1.1,.06,.38,'slat','#a8744a',.3,.45,0,{par:g});pb(1.1,.36,.05,'slat','#a8744a',.3,.62,.16,{par:g,ry:Math.PI/2});
    signP(['JETTY TRAIN','to the Observatory'],'#2f6a46','#fff0b0',1.3,.44,.18,2.0,1.92,0,g);lampHead(.18,2.08,0,.16,g);halo(1207.1,PLZ+2,29.4,2);col(1206.5,27.7,1207.7,31.1);}
  // benches and planters on the plaza
  const bench=(x,z,ry,y)=>{const g=grp(x,y==null?K.h(x,z):y,z,ry);[-.06,.06,.18].forEach(o=>pb(1.5,.05,.11,'slat','#a8744a',0,.44,o-.06,{par:g}));[.6,.74].forEach(yy=>pb(1.5,.11,.04,'slat','#a8744a',0,yy,-.2,{par:g}));
    [-.62,.62].forEach(o=>{pb(.06,.44,.42,'metal','#2e3236',o,.22,0,{par:g});pb(.06,.4,.05,'metal','#2e3236',o,.6,-.21,{par:g});});return g;};
  [[1158,26.95],[1169,26.95],[1180,26.95],[1189.5,26.95],[1226,26.95],[1236,26.95],[1246,26.95],[1256,26.95]].forEach(([x,z])=>{bench(x,z,Math.PI);col(x-.75,z-.3,x+.75,z+.3);});
  [[1194,33.0],[1217,33.0]].forEach(([x,z])=>{bench(x,z,0);col(x-.75,z-.3,x+.75,z+.3);});
  // promenade lamps
  for(const x of[1160,1172,1184,1196,1214,1226,1238,1250,1262]){const y=K.h(x,27.05);pc(.05,.07,2.7,'metal','#2f4a3e',x,y+1.35,27.05);pb(.07,.07,.5,'metal','#2f4a3e',x,y+2.68,26.85);lampHead(x,y+2.58,26.62,.2);halo(x,y+2.5,26.62,2.2);col(x-.1,26.95,x+.1,27.15);}

  // ===== a gable-fronted timber building (ridge along z) =====
  const gableGeo=(w,hr)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-w/2,0,0,w/2,0,0,0,hr,0],3));g.setAttribute('normal',new THREE.Float32BufferAttribute([0,0,1,0,0,1,0,0,1],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));return g;};
  const gablePaint=(w,hr,base,trim,vent)=>{const[c,x]=cvs(w*PPM,hr*PPM);PXK.seed(w*97+hr*13);PXK.weatherboard(x,c.width,c.height,base);const W=c.width,H=c.height;
    for(let Y=0;Y<H;Y++){const half=(Y/H)*(W/2);P(x,trim,W/2-half-1,Y,4,1);P(x,trim,W/2+half-3,Y,4,1);P(x,sh(trim,.6),W/2-half+3,Y,1,1);}
    if(vent){const cx=W/2,cy=H*.6;for(let a=0;a<6.28;a+=.08){P(x,trim,cx+Math.cos(a)*7,cy+Math.sin(a)*7,2,2);}for(let k=-5;k<=5;k+=2)P(x,sh(base,.55),cx-5,cy+k,10,1);}return c;};
  function shed(o){const g=grp(o.x,o.y0,o.z);const w=o.w,d=o.d,h=o.h,hr=o.hr;const fm=f=>f?(f.lit?litMat(f.paint):new THREE.MeshLambertMaterial({map:ctex(f.paint(false))})):tex('board',o.base,1,1);
    const top=tex('paint',o.base,w,d);const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[fm(o.e),fm(o.w2),top,top,fm(o.s),fm(o.n)]);body.position.y=h/2;fin(body,g);
    const gm=new THREE.MeshLambertMaterial({map:ctex(gablePaint(w,hr,o.gbase||o.base,o.trim||'#f4f0e6',o.vent!==false))});
    const gf=new THREE.Mesh(gableGeo(w,hr),gm);gf.position.set(0,h,d/2+.005);fin(gf,g);const gb=new THREE.Mesh(gableGeo(w,hr),gm);gb.position.set(0,h,-d/2-.005);gb.rotation.y=Math.PI;fin(gb,g);
    const ov=o.ov||.18,sl=Math.hypot(w/2,hr)+ov,ang=Math.atan2(hr,w/2);const rm=tex(o.rk||'tin',o.roof||'#e8e8e2',sl,d+ov*2);
    [-1,1].forEach(s=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sl,.07,d+ov*2),[tex('paint',o.roof||'#e8e8e2',.2,.2),tex('paint',o.roof||'#e8e8e2',.2,.2),rm,rm,tex('paint',mix(o.roof||'#e8e8e2','#000000',.2),.2,.2),tex('paint','#d8d8d0',.2,.2)]);
      m.position.set(s*Math.cos(ang)*sl/2,h+hr-Math.sin(ang)*sl/2+.04,0);m.rotation.z=-s*ang;fin(m,g);});
    pb(.14,.12,d+ov*2+.02,'paint',o.trim||'#f4f0e6',0,h+hr+.05,0,{par:g});
    if(o.col!==false)col(o.x-w/2,o.z-d/2,o.x+w/2,o.z+d/2);return g;}

  // ===== the Jetty Centre (gable front to the south) =====
  {const x0=1196.6,z0=30,w=8,d=4.8,h=3.3,base='#f0e4c0',trim='#2f8a8a';
    const face=(W,H,opts,extra)=>({lit:true,paint:lit=>{const c=PXK.wall(W,H,Object.assign({base,kind:'board',lit,rows:1,shutter:'#2f8a8a',quoins:false,cornice:false,moss:false,seed:W*7+H},opts));if(extra)extra(c.getContext('2d'),c.width,c.height,lit);return c;}});
    const g=shed({x:x0,z:z0,y0:PLZ,w,d,h,hr:1.9,base,trim:'#f6f2e6',roof:'#c8443a',ov:.3,
      s:face(w,h,{win:3,door:true,doorAt:.5,doorCol:'#2f6a74',winW:24,winH:34}),n:face(w,h,{win:4,winW:22,winH:30}),e:face(d,h,{win:2,winW:22,winH:30}),w2:face(d,h,{win:1})});
    // verandah along the front with a striped valance
    [-3.7,-1.2,1.2,3.7].forEach(o=>pb(.14,2.5,.14,'paint','#f6f2e6',o,1.25,d/2+1.25,{par:g}));
    pb(8.2,.08,1.6,'tin','#2f8a8a',0,2.58,d/2+.78,{par:g,rx:.14});
    {const t=texC('stripe','#2f8a8a|#f4ecd8',8.2,.28);const x=t.getContext('2d');for(let X=0;X<t.width;X+=12){x.clearRect(X+2,t.height-3,8,3);x.clearRect(X+4,t.height-5,4,2);}const m=new THREE.Mesh(new THREE.PlaneGeometry(8.2,.28),new THREE.MeshLambertMaterial({map:ctex(t),transparent:true,alphaTest:.5,side:THREE.DoubleSide}));m.position.set(0,2.36,d/2+1.62);fin(m,g);}
    signP(['JETTY CENTRE','train · observatory · tickets'],'#1d3a6e','#fff0b0',3.2,.62,0,h+.75,d/2+.03,0,g);
    lampHead(-2.4,2.3,d/2+1.4,.16,g);lampHead(2.4,2.3,d/2+1.4,.16,g);halo(x0-2.4,PLZ+2.2,z0+d/2+1.4,2);halo(x0+2.4,PLZ+2.2,z0+d/2+1.4,2);
    // a flagpole and a little anchor on a plinth
    pc(.04,.05,5.2,'metal','#e8e8e2',x0+4.6,PLZ+2.6,z0-1.6);{const f=texC('stripe','#2f6fb0|#2f6fb0',.9,.6);const x=f.getContext('2d');P(x,'#ffffff',4,4,8,6);P(x,'#c8344a',6,6,4,2);P(x,'#f4d04a',18,8,2,2);P(x,'#f4d04a',22,12,2,2);P(x,'#f4d04a',16,14,2,2);
      const fl=new THREE.Mesh(new THREE.PlaneGeometry(.9,.6),new THREE.MeshLambertMaterial({map:ctex(f),side:THREE.DoubleSide}));fl.position.set(x0+5.06,PLZ+4.85,z0-1.6);fin(fl);K._flag=fl;}
    pb(1,.5,1,'stone','#c8bca0',x0-5.2,PLZ+.25,z0+3.4);{const a=grp(x0-5.2,PLZ+.5,z0+3.4);pc(.05,.05,.9,'metal','#3a3e44',0,.45,0,{par:a});pb(.7,.07,.07,'metal','#3a3e44',0,.15,0,{par:a,rz:0});pb(.5,.06,.06,'metal','#3a3e44',0,.8,0,{par:a});col(x0-5.7,z0+2.9,x0-4.7,z0+3.9);}}
  // ===== the kiosk: ice-cream and coffee, a giant cone on the roof =====
  {const x0=1212,z0=29.6,w=4.6,d=3.2,h=2.7,base='#a8dcc8';
    const g=grp(x0,PLZ,z0);const wallM=(W,H,opts,extra)=>litMat(lit=>{const c=PXK.wall(W,H,Object.assign({base,kind:'plaster',lit,rows:1,quoins:false,cornice:true,moss:false,seed:W*11+H},opts));if(extra)extra(c.getContext('2d'),c.width,c.height,lit);return c;});
    const front=wallM(w,h,{win:0},(x,W,H,lit)=>{const X=18,Y=26,ww=W-36,hh=40;P(x,'#2a2230',X-2,Y-2,ww+4,hh+4);P(x,lit?'#ffd890':'#5a4636',X,Y,ww,hh);
      for(let k=0;k<5;k++){P(x,['#f2a0c0','#fff0b0','#8a5a36','#a8dcc8','#f08a6a'][k],X+8+k*18,Y+hh-14,12,8);P(x,'#f4f0e6',X+8+k*18,Y+hh-6,12,2);}
      P(x,lit?'#fff4d0':'#e8dcc0',X+6,Y+4,ww-12,9);for(let k=0;k<8;k++)P(x,'#2a2230',X+10+k*14,Y+7,8,1);P(x,'#c8a070',X-4,Y+hh,ww+8,5);P(x,'#8a6a4a',X-4,Y+hh+5,ww+8,2);});
    const side=wallM(d,h,{win:1,winW:20,winH:24});const back=wallM(w,h,{win:1,door:true,doorAt:1});const top=tex('paint','#e8e2d6',w,d);
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[side,side,top,top,front,back]);b.position.y=h/2;fin(b,g);
    pb(w+.2,.18,d+.2,'paint','#f4f0e6',0,h+.09,0,{par:g});
    // striped awning over the serving hatch
    {const t=texC('stripe','#e8457a|#fff6ea',4.2,1.1);const m=new THREE.Mesh(new THREE.BoxGeometry(4.2,.05,1.1),[flat('#e8457a'),flat('#e8457a'),new THREE.MeshLambertMaterial({map:ctex(t)}),flat('#c8346a'),flat('#e8457a'),flat('#e8457a')]);m.position.set(0,2.3,d/2+.5);m.rotation.x=.3;fin(m,g);
      const v=texC('stripe','#e8457a|#fff6ea',4.2,.2);const vx=v.getContext('2d');for(let X=0;X<v.width;X+=12){vx.clearRect(X+1,v.height-2,10,2);}const vm=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.2),new THREE.MeshLambertMaterial({map:ctex(v),transparent:true,alphaTest:.5,side:THREE.DoubleSide}));vm.position.set(0,2.06,d/2+1.03);fin(vm,g);}
    signP(['BAY BREEZE KIOSK','ice-cream · coffee · cold drinks'],'#2f6fb0','#ffffff',3.4,.56,0,h-.42,d/2+.02,0,g);
    // the giant cone: waffle cone, three scoops, a cherry
    {const c=grp(0,h+.18,0,0,g);const cone=texC('paint','#d8a058',1.6,1.2);const cx=cone.getContext('2d');for(let i=-60;i<60;i+=6){for(let k=0;k<52;k++){P(cx,'#b8803a',i+k,k,1,1);P(cx,'#b8803a',i+52-k,k,1,1);}}
      const cm=new THREE.Mesh(new THREE.ConeGeometry(.45,1.2,10),new THREE.MeshLambertMaterial({map:ctex(cone)}));cm.rotation.x=Math.PI;cm.position.y=.6;fin(cm,c);
      [['#f2a0c0',0,1.32,0,.48],['#fff0d8',-.2,1.72,.05,.4],['#8a5a36',.18,1.75,-.04,.38]].forEach(([col,x,y,z,r])=>{const s=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),tex('paint',col,r*3,r*3));s.position.set(x,y,z);fin(s,c);});
      const ch=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),flat('#d8243a'));ch.position.set(0,2.12,0);fin(ch,c);}
    lampHead(-1.7,2.0,d/2+.9,.14,g);lampHead(1.7,2.0,d/2+.9,.14,g);halo(x0,PLZ+1.9,z0+d/2+1,3);
    col(x0-w/2,z0-d/2,x0+w/2,z0+d/2);
    // outdoor tables with umbrellas
    [[1209.6,33.6,'#e8457a'],[1212.6,34.2,'#2f6fb0'],[1215.4,33.4,'#f2c84a']].forEach(([x,z,c])=>{const t=grp(x,K.h(x,z),z);pc(.42,.42,.05,'paint','#f4f0e6',0,.72,0,{par:t,seg:12});pc(.04,.06,.72,'metal','#3a3e44',0,.36,0,{par:t});pc(.03,.03,2.0,'metal','#e8e8e2',0,1,0,{par:t});
      const u=new THREE.Mesh(new THREE.ConeGeometry(1.05,.42,8,1,true),new THREE.MeshLambertMaterial({map:ctex(texC('stripe',c+'|#fff6ea',6.6,.5)),side:THREE.DoubleSide}));u.position.y=2.0;fin(u,t);
      [[.62,0],[-.62,0],[0,.62],[0,-.62]].forEach(([a,b])=>pc(.16,.16,.42,'paint','#e8e2d6',a,.21,b,{par:t}));col(x-.5,z-.5,x+.5,z+.5);});}

  // ===== the boatsheds on the beach: a row of brightly painted gable sheds =====
  const SHED_COLS=['#e8457a','#f2c84a','#4a8ac8','#5aa04a','#f08a3a','#9478d4','#2fa8a0','#e2584f','#5cc6d8','#f4f0e6'];
  for(let i=0;i<10;i++){const x=1222.6+i*3.25,z=22.2,w=2.6,d=2.3,h=1.9,c=SHED_COLS[i],tr=c==='#f4f0e6'?'#2f6fb0':'#f6f2e6';
    const y0=Math.min(hT(x-1.3,z-1.15),hT(x+1.3,z-1.15))-.05;
    const sF=(W,H,kind)=>({lit:false,paint:()=>{const[cc,x2]=cvs(W*PPM,H*PPM);PXK.seed(i*31+W*7);PXK.weatherboard(x2,cc.width,cc.height,c);const CW=cc.width,CH=cc.height;
      P(x2,tr,0,0,3,CH);P(x2,tr,CW-3,0,3,CH);P(x2,sh(c,.6),0,CH-3,CW,3);
      if(kind==='doors'){const dw=CW*.7,dx=(CW-dw)/2,dy=10;P(x2,'#2a2230',dx-2,dy-2,dw+4,CH-dy);P(x2,tr,dx,dy,dw,CH-dy-3);for(let X=dx;X<dx+dw;X+=5)P(x2,sh(tr,.82),X,dy,1,CH-dy-3);P(x2,sh(tr,.6),CW/2,dy,1,CH-dy-3);
        for(let t=0;t<1;t+=.02){P(x2,sh(tr,.7),dx+t*dw/2,dy+t*(CH-dy-3),2,1);P(x2,sh(tr,.7),dx+dw-t*dw/2,dy+t*(CH-dy-3),2,1);}P(x2,'#c8a03a',CW/2-4,CH/2,2,3);P(x2,'#c8a03a',CW/2+3,CH/2,2,3);}
      if(kind==='back'){PXK.win(x2,CW/2-11,14,22,18,{shutter:tr});P(x2,tr,CW/2-7,CH-22,14,10);P(x2,'#2a2230',CW/2-5,CH-20,10,6);x2.fillStyle=c;x2.font='bold 7px monospace';x2.textAlign='center';x2.fillText(String(i+1),CW/2,CH-15);
        for(let X=0;X<CW;X+=8)P(x2,sh(c,1.18),X,CH-8,4,2);}
      return cc;}});
    shed({x,z,y0,w,d,h,hr:1.05,base:c,trim:tr,roof:i%2?'#e8e8e2':'#b8c0c8',ov:.16,vent:false,s:sF(w,h,'back'),n:sF(w,h,'doors'),e:sF(d,h,'side'),w2:sF(d,h,'side')});
    // a dinghy, a kayak or a deck chair on the sand in front of some sheds
    if(i%3===0){const k=grp(x+.2,hT(x,z-2.2)+.12,z-2.2,.1);pb(1.9,.24,.46,'paint',['#f2c84a','#e2584f','#2fa8a0'][i%3===0?(i/3)%3:0],0,0,0,{par:k});pb(.5,.08,.36,'paint','#2a2230',0,.13,0,{par:k});}
    if(i%3===1){const k=grp(x,hT(x,z-2.0),z-2.0,Math.PI);pb(.55,.05,.9,'stripe','#2f6fb0|#ffffff',0,.3,0,{par:k,rx:-.5});[-.26,.26].forEach(o=>pb(.04,.4,.04,'paint','#c8a070',o,.2,.3,{par:k}));}}

  // ===== the playground, a picnic shelter with a barbecue =====
  {const y=PLZ;
    // slide tower
    {const g=grp(1170,y,33);[[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]].forEach(([a,b])=>pb(.1,2.1,.1,'paint','#d8342a',a,1.05,b,{par:g}));pb(1.2,.1,1.2,'paint','#f2c84a',0,1.0,0,{par:g});
      const rf=new THREE.Mesh(new THREE.ConeGeometry(.95,.7,4),tex('paint','#2f6fb0',3,.7));rf.rotation.y=Math.PI/4;rf.position.y=2.45;fin(rf,g);
      for(let k=0;k<5;k++)pb(.6,.05,.05,'paint','#f4f0e6',-.62,.2+k*.2,0,{par:g,ry:Math.PI/2});pb(.05,1.0,.05,'paint','#f4f0e6',-.62,.5,-.3,{par:g});pb(.05,1.0,.05,'paint','#f4f0e6',-.62,.5,.3,{par:g});
      const sl=pb(.6,.06,2.1,'paint','#f2c84a',0,.55,1.45,{par:g,rx:-.5});[-.3,.3].forEach(o=>pb(.05,.16,2.1,'paint','#2f6fb0',o,.62,1.45,{par:g,rx:-.5}));col(1169.4,32.4,1170.6,34.4);}
    // swings
    {const g=grp(1178.6,y,31.2);[-1.4,1.4].forEach(o=>{pb(.09,2.1,.09,'paint','#2f8a8a',o,1.0,-.45,{par:g,rx:.22});pb(.09,2.1,.09,'paint','#2f8a8a',o,1.0,.45,{par:g,rx:-.22});});pb(2.9,.1,.1,'paint','#2f8a8a',0,2.02,0,{par:g});
      K._swings=[-.6,.6].map((o,i)=>{const s=grp(o,2.0,0,0,g);[-.18,.18].forEach(q=>pb(.025,1.55,.025,'metal','#9aa0a6',q,-.78,0,{par:s}));pb(.48,.05,.2,'paint',i?'#e8457a':'#f2c84a',0,-1.56,0,{par:s});return s;});col(1177,30.6,1180.2,31.8);}
    // see-saw, climbing dome, a whale on a spring
    {const g=grp(1167.2,y,36.2);pb(.2,.4,.2,'paint','#5aa04a',0,.2,0,{par:g});const b=pb(2.6,.08,.24,'paint','#f08a3a',0,.42,0,{par:g,rz:.14});K._saw=b;col(1166,35.9,1168.4,36.5);}
    {const d=new THREE.Mesh(new THREE.SphereGeometry(.95,10,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({color:'#f08a3a',wireframe:true}));d.position.set(1174.6,y,36);fin(d);col(1173.7,35.1,1175.5,36.9);}
    {const g=grp(1181.6,y,35.4);pc(.06,.06,.4,'metal','#9aa0a6',0,.2,0,{par:g});const w=new THREE.Mesh(new THREE.SphereGeometry(.42,10,8),tex('paint','#4a8ac8',2.6,2.6));w.scale.set(1.3,.75,.8);w.position.y=.58;fin(w,g);const t=pb(.1,.3,.42,'paint','#4a8ac8',-.6,.72,0,{par:g,rz:.6});K._whale=g;col(1181,35,1182.2,35.8);}
    // a low fence around the play area
    {const parts=[];for(let x=1164;x<=1185.01;x+=1.2){parts.push([new THREE.BoxGeometry(.06,.6,.06),M4(x,y+.3,29)],[new THREE.BoxGeometry(.06,.6,.06),M4(x,y+.3,37.5)]);}
      for(let z=29;z<=37.51;z+=1.2){if(z>32&&z<34.6)continue;parts.push([new THREE.BoxGeometry(.06,.6,.06),M4(1164,y+.3,z)],[new THREE.BoxGeometry(.06,.6,.06),M4(1185,y+.3,z)]);}
      [[1174.5,29,21,0],[1174.5,37.5,21,0]].forEach(([x,z,L])=>{parts.push([new THREE.BoxGeometry(L,.05,.05),M4(x,y+.55,z)]);});fin(new THREE.Mesh(merge(parts),tex('paint','#f4f0e6',.2,.6)));}
    signP(['FORESHORE PLAYGROUND'],'#5aa04a','#ffffff',1.8,.3,1174,y+1.0,28.9,0);pc(.03,.03,1,'metal','#3a3e44',1173.2,y+.5,28.9);pc(.03,.03,1,'metal','#3a3e44',1174.8,y+.5,28.9);
    // picnic shelter with a barbecue
    {const g=grp(1159.4,K.h(1159.4,31.6),31.6);[[-1.4,-1],[1.4,-1],[-1.4,1],[1.4,1]].forEach(([a,b])=>pb(.12,2.2,.12,'wood','#6a4a30',a,1.1,b,{par:g}));
      const rf=new THREE.Mesh(new THREE.ConeGeometry(2.4,1,4),tex('tin','#2f8a8a',4,2));rf.rotation.y=Math.PI/4;rf.scale.set(1,1,.75);rf.position.y=2.7;fin(rf,g);
      pb(2,.06,.8,'slat','#a8744a',0,.72,0,{par:g});[-.62,.62].forEach(o=>pb(2,.05,.3,'slat','#a8744a',0,.44,o,{par:g}));pb(.9,.8,.6,'stone','#b8ac94',2.2,.4,0,{par:g});pb(.8,.04,.5,'metal','#2e3236',2.2,.82,0,{par:g});col(1157.8,30.4,1162,32.8);}}

  // ===== the car park, the road, parked cars, the tour van =====
  if(typeof CDET!=='undefined'&&CDET.makeCar){const cols=['#f6f6f0','#2a2a30','#9aa4ac','#c8344a','#2f6fb0','#f1c64a','#3e7d5c'];
    for(let x=1231.3;x<1231.4;x+=2.6){[[34.2,Math.PI/2],[38.4,-Math.PI/2]].forEach(([z,ry])=>{if(R()<.38)return;const c=CDET.makeCar(pick(['sedan','hatch','ute','van','sedan']),pick(cols));c.g.position.set(x,PLZ,z);c.g.rotation.y=ry;c.g.traverse(o=>{o.__pxSkip=1;});G.add(c.g);col(x-c.wid/2,z-c.len/2,x+c.wid/2,z+c.len/2);});}
    const T=[];for(let i=0;i<2;i++){const c=CDET.makeCar(pick(['sedan','hatch','ute']),pick(cols));c.g.traverse(o=>{o.__pxSkip=1;});G.add(c.g);T.push({g:c.g,x:1140+i*70,dir:i?-1:1,v:3+R()});}K._traffic=T;}
  signP(['P','CAR PARK'],'#2f6fb0','#ffffff',.7,.6,1221,PLZ+1.5,33);pc(.03,.03,1.3,'metal','#9aa0a6',1221,PLZ+.65,32.98);
  {// the tour van: a white minibus with Siam Sydney Services lettering, low-poly with a pixel skin
    const[vx,vz]=K.van,g=grp(vx,PLZ,vz,Math.PI);const L=2.4,Wd=1.05,H=1.05;
    const skin=(W,Hh,front)=>{const[c,x]=cvs(W*PPM,Hh*PPM);const CW=c.width,CH=c.height;P(x,'#f6f6f0',0,0,CW,CH);for(let i=0;i<CW*CH/14;i++)P(x,rnd()<.5?'#ecece4':'#ffffff',rnd()*CW,rnd()*CH);
      if(!front){P(x,'#2a3a4a',6,5,CW-12,12);for(let X=6;X<CW-6;X+=17)P(x,'#f6f6f0',X,5,2,12);P(x,'#4a6a80',8,6,CW-16,3);P(x,'#c8344a',0,CH-12,CW,3);P(x,'#1d3a6e',0,CH-9,CW,2);}
      else{P(x,'#2a3a4a',3,4,CW-6,13);P(x,'#4a6a80',5,5,CW-10,3);P(x,'#3a3e44',4,CH-9,CW-8,6);P(x,'#fff0b0',2,CH-12,5,3);P(x,'#fff0b0',CW-7,CH-12,5,3);}
      P(x,'rgba(0,0,0,.25)',0,CH-1,CW,1);return new THREE.MeshLambertMaterial({map:ctex(c)});};
    const s=skin(L,H*.86,false),f=skin(Wd,H*.86,true),top=tex('paint','#ecece4',L,Wd);
    const b=new THREE.Mesh(new THREE.BoxGeometry(L,H*.86,Wd),[f,f,top,top,s,s]);b.position.y=.22+H*.43;fin(b,g);
    pb(L*.96,.08,Wd*.9,'paint','#d8d8d0',0,.22+H*.88,0,{par:g});
    [[.78,1],[-.78,1],[.78,-1],[-.78,-1]].forEach(([a,s2])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.14,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.19,s2*Wd/2);fin(w,g);});
    [1,-1].forEach(s2=>signP(['SIAM SYDNEY SERVICES'],'#f6f6f0','#1d3a6e',1.6,.16,-.05,.48,s2*(Wd/2+.006),s2>0?0:Math.PI,g));
    lampHead(L/2+.01,.42,.36,.1,g);lampHead(L/2+.01,.42,-.36,.1,g);col(vx-L/2,vz-Wd/2,vx+L/2,vz+Wd/2);}

  // ===== the far end: platform shelter, the Underwater Observatory (a round tower with a dome) =====
  {const g=grp(1200.9,DECK,-37.6);[[-1.2,-1.2],[1.2,-1.2],[-1.2,1.2],[1.2,1.2]].forEach(([a,b])=>pb(.1,2.2,.1,'paint','#2f6a46',a,1.1,b,{par:g}));pb(2.8,.08,2.9,'tin','#c8344a',0,2.25,0,{par:g,rx:.06});
    pb(1.5,.05,.4,'slat','#a8744a',0,.45,-.9,{par:g});pb(1.5,.3,.05,'slat','#a8744a',0,.62,-1.1,{par:g});signP(['FAR END','train to the shore'],'#2f6a46','#fff0b0',1.6,.42,0,2.0,1.47,0,g);lampHead(0,2.12,0,.16,g);halo(1200.9,DECK+2,-37.6,2);col(1200.1,-39.0,1201.7,-38.3);}
  const OBS={x:1212.0,z:-39.6,r:2.3};
  {const g=grp(OBS.x,0,OBS.z);const top=DECK+2.7;
    const bodyC=(()=>{const W=Math.round(Math.PI*2*OBS.r*PPM/2),Hh=Math.round((top+.6)*PPM/2);const[c,x]=cvs(W,Hh);PXK.seed(5);P(x,'#e8eaea',0,0,W,Hh);for(let i=0;i<W*Hh/8;i++)P(x,rnd()<.5?'#dcdedf':'#f4f6f6',rnd()*W,rnd()*Hh);
      for(let X=0;X<W;X+=14)P(x,'#c8ccd0',X,0,1,Hh);const band=y=>{P(x,'#1d5a8a',0,y,W,4);P(x,'#2f78b0',0,y,W,1);};band(6);band(Hh-46);
      for(let X=4;X<W;X+=16){const y=14;P(x,'#2a2230',X,y,10,10);P(x,'#5cc6d8',X+1,y+1,8,8);P(x,'#a8e8f0',X+2,y+2,3,2);P(x,'#c8ccd0',X-1,y-1,12,1);}
      for(let y=Hh-40;y<Hh;y++)for(let X=0;X<W;X++)if(rnd()<(y-(Hh-40))/50)P(x,rnd()<.5?'#5a7a4a':'#7a8a5a',X,y);return c;})();
    const lit=(()=>{const c=mk(bodyC.width,bodyC.height),x=c.getContext('2d');x.drawImage(bodyC,0,0);for(let X=4;X<c.width;X+=16){P(x,'#ffe0a0',X+1,15,8,8);}return c;})();
    const bm=new THREE.MeshLambertMaterial({map:ctex(bodyC),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(bodyC,lit))});PXB_GLOW.push(bm);
    const body=new THREE.Mesh(new THREE.CylinderGeometry(OBS.r,OBS.r*1.04,top+.6,24,1,true),bm);body.position.y=(top-.6)/2;fin(body,g);
    const domeC=(()=>{const[c,x]=cvs(160,40);for(let y=0;y<40;y++){const f=.8+y/40*.35;P(x,sh('#2f8a8a',f),0,y,160,1);}for(let X=0;X<160;X+=10)P(x,'#1f5a5a',X,0,1,40);for(let y=8;y<40;y+=8)P(x,'#5ab0a8',0,y,160,1);for(let i=0;i<120;i++)P(x,'#7fc8b8',rnd()*160,rnd()*40);return c;})();
    const dome=new THREE.Mesh(new THREE.SphereGeometry(OBS.r+.12,24,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({map:ctex(domeC)}));dome.position.y=top;dome.scale.y=.62;fin(dome,g);
    pc(OBS.r+.25,OBS.r+.25,.16,'paint','#f4f0e6',0,top+.02,0,{par:g,seg:24});
    pc(.12,.18,.5,'metal','#d8c070',0,top+1.65,0,{par:g});pc(.02,.02,.7,'metal','#d8c070',0,top+2.2,0,{par:g});lampHead(0,top+1.95,0,.14,g);halo(OBS.x,top+1.95,OBS.z,2.2);
    // a gallery ring at deck level with a little railing
    pc(OBS.r+.7,OBS.r+.7,.14,'wood','#7a6a52',0,DECK-.07,0,{par:g,seg:24});{const parts=[];for(let a=0;a<6.28;a+=.35){if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a))-Math.PI)<.45)continue;parts.push([new THREE.BoxGeometry(.07,.9,.07),M4(Math.cos(a)*(OBS.r+.65),DECK+.45,Math.sin(a)*(OBS.r+.65))]);}
      fin(new THREE.Mesh(merge(parts),tex('paint',RAIL,.2,.9)),g);const ring=new THREE.Mesh(new THREE.TorusGeometry(OBS.r+.65,.035,4,32),flat(RAIL));ring.rotation.x=Math.PI/2;ring.position.y=DECK+.9;fin(ring,g);}
    // the door on the platform side, and its sign facing the shore
    const dc=PXK.doorPane('#1d5a8a',24,40);const door=new THREE.Mesh(new THREE.PlaneGeometry(.8,1.45),new THREE.MeshLambertMaterial({map:ctex(dc)}));door.position.set(-OBS.r-.02,DECK+.72,0);door.rotation.y=-Math.PI/2;fin(door,g);
    pb(.9,.1,1.4,'wood',TIMB,-OBS.r-.45,DECK-.05,0,{par:g});
    signP(['UNDERWATER','OBSERVATORY'],'#1d5a8a','#ffffff',1.7,.6,0,top-.75,OBS.r+.03,0,g);
    {const parts=[];for(let a=.3;a<6.28;a+=.785){parts.push([new THREE.CylinderGeometry(.14,.15,DECK+.8,7),M4(Math.cos(a)*(OBS.r+.55),(DECK-.8)/2-.2,Math.sin(a)*(OBS.r+.55))]);}fin(new THREE.Mesh(merge(parts),tex('pile',PILE,.85,2.6)),g);}
    // a ticket booth by the door
    {const b=grp(1207.6,DECK,-42.6);pb(1.2,1.9,1.1,'board','#f2c84a',0,.95,0,{par:b});pb(1.4,.08,1.3,'tin','#2f8a8a',0,1.95,0,{par:b});signP(['OBSERVATORY','tickets'],'#1d5a8a','#ffffff',1.1,.34,0,1.55,.56,0,b);
      const w=new THREE.Mesh(new THREE.PlaneGeometry(.6,.42),litMat(l=>{const[c,x]=cvs(20,14);P(x,'#2a2230',0,0,20,14);P(x,l?'#ffd890':'#4a6a80',1,1,18,12);P(x,'#f4f0e6',0,9,20,2);return c;}));w.position.set(0,1.0,.56);fin(w,b);col(1207,-43.15,1208.2,-42.05);}
    signP(['UNDERWATER OBSERVATORY →'],'#1d5a8a','#ffffff',1.6,.24,1207.5,DECK+1.0,-36.0,0);pb(.08,1,.08,'metal','#3a3e44',1207.5,DECK+.5,-36.03);}
  // the mid-jetty fishing bay: a little shelter with a bench
  {const g=grp(1207.9,DECK,-8);[[-.7,-2.8],[.7,-2.8],[-.7,2.8],[.7,2.8]].forEach(([a,b])=>pb(.09,2.1,.09,'paint','#2f6a46',a,1.05,b,{par:g}));pb(1.7,.07,6,'tin','#2f8a8a',0,2.15,0,{par:g,rz:-.1});
    pb(.38,.05,1.5,'slat','#a8744a',.5,.45,1.3,{par:g});pb(.05,.3,1.5,'slat','#a8744a',.72,.62,1.3,{par:g});pc(.18,.18,.7,'paint','#2f6a46',.55,.35,-1.9,{par:g});signP(['FISHING BAY','no nets · keep it clean'],'#2f6a46','#fff0b0',1.3,.42,-.7,1.5,0,-Math.PI/2,g);col(1208.2,-7.1,1208.65,-5.5);col(1208.2,-10.1,1208.6,-9.7);}

  // ===== boats on the bay =====
  const boats=[];
  const yacht=(x,z,ry,hull,sail)=>{const g=grp(x,0,z,ry);const hc=texC('paint',hull,3,.5);const hx=hc.getContext('2d');P(hx,'#1d3a6e',0,6,96,2);P(hx,'#c8344a',0,12,96,4);
    const hm=new THREE.MeshLambertMaterial({map:ctex(hc)});const h=new THREE.Mesh(new THREE.CylinderGeometry(.55,.4,3,8,1,false,0,Math.PI),hm);h.rotation.z=Math.PI/2;h.rotation.y=0;h.scale.set(1,1,.8);h.position.y=.25;h.rotation.x=Math.PI;fin(h,g);
    pb(2.8,.08,.8,'deck','#c8b08a',0,.27,0,{par:g});pb(1,.35,.6,'paint','#f4f0e6',-.2,.45,0,{par:g});pc(.04,.05,4.2,'metal','#e8e8e2',.35,2.4,0,{par:g});pb(1.5,.05,.05,'metal','#e8e8e2',-.4,1.1,0,{par:g});pc(.1,.12,1.4,'paint',sail,-.35,1.15,0,{par:g,rz:Math.PI/2});
    boats.push({g,ph:R()*6,y:0});return g;};
  yacht(1178,-14,.3,'#f4f0e6','#2f6fb0');yacht(1238,-22,-.4,'#f4f0e6','#c8344a');yacht(1252,-4,.9,'#e8dcc0','#2f8a8a');yacht(1168,-32,-.2,'#f4f0e6','#3e7d5c');
  [[1186,-6],[1222,-12],[1196,-24]].forEach(([x,z],i)=>{const b=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),flat(i%2?'#f08a3a':'#e8e8e2'));b.position.set(x,.05,z);fin(b);boats.push({g:b,ph:i*2,y:.05});});

  // ===== people, birds =====
  const SK=['#f1c7a0','#e2b48a','#c68a5e','#8d5a3b'],HR=['#2a1d16','#6b4226','#d9b25a','#9b3b22','#1b1b2b','#c9c2b4'],SH=['#e45a5a','#3f86d6','#f1c64a','#5bb48a','#c46ad6','#ffffff','#f08a3c','#5cc6d8','#f2a0c0'];
  const person=(x,z,o)=>{o=o||{};const kid=o.kid;const m=spriteMesh(humanFrames({skin:o.skin||pick(SK),hair:o.hair||pick(HR),shirt:o.shirt||pick(SH),pants:o.pants||pick(['#2f3b5c','#c9b68a','#3e7d5c','#2a2a30','#5cc6d8','#e8457a']),hat:o.hat===undefined?(R()<.35?pick(['#f3e2b0','#f4f0e6','#2f6fb0']):null):o.hat}),kid?.66:.95,kid?1.1:1.58);
    m.position.set(x,o.y==null?K.h(x,z):o.y,z);m.__pxSkip=1;G.add(m);return m;};
  // sitters and sunbathers, painted like the people (seen from behind, looking at the sea)
  const sitterC=(skin,hair,shirt,shorts,hat,kid)=>{const P2=painter(22,24),Sk=RAMP(skin),Hr=RAMP(hair,4),Sh=RAMP(shirt),Sd=RAMP(shorts,4);
    const s=kid?.78:1;P2.ell(11,20,7*s,3.6,Sd);P2.ell(11,14.5,6*s,6.5*s,Sh);P2.ell(4.4+ (1-s)*3,15,1.8,4,Sk);P2.ell(17.6-(1-s)*3,15,1.8,4,Sk);P2.ell(11,6.5+(1-s)*3,4.4*s,4.4*s,Hr);
    if(hat){const H2=RAMP(hat,4);P2.ell(11,4.2+(1-s)*3,6.4*s,1.6,H2);P2.ell(11,3+(1-s)*3,3.6*s,2.4,H2);}return P2.done();};
  const lieC=(skin,hair,suit)=>{const P2=painter(40,12),Sk=RAMP(skin),Hr=RAMP(hair,4),Su=RAMP(suit);P2.ell(31,6,9,3.2,Sk);P2.ell(19,6,6.5,3.6,Su);P2.ell(10,6,4,3.2,Sk);P2.ell(5,6,3.6,3.4,Hr);P2.ell(36,4.5,2.6,1.4,Sk);P2.ell(36,7.5,2.6,1.4,Sk);return P2.done();};
  const sprite1=(c,w,h,x,z,y)=>{const m=spriteMesh([c],w,h);m.position.set(x,y==null?K.h(x,z):y,z);m.__pxSkip=1;G.add(m);return m;};
  const towel=(x,z,c1,c2,ry)=>{const[c,tx]=cvs(32,56);for(let y=0;y<56;y+=6)P(tx,(y/6|0)%2?c1:c2,0,y,32,6);for(let X=0;X<32;X+=3){P(tx,'#ffffff',X,0,1,2);P(tx,'#ffffff',X,54,1,2);}
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1.75),new THREE.MeshLambertMaterial({map:ctex(c)}));m.rotation.x=-Math.PI/2;m.rotation.z=ry||0;m.position.set(x,hT(x,z)+.03,z);m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;};
  const umbrella=(x,z,c)=>{const g=grp(x,hT(x,z),z);pc(.025,.025,2.0,'metal','#f4f0e6',0,1.0,0,{par:g,rz:.12});const u=new THREE.Mesh(new THREE.ConeGeometry(1.15,.48,10,1,true),new THREE.MeshLambertMaterial({map:ctex(texC('stripe',c+'|#fff6ea',7.2,.55)),side:THREE.DoubleSide}));u.position.set(-.12,1.95,0);u.rotation.z=.12;fin(u,g);return g;};
  const castle=(x,z)=>{const g=grp(x,hT(x,z),z);[[0,0,.32,.5],[.42,.1,.2,.32],[-.36,.12,.2,.3],[.05,.4,.18,.26]].forEach(([a,b,r,h])=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.8,r,h,8),tex('sand','#d8c08a',r*5,h));m.position.set(a,h/2,b);fin(m,g);});const fl=new THREE.Mesh(new THREE.PlaneGeometry(.14,.1),flat('#e2584f'));fl.position.set(0,.66,0);fin(fl,g);
    const bk=new THREE.Mesh(new THREE.CylinderGeometry(.12,.09,.18,8),flat('#f2c84a'));bk.position.set(.6,.09,-.3);fin(bk,g);};
  const fams=[[1160,'#e8457a'],[1171,'#2f6fb0'],[1183,'#f2c84a'],[1194,'#2fa8a0'],[1228,'#f08a3a'],[1241,'#9478d4'],[1256,'#e2584f']];
  const kids=[];
  fams.forEach(([x,c],i)=>{const z=shoreZ(x)+4.2+R()*1.6;umbrella(x,z,c);towel(x+.9,z+.1,c,'#fff6ea',.2);towel(x-.7,z+.2,pick(['#2f6fb0','#5aa04a','#f2c84a']),'#ffffff',-.15);
    const sk=pick(SK);sprite1(sitterC(sk,pick(HR),pick(SH),pick(['#2f3b5c','#2f6fb0','#e8457a']),R()<.5?'#f3e2b0':null),.66,.72,x+.9,z+.4);
    if(i%2)sprite1(lieC(pick(SK),pick(HR),pick(['#e8457a','#2f6fb0','#f2c84a','#2a2a30'])),1.25,.38,x-.7,z+.2,hT(x,z)+.02);else sprite1(sitterC(sk,pick(HR),pick(SH),pick(['#c9b68a','#2a2a30']),null,true),.52,.6,x-.5,z+.5);
    if(i%3===0)castle(x+2.1,z-1.4);
    // a kid who runs to the water and back, and a parent who stands watching
    const k=person(x+1.6,z-1,{kid:1,hat:null,pants:pick(['#e8457a','#2f6fb0','#f2c84a'])});kids.push({m:k,x0:x+1.6,z0:z-1,z1:shoreZ(x+1.6)-1.8,t:R()*20,sp:.8+R()*.5});
    if(i%2===0)person(x+2.6,z-.4,{});});
  // paddlers and swimmers in the shallows
  const swim=[];
  [[1166,2.2],[1176,3.2],[1188,1.6],[1198,3.8],[1232,2.6],[1247,3.4],[1262,2.1]].forEach(([x,dd],i)=>{const z=shoreZ(x)-dd;const m=person(x,z,{kid:i%2===0,hat:null});m.position.y=hT(x,z)+(i%2?.06:.1);swim.push({m,x,z,ph:R()*6,base:m.position.y});});
  const headC=(skin,hair,cap)=>{const P2=painter(12,10),Sk=RAMP(skin),Hr=RAMP(cap||hair,4);P2.ell(6,5.5,4,3.6,Sk);P2.ell(6,3.6,4.2,2.6,Hr);return P2.done();};
  [[1180,7.5],[1192,9],[1215,8],[1240,6.4],[1170,10.2]].forEach(([x,dd],i)=>{const z=shoreZ(x)-dd;const m=sprite1(headC(pick(SK),pick(HR),i%2?pick(['#f2c84a','#e8457a','#ffffff']):null),.42,.35,x,z,-.12);swim.push({m,x,z,ph:R()*6,base:-.12,head:1,v:.25+R()*.2});});
  // a kayaker crossing the bay
  {const g=grp(1170,0,0);pb(2.2,.16,.42,'paint','#f2c84a',0,.06,0,{par:g});const s=spriteMesh([sitterC(pick(SK),pick(HR),'#e2584f','#2a2a30','#f4f0e6')],.6,.66);s.position.set(0,.02,0);s.__pxSkip=1;g.add(s);
    const pad=pb(1.6,.04,.06,'metal','#3a3e44',0,.5,0,{par:g,ry:Math.PI/2});K._kayak={g,pad,x:1170,dir:1};}
  // walkers on the jetty and the promenade
  const walkers=[];
  const walker=(pts,o)=>{const m=person(pts[0][0],pts[0][1],o);walkers.push({m,pts,i:0,f:1,sp:.9+R()*.4,wait:R()*3,t:R()*9});return m;};
  walker([[1205.3,22],[1205.4,-34]]);walker([[1206.0,-30],[1205.9,20]]);walker([[1205.6,8],[1205.6,-33]]);
  walker([[1153,25.5],[1266,25.8]]);walker([[1262,25.2],[1154,25.0]]);walker([[1232,25.9],[1170,25.6]],{hat:'#f4f0e6'});
  walker([[1196,34.4],[1222,35.8],[1196,34.4]]);walker([[1200,31.8],[1214,31.4]],{kid:1});
  // fishers at the rail with rods out over the water
  const rods=[];
  const fisher=(x,z,rx,rz,o)=>{const m=person(x,z,o||{hat:'#f3e2b0'});col(x-.25,z-.25,x+.25,z+.25);const y=K.h(x,z);
    const L=2.4,rod=new THREE.Mesh(new THREE.CylinderGeometry(.012,.02,L,4),flat('#2a2a30'));const a=Math.atan2(rz,rx);rod.position.set(x+rx*L*.42,y+1.25,z+rz*L*.42);rod.rotation.order='YXZ';rod.rotation.y=-a+Math.PI/2;rod.rotation.x=-1.0;rod.rotation.z=0;
    const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(rx*.85,.55,rz*.85).normalize());rod.quaternion.copy(q);fin(rod);
    const tip=new THREE.Vector3(x+rx*L*.85,y+1.05+L*.47,z+rz*L*.85);const line=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,tip.y,3),flat('#e8e8e8'));line.position.set(tip.x,tip.y/2,tip.z);fin(line);rods.push({rod,line,ph:R()*6});};
  fisher(1208.3,-9.4,1,0);fisher(1199.9,-41.8,-1,0,{hat:'#2f6fb0'});fisher(1203.4,-43.2,0,-1);
  // pelicans and gulls
  const birds=[];const PEL=pelican32(),G0=gull32(0),G1=gull32(1);
  [[1174,shoreZ(1174)+.7],[1175.4,shoreZ(1175.4)+.4],[1236,shoreZ(1236)+.6]].forEach(([x,z])=>{const m=sprite1(PEL,1.05,1.05,x,z);birds.push({m,kind:'pel',x,z});});
  {const m=sprite1(PEL,1.0,1.0,1208.7,-5.0,DECK+.98);birds.push({m,kind:'perch'});}
  [[1209.8,4],[1199.5,-16],[1214,-30]].forEach(([x,z])=>{const m=sprite1(PEL,1.0,1.0,x,z,-.25);birds.push({m,kind:'float',x,z,ph:R()*6});});
  [[1186,20],[1190,19],[1229,18.6],[1214,25.8],[1203.05,6.0],[1200,-43.7]].forEach(([x,z],i)=>{const y=i===4?deckY(z)+.98:i===5?DECK+.98:null;const m=sprite1(G0,.62,.31,x,z,y);birds.push({m,kind:'gull',x,z});});
  for(let i=0;i<6;i++){const m=spriteMesh([G0,G1],.7,.35);m.__pxSkip=1;G.add(m);birds.push({m,kind:'fly',cx:i<3?1205+(R()-.5)*16:1180+R()*70,cz:i<3?-10+R()*30:14+R()*6,r:3+R()*5,a:R()*6.28,v:(.25+R()*.3)*(R()<.5?-1:1),y:3+R()*3});}

  // ===== the jetty train: a little loco and three open carriages =====
  const TRAIN={cars:[],f:23.0,mode:'shore',t:6,v:0,ride:null};const F0=23.0,F1=-36.2,SEAT=5.15;
  {const LOCO='#2f6a46',CREAM='#f2e6c4',RED='#c8344a';
    const wheels=(g,L)=>{[-L/2+.35,L/2-.35].forEach(z=>[-.3,.3].forEach(x=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.07,10),flat('#2a2a30'));w.rotation.z=Math.PI/2;w.position.set(x,.13,z);fin(w,g);}));pb(.5,.1,L-.4,'metal','#3a3e44',0,.18,0,{par:g});};
    // loco (front at -z)
    {const g=grp(JX,0,0);const L=1.7;wheels(g,L);pb(.96,.1,L,'paint',RED,0,.28,0,{par:g});
      const bon=pb(.78,.62,1.05,'paint',LOCO,0,.64,-.3,{par:g});pb(.8,.08,1.07,'paint',CREAM,0,.98,-.3,{par:g});pb(.8,.06,1.07,'paint',CREAM,0,.5,-.3,{par:g});
      pb(.92,.95,.62,'paint',LOCO,0,.8,.52,{par:g});pb(1.02,.07,.8,'paint',RED,0,1.31,.5,{par:g});
      const cw=litMat(l=>{const[c,x]=cvs(28,16);P(x,'#2f6a46',0,0,28,16);P(x,'#2a2230',3,2,22,11);P(x,l?'#ffe0a0':'#5a8aa0',4,3,20,9);P(x,'#a8d8e8',5,4,6,2);return c;});[-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(.5,.3),cw);w.position.set(s*.465,1.0,.52);w.rotation.y=s*Math.PI/2;fin(w,g);});
      {const w=new THREE.Mesh(new THREE.PlaneGeometry(.7,.3),cw);w.position.set(0,1.0,.21);w.rotation.y=Math.PI;fin(w,g);}
      pc(.07,.09,.3,'metal','#2a2a30',0,1.1,-.6,{par:g});pc(.1,.1,.08,'metal','#c8a03a',0,.82,-.84,{par:g,rx:Math.PI/2});lampHead(0,.72,-.86,.12,g);
      pb(.96,.16,.08,'paint',RED,0,.35,-.88,{par:g});signP(['BAY RIDER'],LOCO,'#fff0b0',.62,.13,.466,.74,-.3,Math.PI/2,g);signP(['BAY RIDER'],LOCO,'#fff0b0',.62,.13,-.466,.74,-.3,-Math.PI/2,g);
      TRAIN.cars.push({g,off:.85});}
    // carriages
    const cars=[['#f2c84a',RED],['#5cc6d8','#1d3a6e'],['#f2c84a',RED]];
    cars.forEach(([body,trim],i)=>{const g=grp(JX,0,0);const L=2.1;wheels(g,L);pb(.98,.08,L,'paint',trim,0,.28,0,{par:g});
      [-1,1].forEach(s=>{pb(.05,.28,L,'board',body,s*.47,.46,0,{par:g});pb(.07,.04,L,'paint',trim,s*.47,.62,0,{par:g});});[-1,1].forEach(s=>pb(.96,.32,.05,'board',body,0,.46,s*L/2,{par:g}));
      [-.55,.5].forEach(z=>{pb(.86,.06,.34,'slat','#a8744a',0,.5,z,{par:g});pb(.86,.3,.05,'slat','#a8744a',0,.7,z+.19,{par:g});});
      [[-.45,-L/2+.05],[.45,-L/2+.05],[-.45,L/2-.05],[.45,L/2-.05]].forEach(([x,z])=>pb(.05,.9,.05,'paint','#f4f0e6',x,.75,z,{par:g}));
      const rf=new THREE.Mesh(new THREE.BoxGeometry(1.08,.06,L+.12),[flat(trim),flat(trim),new THREE.MeshLambertMaterial({map:ctex(texC('stripe',trim+'|#fff6ea',1.08,L+.12))}),flat(mix(trim,'#000000',.3)),flat(trim),flat(trim)]);rf.position.y=1.22;fin(rf,g);
      // passengers on the benches (seen from behind)
      if(i!==1||true){[-.55,.5].forEach((z,k)=>{if((i+k)%2&&i!==1)return;[-.22,.22].forEach((x,q)=>{if(R()<.35||(i===1&&k===0))return;const s=spriteMesh([sitterC(pick(SK),pick(HR),pick(SH),pick(['#2f3b5c','#c9b68a']),R()<.3?'#f3e2b0':null,R()<.3)],.44,.48);s.position.set(x,.46,z-.04);s.__pxSkip=1;g.add(s);});});}
      TRAIN.cars.push({g,off:1.7+.15+1.05+i*2.25,roof:rf});});}
  const placeTrain=f=>{TRAIN.f=f;TRAIN.cars.forEach(c=>{const z=f+c.off,y=deckY(z)+.02,s=(deckY(z-1)-deckY(z+1))/2;c.g.position.set(JX,y,z);c.g.rotation.x=Math.atan(s);});};placeTrain(F0);
  const dummy=new THREE.Object3D();
  function trainRide(out){if(transit||RIDE)return;if(!pay(4))return;const go=()=>{const f0=out?F0:F1,f1=out?F1:F0;placeTrain(f0);TRAIN.mode='ride';TRAIN.ride={out};
      toast(out?'All aboard the Bay Rider! Next stop: the far end of the jetty':'All aboard! Back along the jetty to the shore',2.6);
      rideAlong([[JX,f0+SEAT],[JX,f0+SEAT+(f1-f0)*.08],[JX,f1+SEAT-(f1-f0)*.08],[JX,f1+SEAT]],dummy,3.6,()=>{TRAIN.mode=out?'end':'shore';TRAIN.t=14;TRAIN.ride=null;placeTrain(f1);player.x=WX1+.55;player.z=f1+SEAT;if(player.mesh)player.mesh.visible=true;
        S.busTrain=(S.busTrain||0)+1;toast(out?'The far end of the jetty, way out over Geographe Bay':'Back at the shore end of the jetty',2.6);try{save();}catch(e){}},.35);RIDE.__bus=1;RIDE.slow=1;};
    const at=out?F0:F1;if((TRAIN.mode==='shore'&&out)||(TRAIN.mode==='end'&&!out)||Math.abs(TRAIN.f-at)<.1)go();else{fadeTarget=.95;setTimeout(()=>{go();fadeTarget=0;},450);}}

  // ===== the Underwater Observatory: a pixel reef behind the round window =====
  const UW={el:null,c:null,x:null,raf:0,on:false,fish:[],labels:[],t:0,last:0,bg:null,piles:null,frame:null,W:256,H:160};
  const SPECIES=[{id:'bulls',name:'Bullseyes',note:'a whole school of bronze fish with big eyes',L:9,Hh:5,c:'#d8945a',b:'#f2c890',n:16},
    {id:'oldwife',name:'Old wife',note:'black and white stripes, sharp fin spines',L:14,Hh:11,c:'#f2f0e8',b:'#f2f0e8',st:'#2a2a30',n:3},
    {id:'devil',name:'Western blue devil',note:'deep blue with pale spots, shy under ledges',L:13,Hh:7,c:'#2a3ab0',b:'#3a5ad0',sp:'#a8d8ff',n:1},
    {id:'box',name:'Boxfish',note:'a little yellow box with fins',L:10,Hh:8,c:'#f2d040',b:'#f8e070',sp:'#2a2a30',n:1},
    {id:'groper',name:'Western blue groper',note:'big, blue and curious about the window',L:28,Hh:13,c:'#3a6ad0',b:'#7a9ae8',n:1},
    {id:'ray',name:'Eagle ray',note:'gliding over the sand like a bird',L:30,Hh:18,c:'#5a5048',b:'#7a6e62',sp:'#e8e2d6',n:1,ray:1},
    {id:'horse',name:'Seahorse',note:'holding on to the seagrass with its tail',L:6,Hh:13,c:'#e8a040',b:'#f2c070',n:1,horse:1}];
  const fishC={};
  const drawFishC=(S2,fr)=>{const k=S2.id+fr;if(fishC[k])return fishC[k];const W=S2.L+8,H=S2.Hh+6,c=mk(W,H),x=c.getContext('2d');const hx=S2.L/2+1,hy=H/2;
    if(S2.ray){for(let j=0;j<H;j++)for(let i=0;i<W;i++){const dx=Math.abs(i-W/2)/(W/2),dy=(j-hy)/(H/2-1);if(Math.abs(dy)+dx*.9>1-(fr?.08:0)*Math.abs(dy))continue;x.fillStyle=dy<0?S2.c:S2.b;x.fillRect(i,j,1,1);}
      for(let i=0;i<10;i++){x.fillStyle=S2.sp;x.fillRect(4+((i*37)%(W-8)),hy-3+((i*13)%6),1,1);}x.fillStyle='#3a342e';x.fillRect(0,hy,W/2-6,1);fishC[k]=c;return c;}
    if(S2.horse){x.fillStyle=S2.c;x.fillRect(2,1,4,3);x.fillRect(5,2,2,1);x.fillRect(1,4,4,5);x.fillRect(2,9,3,2);x.fillRect(3,11,2,1);x.fillRect(4,12,2,1);x.fillRect(5,11,1,1);x.fillStyle=S2.b;x.fillRect(2,5,1,3);x.fillStyle='#2a2230';x.fillRect(3,2,1,1);fishC[k]=c;return c;}
    for(let j=0;j<H;j++)for(let i=0;i<W;i++){const dx=(i-hx)/(S2.L/2),dy=(j-hy)/(S2.Hh/2);if(dx*dx+dy*dy>1)continue;let col=dy>.25?S2.b:S2.c;
      if(S2.st&&(((i+j*.4)|0)%6<2))col=S2.st;if(S2.sp&&((i*7+j*13)%11===0))col=S2.sp;if(dy<-.6)col=sh(S2.c,.8);x.fillStyle=col;x.fillRect(i,j,1,1);}
    const tw=fr?1:-1;x.fillStyle=sh(S2.c,.85);for(let k2=0;k2<4;k2++)x.fillRect(hx-S2.L/2-1-k2,hy-1-k2+tw,1,3+k2*2);
    x.fillStyle=sh(S2.c,.7);x.fillRect(hx-2,hy-S2.Hh/2-1,4,1);x.fillStyle='#ffffff';x.fillRect(hx+S2.L/2-3,hy-2,2,2);x.fillStyle='#1a1a22';x.fillRect(hx+S2.L/2-2,hy-2,1,1);
    if(S2.id==='groper'){x.fillStyle='#2a4a90';x.fillRect(hx+S2.L/2-1,hy+1,2,2);}fishC[k]=c;return c;};
  const uwPrep=()=>{const W=UW.W,H=UW.H;// background, coral-covered piles, seabed, the window frame
    const bg=mk(W,H),bx=bg.getContext('2d');const BND=['#4ab8c8','#3aa6bc','#2f94b0','#2682a2','#1f6e92','#1a5c80','#164c6e','#123e5c'].map(hex2);
    for(let y=0;y<H;y++)for(let X=0;X<W;X++){const t=y/H*(BND.length-1),q=Math.floor(t),f=t-q,b=L2_BAYER[(X&3)+((y&3)<<2)]/16;const c=BND[Math.min(BND.length-1,f>b?q+1:q)];bx.fillStyle=`rgb(${c[0]},${c[1]},${c[2]})`;bx.fillRect(X,y,1,1);}
    const r=mulberry32(99);const pileAt=(X,w,fade)=>{const mixC=c=>fade?mix(c,'#2a7a98',fade):c;bx.fillStyle=mixC('#3a3028');bx.fillRect(X,0,w,H-18);
      const GROW=['#f08a3a','#f2d04a','#d8342a','#9a5ad0','#f2a0c0','#f4f0e6','#6aa040','#e8603a','#c8a8e8'];for(let y=0;y<H-16;y+=2)for(let k=0;k<w*.8;k++){if(r()<.45){const c=GROW[(r()*GROW.length)|0];const s=1+(r()*3|0);bx.fillStyle=mixC(c);bx.fillRect(X+k-1+r()*2,y,s,s);bx.fillStyle=mixC(mix(c,'#ffffff',.3));bx.fillRect(X+k,y,1,1);}}
      for(let k=0;k<8;k++){let px=X+(r()<.5?-1:w),py=10+r()*(H-40);const dir=px<X?-1:1;for(let t=0;t<6+r()*6;t++){px+=dir*(r()<.7?1:0);py-=r()<.6?1:0;bx.fillStyle=mixC(pick(['#f2a0c0','#f08a3a','#f4f0e6','#9a5ad0']));bx.fillRect(px,py,1,1);}}};
    pileAt(26,10,.55);pileAt(208,9,.6);pileAt(168,13,.35);pileAt(64,24,0);
    for(let y=H-22;y<H;y++)for(let X=0;X<W;X++){const n=l2noise(X,y,6,3),b=L2_BAYER[(X&3)+((y&3)<<2)]/16;const t=(y-(H-22))/22;let c=t+n*.3>b+.2?'#b8a070':'#a89060';if(Math.sin(X*.4+y*1.3+n*3)>.85)c='#d8c088';if(y<H-20&&t<.1)c='#8a7a58';bx.fillStyle=c;bx.fillRect(X,y-(Math.sin(X*.05)*2|0),1,1);}
    for(let k=0;k<16;k++){const X=r()*W|0,y=H-14+r()*10|0,s=2+r()*5|0;bx.fillStyle='#5a5a52';bx.fillRect(X,y,s+2,s);bx.fillStyle='#7a7a6e';bx.fillRect(X+1,y,s,1);}
    UW.bg=bg;
    const fr=mk(W,H),fx=fr.getContext('2d');fx.fillStyle='#1c2430';fx.fillRect(0,0,W,H);fx.globalCompositeOperation='destination-out';const ix=12,iy=12,iw=W-24,ih=H-24,rad=20;
    fx.beginPath();fx.moveTo(ix+rad,iy);fx.lineTo(ix+iw-rad,iy);fx.quadraticCurveTo(ix+iw,iy,ix+iw,iy+rad);fx.lineTo(ix+iw,iy+ih-rad);fx.quadraticCurveTo(ix+iw,iy+ih,ix+iw-rad,iy+ih);fx.lineTo(ix+rad,iy+ih);fx.quadraticCurveTo(ix,iy+ih,ix,iy+ih-rad);fx.lineTo(ix,iy+rad);fx.quadraticCurveTo(ix,iy,ix+rad,iy);fx.fill();
    fx.globalCompositeOperation='source-over';const id=fx.getImageData(0,0,W,H);for(let q=3;q<id.data.length;q+=4)id.data[q]=id.data[q]>128?255:0;fx.putImageData(id,0,0);
    for(let X=20;X<W-16;X+=16){[5,H-6].forEach(y=>{P(fx,'#4a5a6a',X,y,2,2);P(fx,'#8a9aaa',X,y,1,1);});}for(let y=24;y<H-20;y+=16){[5,W-6].forEach(X=>{P(fx,'#4a5a6a',X,y,2,2);P(fx,'#8a9aaa',X,y,1,1);});}
    P(fx,'#2a3646',0,0,W,2);P(fx,'#141a24',0,H-2,W,2);UW.frame=fr;
    UW.fish=[];SPECIES.forEach(S2=>{for(let i=0;i<S2.n;i++){const school=S2.id==='bulls';UW.fish.push({S:S2,x:school?40+i%6*7+r()*4:r()*W,y:S2.ray?H-30:S2.horse?H-30:school?60+((i/6)|0)*9+r()*4:30+r()*(H-70),dir:r()<.5?1:-1,v:(S2.ray?9:S2.id==='groper'?6:S2.horse?0:school?14:8+r()*8),ph:r()*6,school});}});
    UW.fish.filter(f=>f.school).forEach(f=>{f.dir=1;});UW.motes=[...Array(40)].map(()=>({x:r()*W,y:r()*H,v:.6+r()*1.5}));UW.bub=[...Array(14)].map(()=>({x:60+r()*30,y:r()*H,v:8+r()*10}));};
  const uwDraw=ts=>{if(!UW.on)return;UW.raf=requestAnimationFrame(uwDraw);const dt=Math.min(.05,(ts-(UW.last||ts))/1000);UW.last=ts;UW.t+=dt;const t=UW.t,x=UW.x,W=UW.W,H=UW.H;
    x.drawImage(UW.bg,0,0);
    // light shafts from the surface
    x.globalAlpha=.1;x.fillStyle='#e8fcff';for(let k=0;k<4;k++){const sx=30+k*62+Math.sin(t*.4+k)*10;x.beginPath();x.moveTo(sx,0);x.lineTo(sx+14,0);x.lineTo(sx+40+Math.sin(t*.3+k)*8,H-20);x.lineTo(sx+18,H-20);x.fill();}x.globalAlpha=1;
    for(let X=0;X<W;X+=3){const y=2+Math.round(Math.sin(X*.15+t*2)*1.5);P(x,'rgba(220,250,255,.35)',X,y,2,1);}
    // seagrass swaying on the sand
    for(let k=0;k<46;k++){const X=(k*29)%W+((k*7)%5),h=8+(k*13)%14,c=k%3?'#3a7a3a':'#5a9a3a';for(let y=0;y<h;y++){const sw=Math.sin(t*1.4+k+y*.2)*(y/h)*3;P(x,c,X+sw,H-16-y,1,1);}}
    // fish
    UW.fish.forEach(f=>{const S2=f.S;if(f.school){f.x+=f.v*dt;f.y+=Math.sin(t*1.5+f.ph)*.15;if(f.x>W+30)f.x=-40-Math.random()*20;}
      else if(S2.horse){f.y=H-34+Math.sin(t*1.2+f.ph)*2;f.x=150;}
      else{f.x+=f.v*f.dir*dt;f.y+=Math.sin(t*.8+f.ph)*.12;if(f.x>W+40){f.dir=-1;}if(f.x<-40){f.dir=1;}}
      const c=drawFishC(S2,((t*4+f.ph)|0)%2);x.save();x.translate(Math.round(f.x),Math.round(f.y));if(f.dir<0)x.scale(-1,1);x.drawImage(c,-c.width/2|0,-c.height/2|0);x.restore();f.w=c.width;f.h=c.height;});
    // plankton motes and bubbles
    UW.motes.forEach(m=>{m.y+=m.v*dt*.5;m.x+=Math.sin(t+m.y)*.05;if(m.y>H)m.y=0;P(x,'rgba(230,250,255,.5)',m.x,m.y,1,1);});
    UW.bub.forEach(b=>{b.y-=b.v*dt;if(b.y<0){b.y=H-18;b.x=60+Math.random()*30;}P(x,'rgba(240,255,255,.7)',b.x+Math.sin(b.y*.2)*1.5,b.y,1,1);});
    // names of the fish you tapped
    x.font='bold 7px monospace';x.textAlign='center';UW.labels=UW.labels.filter(l=>(l.t-=dt)>0);UW.labels.forEach(l=>{const w=x.measureText(l.text).width+6;P(x,'rgba(20,26,46,.85)',l.x-w/2,l.y-7,w,9);x.fillStyle='#fff0b0';x.fillText(l.text,l.x,l.y);});
    x.globalAlpha=.06;x.fillStyle='#ffffff';x.beginPath();x.moveTo(40,12);x.lineTo(70,12);x.lineTo(20,H-12);x.lineTo(-10,H-12);x.fill();x.globalAlpha=1;
    x.drawImage(UW.frame,0,0);};
  const uwFit=()=>{if(!UW.c)return;const s=Math.max(innerWidth/UW.W,innerHeight/UW.H);UW.c.style.width=UW.W*s+'px';UW.c.style.height=UW.H*s+'px';UW.c.style.left=(innerWidth-UW.W*s)/2+'px';UW.c.style.top=(innerHeight-UW.H*s)/2+'px';};
  const uwCount=()=>{const n=Object.keys(S.busFish||{}).length;const e=document.getElementById('busUwN');if(e)e.textContent='Tap a fish to name it · spotted '+n+' of '+SPECIES.length;};
  function uwOpen(){if(overlay||transit)return;if(!pay(6))return;
    if(!UW.el){const el=document.createElement('div');el.id='busuwOv';el.innerHTML='<canvas id="busUwC" width="'+UW.W+'" height="'+UW.H+'"></canvas><div id="busUwTop"><b>Underwater Observatory</b><span>8 m below Geographe Bay, under the far end of the jetty</span><span id="busUwN"></span></div><button type="button" class="btn" id="busUwBack">Climb back up</button>';
      const st=document.createElement('style');st.textContent='#busuwOv{position:fixed;inset:0;z-index:74;background:#0e2a40;overflow:hidden}#busUwC{position:absolute;image-rendering:pixelated;image-rendering:crisp-edges;cursor:pointer}#busUwTop{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);background:rgba(20,26,46,.86);border:2px solid #3a4670;border-radius:8px;padding:6px 12px;color:#f5ecd8;text-align:center;max-width:calc(100vw - 32px)}#busUwTop b{display:block;font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:17px}#busUwTop span{display:block;font-size:12px;color:#a9b3cf}#busUwTop #busUwN{color:#bff0e8}#busUwBack{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));padding:8px 16px;font-size:15px}';
      document.head.appendChild(st);document.body.appendChild(el);UW.el=el;UW.c=el.querySelector('canvas');UW.x=UW.c.getContext('2d');UW.x.imageSmoothingEnabled=false;
      el.querySelector('#busUwBack').onclick=e=>{e.stopPropagation();uwClose();};
      UW.c.addEventListener('pointerdown',e=>{const b=UW.c.getBoundingClientRect(),px=(e.clientX-b.left)/b.width*UW.W,py=(e.clientY-b.top)/b.height*UW.H;let best=null,bd=1e9;
        UW.fish.forEach(f=>{const d=Math.hypot(px-f.x,py-f.y);if(Math.abs(px-f.x)<(f.w||10)/2+4&&Math.abs(py-f.y)<(f.h||8)/2+4&&d<bd){bd=d;best=f;}});
        if(!best)return;const S2=best.S;S.busFish=S.busFish||{};const nw=!S.busFish[S2.id];S.busFish[S2.id]=1;UW.labels.push({text:S2.name+(nw?' · new!':''),x:Math.max(30,Math.min(UW.W-30,best.x)),y:Math.max(24,best.y-10),t:2.4});
        if(nw){toast(S2.name+': '+S2.note,2.6);if(Object.keys(S.busFish).length===SPECIES.length&&!S.busFishAll){S.busFishAll=1;S.coins+=20;toast('You spotted every fish at the observatory! +20 coins',3.2);}}uwCount();try{save();}catch(e){}});
      addEventListener('resize',uwFit);}
    if(!UW.bg)uwPrep();UW.el.hidden=false;overlay='busuw';ui.hud.hidden=true;if(ui.act)ui.act.hidden=true;uwFit();uwCount();UW.on=true;UW.last=0;UW.raf=requestAnimationFrame(uwDraw);S.busObs=(S.busObs||0)+1;}
  function uwClose(){if(!UW.el||UW.el.hidden)return;UW.on=false;cancelAnimationFrame(UW.raf);UW.el.hidden=true;if(overlay==='busuw')overlay=null;ui.hud.hidden=false;if(ui.act)ui.act.hidden=false;toast('Back up the spiral stairs into the sunshine',2.2);}
  // closing a panel (fishing "Done", a dialog) calls hideOverlays, which would also end the day tour and strand Kip here: keep the tour while he is in this zone
  {const _ho=hideOverlays;hideOverlays=function(){if(UW.el&&!UW.el.hidden){UW.on=false;cancelAnimationFrame(UW.raf);UW.el.hidden=true;}const keep=(typeof TOUR!=='undefined'&&TOUR&&TOUR.trip==='bus'&&zoneOf(player.x)==='bus')?TOUR:null;const r=_ho.apply(this,arguments);if(keep&&!TOUR)TOUR=keep;return r;};}
  K._uw={open:uwOpen,close:uwClose};

  // ===== Peppermint Bay Holiday Park (fictional), across the promenade from the beach =====
  // reception + kiosk and a boom gate at the car park, a winding gravel park road, grassy powered sites among peppermints and banksias,
  // a camper van, a caravan with a roll-out awning, a retro van and a tent, a central camp kitchen with a herb garden, the amenities/laundry block,
  // three cabins to rent (a studio, a two-bedroom, a modern cube), and communal BBQs on the grass overlooking the bay.
  const camp={chairs:[],boom:null};
  {const Y=PLZ;
    // more trees among the sites: peppermints, and banksias with their yellow cones
    const banksiaC=seed=>{const r=mulberry32(seed);const bl=[];for(let i=0;i<7;i++)bl.push([20+(r()-.5)*22,14+(r()-.5)*10,5+r()*4]);const c=canopy(40,40,bl,['#2a3e2a','#38523a','#4c6a46','#6a8a5a'],r,[18,24]);const x=c.getContext('2d');
      for(let k=0;k<9;k++){const cx=6+r()*28|0,cy=6+r()*16|0;x.fillStyle='#c8902a';x.fillRect(cx,cy,2,4);x.fillStyle='#f2c84a';x.fillRect(cx,cy,1,3);x.fillStyle='#e8a83a';x.fillRect(cx+1,cy+1,1,2);}
      x.fillStyle='#3a2a20';x.fillRect(18,25,4,15);x.fillStyle='#5a4232';x.fillRect(19,25,1,15);x.fillRect(14,29,4,1);x.fillRect(22,27,4,1);x.fillRect(16,33,2,1);return c;};
    const BANK=[0,1].map(i=>sprMat(banksiaC(930+i)));
    [[1236.2,28.8],[1245.4,29.4],[1255.5,29.0],[1264.4,36.9],[1258.4,38.6]].forEach(([x,z],i)=>{const s=.85+R()*.3,v=i%2?PEPS[i%2]:BANK[(i>>1)%2];PLANTS.push(bbS(v,x,z,4.0*s,4.0*s));col(x-.22,z-.22,x+.22,z+.22);});
    // camper vans: a long box with a pop-top roof and a pixel skin (front at +z)
    const camper=(x,z,ry,body,stripe,name)=>{const g=grp(x,Y,z,ry);const L=3.1,Wd=1.3,H=1.45;
      const skin=(W,Hh,kind)=>{const[c,cx]=cvs(W*PPM,Hh*PPM);const CW=c.width,CH=c.height;P(cx,body,0,0,CW,CH);for(let i=0;i<CW*CH/14;i++)P(cx,sh(body,rnd()<.5?.95:1.05),rnd()*CW,rnd()*CH);
        P(cx,stripe,0,CH-15,CW,4);P(cx,sh(stripe,.7),0,CH-11,CW,2);P(cx,sh(body,1.12),0,0,CW,1);
        if(kind==='side'){P(cx,'#2a3a4a',CW*.08,7,CW*.2,13);P(cx,'#5a7a90',CW*.08+1,8,CW*.2-2,3);P(cx,'#2a3a4a',CW*.58,6,CW*.3,12);P(cx,'#5a7a90',CW*.58+1,7,CW*.3-2,3);P(cx,'#f4f0e6',CW*.58,18,CW*.3,2);
          P(cx,'#2a2230',CW*.36-1,3,18,CH-6);P(cx,sh(body,.92),CW*.36,4,16,CH-8);P(cx,'#5a7a90',CW*.36+3,7,10,8);P(cx,'#2a2230',CW*.36+13,CH/2,2,2);}
        if(kind==='front'){P(cx,'#2a3a4a',3,5,CW-6,15);P(cx,'#5a7a90',5,6,CW-10,4);P(cx,'#fff0b0',2,CH-20,6,4);P(cx,'#fff0b0',CW-8,CH-20,6,4);P(cx,'#3a3e44',4,CH-7,CW-8,5);P(cx,sh(body,.8),CW/2-5,CH-20,10,6);}
        if(kind==='back'){P(cx,'#2a3a4a',6,6,CW-12,10);P(cx,'#c8344a',2,CH-20,4,5);P(cx,'#c8344a',CW-6,CH-20,4,5);P(cx,'#3a3e44',4,CH-7,CW-8,5);P(cx,'#24262a',CW/2-7,10,14,14);P(cx,'#3a3e44',CW/2-4,13,8,8);}
        P(cx,'rgba(0,0,0,.25)',0,CH-1,CW,1);return new THREE.MeshLambertMaterial({map:ctex(c)});};
      const sd=skin(L,H,'side'),top=tex('paint',sh(body,1.05),Wd,L);const b=new THREE.Mesh(new THREE.BoxGeometry(Wd,H,L),[sd,sd,top,top,skin(Wd,H,'front'),skin(Wd,H,'back')]);b.position.y=.28+H/2;fin(b,g);
      pb(Wd*.86,.3,L*.6,'paint','#f4f0e6',0,.28+H+.15,-.25,{par:g});pb(Wd*.9,.06,L*.64,'paint',stripe,0,.28+H+.33,-.25,{par:g});
      [.95,-.95].forEach(a=>[-1,1].forEach(s2=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,10),flat('#24262a'));w.rotation.z=Math.PI/2;w.position.set(s2*Wd/2,.22,a);fin(w,g);}));
      if(name)[1,-1].forEach(s2=>signP([name],body,sh(stripe,.7),1.1,.16,s2*(Wd/2+.006),.28+H*.3,-.2,s2>0?Math.PI/2:-Math.PI/2,g));
      lampHead(.42,.6,L/2+.01,.09,g);lampHead(-.42,.6,L/2+.01,.09,g);col(x-Wd/2,z-L/2,x+Wd/2,z+L/2);return g;};
    const chair=(x,z,ry,c)=>{const g=grp(x,Y,z,ry);pb(.5,.05,.45,'paint',c,0,.42,0,{par:g});pb(.5,.5,.05,'paint',c,0,.68,-.22,{par:g,rx:-.15});[-.24,.24].forEach(o=>{pb(.03,.45,.5,'metal','#3a3e44',o,.22,0,{par:g,rx:.5});pb(.03,.45,.5,'metal','#3a3e44',o,.22,0,{par:g,rx:-.5});});return g;};
    const ftable=(x,z)=>{const g=grp(x,Y,z);pb(.9,.04,.6,'paint','#f4f0e6',0,.7,0,{par:g});[[-.4,-.25],[.4,-.25],[-.4,.25],[.4,.25]].forEach(([a,b])=>pb(.03,.7,.03,'metal','#9aa0a6',a,.35,b,{par:g}));return g;};
    const ptable=(x,z,c)=>{const g=grp(x,K.h(x,z),z);pb(1.8,.07,.8,'slat',c||'#a8744a',0,.74,0,{par:g});[-.62,.62].forEach(o=>pb(1.8,.06,.3,'slat',c||'#a8744a',0,.44,o,{par:g}));
      [-.7,.7].forEach(o=>{pb(.08,.72,.08,'metal','#2e3236',o,.36,0,{par:g});pb(.08,.06,1.5,'metal','#2e3236',o,.4,0,{par:g});});col(x-.95,z-.8,x+.95,z+.8);return g;};
    camp.ptable=ptable;
    const ebbq=(x,z)=>{const g=grp(x,K.h(x,z),z);pb(1.3,.84,.66,'stone','#b8ac94',0,.42,0,{par:g});pb(1.36,.05,.72,'metal','#c8ccd0',0,.86,0,{par:g});pb(.8,.03,.5,'metal','#2a2a30',0,.9,0,{par:g});pb(.14,.08,.04,'paint','#c8344a',.5,.7,.34,{par:g});col(x-.68,z-.36,x+.68,z+.36);return g;};
    camp.ebbq=ebbq;
    // powered-site posts: a green box with sockets and a site number
    CAMP_SITES.forEach((x,i)=>{const g=grp(x+1.75,Y,34.0);pb(.26,.95,.2,'paint','#3f7a46',0,.47,0,{par:g});pb(.3,.06,.24,'paint','#2f5a36',0,.98,0,{par:g});
      signP([String(i+1)],'#f4f0e6','#2f5a36',.18,.14,0,.78,.105,0,g);pb(.1,.08,.02,'paint','#f2c84a',0,.55,.105,{par:g});col(x+1.6,33.88,x+1.9,34.12);});
    // site 1: a white and teal camper van, chairs out the side
    camper(CAMP_SITES[0],31.6,0,'#f4f2ea','#2fa8a0','SALT ROAD');chair(1240.9,31.2,-.4,'#2f6fb0');chair(1240.8,32.5,-.9,'#e8457a');
    sprite1(sitterC(pick(SK),pick(HR),'#f2c84a','#2a2a30','#f3e2b0'),.6,.66,1240.9,31.25,Y+.18);
    // site 2: a caravan with a striped roll-out awning to the west, a mat, chairs, a table
    {const x=CAMP_SITES[1],z=31.4,g=grp(x,Y,z);const L=3.6,Wd=1.7,H=1.7,body='#f2ecdc',str='#8a5a36';
      const paintSide=(W,Hh,kind,l)=>{const[c,cx]=cvs(W*PPM,Hh*PPM);const CW=c.width,CH=c.height;P(cx,body,0,0,CW,CH);for(let Y2=0;Y2<CH;Y2+=4)P(cx,sh(body,.96),0,Y2,CW,1);
        P(cx,str,0,CH-18,CW,5);P(cx,'#c8a070',0,CH-13,CW,2);P(cx,str,0,6,CW,2);
        if(kind==='side'){[[.08,.22],[.62,.3]].forEach(([a,w])=>{P(cx,'#2a2230',CW*a-1,12,CW*w+2,16);P(cx,l?'#ffd890':'#5a7a90',CW*a,13,CW*w,14);if(!l)P(cx,'#a8d8e8',CW*a+2,14,6,3);P(cx,'#f4ecd8',CW*a,13,CW*w,3);});
          P(cx,'#2a2230',CW*.38,8,20,CH-14);P(cx,'#e8e2d0',CW*.38+1,9,18,CH-16);P(cx,l?'#ffd890':'#5a7a90',CW*.38+4,12,12,9);P(cx,'#c8a03a',CW*.38+16,CH/2+2,2,2);}
        if(kind==='end'){P(cx,'#2a2230',8,12,CW-16,14);P(cx,l?'#ffd890':'#5a7a90',9,13,CW-18,12);P(cx,'#c8344a',3,CH-24,4,4);P(cx,'#c8344a',CW-7,CH-24,4,4);}
        P(cx,'rgba(0,0,0,.25)',0,CH-1,CW,1);return c;};
      const sd=litMat(l=>paintSide(L,H,'side',l)),en=litMat(l=>paintSide(Wd,H,'end',l)),tp=tex('paint','#e8e2d6',Wd,L);
      const b=new THREE.Mesh(new THREE.BoxGeometry(Wd,H,L),[sd,sd,tp,tp,en,en]);b.position.y=.4+H/2;fin(b,g);
      pb(Wd*.92,.18,L*.96,'paint','#e8e2d6',0,.4+H+.09,0,{par:g});pb(.5,.22,.5,'paint','#d8d2c4',0,.4+H+.28,.4,{par:g});
      [-1,1].forEach(s2=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.26,.26,.16,10),flat('#24262a'));w.rotation.z=Math.PI/2;w.position.set(s2*Wd/2,.26,0);fin(w,g);});
      pb(.08,.08,1.1,'metal','#3a3e44',-.3,.35,L/2+.5,{par:g,ry:.25});pb(.08,.08,1.1,'metal','#3a3e44',.3,.35,L/2+.5,{par:g,ry:-.25});pc(.06,.06,.4,'metal','#3a3e44',0,.2,L/2+1.0,{par:g});pb(.3,.2,.3,'paint','#2a2a30',0,.12,L/2+.85,{par:g});
      const AW=2.2,ang=.16;{const st=texC('stripe','#2fa8a0|#fff6ea',AW,L*.92);const aw=new THREE.Mesh(new THREE.BoxGeometry(AW,.05,L*.92),[flat('#2fa8a0'),flat('#2fa8a0'),new THREE.MeshLambertMaterial({map:ctex(st)}),flat('#1f7a74'),flat('#2fa8a0'),flat('#2fa8a0')]);
        aw.position.set(-Wd/2-AW/2,.4+H-.05-Math.sin(ang)*AW/2,0);aw.rotation.z=ang;fin(aw,g);}
      {const v=texC('stripe','#2fa8a0|#fff6ea',L*.92,.22);const vx=v.getContext('2d');for(let X=0;X<v.width;X+=12)vx.clearRect(X+1,v.height-2,10,2);const vm=new THREE.Mesh(new THREE.PlaneGeometry(L*.92,.22),new THREE.MeshLambertMaterial({map:ctex(v),transparent:true,alphaTest:.5,side:THREE.DoubleSide}));vm.position.set(-Wd/2-AW+.02,.4+H-.12-Math.sin(ang)*AW,0);vm.rotation.y=Math.PI/2;fin(vm,g);}
      [-1,1].forEach(s2=>pc(.025,.025,.4+H-Math.sin(ang)*AW,'metal','#d8d8d0',-Wd/2-AW+.05,(.4+H-Math.sin(ang)*AW)/2,s2*L*.42,{par:g}));
      {const[c,mx]=cvs(64,96);for(let Y2=0;Y2<96;Y2+=8)P(mx,(Y2/8|0)%2?'#2f6fb0':'#5cc6d8',0,Y2,64,8);for(let i=0;i<300;i++)P(mx,'rgba(255,255,255,.15)',rnd()*64,rnd()*96);const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,3),new THREE.MeshLambertMaterial({map:ctex(c)}));m.rotation.x=-Math.PI/2;m.position.set(-Wd/2-1.1,.015,0);m.receiveShadow=true;m.__pxSkip=1;g.add(m);}
      col(x-Wd/2,z-L/2,x+Wd/2,z+L/2+1.1);
      chair(x-Wd/2-1.5,z-.7,Math.PI/2+.3,'#5aa04a');chair(x-Wd/2-1.6,z+.8,Math.PI/2-.2,'#c8344a');ftable(x-Wd/2-.8,z+.1);pc(.12,.1,.18,'metal','#c8344a',x-Wd/2-.8,Y+.81,z+.2);
      sprite1(sitterC(pick(SK),pick(HR),'#2f6fb0','#c9b68a',null),.6,.66,x-Wd/2-1.5,z-.7,Y+.18);
      lampHead(-Wd/2-.04,.4+H-.25,0,.12,g);halo(x-Wd/2-.3,Y+.4+H-.3,z,2.2);}
    // site 3: an orange retro van, a little dome tent beside it
    camper(CAMP_SITES[2],31.4,0,'#f08a3a','#f4f0e6','');chair(1251.0,33.6,.5,'#f2c84a');
    {const tc=texC('paint','#5aa04a',4,1.2);const tx=tc.getContext('2d');for(let X=0;X<tc.width;X+=16)P(tx,'#3f7a34',X,0,2,tc.height);P(tx,'#f2c84a',0,tc.height-6,tc.width,3);
      const t=new THREE.Mesh(new THREE.SphereGeometry(1,12,6,0,Math.PI*2,0,Math.PI/2),new THREE.MeshLambertMaterial({map:ctex(tc)}));t.scale.set(1.0,.85,.8);t.position.set(1254.6,Y,30.2);fin(t);
      const d=new THREE.Mesh(new THREE.CircleGeometry(.36,10,0,Math.PI),flat('#2a3a2a'));d.position.set(1254.6,Y+.01,31.01);fin(d);col(1253.6,29.5,1255.6,30.9);}
    // a hedge along the promenade, with a gap for the beach path; a post-and-rail fence by the car park
    for(let x=1233.2;x<1268.4;x+=1.25){if(Math.abs(x-1239.6)<1.0)continue;bbS(bushVariants[(x*7|0)%2],x,28.15,1.45,.9);}
    col(CAMP_X0,27.8,1238.8,28.5);col(1240.4,27.8,1268.5,28.5);
    {const parts=[];[[28.4,34.4],[36.4,39.5]].forEach(([a,b])=>{for(let z=a;z<=b+.01;z+=1.2)parts.push([new THREE.BoxGeometry(.08,.7,.08),M4(CAMP_X0,Y+.35,z)]);parts.push([new THREE.BoxGeometry(.05,.06,b-a),M4(CAMP_X0,Y+.6,(a+b)/2)],[new THREE.BoxGeometry(.05,.06,b-a),M4(CAMP_X0,Y+.3,(a+b)/2)]);});
      fin(new THREE.Mesh(merge(parts),tex('wood','#8a6a4a',.2,.7)));col(CAMP_X0-.15,28.4,CAMP_X0+.15,34.4);col(CAMP_X0-.15,36.4,CAMP_X0+.15,39.5);}
    // the boom gate: a striped arm that lifts when someone comes near
    {const g=grp(1233.4,Y,34.45);pb(.3,1.0,.3,'paint','#f2c84a',0,.5,0,{par:g});pb(.34,.06,.34,'paint','#2a2a30',0,1.02,0,{par:g});
      const arm=grp(0,.9,0,0,g);pb(.08,.1,1.85,'stripe','#c8344a|#ffffff',0,0,.95,{par:arm});camp.boom=arm;col(1233.25,34.3,1233.55,34.6);}
    // reception and kiosk: a modern timber pavilion, big glass, a skillion roof, a coffee board, an ice chest and a bait freezer
    {const x0=1236.2,z0=32.0,w=4.4,d=3.0,h=2.7,base='#c8a070';
      const face=(W,H,opts,extra)=>litMat(lit=>{const c=PXK.wall(W,H,Object.assign({base,kind:'board',lit,rows:1,quoins:false,cornice:false,moss:false,seed:W*17+H},opts));if(extra)extra(c.getContext('2d'),c.width,c.height,lit);return c;});
      const front=face(w,h,{win:0},(x,W,H,lit)=>{P(x,'#2a2230',8,22,58,52);P(x,lit?'#ffe0a0':'#6a8aa0',10,24,54,48);P(x,lit?'#fff4d0':'#a8d8e8',12,26,10,6);for(let X=10;X<64;X+=18)P(x,'#2a2230',X,24,1,48);
        P(x,'#2a2230',80,30,54,30);P(x,lit?'#ffd890':'#5a4636',82,32,50,26);for(let k=0;k<4;k++)P(x,['#c8a070','#f4f0e6','#5cc6d8','#8a5a36'][k],86+k*11,46,8,10);P(x,'#8a6a4a',78,60,58,5);});
      const side=face(d,h,{win:1,winW:24,winH:30}),back=face(w,h,{win:2,door:true,doorAt:.8,doorCol:'#2fa8a0'}),top=tex('tin','#6a7078',w,d);
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[side,side,top,top,front,back]);b.position.set(x0,Y+h/2,z0);fin(b);
      pb(w+.6,.08,d+.6,'tin','#5a6068',x0,Y+h+.12,z0+.1,{rx:.1});pb(w+.6,.34,.08,'paint','#2f5a36',x0,Y+h-.02,z0+d/2+.42);
      signP(['PEPPERMINT BAY HOLIDAY PARK'],'#2f5a36','#fff0b0',3.6,.3,x0,Y+h-.02,z0+d/2+.47,0);signP(['RECEPTION · KIOSK','coffee · bait · ice'],'#f4ecd8','#2f5a36',1.6,.36,x0+.2,Y+h-.62,z0+d/2+.02,0);
      pb(.9,.62,.55,'paint','#f4f6f6',x0+2.6,Y+.31,z0+1.2);signP(['ICE'],'#2f6fb0','#ffffff',.5,.2,x0+2.6,Y+.42,z0+1.48,0);pb(.7,.55,.5,'paint','#e8e8e2',x0+2.65,Y+.28,z0+.4);signP(['BAIT'],'#c8344a','#ffffff',.45,.18,x0+2.65,Y+.36,z0+.66,0);
      {const a=grp(x0-1.2,Y,z0+d/2+.8,.1);pb(.5,.7,.04,'paint','#2a2a30',0,.38,.06,{par:a,rx:-.15});pb(.5,.7,.04,'paint','#2a2a30',0,.38,-.06,{par:a,rx:.15});signP(['COFFEE','iced too'],'#2a2a30','#f4ecd8',.42,.3,0,.45,.12,0,a);}
      lampHead(x0-1.8,Y+h-.1,z0+d/2+.6,.14);lampHead(x0+1.8,Y+h-.1,z0+d/2+.6,.14);halo(x0,Y+h-.2,z0+d/2+.6,3);
      col(x0-w/2,z0-d/2,x0+w/2,z0+d/2);col(x0+2.15,z0+.1,x0+3.1,z0+1.5);
      // a little bench and bike rack out front
      bench(x0+.4,z0+d/2+1.9,0,Y);}
    // the central camp kitchen: an open shelter with benches, sinks, a hotplate and a long dining table, a herb garden beside it
    {const x0=1259.2,z0=32.4;[[-2.3,-1.7],[2.3,-1.7],[-2.3,1.7],[2.3,1.7],[0,-1.7],[0,1.7]].forEach(([a,b])=>{pb(.14,2.5,.14,'wood','#8a6a4a',x0+a,Y+1.25,z0+b);col(x0+a-.08,z0+b-.08,x0+a+.08,z0+b+.08);});
      pb(5.2,.08,4.0,'tin','#3f6a5a',x0,Y+2.55,z0,{rx:-.08});pb(5.3,.14,.1,'paint','#2f5a36',x0,Y+2.45,z0+2.02);
      pb(3.4,.86,.6,'board','#c8a070',x0,Y+.43,z0-1.25);pb(3.5,.05,.66,'metal','#c8ccd0',x0,Y+.88,z0-1.25);
      [-1.2,-.4].forEach(o=>{pb(.5,.03,.38,'metal','#6a7078',x0+o,Y+.91,z0-1.25);pc(.02,.02,.3,'metal','#c8ccd0',x0+o,Y+1.05,z0-1.48);});
      pb(.9,.08,.5,'metal','#2a2a30',x0+1.1,Y+.94,z0-1.25);pb(.8,.02,.4,'metal','#4a4e54',x0+1.1,Y+.99,z0-1.25);pb(.5,.7,.5,'paint','#f4f6f6',x0+2.0,Y+.35,z0-1.2);
      ptable(x0-.9,z0+.6);ptable(x0+1.3,z0+.6,'#8a5a36');col(x0-1.8,z0-1.6,x0+1.8,z0-.9);
      signP(['CAMP KITCHEN'],'#2f5a36','#fff0b0',1.4,.22,x0,Y+2.2,z0+2.08,0);lampHead(x0,Y+2.38,z0,.14);halo(x0,Y+2.3,z0,3);
      sprite1(sitterC(pick(SK),pick(HR),'#e2584f','#2f3b5c',null),.6,.66,x0-.9,z0+1.25,Y+.22);person(x0+.6,z0-.7,{hat:null,shirt:'#5bb48a'});
      // the herb garden: raised timber beds of herbs with little labels
      const herbC=seed=>{const r=mulberry32(seed),c=mk(40,16),x=c.getContext('2d');const C=[['#3e6a30','#5a8a3a','#7aa84a'],['#5a7a5a','#7a9a7a','#a8c0a0'],['#2e5a2a','#4a7a34','#e8e2f0']][seed%3];
        for(let k=0;k<70;k++){const bx=2+r()*36,h=3+r()*11;for(let t=0;t<h;t++){x.fillStyle=C[Math.min(2,(t/h*3)|0)];x.fillRect(bx+(r()-.5)*2|0,15-t,1,1);}}if(seed%3===2)for(let k=0;k<12;k++){x.fillStyle='#9478d4';x.fillRect(3+r()*34|0,2+r()*6|0,1,2);}return c;};
      const HERB=[0,1,2].map(i=>sprMat(herbC(i)));
      [[x0-3.5,z0-2.6],[x0-1.2,z0-2.6],[x0+1.1,z0-2.6]].forEach(([x,z],i)=>{pb(1.9,.4,.8,'wood','#8a6a4a',x,Y+.2,z);pb(1.8,.02,.7,'sand','#5a4030',x,Y+.4,z);bbS(HERB[i],x,z+.05,1.7,.55,Y+.38);
        signP([['basil','rosemary','lavender'][i]],'#f4ecd8','#2f5a36',.4,.12,x+.7,Y+.5,z+.41,0);col(x-.95,z-.4,x+.95,z+.4);});}
    // the amenities block: toilets, showers, laundry
    {const x0=1265.6,z0=30.6,w=3.8,d=3.0,base='#e8dcc0';const face=(W,H,opts)=>({lit:true,paint:lit=>PXK.wall(W,H,Object.assign({base,kind:'plaster',lit,rows:1,quoins:false,cornice:false,moss:true,seed:W*13+H},opts))});
      shed({x:x0,z:z0,y0:Y,w,d,h:2.5,hr:.9,base,trim:'#f6f2e6',roof:'#5a8a5a',gbase:'#d8ccae',vent:true,s:face(w,2.5,{win:1,door:true,doorAt:.25,doorCol:'#3f7a46'}),n:face(w,2.5,{win:2}),e:face(d,2.5,{win:1}),w2:face(d,2.5,{win:0,door:true,doorAt:.5,doorCol:'#3f7a46'})});
      signP(['AMENITIES','toilets · showers · laundry'],'#3f7a46','#ffffff',1.9,.42,x0+.5,Y+2.15,z0+d/2+.03,0);lampHead(x0-1.0,Y+2.3,z0+d/2+.12,.14);halo(x0-1,Y+2.2,z0+d/2+.2,2.2);
      // washing line with towels drying
      pc(.03,.03,1.7,'metal','#9aa0a6',x0-1.2,Y+.85,z0+2.6);pc(.03,.03,1.7,'metal','#9aa0a6',x0+1.6,Y+.85,z0+2.6);pb(2.8,.015,.015,'metal','#e8e8e8',x0+.2,Y+1.66,z0+2.6);
      [['#e8457a',-.6],['#f2c84a',.1],['#2f6fb0',.8]].forEach(([c,o])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.5,.7),new THREE.MeshLambertMaterial({map:ctex(texC('stripe',c+'|#fff6ea',.5,.7)),side:THREE.DoubleSide}));m.position.set(x0+o,Y+1.32,z0+2.6);fin(m);camp.chairs.push(m);});
      col(x0-1.25,z0+2.5,x0-1.15,z0+2.7);col(x0+1.55,z0+2.5,x0+1.65,z0+2.7);}
    // three cabins to rent, decks to the south: a studio, a two-bedroom cabin and a modern cube; corrugated roofs, colourful doors
    const COTS=[{name:'Studio Cabin',w:2.8,d:2.2,h:2.4,base:'#c8a070',door:'#f2c84a',roof:'#6a7078',kind:'skillion'},
      {name:'Two-Bedroom Cabin',w:3.6,d:2.4,h:2.4,base:'#8a9a9a',door:'#e8457a',roof:'#c8443a',kind:'gable'},
      {name:'Cube Cabin',w:2.7,d:2.4,h:2.6,base:'#3a3e44',door:'#2fa8a0',roof:'#2a2a30',kind:'cube'}];
    camp.cots=COTS.map((o,i)=>{const x=CAMP_COT[i],z=37.6,w=o.w,d=o.d,h=o.h;
      const face=(W,H,opts,extra)=>({lit:true,paint:lit=>{const c=PXK.wall(W,H,Object.assign({base:o.base,kind:'board',lit,rows:1,quoins:false,cornice:false,moss:false,seed:i*31+W*7+H},opts));if(extra)extra(c.getContext('2d'),c.width,c.height,lit);return c;}});
      const glassFront=(x2,W,H,lit)=>{P(x2,'#1a1a20',W*.42,16,W*.5,H-22);P(x2,lit?'#ffe0a0':'#6a8aa0',W*.42+2,18,W*.5-4,H-26);P(x2,lit?'#fff4d0':'#a8d8e8',W*.42+4,20,8,5);P(x2,'#1a1a20',W*.67,18,1,H-26);};
      const sF=o.kind==='cube'?face(w,h,{win:0,door:true,doorAt:.2,doorCol:o.door},glassFront):face(w,h,{win:o.kind==='gable'?2:1,door:true,doorAt:o.kind==='gable'?.5:.25,doorCol:o.door,winW:22,winH:28});
      const nF=face(w,h,{win:o.kind==='gable'?2:1,winW:20,winH:24}),eF=face(d,h,{win:1,winW:18,winH:24});
      if(o.kind==='gable'){shed({x,z,y0:Y,w,d,h,hr:1.0,base:o.base,trim:'#f6f2e6',roof:o.roof,ov:.25,s:sF,n:nF,e:eF,w2:eF,col:false});}
      else{const g=grp(x,Y,z);const m=f=>litMat(f.paint);const sm=m(eF);const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sm,sm,tex('paint','#8a8e96',w,d),tex('paint','#8a8e96',w,d),m(sF),m(nF)]);b.position.y=h/2;fin(b,g);
        if(o.kind==='skillion')pb(w+.5,.08,d+1.3,'tin',o.roof,0,h+.2,.35,{par:g,rx:.14});
        else{pb(w+.3,.22,d+.3,'paint','#2a2a30',0,h+.11,0,{par:g});pb(w+.3,.05,1.3,'paint','#2a2a30',0,h-.1,d/2+.65,{par:g});}}
      // timber deck with a rail, a step, two chairs
      pb(w+.2,.18,1.0,'deck','#a8875e',x,Y+.09,z+d/2+.5);pb(.06,.5,1.0,'paint','#f4f0e6',x+w/2+.07,Y+.43,z+d/2+.5);pb(w*.45,.5,.06,'paint','#f4f0e6',x+w*.3,Y+.43,z+d/2+.98);
      chair(x+w*.3,z+d/2+.45,Math.PI,['#2f6fb0','#f2c84a','#e8457a'][i]);
      if(o.kind!=='cube')[-w/2+.05,w/2-.05].forEach(a=>pb(.08,1.95,.08,'paint','#f4f0e6',x+a,Y+1.0,z+d/2+.95));
      signP([o.name],'#f4ecd8','#2a2a30',Math.max(1.2,o.name.length*.09),.18,x,Y+h-.25,z+d/2+.02,0);lampHead(x-w/2+.25,Y+1.95,z+d/2+.2,.12);halo(x-w/2+.25,Y+1.9,z+d/2+.3,2);
      col(x-w/2,z-d/2,x+w/2,z+d/2);return{x,z:z+d/2+1.1,name:o.name};});
    // people: a cyclist and a kid doing laps of the park road
    walker([[1233.8,35.5],[1267.5,35.2]],{hat:'#f4f0e6'});walker([[1266,35.6],[1235,35.6]],{kid:1,hat:null});}
  // ===== communal BBQs and picnic tables on the grass overlooking the bay, and the foreshore picnic area =====
  {const Y=PLZ;
    // bay-view BBQ: a little shade roof over two electric BBQs, tables either side
    {const x0=1262.2,z0=23.6;[[-1,-.55],[1,-.55],[-1,.55],[1,.55]].forEach(([a,b])=>pb(.1,2.2,.1,'paint','#3a3e44',x0+a,K.h(x0,z0)+1.1,z0+b));pb(2.5,.07,1.6,'tin','#2f8a8a',x0,K.h(x0,z0)+2.22,z0,{rz:.05});
      camp.ebbq(x0,z0);camp.ptable(1258.4,23.7);camp.ptable(1266.1,23.7,'#8a5a36');signP(['FREE BBQ','push the button · clean up after'],'#2f5a36','#fff0b0',1.2,.36,x0,K.h(x0,z0)+1.85,z0+.6,0);
      person(1263.3,24.2,{hat:'#f4f0e6',shirt:'#3f86d6'});[[1257.8,23.2],[1259.1,24.2],[1266.6,23.2],[1265.5,24.2]].forEach(([x,z],i)=>sprite1(sitterC(pick(SK),pick(HR),pick(SH),pick(['#2f3b5c','#c9b68a','#e8457a']),null,i===1),.6,.66,x,z,K.h(x,z)+.22));
      camp.bay=[x0,z0+.75];}
    // foreshore picnic area west of the playground: tables, a shade shelter, the free BBQ in the picnic shelter
    camp.ptable(1154.2,30.6);camp.ptable(1156.6,38.4,'#8a5a36');camp.ptable(1162.2,38.6);
    {const x=1154.4,z=35.2;[[-1.5,-1.2],[1.5,-1.2],[-1.5,1.2],[1.5,1.2]].forEach(([a,b])=>{pb(.12,2.4,.12,'paint','#3a3e44',x+a,Y+1.2,z+b);col(x+a-.08,z+b-.08,x+a+.08,z+b+.08);});pb(3.4,.06,2.8,'tin','#e8dcc0',x,Y+2.42,z,{rz:.06});camp.ptable(x,z);}
    {const g=grp(1163.1,Y,33.0);pc(.03,.03,1.4,'metal','#3a3e44',0,.7,0,{par:g});signP(['FREE BBQ','push the button · clean up after'],'#2f5a36','#fff0b0',1.2,.36,0,1.32,.03,0,g);col(1163.0,32.9,1163.2,33.1);}
    person(1162.4,33.5,{hat:'#f4f0e6',shirt:'#e45a5a'});person(1160.7,33.6,{kid:1,hat:null});
    [[1153.6,30.0],[1155.0,31.2],[1156.0,37.8],[1157.2,39.0],[1162.8,38.0],[1154.0,34.6],[1154.9,35.8]].forEach(([x,z],i)=>sprite1(sitterC(pick(SK),pick(HR),pick(SH),pick(['#2f3b5c','#c9b68a','#e8457a']),R()<.3?'#f3e2b0':null,i%3===1),.6,.66,x,z,Y+.22));}
  // a night in a cabin: pay, fade out, wake up at 7:30 the next morning
  function stayCabin(c){if(transit||overlay)return;if(!pay(30))return;transit=true;fadeTarget=1;toast('Kip checks into the '+c.name+' for the night…',2.2);
    setTimeout(()=>{const open=typeof OPEN==='number'?OPEN:420;try{if(S.time>=open)newDay();}catch(e){}S.time=open+30;S.closed=true;if(typeof STAM_MAX==='number')S.stamina=STAM_MAX;if(TOUR)TOUR.t0=S.time;
      player.x=c.x;player.z=c.z+.3;player.bike=false;player.carry=null;try{updateCamera(0,true);}catch(e){}fadeTarget=0;transit=false;S.busStay=(S.busStay||0)+1;try{save();}catch(e){}
      say(['Kip slept to the sound of little waves on the sand. Magpies sing outside the '+c.name+', and the jetty glows in the morning sun.']);},1300);}
  const sizzle=where=>{S.busBBQ=(S.busBBQ||0)+1;eat(16,pick(['a sausage in bread with fried onions and tomato sauce','two sausages and a pile of onions','a veggie burger off the hotplate']));toast('Sausage sizzle at the '+where+'! Kip wipes the hotplate clean afterwards.',2.6);};

  // ===== things to do =====
  const say2=lines=>say(lines);
  K.targets=T=>{const px=player.x,pz=player.z;if(RIDE)return;
    T.push({x:1205.7,z:28.6,r:1.5,label:'Jetty train · ride out to the far end (4 coins)',act:()=>trainRide(true)});
    T.push({x:1205.7,z:F1+SEAT,r:1.6,label:'Jetty train · back to the shore (4 coins)',act:()=>trainRide(false)});
    T.push({x:1208.75,z:OBS.z,r:1.5,label:'Underwater Observatory · go down to the reef (6 coins)',act:uwOpen});
    T.push({x:1200.3,z:-43.1,r:1.4,label:'Fish off the end of the jetty',act:()=>startFishing({name:'the end of Busselton Jetty'})});
    T.push({x:1207.9,z:-6.4,r:1.3,label:'Fish from the mid-jetty bay',act:()=>startFishing({name:'the mid-jetty fishing bay'})});
    T.push({x:1212,z:31.9,r:1.5,label:'Bay Breeze Kiosk · ice-cream (3 coins)',act:()=>{if(!pay(3))return;S.busIce=(S.busIce||0)+1;eat(14,pick(['a double scoop of mango and vanilla','a choc-dipped soft serve','a scoop of salted caramel in a waffle cone','a lemon sorbet']));}});
    T.push({x:1197.2,z:33.4,r:1.5,label:'Jetty Centre · read about the jetty',act:()=>say2(['Jetty Centre: The first part of this jetty was built in the 1860s, so ships could load timber out in deeper water.','Jetty Centre: It grew longer and longer until it ran almost 1.8 km out to sea. Storms and fire knocked bits off; the town rebuilt it every time.','Jetty Centre: Today a little train runs to the far end, and the observatory there takes you 8 m down to see the coral on the old piles.'])});
    {const sx=1186,sz=shoreZ(1186);T.push({x:sx,z:sz+1.2,r:2.2,label:'Paddle in Geographe Bay',act:()=>{player.x=sx;player.z=sz-3.2;toast('Kip wades into the warm, glassy shallows. So calm!',2.6);splash(sx,sz-3.2);S.busSwim=(S.busSwim||0)+1;}});}
    if(pz<shoreZ(px)-1.2&&!band(px,pz))T.push({x:px,z:pz,r:1.2,label:'Float on your back and look at the jetty',act:()=>{splash(px,pz);say2(['Kip floats in the turquoise water. The jetty runs away over the bay like a pencil line, and a pelican drifts past.']);}});
    T.push({x:1175,z:shoreZ(1175)+1.7,r:1.3,label:'Say g\'day to the pelicans',act:()=>say2(['The pelicans look at Kip, then at Kip\'s hands. No fish? They go back to snoozing.'])});
    camp.cots.forEach(c=>T.push({x:c.x,z:c.z,r:1.3,label:'Rent the '+c.name+' for the night (30 coins)',act:()=>stayCabin(c)}));
    T.push({x:1236.6,z:34.0,r:1.3,label:'Park kiosk · iced coffee (3 coins)',act:()=>{if(!pay(3))return;eat(10,'an iced coffee with a scoop of ice-cream on top');}});
    T.push({x:1234.9,z:34.0,r:1.0,label:'Reception · ask about the holiday park',act:()=>say2(['Reception: Welcome to Peppermint Bay Holiday Park! Powered sites, three cabins, a camp kitchen and the beach right across the path.','Reception: The cabins are 30 coins a night. Check-out is whenever the jetty train calls you!'])});
    T.push({x:1259.2,z:34.7,r:1.4,label:'Camp kitchen · cook brekkie (free)',act:()=>{eat(12,pick(['bacon and eggs on toast','pancakes with lemon and sugar','a big pot of porridge to share']));toast('Kip cooks brekkie in the camp kitchen and washes up',2.4);}});
    T.push({x:1257.6,z:29.0,r:1.2,label:'Herb garden · pick a sprig of rosemary',act:()=>say2(['Kip rubs a sprig of rosemary between his paws. It smells like roast dinners at Mum and Dad\'s.'])});
    T.push({x:1246.0,z:33.6,r:1.3,label:'Chat with the caravanners',act:()=>say2(['Caravanner: We\'re doing the big lap of Australia! Eight months on the road so far.','Caravanner: Busselton\'s our favourite stop. Calm water, the jetty, and a sausage sizzle every night.'])});
    T.push({x:camp.bay[0],z:camp.bay[1],r:1.3,label:'Bay-view BBQ · cook a sausage sizzle (free)',act:()=>sizzle('bay-view BBQ')});
    T.push({x:1161.6,z:33.3,r:1.3,label:'Free BBQ · cook a sausage sizzle',act:()=>sizzle('foreshore picnic area')});
    T.push({x:1236.4,z:20.4,r:1.6,label:'Look at the painted boatsheds',act:()=>say2(['Each boatshed is painted a different bright colour. Families keep kayaks, deck chairs and buckets inside, and they open the doors on sunny days.'])});};
  const splashes=[];const ringT=(()=>{const c=mk(32,32),x=c.getContext('2d');for(let a=0;a<6.28;a+=.05){x.fillStyle='rgba(255,255,255,.9)';x.fillRect(16+Math.cos(a)*14|0,16+Math.sin(a)*14|0,1,1);x.fillStyle='rgba(255,255,255,.5)';x.fillRect(16+Math.cos(a)*10|0,16+Math.sin(a)*10|0,1,1);}return ctex(c);})();
  function splash(x,z){for(let k=0;k<2;k++){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:ringT,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.04,z);m.__pxSkip=1;G.add(m);splashes.push({m,t:-k*.35});}}

  // ===== the map =====
  K.zone={rects:[[1150,-45,1270,45,'#2490c0'],[1150,-8,1270,12,'#3cc0cc'],[1150,10,1270,14,'#8adcd0'],[1150,14,1270,23.4,'#ecd8a6'],[1150,23.4,1270,40.3,'#6aa648'],[1150,24.6,1270,26.6,'#d8ccae'],[1191,26.6,1219,33.6,'#d8ccae'],[1220,32.8,1232,39.6,'#5a5d64'],[1232.6,28,1268.5,39.6,'#7ab454'],[1232,34.6,1268.5,36.2,'#c4b496'],[1262.9,28.8,1267.5,31.6,'#e8dcc0'],[1234,30.4,1238.4,33.6,'#c8a070'],[1257.5,31.9,1261,33.7,'#5cc6d8'],[1237.9,36.6,1241.3,39.0,'#c8a070'],[1244.7,36.6,1248.1,39.0,'#8a9a9a'],[1251.5,36.6,1254.9,39.0,'#e8e2d6'],[1151.5,29,1163.5,40,'#8cc060'],[1150,40.3,1270,43.2,'#4a4d55'],
    [1164,29,1185,37.5,'#4a8ac8'],[DX1,BEND,DX2,24.3,'#8a6a4a'],[1199.4,-43.7,1209.3,BEND,'#8a6a4a'],[1207,-11,1208.8,-5,'#8a6a4a'],[1209.7,-41.9,1214.3,-37.3,'#2f8a8a'],[1192.6,27.6,1200.6,32.4,'#c8443a'],[1209.7,28,1214.3,31.2,'#a8dcc8'],[1221.3,21.05,1253.6,23.35,'#e8457a']],
    labels:[['Busselton Jetty',1205,0,1],['Geographe Bay',1175,-20,1],['Underwater Observatory',1212,-44,1],['Jetty Centre',1196.6,30,0],['Kiosk',1212,29.6,0],['Boatsheds',1238,22.2,0],['Playground',1174.5,33,0],['Foreshore',1160,27,0],['Car park · tour van',1226,36,0],['Peppermint Bay Holiday Park',1250,32,0],['Bay-view BBQ',1262,23.4,0],['Picnic area · free BBQ',1157,34,0]]};

  // ===== animation =====
  let gF=0,fF=0;
  K.tick=(dt,t)=>{const n=typeof NIGHT==='number'?NIGHT:0,h=(S.time%1440)/60,dusk=Math.max(0,Math.min(1,(h-17.6)/1.2)),k=Math.max(n,dusk*.6);
    halos.forEach(m=>m.material.opacity=k*.75);
    // water glints twinkle and drift a pixel at a time, foam laps the sand
    const gi=((t*3.2)|0)%4;if(gi!==gF){gF=gi;glint.material.map=glintT[gi];}glintT.forEach(tx=>{tx.offset.set(Math.floor(t*1.5)/64,Math.floor(t*.7)/64);});glint.material.opacity=.8-n*.5;
    const fi=((t*2)|0)%3;if(fi!==fF){fF=fi;foam.material.map=foamT[fi];}foam.set(t);foam.material.opacity=1-n*.45;
    if(K._flag)K._flag.rotation.y=Math.sin(t*2.3)*.25;
    // the train
    {const open=TRAIN.mode==='ride';TRAIN.cars.forEach(c=>{if(c.roof)c.roof.visible=!(open&&Math.abs(c.off-SEAT)<.5);});}
    if(TRAIN.mode==='ride'&&RIDE&&RIDE.__bus){placeTrain(player.z-SEAT);if(player.mesh){player.mesh.visible=true;player.mesh.position.set(JX+.18,deckY(player.z)+.33,player.z+.05);}if(player.blob)player.blob.position.set(0,-50,0);}
    else if(TRAIN.mode==='ride'&&!RIDE){TRAIN.mode='shore';TRAIN.t=8;}
    else if(TRAIN.mode==='shore'||TRAIN.mode==='end'){TRAIN.t-=dt;if(TRAIN.t<=0){TRAIN.mode=TRAIN.mode==='shore'?'out':'back';TRAIN.v=0;}}
    else if(TRAIN.mode==='out'||TRAIN.mode==='back'){const goal=TRAIN.mode==='out'?F1:F0,d=goal-TRAIN.f,ad=Math.abs(d);TRAIN.v=Math.min(3.2,TRAIN.v+dt*.8,Math.sqrt(ad*1.6)+.15);const st=Math.min(ad,TRAIN.v*dt);placeTrain(TRAIN.f+Math.sign(d)*st);if(ad<.02){TRAIN.mode=TRAIN.mode==='out'?'end':'shore';TRAIN.t=16;placeTrain(goal);}}
    // walkers
    walkers.forEach(w=>{if(w.wait>0){w.wait-=dt;setFrame(w.m,0);return;}const p=w.m.position,tg=w.pts[w.i+w.f]||w.pts[w.i];if(!w.pts[w.i+w.f]){w.f=-w.f;w.wait=2+R()*5;return;}
      const dx=tg[0]-p.x,dz=tg[1]-p.z,d=Math.hypot(dx,dz);if(d<.1){w.i+=w.f;if(!w.pts[w.i+w.f]){w.f=-w.f;w.wait=2+R()*6;}return;}const s=Math.min(d,w.sp*dt);p.x+=dx/d*s;p.z+=dz/d*s;p.y=K.h(p.x,p.z);w.t+=dt;setFrame(w.m,[0,1,0,2][((w.t*6)|0)%4]);});
    // kids running down to the water and back
    kids.forEach(q=>{q.t+=dt*q.sp*.3;const ph=(Math.sin(q.t)+1)/2,z=q.z0+(q.z1-q.z0)*ph;const p=q.m.position;p.x=q.x0+Math.sin(q.t*1.7)*.6;p.z=z;p.y=Math.max(hT(p.x,p.z),hT(p.x,p.z)*.6+.02);if(p.z<shoreZ(p.x))p.y=hT(p.x,p.z)+.05;setFrame(q.m,[0,1,0,2][((t*7)|0)%4]);});
    swim.forEach(s=>{const p=s.m.position;if(s.head){p.x=s.x+Math.sin(t*s.v+s.ph)*3;p.y=s.base+Math.sin(t*1.6+s.ph)*.03;}else{p.y=s.base+Math.sin(t*1.3+s.ph)*.04;}});
    boats.forEach(b=>{b.g.position.y=b.y+Math.sin(t*.9+b.ph)*.05;b.g.rotation.z=Math.sin(t*.7+b.ph)*.04;});
    if(K._kayak){const q=K._kayak;q.x+=q.dir*dt*.9;if(q.x>1196)q.dir=-1;if(q.x<1158)q.dir=1;q.g.position.set(q.x,.02+Math.sin(t*1.2)*.02,-1.5);q.g.rotation.y=q.dir>0?0:Math.PI;q.pad.rotation.x=Math.sin(t*3)*.7;}
    rods.forEach(r=>{r.line.position.y=r.line.geometry.parameters.height/2+Math.sin(t*1.1+r.ph)*.02;});
    birds.forEach(b=>{if(b.kind==='fly'){b.a+=b.v*dt;b.m.position.set(b.cx+Math.cos(b.a)*b.r,b.y+Math.sin(t*1.3+b.a)*.3,b.cz+Math.sin(b.a)*b.r*.6);setFrame(b.m,((t*5+b.r)|0)%2);}
      else if(b.kind==='float'){b.m.position.y=-.28+Math.sin(t*1.1+b.ph)*.04;b.m.position.x=b.x+Math.sin(t*.12+b.ph)*1.5;}});
    if(camp.boom){const d=Math.hypot(player.x-1234.2,player.z-35.4),up=d<3.2||walkers.some(w=>Math.hypot(w.m.position.x-1234.2,w.m.position.z-35.4)<2.4);const tg=up?-1.35:0;camp.boom.rotation.x+=(tg-camp.boom.rotation.x)*Math.min(1,dt*3);}
    camp.chairs.forEach((m,i)=>{if(m.isMesh)m.rotation.y=Math.sin(t*1.6+i)*.25;});
    if(K._swings)K._swings.forEach((s,i)=>s.rotation.x=Math.sin(t*1.8+i*1.3)*(i?.5:.25));if(K._saw)K._saw.rotation.z=Math.sin(t*1.4)*.16;if(K._whale)K._whale.rotation.z=Math.sin(t*3)*.08;
    if(K._traffic)K._traffic.forEach(c=>{c.x+=c.dir*c.v*dt;if(c.x>1290)c.x=1130;if(c.x<1130)c.x=1290;c.g.position.set(c.x,PLZ,c.dir>0?42.4:41.1);c.g.rotation.y=c.dir>0?0:Math.PI;});
    for(let i=splashes.length-1;i>=0;i--){const s=splashes[i];s.t+=dt;const a=Math.max(0,s.t);s.m.scale.set(.4+a*2.2,.4+a*2.2,1);s.m.material.opacity=Math.max(0,1-a/1.2)*(s.t>0?1:0);if(s.t>1.2){G.remove(s.m);s.m.geometry.dispose();s.m.material.dispose();splashes.splice(i,1);}}};
  // the ground texture goes on last (after everything painted into it)
  terrain.material.map=ctex(K._groundC);terrain.material.needsUpdate=true;
  // the game's plant passes ran before the day trips were built: give these plants the same one look now (only these sprites)
  if(typeof LOOK2!=='undefined'&&LOOK2.on&&typeof plant2Apply==='function'){const keep=BB.slice();BB.length=0;PLANTS.forEach(m=>BB.push(m));try{plant2Apply();}catch(e){console.error(e);}BB.length=0;keep.forEach(m=>BB.push(m));}
};
