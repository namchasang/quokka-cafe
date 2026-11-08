// ---------- stations and ports (Paul, Oct 2026): walk in, pick a town, step off at its station or jetty ----------
const HUBS={train:{word:'Train',many:'Trains',fare:5,mins:25,stops:{cbd:{n:'Perth Station',x:680,z:WEL4_ON?(CW_ON?-27.5:-24.45):-21.6},freo:{n:'Fremantle Station',x:297.5,z:-9.9},vp:{n:'Victoria Park Station',x:558.6,z:-6.4},air:{n:'Airport Central',x:726,z:12.4}}},
  ferry:{word:'Ferry',many:'Ferries',fare:8,mins:35,stops:{cbd:{n:'Barrack St Jetty',x:670.6,z:17.2},sp:{n:'Mends St Jetty',x:SPX+.4,z:-8.2},freo:{n:'B-Shed ferry terminal',x:285,z:-9.6},island:{n:'Thomson Bay jetty',x:IW(-16,4.4).x+1.6,z:IW(-16,4.4).z+1.2}}}};
function openHub(mode,from){const H=HUBS[mode],F=H.stops[from];const lockedFreo=typeof freoUnlocked==='function'&&!freoUnlocked();
  openTravel('Where to?',F.n+' · '+H.many.toLowerCase(),Object.keys(H.stops).map(z=>({id:z,name:TOWN_NAME[z]+' · '+H.stops[z].n,here:z===from,
    note:z===from?'':'About '+H.mins+' min',fare:H.fare,lock:z!==from&&(z==='freo'||from==='island'&&z!=='island')&&mode==='ferry'&&lockedFreo?'Locked (see Quests)':null,ride:()=>hubGo(mode,z)})),mode==='train'?'Pick a town and step off at its station. One fare, any stop on the line.':'Pick a town and step off at its jetty. One fare, any jetty on the route.');}
function hubGo(mode,z){if(transit||VISIT)return;const H=HUBS[mode],D=H.stops[z];if(typeof rideLog==='function')rideLog(mode,z);transit=true;fadeTarget=.95;toast(H.word+' to '+D.n+'…',1.8);
  setTimeout(()=>{S.time+=H.mins;player.bike=false;player.carry=null;const [x,zz]=hqTpSpot(D.x,D.z);player.x=x;player.z=zz;updateCamera(0,true);hideOverlays();fadeTarget=0;transit=false;
    S.seenZ=S.seenZ||{};S.seenZ[z]=1;if(z==='cbd'&&typeof cbdArrive==='function')cbdArrive('cbd');save();},900);}
{const _th=cbdTargets;cbdTargets=function(T){_th(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}
  Object.keys(HUBS).forEach(mode=>{const st=HUBS[mode].stops[zq];if(!st)return;if(!st.ok){st.ok=1;if(blocked(st.x,st.z)){outer:for(let r=.4;r<5;r+=.4)for(let a=0;a<16;a++){const x=st.x+Math.cos(a/16*6.283)*r,z=st.z+Math.sin(a/16*6.283)*r;if(!blocked(x,z)){st.x=x;st.z=z;break outer;}}}}T.push({x:st.x,z:st.z,r:1.4,label:HUBS[mode].many+' · '+st.n+' · pick a town',act:()=>openHub(mode,zq)});});};}
