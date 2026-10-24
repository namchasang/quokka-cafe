// ---------- animated waves rolling onto the beaches ----------
function makeWaveTex(){const d=new Uint8Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++){const v=Dg[j*GW+i];d[j*GW+i]=Math.round(clamp((v+6)/9,0,1)*255);}const t=new THREE.DataTexture(d,GW,GH,THREE.LuminanceFormat,THREE.UnsignedByteType);t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;t.needsUpdate=true;return t;}
const waveTex=makeWaveTex();
const waveMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{tD:{value:waveTex},uT:{value:0},uB:{value:new THREE.Vector4(TB.x1,TB.z1,TB.x2-TB.x1,TB.z2-TB.z1)},uL:{value:1},uSurf:{value:new THREE.Vector2(82,11)},uMir:{value:1}},
  vertexShader:'uniform float uMir;varying vec2 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=vec2(w.x*uMir,w.z);gl_Position=projectionMatrix*viewMatrix*w;}',
  fragmentShader:['uniform sampler2D tD;uniform float uT;uniform vec4 uB;uniform float uL;uniform vec2 uSurf;varying vec2 vW;',
   'void main(){vec2 uv=(vW-uB.xy)/uB.zw;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)discard;float d=texture2D(tD,uv).r*9.-6.;if(d>.2)discard;',
   'float surf=1.+1.4*exp(-dot(vW-uSurf,vW-uSurf)/40.);float wob=sin(vW.x*.7+uT*.6)*.25+sin(vW.y*.9-uT*.4)*.2;',
   'float ph=fract(-d*.38/surf+uT*.2+wob*.12);float crest=smoothstep(.78,.93,ph)*(1.-smoothstep(.95,1.,ph));float band=smoothstep(-5.*surf,-.6,d)*(1.-smoothstep(-.1,.18,d));',
   'float sw=.5+.5*sin(uT*.9+vW.x*.15+vW.y*.1);float swash=(1.-smoothstep(0.,.32,abs(d+.05+sw*.35)))*.85;float a=max(crest*band*(.7+.3*surf),swash*step(d,.12));',
   'if(a<.02)discard;gl_FragColor=vec4(vec3(.96,.99,1.)*uL,min(1.,a*1.05));}'].join('\n')});
const waves=flat(TB.x2-TB.x1,TB.z2-TB.z1,waveMat,(TB.x1+TB.x2)/2,-.1,(TB.z1+TB.z2)/2);waves.receiveShadow=false;waves.renderOrder=2;

// potted plants on deck
[[-4.6,3.1],[4.6,3.1],[-4.5,-1.9],[4.5,-1.9]].forEach(([x,z])=>{box(.45,.4,.45,new THREE.MeshLambertMaterial({color:0xc46a3c}),x,.36,z);const v=bushVariants[0];const g=new THREE.PlaneGeometry(1.1,.7);g.translate(0,.5,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,.3,z);scene.add(m);BB.push(m);col(x-.25,z-.25,x+.25,z+.25);});

// ---------- Rottnest details ----------
function outlineCanvas(c,rgb){const x=c.getContext('2d'),W=c.width,H=c.height,img=x.getImageData(0,0,W,H),d=img.data,out=new Uint8ClampedArray(d);
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const k=(py*W+px)*4;if(d[k+3])continue;let n=false;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const X=px+a,Y=py+b;if(X>=0&&Y>=0&&X<W&&Y<H&&d[(Y*W+X)*4+3])n=true;});if(n){out[k]=rgb[0];out[k+1]=rgb[1];out[k+2]=rgb[2];out[k+3]=255;}}
  img.data.set(out);x.putImageData(img,0,0);return c;}
function pineVariant(){const r=mulberry32(404);const W=24,H=52,c=mk(W,H),x=c.getContext('2d');x.fillStyle='#3a2416';x.fillRect(10,40,4,12);x.fillStyle='#6b4428';x.fillRect(11,40,2,12);
  const cols=['#1f4430','#2c5a3c','#3d7048','#5d8f57'];
  for(let py=1;py<44;py++){const tier=(py%7)/7;const hw=Math.min(11,(py/44)*10*(.7+tier*.5)+1);for(let px=0;px<W;px++){const dx=px-11.5;if(Math.abs(dx)>hw)continue;if(r()<.1&&Math.abs(dx)>hw-1.5)continue;
    const sh=(-dx/hw)*.6+(1-tier)*.35;let idx=sh>.55?3:sh>.15?2:sh>-.25?1:0;if(r()<.1)idx=Math.max(0,idx-1);x.fillStyle=cols[idx];x.fillRect(px,py,1,1);}}
  outlineCanvas(c,[22,40,28]);const t=ctex(c);
  return{t,w:2.5,h:5.4,m:new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t}),f:new THREE.MeshLambertMaterial({map:t,alphaTest:.02,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}),d:new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:t,alphaTest:.5})};}
