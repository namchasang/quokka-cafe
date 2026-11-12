// ===== 9. suburbs, rebuilt (Paul, Nov 2026): fewer but proper houses on real lots, a designed street hierarchy, a local centre per suburb =====
// Arterial roads on a 3.5 km grid (tree-lined median, footpaths, lamps); the crossroads of each suburb gets traffic lights and a local
// centre (shops with awnings and a car park, cafés and restaurants, a medical clinic, a small hall with a clock or a flagpole, a primary
// school with a playground and an oval with goalposts and clubrooms); other crossroads are roundabouts. Inside each suburb: a curving
// collector with cul-de-sacs and roundabouts (the 1980s northern suburbs), or a street grid with rear lanes and terrace rows (the old
// inner suburbs), or a loose grid of shacks and cottages (the coast towns). Houses are the three Perth types of the ?town2 layer as
// low-poly shapes with the T2 6-tone pixel skins in one texture atlas (lit windows at night). Everything is merged per 32-unit chunk:
// the base mesh (streets, lots, house bodies and roofs, centres) is drawn far away; the detail mesh (fences, letterboxes, verandahs,
// tanks, solar panels, pools, clotheslines, garages, playgrounds, parked cars) is built only near the camera. Fictional names only.
function OWSUB(){if(typeof OW_SUB2==='undefined'||!OW_SUB2)return;if(typeof T3H==='undefined'||typeof T2==='undefined'||typeof PXK==='undefined'){console.warn('owsub: painters missing');return;}
const TS0=performance.now(),S=SOUTH,Pt=T2.P,ramp=T2.ramp,INK=T2.INK;
const hs=(a,b)=>L2hash(a*.731+3.1,b*1.917-.7);
const rnd=rng(90210),PL0=PL.length;
// ---------- 0. where things may go ----------
const BK=new Map(),BSZ=16,bk=(i,j)=>(i+500)*4001+(j+500);
const addSeg=(a,b,k)=>{if(!a||!b)return;const i0=Math.floor((Math.min(a[0],b[0])-8)/BSZ),i1=Math.floor((Math.max(a[0],b[0])+8)/BSZ),j0=Math.floor((Math.min(a[1],b[1])-8)/BSZ),j1=Math.floor((Math.max(a[1],b[1])+8)/BSZ);
  for(let i=i0;i<=i1;i++)for(let j=j0;j<=j1;j++){const q=bk(i,j);let L=BK.get(q);if(!L)BK.set(q,L=[]);L.push([a,b,k]);}};
const addPL=(P,k)=>{for(let i=1;i<P.length;i++)addSeg(P[i-1],P[i],k);};
ROADS.forEach(r=>addPL(r.p,0));if(N)N.roads.forEach(r=>addPL(r.p,0));if(S){if(S.road)addPL(S.road,0);(S.spurs||[]).forEach(s=>addSeg(s[0],s[1],0));}addPL(RAIL,1);
const rdD=(x,z,k)=>{const L=BK.get(bk(Math.floor(x/BSZ),Math.floor(z/BSZ)));let d=99;if(L)for(const s of L){if(s[2]!==k)continue;const e=segDist(x,z,s[0],s[1]);if(e<d)d=e;}return d;};
const fwD=(x,z)=>(MP&&z<WZ)?mitchD(x,z):1e9;
const TAV=TOWNS.map(t=>[t.x,t.z,{cbd:26,freo:20,air:30,sp:15,vp:15,hi:10,pin:14}[t.id]||12]);
const FQ=30,FRT=OWR2?TOWNS.find(t=>t.id==='freo'):null;O.FQ=FQ;const inFreo=(x,z,p)=>!!FRT&&Math.abs(x-FRT.x)<FQ+(p||0)&&Math.abs(z-FRT.z)<FQ+(p||0);O.inFreo=inFreo;/* Paul Nov 2026: Fremantle is one street grid, a square the suburbs keep out of */
const nearTown=(x,z,p)=>inFreo(x,z,(p||0)+1)||TAV.some(t=>Math.hypot(x-t[0],z-t[1])<t[2]+(p||0));
// the suburb ground in the city map: flat turf away from the shore, the hills, Kings Park, the airport and the towns (the old
// random holes are dropped: parks, ovals and centres now break up the houses)
const SUBm=new Uint8Array(WX*WZ),AIRP=G(115.967,-31.941);if(L2&&L2.KK)for(let z=0;z<WZ;z++)for(let x=0;x<WX;x++){const i=z*WX+x;if(!LAND[i]||L2.KK[i]!==5||DL[i]<5||elevAt(x,z)>42)continue;if(Math.hypot(x-KPP[0],z-KPP[1])<20||Math.hypot(x-AIRP[0],z-AIRP[1])<30)continue;if(fbm(x/45+11,z/45-3)<-.4)continue;SUBm[i]=1;}
const subA=(x,z)=>{if(z>=0){if(z>=WZ||x<0||x>=WX||!SUBm)return false;return SUBm[(z|0)*WX+(x|0)]===1;}if(!N||z<N.ZMIN+4)return false;const k=N.cls(x,z);if(OWR2&&x>190&&x<286&&z>-130&&N.land(x,z)&&N.sd(x,z)>5&&Math.hypot(x-AIRP[0],z-AIRP[1])>26&&fbm(x/45+11,z/45-3)>-.45)return true;/* Paul Nov 2026: the empty bush north of the airport becomes suburbs with roads */return(k===8||(k>=4&&k<=6&&z>-225&&N.sd(x,z)>9&&fbm(x/50+4,z/50-2)>-.15))&&N.sd(x,z)>5&&N.land(x,z);};// north: the old suburb band plus new estates cut into the banksia scrub
const free=(x,z,p)=>rdD(x,z,0)>2.7+p&&fwD(x,z)>7.2+p&&(z<-40||z>WZ||rdD(x,z,1)>1.9+p)&&!nearTown(x,z,p);
const OCC=new Map(),ok=(x,z)=>(Math.floor(x)+3000)*6007+(Math.floor(z)+3000);
const occ=(x,z)=>OCC.get(ok(x,z))||0;
const markPt=(x,z,v)=>{const k=ok(x,z);if((OCC.get(k)||0)<v)OCC.set(k,v);};
const markRect=(cx,cz,th,w,d,v)=>{const c=Math.cos(th),s=Math.sin(th),r=Math.hypot(w,d)/2+1;for(let z=Math.floor(cz-r);z<=cz+r;z++)for(let x=Math.floor(cx-r);x<=cx+r;x++){const dx=x+.5-cx,dz=z+.5-cz,lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<=w/2+.35&&Math.abs(lz)<=d/2+.35)markPt(x+.5,z+.5,v);}};
const markLine=(P,w,v)=>{for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L*2));for(let k=0;k<=n;k++){const x=a[0]+(b[0]-a[0])*k/n,z=a[1]+(b[1]-a[1])*k/n;for(let dz=-w/2;dz<=w/2;dz+=.5)for(let dx=-w/2;dx<=w/2;dx+=.5)markPt(x+dx,z+dz,v);}}};
const gy=(x,z)=>Math.max(H(x,z),H(x+.6,z),H(x-.6,z),H(x,z+.6),H(x,z-.6));
const bake=(x,z)=>z>WZ?1:Math.max(.76,Math.min(1.08,bakeAt(x,z)));

