// ---------- Regional towns (Paul Nov 2026): one small-town map (zone rtn, x 1600..1700) shared by every coast and country town of the outer world ----------
// "Park and walk in <Town>" sets RTOWN.cur and enters zone rtn; TRIP_BUILD.rtn rebuilds the group from that town's settings (seeded names, colours,
// beach + jetty for coast towns, river + footbridge + bush for inland ones). Only one town is built at a time; the old one is disposed.
var RTOWN={cur:null,built:null,own:null,list:{}};
[['yanchep','Yanchep','coast','north'],['two_rocks','Two Rocks','coast','north'],['guilderton','Guilderton','coast','north'],['seabird','Seabird','coast','north'],
 ['ledge_point','Ledge Point','coast','north'],['mandurah','Mandurah','coast','south'],['bunbury','Bunbury','coast','south'],['nannup','Nannup','river','south'],
 ['manjimup','Manjimup','river','south'],['walpole','Walpole','coast','south'],['denmark','Denmark','river','south'],['albany','Albany','coast','south'],
 ['bremer_bay','Bremer Bay','coast','south'],['hopetoun','Hopetoun','coast','south']].forEach(([key,name,set,reg],i)=>{let h=7;for(const ch of name)h=(h*31+ch.charCodeAt(0))>>>0;
  RTOWN.list[key]={key,name,set,reg,seed:h%100000+1,sub:set==='coast'?'beach, jetty & holiday park':'river, bush & holiday park'};});
