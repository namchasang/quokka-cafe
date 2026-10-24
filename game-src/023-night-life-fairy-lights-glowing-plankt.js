// ---------- night life: fairy lights, glowing plankton, butterflies ----------
let NIGHT=0;
const fairy=[];(()=>{const cols=[0xffe9a8,0xffc8e0,0xc8f0ff,0xfff3c0];const post=(x,z)=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.06,2.2,6),legMat);p.position.set(x,1.1+.16,z);p.castShadow=true;scene.add(p);};
  const pts=[[-5.15,3.55],[5.15,3.55],[5.15,-2.2],[-5.15,-2.2]];pts.forEach(([x,z])=>post(x,z));
  const run=(a,b,n,sag)=>{for(let i=1;i<n;i++){const t=i/n;const m=new THREE.Mesh(new THREE.SphereGeometry(.06,6,6),new THREE.MeshBasicMaterial({color:cols[i%4]}));m.position.set(lerp(a[0],b[0],t),2.25-Math.sin(t*Math.PI)*sag,lerp(a[1],b[1],t));scene.add(m);fairy.push(m);}};
  run(pts[0],pts[1],22,.45);run(pts[1],pts[2],12,.3);run(pts[3],pts[0],12,.3);
  TABLES.forEach(([x,z])=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.07,.09,.18,8),new THREE.MeshBasicMaterial({color:0xffd27a}));l.position.set(x,1.05,z);scene.add(l);fairy.push(l);});})();