// ---------- 1. one texture atlas (day + night glow), 32 px per unit, T2 painters ----------
const AW=2048,AH=2048,[atD,atDx]=T2.cv(AW,AH),[atG,atGx]=T2.cv(AW,AH);atGx.fillStyle='#000';atGx.fillRect(0,0,AW,AH);
let ax=0,ay=0,ah=0,aOver=0;
const put=(day,lit)=>{const w=day.width,h=day.height;if(ax+w+2>AW){ax=0;ay+=ah+2;ah=0;}if(ay+h>AH){aOver++;return[0,0,1/AW,1/AH];}const x=ax,y=ay;ax+=w+2;if(h>ah)ah=h;
  atDx.drawImage(day,x,y);if(lit)atGx.drawImage(PXK.glowDiff(day,lit),x,y);return[(x+.3)/AW,1-(y+h-.3)/AH,(x+w-.3)/AW,1-(y+.3)/AH];};
const cvs=(w,h,f)=>{const[c,x]=T2.cv(w,h);f(x,w,h);return c;};
const pair=f=>put(f(false),f(true));
const sol=(c,w,h)=>put(cvs(w||4,h||4,(x,W,Hh)=>{Pt(x,c,0,0,W,Hh);}));
const noiseT=(base,w,h,n)=>put(cvs(w,h,(x,W,Hh)=>{const r=ramp(base);Pt(x,r[3],0,0,W,Hh);for(let k=0;k<W*Hh*(n||.25);k++)Pt(x,[r[2],r[4],r[3],r[1]][k%4],hs(k,1)*W,hs(k,2)*Hh);}));
const UV={};
// house skins: brick veneer (1980s), weatherboard cottage on stumps, Federation bungalow, coast shack, terrace unit
const HW0=3.3,HD0=2.5,HH0=1.5,TW0=1.8;
const SK={brick:[],cottage:[],fed:[],shack:[],terr:[]};
const roofUV={};const roofT=(col,kind)=>{const k=col+kind;if(!roofUV[k])roofUV[k]=put(T2.roof(3.9,1.6,{base:col,kind,gutter:true,gutterCol:kind==='tin'?'#e8e4d8':'#d8d4c8',seed:(col.charCodeAt(2)%5)+1,moss:kind==='tile'}));return roofUV[k];};
function paintSkin(kind,s){let base,wk,frame,door,roofCol,roofKind,rise,stumps=false,bandY=0,band=null;
  if(kind==='brick'){base=T3H.BRICK[s%T3H.BRICK.length];wk='brick';frame=['#f2efe6','#e8e4dc','#d8d4c8','#f6f2e8'][s%4];door=['#6b4a2e','#2c4a3a','#8a2a2a','#3a3e48','#c8a040'][s%5];roofCol=T3H.TILE[(s*3+1)%T3H.TILE.length];roofKind='tile';rise=.56;}
  else if(kind==='cottage'||kind==='shack'){base=(kind==='shack'?['#f2e6c8','#b8d4d8','#c8e0c0','#f4f2ec','#e8c8a0','#d8e8f0']:T3H.BOARD)[s%(kind==='shack'?6:T3H.BOARD.length)];wk='board';frame=['#f6f2e8','#2f5a46','#6a2a2a','#1d3a6e','#f2e6c8'][s%5];if(T2.lum(frame)<.4&&T2.lum(base)<.55)frame='#f6f2e8';door=T3H.FDOOR[(s*3)%5];roofCol=T3H.TIN[(s*5+2)%T3H.TIN.length];roofKind='tin';rise=kind==='shack'?.5:.72;stumps=true;}
  else if(kind==='fed'){base=T3H.FED[s%T3H.FED.length];wk='brick';frame='#f6f2e8';door=T3H.FDOOR[(s+1)%5];roofCol=['#b8562e','#a84a2a','#c8643a'][s%3];roofKind='tile';rise=.82;bandY=26;band='#efe3c4';}
  else{const br=s%2===0;base=br?T3H.FED[s%3]:['#efe3c4','#e8d0a0','#d8c8b0','#c8d4c8'][s%4];wk=br?'brick':'plaster';frame='#f6f2e8';door=T3H.FDOOR[s%5];roofCol=['#8a8e94','#b8562e','#5a5e64'][s%3];roofKind=s%3===1?'tile':'tin';rise=.5;bandY=br?24:0;band='#efe3c4';}
  const sp={base,kind:wk,frame,door,seed:s*13+1+kind.length*7,bandY,bandCol:band,stumps};const n=(s*7)%60+3;
  let front,W=kind==='terr'?TW0:kind==='shack'?2.7:HW0,D=kind==='shack'?2.2:HD0;
  if(kind==='brick')front=[{t:'win',x:.2,y:9,w:26,h:18,kind:'case',box:false},{t:'door',x:.52,w:14,h:33,n,fan:false},{t:'win',x:.82,y:9,w:20,h:18,kind:'case'},{t:'meter',x:.66,y:16}];
  else if(kind==='cottage')front=[{t:'win',x:.19,y:8,w:15,h:22,kind:'sash',box:true,shutter:s%2?null:['#2f5a46','#6a2a2a','#1d3a6e'][s%3]},{t:'door',x:.5,w:14,h:33,n},{t:'win',x:.81,y:8,w:15,h:22,kind:'sash',box:true}];
  else if(kind==='fed')front=[{t:'win',x:.22,y:8,w:16,h:20,kind:'sash',lead:true},{t:'door',x:.62,w:14,h:34,n},{t:'win',x:.87,y:9,w:12,h:20,kind:'sash',lead:true}];
  else if(kind==='shack')front=[{t:'win',x:.24,y:9,w:18,h:15,kind:'case',box:s%2===0},{t:'door',x:.62,w:13,h:31,n,fan:false},{t:'win',x:.88,y:10,w:10,h:12,kind:'case'}];
  else front=[{t:'door',x:.3,w:12,h:33,n},{t:'win',x:.74,y:9,w:14,h:19,kind:'sash',lead:s%2===0}];
  const back=[{t:'win',x:.2,y:10,w:16,h:16,kind:'case'},{t:'door',x:.5,w:13,h:31,fan:false,lamp:true},{t:'win',x:.8,y:12,w:12,h:12,kind:'case',lintel:false},{t:'pipe',x:.97,w:3}];
  const side=[{t:'win',x:.5,y:10,w:14,h:16,kind:wk==='board'?'sash':'case',lead:kind==='fed'},{t:'pipe',x:.06,w:3},{t:'vent',x:.82,w:5}];
  const F=(items,w,sd)=>pair(lit=>T3H.face(w,HH0,Object.assign({},sp,{items,seed:sp.seed+sd}),lit));
  const r={kind,base,frame,door,roofCol,roofKind,rise,W,D,f:F(front,W,0),b:kind==='terr'?null:F(back,W,5),s:kind==='terr'?null:F(side,D,9),s2:kind==='terr'?null:F(side.slice(1).concat([{t:'win',x:.4,y:12,w:12,h:12,kind:'case'}]),D,11),rf:roofT(roofCol,roofKind)};
  if(kind==='brick')r.gar=put(cvs(38,35,(x)=>{T2.seed(s+3);T2.surface(x,38,35,base,'brick');T3H.garage(x,3,6,32,29,['#e8e4dc','#c8ccd0','#d8c8a8','#8a6a4a'][s%4]);T2.eave(x,38);}));
  return r;}
