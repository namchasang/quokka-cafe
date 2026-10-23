// ---------- ambient crowds: tourists, joggers, cyclists in every zone ----------
const WALK_ROUTES={
 island:[[[5,.4],[31,.4]],[[30.6,-3.6],[26,-7.6],[21,-9.2]],[[35,-.2],[40.5,-2.4],[45.4,-3.8]],[[-6,10.6],[12,10.9]],[[36,7.4],[44.5,8.6]],[[13,0],[11.6,-4.8]],[[-5.4,-1],[-6.2,-6.4],[1.5,-6.6]],[[31,.2],[31,-5]]],
 sp:[[[115,-3.2],[168,-3.2]],[[115,20.7],[198,20.7]],[[170,23.7],[198,23.7]],[[178,11.5],[178,20.4]],[[125,11.5],[125,20.5]],[[140,11.5],[140,20.5]],[[147.6,11],[147.6,20.4]],[[152.4,11],[152.4,20.4]],[[146,.5],[155,.5]],[[132,5.8],[168,6.4]]],
 freo:[[[279,-2.2],[320,-2.2]],[[302.4,-1.5],[302.4,21]],[[305.6,-1.5],[305.6,21]],[[281,4.6],[303,4.6]],[[283,8],[298,8],[298,12.6],[283,12.6],[283,8]],[[306,20.6],[332,20.6]],[[307,-8.8],[316,-8.8]],[[293,13.6],[279,13.6]]]};
WALK_ROUTES.hi=[[[407,5.2],[433,5.2]],[[433,5],[433,-8]],[[408,-8.6],[428,-8.6]]];WALK_ROUTES.vp=[[[490,-1.6],[560,-1.6]],[[490,1.6],[560,1.6]],[[500,4.6],[550,4.6]],[[500,9.4],[550,9.4]],[[492,-1.6],[492,-9.6],[556,-9.6]]];
const WALK_N={island:16,sp:10,freo:20,hi:6,vp:26};
const walkers=[];
(()=>{const r=mulberry32(4242);const looks=()=>({skin:SKINS[r()*SKINS.length|0],hair:HAIRS[r()*HAIRS.length|0],shirt:SHIRTS[r()*SHIRTS.length|0],pants:PANTS[r()*PANTS.length|0],hat:HATS[r()*HATS.length|0]});
  Object.keys(WALK_ROUTES).forEach(zone=>{const R=WALK_ROUTES[zone];for(let i=0;i<WALK_N[zone];i++){const route=R[i%R.length];const bike=zone==='island'&&i%4===3;
    const m=bike?spriteMesh([riderCv[i%4]],1.6,1.8):spriteMesh(humanFrames(looks()),.95,1.58);m.visible=false;scene.add(m);const sh=blob(.8);sh.visible=false;
    const seg=r()*(route.length-1)|0,t=r();const a=route[seg],b=route[seg+1];const w={zone,m,sh,route,seg,dir:r()<.5?1:-1,x:lerp(a[0],b[0],t),z:lerp(a[1],b[1],t),sp:bike?3.2:(1+r()*.8),off:(r()-.5)*.9,walkT:r()*5,face:1,bike,pause:0};walkers.push(w);}});})();
