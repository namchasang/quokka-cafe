// ---------- Phase 1 look on the mainland: same tussocks, wildflowers and pixel bushes as Rottnest ----------
(()=>{const R2=mulberry32(4711);const areas=[];scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.map||o.material.map.image!==grassC||!o.geometry||o.geometry.type!=='PlaneGeometry')return;const wp=new THREE.Vector3();o.getWorldPosition(wp);if(wp.x<100||Math.abs(o.rotation.x+Math.PI/2)>.01||o.rotation.z)return;const w=o.geometry.parameters.width*o.scale.x,h=o.geometry.parameters.height*o.scale.y;if(w*h<6)return;areas.push({x1:wp.x-w/2,x2:wp.x+w/2,z1:wp.z-h/2,z2:wp.z+h/2,a:w*h});});
  const grassMeshes=new Set();scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.map&&o.material.map.image===grassC)grassMeshes.add(o);});
  const over=[];const bb=new THREE.Box3();scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh||grassMeshes.has(o)||BB.includes(o)||!o.geometry)return;bb.setFromObject(o);if(bb.max.x<100||bb.max.y<.004||bb.min.y>3)return;if((bb.max.x-bb.min.x)*(bb.max.z-bb.min.z)>900)return;over.push([bb.min.x-.15,bb.max.x+.15,bb.min.z-.15,bb.max.z+.15]);});
  const covered=(x,z)=>over.some(q=>x>q[0]&&x<q[1]&&z>q[2]&&z<q[3]);
  let nT=0,nF=0,nB=0;const near=[];const free=(x,z,rr)=>{if(blocked(x,z)||covered(x,z))return false;for(const q of near)if(Math.abs(q[0]-x)<rr&&Math.abs(q[1]-z)<rr)return false;return true;};
  areas.forEach(A=>{const tuss=Math.min(90,Math.round(A.a*.28)),flw=Math.min(30,Math.round(A.a*.07)),bsh=Math.min(10,Math.round(A.a*.018));
    const spot=()=>[A.x1+.5+R2()*(A.x2-A.x1-1),A.z1+.5+R2()*(A.z2-A.z1-1)];
    for(let i=0,n=0;i<tuss*4&&n<tuss;i++){const [x,z]=spot();if(!free(x,z,.35))continue;const s=.65+R2()*.55;const g=new THREE.PlaneGeometry(1.1*s,.8*s);g.translate(0,.4*s,0);const m=new THREE.Mesh(g,tussockMats[R2()<.5?0:2]);m.position.set(x,0,z);scene.add(m);BB.push(m);near.push([x,z]);n++;nT++;}
    for(let i=0,n=0;i<flw*4&&n<flw;i++){const [x,z]=spot();if(!free(x,z,.4))continue;const g=new THREE.PlaneGeometry(.75,.52);g.translate(0,.26,0);const m=new THREE.Mesh(g,flowerMats[(n+i)%3]);m.position.set(x,0,z);scene.add(m);BB.push(m);near.push([x,z]);n++;nF++;}
    for(let i=0,n=0;i<bsh*6&&n<bsh;i++){const [x,z]=spot();if(!free(x,z,1.2))continue;const v=bushVariants[(n+i)%2];const g=new THREE.PlaneGeometry(1.6,1);g.translate(0,.5,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);near.push([x,z]);n++;nB++;}});
  window.__p1decor={areas:areas.length,tussocks:nT,flowers:nF,bushes:nB};})();