[['brick',10],['cottage',8],['fed',6],['shack',6],['terr',6]].forEach(([k,n])=>{for(let s=0;s<n;s++)SK[k].push(paintSkin(k,s));});
// terrace side/back walls (shared)
UV.terrSide=pair(lit=>T3H.face(HD0,HH0,{base:'#a84a32',kind:'brick',frame:'#f6f2e8',seed:5,items:[{t:'pipe',x:.1,w:3}]},lit));
UV.terrBack=pair(lit=>T3H.face(TW0,HH0,{base:'#a84a32',kind:'brick',frame:'#f6f2e8',door:'#5a3a22',seed:7,items:[{t:'win',x:.5,y:12,w:12,h:12,kind:'case'}]},lit));
UV.top=sol('#8a8680');UV.dark=sol('#2a2628');
UV.lawn=put(cvs(32,32,(x)=>{const c=['#5e9a3e','#6aa444','#76ac4a','#86b252'];for(let y=0;y<32;y++)for(let X=0;X<32;X++){const st=((X>>3)&1);const v=hs(X,y);Pt(x,c[(st?2:1)+(v<.2?-1:v>.85?1:0)],X,y);}}));
UV.lawnDry=put(cvs(32,32,(x)=>{const c=['#8a9a4e','#9aa65a','#aeb066','#c0b878'];for(let y=0;y<32;y++)for(let X=0;X<32;X++){const v=hs(X+40,y);Pt(x,c[(((X>>3)&1)?2:1)+(v<.2?-1:v>.85?1:0)],X,y);}}));
UV.pave=put(T2.pave(1,1.4,'#c8c4b8'));UV.paveR=put(T2.pave(1,1.4,'#b8a088'));UV.path=put(T2.pave(.5,1,'#d8cfbc'));
UV.water=put(cvs(32,32,(x)=>{Pt(x,'#38a8d0',0,0,32,32);for(let k=0;k<60;k++)Pt(x,k%3?'#5ac0e0':'#8ad8f0',hs(k,7)*32,hs(k,8)*32,3,1);Pt(x,'#2a88b0',0,0,32,2);}));
UV.coping=noiseT('#e8e2d4',8,8);
UV.fenceS=[['#8a9a8a'],['#b8ae9a'],['#6a7a6a'],['#5a5e64']].map(([c])=>put(cvs(32,16,(x)=>{const r=ramp(c);for(let X=0;X<32;X++)Pt(x,X%4===0?r[1]:X%4===1?r[4]:r[3],X,0,1,16);Pt(x,r[5],0,0,32,1);Pt(x,r[0],0,15,32,1);})));
UV.picket=put(cvs(32,12,(x)=>{Pt(x,'#4a6a34',0,0,32,12);for(let X=0;X<32;X+=4){Pt(x,'#f4f2ec',X,1,2,11);Pt(x,'#d8d4c8',X+1,2,1,10);Pt(x,'#f4f2ec',X,0,1,1);}Pt(x,'#e8e4d8',0,4,32,1);Pt(x,'#e8e4d8',0,9,32,1);}));
UV.bwall=put(cvs(32,12,(x)=>{T2.seed(4);T2.brick(x,32,12,'#c8875a');Pt(x,'#e8dcc8',0,0,32,2);Pt(x,'#a89880',0,2,32,1);}));
UV.lwall=put(cvs(32,12,(x)=>{T2.seed(6);T2.stone(x,32,12,'#e4d6b0');Pt(x,'#f2ead4',0,0,32,2);}));
UV.hedge=put(cvs(32,16,(x)=>{const c=['#2e5a26','#3c6e2e','#4e8236','#6a9a44'];for(let y=0;y<16;y++)for(let X=0;X<32;X++){const v=hs(X*1.3,y*2.1);Pt(x,c[Math.min(3,(v*3.2+(y<4?1:0))|0)],X,y);}}));
UV.stripes=[['#2f5a46','#f2e6c8'],['#8a2a2a','#f2e6c8'],['#1d3a6e','#f6f2e8'],['#c8ccd0','#9aa0a6'],['#3d7a78','#f4ecd8']].map(([a,b])=>put(T2.stripes(2.4,.6,a,b)));
UV.wood=put(T2.wood(1,1,'#8a6a4a'));UV.tank=['#9aa39a','#a8acb0','#3e6a52'].map(c=>put(T2.tank(2.2,.8,c)));UV.solar=put(T3H.solar());
UV.chim=[put(T2.chimney(.3,.8,'#9b4f37')),put(T2.chimney(.3,.8,'#c8875a'))];UV.halfT=put(T3H.halfTimber(1.4,.72,'#efe3c4','#5a3a22'));UV.ac=put(T3H.slats(.5,.32,'#e6e6e2'));
UV.white=sol('#f4f2ec');UV.green=sol('#2f5a46');UV.grey=sol('#8a8e94');UV.metal=sol('#c8ccd0');UV.black=sol('#2a2a30');UV.cream=sol('#efe3c4');UV.red=sol('#c8344a');UV.timber=sol('#8a6a4a');
UV.tin=noiseT('#a8acb0',16,16,.1);UV.tinG=noiseT('#3e6a52',16,16,.1);UV.gable=[put(T2.gable(1.6,.6,'#f2e6c8')),put(T2.gable(1.6,.6,'#b8d4d8'))];
UV.bed=put(T2.veg(1,.4));UV.tramp=put(cvs(16,16,(x)=>{Pt(x,'#2a2a30',0,0,16,16);Pt(x,'#3a7ac8',1,1,14,14);Pt(x,'#2a2a30',3,3,10,10);}));UV.sand=noiseT('#e8d8a8',16,16,.4);
// streets: local street (kerbs, footpaths both sides), rear lane, arterial (two lanes each way, planted median), ramp, plain asphalt
const ASPH=['#56585d','#4a4c50','#606268','#6a6c70','#505256'];
const asph=(x,X,Y,W,Hh)=>{Pt(x,ASPH[0],X,Y,W,Hh);for(let k=0;k<W*Hh*.18;k++)Pt(x,ASPH[1+(k%4)],X+hs(k,X+3)*W,Y+hs(k,Y+5)*Hh);};
UV.street=put(cvs(80,40,(x)=>{const g=['#6a9a44','#78a64c'];for(let X=0;X<80;X++)for(let y=0;y<40;y++)Pt(x,g[hs(X,y)<.5?0:1],X,y);
  [[3,11],[66,11]].forEach(([X,w])=>{Pt(x,'#d8d2c4',X,0,w,40);for(let y=0;y<40;y+=6)Pt(x,'#c4bcac',X,y,w,1);Pt(x,'#e8e2d4',X,0,1,40);});
  asph(x,18,0,44,40);Pt(x,'#c8c4b8',17,0,2,40);Pt(x,'#c8c4b8',61,0,2,40);Pt(x,'#8a8680',19,0,1,40);Pt(x,'#8a8680',60,0,1,40);}));