function tussockCanvas(seed,cols){const r=mulberry32(seed);const c=mk(14,10),x=c.getContext('2d');for(let i=0;i<18;i++){const bx=2+r()*10|0,h=3+r()*6|0,lean=(r()-.5)*1.8;x.fillStyle=cols[i%cols.length];for(let k=0;k<h;k++)x.fillRect(Math.round(bx+lean*k/h*2),9-k,1,1);}x.fillStyle=cols[0];x.fillRect(3,9,8,1);return c;}
const tussockMats=[tussockCanvas(301,['#5f8a3e','#7fa651','#a7c46d']),tussockCanvas(302,['#6d8f68','#93b48a','#c2d6a8']),tussockCanvas(303,['#8c9a52','#b4b867','#d6d08a'])].map(cv=>{const t=ctex(cv);return new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,emissive:new THREE.Color(.12,.12,.1),emissiveMap:t});});
tussockMats.forEach(m=>DECOR_MATS.add(m));
for(let i=0,n=0;i<2200&&n<160;i++){const x=-15+R()*63,z=-11.5+R()*25;const dd=landD(x,z);if(dd<.25||pathD(x,z)<.9||inGarden(x,z))continue;
  if(x>-5.6&&x<5.6&&z>-5.4&&z<4)continue;if(x>4&&x<36&&Math.abs(z)<.95)continue;if(x>38.5&&z<-5.8)continue;if(Math.hypot(x-33.5,z+6.3)<1.8)continue;if(x<-12.4&&z>4&&z<6)continue;
  const sandy=dd<1.3||z>9||(x>32&&z>4);const mi=sandy?1:(R()<.5?0:2);const s=.7+R()*.6;const g=new THREE.PlaneGeometry(1.1*s,.8*s);g.translate(0,.4*s,0);const m=new THREE.Mesh(g,tussockMats[mi]);m.position.set(x,0,z);scene.add(m);BB.push(m);n++;}
// limestone outcrops
const limeMat=new THREE.MeshLambertMaterial({color:0xe6dbc2,flatShading:true}),limeDark=new THREE.MeshLambertMaterial({color:0xc8b898,flatShading:true});
function outcrop(x,z,n,collide){for(let i=0;i<n;i++){const s=.35+R()*.7;const m=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),R()<.55?limeMat:limeDark);m.position.set(x+(R()-.5)*1.7,s*.3,z+(R()-.5)*1.1);m.scale.y=.5+R()*.4;m.rotation.set(R(),R()*3,R());m.castShadow=m.receiveShadow=true;scene.add(m);}if(collide)col(x-1.1,z-.7,x+1.1,z+.7);}
for(let i=0,n=0;i<3000&&n<24;i++){const x=-16+R()*66,z=-13+R()*29;const d=landD(x,z);if(d<-.7||d>.35)continue;if(z>8&&x>-8&&x<46)continue;if(x<-11&&Math.abs(z-5)<2.5)continue;outcrop(x,z,2+(R()*3|0),false);n++;}
[[17,-6.6],[26,-6.2],[40.5,1.2]].forEach(([x,z])=>outcrop(x,z,3,true));
// bikes (no cars on Rottnest)
function bikeCanvas(fc){const c=mk(24,14),x=c.getContext('2d');const P=(a,b,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),1,1);};
  const wheel=(cx,cy)=>{for(let a=0;a<64;a++){const t=a/64*6.283;P(cx+Math.cos(t)*4.4,cy+Math.sin(t)*4.4,'#24242a');}P(cx,cy,'#9a9aa0');};
  const line=(x0,y0,x1,y1,col)=>{const n=Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2);for(let i=0;i<=n;i++)P(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,col);};
  wheel(5,8.6);wheel(18,8.6);line(5,8.6,10,8.6,fc);line(10,8.6,16,3.5,fc);line(5,8.6,9,3.5,fc);line(9,3.5,16,3.5,fc);line(16,3.5,18,8.6,fc);line(9,3.5,8.5,1.5,fc);line(16,3.5,16.5,1,'#24242a');
  x.fillStyle='#3a2a20';x.fillRect(6,1,5,1);x.fillStyle='#24242a';x.fillRect(15,0,4,1);x.fillStyle='#c8b48a';x.fillRect(18,2,4,3);return c;}