// ---------- street lights along the island paths (and the South Perth foreshore) ----------
const LAMPS=[];
(()=>{const post=new THREE.MeshLambertMaterial({color:0x2f4a3a}),cap=new THREE.MeshLambertMaterial({color:0x22362a});
  const glowC=(()=>{const c=mk(64,64),x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(255,214,140,.9)');g.addColorStop(.45,'rgba(255,190,110,.35)');g.addColorStop(1,'rgba(255,170,90,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c;})();
  const glowT=new THREE.CanvasTexture(glowC);
  const hit=(x,z,p)=>colliders.some(c=>x>c.x1-p&&x<c.x2+p&&z>c.z1-p&&z<c.z2+p);
  function lamp(x,z,force){{const a=IW(-7,1.6),b=IW(10.5,6.5);if(!force&&x>a.x&&x<b.x&&z>a.z&&z<b.z)return;}if(!force&&BLANES.some(([a,b,w])=>segD(x,z,a[0],a[1],b[0],b[1])<w/2+.35))return;if(LAMPS.some(L=>Math.hypot(L.x-x,L.z-z)<4))return;if(!force&&hit(x,z,.6))return;
    const g=new THREE.Group();const p=new THREE.Mesh(new THREE.CylinderGeometry(.05,.08,2.3,6),post);p.position.y=1.15;p.castShadow=true;g.add(p);
    const base=new THREE.Mesh(new THREE.CylinderGeometry(.12,.14,.25,6),cap);base.position.y=.12;g.add(base);
    const arm=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,.34),post);arm.position.set(0,2.2,.14);g.add(arm);
    const bulbM=new THREE.MeshBasicMaterial({color:0x6a6050});const bulb=new THREE.Mesh(new THREE.BoxGeometry(.2,.26,.2),bulbM);bulb.position.set(0,2.08,.3);g.add(bulb);
    const roof=new THREE.Mesh(new THREE.ConeGeometry(.2,.16,4),cap);roof.rotation.y=Math.PI/4;roof.position.set(0,2.29,.3);g.add(roof);
    g.position.set(x,0,z);scene.add(g);col(x-.1,z-.1,x+.1,z+.1);
    const gm=new THREE.MeshBasicMaterial({map:glowT,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});const gl=new THREE.Mesh(new THREE.PlaneGeometry(3.4,3.4),gm);gl.rotation.x=-Math.PI/2;gl.position.set(x,.05,z+.3);scene.add(gl);
    const halo=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map:glowT,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending}));halo.position.set(x,2.08,z+.42);scene.add(halo);
    LAMPS.push({x,z,bulbM,gm,halo});}
  lamp(9.4,2.3,true); // beside the café bike rack
  // island: every few metres along the paths, set back from the path edge (laid out after the island grows)
  ISL.lamp=lamp;if(false)for(const P of PATHS)for(let i=0;i<P.length-1;i++){const [ax,az]=P[i],[bx,bz]=P[i+1];const L=Math.hypot(bx-ax,bz-az);const nx=-(bz-az)/L,nz=(bx-ax)/L;
    for(let d=1.5;d<L;d+=7){const t=d/L,px=ax+(bx-ax)*t,pz=az+(bz-az)*t;for(const s of [1,-1]){const x=px+nx*1.15*s,z=pz+nz*1.15*s;if(landD(x,z)>.9&&pathD(x,z)>.9){lamp(x,z);break;}}}}
  // South Perth foreshore path
  for(let x=104;x<198;x+=8){if(Math.abs(x-150)<3||Math.abs(x-186)<2)continue;lamp(x,-2.1);}
})();
// ---------- café night lighting: two warm floor spotlights plus soft light beams on the back wall ----------
const CAFE_NL=(()=>{const spots=[-3.6,3.6].map(x=>{const L=new THREE.SpotLight(0xffcf8a,0,13,.55,.65,1.6);L.position.set(x,.25,2.9);L.target.position.set(x*.95,2.4,-4.8);scene.add(L);scene.add(L.target);
    const b=new THREE.Mesh(new THREE.BoxGeometry(.3,.18,.3),new THREE.MeshLambertMaterial({color:0x2a2a30}));b.position.set(x,.09,2.9);scene.add(b);
    const lm=new THREE.MeshBasicMaterial({color:0x6a6050});const l=new THREE.Mesh(new THREE.CircleGeometry(.11,10),lm);l.rotation.x=-Math.PI/2+.5;l.position.set(x,.19,2.84);scene.add(l);return{L,lm};});
  const cv=(w,h,f)=>{const c=mk(w,h);f(c.getContext('2d'));return new THREE.CanvasTexture(c);};
  const beamT=cv(32,64,x=>{const g=x.createLinearGradient(0,64,0,0);g.addColorStop(0,'rgba(255,214,150,.75)');g.addColorStop(1,'rgba(255,200,130,0)');x.fillStyle=g;x.beginPath();x.moveTo(13,64);x.lineTo(19,64);x.lineTo(32,0);x.lineTo(0,0);x.fill();});
  const glowT=cv(64,64,x=>{const g=x.createRadialGradient(32,40,2,32,40,32);g.addColorStop(0,'rgba(255,205,140,.8)');g.addColorStop(1,'rgba(255,190,120,0)');x.fillStyle=g;x.fillRect(0,0,64,64);});
  const add=(t,w,h,x,y,z,flatOn)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));if(flatOn)m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.visible=false;scene.add(m);return m;};
  const fx=[[0.95,[-3.6,3.6].map(x=>add(beamT,2.2,3.6,x,1.9,-4.55))],[1,[-3.4,0,3.4].map(x=>add(glowT,3.4,3,x,1.7,-4.68))],[.85,[-2.6,0,2.6].map(x=>add(glowT,2.6,2,x,.18,-1.6,true))]];
  return{spots,fx};})();
function cafeNightTick(on,k){const isl=player.x<100;CAFE_NL.spots.forEach(s=>{s.L.intensity=on&&isl?7*k:0;s.lm.color.setRGB(on?1:.42,on?.9:.38,on?.7:.31);});CAFE_NL.fx.forEach(([a,ms])=>ms.forEach(m=>{m.visible=on&&isl;m.material.opacity=a*k;}));}
function lampTick(){const on=NIGHT>.05||S.time>1110||S.time<400;const k=on?Math.max(.55,NIGHT):0;cafeNightTick(on,k);LAMPS.forEach(L=>{L.bulbM.color.setRGB(on?1:.42,on?.88:.38,on?.6:.31);L.gm.opacity=k*.8;L.halo.material.opacity=k*.9;});}