UV.lane=put(cvs(24,24,(x)=>{asph(x,0,0,24,24);for(let k=0;k<30;k++)Pt(x,'#8a8070',hs(k,40)*24,hs(k,41)*24);Pt(x,'#6a6c66',0,0,1,24);Pt(x,'#6a6c66',23,0,1,24);}));
UV.art=put(cvs(208,64,(x)=>{const g=['#6a9a44','#78a64c','#86b252'];for(let X=0;X<208;X++)for(let y=0;y<64;y++)Pt(x,g[(hs(X,y)*3)|0],X,y);
  [[2,14],[192,14]].forEach(([X,w])=>{Pt(x,'#d8d2c4',X,0,w,64);for(let y=0;y<64;y+=7)Pt(x,'#c4bcac',X,y,w,1);});
  [[26,72],[110,72]].forEach(([X,w])=>{asph(x,X,0,w,64);Pt(x,'#c8c4b8',X-2,0,2,64);Pt(x,'#c8c4b8',X+w,0,2,64);Pt(x,'#f4f2e8',X+2,0,1,64);Pt(x,'#f4f2e8',X+w-3,0,1,64);for(let y=4;y<64;y+=16)Pt(x,'#f4f2e8',X+(w>>1)-1,y,2,9);});
  Pt(x,'#c8c4b8',98,0,12,64);Pt(x,'#5a8a3a',100,0,8,64);for(let y=0;y<64;y+=3)Pt(x,'#6aa040',101+(y%5),y,2,2);}));
