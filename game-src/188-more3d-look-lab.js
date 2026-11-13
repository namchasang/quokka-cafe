// ---------- Rottnest: the last pixel creatures and props become 3D (Look Lab ?ground3d until Paul approves) ----------
// Paul (13 Nov 2026): "anything on the map that is still pixel becomes 3D". Each 3D model follows the sprite it replaces (same spot,
// same size, heading from how it moves); the sprite is hidden on Rottnest only. Seals, black swans, snorkellers, dolphins,
// pelicans, dogs, surfers, the village campfire and the flower clumps in planters and gardens.
const MORE3D={on:typeof GROUND3D!=='undefined'&&GROUND3D.on,list:[],n:{}};
(function(){if(!MORE3D.on)return;
  const L=c=>{const m=new THREE.MeshToonMaterial({color:new THREE.Color(c).convertSRGBToLinear()});return m;},cache={};const TM=c=>cache[c]||(cache[c]=L(c));
  const mesh=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x||0,y||0,z||0);o.castShadow=true;return o;};
  const S=(r,w,h,d,m,x,y,z)=>{const o=mesh(new THREE.SphereGeometry(r,14,10),m,x,y,z);o.scale.set(w,h,d);return o;};
  const MK={
    seal(){const g=new THREE.Group(),B=TM('#6a5a4e'),Lt=TM('#a8988a'),K=TM('#1a1614');g.add(S(.3,1,.55,1.9,B,0,.17,0));g.add(S(.17,1,.95,1.15,B,0,.34,.5));g.add(S(.09,1,.8,1.2,Lt,0,.3,.68));
      [-1,1].forEach(s=>{g.add(S(.04,1,1,1,K,s*.07,.39,.62));const f=S(.12,1,.25,1.6,B,s*.24,.08,.2);f.rotation.y=s*.5;g.add(f);});const t=S(.12,1.8,.25,1,B,0,.06,-.58);g.add(t);return g;},
    swan(){const g=new THREE.Group(),B=TM('#24242c'),R=TM('#d83a3a'),W=TM('#f2f2f2');g.add(S(.26,1,.6,1.6,B,0,.16,0));const tail=S(.14,1.2,.6,1,B,0,.3,-.38);g.add(tail);
      const nk=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.25,.3),new THREE.Vector3(0,.55,.36),new THREE.Vector3(0,.78,.3),new THREE.Vector3(0,.82,.42)]);g.add(mesh(new THREE.TubeGeometry(nk,12,.045,6),B));
      g.add(S(.07,1,.9,1.3,B,0,.82,.44));const bk=mesh(new THREE.ConeGeometry(.03,.14,6),R,0,.8,.56);bk.rotation.x=Math.PI/2;g.add(bk);[-1,1].forEach(s=>g.add(S(.12,.3,.4,1,W,s*.2,.24,-.12)));return g;},
    snork(){const g=new THREE.Group(),Sk=TM('#f1c7a0'),Y=TM('#f1c64a'),Bk=TM('#22303e'),Gl=TM('#7fd0e0');g.add(S(.14,1,.9,1,Sk,0,.02,0));g.add(S(.11,1.2,.5,.6,Gl,0,.04,.11));
      g.add(mesh(new THREE.CylinderGeometry(.02,.02,.32,6),Y,.11,.17,0));g.add(S(.2,1,.25,2.2,Bk,0,-.1,-.42));[-1,1].forEach(s=>g.add(S(.06,1,.3,2,Y,s*.12,-.12,-.86)));return g;},
    dolphin(){const g=new THREE.Group(),B=TM('#5a6a7a'),Lt=TM('#c8d0d6');g.add(S(.22,1,.9,2.6,B,0,0,0));g.add(S(.15,1,.6,2.4,Lt,0,-.08,.05));const n=S(.07,1,.8,2,B,0,-.02,.62);g.add(n);
      const f=mesh(new THREE.ConeGeometry(.1,.26,4),B,0,.24,-.05);f.rotation.x=-.4;g.add(f);const t=S(.2,1.6,.15,.6,B,0,0,-.6);g.add(t);return g;},
    pelican(){const g=new THREE.Group(),W=TM('#f2f0ea'),K=TM('#2a2a30'),O=TM('#f0b060');g.add(S(.24,1,.9,1.4,W,0,.36,0));g.add(S(.12,1,1,1.1,W,0,.72,.18));const bk=S(.06,.8,.6,4.2,O,0,.66,.48);g.add(bk);
      [-1,1].forEach(s=>{g.add(S(.18,.25,.7,1.4,K,s*.2,.4,-.08));g.add(mesh(new THREE.CylinderGeometry(.02,.02,.24,5),O,s*.08,.12,0));});return g;},
    dog(){const g=new THREE.Group(),B=TM('#a8643a'),D=TM('#6a3a1e');g.add(S(.18,1,.9,1.8,B,0,.32,0));g.add(S(.13,1,1,1.2,B,0,.48,.34));g.add(S(.06,1,.8,1.4,D,0,.44,.48));
      [-1,1].forEach(s=>{g.add(S(.05,.6,1.2,.6,D,s*.1,.58,.32));[.18,-.18].forEach(z=>g.add(mesh(new THREE.CylinderGeometry(.04,.04,.24,6),B,s*.09,.12,z)));});const t=mesh(new THREE.CylinderGeometry(.02,.03,.24,5),B,0,.42,-.36);t.rotation.x=-.8;g.add(t);return g;},
    surfer(){const g=new THREE.Group(),Sk=TM('#d8a47a'),Su=TM('#1d2238'),Bd=TM('#f6f2e8');g.add(mesh(new THREE.BoxGeometry(.5,.05,1.8),Bd,0,.02,0));g.add(S(.12,1.1,1.6,1,Su,0,.3,0));g.add(S(.09,1,1,1,Sk,0,.55,.04));return g;}};
  const kindOf=o=>{const F=o.userData&&o.userData.frames;const c=F&&F[0]&&F[0].c;return c&&c.__k3;};
  const mats=o=>{const out=[];(o.userData.frames||[]).forEach(f=>{try{mkFrame(f);if(f.m)out.push(f.m);}catch(e){}});if(o.material)out.push(o.material);return out;};
  const isl=o=>{try{const p=o.parent===scene?o.position:o.getWorldPosition(new THREE.Vector3());return zoneOf(p.x)==='island';}catch(e){return false;}};
  function adopt(o){const k=kindOf(o);if(!k||o.__m3||!MK[k])return;const gp=o.geometry&&o.geometry.parameters;if(!gp)return;const m=MK[k]();
    const s=gp.width*Math.abs(o.scale.x)/({seal:1.3,swan:1,snork:.9,dolphin:1.3,pelican:1,dog:.9,surfer:1}[k]||1);m.scale.setScalar(Math.max(.5,Math.min(2.2,s)));m.traverse(q=>{q.__pxSkip=1;});
    const e={src:o,g:m,k,px:o.position.x,pz:o.position.z,yaw:o.scale.x<0?-Math.PI/2:Math.PI/2};o.__m3=e;MORE3D.list.push(e);MORE3D.n[k]=(MORE3D.n[k]||0)+1;(o.parent||scene).add(m);}
  function scan(){scene.traverse(o=>{if(o.isMesh&&o.userData&&o.userData.frames&&!o.__m3)adopt(o);});}
  // the village campfire: real flames instead of the flat flame picture
  function fire(){const f=window.__vfire;if(!f||f.__m3)return;f.__m3=1;const g=new THREE.Group(),cols=['#ff7a1a','#ffb43a','#fff0a0'];const fl=cols.map((c,i)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(.16-i*.04,.5-i*.12,7),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.92}));m.position.y=.22-i*.04;g.add(m);return m;});
    g.position.copy(f.position);(f.parent||scene).add(g);f.visible=false;MORE3D.fire={g,fl};}
  // flower clumps (planters and gardens): little 3D flowers in the picture's own colours
  function flowers(){const B=new THREE.Box3();scene.traverse(o=>{if(!o.isMesh||o.__m3f||!o.geometry||o.geometry.type!=='PlaneGeometry'||o.userData.frames)return;const p=o.geometry.parameters;if(!(p.width>=.6&&p.width<=.8&&p.height>=.4&&p.height<=.6))return;
      const im=o.material&&o.material.map&&o.material.map.image;if(!im||!im.getContext||im.width<40)return;if(!isl(o))return;o.__m3f=1;
      let cols=[];try{const d=im.getContext('2d').getImageData(0,0,im.width,im.height).data;for(let i=0;i<d.length;i+=4*7){const r=d[i],g=d[i+1],b=d[i+2];if(d[i+3]>200&&!(g>r&&g>b)&&r+g+b>300)cols.push('rgb('+r+','+g+','+b+')');}}catch(e){}if(!cols.length)cols=['#f2a0c0'];
      const g=new THREE.Group(),st=TM('#4f8a4b'),rnd=mulberry32((o.position.x*97+o.position.z*31)|0);for(let k=0;k<7;k++){const x=(rnd()-.5)*p.width*.8,z=(rnd()-.5)*.12,h=.18+rnd()*.22;g.add(mesh(new THREE.CylinderGeometry(.008,.01,h,4),st,x,h/2,z));
        const c=cols[(rnd()*cols.length)|0];const fm=new THREE.Mesh(new THREE.IcosahedronGeometry(.045+rnd()*.025,0),TM(c));fm.position.set(x,h,z);g.add(fm);const lf=S(.05,1.6,.3,.7,st,x+.03,h*.4,z);lf.rotation.z=.6;g.add(lf);}
      g.position.copy(o.position);g.rotation.copy(o.rotation);g.rotation.x=0;g.rotation.z=0;g.scale.copy(o.scale);g.scale.y=Math.abs(g.scale.y);(o.parent||scene).add(g);o.visible=false;MORE3D.n.flower=(MORE3D.n.flower||0)+1;});}
  let st=0;(function tick(){const t=performance.now()/1000;st-=1/60;if(st<=0){st=2;try{scan();fire();if(t>20)flowers();}catch(e){console.warn('more3d',e);}}
    for(const e of MORE3D.list){const s=e.src,on=!!s.parent&&s.visible&&isl(s);e.g.visible=on;mats(s).forEach(m=>{if(m.__m3v===undefined)m.__m3v=m.visible;m.visible=on?false:m.__m3v;});if(!on)continue;
      const dx=s.position.x-e.px,dz=s.position.z-e.pz;e.px=s.position.x;e.pz=s.position.z;if(dx*dx+dz*dz>1e-6){const h=Math.atan2(dx,dz);let d=h-e.yaw;d=Math.atan2(Math.sin(d),Math.cos(d));e.yaw+=d*.15;}
      e.g.position.copy(s.position);e.g.rotation.y=e.yaw;if(e.k==='dolphin')e.g.rotation.x=-Math.cos(t*2.6+e.px)*.5;}
    if(MORE3D.fire){MORE3D.fire.fl.forEach((m,i)=>{m.scale.set(1+Math.sin(t*9+i)*.12,1+Math.sin(t*11+i*2)*.2,1+Math.cos(t*8+i)*.12);m.rotation.y=t*(1+i);});}
    requestAnimationFrame(tick);})();
  setTimeout(()=>console.log('MORE3D '+JSON.stringify(MORE3D.n)),30000);
})();
