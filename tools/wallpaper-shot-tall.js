// Tall (phone) start-screen wallpaper, the island on the diagonal: VW=1080 VH=1920 SHOT=out.png node tools/qa-probe.mjs "?pnew=6#groves" tools/wallpaper-shot-tall.js 70
// Start-screen wallpaper: a high view of the whole island rendered by the game (28 Nov 2026). Run inside __t.html:
//   python3 tools/qa-hooks.py && VW=1920 VH=1080 SHOT=out.png node tools/qa-probe.mjs "?pnew=6" tools/wallpaper-shot.js 65
// (the snippet keeps every tree chunk, deepens the open sea for the shot only, hides clouds)
(()=>{document.body.classList.add('studio');try{dlgQ=[];dlgDone=null;ui.dlg.hidden=true;overlay=null;}catch(e){}S.time=600+Math.round(Math.random()*0);
const P=Object.assign({fov:46,y:420,ox:-190,oz:230,lz:10},window.__WP||{});const P_={k:.55};const cx=-38,cz=-.5;
const fol=IBMAP.grp.getObjectByName('im_fol');if(fol){fol.remove=function(){return this;};}
const I=IBMAP.I;for(let x=-130;x<=130;x+=14)for(let z=-130;z<=130;z+=14){try{I.E.fol.update(1,x,z,{});}catch(e){}}
/* wallpaper only: the open sea drops away from the island so it turns deep blue like the real photo */
scene.updateMatrixWorld(true);['sea4bed','sea4bed2'].forEach(n=>{const o=scene.getObjectByName(n);if(!o)return;const P=o.geometry.attributes.position,v=new THREE.Vector3(),M=o.matrix,Mi=new THREE.Matrix4().copy(M).invert();
  for(let i=0;i<P.count;i++){v.set(P.getX(i),P.getY(i),P.getZ(i)).applyMatrix4(M);let d=0;try{d=IBMAP.landD(v.x,v.z);}catch(e){}const rr=Math.hypot((v.x-cx)/1.7,v.z-cz),e2=Math.max(0,rr-105)*.7;if(d<-6||e2>0){v.y-=Math.min(40,Math.max(d<-6?(-d-6)*(P_.k||.55):0,e2));v.applyMatrix4(Mi);P.setY(i,v.y);}}P.needsUpdate=true;});
try{IBMAP.sky.setLayer('cumulus',false);IBMAP.sky.setLayer('birds',false);}catch(e){}
updateCamera=function(){updateMirror();camTarget.x=cx;camTarget.z=cz;try{SEA4.sea.mesh.scale.set(6,1,6);}catch(e){}const s=scene.scale.x,wx=cx*s;camera.fov=P.fov||34;camera.far=3000;camera.position.set(wx+(P.ox||0),P.y||210,cz+(P.oz||250));camera.lookAt(wx+(P.lx||0),0,cz+(P.lz||-15));camera.updateProjectionMatrix();if(scene.fog){scene.fog.near=600;scene.fog.far=2600;}};
return new Promise(r=>setTimeout(()=>r({fol:!!fol,kids:fol&&fol.children.length}),12000));})()