UV.ramp=put(cvs(48,32,(x)=>{asph(x,4,0,40,32);Pt(x,'#c8c4b8',2,0,2,32);Pt(x,'#c8c4b8',44,0,2,32);Pt(x,'#f4f2e8',6,0,1,32);Pt(x,'#f4f2e8',41,0,1,32);Pt(x,'#6a9a44',0,0,2,32);Pt(x,'#6a9a44',46,0,2,32);}));
UV.asph=put(cvs(32,32,(x)=>asph(x,0,0,32,32)));
UV.cross=put(cvs(112,112,(x)=>{asph(x,0,0,112,112);const z=(hor,o)=>{for(let k=16;k<96;k+=5)hor?Pt(x,'#f4f2e8',k,o,3,9):Pt(x,'#f4f2e8',o,k,9,3);};z(true,3);z(true,100);z(false,3);z(false,100);
  Pt(x,'#f4f2e8',16,14,40,1);Pt(x,'#f4f2e8',56,97,40,1);Pt(x,'#f4f2e8',14,56,1,40);Pt(x,'#f4f2e8',97,16,1,40);Pt(x,'#e8c84a',55,16,2,80);Pt(x,'#e8c84a',16,55,80,2);}));
UV.island=put(cvs(32,32,(x)=>{for(let y=0;y<32;y++)for(let X=0;X<32;X++){const d=Math.hypot(X-15.5,y-15.5);Pt(x,d>14?'#c8c4b8':(hs(X,y)<.5?'#5e9a3e':'#6aa444'),X,y);}for(let k=0;k<20;k++)Pt(x,['#f2d24a','#e05a6a','#f4f2ec'][k%3],8+hs(k,3)*16,8+hs(k,4)*16);}));
UV.kerb=noiseT('#c8c4b8',8,8);
UV.park=put(cvs(64,64,(x)=>{asph(x,0,0,64,64);for(let X=4;X<64;X+=10){Pt(x,'#f4f2e8',X,0,1,22);Pt(x,'#f4f2e8',X,42,1,22);}Pt(x,'#f4f2e8',0,31,64,1);}));
UV.oval=put(cvs(160,96,(x)=>{for(let y=0;y<96;y++)for(let X=0;X<160;X++){const e=Math.hypot((X-79.5)/74,(y-47.5)/42);const st=((X>>3)&1);Pt(x,e<1?(st?'#6aac44':'#78b44c'):(hs(X,y)<.5?'#5e9a3e':'#68a044'),X,y);if(Math.abs(e-.97)<.012)Pt(x,'#f4f2ec',X,y);}
  Pt(x,'#d8c89a',74,40,12,16);Pt(x,'#f4f2ec',74,42,12,1);Pt(x,'#f4f2ec',74,53,12,1);for(let k=0;k<64;k++){const a=k/64*6.283;Pt(x,'#f4f2ec',79.5+Math.cos(a)*14,47.5+Math.sin(a)*14);}
  [[12,47.5],[147,47.5]].forEach(([X,Y])=>{for(let k=0;k<40;k++){const a=-1.6+k/40*3.2;Pt(x,'#f4f2ec',X+(X<80?1:-1)*Math.cos(a)*16,Y+Math.sin(a)*16);}});}));