function walkerZone(){return zoneOf(player.x);}
function updateWalkers(dt){const zone=walkerZone(),rain=wxC.rain>.5,night=NIGHT>.6;
  walkers.forEach(w=>{const vis=w.zone===zone&&!(rain&&!w.bike&&walkers.indexOf(w)%3)&&!(night&&walkers.indexOf(w)%2);w.m.visible=vis;w.sh.visible=vis;if(!vis)return;
    if(w.pause>0){w.pause-=dt;setFrame(w.m,0);}else{let ni=w.seg+(w.dir>0?1:0);if(ni<0||ni>=w.route.length){w.dir*=-1;ni=w.seg+(w.dir>0?1:0);}
      const tg=w.route[clamp(ni,0,w.route.length-1)];const ox=w.off*(w.route===WALK_ROUTES.island[3]?0:1);
      if(stepWalker(w,tg[0]+ox*.3,tg[1]+ox,w.sp,dt)){w.seg=clamp(w.seg+w.dir,0,w.route.length-1);if(w.seg===0||w.seg===w.route.length-1){w.dir*=-1;if(Math.random()<.5)w.pause=1+Math.random()*3;}}
      if(!w.bike)setFrame(w.m,1+(Math.floor(w.walkT/.18)%2));}
    const gy=groundY(w.x,w.z);w.m.position.set(w.x,gy+(w.bike?Math.abs(Math.sin(w.walkT*14))*.03:0),w.z);w.m.scale.x=w.face;w.sh.position.set(w.x,gy+.03,w.z);});}

// ---------- zones ----------
function zoneOf(x){return x>470?'vp':x>380?'hi':x>250?'freo':x>100?'sp':'island';}
function hiWalk(x,z){return x>404.5&&x<435.5&&z>-9.6&&z<9.8;}
function vpWalk(x,z){return x>489&&x<561&&z>-10.2&&z<12;}
const HIB={x1:388,x2:452,z1:-12.75,z2:12.75},VPB={x1:488,x2:562,z1:-14.75,z2:14.75};
const ZONE_DEF={
 hi:{B:HIB,title:'Heirisson Island',eb:'Matagarup · Swan River',bg:'#2f78a8',rects:[[404,-10,436,10,'#f6f1e3'],[405,-9,435,9,'#7aa356'],[410,-7,430,3,'#a9c46d'],[392,-12.8,448,-10.2,'#8a8f99'],[407,4.6,433,5.8,'#ddd3bd'],[432.4,-9,433.6,5,'#ddd3bd']],labels:[['Heirisson Island',420,8.4,1],['Kangaroo sanctuary',420,-2,1],['Yagan Memorial',412,9.6,0],['The Causeway',420,-11.5,1],['Swan River',398,4,0],['Bus stop',432,-7.2,0]]},
 vp:{B:VPB,title:'Victoria Park',eb:'Albany Highway · Asian food town',bg:'#d8ccb4',rects:[[488,-1.2,562,1.2,'#4a4d55'],[488,-2,562,-1.2,'#ddd3bd'],[488,1.2,562,2,'#ddd3bd'],[498,3.1,552,10.1,'#b98552'],[491,4,497,10,'#7aa356'],[553,4,559,10,'#7aa356'],[488,-11.4,562,-10.6,'#6a5a4a'],[555.9,-9.2,561.3,-6.8,'#dfe6ec']],shops:true,labels:[['Albany Highway',525,.1,1],['Night market',525,10.8,1],['Victoria Park Station',558.6,-12.6,1],['Street mural',491,2.8,0]]}};
function renderZoneBase(id,W,H,s,all){const Z=ZONE_DEF[id],c=mk(W,H),x=c.getContext('2d'),m=mapper(W,H,Z.B);x.fillStyle=Z.bg;x.fillRect(0,0,W,H);
  const rect=(x1,z1,x2,z2,col)=>{x.fillStyle=col;x.fillRect(m.X(x1),m.Z(z1),m.X(x2)-m.X(x1),m.Z(z2)-m.Z(z1));};Z.rects.forEach(r=>rect(...r));
  if(Z.shops)VP_SHOPS.forEach(sh=>{rect(sh.x-2.6,sh.z-1.7,sh.x+2.6,sh.z+1.7,sh.col);});
  x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';const L=Z.labels.concat(Z.shops&&all?VP_SHOPS.map(sh=>[sh.name,sh.x,sh.z-2.6+(VP_SHOPS.indexOf(sh)%2)*-1.4,0]):[]);
  L.forEach(([t,lx,lz,mini])=>{if(!all&&!mini)return;x.font='800 '+Math.round(9*s)+'px "M PLUS Rounded 1c", sans-serif';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText(t,m.X(lx),m.Z(lz));x.fillStyle='#f5ecd8';x.fillText(t,m.X(lx),m.Z(lz));});
  x.font='800 '+Math.round(9*s)+'px "Pixelify Sans", monospace';x.textAlign='left';x.lineWidth=3*s;x.strokeStyle='rgba(15,20,38,.85)';x.strokeText('N↑',6*s,10*s);x.fillStyle='#ffd34d';x.fillText('N↑',6*s,10*s);return c;}