// ---------- City trains (Paul, Nov 2026): a 3-car electric train calls at Perth Station, Fremantle Station, Victoria Park Station
// and Airport Central. It runs in, stops with its doors open, waits and runs out again. Kip walks to an open door, boards, picks a
// town in the old station menu (same fares and Perth Pass rules as hubGo), rides out, and steps off the train at that platform.
// Built lazily on the first frame after the pixel pass, so the scene passes never touch it. Ferries keep the old menu path.
var MTR_LIVE=true;var MTR_ON=MTR_LIVE||/[?&#](lab|trip|train)\b/.test(location.search+location.hash);
const MTR={on:MTR_ON,built:false,st:{},ride:null,
  // tz track centre, stop = train centre when stopped, inDir/outDir travel direction (+1 = east), px1..px2 platform, pd platform depth,
  // tx1..tx2 track length, walk = extra walkable rect, hop = where the station door sends Kip, D = run-in / run-out distance
  DEF:{cbd:{tz:-48.6,stop:678,inDir:1,outDir:1,px1:652,px2:704,pd:3.45,tx1:600,tx2:724,name:'PERTH',walk:[652.4,-47.42,703.6,-44.5],hop:[678.5,-45.6],D:36,island:1,
      exits:[{x:667.2,z:-45.2,label:'Exit · Wellington St',to:[680,CW_ON?-27.3:-23.3]}]},
    freo:{tz:-19.75,stop:303.6,inDir:-1,outDir:1,px1:293.2,px2:333.4,pd:4.6,tx1:292.6,tx2:372,name:'FREMANTLE',walk:[293.5,-18.55,333.3,-14.3],hop:[301,-16.6],D:56,buffer:292.9},
    vp:{tz:-11,stop:545,inDir:1,outDir:1,px1:531.5,px2:555.6,pd:1.75,tx1:470,tx2:612,name:'VICTORIA PARK',walk:null,hop:[546.5,-8.9],D:56},
    air:{tz:17.95,stop:745,inDir:1,outDir:1,px1:729,px2:761,pd:2.75,tx1:678,tx2:812,name:'AIRPORT CENTRAL',walk:[729.3,19.12,760.7,21.42],hop:[745.5,20.3],D:56,
      exits:[{x:742.3,z:21.05,label:'Stairs to the terminal',to:[742.3,15.5]}],entry:{x:742.3,z:15.6,label:'Trains · Platform 1 · stairs down'}}},
  TIN:9,TOUT:9,TOPEN:.9,DWELL:20,CL:6.4,GAP:.25,W:1.7,FLOOR:.36};
MTR.DOORS=(()=>{const a=[];[-1,0,1].forEach(c=>[-1.6,1.6].forEach(d=>a.push(c*(MTR.CL+MTR.GAP)+d)));return a;})();
function mtrPZ(D){return D.tz+MTR.W/2+.1;}
// walkable platforms (Perth's island platform and the airport platform are reached from the station door)
{const _cw=cbdWalk;cbdWalk=function(x,z){if(MTR.on){const r=MTR.DEF.cbd.walk;if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return true;}return _cw(x,z);};}
{const _fw=freoWalk;freoWalk=function(x,z){if(MTR.on){const r=MTR.DEF.freo.walk;if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return true;}return _fw(x,z);};}
{const _aw=airWalk;airWalk=function(x,z){if(MTR.on&&AIR&&AIR.on){const r=MTR.DEF.air.walk;if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return true;}return _aw(x,z);};}

function mtrBuild(){MTR.built=true;const P=PXK.P,sh=PXK.sh,mix=PXK.mix,cv=PXK.cv;const T=c=>ctex(c);
  const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(c)},o||{}));const CM=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  const litMat=(paint,dim)=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(PXK.glowDiff(a,b))});if(dim)m.__dim=dim;PXB_GLOW.push(m);return m;};
  const lamp=(c)=>{const m=new THREE.MeshBasicMaterial({color:new THREE.Color(c||'#e8d8a8')});return m;};
  const put=(g,geo,mat,x,y,z,o)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o){if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;}m.castShadow=!(o&&o.noShadow);m.receiveShadow=true;m.__pxSkip=1;g.add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const R=mulberry32(4711);
  // ===================== the train: shared skins =====================
  const BODY='#e4e9ec',TEAL='#1d7a84',ORNG='#ef8a36',DARK='#252d34';
  const side=(lit)=>{const W=205,H=54;const[c,x]=cv(W,H);P(x,BODY,0,0,W,H);
    for(let X=0;X<W;X+=2)if(R()<.25)P(x,sh(BODY,.97),X,10+(R()*30|0),2,1);
    P(x,sh(BODY,.82),0,0,W,2);P(x,sh(BODY,.92),0,2,W,1);P(x,'#ffffff',0,3,W,1);
    P(x,'#3a4650',0,7,W,1);P(x,'#3a4650',0,27,W,1);
    const doors=[51,154],dw=35;
    const pane=(a,b)=>{if(b-a<6)return;P(x,'#8e98a0',a-1,8,b-a+2,19);
      if(lit){P(x,'#ffe9b2',a,9,b-a,17);P(x,'#fff8e4',a,9,b-a,2);for(let X=a+1;X<b-3;X+=5){P(x,'#cf9a55',X,19,4,7);P(x,'#b07a3c',X,25,4,1);if(R()<.28){P(x,['#4a3a2e','#2a2230','#8a5a3a','#c8a070'][R()*4|0],X,14,3,4);P(x,['#c8344a','#2f6fb0','#3e7d5c','#e8a33a'][R()*4|0],X,18,3,3);}}}
      else{P(x,'#2a3642',a,9,b-a,17);P(x,'#34424e',a,9,b-a,6);for(let k=0;k<b-a;k+=9){P(x,'#4e606e',a+k,24-((k/3)|0)%9,3,1);P(x,'#56697a',a+k+1,22-((k/3)|0)%9,2,1);}P(x,'#1e2830',a,24,b-a,2);}};
    const segs=[[3,doors[0]-dw/2-3],[doors[0]+dw/2+3,doors[1]-dw/2-3],[doors[1]+dw/2+3,W-3]];
    segs.forEach(([a,b])=>{a=Math.round(a);b=Math.round(b);const n=Math.max(1,Math.round((b-a)/30));const s=(b-a)/n;for(let i=0;i<n;i++)pane(Math.round(a+i*s+1),Math.round(a+(i+1)*s-1));});
    // livery: an orange pinstripe, a teal skirt and a wattle sprig near each end
    P(x,ORNG,0,32,W,2);P(x,sh(ORNG,.8),0,34,W,1);P(x,TEAL,0,38,W,11);P(x,sh(TEAL,1.2),0,38,W,1);P(x,sh(TEAL,.78),0,47,W,2);P(x,DARK,0,49,W,5);
    [[12,29],[W-24,29]].forEach(([X,Y])=>{P(x,'#3e7d5c',X,Y+1,8,1);P(x,'#3e7d5c',X+2,Y-1,1,2);[[1,0],[3,-1],[5,0],[7,-1],[4,1],[6,1]].forEach(([dx,dy])=>{P(x,'#f2c43a',X+dx,Y+dy-1,2,2);P(x,'#fde58a',X+dx,Y+dy-1,1,1);});});
    doors.forEach(cx=>{const X=cx-dw/2|0;P(x,'#7d878e',X-1,3,dw+2,47);if(lit){P(x,'#f4dfae',X,4,dw,46);P(x,'#c8b48a',X,4,dw,2);}else{P(x,'#1b2228',X,4,dw,46);P(x,'#262f36',X,4,dw,10);}
      P(x,lit?'#9a8a72':'#3a3530',X,46,dw,4);P(x,lit?'#e8c040':'#a89038',cx-1,6,1,40);P(x,lit?'#e8c040':'#a89038',X+3,20,1,24);P(x,lit?'#e8c040':'#a89038',X+dw-4,20,1,24);
      P(x,'#e8c84a',X,49,dw,1);});
    return c;};
  const leafC=(()=>{const[c,x]=cv(18,46);P(x,BODY,0,0,18,46);P(x,'#8e98a0',0,0,18,1);P(x,'#5e6870',0,0,1,46);P(x,'#5e6870',17,0,1,46);
    x.clearRect(3,4,12,22);x.fillStyle='rgba(38,54,66,.42)';x.fillRect(3,4,12,22);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(4,5,2,7);x.fillRect(6,5,1,4);P(x,'#9aa4ac',2,3,14,1);P(x,'#9aa4ac',2,26,14,1);P(x,'#9aa4ac',2,3,1,24);P(x,'#9aa4ac',15,3,1,24);
    P(x,ORNG,0,29,18,2);P(x,TEAL,0,35,18,11);P(x,sh(TEAL,.78),0,44,18,2);P(x,'#3ec46a',8,31,2,2);return c;})();
  const leafM=new THREE.MeshLambertMaterial({map:T(leafC),transparent:true,side:THREE.DoubleSide});
  const roofC=(()=>{const[c,x]=cv(205,54);P(x,'#c3c9cd',0,0,205,54);for(let X=0;X<205;X+=32){P(x,'#a9b0b5',X,0,1,54);P(x,'#d6dcdf',X+1,0,1,54);}P(x,'#b4bbc0',0,22,205,10);for(let X=2;X<205;X+=4)P(x,'#a2a9ae',X,24,2,1);P(x,'#9aa2a8',0,0,205,2);P(x,'#9aa2a8',0,52,205,2);return c;})();
  const roofM=LM(roofC);
  const cabC=(()=>{const[c,x]=cv(54,54);P(x,BODY,0,0,54,54);P(x,TEAL,0,38,54,11);P(x,DARK,0,49,54,5);P(x,ORNG,0,32,54,2);
    P(x,'#14181c',4,3,46,31);P(x,'#2c3a46',7,9,40,18);P(x,'#3c4c5a',7,9,40,5);P(x,'#5e7282',10,11,6,2);P(x,'#5e7282',12,13,3,1);P(x,'#14181c',26,9,2,18);
    P(x,'#2a2a2a',14,4,26,4);P(x,'#e8c84a',22,40,10,3);P(x,'#2a3036',23,44,8,5);return c;})();
  const gangC=(()=>{const[c,x]=cv(54,54);P(x,BODY,0,0,54,54);P(x,TEAL,0,38,54,11);P(x,DARK,0,49,54,5);P(x,ORNG,0,32,54,2);P(x,'#1e252b',12,6,30,42);P(x,'#3a434b',14,8,26,38);return c;})();
  const sideM=litMat(side,1.25),bodyEnds={cab:LM(cabC),gang:LM(gangC)},darkM=CM('#2a2f35'),greyM=CM('#5a6268'),acM=LM((()=>{const[c,x]=cv(38,32);P(x,'#d5dadd',0,0,38,32);for(let X=3;X<36;X+=4)P(x,'#9aa2a8',X,6,2,20);P(x,'#b0b8bd',0,0,38,2);return c;})());
  const wheelM=CM('#1c1f22');const wireM=CM('#2a2a2a');
  const signTex=makeSign(['ALL STATIONS'],56,8,'#121518','#ffb347');const signM=new THREE.MeshBasicMaterial({map:signTex});
  const makeTrain=()=>{const g=new THREE.Group();g.__pxSkip=1;const tr={g,leaves:[],heads:[],tails:[]};const W=MTR.W,CL=MTR.CL,Y0=.34,H=1.7;
    for(let ci=0;ci<3;ci++){const cx=(ci-1)*(CL+MTR.GAP);
      const mats=[ci===2?bodyEnds.cab:bodyEnds.gang,ci===0?bodyEnds.cab:bodyEnds.gang,roofM,darkM,sideM,sideM];
      put(g,B(CL,H,W),mats,cx,Y0+H/2,0);
      put(g,B(CL-.3,.1,W-.24),roofM,cx,Y0+H+.05,0);
      [-1.4,1.4].forEach(d=>put(g,B(1.1,.16,.9),acM,cx+d,Y0+H+.16,0));
      // bogies, wheels and the underframe
      [-2.25,2.25].forEach(b=>{put(g,B(1.5,.22,W-.3),darkM,cx+b,.26,0);[-.48,.48].forEach(w=>[-1,1].forEach(s=>{const m=put(g,new THREE.CylinderGeometry(.17,.17,.08,10),wheelM,cx+b+w,.2,s*(W/2-.2),{rx:Math.PI/2});}));});
      put(g,B(2.6,.16,W-.4),greyM,cx,.3,0);
      // door leaves (south side opens, the far side stays shut)
      [-1.6,1.6].forEach(d=>{[-1,1].forEach(s=>{const lf=put(g,new THREE.PlaneGeometry(.56,1.44),leafM,cx+d+s*.28,Y0+.06+.72,W/2+.02,{noShadow:1});lf.userData.base=cx+d+s*.28;lf.userData.s=s;tr.leaves.push(lf);
        const fl=put(g,new THREE.PlaneGeometry(.56,1.44),leafM,cx+d+s*.28,Y0+.06+.72,-W/2-.02,{ry:Math.PI,noShadow:1});});});
      if(ci<2)put(g,B(MTR.GAP+.1,1.36,1.2),darkM,cx+CL/2+MTR.GAP/2,Y0+.8,0);
      if(ci===1){// the pantograph reaches up to the wire
        put(g,B(.5,.08,.7),greyM,cx,Y0+H+.16,0);const a1=put(g,B(.05,.05,.6),greyM,cx-.12,Y0+H+.32,0,{rz:.9});a1.scale.set(1,1,1);put(g,B(.62,.04,.04),greyM,cx-.06,Y0+H+.3,0,{rz:.75});put(g,B(.62,.04,.04),greyM,cx+.04,Y0+H+.46,0,{rz:-.75});
        put(g,B(.08,.05,1.0),CM('#3a3a3a'),cx,2.62,0);}}
    // the two cabs: a black mask, a destination sign, headlights and tail lights
    [-1,1].forEach(e=>{const ex=e*(1.5*CL+MTR.GAP+.04);put(g,B(.1,1.0,W-.18),CM('#15191d'),ex,Y0+1.15,0);put(g,B(.16,.22,W-.3),darkM,ex+e*.04,.33,0);
      const s=put(g,new THREE.PlaneGeometry(.9,.13),signM,ex+e*.06,Y0+1.52,0,{ry:e*Math.PI/2,noShadow:1});
      [-.55,.55].forEach(zz=>{const hm=lamp('#fff6d8');const h=put(g,B(.05,.1,.18),hm,ex+e*.05,Y0+.55,zz,{noShadow:1});tr.heads.push({m:h,e});const tm=lamp('#ff3a30');const t=put(g,B(.05,.08,.1),tm,ex+e*.05,Y0+.55,zz+(zz>0?-.18:.18),{noShadow:1});tr.tails.push({m:t,e});});});
    // a small fleet name on the middle car
    {const nm=put(g,new THREE.PlaneGeometry(1.3,.16),new THREE.MeshLambertMaterial({map:makeSign(['WATTLE LINE'],64,8,BODY,TEAL)}),0,Y0+1.17,W/2+.012,{noShadow:1});
     const nm2=put(g,new THREE.PlaneGeometry(1.3,.16),new THREE.MeshLambertMaterial({map:makeSign(['WATTLE LINE'],64,8,BODY,TEAL)}),0,Y0+1.17,-W/2-.012,{ry:Math.PI,noShadow:1});}
    return tr;};
  // ===================== track, wires, platforms =====================
  const ballastC=(()=>{const L=30,W=Math.round(L*32),H=83;const[c,x]=cv(W,H);P(x,'#8a8174',0,0,W,H);
    for(let i=0;i<W*H/9;i++){P(x,['#7a7266','#9d9486','#6c645a','#a8a092','#857c70'][R()*5|0],R()*W|0,R()*H|0,1+(R()*2|0),1);}
    for(let X=4;X<W;X+=21){P(x,'#b9b4aa',X,9,7,65);P(x,'#d0ccc2',X,9,7,2);P(x,'#8f8a80',X+6,9,1,65);P(x,'#6a6258',X,74,7,2);}
    P(x,'#6e675d',0,0,W,3);P(x,'#6e675d',0,H-3,W,3);return c;})();
  const ballastM=LM(ballastC),railM=CM('#8a8e92'),railTop=CM('#d8dcde'),mastM=LM((()=>{const[c,x]=cv(4,100);P(x,'#6e7c76',0,0,4,100);P(x,'#8a9a92',0,0,1,100);P(x,'#56625c',3,0,1,100);return c;})());
  const track=(g,x1,x2,tz,wires)=>{for(let a=x1;a<x2-.01;a+=30){const L=Math.min(30,x2-a);const m=put(g,B(L,.04,2.6),ballastM,a+L/2,.02,tz,{noShadow:1});if(L<30){const t=m.material.map.clone();t.needsUpdate=true;t.repeat.set(L/30,1);m.material=new THREE.MeshLambertMaterial({map:t});}}
    [-.48,.48].forEach(o=>{put(g,B(x2-x1,.07,.07),railM,(x1+x2)/2,.075,tz+o,{noShadow:1});put(g,B(x2-x1,.012,.05),railTop,(x1+x2)/2,.115,tz+o,{noShadow:1});});
    if(!wires)return;put(g,B(x2-x1,.025,.025),wireM,(x1+x2)/2,2.66,tz,{noShadow:1});put(g,B(x2-x1,.02,.02),wireM,(x1+x2)/2,3.02,tz-.05,{noShadow:1});
    for(let a=x1+4;a<x2;a+=12){put(g,B(.12,3.25,.12),mastM,a,1.62,tz-1.55);put(g,B(.07,.07,1.7),mastM,a,3.12,tz-.75);put(g,B(.03,.38,.03),wireM,a,2.84,tz);put(g,B(.26,.08,.26),CM('#59646a'),a,.04,tz-1.55,{noShadow:1});}};
  const paveC=(L,D,o)=>{o=o||{};const W=Math.round(L*32),H=Math.round(D*32);const[c,x]=cv(W,H);const base=o.base||'#cbc4b6';P(x,base,0,0,W,H);
    for(let X=0;X<W;X+=16)for(let Y=12;Y<H;Y+=16){const f=.95+R()*.08;P(x,sh(base,f),X,Y,16,16);P(x,sh(base,.86),X,Y,16,1);P(x,sh(base,.9),X,Y,1,16);if(R()<.05)P(x,sh(base,.84),X+4+(R()*8|0),Y+4+(R()*8|0),2,1);}
    // edge coping, a yellow safety line and tactile studs along the track side (canvas top = north = track)
    if(o.edgeTop!==false){P(x,'#e8e4da',0,0,W,7);P(x,'#f6f2ea',0,0,W,1);P(x,'#9a958a',0,7,W,1);P(x,'#f2c43a',0,10,W,3);for(let X=1;X<W;X+=3)P(x,'#e0b22a',X,14,2,2);}
    if(o.edgeBot){P(x,'#e8e4da',0,H-7,W,7);P(x,'#9a958a',0,H-8,W,1);P(x,'#f2c43a',0,H-13,W,3);for(let X=1;X<W;X+=3)P(x,'#e0b22a',X,H-17,2,2);}
    if(o.num)for(let k=0;k<o.num.length;k++){const X=o.num[k];P(x,'#f6f2ea',X,20,10,14);P(x,'#3a4650',X+2,22,6,10);P(x,'#f6f2ea',X+4,24,2,6);}
    return c;};
  const benchM=LM((()=>{const[c,x]=cv(38,12);P(x,'#b85a34',0,0,38,12);for(let Y=0;Y<12;Y+=3){P(x,'#d27448',0,Y,38,1);P(x,'#8a3e22',0,Y+2,38,1);}return c;})());
  const metalM=CM('#3a4048'),glassM=new THREE.MeshLambertMaterial({color:new THREE.Color('#a8ccd8'),transparent:true,opacity:.32,depthWrite:false});
  const bench=(g,x,z)=>{put(g,B(1.2,.06,.34),benchM,x,.42,z);put(g,B(1.2,.3,.05),benchM,x,.62,z+.17);[-.5,.5].forEach(d=>put(g,B(.06,.42,.3),metalM,x+d,.21,z));};
  const lampPost=(g,x,z,col)=>{put(g,B(.08,2.55,.08),CM(col||'#3a4048'),x,1.28,z);put(g,B(.08,.06,.6),CM(col||'#3a4048'),x,2.55,z-.26);const l=put(g,B(.42,.07,.18),lamp(),x,2.5,z-.5,{noShadow:1});PXB_LAMPS.push(l);};
  const nameBoard=(g,x,z,name)=>{const t=makeSign([name],Math.max(64,name.length*7+12),12,'#1d3a6e','#ffffff');[-.9,.9].forEach(d=>put(g,B(.06,1.95,.06),metalM,x+d,.98,z));put(g,B(2.0,.36,.06),new THREE.MeshLambertMaterial({map:t,emissive:0x222222,emissiveMap:t}),x,1.82,z);};
  const shelter=(g,x,z,L)=>{[-L/2+.2,L/2-.2].forEach(d=>[-.55,.55].forEach(e=>put(g,B(.08,2.6,.08),metalM,x+d,1.3,z+e)));
    put(g,B(L+.4,.1,1.6),LM(PXK.roof(L+.4,1.6,{kind:'tin',base:'#7f97a4'})),x,2.66,z);put(g,B(L+.4,.14,.06),CM('#2e3a48'),x,2.6,z-.8);
    const gp=put(g,new THREE.PlaneGeometry(L-.4,1.7),glassM,x,1.2,z+.62,{noShadow:1});gp.castShadow=false;
    put(g,B(L-.4,.05,.06),metalM,x,2.06,z+.62);put(g,B(L-.4,.05,.06),metalM,x,.36,z+.62);
    const pid=put(g,B(1.3,.22,.08),new THREE.MeshBasicMaterial({map:makeSign(['NEXT · ALL STATIONS'],80,12,'#101418','#ffb347')}),x,2.3,z-.6,{noShadow:1});
    put(g,B(.04,.18,.04),metalM,x-.5,2.5,z-.6);put(g,B(.04,.18,.04),metalM,x+.5,2.5,z-.6);};
  const platform=(g,D,o)=>{o=o||{};const pz=mtrPZ(D),L=D.px2-D.px1,cx=(D.px1+D.px2)/2,zb=pz+D.pd;
    const top=LM(paveC(L,D.pd,{edgeBot:o.island,num:[Math.round((D.stop-D.px1)*32)-150]}));const edge=LM((()=>{const[c,x]=cv(64,8);P(x,'#bdb7aa',0,0,64,8);P(x,'#e8e4da',0,0,64,2);P(x,'#6e685e',0,6,64,2);return c;})());
    put(g,B(L,o.h||.08,D.pd),[edge,edge,top,edge,edge,edge],cx,(o.y0||0)+(o.h||.08)/2-(o.h||.08)+.05,pz+D.pd/2,{noShadow:1});
    // furniture along the back
    const back=o.island?pz+D.pd/2:zb-.45;
    for(let x=D.px1+3;x<D.px2-2;x+=10)lampPost(g,x,back+(o.island?0:.1),o.lampCol);
    [D.px1+8.5,D.px2-8.5].forEach(x=>nameBoard(g,x,back+(o.island?.35:0),D.name));
    [D.stop-6.5,D.stop+6.5,D.stop-15,D.stop+15].forEach(x=>{if(x>D.px1+1.5&&x<D.px2-1.5)bench(g,x,back-.05);});
    // the shelter stands between the doors of the first car so it never hides Kip at a door
    shelter(g,D.stop-3.33,back+(o.island?0:-.25),2.3);
    [D.stop-10.6,D.stop+10.6].forEach(x=>{if(x>D.px1+1&&x<D.px2-1){put(g,B(.3,.5,.3),CM('#2e6a4a'),x,.25,back);put(g,B(.34,.05,.34),metalM,x,.52,back);}});};
  const groundM=(base,dots,rep)=>{const[c,x]=cv(256,256);P(x,base,0,0,256,256);for(let i=0;i<4200;i++)P(x,dots[R()*dots.length|0],R()*256|0,R()*256|0,1+(R()*2|0),1);return new THREE.MeshLambertMaterial({map:ctex(c,{rep})});};
  const groupFor=k=>{const g=new THREE.Group();g.__pxSkip=1;scene.add(g);MTR.st[k]={sg:g,D:MTR.DEF[k],k};return g;};
  // ===================== Perth Station: an island platform behind the towers, with Northbridge across the tracks =====================
  {const D=MTR.DEF.cbd,g=groupFor('cbd');
    put(g,B(126,.5,29),groundM('#8f887c',['#7e776c','#a19a8e','#6f685e','#9a9386'],[126/8,29/8]),661,-.25,-49.7,{noShadow:1});
    track(g,D.tx1,D.tx2,D.tz,true);if(CW_ON){const z2=mtrPZ(D)+D.pd+.95,a=671,b=679;track(g,D.tx1,a,z2,true);track(g,b,D.tx2,z2,true);const bs=LM((()=>{const[c,x]=cv(8,40);for(let Y=0;Y<40;Y+=8){P(x,'#d8343a',0,Y,8,4);P(x,'#f6f2ea',0,Y+4,8,4);}return c;})());[[a,1],[b,-1]].forEach(([bx,s])=>{put(g,B(.5,.7,1.9),CM('#5a5f66'),bx-s*.3,.4,z2);put(g,B(.12,.26,1.4),bs,bx-s*.02,.62,z2);put(g,B(.06,.12,.12),lamp('#ff3a30'),bx,.95,z2,{noShadow:1});put(g,B(.06,.06,1.7),CM('#3a4048'),bx-s*.3,.6,z2-.95);});}else track(g,D.tx1,D.tx2,mtrPZ(D)+D.pd+.95,true);
    platform(g,D,{island:1,h:.1});
    // the exit stairs: a glass hood over steps down to the subway under the towers
    {const ex=D.exits[0];put(g,B(1.6,.08,2.0),CM('#2e3a48'),ex.x,2.25,ex.z-.2);[-.75,.75].forEach(d=>put(g,new THREE.PlaneGeometry(1.9,2.1),glassM,ex.x+d,1.1,ex.z-.2,{ry:Math.PI/2,noShadow:1}));
      put(g,B(1.5,.04,1.8),CM('#2a2f35'),ex.x,.07,ex.z-.2,{noShadow:1});for(let s=0;s<5;s++)put(g,B(1.4,.03,.12),CM('#bdb7aa'),ex.x,.09,ex.z-.9+s*.3,{noShadow:1});
      put(g,B(1.5,.26,.06),new THREE.MeshBasicMaterial({map:makeSign(['EXIT · WELLINGTON ST'],96,12,'#1d3a6e','#ffffff')}),ex.x,2.06,ex.z+.82,{noShadow:1});}
    // a low wall along the back of the yard and Northbridge's shopfronts across the tracks
    put(g,B(126,.9,.5),LM(PXK.wall(16,.9,{kind:'stone',base:'#c8b89a',win:0,cornice:false,plinth:false,moss:true,seed:3})),661,.45,-52.2);
    let x=601;let i=0;const cols=['#c8a27a','#b85434','#e2d2a8','#8a5a3a','#d8c8a0','#a8563a','#efe3c4','#6a7a6a','#c86a4a','#dcc8a0'];
    while(x<722){const w=5+((R()*5)|0),h=4.5+((R()*4.5)|0),base=cols[i%cols.length],kind=['brick','plaster','stone','brick','board'][i%5];
      const dA=.3+R()*.4;const paint=lit=>PXK.wall(w,h,{base,kind,rows:Math.max(1,Math.round(h/2.6)),lit,door:true,doorAt:dA,seed:20+i,shutter:i%3===0?['#2e6a4a','#1d3a6e','#8a3e22'][i%3===0?(i/3|0)%3:0]:null,arch:i%4===1});
      const m=litMat(paint);put(g,B(w,h,2.6),[CM(sh(base,.75)),CM(sh(base,.75)),CM(sh(base,.6)),CM('#333'),m,CM(sh(base,.7))],x+w/2,h/2,-54.6);
      put(g,B(w+.1,.18,.3),CM(sh(base,1.12)),x+w/2,h+.09,-53.3);if(i%3===1){const aw=put(g,B(w-.6,.08,.9),CM(['#2e8a52','#c8344a','#1d3a6e'][i%3]),x+w/2,2.3,-52.9);aw.rotation.x=-.25;}
      x+=w+.05;i++;}
    put(g,B(126,.3,6),CM('#4a4d55'),661,-.05,-58.5,{noShadow:1});}
  // ===================== Fremantle: a harbourside platform on a stone sea wall, the end of the line =====================
  {const D=MTR.DEF.freo,g=groupFor('freo');
    const wallC=PXK.wall(20,1.6,{kind:'stone',base:'#c9b48a',win:0,cornice:false,plinth:false,moss:true,seed:9});
    put(g,B(D.tx2-D.tx1+1,1.6,2.7),[LM(wallC),LM(wallC),CM('#8a8174'),CM('#6a645a'),LM(wallC),LM(wallC)],(D.tx1+D.tx2)/2-.5,-.78,D.tz,{noShadow:1});
    track(g,D.tx1,D.tx2,D.tz,true);
    // the platform deck on piles over the water (the land ends at z -15.2)
    platform(g,D,{h:.7,lampCol:'#2f5a46'});
    for(let x=D.px1+.6;x<D.px2;x+=2.4)put(g,B(.22,1.2,.22),CM('#5a4a3a'),x,-.6,mtrPZ(D)+.3);
    // the buffer stop
    {const bx=D.buffer;put(g,B(.5,.7,1.9),CM('#5a5f66'),bx-.1,.4,D.tz);const bs=LM((()=>{const[c,x]=cv(8,40);for(let Y=0;Y<40;Y+=8){P(x,'#d8343a',0,Y,8,4);P(x,'#f6f2ea',0,Y+4,8,4);}return c;})());put(g,B(.12,.26,1.4),bs,bx+.2,.62,D.tz);const rl=put(g,B(.06,.12,.12),lamp('#ff3a30'),bx+.22,.95,D.tz,{noShadow:1});
      put(g,B(.06,.06,1.7),metalM,bx,.6,D.tz-.95);}
    // a heritage footbridge-style railing at the deck's east end and along the water side behind
    put(g,B(.06,.9,D.pd),CM('#2f5a46'),D.px2-.05,.5,mtrPZ(D)+D.pd/2);}
  // ===================== Victoria Park: the platform behind the shops, on the line to the city =====================
  {const D=MTR.DEF.vp,g=groupFor('vp');
    const em=groundM('#7a6e5e',['#6a5e50','#8a7e6e','#5e5446'],[1,1]);
    put(g,B(45,1.2,3.2),em,467.5,-.6,D.tz,{noShadow:1});put(g,B(50,1.2,3.2),em,587,-.6,D.tz,{noShadow:1});
    track(g,D.tx1,D.tx2,D.tz,true);platform(g,D,{});
    put(g,B(.06,.9,D.pd),CM('#3a4048'),D.px1+.05,.5,mtrPZ(D)+D.pd/2);}
  // ===================== Airport Central: a platform beside the kerb, the line runs east to the terminals =====================
  {const D=MTR.DEF.air,g=groupFor('air');
    put(g,B(130,.5,5),groundM('#8fae62',['#7a9a52','#a4c070','#6e8c48','#b8c880'],[130/8,5/8]),750,-.25,24.5,{noShadow:1});
    put(g,B(37,.5,6),groundM('#8f887c',['#7e776c','#a19a8e'],[37/8,6/8]),694.5,-.26,18.2,{noShadow:1});
    track(g,D.tx1,D.tx2,D.tz,true);platform(g,D,{h:.1});
    // the stairs down at the gap in the kerb railing, and up onto the platform
    {const e=D.entry;put(g,B(.9,.26,.06),new THREE.MeshBasicMaterial({map:makeSign(['PLATFORM 1 ↓'],52,12,'#1d3a6e','#ffffff')}),e.x,1.2,16.95,{noShadow:1});put(g,B(.06,1.1,.06),metalM,e.x-.48,.55,16.95);put(g,B(.06,1.1,.06),metalM,e.x+.48,.55,16.95);
      const ex=D.exits[0];put(g,B(1.6,.08,1.0),CM('#2e3a48'),ex.x,2.2,ex.z+.1);[-.75,.75].forEach(d=>put(g,new THREE.PlaneGeometry(1.0,2.1),glassM,ex.x+d,1.1,ex.z+.1,{ry:Math.PI/2,noShadow:1}));
      put(g,B(1.5,.04,.9),CM('#2a2f35'),ex.x,.12,ex.z+.1,{noShadow:1});}}
  // ===================== the trains =====================
  Object.keys(MTR.st).forEach((k,i)=>{const S0=MTR.st[k],tr=makeTrain();scene.add(tr.g);Object.assign(S0,tr,{ph:'away',t:2+i*4.5,x:S0.D.stop,door:0,hold:false});tr.g.position.set(S0.D.stop,0,S0.D.tz);tr.g.visible=false;});
  // the old box train at Victoria Park makes way (its group stays for the photo spot, which now follows the new train)
  if(typeof vpTrain!=='undefined')vpTrain.children.forEach(c=>c.visible=false);
  pxbScene._k=-1;}