UV.court=put(cvs(64,40,(x)=>{Pt(x,'#3a6a8a',0,0,64,40);Pt(x,'#c86a3a',4,4,56,32);Pt(x,'#f4f2ec',4,4,56,1);Pt(x,'#f4f2ec',4,35,56,1);Pt(x,'#f4f2ec',4,4,1,32);Pt(x,'#f4f2ec',59,4,1,32);Pt(x,'#f4f2ec',31,4,1,32);for(let k=0;k<24;k++){const a=k/24*6.283;Pt(x,'#f4f2ec',31.5+Math.cos(a)*5,20+Math.sin(a)*5);}}));
UV.yard=put(cvs(48,48,(x)=>{asph(x,0,0,48,48);for(let k=0;k<5;k++){Pt(x,'#f4d04a',6,6+k*6,5,5);Pt(x,'#2a2230',6,6+k*6,5,1);}Pt(x,'#e86a6a',24,8,16,1);Pt(x,'#e86a6a',24,8,1,16);Pt(x,'#e86a6a',40,8,1,16);Pt(x,'#e86a6a',24,24,17,1);Pt(x,'#4a9aea',20,34,22,1);}));
UV.rubber=noiseT('#b85a3a',16,16,.3);UV.bark=noiseT('#8a6a4a',16,16,.5);UV.gravel=noiseT('#b8a888',16,16,.4);
UV.nwall=put(cvs(64,32,(x)=>{T2.seed(12);const r=ramp('#e4d6b0');Pt(x,r[3],0,0,64,32);for(let X=0;X<64;X+=16){Pt(x,r[1],X,0,1,32);Pt(x,r[4],X+1,0,1,32);for(let y=4;y<30;y+=6)for(let k=0;k<3;k++)Pt(x,r[2],X+3+k*4+(y%12?2:0),y,3,2);}Pt(x,r[5],0,0,64,2);Pt(x,r[1],0,30,64,2);}));
UV.clock=put(cvs(16,16,(x)=>{Pt(x,'#5a6a5a',0,0,16,16);for(let y=0;y<16;y++)for(let X=0;X<16;X++)if(Math.hypot(X-7.5,y-7.5)<6.5)Pt(x,Math.hypot(X-7.5,y-7.5)>5.6?'#c8a040':'#f4f2ec',X,y);Pt(x,'#2a2230',7,3,1,5);Pt(x,'#2a2230',7,7,4,1);}));
UV.flag=put(cvs(24,14,(x)=>{Pt(x,'#1d3a6e',0,0,24,14);Pt(x,'#f2d24a',0,6,24,2);Pt(x,'#f4f2ec',3,2,4,3);for(let k=0;k<5;k++)Pt(x,'#f4f2ec',12+k*2,2+(k%2)*6,1,1);}));
UV.sail=[sol('#e86a1a'),sol('#2f8ab0'),sol('#f2d24a')];UV.play=[sol('#e8402a'),sol('#3a8ae8'),sol('#f2c02a'),sol('#4ab04a')];
UV.carB=['#c8344a','#f4f2ec','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#9aa0a6','#2a2a30'].map(c=>put(cvs(24,8,(x)=>{Pt(x,c,0,0,24,8);Pt(x,T2.sh(c,1.2),0,0,24,1);Pt(x,T2.sh(c,.6),0,7,24,1);Pt(x,'#2a2230',3,6,4,2);Pt(x,'#2a2230',17,6,4,2);})));
UV.carW=put(cvs(16,8,(x)=>{Pt(x,'#2a2230',0,0,16,8);Pt(x,'#8ab4cc',1,1,6,6);Pt(x,'#8ab4cc',9,1,6,6);Pt(x,'#c8e0ec',2,1,2,2);}));
// shopfronts, cafés and restaurants (fictional trades), the clinic, the hall, the school, the clubrooms
const SHOPN=['BAKERY','NEWSAGENCY','CHEMIST','DELI','HAIR','BUTCHER','FLORIST','GREENGROCER','HARDWARE','BOOKS','LAUNDRY','POST','VET','OPTICIAN','GIFTS','SHOES'];
const EATN=['CAFE','PIZZA','NOODLES','THAI KITCHEN','FISH & CHIPS','SUSHI','BURGERS','KEBABS','GELATO','DUMPLINGS','BAKEHOUSE','CURRY'];
const AWN=['#c8344a','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#e86a1a','#7a4a8a','#c8a040'];
const WALLB=['#efe3c4','#e8d0a0','#f2e6c8','#d8c8b0','#c8d4c8','#e4d4ac','#f4ecd8','#d8b8a0'];
const txt=(x,s,X,Y,col,sz)=>{x.fillStyle=col;x.font='bold '+(sz||7)+'px monospace';x.textBaseline='top';x.textAlign='center';x.fillText(s,X,Y);};
function shopFace(name,base,awn,eat,lit,s){const W=78,Hh=54;return cvs(W,Hh,(x)=>{T2.seed(s);T2.surface(x,W,Hh,base,s%3===0?'brick':'render');
  const A=ramp(awn);Pt(x,A[1],2,2,W-4,11);Pt(x,A[3],3,3,W-6,9);Pt(x,A[5],3,3,W-6,1);txt(x,name,W/2,4,'#fbf6e8',name.length>10?6:7);
  T2.win(x,6,22,eat?30:38,22,{kind:'case',lit,frame:'#2a2a30',wall:base,room:eat?2:3,lintel:false});T2.door(x,eat?44:52,Hh-31,14,28,{col:'#2a3a4a',frame:'#2a2a30',lit,fan:false,lamp:false});
  if(eat){T2.win(x,62,22,10,22,{kind:'case',lit,frame:'#2a2a30',wall:base,lintel:false});}T2.plinth(x,W,Hh,'#8a8278');});}