RTOWN.byName=n=>{for(const k in RTOWN.list)if(RTOWN.list[k].name===n)return RTOWN.list[k];return null;};
var TRIP_BUILD=TRIP_BUILD||{};TRIP_BUILD.rtn=function(G,K){
  const C=(S.rtown&&RTOWN.list[S.rtown])||RTOWN.cur||RTOWN.list.yanchep;RTOWN.cur=C;RTOWN.built=C.key;if(RTOWN.names)RTOWN.names(C);
  G.__pxSkip=1;const PPM=32,R=mulberry32(C.seed),rr=(a,b)=>a+(b-a)*R(),pick=a=>a[(R()*a.length)|0],COAST=C.set==='coast',NORTHT=C.reg==='north';
  const sh=PXK.sh,rnd=PXK.rnd;const P=(x,c,X,Y,W=1,H=1)=>{x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,H|0);};
  const cvs=(w,h)=>{const c=mk(Math.max(2,Math.round(w)),Math.max(2,Math.round(h)));const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];};
  const hex2=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];};
  // ===== the lie of the land =====
  const TOWN=.8,X0=1600,X1=1700,SZ=10.4;// main street centre line (z 8.4..12.4)
  const shoreZ=x=>-15+.9*Math.sin((x-X0)*.06)+.4*Math.sin((x-X0)*.17+1);
  const rz=x=>-16+1.2*Math.sin((x-X0)*.05);// the river's centre line (inland towns)
  const JX0=1638.8,JX1=1641.2,JZ=-31,DECK=TOWN+.12;
  const onJetty=(x,z)=>COAST&&x>JX0&&x<JX1&&z>JZ&&z<-4.5;
  const onBridge=(x,z)=>!COAST&&x>JX0&&x<JX1&&Math.abs(z-rz(1640))<5.4;
  function hT(x,z){if(COAST){if(z>=-5)return TOWN;const s=shoreZ(x);if(z<s)return Math.max(-1.8,-(s-z)*.1);const t=(z-s)/(-5-s);return TOWN*Math.pow(t,1.3);}
    if(z>=-9)return TOWN;const c=rz(x),d=Math.abs(z-c);if(d<3.2)return -.6;if(z>c){const t=Math.min(1,(d-3.2)/(-9-c-3.2));return -.6+(TOWN+.6)*t*t*(3-2*t);}
    if(d<8)return -.6+(TOWN+.6)*Math.min(1,(d-3.2)/4.8);return TOWN+Math.min(2.4,(-(c-8)-z)*.08)*(1+.25*Math.sin(x*.11));}
  K.walk=(x,z)=>{if(x<1602||x>1698||z>42)return false;if(onJetty(x,z)||onBridge(x,z))return true;if(COAST)return z>shoreZ(x)-3.6&&z>-40;return z>-38&&Math.abs(z-rz(x))>3.5;};
  K.h=(x,z)=>{if(onJetty(x,z))return DECK;if(onBridge(x,z)){const t=(z-rz(1640))/5.4;return TOWN+.2+.5*Math.max(0,1-t*t);}return hT(x,z);};
  K.arrive=[1661.5,15.6];K.van=[1661.5,18.6];
  // ===== town names (fictional businesses, seeded per town) =====
  const N=C.name,UP=N.toUpperCase();
  const NM={bakery:pick(['Golden Crust Bakery','Hot Oven Bakehouse','Crumb & Co Bakery','Sunrise Bakery',N+' Bakehouse']),
    cafe:pick(['The Salty Cup','Gumnut Café','Driftwood Café','The Old Post Café','Bluewren Café','Little Kettle Café']),
    store:pick(['Bluegum General Store','Corner Store & Post',N+' Supa Store','Sandhill Grocer','Main Street Mart']),
    pub:pick(['The Pelican Hotel','The Jarrah Arms','The Black Cockatoo','The Old Coach Inn','The Wattle Hotel','The Rusty Anchor']),
    op:pick(['Second Chance Op Shop','Treasure Trove Op Shop','The Swap Shed']),
    fish:pick(['Salty Fins Fish & Chips','The Golden Batter','Gull’s Fish & Chips','Reef & Chips']),
    hard:pick(['Red Gum Hardware & Bait','Bush Track Hardware','The Toolshed']),
    servo:pick(['Gumleaf Fuel','Red Dirt Fuel','Coastline Fuel','Long Road Fuel']),
    park:pick(COAST?['Seabreeze Holiday Park','Banksia Grove Holiday Park','Wattle Bay Holiday Park','Gull Point Caravan Park']:['Riverbend Holiday Park','Tall Timbers Caravan Park','Gumnut Hollow Holiday Park','Bluewren Caravan Park'])};
  const kinds=['bakery','cafe',COAST?(R()<.7?'fish':'op'):(R()<.5?'hard':'op')];for(let i=kinds.length-1;i>0;i--){const j=(R()*(i+1))|0;[kinds[i],kinds[j]]=[kinds[j],kinds[i]];}
  const SK=['#f1c7a0','#e2b48a','#c68a5e','#8d5a3b'],HR=['#2a1d16','#6b4226','#d9b25a','#9b3b22','#1b1b2b','#c9c2b4'],SH=['#e45a5a','#3f86d6','#f1c64a','#5bb48a','#c46ad6','#ffffff','#f08a3c','#5cc6d8','#f2a0c0'];
  const WALLS=[['#e8dcc0','board'],['#f2e2a8','board'],['#cfe0e8','board'],['#e8c8b8','plaster'],['#d8b89a','brick'],['#f4ecd8','plaster'],['#c9d8c0','board'],['#b8604a','brick']];
  const TRIMS=['#2f6fb0','#3e7d5c','#c9473f','#2f8a8a','#9478d4','#f08a3a','#a8303a'];
  // ===== pixel painters, 32 px per metre (Cervantes kit) =====
  const planks=(x,W,H,b,horiz,bw)=>{bw=bw||5;const L=horiz?H:W,M=horiz?W:H;for(let p=0;p<L;p+=bw){let s=-(rnd()*30|0);while(s<M){const e=s+24+(rnd()*40|0),a=s;s=e;const g=.9+rnd()*.16;
      const R2=(u,v,w,h,c)=>horiz?P(x,c,u,v,w,h):P(x,c,v,u,h,w);R2(a,p,e-a,bw,sh(b,g));R2(a,p,e-a,1,sh(b,g*1.14));R2(a,p+bw-1,e-a,1,sh(b,.5));R2(e-1,p,1,bw,sh(b,.62));}}};
  const PAINT={wood:(x,W,H,b)=>planks(x,W,H,b,W>=H,5),deck:(x,W,H,b)=>planks(x,W,H,b,true,6),
    metal:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/14;i++)P(x,sh(b,rnd()<.5?.93:1.06),rnd()*W,rnd()*H);P(x,sh(b,1.3),0,0,W,1);},
    paint:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let i=0;i<W*H/10;i++)P(x,sh(b,rnd()<.5?.92:1.07),rnd()*W,rnd()*H);P(x,sh(b,1.25),0,0,W,1);},
    tin:(x,W,H,b)=>{for(let X=0;X<W;X+=4){P(x,sh(b,.86),X,0,1,H);P(x,sh(b,1.0),X+1,0,1,H);P(x,sh(b,1.16),X+2,0,1,H);P(x,sh(b,.95),X+3,0,1,H);}for(let i=0;i<W*H/50;i++)P(x,sh(b,rnd()<.5?.8:1.2),rnd()*W,rnd()*H);},
    stone:(x,W,H,b)=>PXK.blocks(x,W,H,b,{rowH:6,minW:8,varW:7}),brick:(x,W,H,b)=>PXK.bricks(x,W,H,b),
    glass:(x,W,H,b)=>{P(x,b,0,0,W,H);for(let X=-H;X<W;X+=14)for(let k=0;k<H;k++)P(x,'rgba(160,200,220,.28)',X+k,H-k,3,1);P(x,'#1c2228',0,0,W,1);P(x,'#1c2228',0,H-1,W,1);},
    stripe:(x,W,H,b)=>{const c2=b.split('|');for(let X=0;X<W;X+=8)P(x,c2[(X/8|0)%2],X,0,8,H);P(x,'rgba(255,255,255,.25)',0,0,W,1);P(x,'rgba(0,0,0,.25)',0,H-1,W,1);}};
  const TC={};
  const tex=(kind,base,wm,hm)=>{const q=v=>Math.max(.125,Math.round(v*8)/8);wm=q(wm);hm=q(hm);const k=kind+base+wm+'x'+hm;if(TC[k])return TC[k];
    const W=Math.max(2,Math.round(wm*PPM)),H=Math.max(2,Math.round(hm*PPM));const[c,x]=cvs(W,H);PXK.seed(W*31+H*7+base.length*13+kind.length);PAINT[kind](x,W,H,base);
    if(W>4&&H>4&&kind!=='deck'&&kind!=='glass'){P(x,'rgba(255,255,255,.14)',0,0,W,1);P(x,'rgba(0,0,0,.28)',0,H-1,W,1);P(x,'rgba(0,0,0,.18)',W-1,0,1,H);}
    return TC[k]=new THREE.MeshLambertMaterial({map:ctex(c)});};
  const fin=(m,par)=>{m.__pxSkip=1;m.castShadow=true;m.receiveShadow=true;(par||G).add(m);return m;};
  const pb=(w,h,d,kind,base,x,y,z,o)=>{o=o||{};const sd=tex(kind,base,d,h),fr=tex(kind,base,w,h),tp=tex(o.top||kind,o.topBase||base,w,d);
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sd,sd,tp,tp,fr,fr]);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const pc=(r1,r2,h,kind,base,x,y,z,o)=>{o=o||{};const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,o.seg||8),tex(kind,base,Math.PI*2*Math.max(r1,r2),h));m.position.set(x,y,z);if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;return fin(m,o.par);};
  const grp=(x,y,z,ry,par)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;g.__pxSkip=1;(par||G).add(g);return g;};
  const MC={};const flat=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:new THREE.Color(c)}));
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const halos=[];
  const haloT=(()=>{const c=mk(32,32),x=c.getContext('2d'),g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,230,170,1)');g.addColorStop(.4,'rgba(255,200,120,.45)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,32,32);return ctex(c,{smooth:1});})();
  const halo=(x,y,z,s,par,col)=>{const m=new THREE.Sprite(new THREE.SpriteMaterial({map:haloT,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false,opacity:0,color:col||0xffffff}));m.position.set(x,y,z);m.scale.set(s,s,1);m.__pxSkip=1;(par||G).add(m);halos.push(m);return m;};
  const lampHead=(x,y,z,s,par)=>{const l=new THREE.Mesh(new THREE.BoxGeometry(s||.16,(s||.16)*1.1,s||.16),new THREE.MeshBasicMaterial({color:'#e8d8a8'}));l.position.set(x,y,z);l.__pxSkip=1;(par||G).add(l);PXB_LAMPS.push(l);return l;};
  const signM=(lines,bg,fg,W)=>{const L=Array.isArray(lines)?lines:[lines];const t=makeSign(L,W||Math.max(32,Math.max(...L.map(s=>s.length))*6+8),L.length*11+1,bg,fg);return new THREE.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveIntensity:.27,emissiveMap:t,side:THREE.DoubleSide});};
  const signP=(lines,bg,fg,w,h,x,y,z,ry,par)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),signM(lines,bg,fg));m.position.set(x,y,z);m.rotation.y=ry||0;m.__pxSkip=1;(par||G).add(m);return m;};
  const sprMat=c=>{const t=ctex(c);return{m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};};
  const PLANTS=[];
  const bbS=(v,x,z,w,h,y)=>{const g=new THREE.PlaneGeometry(w,h);g.translate(0,h/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,y==null?K.h(x,z)-.05:y,z);m.__pxSkip=1;G.add(m);PLANTS.push(m);return m;};
  const fadeDo=fn=>{if(transit)return;transit=true;fadeTarget=.95;setTimeout(()=>{try{fn();}catch(e){console.error(e);}updateCamera(0,true);fadeTarget=0;transit=false;save();},850);};
  // ===== plant sprites: gums, peppermints, Norfolk pines (coast), banksias, bushes, tufts =====
  const gumC=(seed,cols,trunk)=>{const r=mulberry32(seed),W=40,H=56,bl=[];for(let i=0;i<9;i++)bl.push([20+(r()-.5)*28,16+(r()-.5)*16,5+r()*4]);const c=canopy(W,H,bl,cols,r,null),x=c.getContext('2d');
    for(let y=26;y<H;y++){x.fillStyle=y%5?trunk[0]:trunk[1];x.fillRect(18,y,4,1);x.fillStyle=trunk[2];x.fillRect(19,y,1,1);}x.fillStyle=trunk[0];x.fillRect(13,30,6,2);x.fillRect(22,27,6,2);x.fillRect(15,H-2,10,2);return c;};
  const pineC=seed=>{const r=mulberry32(seed),W=36,H=100,c=mk(W,H),x=c.getContext('2d'),PC=['#1f3a26','#2a4c30','#386238','#4c7a44','#6a9650'];
    for(let y=6;y<H;y++){x.fillStyle=y%4?'#5a3e28':'#4a3220';x.fillRect(17,y,2,1);}
    for(let y=3;y<H-12;y+=4+(r()*2|0)){const t=y/(H-12),half=2+t*13+r()*2;for(const s of[-1,1]){const len=half*(.75+r()*.3);for(let k=0;k<=len;k++){x.fillStyle=PC[Math.min(4,Math.max(0,(s<0?3:2)-(k>len*.7?0:1)+(r()<.2?1:0)))];x.fillRect(18+s*k,y+Math.round(k*k*.012),1,2);}}}return c;};
  const bushC=(seed,cols)=>{const r=mulberry32(seed),bl=[];for(let i=0;i<5;i++)bl.push([12+(r()-.5)*14,9+(r()-.5)*3,4+r()*2.5]);return canopy(24,14,bl,cols,r,null);};
  const tuftC=seed=>{const r=mulberry32(seed),c=mk(14,10),x=c.getContext('2d'),T=['#6a7a3a','#8a9a4a','#aab468'];for(let k=0;k<18;k++){const bx=7+(r()-.5)*10,h=2+r()*7;for(let t=0;t<h;t++){x.fillStyle=T[(k+t)%3];x.fillRect(bx+(bx-7)*t*.06|0,9-t,1,1);}}return c;};
  const GUMS=[sprMat(gumC(C.seed+1,['#33502e','#4f7044','#6f9058','#98b878'],['#e8e2d6','#c8bca8','#fff8ec'])),sprMat(gumC(C.seed+2,['#2e4a26','#3e6230','#527a3a','#6e9448'],['#8a7a62','#6a5a40','#a89a80'])),
    sprMat(gumC(C.seed+3,['#3e5a2a','#5e823e','#86a456','#a8c070'],['#d8d0c0','#a89c88','#efe8dc']))];
  const PINE=sprMat(pineC(C.seed+4)),BUSH=[sprMat(bushC(C.seed+5,['#3a5232','#56704a','#74905c','#98ae76'])),sprMat(bushC(C.seed+6,['#5a6a5a','#7a8a78','#9aa898','#bcc8b8']))],TUFT=sprMat(tuftC(C.seed+7));
  const gum=(x,z,s)=>{s=s||.9+R()*.4;bbS(GUMS[(R()*3)|0],x,z,5*s,7*s);col(x-.22,z-.22,x+.22,z+.22);};
  const pine=(x,z,s)=>{s=s||.95+R()*.2;bbS(PINE,x,z,3.6*s,10*s);col(x-.2,z-.2,x+.2,z+.2);};
  const bush=(x,z,s)=>{s=s||.8+R()*.5;bbS(BUSH[(R()*2)|0],x,z,1.8*s,1.05*s);};
  const tuft=(x,z)=>bbS(TUFT,x,z,.9,.64);
  // ===== ground: one painted terrain mesh, 12 px per metre =====
  const GX0=1596,GX1=1704,GZ0=-44,GZ1=46,GP=12;
  const SHOPS=[];// [x,w,kind]
  const inPark=(X,z)=>X>1603&&X<1650&&z>14.2&&z<41.5;
  const parkRoad=(X,z)=>inPark(X,z)&&((Math.abs(X-1630)<1.2&&z<39)||(Math.abs(z-27.5)<1.2&&X>1604.5&&X<1649));
  const PADS=[];const onPad=(X,z)=>{for(const p of PADS)if(X>p[0]&&X<p[2]&&z>p[1]&&z<p[3])return true;return false;};
  const SITES=[[1608,22.4],[1615.5,22.4],[1607,31.6],[1614.5,31.6],[1622,31.6],[1638.5,31.6],[1646,31.6]];SITES.forEach(([x,z])=>PADS.push([x-2.4,z-2.2,x+2.4,z+1.8]));
  const CAB=[{x:1638.4,z:21.2},{x:1645.6,z:21.2}];
  const inCP=(X,z)=>X>1652&&X<1675&&z>14.2&&z<23.5,inGreen=(X,z)=>X>1677&&X<1698&&z>14.2&&z<26,inServo=(X,z)=>X>1667&&X<1684&&z>.4&&z<8.4;
  let groundC,toP,shade;
  {const W=(GX1-GX0)*GP,H=(GZ1-GZ0)*GP,c=mk(W,H),x=c.getContext('2d'),img=x.createImageData(W,H),D=img.data;const Cc=hs=>hs.map(hex2);
    const SAND=Cc(NORTHT?['#ece2c6','#e4d8b8','#f2e8d0','#dccfae']:['#f4f0e4','#ebe6d6','#f8f6ee','#e2dccb']),WET=Cc(NORTHT?['#d2c4a2','#dacdae','#c8b894']:['#d8d2c0','#e0dbcb','#cec6b2']),
      GR=Cc(COAST?['#4f8a3a','#5e9a42','#6aa648','#7ab454']:['#3f7a34','#4f8a3a','#5e9a42','#6aa648']),DRY=Cc(['#8a9a4a','#a0a858','#b8b470','#7a8a42']),
      LIT=Cc(['#6a5a3a','#7a6a46','#5a6a34','#8a7a52']),PAV=Cc(['#c8bc9e','#bdaf90','#d0c4a6','#a89878']),ASP=Cc(['#4a4d55','#52555d','#44474e']),CON=Cc(['#aaa494','#a09a8a','#b4ae9e','#8e887a']),
      GRV=Cc(['#c8b89a','#bba98a','#d4c6aa','#a8987a']),SEA=Cc(['#a2e6d6','#5cc6d8','#3ab8cc','#2a9ac0','#2490c0','#1d78a8']),RIV=Cc(['#4a7a6a','#3a6a62','#2f5a5a','#2a4e52']);
    const bay=L2_BAYER;
    for(let j=0;j<H;j++){const z=GZ0+(j+.5)/GP;for(let i=0;i<W;i++){const X=GX0+(i+.5)/GP,h=l2hash(i,j,C.seed&255),b=bay[(i&3)+((j&3)<<2)]/16;let col;
      if(z<-5&&COAST){const s=shoreZ(X),d=s-z;
        if(d>0){const k=d<.5?0:d<3+.8*l2noise(X,z,4,3)?1:d<7?2:d<13?3:d<20?4:5;col=SEA[Math.min(5,k+(b>.85?1:0))];if(h>.985&&k>0)col=[236,250,250];}
        else if(-d<1.3){col=WET[(h*3)|0];if(-d<.3&&h<.3)col=[214,202,174];}
        else{col=SAND[Math.min(3,((l2noise(X,z,1.4,21)*3.2+b*.8)|0))];if(Math.abs(-d-2.6-.5*l2noise(X,0,3,9))<.2&&h<.5)col=[138,118,70];if(h>.995)col=[250,246,236];if(z>-6.4&&h<(z+6.4)*.5)col=GR[1+((h*3)|0)];}}
      else if(z<-9&&!COAST){const c0=rz(X),d=Math.abs(z-c0);
        if(d<3.2){col=RIV[Math.min(3,(d<1.4?3:d<2.4?2:1)-(b>.8?1:0))];if(h>.99)col=[150,190,180];}
        else if(d<4.4){col=[[122,106,74],[110,96,66],[132,116,82]][(h*3)|0];}
        else if(z<c0){const n=l2noise(X,z,1.6,41);col=n>.55?LIT[(h*4)|0]:GR[Math.min(3,(n*4+b)|0)];if(h>.97)col=[92,80,56];}
        else col=GR[Math.min(3,((l2noise(X,z,2,31)*3+b)|0))];}
      else if(z<.4){col=GR[Math.min(3,((l2noise(X,z,2,31)*3+b)|0))];if(X>1636&&X<1644)col=PAV[(h*3)|0];else if(h>.99)col=[240,220,90];}
      else if(z<6.6){col=inServo(X,z)?CON[(h*4)|0]:PAV[(h*3)|0];}
      else if(z<8.4){if(inServo(X,z))col=CON[(h*4)|0];else{const u=X*3,v=z*3;col=PAV[(h*3)|0];if((v-Math.floor(v))<.08||((u+(Math.floor(v)&1)*.5)%1)<.06)col=PAV[3];}}
      else if(z<8.55||(z>12.25&&z<12.4))col=CON[3];
      else if(z<12.25){col=ASP[(h*3)|0];if(Math.abs(z-SZ)<.07&&(X%4)<2.2)col=[236,232,220];if(Math.abs(z-8.9)<.05||Math.abs(z-11.9)<.05)col=[214,210,200];if(h<.01)col=[70,72,78];}
      else if(z<14.2){const u=X*3,v=z*3;col=PAV[(h*3)|0];if((v-Math.floor(v))<.08||((u+(Math.floor(v)&1)*.5)%1)<.06)col=PAV[3];}
      else if(inPark(X,z)){if(parkRoad(X,z)){col=GRV[(h*4)|0];if(h<.06)col=GRV[3];}else if(onPad(X,z))col=GRV[((h*3)|0)];else col=GR[Math.min(3,1+((l2noise(X,z,1.8,51)*2.2+b)|0))];}
      else if(inCP(X,z)){col=ASP[(h*3)|0];if(z>15&&z<22.6&&Math.abs(((X-1652.6)%2.6))<.07)col=[230,228,220];if(Math.abs(z-18.8)<.06)col=[230,228,220];}
      else if(inGreen(X,z)){col=GR[2+((h*2)|0)];const dx=X-1687.5,dz=z-20;if(Math.abs(dx)<.7||Math.abs(dz)<.7||Math.hypot(dx,dz)<2.4)col=PAV[(h*3)|0];if(Math.hypot(dx,dz)<1.6)col=CON[(h*3)|0];}
      else if(z>26&&z<43&&X>1652&&X<1698){col=GR[Math.min(3,((l2noise(X,z,2.4,61)*3+b)|0))];const lot=Math.floor((X-1652)/15.3);if(Math.abs(X-(1652+lot*15.3+12))<1)col=CON[(h*3)|0];}
      else{const n=l2noise(X,z,1.6,71);col=n>.6?DRY[(h*4)|0]:GR[Math.min(3,(n*3.4+b)|0)];}
      const q=(j*W+i)*4;D[q]=col[0];D[q+1]=col[1];D[q+2]=col[2];D[q+3]=255;}}
    x.putImageData(img,0,0);toP=(X,Z)=>[(X-GX0)*GP,(Z-GZ0)*GP];
    shade=(X,Z,rx,rz2,a)=>{const[px,py]=toP(X,Z);for(let yy=-rz2*GP;yy<rz2*GP;yy++)for(let xx=-rx*GP;xx<rx*GP;xx++){const d=(xx/(rx*GP))**2+(yy/(rz2*GP))**2;if(d>1)continue;if(bay[((xx+64)&3)+(((yy+64)&3)<<2)]/16<(a||.8)*(1.2-d)){x.fillStyle='rgba(20,30,20,.26)';x.fillRect(px+xx,py+yy,1,1);}}};
    if(COAST)for(let t=0;t<9;t++){let X=1606+R()*88,Z=shoreZ(X)+1.5+R()*5,a=R()*6.28;for(let k=0;k<36;k++){a+=(R()-.5)*.6;X+=Math.cos(a)*.45;Z+=Math.sin(a)*.3;if(Z<shoreZ(X)+.4||Z>-5.5)a+=Math.PI;const[px,py]=toP(X,Z);x.fillStyle='rgba(150,130,96,.45)';x.fillRect(px+(k&1?2:-2)|0,py|0,2,1);}}
    groundC=c;}
  const terrain=(()=>{const NX=108,NZ=90,pos=[],uv=[],idx=[];for(let j=0;j<=NZ;j++){const z=GZ0+(GZ1-GZ0)*j/NZ;for(let i=0;i<=NX;i++){const X=GX0+(GX1-GX0)*i/NX;pos.push(X,hT(X,z),z);uv.push((X-GX0)/(GX1-GX0),1-(z-GZ0)/(GZ1-GZ0));}}
    for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){const a=j*(NX+1)+i,b=a+1,c=a+NX+1,d=c+1;idx.push(a,c,b,b,c,d);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
    const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({map:null}));m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;})();
  {const m=new THREE.Mesh(new THREE.PlaneGeometry(320,60),flat(COAST?'#7a9a48':'#4f7a3a'));m.rotation.x=-Math.PI/2;m.position.set(1650,TOWN-.02,46+29.9);m.receiveShadow=true;m.__pxSkip=1;G.add(m);
    [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.PlaneGeometry(60,COAST?52:92),flat(COAST?'#7a9a48':'#4f7a3a'));e.rotation.x=-Math.PI/2;e.position.set(1650+s*(54+29.9),TOWN-.02,COAST?20:0);e.__pxSkip=1;G.add(e);});}
  // water: glints over the sea (coast) or a dark river surface (inland), and a foam line at the shore
  const glintT=[0,1,2,3].map(f=>{const c=mk(64,64),x=c.getContext('2d'),r=mulberry32(61);for(let k=0;k<34;k++){const X=r()*64|0,Y=r()*64|0,L=2+(r()*4|0),on=((r()*4)|0+f)%4;if(on===3)continue;x.fillStyle=on===0?'rgba(255,255,255,.85)':on===1?'rgba(220,250,255,.6)':'rgba(200,240,250,.35)';x.fillRect(X,Y,on===2?L-1:L,1);}
    const t=ctex(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;});
  let glint,foam=null,rivS=null;
  if(COAST){glintT.forEach(t=>t.repeat.set(80,40));glint=new THREE.Mesh(new THREE.PlaneGeometry(320,160),new THREE.MeshBasicMaterial({map:glintT[0],transparent:true,depthWrite:false,opacity:.8}));glint.rotation.x=-Math.PI/2;glint.position.set(1650,.02,-16.6-80);
    {const m=new THREE.Mesh(new THREE.PlaneGeometry(320,140),flat('#1d78a8'));m.rotation.x=-Math.PI/2;m.position.set(1650,-1.7,-44-70);m.__pxSkip=1;G.add(m);}
    const fT=(()=>{const c=mk(64,16),x=c.getContext('2d');for(let X=0;X<64;X++){const y0=6+Math.round(Math.sin(X*.3)*1.5);x.fillStyle='rgba(255,255,255,.95)';x.fillRect(X,y0,1,2);x.fillStyle='rgba(240,252,255,.6)';x.fillRect(X,y0+2,1,1);}const t=ctex(c);t.wrapS=THREE.RepeatWrapping;return t;})();
    const NF=160,pos=new Float32Array((NF+1)*6),uv=new Float32Array((NF+1)*4),idx=[];for(let i=0;i<=NF;i++){const X=GX0+(GX1-GX0)*i/NF;uv.set([X/4,1,X/4,0],i*4);if(i<NF){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);
    foam=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:fT,transparent:true,depthWrite:false}));foam.__pxSkip=1;foam.renderOrder=2;foam.frustumCulled=false;G.add(foam);
    foam.set=t=>{const p=pos;for(let i=0;i<=NF;i++){const X=GX0+(GX1-GX0)*i/NF,s=shoreZ(X),w=.3*Math.sin(t*.9+X*.03)+.1*Math.sin(t*2.1+X*.2);p.set([X,.04,s+w-.9,X,.04,s+w+.4],i*6);}g.attributes.position.needsUpdate=true;g.computeBoundingSphere();};foam.set(0);}
  else{glintT.forEach(t=>t.repeat.set(30,2));const NRv=120,pos=[],uv=[],idx=[];for(let i=0;i<=NRv;i++){const X=GX0+(GX1-GX0)*i/NRv,c0=rz(X);pos.push(X,-.18,c0-3.4,X,-.18,c0+3.4);uv.push(i/NRv,0,i/NRv,1);if(i<NRv){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);
    rivS=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#5a8a86',transparent:true,opacity:.45,depthWrite:false}));rivS.__pxSkip=1;rivS.renderOrder=1;G.add(rivS);
    glint=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:glintT[0],transparent:true,depthWrite:false,opacity:.6}));glint.position.y=.01;}
  glint.__pxSkip=1;glint.renderOrder=2;G.add(glint);

  // ===== building helpers =====
  const gable=(g,w,d,h,o)=>{const e=o.eave==null?.35:o.eave,rise=o.rise==null?d*.3:o.rise,a=Math.atan2(rise,d/2),run=d/2+e;const L=run/Math.cos(a);
    const rm=new THREE.MeshLambertMaterial({map:ctex(PXK.roof(w+2*e,L,{base:o.roofBase||'#9aa4ac',kind:o.roofKind||'tin',seed:(w*5+d)|0}))});
    [1,-1].forEach(s=>{const sl=new THREE.Mesh(new THREE.BoxGeometry(w+2*e,.08,L),rm);sl.rotation.x=s*a;sl.position.set(0,h+rise-run*Math.tan(a)/2+.04,s*run/2);fin(sl,g);});
    const gm=new THREE.MeshLambertMaterial({map:ctex(PXK.wall(d,rise,{base:o.base,kind:o.kind,win:0,cornice:false,plinth:false,quoins:false,moss:false,seed:9})),side:THREE.DoubleSide});
    [1,-1].forEach(s=>{const geo=new THREE.BufferGeometry();const X=s*w/2;geo.setAttribute('position',new THREE.Float32BufferAttribute([X,h,-d/2,X,h,d/2,X,h+rise,0],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));geo.computeVertexNormals();fin(new THREE.Mesh(geo,gm),g);});
    pb(w+2*e+.04,.1,.14,'paint',sh(o.roofBase||'#9aa4ac',.8),0,h+rise+.06,0,{par:g});return rise;};
  const bld=o=>{const g=grp(o.x,o.y==null?TOWN:o.y,o.z,o.ry||0);const h=o.h,w=o.w,d=o.d;
    const face=(ww,opt)=>litMat(lit=>PXK.wall(ww,h,Object.assign({base:o.base,kind:o.kind,lit,seed:(ww*13+h*7+(o.seed||0))|0,cornice:o.cornice},opt||{})));
    const fr=face(w,o.front),bk=face(w,o.back||{win:Math.max(0,Math.floor(w/3.2))}),sd=face(d,o.side||{win:Math.max(0,Math.floor(d/3.4))});
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sd,sd,flat(sh(o.base,.8)),flat(o.base),fr,bk]);m.position.y=h/2;fin(m,g);
    if(o.roof!==false)gable(g,w,d,h,o);else{pb(w+.3,.16,d+.3,'tin',o.roofBase||'#aab0b6',0,h+.08,0,{par:g});[[0,-d/2],[0,d/2]].forEach(([a,b])=>pb(w+.3,.3,.14,'paint',o.parapet||sh(o.base,.85),a,h+.15,b,{par:g}));[-1,1].forEach(q=>pb(.14,.3,d+.3,'paint',o.parapet||sh(o.base,.85),q*(w/2+.08),h+.15,0,{par:g}));}
    if(!o.nocol){const c2=Math.abs(Math.sin(o.ry||0))>.5;const hw=(c2?d:w)/2,hd=(c2?w:d)/2;col(o.x-hw,o.z-hd,o.x+hw,o.z+hd);}
    shade(o.x+.5,o.z+.4,w/2+.6,d/2+.5,.7);return g;};
  const verandah=(g,w,dep,hh,z0,o)=>{o=o||{};const pcol=o.post||'#f4f0e6';const n=Math.max(2,Math.round(w/2.6)+1);
    for(let i=0;i<n;i++){const x=-w/2+.1+(w-.2)*i/(n-1);pb(.1,hh,.1,'paint',pcol,x,hh/2,z0+dep-.08,{par:g});if(i<n-1){const br=pb(.5,.06,.06,'paint',pcol,x+.24,hh-.22,z0+dep-.08,{par:g});br.rotation.z=.6;}if(i>0){const br=pb(.5,.06,.06,'paint',pcol,x-.24,hh-.22,z0+dep-.08,{par:g});br.rotation.z=-.6;}}
    const rf=pb(w+.2,.06,dep+.15,'tin',o.roof||'#c8ccd0',0,hh+.12,z0+dep/2,{par:g});rf.rotation.x=.12;pb(w+.2,.12,.05,'paint',o.fascia||pcol,0,hh+.06,z0+dep+.02,{par:g});return rf;};
  const chair=(x,z,c,ry)=>{const g=grp(x,K.h(x,z),z,ry||0);pb(.42,.05,.4,'paint',c,0,.42,0,{par:g});pb(.42,.42,.05,'paint',c,0,.65,-.2,{par:g});[[-.18,-.16],[.18,-.16],[-.18,.16],[.18,.16]].forEach(([a,b])=>pb(.04,.42,.04,'metal','#3a3e44',a,.21,b,{par:g}));return g;};
  const table=(x,z,c,umb)=>{const g=grp(x,K.h(x,z),z);pb(.8,.05,.8,'paint',c||'#f4f0e6',0,.72,0,{par:g});pb(.06,.72,.06,'metal','#3a3e44',0,.36,0,{par:g});
    if(umb){pc(.03,.03,1.5,'metal','#e8e8e2',0,1.2,0,{par:g});const u=new THREE.Mesh(new THREE.ConeGeometry(1.0,.38,8),tex('stripe',umb+'|#f4f0e6',3,1));u.position.y=2.0;fin(u,g);}col(x-.4,z-.4,x+.4,z+.4);return g;};
  const picnic=(x,z,ry)=>{const g=grp(x,K.h(x,z),z,ry||0);pb(1.9,.07,.8,'wood','#9a6a3e',0,.74,0,{par:g});[-1,1].forEach(s=>{pb(1.9,.06,.28,'wood','#9a6a3e',0,.44,s*.62,{par:g});[-.7,.7].forEach(a=>{const l=pb(.08,.8,.08,'wood','#7a4a2a',a,.38,s*.3,{par:g});l.rotation.x=s*.35;});});col(x-1,z-.8,x+1,z+.8);return g;};
  const smoke=[];
  const bbq=(x,z,shelter)=>{const g=grp(x,K.h(x,z),z);pb(1.6,.8,.7,'stone','#b8b0a0',0,.4,0,{par:g});pb(1.3,.06,.5,'metal','#3a3e44',0,.83,0,{par:g});pb(.2,.12,.04,'paint','#c8344a',.6,.6,.36,{par:g});
    signP(['FREE BBQ'],'#3e7d5c','#f4f0e6',.5,.16,-.45,.62,.36,0,g);
    if(shelter){[[-1.8,-1.2],[1.8,-1.2],[-1.8,1.4],[1.8,1.4]].forEach(([a,b])=>pb(.12,2.4,.12,'wood','#7a4a2a',a,1.2,b,{par:g}));const r=pb(4.4,.08,3.6,'tin','#3e7d5c',0,2.5,.1,{par:g});r.rotation.x=.08;pb(4.4,.14,.06,'paint','#2a5a3a',0,2.42,1.9,{par:g});}
    col(x-.85,z-.4,x+.85,z+.4);smoke.push({x,z,boost:0});return g;};
  const lamp=(x,z)=>{const y=K.h(x,z);pc(.06,.08,3.6,'metal','#5a5e64',x,y+1.8,z,{seg:6});pb(.7,.06,.06,'metal','#5a5e64',x,y+3.55,z+.3);lampHead(x,y+3.48,z+.6,.18);halo(x,y+3.3,z+.6,3.4);col(x-.1,z-.1,x+.1,z+.1);};
  const bin=(x,z,c)=>{pb(.5,.8,.5,'paint',c||'#3e7d5c',x,K.h(x,z)+.4,z);pb(.54,.08,.54,'paint','#c8344a',x,K.h(x,z)+.84,z);col(x-.25,z-.25,x+.25,z+.25);};
  const benchS=(x,z,ry)=>{const g=grp(x,K.h(x,z),z,ry||0);pb(1.6,.06,.45,'wood','#9a6a3e',0,.45,0,{par:g});pb(1.6,.36,.06,'wood','#9a6a3e',0,.72,-.22,{par:g});[-.7,.7].forEach(a=>pb(.06,.45,.4,'metal','#3a3e44',a,.22,0,{par:g}));col(x-.8,z-.25,x+.8,z+.25);};

  // ===== the main street: 5 shops, the pub, the servo and the town hall on the north side, facing the street (+z) =====
  const shopAt=(x,w,kind,i)=>{const[base,wk]=WALLS[(C.seed+i*3)%WALLS.length],trim=TRIMS[(C.seed+i*5)%TRIMS.length],h=kind==='store'?3.6:3.2;
    const g=bld({x,z:3.2,w,d:5.6,h,base,kind:wk,seed:C.seed+i,roof:false,parapet:sh(base,.86),front:{win:2,door:true,doorAt:.5,doorCol:trim,winW:Math.min(46,w*5),winH:34},back:{win:1},side:{win:0}});
    // a stepped parapet (false front) carrying the shop's name, verandah over the footpath
    const pf=litMat(lit=>PXK.wall(w,1.1,{base,kind:wk,win:0,lit,cornice:true,plinth:false,seed:C.seed+i+40}));const fm=new THREE.Mesh(new THREE.BoxGeometry(w,1.1,.24),[flat(base),flat(base),flat(sh(base,.8)),flat(base),pf,flat(base)]);fm.position.set(0,h+.55,2.7);fin(fm,g);
    pb(w*.4,.3,.24,'paint',sh(base,.9),0,h+1.25,2.7,{par:g});
    verandah(g,w+.1,1.6,2.75,2.8,{post:'#f4f0e6',roof:'#c8ccd0',fascia:trim});
    signP([NM[kind].toUpperCase()],trim,'#ffffff',Math.min(w-.6,NM[kind].length*.26+.6),.48,x,TOWN+h+.5,6.03,0);
    lampHead(x-w/4,TOWN+2.6,5.95,.12);lampHead(x+w/4,TOWN+2.6,5.95,.12);halo(x,TOWN+2.3,6.6,3);SHOPS.push({x,w,kind,name:NM[kind],trim});return g;};
  [[1607.5,9,kinds[0]],[1617.5,9,kinds[1]],[1628,10,'store'],[1661,9,kinds[2]]].forEach(([x,w,k],i)=>shopAt(x,w,k,i));
  // props per shop
  SHOPS.forEach(s=>{const x=s.x,fz=7.0;
    if(s.kind==='cafe'){[-2.6,0,2.6].forEach((a,i)=>{table(x+a,8.0,'#f4f0e6',i===1?s.trim:null);chair(x+a-.5,8.0,s.trim,Math.PI/2);chair(x+a+.5,8.0,s.trim,-Math.PI/2);});}
    else if(s.kind==='bakery'){const g=grp(x+2.6,TOWN,fz+.4,-.3);[-1,1].forEach(q=>{const b=pb(.6,.9,.04,'paint','#2a2230',0,.45,q*.18,{par:g});b.rotation.x=q*.2;});signP(['PIES','VANILLA SLICE'],'#2a2230','#f4f0e6',.54,.5,0,.55,.23,0,g);}
    else if(s.kind==='store'){const g=grp(x+3.4,TOWN,fz-.1);pb(1.4,1.0,.6,'paint','#f4f0e6',0,.5,0,{par:g});signP(['ICE'],'#2f9ad8','#ffffff',.9,.26,0,.75,.31,0,g);signP(['BAIT','PAPERS','POST'],'#f4f0e6','#c8344a',.7,.8,x-3.8,TOWN+.6,fz+.2,0);col(x+2.7,fz-.4,x+4.1,fz+.2);}
    else if(s.kind==='fish'){benchS(x-2.4,fz+.7);benchS(x+2.4,fz+.7);signP(['FISH & CHIPS'],'#2f6fb0','#f4f0e6',1.0,.3,x,TOWN+.95,fz+.25,0);}
    else if(s.kind==='op'){const g=grp(x-2.8,TOWN,fz+.3);pb(1.4,.05,.05,'metal','#9aa0a6',0,1.4,0,{par:g});[-.5,-.2,.1,.45].forEach((a,i)=>pb(.26,.6,.06,'paint',['#e2584f','#5cc6d8','#f2c84a','#9478d4'][i],a,1.05,0,{par:g}));[-.7,.7].forEach(a=>pb(.04,1.4,.04,'metal','#9aa0a6',a,.7,0,{par:g}));}
    else if(s.kind==='hard'){[0,1,2].forEach(k=>pb(.6,.4,.6,'wood','#b98552',x-3.2+k*.7,TOWN+.2,fz+.1));signP(['BAIT & TACKLE'],'#e8c84a','#2a2230',1.0,.24,x+2.6,TOWN+.9,fz+.3,0);}
    bin(x+s.w/2-.4,7.9,'#3e7d5c');});
  // the pub: two storeys, a wide verandah with a lace balcony on top
  {const x=1650,w=11,base=pick(['#c9b28a','#d8b89a','#e8dcc0']),trim=pick(['#3e7d5c','#a8303a','#2f6fb0']);
    const g=bld({x,z:3.2,w,d:5.6,h:6.2,base,kind:'brick',seed:C.seed+21,roof:false,parapet:sh(base,.8),front:{win:4,door:true,doorAt:.5,doorCol:trim,rows:2,winW:22,winH:28},back:{win:3,rows:2},side:{win:1,rows:2}});
    const pf=litMat(lit=>PXK.wall(w,.9,{base,kind:'brick',win:0,lit,cornice:true,seed:C.seed+44}));const fm=new THREE.Mesh(new THREE.BoxGeometry(w,.9,.24),[flat(base),flat(base),flat(sh(base,.8)),flat(base),pf,flat(base)]);fm.position.set(0,6.65,2.7);fin(fm,g);
    for(let i=0;i<6;i++){const px=-w/2+.15+(w-.3)*i/5;pb(.12,5.6,.12,'paint','#f4f0e6',px,2.8,4.5,{par:g});}
    pb(w+.2,.12,1.8,'deck','#8a6a4a',0,2.9,3.6,{par:g});const rf=pb(w+.3,.06,1.9,'tin','#c8ccd0',0,5.75,3.6,{par:g});rf.rotation.x=.1;
    const lace=(()=>{const[c,xx]=cvs(w*PPM,.8*PPM);for(let X=0;X<c.width;X+=8){P(xx,'#f4f0e6',X,0,1,c.height);P(xx,'#f4f0e6',X+4,6,1,12);xx.fillStyle='#f4f0e6';for(let a=0;a<6.28;a+=.6)xx.fillRect(X+4+Math.cos(a)*3|0,12+Math.sin(a)*3|0,1,1);}P(xx,'#f4f0e6',0,0,c.width,2);P(xx,'#f4f0e6',0,c.height-2,c.width,2);
      const t=ctex(c);const m=new THREE.MeshLambertMaterial({map:t,transparent:true,alphaTest:.4,side:THREE.DoubleSide});return m;})();
    const L1=new THREE.Mesh(new THREE.PlaneGeometry(w,.8),lace);L1.position.set(0,3.35,4.5);fin(L1,g);
    signP([NM.pub.toUpperCase()],trim,'#f4f0e6',Math.min(w-1,NM.pub.length*.27+.8),.55,x,TOWN+6.65,6.03,0);signP(['COUNTER MEALS','COLD BEER · ROOMS'],'#2a2230','#f2c84a',1.8,.5,x,TOWN+2.55,7.73,0);
    [-3.6,-1.2,1.2,3.6].forEach(a=>{lampHead(x+a,TOWN+5.5,7.6,.12);});halo(x,TOWN+2.4,7.9,4.4);halo(x,TOWN+5,7.9,4);
    benchS(x-4,8.0);benchS(x+4,8.0);SHOPS.push({x,w,kind:'pub',name:NM.pub,trim});}
  // the servo: a canopy over two pumps on the forecourt, a little shop behind
  {const x=1675.5,trim=pick(['#e2584f','#2f8a8a','#f08a3a']);
    const g=bld({x:1679.5,z:2.8,w:7,d:4.4,h:3,base:'#f4f0e6',kind:'plaster',seed:C.seed+31,roof:false,parapet:trim,front:{win:2,door:true,doorAt:.3,doorCol:trim,winW:40,winH:36},side:{win:0}});
    [[-4.6,3.4],[1.6,3.4],[-4.6,7.2],[1.6,7.2]].forEach(([a,b])=>pc(.14,.14,4,'metal','#e8e8e2',x+a,TOWN+2,b,{seg:8}));
    pb(7.6,.5,5,'paint',trim,x-1.5,TOWN+4.2,5.3);pb(7.4,.06,4.8,'paint','#f4f0e6',x-1.5,TOWN+3.93,5.3);signP([NM.servo.toUpperCase()],trim,'#ffffff',4,.4,x-1.5,TOWN+4.2,7.82,0);
    [[-3.1],[0.1]].forEach(([a])=>{const pg=grp(x+a,TOWN,5.3);pb(.9,.18,1.6,'metal','#9aa0a6',0,.09,0,{par:pg});pb(.5,1.4,.5,'paint','#f4f0e6',0,.85,0,{par:pg});pb(.52,.3,.52,'paint',trim,0,1.45,0,{par:pg});pb(.3,.24,.02,'glass','#2a3a4a',0,1.0,.26,{par:pg});col(x+a-.3,4.6,x+a+.3,6);});
    [-4.4,-1.5,1.4].forEach(a=>{lampHead(x+a,TOWN+3.86,5.3,.2);halo(x+a,TOWN+3.4,5.3,3.6);});
    {const pg=grp(1684.6,TOWN,7.6);pc(.08,.08,4,'metal','#9aa0a6',0,2,0,{par:pg});pb(1.3,1.6,.15,'paint',trim,0,4.4,0,{par:pg});signP(['FUEL','ULP 1.89','DSL 1.95'],trim,'#ffffff',1.1,1.3,0,4.4,.08,0,pg);col(1684.5,7.5,1684.7,7.7);}
    SHOPS.push({x:1679.5,w:7,kind:'servo',name:NM.servo,trim});}
  // the town hall (brick, gable front with the name) and its little flagpole
  {const x=1691.5,g=bld({x,z:3.2,w:9,d:5.6,h:3.6,base:'#c87058',kind:'brick',seed:C.seed+51,front:{win:2,door:true,doorAt:.5,doorCol:'#3a2a22',winW:22,winH:40,arch:true},roofBase:'#7a7e86',rise:1.8});
    pb(9.2,.3,.3,'paint','#f4ecd8',0,3.7,2.8,{par:g});signP([UP+' HALL'],'#f4ecd8','#5a3a22',3.6,.42,x,TOWN+3.05,6.03,0);signP(['1911'],'#f4ecd8','#5a3a22',.8,.3,x,TOWN+4.6,5.0,0);
    pb(2.4,.5,1,'stone','#c8c2b4',x,TOWN+.25,6.6);col(x-1.2,6.1,x+1.2,7.1);lampHead(x-2,TOWN+2.8,6.0,.14);lampHead(x+2,TOWN+2.8,6.0,.14);halo(x,TOWN+2.6,6.5,3.2);
    // a notice board for the town hall target
    {const nb=grp(x+3.4,TOWN,7.4);[-.5,.5].forEach(a=>pb(.08,1.6,.08,'wood','#7a4a2a',a,.8,0,{par:nb}));pb(1.2,.8,.06,'wood','#9a6a3e',0,1.3,0,{par:nb});signP(['MARKET SAT','QUIZ NIGHT','LOST: CAT'],'#f4f0e6','#2a2230',1.0,.62,0,1.3,.04,0,nb);col(x+2.8,7.3,x+4,7.5);}}
  // street lamps, a few benches, street trees, bins, a bus shelter
  for(let lx=1606;lx<1698;lx+=13){lamp(lx,8.15);lamp(lx+6.5,12.7);}
  [1612,1655,1686].forEach(x=>benchS(x,13.8,Math.PI));
  // the beach / riverside path between the shops
  pb(.12,1,.12,'wood','#7a4a2a',1636.2,TOWN+.5,1);pb(.12,1,.12,'wood','#7a4a2a',1643.8,TOWN+.5,1);signP([COAST?'BEACH ACCESS':'RIVER WALK'],'#3e7d5c','#f4f0e6',1.4,.3,1636.2,TOWN+1.15,1.1,0);
  // the town sign at the west entrance (both sides)
  {const g=grp(1604.6,TOWN,15.6,.25);[-1.4,1.4].forEach(a=>pb(.18,1.6,.18,'wood','#7a4a2a',a,.8,0,{par:g}));pb(3.4,1.2,.14,'wood','#9a6a3e',0,1.6,0,{par:g});
    signP(['WELCOME TO',UP],'#3e7d5c','#f4f0e6',3.1,1.0,0,1.6,.08,0,g);const b=signP(['THANK YOU FOR','VISITING '+UP],'#3e7d5c','#f4f0e6',3.1,1.0,0,1.6,-.08,Math.PI,g);
    [-1.6,-.8,0,.8,1.6].forEach(a=>bush(1604.6+a,16.2,.6));col(1603,15.3,1606.2,15.9);}
  // the memorial clock on the green, benches and flower beds round it
  const clockFaces=[];
  {const x=1687.5,z=20,y=TOWN;pb(2.2,.4,2.2,'stone','#b8b0a0',x,y+.2,z);pb(1.4,.8,1.4,'stone','#c8c2b4',x,y+.8,z);pb(.9,3.4,.9,'stone','#d8d0c0',x,y+2.9,z);
    const fc=(()=>{const[c,xx]=cvs(26,26);P(xx,'#3a3e44',0,0,26,26);xx.fillStyle='#f4f0e6';xx.beginPath();xx.arc(13,13,11,0,7);xx.fill();for(let k=0;k<12;k++){const a=k/12*6.283;P(xx,'#2a2230',13+Math.cos(a)*9.5,13+Math.sin(a)*9.5,1,1);}P(xx,'#2a2230',12,4,2,10);P(xx,'#2a2230',13,12,7,2);return c;})();
    const fm=new THREE.MeshLambertMaterial({map:ctex(fc),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(fc)});PXB_GLOW.push(fm);
    [[0,.47,0],[0,-.47,Math.PI],[.47,0,Math.PI/2],[-.47,0,-Math.PI/2]].forEach(([a,b,ry])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.8,.8),fm);m.position.set(x+a,y+4,z+b);m.rotation.y=ry;fin(m);});
    pb(1.1,.16,1.1,'stone','#b8b0a0',x,y+4.68,z);const cap=new THREE.Mesh(new THREE.ConeGeometry(.7,.9,4),tex('tin','#5a7a6a',2,1));cap.rotation.y=Math.PI/4;cap.position.set(x,y+5.2,z);fin(cap);
    signP(['IN MEMORY OF','THE PIONEERS'],'#c8c2b4','#3a2a22',.9,.4,x,y+.85,z+.71,0);col(x-1.1,z-1.1,x+1.1,z+1.1);
    [[x-6,z],[x+6,z],[x,z+4.6]].forEach(([a,b],i)=>benchS(a,b,i===2?Math.PI:(i?-Math.PI/2:Math.PI/2)));
    for(let k=0;k<10;k++){const a=k/10*6.283;bush(x+Math.cos(a)*2.9,z+Math.sin(a)*2.9,.5);}
    pc(.05,.06,6,'metal','#e8e8e2',x+8,y+3,z-4.2,{seg:6});pb(1.1,.66,.02,'paint','#2f6fb0',x+8.56,y+5.6,z-4.2);col(x+7.9,z-4.3,x+8.1,z-4.1);
    lamp(x-4,z-4.6);lamp(x+4,z+4.6);gum(1680,24.8);gum(1696,15.6);}

  // ===== the car park with Kip's hire car =====
  {const[x,z]=K.van;const g=grp(x,TOWN,z,Math.PI/2);
    pb(2.0,.42,1.0,'paint','#e2584f',0,.42,0,{par:g});pb(1.2,.36,.92,'paint','#e2584f',-.1,.8,0,{par:g});pb(1.22,.26,.94,'glass','#2a3a4a',-.1,.82,0,{par:g});pb(1.1,.06,.88,'paint','#e2584f',-.1,1.0,0,{par:g});
    [[-.62,1],[.62,1],[-.62,-1],[.62,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.14,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.19,s*.5);fin(w,g);});
    lampHead(1.01,.5,.32,.08,g);lampHead(1.01,.5,-.32,.08,g);col(x-.55,z-1.05,x+.55,z+1.05);signP(['KIP’S HIRE CAR'],'#2f6fb0','#ffffff',1.2,.22,x,TOWN+1.45,z,0);}
  const ute=(x,z,ry,c)=>{const g=grp(x,TOWN,z,ry);pb(2.3,.45,1.0,'paint',c,0,.48,0,{par:g});pb(.95,.42,.92,'paint',c,.48,.9,0,{par:g});pb(.97,.32,.94,'glass','#2a3a4a',.48,.94,0,{par:g});pb(1.05,.06,.98,'metal','#3a3e44',-.62,.72,0,{par:g});
    [[.7,1],[-.7,1],[.7,-1],[-.7,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.16,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.22,s*.5);fin(w,g);});return g;};
  [[1654.3,17,'#f4f0e6'],[1666.9,17,'#2a2a30'],[1669.5,20.8,'#9aa4ac'],[1656.9,20.8,'#c8344a']].forEach(([x,z,c],i)=>{if(R()<.8){ute(x,z,Math.PI/2,c);col(x-.55,z-1.2,x+.55,z+1.2);}});
  signP(['P','CAR PARK'],'#2f6fb0','#ffffff',.7,.6,1652.6,TOWN+1.5,14.6,0);pb(.06,1.3,.06,'metal','#9aa0a6',1652.6,TOWN+.65,14.58);
  // a car parked at the kerb or two
  ute(1622,9.6,Math.PI/2*0+0,'#3e7d5c');ute(1688,11.2,Math.PI,'#f4f0e6');

  // ===== the holiday park: reception + boom gate, powered sites, two cabins, camp kitchen, BBQ and picnic area =====
  {// low timber fence round the park, an arch over the entry road
    const fence=(x1,z1,x2,z2)=>{const L=Math.hypot(x2-x1,z2-z1),n=Math.ceil(L/2.4);for(let k=0;k<=n;k++){const x=x1+(x2-x1)*k/n,z=z1+(z2-z1)*k/n;if(Math.abs(x-1630)<2&&z<15)continue;pb(.1,.7,.1,'wood','#7a4a2a',x,TOWN+.35,z);}
      const m=pb(L,.08,.06,'wood','#9a6a3e',(x1+x2)/2,TOWN+.55,(z1+z2)/2,{ry:-Math.atan2(z2-z1,x2-x1)});return m;};
    fence(1603,14.6,1627.6,14.6);fence(1632.4,14.6,1650.4,14.6);fence(1603,14.6,1603,41.6);fence(1650.4,14.6,1650.4,41.6);fence(1603,41.6,1650.4,41.6);
    [1627.8,1632.2].forEach(a=>pb(.24,3.4,.24,'wood','#7a4a2a',a,TOWN+1.7,14.6));pb(5,.7,.2,'wood','#9a6a3e',1630,TOWN+3.3,14.6);signP([NM.park.toUpperCase()],'#3e7d5c','#f4f0e6',4.6,.56,1630,TOWN+3.3,14.72,0);
    const b2=signP([NM.park.toUpperCase()],'#3e7d5c','#f4f0e6',4.6,.56,1630,TOWN+3.3,14.48,Math.PI);
    col(1627.65,14.45,1627.95,14.75);col(1632.05,14.45,1632.35,14.75);}
  // reception with a kiosk, the boom gate
  {const g=bld({x:1622,z:17.6,w:8,d:4.2,h:3,base:'#f2e2a8',kind:'board',seed:C.seed+61,front:{win:2,door:true,doorAt:.7,doorCol:'#3e7d5c',winW:30,winH:28},back:{win:2},roofBase:'#3e7d5c',rise:1.1});
    verandah(g,8.2,1.4,2.5,2.1,{post:'#f4f0e6',roof:'#c8ccd0',fascia:'#3e7d5c'});signP(['RECEPTION · KIOSK'],'#3e7d5c','#f4f0e6',2.6,.34,1622,TOWN+3.2,15.45,Math.PI);signP(['RECEPTION'],'#3e7d5c','#f4f0e6',1.6,.3,1622,TOWN+2.75,19.75,0);
    lampHead(1620,TOWN+2.4,19.75,.12);lampHead(1624,TOWN+2.4,19.75,.12);halo(1622,TOWN+2.2,20.3,3);}
  const boom=(()=>{pb(.4,1.0,.4,'paint','#f2c84a',1631.6,TOWN+.5,16.6);col(1631.4,16.4,1631.8,16.8);const g=grp(1631.6,TOWN+.95,16.6);const a=pb(3.2,.1,.1,'stripe','#c9473f|#f4f0e6',-1.6,0,0,{par:g});return g;})();
  // powered sites
  const powerPost=(x,z,lit)=>{pb(.18,.9,.14,'paint','#3e7d5c',x,TOWN+.45,z);pb(.2,.12,.16,'paint','#2a5a3a',x,TOWN+.92,z);if(lit){lampHead(x,TOWN+1.05,z,.1);halo(x,TOWN+1,z,1.8);}col(x-.1,z-.08,x+.1,z+.08);};
  const caravan=(x,z,c)=>{const g=grp(x,TOWN,z);const L=4.2,W=2.0,H=1.8;const sk=(()=>{const[cc,xx]=cvs(L*PPM,H*PPM);P(xx,'#f4f0e6',0,0,cc.width,cc.height);P(xx,c,0,cc.height*.52,cc.width,6);P(xx,sh(c,.7),0,cc.height*.52+6,cc.width,2);
      [[.4,1.2],[2.6,1.0]].forEach(([a,w])=>{P(xx,'#2a3a4a',a*PPM,10,w*PPM,16);P(xx,'#4a6a80',a*PPM+2,12,w*PPM-4,3);});P(xx,'#c8c2b4',1.9*PPM,12,18,cc.height-14);P(xx,'rgba(0,0,0,.25)',0,cc.height-1,cc.width,1);return new THREE.MeshLambertMaterial({map:ctex(cc)});})();
    const end=tex('paint','#f4f0e6',W,H);const b=new THREE.Mesh(new THREE.BoxGeometry(L,H,W),[end,end,flat('#e8e8e2'),flat('#9aa0a6'),sk,sk]);b.position.y=.42+H/2;fin(b,g);
    pb(L-.2,.12,W-.2,'paint','#e8e8e2',0,.42+H+.06,0,{par:g});[1,-1].forEach(s=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.18,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(.3,.3,s*(W/2-.05));fin(w,g);});
    pb(1.2,.08,.08,'metal','#3a3e44',-L/2-.6,.45,0,{par:g});const aw=pb(L-.4,.04,2.2,'stripe',c+'|#f4f0e6',0,2.05,W/2+1.1,{par:g});aw.rotation.x=.16;[-1,1].forEach(s=>pc(.025,.025,1.9,'metal','#c8ccd0',s*(L/2-.4),.95,W/2+2.1,{par:g}));
    pb(3.2,.02,1.8,'stripe','#2f6a74|#4e8a94',0,.02,W/2+1.2,{par:g});col(x-L/2-1.3,z-W/2,x+L/2,z+W/2);chair(x-.8,z+W/2+1.3,pick(TRIMS),.3);chair(x+.6,z+W/2+1.4,pick(TRIMS),-.3);lampHead(L/2-.3,1.95,W/2+.02,.1,g);return g;};
  const campervan=(x,z,c)=>{const g=grp(x,TOWN,z);const L=4.4,W=1.8;pb(L,1.5,W,'paint','#f4f0e6',0,1.0,0,{par:g});pb(L,.32,W+.01,'paint',c,0,.7,0,{par:g});pb(.06,.6,1.6,'glass','#2a3a4a',L/2,1.3,0,{par:g});pb(1.2,.45,.04,'glass','#2a3a4a',-.6,1.3,W/2+.01,{par:g});pb(2.4,.3,1.4,'paint','#e8e8e2',-.4,1.9,0,{par:g});
    [[1.4,1],[-1.4,1],[1.4,-1],[-1.4,-1]].forEach(([a,s])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.18,10),flat('#24262a'));w.rotation.x=Math.PI/2;w.position.set(a,.3,s*(W/2-.05));fin(w,g);});
    const aw=pb(2.6,.04,1.6,'stripe',c+'|#f4f0e6',-.4,1.9,W/2+.8,{par:g});aw.rotation.x=.18;chair(x-.6,z+W/2+1,pick(TRIMS),.2);col(x-L/2,z-W/2,x+L/2,z+W/2);return g;};
  let fire=null;
  const tent=(x,z,c)=>{const g=grp(x,TOWN,z);const m=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,6,0,Math.PI*2,0,Math.PI/2),tex('paint',c,4,2));m.scale.set(1.2,.85,1);fin(m,g);const fly=new THREE.Mesh(new THREE.CircleGeometry(.45,10,0,Math.PI),flat('#2a2230'));fly.position.set(0,0,1.0);fin(fly,g);
    col(x-1.2,z-1,x+1.2,z+1);chair(x+1.6,z+1,'#f2c84a',-.4);const ring=grp(x-1.8,TOWN,z+1.2);for(let a=0;a<6.28;a+=.8)pc(.08,.1,.12,'stone','#8a8a8a',Math.cos(a)*.32,.06,Math.sin(a)*.32,{par:ring});
    fire=new THREE.Mesh(new THREE.ConeGeometry(.16,.4,5),new THREE.MeshBasicMaterial({color:'#f8a040'}));fire.position.set(x-1.8,TOWN+.25,z+1.2);fire.__pxSkip=1;G.add(fire);halo(x-1.8,TOWN+.4,z+1.2,2.4,null,0xff9040);return g;};
  const CC=['#2f6fb0','#3e7d5c','#e2584f','#2f8a8a','#9478d4','#f08a3a'];
  SITES.forEach(([x,z],i)=>{powerPost(x+2.3,z-1.6,i%2===0);const k=(C.seed+i*7)%5;if(k<2)caravan(x+.3,z-.6,CC[(C.seed+i)%6]);else if(k<4)campervan(x,z-.4,CC[(C.seed+i+2)%6]);else if(!fire)tent(x,z,'#f2c84a');else caravan(x+.3,z-.6,CC[i%6]);shade(x,z,2.6,1.3,.6);});
  // two cabins to rent
  CAB.forEach((c,i)=>{const base=['#cfe0e8','#e8dcc0','#f2e2a8','#c9d8c0'][(C.seed+i)%4],dc=TRIMS[(C.seed+i*2)%TRIMS.length];
    const g=bld({x:c.x,z:c.z,w:5,d:3.6,h:2.5,base,kind:'board',seed:C.seed+70+i,front:{win:1,door:true,doorAt:.66,doorCol:dc,winW:26,winH:24},back:{win:1},side:{win:1},roofBase:'#8a9aa4',rise:.9});
    verandah(g,5.2,1.3,2.2,1.8,{post:'#f4f0e6',roof:'#c8ccd0',fascia:dc});signP(['CABIN '+(i+1)],dc,'#ffffff',.9,.24,c.x-1.2,TOWN+2.0,c.z+3.13,0);lampHead(c.x+1.4,TOWN+2.05,c.z+1.84,.1);halo(c.x+1.4,TOWN+1.9,c.z+2.4,2.2);
    chair(c.x-1.4,c.z+2.6,dc,.2);chair(c.x-.4,c.z+2.6,dc,-.2);});
  // camp kitchen: an open shelter with sinks, a long table and two BBQs; the picnic lawn next to it
  {const x=1622,z=37.8,g=grp(x,TOWN,z);[[-3.6,-1.6],[3.6,-1.6],[-3.6,1.6],[3.6,1.6],[0,-1.6],[0,1.6]].forEach(([a,b])=>pb(.16,2.6,.16,'wood','#7a4a2a',a,1.3,b,{par:g}));
    gable(g,7.6,3.6,2.6,{roofBase:'#3e7d5c',rise:.9,base:'#f4f0e6',kind:'board'});pb(3,.9,.6,'metal','#c8ccd0',-1.8,.45,-1.3,{par:g});pb(3,.06,.6,'metal','#e8e8e2',-1.8,.92,-1.3,{par:g});
    pb(3.4,.06,.9,'wood','#9a6a3e',1.4,.74,.4,{par:g});[0,1].forEach(s=>pb(3.4,.06,.3,'wood','#9a6a3e',1.4,.44,s?1.05:-.25,{par:g}));
    signP(['CAMP KITCHEN'],'#3e7d5c','#f4f0e6',1.8,.3,x,TOWN+2.4,z+1.9,0);lampHead(x,TOWN+2.45,z,.16);halo(x,TOWN+2.2,z,4);col(x-3.8,z-1.8,x+3.8,z-.9);col(x-.4,z,x+3.2,z+1.3);}
  bbq(1638.5,37.8,true);bbq(1645.5,37.8,false);picnic(1641.8,35.4);picnic(1646.5,40,0.2);picnic(1636,40.4,-.1);
  [[1605,17],[1605,26],[1605,39.6],[1648.4,26.2],[1615.6,40.4],[1634,40.8],[1611.5,26.4],[1648.4,17.4]].forEach(([x,z])=>gum(x,z,.8+R()*.4));
  for(let k=0;k<14;k++)tuft(1604+R()*45,15+R()*26);

  // ===== houses behind the green: weatherboard cottages with tin roofs and picket fences =====
  [[1660,33.2],[1675.3,33.6],[1690.6,33.2]].forEach(([x,z],i)=>{const[b]=WALLS[(C.seed+i*5+2)%WALLS.length],dc=TRIMS[(C.seed+i)%TRIMS.length];
    const g=bld({x,z,w:7.2,d:5.4,h:2.8,base:b,kind:'board',seed:C.seed+80+i,front:{win:2,door:true,doorAt:.5,doorCol:dc,winW:26,winH:24},back:{win:2},roofBase:pick(['#8a3a2a','#5a6a7a','#8a9aa4','#a8303a']),rise:1.4});
    verandah(g,7.4,1.5,2.3,2.7,{post:'#f4f0e6',roof:'#c8ccd0',fascia:'#f4f0e6'});
    for(let k=0;k<12;k++){const fx=x-3.7+k*.66;if(Math.abs(fx-x)<.6)continue;pb(.08,.7,.06,'paint','#f4f0e6',fx,TOWN+.35,z+5.1);}pb(7.6,.06,.04,'paint','#f4f0e6',x,TOWN+.58,z+5.1);
    pb(.6,1.0,.4,'paint','#3e7d5c',x+3.2,TOWN+.5,z+5.4);bush(x-2.6,z+4.4);bush(x+2,z+4.4);gum(x+5.4,z-1.2);if(i===1)ute(x+6.6,z+2.6,0,'#c8344a');});

  // ===== the setting: beach + jetty + foreshore BBQs (coast) or river + footbridge + bush (inland) =====
  const rods=[];
  if(COAST){
    // the jetty: timber deck on piles, rails, a lamp at the end, a fishing bench
    const L=-4.5-JZ,cz=(-4.5+JZ)/2;pb(JX1-JX0,.14,L,'deck','#a8875a',1640,DECK-.07,cz);
    for(let z=-6;z>JZ;z-=3)[JX0+.1,JX1-.1].forEach(x=>{const y0=hT(x,z);pc(.12,.12,DECK-y0+.4,'wood','#6a5236',x,(DECK+y0-.4)/2,z,{seg:6});});
    [JX0+.05,JX1-.05].forEach(x=>{for(let z=-5;z>JZ;z-=2.5)pb(.08,.9,.08,'wood','#7a5a3a',x,DECK+.45,z);pb(.06,.06,L,'wood','#9a7a52',x,DECK+.9,cz);});
    pc(.06,.08,3,'metal','#5a5e64',JX1-.2,DECK+1.5,JZ+.6,{seg:6});lampHead(JX1-.2,DECK+3.05,JZ+.6,.18);halo(JX1-.2,DECK+2.9,JZ+.6,3.2);
    const ff=(x,z,face)=>{const m=person(x,z,{y:DECK,hat:'#f3e2b0'});if(face)m.scale.x=face;const line=new THREE.Mesh(new THREE.BoxGeometry(.02,1.6,.02),flat('#e8e8e2'));line.position.set(x+.9*(face||1),DECK+.2,z-.9);line.rotation.z=.4*(face||1);line.__pxSkip=1;G.add(line);rods.push({line,y:line.position.y,ph:R()*6});};
    ff(1639.4,JZ+1.4,-1);
    for(let z=Math.floor(shoreZ(1640));z>JZ;z-=1)col(JX0-.4,z,JX0,z+1),col(JX1,z,JX1+.4,z+1);
    // foreshore: BBQ shelters, picnic tables, a beach shower, Norfolk pines and dune bushes
    bbq(1614,-2.2,true);bbq(1666,-2.2,true);picnic(1620,-2.4);picnic(1660,-2.6);picnic(1674,-2.2,.2);
    {pc(.06,.06,2.4,'metal','#c8ccd0',1646.5,TOWN+1.2,-3.6,{seg:6});pb(.5,.06,.06,'metal','#c8ccd0',1646.5,TOWN+2.4,-3.4);pb(1,.06,1,'wood','#9a7a52',1646.5,TOWN+.03,-3.6);col(1646.4,-3.7,1646.6,-3.5);}
    [1606,1626,1652,1680,1694].forEach(x=>NORTHT||R()<.6?pine(x,-3.4):gum(x,-3.2,.8));for(let k=0;k<22;k++){const x=1603+R()*94;if(Math.abs(x-1640)<3)continue;bush(x,-5.4+R()*.8,.6+R()*.4);}
    benchS(1632,-1.2,0);benchS(1650,-1.2,0);
    // beach umbrellas and towels
    [[1612,-9.5,'#e2584f'],[1622,-10.4,'#2f8a8a'],[1658,-9.2,'#f2c84a'],[1676,-10.2,'#9478d4']].forEach(([x,z,c])=>{const y=hT(x,z);pc(.03,.03,1.8,'metal','#e8e8e2',x,y+.9,z,{seg:5});const u=new THREE.Mesh(new THREE.ConeGeometry(1.1,.4,8),tex('stripe',c+'|#f4f0e6',3,1));u.position.set(x,y+1.8,z);fin(u);
      const tw=pb(1.6,.02,.7,'stripe',c+'|#f4f0e6',x+1.2,y+.03,z+.5);});
    // a dinghy pulled up on the sand
    {const x=1690,z=shoreZ(1690)+2.4,y=hT(x,z),g=grp(x,y,z,.4);pb(2.6,.4,1.1,'paint','#f4f0e6',0,.2,0,{par:g});pb(2.62,.1,1.12,'paint','#2f6fb0',0,.42,0,{par:g});pb(.3,.04,1,'wood','#9a7a52',0,.38,0,{par:g});col(x-1.2,z-.6,x+1.2,z+.6);}
  }else{
    // the footbridge: timber deck on two trusses, handrails
    const c0=rz(1640);for(let k=-10;k<=10;k++){const z=c0+k*.52,y=K.h(1640,z);pb(JX1-JX0+.3,.1,.5,'deck','#a8875a',1640,y-.05,z);if(k%2===0)[JX0,JX1].forEach(x=>{pb(.08,.9,.08,'wood','#7a5a3a',x,y+.45,z);});}
    [JX0,JX1].forEach(x=>{for(let k=-10;k<10;k++){const z1=c0+k*.52,z2=z1+.52,y1=K.h(1640,z1),y2=K.h(1640,z2),m=pb(.06,.06,.56,'wood','#9a7a52',x,(y1+y2)/2+.9,(z1+z2)/2);m.rotation.x=-Math.atan2(y2-y1,.52);}
      [-3.2,3.2].forEach(dz=>pc(.14,.14,1.4,'wood','#6a5236',x,-.2,c0+dz,{seg:6}));});
    for(let k=-10;k<=10;k++){const z=c0+k*.52;col(JX0-.5,z-.26,JX0-.02,z+.26);col(JX1+.02,z-.26,JX1+.5,z+.26);}
    signP(['RIVER WALK TRAIL · 2 km'],'#6a4a2a','#f4f0e6',1.8,.3,1643.4,TOWN+1.2,-8.4,0);pb(.08,1.2,.08,'wood','#6a4a2a',1643.4,TOWN+.6,-8.42);
    // a fishing platform on the near bank, a canoe on the grass
    {const x=1668,z=rz(1668)+3.9;pb(2.4,.12,1.8,'deck','#a8875a',x,TOWN-.4,z);[[-1.1,-.8],[1.1,-.8]].forEach(([a,b])=>pc(.1,.1,1.4,'wood','#6a5236',x+a,-.3,z+b,{seg:6}));
      [-1.15,1.15].forEach(a=>pb(.06,.06,1.8,'wood','#9a7a52',x+a,TOWN+.2,z));const m=person(x-.6,z+.3,{y:TOWN-.34,hat:'#3e7d5c'});const line=new THREE.Mesh(new THREE.BoxGeometry(.02,1.6,.02),flat('#e8e8e2'));line.position.set(x-.1,TOWN-.1,z-.9);line.rotation.x=-.5;line.__pxSkip=1;G.add(line);rods.push({line,y:line.position.y,ph:1});}
    {const x=1622,z=rz(1622)+5.2,y=hT(x,z),g=grp(x,y,z,.15);pb(3,.3,.7,'paint','#e2584f',0,.15,0,{par:g});pb(2.2,.06,.5,'paint','#2a2230',0,.31,0,{par:g});col(x-1.5,z-.4,x+1.5,z+.4);}
    // riverside park: BBQ shelters, picnic tables; bush on the far bank
    bbq(1614,-3.2,true);bbq(1664,-3.6,true);picnic(1620,-3.2);picnic(1656,-3.6);picnic(1676,-3.4,.2);benchS(1632,-6.6,0);benchS(1650,-6.6,0);
    [1606,1628,1652,1684,1696].forEach(x=>gum(x,-1.2,1.1));for(let k=0;k<12;k++){const x=1603+R()*94;if(Math.abs(x-1640)<3)continue;bush(x,-8.4+R()*1.6,.7);}
    for(let k=0;k<46;k++){const x=1600+R()*100,z=-22-R()*20;if(Math.abs(x-1640)<2.4&&z>-24)continue;(R()<.62?gum:bush)(x,z,R()<.62?1+R()*.6:.8+R()*.6);}
    for(let k=0;k<14;k++)tuft(1603+R()*94,-9-R()*1.2);
  }
  // bush and trees at the edges
  for(let k=0;k<10;k++){const x=1600+R()*100,z=43+R()*3;gum(x,z,1+R()*.5);}
  for(let k=0;k<8;k++)bush(1652+R()*46,26.4+R()*.6,.7);

  // ===== people =====
  function person(x,z,o){o=o||{};const v={skin:pick(SK),hair:pick(HR),shirt:o.shirt||pick(SH),pants:pick(['#2f3b5c','#c9b68a','#3e7d5c','#2a2a30','#5cc6d8']),hat:o.hat===undefined?(R()<.35?pick(['#f3e2b0','#f4f0e6','#2f6fb0']):null):o.hat};
    const m=spriteMesh(humanFrames(v),o.kid?.66:.95,o.kid?1.1:1.58);m.position.set(x,o.y==null?K.h(x,z):o.y,z);m.__pxSkip=1;G.add(m);return m;}
  const walkers=[];const walker=(pts,o)=>{const m=person(pts[0][0],pts[0][1],o);walkers.push({m,pts,i:0,f:1,sp:.8+R()*.4,wait:R()*3,t:R()*9});};
  walker([[1604,7.6],[1697,7.6]]);walker([[1696,13.4],[1605,13.4]],{hat:'#f4f0e6'});walker([[1640,13.4],[1640,7.4],[1660,7.4]]);walker([[1630,15],[1630,27.5],[1608,27.5]]);walker([[1620,27.5],[1646,27.5]],{kid:1});
  walker([[1687.5,15],[1687.5,25.5]]);walker([[1640,4],[1640,-3],[1620,-1.5]]);
  if(COAST){walker([[1606,shoreZ(1606)+2],[1694,shoreZ(1694)+2.4]]);walker([[1640,-6],[1640,JZ+3]]);}else{walker([[1640,-6],[1640,rz(1640)-7],[1610,-26]]);walker([[1604,-5.2],[1696,-5.6]]);}
  const kids=[];[[1614,24],[1660,-1]].forEach(([x,z])=>{const k=person(x,z,{kid:1,hat:null});kids.push({m:k,x0:x,z0:z,r:1.6+R(),t:R()*9,sp:.8+R()*.4});});
  const swim=[];if(COAST)[[1616,2.6],[1630,3.4],[1652,2],[1670,3.6]].forEach(([x,dd],i)=>{const z=shoreZ(x)-dd;const m=person(x,z,{kid:i%2===0,hat:null});m.position.y=hT(x,z)+.1;swim.push({m,base:m.position.y,ph:R()*6});});
  {const sitter=(skin,hair,shirt,shorts)=>{const P2=painter(22,24),Sk=RAMP(skin),Hr=RAMP(hair,4),Sh=RAMP(shirt),Sd=RAMP(shorts,4);P2.ell(11,20,7,3.6,Sd);P2.ell(11,14.5,6,6.5,Sh);P2.ell(4.4,15,1.8,4,Sk);P2.ell(17.6,15,1.8,4,Sk);P2.ell(11,6.5,4.4,4.4,Hr);return P2.done();};
    [[1607.6,24.6],[1622.7,33.8],[1646.6,33.8],[1650,8.6],[1617.5,8.6]].forEach(([x,z])=>{const m=spriteMesh([sitter(pick(SK),pick(HR),pick(SH),'#2f3b5c')],.62,.68);m.position.set(x,TOWN+.4,z);m.__pxSkip=1;G.add(m);});}

  // ===== things to do =====
  const ITEMS=['a chipped teapot with roses on it','a paperback with a sandy cover','a knitted beanie','a tin toy kangaroo','a cassette of 80s hits','a souvenir spoon from '+N];
  const BUY={bakery:[5,22,['a hot meat pie with sauce','a sausage roll and a vanilla slice','a pasty and a lamington']],cafe:[6,18,['a flat white and a toastie','a long black and a banana bread','an iced coffee and a scone']],
    store:[4,12,['a choc-top ice-cream','a bag of mixed lollies','a cold milk and an apple']],pub:[14,34,['a counter meal: fish and chips with salad','a steak sandwich with chips','a chicken parmi as big as the plate']],
    fish:[10,28,['fish and chips with a squeeze of lemon','a seafood basket','two pieces of fish and a scoop of chips']],servo:[4,10,['a cold drink and a sausage roll','a coffee from the machine and a muffin']]};
  K.targets=T=>{
    SHOPS.forEach(s=>{const z=s.kind==='servo'?5.4:7.1,x=s.kind==='servo'?1680.5:s.x;
      if(s.kind==='op'){T.push({x,z,r:1.3,label:s.name+' · rummage for a treasure (3 coins)',act:()=>{if(!pay(3))return;const it=pick(ITEMS);toast('Kip found '+it+'!',2.6);say(['Volunteer: Ooh, good eye, love. That’s been waiting for the right person.']);}});return;}
      if(s.kind==='hard'){T.push({x,z,r:1.3,label:s.name+' · bait for fishing (2 coins)',act:()=>{if(!pay(2))return;say(['Shopkeeper: Fresh worms and a bit of prawn. The bream are biting by the bridge, mate.']);}});return;}
      const b=BUY[s.kind];if(!b)return;T.push({x,z,r:1.3,label:s.name+' · '+(s.kind==='pub'?'counter meal':s.kind==='store'?'ice-cream and snacks':s.kind==='servo'?'snacks and a drink':s.kind==='fish'?'fish and chips':s.kind==='cafe'?'coffee and a bite':'pies and cakes')+' ('+b[0]+' coins)',
        act:()=>{if(!pay(b[0]))return;popText('Yum!',{x:player.x,y:2.4+TOWN,z:player.z});eat(b[1],pick(b[2]));S.rtnBuy=(S.rtnBuy||0)+1;}});});
    T.push({x:1695,z:7.5,r:1.2,label:'Read the town hall notice board',act:()=>say([UP+' TOWN HALL · What’s on: Saturday market on the green, quiz night at the pub, footy at the oval on Sunday.','Someone has pinned a note: “Lost: ginger cat called Biscuit. Likes ham.”'])});
    T.push({x:1687.5,z:21.5,r:1.4,label:'Read the plaque on the memorial clock',act:()=>say(['IN MEMORY OF THE PIONEERS OF '+UP+'. The clock was put up by the townspeople in 1911.','Kip: It still keeps good time. Nearly.'])});
    T.push({x:1622,z:20.3,r:1.3,label:NM.park+' reception · a cold drink from the kiosk (3 coins)',act:()=>{if(!pay(3))return;eat(8,'a cold drink from the park kiosk');say(['Manager: Welcome to '+NM.park+'! Cabins are up the road, the camp kitchen is out the back. Checkout’s ten.']);}});
    CAB.forEach((cb,i)=>T.push({x:cb.x+.8,z:cb.z+2.6,r:1.3,label:'Rent a cabin for the night (30 coins)',act:()=>{if(!pay(30))return;fadeDo(()=>{if((S.time%1440)>=OPEN){S.time=1440+OPEN+20;newDay();}else S.time=OPEN+20;S.stamina=STAM_MAX;S.stamWarn=0;player.x=cb.x+.8;player.z=cb.z+2.6;S.rtnNights=(S.rtnNights||0)+1;
      setTimeout(()=>say(['Kip sleeps like a log in cabin '+(i+1)+'. Morning: magpies, kookaburras, and the smell of someone’s bacon.','Full stamina!']),900);});}}));
    T.push({x:1622,z:39.4,r:1.6,label:'Camp kitchen · make a cuppa',act:()=>say(['Kip boils the kettle. A grey nomad couple share their biscuits.','Camper: We’ve been all round Australia, love. '+N+' is one of our favourites.'],()=>eat(6,'a cuppa and a biscuit'))});
    smoke.forEach(s=>T.push({x:s.x,z:s.z+.9,r:1.2,label:'Free BBQ · cook a sausage sizzle',act:()=>{s.boost=6;say(['Kip presses the big red button. Tick-tick-tick… sizzle!','Snags, onions, a slice of bread and a squiggle of sauce. Perfect.'],()=>eat(18,'a sausage sizzle'));S.rtnSizzle=(S.rtnSizzle||0)+1;}}));
    T.push({x:1606,z:16.6,r:1.3,label:'Read the town sign',act:()=>say(['WELCOME TO '+UP+'.','Kip: Small town, big sky. I could get used to this.'])});
    if(COAST){T.push({x:1640,z:JZ+1,r:1.6,label:'Fish off the '+N+' jetty',act:()=>startFishing({name:'the end of the '+N+' jetty'})});
      T.push({x:1684,z:shoreZ(1684)+1.2,r:1.6,label:'Beach fishing in the surf',act:()=>startFishing({name:'the beach at '+N})});
      const px=player.x,pz=player.z;if(pz<shoreZ(px)-.8&&!onJetty(px,pz))T.push({x:px,z:pz,r:1.2,label:'Swim in the clear water',act:()=>{say(['Kip floats on his back. The water is cool and clear, and a gull watches from the jetty.']);eat(4,null);}});}
    else{T.push({x:1668,z:rz(1668)+4.2,r:1.5,label:'Fish from the river platform',act:()=>startFishing({name:'the river at '+N,river:true})});
      T.push({x:1640,z:rz(1640),r:1.4,label:'Fish off the footbridge',act:()=>startFishing({name:'the footbridge at '+N,river:true})});
      T.push({x:1622,z:rz(1622)+6.2,r:1.3,label:'Look at the canoe',act:()=>say(['A red canoe rests on the grass. A sign says: HIRE AT THE PARK RECEPTION.','Kip: Maybe next time. The water looks lovely and still.'])});}
    if(!OWTRIP&&!TOUR)for(const t of T)if(/^Tour van/.test(t.label||'')){t.label='Kip’s hire car · drive back';t.act=()=>{if(typeof openWorld==='function'){OWTRIP='rtn';owTripBack();}else toast('Drive back from the outer world map',2);};}};

  // ===== the map =====
  const SR=[];SHOPS.forEach(s=>SR.push([s.x-s.w/2,.4,s.x+s.w/2,6,s.trim]));
  K.zone={rects:(COAST?[[1600,-45,1700,45,'#2490c0'],[1600,-30,1700,-12,'#3ab8cc'],[1600,-16,1700,-13,'#a2e6d6'],[1600,-14,1700,-5,'#f4eedc']]:[[1600,-45,1700,45,'#3f6a34'],[1600,-19.5,1700,-12.5,'#3a6a62'],[1600,-12.5,1700,-5,'#5e9a42']]).concat(
      [[1600,-5,1700,.4,'#6aa648'],[1600,.4,1700,8.4,'#d8ccae'],[1600,8.4,1700,12.4,'#4a4d55'],[1600,12.4,1700,14.2,'#d8ccae'],[1603,14.2,1650,41.5,'#7ab454'],[1652,14.2,1675,23.5,'#5a5d64'],[1677,14.2,1698,26,'#8cc060'],[1652,26,1698,43,'#6aa648'],
      [JX0,COAST?JZ:-21.4,JX1,COAST?-4.5:-10.6,'#8a6a4a'],[1618,15.5,1626,19.7,'#f2e2a8'],[1636,19.4,1648,23,'#cfe0e8'],[1618,36,1626,39.6,'#3e7d5c']],SR),
    labels:[[N,1650,10.4,1],[COAST?N+' Jetty':'Footbridge',1640,COAST?-22:-16,1],[COAST?'Beach':'River',1610,COAST?-9:-16,1],[NM.park,1626,30,1],['Cabins',1642,21,0],['Reception',1622,17.6,0],['Camp kitchen',1622,37.8,0],
      ['Car park · your car',1663,20,0],['Memorial clock',1687.5,22,0],[NM.pub,1650,3,0],[NM.store,1628,3,0],[NM.servo,1678,3,0],['Town hall',1691.5,3,0]]};

  // ===== animation =====
  const smokeT=(()=>{const c=mk(8,8),x=c.getContext('2d');x.fillStyle='rgba(240,240,236,.8)';x.fillRect(2,1,4,6);x.fillRect(1,2,6,4);return ctex(c);})();
  const puffs=[];for(let i=0;i<6;i++){const m=new THREE.Sprite(new THREE.SpriteMaterial({map:smokeT,transparent:true,depthWrite:false,opacity:0}));m.__pxSkip=1;m.scale.set(.3,.3,1);G.add(m);puffs.push({m,t:R()*2,s:smoke[i%smoke.length]});}
  let gF=0;
  K.tick=(dt,t)=>{const n=typeof NIGHT==='number'?NIGHT:0,h=(S.time%1440)/60,dusk=Math.max(0,Math.min(1,(h-17.4)/1.2)),k=Math.max(n,dusk*.6);
    halos.forEach(m=>m.material.opacity=k*.75);
    const gi=((t*3.2)|0)%4;if(gi!==gF){gF=gi;glint.material.map=glintT[gi];}glintT.forEach(tx=>tx.offset.set(Math.floor(t*1.5)/64,Math.floor(t*.7)/64));glint.material.opacity=(COAST?.8:.55)-n*.4;
    if(foam)foam.set(t);
    walkers.forEach(w=>{if(w.wait>0){w.wait-=dt;setFrame(w.m,0);return;}const p=w.m.position,tg=w.pts[w.i+w.f];if(!tg){w.f=-w.f;w.wait=2+R()*5;return;}
      const dx=tg[0]-p.x,dz=tg[1]-p.z,d=Math.hypot(dx,dz);if(d<.1){w.i+=w.f;if(!w.pts[w.i+w.f]){w.f=-w.f;w.wait=2+R()*6;}return;}const s=Math.min(d,w.sp*dt);p.x+=dx/d*s;p.z+=dz/d*s;p.y=K.h(p.x,p.z);w.t+=dt;setFrame(w.m,[0,1,0,2][((w.t*6)|0)%4]);});
    kids.forEach(q=>{q.t+=dt*q.sp;const p=q.m.position;p.x=q.x0+Math.cos(q.t*.7)*q.r;p.z=q.z0+Math.sin(q.t*1.4)*q.r*.5;p.y=K.h(p.x,p.z);setFrame(q.m,[0,1,0,2][((t*7)|0)%4]);});
    swim.forEach(s=>{s.m.position.y=s.base+Math.sin(t*1.3+s.ph)*.05;});rods.forEach(r=>{r.line.position.y=r.y+Math.sin(t*1.1+r.ph)*.03;});
    {const near=Math.abs(player.x-1630)<2.6&&Math.abs(player.z-16.6)<3;boom.rotation.z+=((near?-1.35:0)-boom.rotation.z)*Math.min(1,dt*3);}
    if(fire){fire.scale.set(1,.8+.4*Math.abs(Math.sin(t*7.3)),1);fire.visible=k>.2;}
    smoke.forEach(s=>{if(s.boost)s.boost=Math.max(0,s.boost-dt);});
    puffs.forEach(p=>{p.t+=dt*.6;if(p.t>1.6)p.t=0;const on=p.s&&p.s.boost>0;p.m.position.set(p.s.x+Math.sin(p.t*3)*.15,K.h(p.s.x,p.s.z)+1.0+p.t*1.2,p.s.z);p.m.material.opacity=on?(1-p.t/1.6)*.7:0;p.m.scale.setScalar(.25+p.t*.35);});};
  terrain.material.map=ctex(groundC);terrain.material.needsUpdate=true;
  if(typeof LOOK2!=='undefined'&&LOOK2.on&&typeof plant2Apply==='function'){const keep=BB.slice();BB.length=0;PLANTS.forEach(m=>BB.push(m));try{plant2Apply();}catch(e){console.error(e);}BB.length=0;keep.forEach(m=>BB.push(m));}