const nightLights=[[0,2.6,.5,0xffc88a,1.2],[-3.6,1.6,3.6,0xffb070,.7],[3.6,1.6,3.6,0xffb070,.7],[LOTS.bikes.x,2,LOTS.bikes.z+1,0xffd6a0,.8],[LOTS.ice.x,2,LOTS.ice.z+1,0xffc0d8,.8],[33.5,6.8,-6.3,0xfff0b0,1.4],[-9.3,1.8,.5,0xffe0a0,.5]].map(([x,y,z,c,i])=>{const L=new THREE.PointLight(c,0,9,2);L.position.set(x,y,z);L.userData.max=i;scene.add(L);return L;});
// bioluminescent plankton along the shore
const PLK=520,plkPos=new Float32Array(PLK*3),plkPh=new Float32Array(PLK);
for(let i=0,n=0;i<20000&&n<PLK;i++){const x=-22+R()*76,z=-15+R()*33;const d=landD(x,z);if(d>-.15||d<-2.4)continue;plkPos[n*3]=x;plkPos[n*3+1]=-.08;plkPos[n*3+2]=z;plkPh[n]=R()*6.28;n++;}
const plkGeo=new THREE.BufferGeometry();plkGeo.setAttribute('position',new THREE.BufferAttribute(plkPos,3));plkGeo.setAttribute('ph',new THREE.BufferAttribute(plkPh,1));
const plankton=new THREE.Points(plkGeo,new THREE.ShaderMaterial({uniforms:{time:{value:0},night:{value:0},px:{value:DPR}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:'attribute float ph;uniform float time;uniform float night;uniform float px;varying float a;void main(){vec4 mv=modelViewMatrix*vec4(position+vec3(sin(time*.3+ph)*.25,0.,cos(time*.25+ph)*.25),1.);a=night*(.35+.65*pow(.5+.5*sin(time*1.7+ph*3.),3.));gl_PointSize=(70.*px)/-mv.z;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'varying float a;void main(){vec2 c=gl_PointCoord-.5;float d=length(c);float g=smoothstep(.5,0.,d);gl_FragColor=vec4(.35,1.,.95,1.)*g*a;}'}));
plankton.frustumCulled=false;scene.add(plankton);
// butterflies by day
const BFLY=[["o.....o","wo...ow","wwo.oww",".wwoww.","wwo.oww","wo...ow"],["...o...","..wow..",".wwoww.",".wwoww.","..wow..","...o..."]];
const butterflies=[['#f08a3c','#2a1d1a'],['#f6f2e8','#5a4a3a'],['#7fb8e8','#1d2238'],['#f4d23a','#3a2a10']].flatMap((p,i)=>[0,1].map(j=>{const m=spriteMesh(BFLY.map(r=>pix(r,{w:p[0],o:p[1]})),.32,.28,{shadow:false});scene.add(m);return{m,ph:R()*6.28,ox:(R()-.5)*16,oz:(R()-.5)*10,sp:.4+R()*.4};}));
function nightTick(dt,t){const h=S.time/60;NIGHT=h<7?clamp((6.6-h)/1.2,0,1):clamp((h-18.6)/1.4,0,1);lampTick();
  fairy.forEach((f,i)=>{f.visible=NIGHT>.02||h>17.5;const tw=.75+.25*Math.sin(t*3+i*1.7);f.scale.setScalar(1+NIGHT*.6*tw);});
  nightLights.forEach(L=>L.intensity=L.userData.max*NIGHT*(1-wxC.rain*.3));
  plankton.material.uniforms.time.value=t;plankton.material.uniforms.night.value=NIGHT*(1-wxC.rain*.6);plankton.visible=NIGHT>.01;
  const day=(1-NIGHT)*(1-wxC.rain)*(player.x<100?1:0);butterflies.forEach((b,i)=>{b.m.visible=day>.3;if(!b.m.visible)return;const a=t*b.sp+b.ph;const cx=camTarget.x+b.ox+Math.sin(a*.7)*2.4,cz=camTarget.z+b.oz+Math.cos(a*.5)*1.6;
    b.m.position.set(cx,.6+Math.abs(Math.sin(t*2.2+b.ph))*.9,cz);setFrame(b.m,Math.floor(t*10+b.ph)%2);b.m.scale.x=Math.cos(a*.7)>0?1:-1;});
  motes.material.color.setRGB(lerp(1,.75,NIGHT),lerp(.95,1,NIGHT),lerp(.77,.45,NIGHT));motes.material.size=.09+NIGHT*.07;}

// motes
const MOTES=110;const moteGeo=new THREE.BufferGeometry();const motePos=new Float32Array(MOTES*3);const moteSeed=[];
for(let i=0;i<MOTES;i++){moteSeed.push([R()*26-13,R()*4+.3,R()*18-9,R()*6.28]);}
moteGeo.setAttribute('position',new THREE.BufferAttribute(motePos,3));
const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({size:.09,color:0xfff2c4,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending}));
const reduceMotion=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion)scene.add(motes);

// ---------- characters ----------
const ITEMS={flat:{name:'Flat White',price:8,brew:1.2},lam:{name:'Lamington',price:6,brew:0},smo:{name:'Mango Smoothie',price:10,brew:1.5},capp:{name:'Cappuccino',price:9,brew:1.2,lock:true},thai:{name:'Thai iced tea',price:9,brew:1.4,lock:true},fc:{name:'Fish & chips',price:12,brew:2.2,lock:true}};
const ITEM_ICON={flat:'coffee',lam:'lam',smo:'smo',capp:'capp',thai:'thai',fc:'fc'};
const STATIONS=[{key:'flat',x:-1.7},{key:'lam',x:0},{key:'smo',x:1.7},{key:'capp',x:-2.45,lock:true},{key:'thai',x:.85,lock:true},{key:'fc',x:2.45,lock:true}];STATIONS.forEach(st=>st.z=-1.65);
const WISH=[
 {id:'hammock',name:'Deck hammock',price:40,desc:'Somewhere to nap after the lunch rush. Lets you skip an hour in the afternoon.'},
 {id:'machine',name:'Twin-group espresso machine',price:70,desc:'Coffee and smoothies brew twice as fast.'},
 {id:'staff',name:'Hire café staff',price:50,desc:'A quokka friend who makes orders and serves tourists for you. Up to 3.'},
 {id:'room',name:'Spare room for Mum & Dad',price:120,desc:'A little hut beside the café.'},
 {id:'tickets',name:'Ferry tickets × 2',price:150,desc:'Fremantle to Rottnest, one way. Needs the spare room first.'}];

const player={x:0,z:2.9,face:1,carry:null,brewing:0,brewKey:null,walkT:0,moving:false};
player.mesh=spriteMesh(quokkaFrames(true),1.15,1.15);scene.add(player.mesh);
player.bikeMesh=(()=>{const c=mk(24,25),x=c.getContext('2d');x.drawImage(bikeCanvas('#3e7d5c'),0,11);x.drawImage(pix(QK_TOP,{o:'#3a2316',b:'#9a6a43',p:'#e79a9a',e:'#1a1010',w:'#ffffff',n:'#2a1a12',l:'#d9b48a',c:'#e8a08a',a:'#3e7d5c'}),5,0);return spriteMesh([c],1.72,1.8);})();player.bikeMesh.visible=false;scene.add(player.bikeMesh);
player.lieMesh=(()=>{const src=quokkaFrames(true)[0],c=mk(32,32),x=c.getContext('2d');x.translate(16,16);x.rotate(-Math.PI/2);x.drawImage(src,-16,-16);return spriteMesh([c],1.15,1.15,{shadow:false});})();player.lieMesh.visible=false;scene.add(player.lieMesh);player.blob=blob(.9);
const carryIcons={};Object.keys(ITEMS).forEach(k=>{const m=spriteMesh([iconCanvas(ITEM_ICON[k])],.5,.5,{basic:true,shadow:false});m.visible=false;scene.add(m);carryIcons[k]=m;});

const mei={x:144,z:2.4};mei.mesh=spriteMesh(humanFrames({hair:'#1b1b2b',skin:'#e2b48a',shirt:'#3e7d5c',pants:'#2f3b5c',hat:null}),.95,1.58);mei.mesh.position.set(mei.x,0,mei.z);scene.add(mei.mesh);blob(.9).position.set(mei.x,.03,mei.z);
const ruth={x:151.4,z:-3.1};ruth.mesh=spriteMesh(humanFrames({hair:'#9b3b22',hat:'#24305a',skin:'#f1c7a0',shirt:'#f3efe6',pants:'#24305a'}),.95,1.58);ruth.mesh.position.set(ruth.x,0,ruth.z);scene.add(ruth.mesh);blob(.9).position.set(ruth.x,.03,ruth.z);
const shopkeepers=[['market',{hair:'#1b1b2b',skin:'#c68a5e',shirt:'#c8344a',pants:'#2f3b5c',hat:null}],['servo',{hair:'#6b4226',skin:'#f1c7a0',shirt:'#2f6fb0',pants:'#4a4a4a',hat:'#2f6fb0'}],['seeds',{hair:'#d9b25a',skin:'#f1c7a0',shirt:'#3e7d5c',pants:'#c9b68a',hat:'#e8d4a0'}]].map(([id,v])=>{const P=SHOP_POS[id];const m=spriteMesh(humanFrames(v),.95,1.58);const x=P.x+(id==='servo'?1.9:-.9),z=P.z+(id==='servo'?.6:1.75);m.position.set(x,0,z);scene.add(m);blob(.85).position.set(x,.03,z);return{id,x,z};});
const gus={x:-11.5,z:3.6};gus.mesh=spriteMesh(humanFrames({hair:'#d8d4cc',hat:'#24305a',skin:'#d9a173',shirt:'#f3efe6',pants:'#24305a'}),.95,1.58);gus.mesh.position.set(gus.x,0,gus.z);scene.add(gus.mesh);blob(.9).position.set(gus.x,.03,gus.z);
const wren={x:30.8,z:-2.6};wren.mesh=spriteMesh([pix(WREN,{o:'#1d2238',u:'#3f7fe0',e:'#ffffff',y:'#e8a33a',w:'#e9e2d0',b:'#7a6248'})],.75,.75);wren.mesh.position.set(wren.x,0,wren.z);scene.add(wren.mesh);blob(.6).position.set(wren.x,.03,wren.z);
const exclFor=t=>{const m=spriteMesh([pix(ICONS.excl,{o:'#2a1d1a',y:'#ffd34d'})],.32,.38,{basic:true,shadow:false});scene.add(m);return m;};
gus.excl=exclFor();wren.excl=exclFor();

const wilds=[[12.5,4.5],[16,-3.5],[25,3.5],[37,2],[-2,7.6],[19.5,-7.5],[28.5,7.6],[33,-2.6],[44,6],[48,-1],[8,-6.4],[-6.5,-3.6],[22,9.4],[39,-5.4]].map(([x,z],i)=>{const q={x,z,hx:x,hz:z,tx:x,tz:z,wait:R()*3,face:1,walkT:0,hop:R()*6};q.mesh=spriteMesh(quokkaFrames(false),.8,.8);scene.add(q.mesh);q.blob=blob(.6);return q;});
[[58,.8],[66,5],[75,1.4],[86,3],[92,-1.5],[78.5,-3.6],[54,4.2],[62,-4.4],[70,6.4],[82,-2.4],[88,5.6],[95,1.4]].forEach(([x,z])=>{const q={x,z,hx:x,hz:z,tx:x,tz:z,wait:Math.random()*3,face:1,walkT:0,hop:Math.random()*6};q.mesh=spriteMesh(quokkaFrames(false),.8,.8);scene.add(q.mesh);q.blob=blob(.6);wilds.push(q);});
[['#c8344a',VILLAGE.x-1.4,VILLAGE.z+1.4],['#2f78a8',VILLAGE.x+1.8,VILLAGE.z-.6],['#e8a33a',VILLAGE.x+.6,VILLAGE.z+2],['#9478d4',VILLAGE.x-1.8,VILLAGE.z-1],['#3e7d5c',VILLAGE.x+2.2,VILLAGE.z+1.6]].forEach(([c,x,z])=>{const q={x,z,hx:x,hz:z,tx:x,tz:z,wait:Math.random()*3,face:1,walkT:0,hop:Math.random()*6,villager:c};q.mesh=spriteMesh(quokkaFrames(c),1,1);scene.add(q.mesh);q.blob=blob(.75);wilds.push(q);});
const SHELLS=[{x:37,z:9.6},{x:42.6,z:7},{x:43.4,z:10.3}];
SHELLS.forEach(s=>{s.mesh=spriteMesh([iconCanvas('shell')],.55,.55,{basic:true,shadow:false});s.mesh.visible=false;scene.add(s.mesh);});

const customers=[];
const SKINS=['#f1c7a0','#e2b48a','#c68a5e','#8d5a3b'];
const HAIRS=['#2a1d16','#6b4226','#d9b25a','#9b3b22','#1b1b2b','#c9c2b4'];
const SHIRTS=['#e45a5a','#3f86d6','#f1c64a','#5bb48a','#c46ad6','#ffffff','#f08a3c'];
const PANTS=['#2f3b5c','#c9b68a','#4a4a4a','#5e7fa8'];
const HATS=[null,null,null,'#f3e2b0','#e8d4a0','#d24d4d'];
const pick=a=>a[Math.random()*a.length|0];