UV.shops=[];for(let k=0;k<16;k++){const nm=SHOPN[k],b=WALLB[k%8],a=AWN[(k*3)%8];UV.shops.push({uv:pair(l=>shopFace(nm,b,a,false,l,k+3)),awn:a});}
UV.eats=[];for(let k=0;k<12;k++){const nm=EATN[k],b=WALLB[(k+3)%8],a=AWN[(k*5+1)%8];UV.eats.push({uv:pair(l=>shopFace(nm,b,a,true,l,k+30)),awn:a});}
UV.shopSide=WALLB.slice(0,4).map((b,k)=>pair(l=>T2.wall(2.4,1.7,{base:b,kind:'render',win:1,lit:l,seed:40+k,cornice:false,box:false,moss:false})));
UV.awn=AWN.map(c=>put(T2.stripes(2.4,.7,c,'#f4f2ec')));
UV.hall=[['#efe3c4','stone'],['#c8875a','brick'],['#e8e2d4','render']].map(([b,k],i)=>pair(l=>T2.wall(4.2,2.2,{base:b,kind:k,win:3,door:true,doorAt:.5,arch:true,lit:l,seed:60+i,box:false,quoins:true})));
UV.hallS=[['#efe3c4','stone'],['#c8875a','brick'],['#e8e2d4','render']].map(([b,k],i)=>pair(l=>T2.wall(3.2,2.2,{base:b,kind:k,win:2,lit:l,seed:70+i,box:false})));
UV.clinic=[0,1].map(i=>pair(l=>cvs(96,54,(x)=>{T2.seed(80+i);T2.surface(x,96,54,i?'#e8f0ee':'#f4f2ec','render');Pt(x,'#2f8a7a',0,2,96,10);txt(x,'MEDICAL CENTRE',48,4,'#f4f2ec',7);
  T2.win(x,6,22,24,18,{kind:'case',lit:l,frame:'#2f8a7a',lintel:false,room:3});T2.win(x,66,22,24,18,{kind:'case',lit:l,frame:'#2f8a7a',lintel:false,room:3});T2.door(x,40,23,16,28,{col:'#a8d8e8',frame:'#2f8a7a',lit:l,fan:false,lamp:false});
  Pt(x,'#3ab07a',86,3,3,8);Pt(x,'#3ab07a',83,6,9,2);T2.plinth(x,96,54,'#8a8278');})));