const zoneCache={};
// Top-down snapshot of the real 3D world (same look as the island map's painted terrain)
function zoneSnap(B,W,H){let c=null;const hid=[],flat=[];const fog=scene.fog,fn=fog&&fog.near,ff=fog&&fog.far,t0=S.time,sx=scene.scale.x;let rt2=null;
  try{rt2=new THREE.WebGLRenderTarget(W,H);const cw=B.x2-B.x1,ch=B.z2-B.z1,cx=(B.x1+B.x2)/2,cz=(B.z1+B.z2)/2;const cam=new THREE.OrthographicCamera(-cw/2,cw/2,ch/2,-ch/2,1,400);cam.position.set(cx,160,cz);cam.up.set(0,0,-1);cam.lookAt(cx,0,cz);
    [player.mesh,player.blob,questPin].forEach(m=>{if(m&&m.visible){m.visible=false;hid.push(m);}});
    BB.forEach(m=>{flat.push([m,m.rotation.x,m.rotation.y]);m.rotation.set(-Math.PI/2,0,0);});
    if(fog){fog.near=1e4;fog.far=2e4;}S.time=720;applyTime();scene.scale.x=1;
    renderer.setRenderTarget(rt2);renderer.render(scene,cam);const px=new Uint8Array(W*H*4);renderer.readRenderTargetPixels(rt2,0,0,W,H,px);
    c=mk(W,H);const x=c.getContext('2d'),id=x.createImageData(W,H);for(let y=0;y<H;y++)id.data.set(px.subarray((H-1-y)*W*4,(H-y)*W*4),y*W*4);x.putImageData(id,0,0);
    let sum=0;for(let i=0;i<px.length;i+=4000)sum+=px[i]+px[i+1]+px[i+2];if(sum===0)c=null;
  }catch(e){c=null;}finally{renderer.setRenderTarget(null);if(rt2)rt2.dispose();flat.forEach(([m,a,b])=>{m.rotation.x=a;m.rotation.y=b;});hid.forEach(m=>m.visible=true);if(fog){fog.near=fn;fog.far=ff;}S.time=t0;applyTime();scene.scale.x=sx;}
  return c;}
function labelsOnly(fn){const P=CanvasRenderingContext2D.prototype,keep={};['fill','fillRect','stroke','strokeRect','drawImage','clearRect','putImageData'].forEach(k=>{keep[k]=P[k];P[k]=function(){};});try{return fn();}finally{Object.assign(P,keep);}}
function zoneBase(z,big){const k=z+(big?'B':'m');if(zoneCache[k])return zoneCache[k];const W=big?1400:mmW,H=big?557:mmH,s=big?2.6:1.15;let c;
  const draw=()=>z==='island'?renderMapBase(W,H,s,big):z==='sp'?renderSPBase(W,H,s,big):z==='freo'?renderFreoBase(W,H,s,big):renderZoneBase(z,W,H,s,big);
  if(z==='island')return draw();const snap=zoneSnap(ZONE_B(z),W,H);
  if(snap){const lab=labelsOnly(draw);const x=snap.getContext('2d');x.drawImage(lab,0,0);c=snap;}else c=draw();
  zoneCache[k]=c;return c;}
const ZONE_B=z=>({island:MM,sp:SPB,freo:FB,hi:HIB,vp:VPB})[z];