box(2.6,.08,.08,new THREE.MeshLambertMaterial({color:0x9aa0a8}),7.4,.55,2.75);[6.2,8.6].forEach(x=>box(.08,.55,.08,new THREE.MeshLambertMaterial({color:0x9aa0a8}),x,.28,2.75));
['#2f7fd0','#e2584f','#f1c64a'].forEach((fc,i)=>{const b=spriteMesh([bikeCanvas(fc)],1.6,.95);b.position.set(6.7+i*.7,0,2.95+i*.05);scene.add(b);});col(6.1,2.6,8.7,3.25);
// signpost
const sgC=mk(64,28);function drawSg(){const x=sgC.getContext('2d');x.fillStyle='#7a5033';x.fillRect(0,0,64,28);x.fillStyle='#5a3a22';x.fillRect(0,13,64,2);x.fillRect(0,0,64,1);x.fillRect(0,27,64,1);x.fillStyle='#f5ecd8';x.font='bold 9px "Pixelify Sans", monospace';x.textBaseline='middle';x.fillText('LIGHTHOUSE ›',4,7);x.fillText('EAST BEACH ›',4,21);}
drawSg();const sgTex=ctex(sgC);SIGN_TEX.add(sgTex);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{drawSg();sgTex.needsUpdate=true;});
box(.12,1.7,.12,legMat,6,.85,-1.5);const sgM=new THREE.Mesh(new THREE.PlaneGeometry(1.6,.7),new THREE.MeshLambertMaterial({map:sgTex,side:THREE.DoubleSide,emissive:0x222222,emissiveMap:sgTex}));sgM.position.set(6,1.45,-1.43);sgM.castShadow=true;scene.add(sgM);col(5.85,-1.65,6.15,-1.35);
// beach umbrellas + towels
[[39.5,8.4,'#3f86d6'],[44,9.2,'#e2584f']].forEach(([x,z,tc])=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2,6),new THREE.MeshLambertMaterial({color:0xf3efe6}));p.position.set(x,1,z);p.castShadow=true;scene.add(p);
  const u=new THREE.Mesh(new THREE.ConeGeometry(1.15,.5,10,1,true),lmat(awnC,[5,1],{side:THREE.DoubleSide}));u.position.set(x,2.1,z);u.castShadow=true;scene.add(u);
  flat(.9,1.7,new THREE.MeshLambertMaterial({color:new THREE.Color(tc)}),x+.9,.025,z+.5);col(x-.12,z-.12,x+.12,z+.12);});
// shoreline foam + sun sparkle on the water
const sparkWaterC=(()=>{const c=mk(32,32),x=c.getContext('2d');const r=mulberry32(55);x.fillStyle='#ffffff';for(let i=0;i<6;i++)x.fillRect(r()*32|0,r()*32|0,1+(r()*2|0),1);return c;})();
const sparkWater=flat(640,640,new THREE.MeshBasicMaterial({map:ctex(sparkWaterC,{rep:[220,220]}),transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending}),70,-.14,2);sparkWater.receiveShadow=false;
// seagulls
const GULL_A=["g..........g","gg........gg",".gww....wwg.","..wwwwwwwwy.","....wwww....","............"];
const GULL_B=["............","............","..wwwwwwwwy.",".gwwwwwwwwg.","gg........gg","g..........g"];
const gullPal={g:'#7d8590',w:'#f4f4f0',y:'#e8a33a'};
const gulls=[0,1,2].map(i=>{const m=spriteMesh([pix(GULL_A,gullPal),pix(GULL_B,gullPal)],.9,.45,{shadow:false});scene.add(m);const sh=blob(.6);sh.material.opacity=.5;return{m,sh,ph:i*2.1,r:5+i*1.8,h:4.2+i*.6,sp:.32+i*.07};});
// weather
const WEATHERS=[
 {label:'Sunny',icon:'☀',temp:[24,28],cloud:0,rain:0,wind:.25,sun:1},
 {label:'Partly cloudy',icon:'☁',temp:[22,25],cloud:.3,rain:0,wind:.35,sun:.82},
 {label:'Fremantle Doctor',icon:'≋',temp:[21,24],cloud:.12,rain:0,wind:1,sun:.95},
 {label:'Showers',icon:'☂',temp:[17,20],cloud:.42,rain:1,wind:.6,sun:.55}];