UV.school=[0,1].map(i=>pair(l=>T2.wall(6,1.7,{base:i?'#b8603e':'#c8875a',kind:'brick',win:5,door:true,doorAt:.5,lit:l,seed:90+i,box:false,cornice:false})));
UV.schoolS=pair(l=>T2.wall(3,1.7,{base:'#c8875a',kind:'brick',win:2,lit:l,seed:95,box:false,cornice:false}));
UV.club=pair(l=>cvs(96,42,(x)=>{T2.seed(97);T2.surface(x,96,42,'#e8e2d4','board');T2.win(x,8,10,22,14,{kind:'case',lit:l,lintel:false});T2.win(x,66,10,22,14,{kind:'case',lit:l,lintel:false});
  T3H.garage(x,36,14,24,26,'#2f5a46');Pt(x,'#2f5a46',0,0,96,3);T2.plinth(x,96,42,'#8a8278');}));
UV.score=put(cvs(32,16,(x)=>{Pt(x,'#1d3a2a',0,0,32,16);Pt(x,'#f4f2ec',0,0,32,1);txt(x,'HOME 12.7',16,2,'#f2d24a',5);txt(x,'AWAY 9.10',16,9,'#f4f2ec',5);}));
UV.deli=pair(l=>shopFace('CORNER DELI','#f2e6c8','#c8344a',false,l,111));
UV.toilet=pair(l=>T2.wall(1.6,1.2,{base:'#c8875a',kind:'brick',win:0,door:true,lit:l,seed:120,cornice:false,box:false}));

