// ===== 8. light: render to a target, then the towns' post look (depth outline, warm light / cool shade), heat shimmer over the outback =====
const rt=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true});rt.texture.encoding=THREE.sRGBEncoding;rt.depthTexture=new THREE.DepthTexture(2,2);rt.depthTexture.type=THREE.UnsignedIntType;
const post=new THREE.ShaderMaterial({uniforms:{tD:{value:rt.texture},tZ:{value:rt.depthTexture},res:{value:new THREE.Vector2(2,2)},nf:{value:new THREE.Vector2(cam.near,cam.far)},tint:{value:new THREE.Vector3(1,1,1)},uT:{value:0},uSh:{value:0}},
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:`uniform sampler2D tD,tZ;uniform vec2 res,nf;uniform vec3 tint;uniform float uT,uSh;varying vec2 vUv;
float lz(vec2 u){float d=texture2D(tZ,u).x;return nf.x*nf.y/(nf.y-d*(nf.y-nf.x));}
void main(){vec2 uv=vUv;float z=lz(uv);
 if(uSh>.01&&z>110.){float k=uSh*smoothstep(110.,260.,z);uv.x+=sin(uv.y*res.y*.7+uT*7.)*k*1.2/res.x;uv.y+=sin(uv.x*res.x*.3+uT*5.)*k*.5/res.y;}
 vec3 col=texture2D(tD,uv).rgb;vec2 o=1./res;
 float e=max(max(lz(uv+vec2(o.x,0.)),lz(uv-vec2(o.x,0.))),max(lz(uv+vec2(0.,o.y)),lz(uv-vec2(0.,o.y))))-z;
 if(z<400.)col=mix(col,col*vec3(.34,.3,.4),smoothstep(.06+z*.03,.12+z*.07,e)*.8);
 col*=tint;float L0=dot(col,vec3(.299,.587,.114));col*=mix(vec3(.96,.99,1.03),vec3(1.04,1.01,.95),smoothstep(.25,.7,L0));
 float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,1.08);col=(col-.5)*1.06+.5;col=mix(col*vec3(.92,.97,1.08),col,smoothstep(.15,.6,l));
 vec2 q=vUv-.5;col*=1.-dot(q,q)*.5;gl_FragColor=vec4(col,1.);}`,depthTest:false,depthWrite:false});