const wxC={cloud:0,rain:0,wind:.25,sun:1};
const FOG_RAIN=new THREE.Color('#8e9ea6');
const cloudC=(()=>{const S2=128,c=mk(S2,S2),x=c.getContext('2d');const r=mulberry32(88);for(let i=0;i<14;i++){const cx=r()*S2,cy=r()*S2,rad=12+r()*22;for(const ox of [-S2,0,S2])for(const oy of [-S2,0,S2]){const g=x.createRadialGradient(cx+ox,cy+oy,rad*.2,cx+ox,cy+oy,rad);g.addColorStop(0,'rgba(0,0,0,.9)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.beginPath();x.arc(cx+ox,cy+oy,rad,0,6.283);x.fill();}}return c;})();
const cloudTex=ctex(cloudC,{rep:[2,1.1]});cloudTex.magFilter=THREE.LinearFilter;
const clouds=flat(90,48,new THREE.MeshBasicMaterial({map:cloudTex,transparent:true,opacity:0,depthWrite:false,color:0x1a2030}),16,.19,1.6);clouds.receiveShadow=false;clouds.renderOrder=2;
const RAIN=320,rainPos=new Float32Array(RAIN*6),rainSeed=[];for(let i=0;i<RAIN;i++)rainSeed.push([R()*30-15,R()*9,R()*24-12,.8+R()*.5]);
const rainGeo=new THREE.BufferGeometry();rainGeo.setAttribute('position',new THREE.BufferAttribute(rainPos,3));
const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xd6ecf5,transparent:true,opacity:0,depthWrite:false}));rain.frustumCulled=false;rain.visible=false;scene.add(rain);
function rollWeather(){const r=Math.random(),se=S.day?seasonOf(S.day):0;const W4=[[.55,.78,.93],[.42,.68,.86],[.3,.55,.7],[.45,.72,.88]][se];S.wx=r<W4[0]?0:r<W4[1]?1:r<W4[2]?2:3;const w=WEATHERS[S.wx];S.temp=w.temp[0]+Math.floor(Math.random()*(w.temp[1]-w.temp[0]+1));}
function weatherTick(dt,t){const W=WEATHERS[(typeof S!=='undefined'&&S.wx)||0];const k=Math.min(1,dt*.8);['cloud','rain','wind','sun'].forEach(p=>{wxC[p]+=(W[p]-wxC[p])*k;});
  clouds.material.opacity=wxC.cloud;cloudTex.offset.set((t*.006*(1+wxC.wind))%1,(t*.002)%1);
  sparkWater.material.opacity=.55*wxC.sun*(1-wxC.cloud);sparkWater.material.map.offset.set((-t*.02*(1+wxC.wind))%1,(t*.008)%1);
  foam.material.opacity=.75+Math.sin(t*1.4)*.2;
  const dist=Math.min(52,camDist*zm);scene.fog.near=dist+5-wxC.rain*8;scene.fog.far=dist+30-wxC.rain*10;scene.fog.color.copy(FOG).lerp(FOG_RAIN,wxC.rain).lerp(NIGHT_FOG,NIGHT);scene.background.copy(scene.fog.color);
  motes.material.opacity=.85*(1-wxC.rain);nightTick(dt,t);brGuestsTick();freoTick(dt,t);zoneTick(dt,t);westTick(dt,t);waveMat.uniforms.uT.value=t;waveMat.uniforms.uL.value=1-NIGHT*.55;trafficTick(dt,t);dailyTick(dt);unlockTick(dt);if(overlay==='fish')fishTick(dt);
  rain.visible=wxC.rain>.02;if(rain.visible){rain.material.opacity=.55*wxC.rain;const lean=.12+wxC.wind*.25;for(let i=0;i<RAIN;i++){const s=rainSeed[i];const y=((s[1]-t*11*s[3])%9+9)%9;const x=camTarget.x+s[0],z=camTarget.z+s[2];const o=i*6;rainPos[o]=x;rainPos[o+1]=y;rainPos[o+2]=z;rainPos[o+3]=x+lean;rainPos[o+4]=y-.5;rainPos[o+5]=z;}rainGeo.attributes.position.needsUpdate=true;}
  ferry2.position.y=-.15+Math.sin(t*1.2+1)*.05;
  snorks.forEach((sn,i)=>{sn.m.position.y=-.27+Math.sin(t*2+i*1.7)*.04;});
  for(const tr of trees)tr.m.rotation.z=Math.sin(t*1.6+tr.x*.7)*(.01+.055*wxC.wind);
  gulls.forEach(g=>{const a=t*g.sp+g.ph;const x=camTarget.x+Math.cos(a)*g.r,z=camTarget.z+Math.sin(a)*g.r*.6-2;g.m.position.set(x,g.h+Math.sin(t*2+g.ph)*.2,z);setFrame(g.m,Math.floor(t*4+g.ph)%2);
    const dx=-Math.sin(a),dz=Math.cos(a)*.6;g.m.scale.x=(dx*Math.cos(yaw)-dz*Math.sin(yaw))>0?1:-1;g.sh.position.set(x+1.2,.04,z-.6);});}