const pScene=new THREE.Scene(),pCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);pScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),post));
const vs=new THREE.Vector2();
O.render=function(dt){dt=Math.max(0,Math.min(.05,dt||0));O.t+=dt;const t=O.t;PU.uT.value=t;O.WU.uT.value=t;post.uniforms.uT.value=t;
  const px=ST.inCar?ST.carX:ST.x,pz=ST.inCar?ST.carZ:ST.z;GU.uCam.value.set(px,0,pz);O.obMats.forEach(m=>m.userData.U.uCam.value.set(px,0,pz));
  // dusk: windows, lamps, the bell tower and the lighthouse light up; the plants get a golden rim
  const n=ST.night?1:0;O.glowK+=(n-O.glowK)*Math.min(1,dt*2);const gk=O.glowK;O.glow.forEach(m=>m.emissiveIntensity=gk*1.1);
  plantMat.emissive.setRGB(.10+.22*gk,.07+.12*gk,.02);(O.lamps||[]).forEach(l=>l.material.color.set(gk>.5?0xffe2a0:0x3a3a30));
  if(O.bell)O.bell.material.color.setRGB(.9+.1*gk,.85+.1*gk,.6+.3*gk*Math.abs(Math.sin(t*1.3)));(O.beacons||[]).forEach((b,i)=>b.visible=gk>.3&&Math.sin(t*3+i)>0);
  if(O.beam){O.beam.rotation.y=t*.9;O.beamM.opacity=gk*.85;O.lighthouseLamp.material.color.setRGB(1,.95,.7+.3*gk);}
  if(O.train){const T2=O.train;if(T2.wait>0)T2.wait-=dt;else{const ps=T2.s;T2.s+=T2.dir*14*dt;if(T2.s>O.trainLen-8||T2.s<8){T2.s=Math.max(8,Math.min(O.trainLen-8,T2.s));T2.dir*=-1;T2.wait=3;}else for(const st of T2.stops){if((ps-st)*(T2.s-st)<0){T2.wait=2.5;T2.s=st;break;}}}
    T2.cars.forEach((c,k)=>{const p=O.trainAt(T2.s-T2.dir*k*4.6);c.position.set(p.x,deckH(p.x,p.z)+.2,p.z);c.rotation.y=p.a;});}
  if(O.traffic)O.traffic(dt,px,pz);
  (O.signals||[]).forEach(s=>{const[ax,st]=O.signalPhase(s,O.t);s.heads.forEach(h=>{const on=h.axis===ax?st:'r';h.L[0].material.color.set(on==='r'?0xff3a2a:0x3a1010);h.L[1].material.color.set(on==='a'?0xffb020:0x3a2a08);h.L[2].material.color.set(on==='g'?0x3aff6a:0x0a2a12);});});if(O.jettyTrain){const J=O.jettyTrain;J.g.position.z=(Math.sin(O.t*.11)*.5+.5)*(J.L-8)+5;}(O.beacons2||[]).forEach((b,i)=>{b.bm.material.opacity=.16+.12*Math.sin(O.t*2.4+i);b.arr.position.y=4.4+Math.sin(O.t*3+i)*.35;});if(O.cbdG)O.cbdDet.visible=Math.hypot(cam.position.x-O.cbdG.position.x,cam.position.z-O.cbdG.position.z)<170;if(O.wheel)O.wheel.rotation.z=t*.08;if(O.sails)O.sails.rotation.z=t*.25;if(O.ferry)O.ferry.position.y=Math.sin(t*1.4)*.06;
  post.uniforms.tint.value.set(1+.04*gk,1,1-.05*gk);
  if(SOUTH&&pz>WZ+2){const S=SOUTH,[s0,t0]=S.st(px,pz),km=S.km(s0),T=S.SD0.towns,tn=T.find(w=>Math.abs(w[1]-s0)<30&&Math.abs(t0)<40),nx=T.find(w=>w[1]>s0+30);
    const el=document.getElementById('ow_pName'),en=document.getElementById('ow_pNote');if(el&&en&&!document.getElementById('ow_bAct').textContent.match(/Park|Enter/)){
      if(tn){el.textContent=tn[0];en.textContent=(tn[0]==='Busselton'?'Bay town with the long jetty':tn[0]==='Esperance'?'Bright white beaches · Lucky Bay is close':'Country town')+' · '+tn[2]+' km from Perth';}
      else if(Math.abs(t0)<3){el.textContent=s0<1136?'Forrest Hwy':s0<1500?'Bussell Hwy':s0<2662?'South Western Hwy':'South Coast Hwy';en.textContent=km+' km from Perth'+(nx?' · '+nx[0]+' '+Math.max(1,nx[2]-km)+' km':'');}
      else{const c=S.cls(px,pz);el.textContent=['Southern Ocean','Beach','Coastal heath','Farmland','Wheatbelt paddocks','Karri forest','Mallee country','Town'][c]||'The south-west';en.textContent=km+' km from Perth';}}
    if(!S.mini){const c=document.createElement('canvas'),W=Math.ceil((S.CX+S.LC+40)/6),Hh=Math.ceil((S.LA+S.RR+340)/6);c.width=W;c.height=Hh;const x=c.getContext('2d');x.fillStyle='#22546e';x.fillRect(0,0,W,Hh);
      for(let r=0;r<S.NRW;r++)for(let k=0;k<S.NC;k++){const i=r*S.NC+k;if(!S.data.LN[i])continue;const[wx,wz]=S.world(r*S.CE,S.T0+k*S.CE);x.fillStyle=['#22546e','#d6c896','#708a5c','#78964f','#a09a5c','#3e5a36','#b06a3c','#aaa69c'][CL_S(wx,wz)];x.fillRect(wx/6,(wz-WZ+40)/6,1.6,1.6);}
      x.strokeStyle='#e8e0c8';x.beginPath();S.road.forEach((p,i)=>i?x.lineTo(p[0]/6,(p[1]-WZ+40)/6):x.moveTo(p[0]/6,(p[1]-WZ+40)/6));x.stroke();S.SD0.towns.forEach(w=>{const[a,b]=S.world(w[1],0);x.fillStyle='#ffd34d';x.fillRect(a/6-1,(b-WZ+40)/6-1,3,3);});S.mini=c;}
    mmx.fillStyle='#22546e';mmx.fillRect(0,0,150,100);mmx.drawImage(S.mini,75-px/6,50-(pz-WZ+40)/6);mmx.fillStyle='#fff';mmx.fillRect(74,49,3,3);mmx.fillStyle='rgba(20,26,46,.75)';mmx.fillRect(0,88,150,12);mmx.fillStyle='#ffd34d';mmx.font='9px monospace';const nx2=S.SD0.towns.find(w=>w[1]>s0+30);mmx.fillText(nx2?km+' km · '+nx2[0]+' '+Math.max(1,nx2[2]-km)+' km':km+' km from Perth',4,97);}
  // the outback: heat shimmer close to it by day; the little car can't go off-road into it
  const dOB=z0=>{if(SOUTH&&pz>WZ)return SOUTH.T1-SOUTH.st(px,pz)[1];return pz>=0?WX-px:X1-px;};const near=Math.max(0,1-Math.max(0,dOB())/140);post.uniforms.uSh.value=near*(1-gk);
  const mx=px-O.lastX,mz=pz-O.lastZ,ml=Math.hypot(mx,mz);if(ml>.02){O.dir=[mx/ml,mz/ml];}O.lastX=px;O.lastZ=pz;
  let dx,dz;if(ST.inCar){const sg=ST.speed<-.2?-1:1;dx=Math.sin(ST.carA)*sg;dz=Math.cos(ST.carA)*sg;}else[dx,dz]=O.dir;
  const prx=px+dx*2.6,prz=pz+dz*2.6,pressing=ST.inCar?(DRV.g||DRV.b||keys.arrowup||keys.w||keys.arrowdown||keys.s||Math.abs(ST.speed)>.5):(ml>.02||!!stick||keys.w||keys.a||keys.s||keys.d||keys.arrowup||keys.arrowdown||keys.arrowleft||keys.arrowright);
  const nowW=performance.now();if(pressing&&isOB(prx,prz)&&!onRoad(prx,prz,2.6)&&!ST.ride){if(!(nowW-O.warnAt<4000)){O.warnAt=nowW;O.warnN=(O.warnN||0)+1;say(ST.inCar?'Your little car can\'t go off-road into the outback — stay on the main roads':'That\'s the outback out there — too far to walk. Stay on the main roads',3.6);}
    if(ST.inCar){ST.speed=-Math.sign(ST.speed||1)*2.5;const bx=ST.carX-dx*.25,bz=ST.carZ-dz*.25;if(canGo(bx,bz)){ST.carX=bx;ST.carZ=bz;}}else{const bx=ST.x-dx*.35,bz=ST.z-dz*.35;if(canGo(bx,bz)){ST.x=bx;ST.z=bz;}}}
  // tufts follow Kip; far plant chunks are skipped
  if(Math.hypot(px-O.tuftAt[0],pz-O.tuftAt[1])>3){O.tuft(px,pz);O.tuftAt=[px,pz];}
  if(((t*4)|0)!==O.ck){O.ck=(t*4)|0;const cx=cam.position.x,cz=cam.position.z;O.chunks.forEach(c=>{const u=c.userData.c;c.visible=Math.hypot(u[0]-cx,u[1]-cz)<360+u[2];});}
  renderer.getDrawingBufferSize(vs);if(rt.width!==vs.x||rt.height!==vs.y){rt.setSize(vs.x,vs.y);post.uniforms.res.value.copy(vs);}
  renderer.setRenderTarget(rt);renderer.render(scene,cam);renderer.setRenderTarget(null);renderer.render(pScene,pCam);};
window.__OWT=O;}

try{NORTHbuild();}catch(e){console.error('north',e);}L2objects();try{OWBAKE2();NORTHpost();}catch(e){console.error('owbake',e);}try{OWTOWN();}catch(e){console.error('owtown',e);OWT=null;}sortLayers();LAYERS.forEach(([id,n,c],i)=>{const l=document.createElement('label');l.innerHTML=`<input type="checkbox" checked id="ly${i}"><i style="background:${c}"></i><span>${i+1}. ${n}</span><small>${LCOUNT[i]}</small>`;$('ow_laylist').appendChild(l);l.querySelector('input').onchange=e=>{layOn[i]=e.target.checked;applyLayers();};});applyLayers();

