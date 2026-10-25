function openTours(){openTravel('Day tours','Siam Sydney Services · Tudor Lane',TOURS.map(t=>({id:t.id,name:t.name,note:t.note+' · back by evening',fare:t.price,btn:'Book',ride:()=>startTour(t.id)})),'Book a day tour with a local guide. The van leaves from Tudor Lane and brings you back here by evening.');}
let TOUR=null;
function startTour(id){if(transit||VISIT)return;const T=TOURS.find(t=>t.id===id);transit=true;fadeTarget=.95;toast('The tour van leaves Tudor Lane…',2);
  setTimeout(()=>{let ov=document.getElementById('tourOv');if(!ov){ov=document.createElement('div');ov.id='tourOv';ov.innerHTML='<iframe id="tourFr" title="Day tour"></iframe><div id="tourTop"><b id="tourName"></b><span id="tourSub"></span></div><div id="tourSay"></div><div id="tourBtns"><button type="button" class="btn ghost" id="tourNext">Next</button><button type="button" class="btn ghost" id="tourCard">Keep a postcard</button><button type="button" class="btn" id="tourBack">Back to Perth</button></div>';
      const st=document.createElement('style');st.textContent='#tourOv{position:fixed;inset:0;z-index:72;background:#141a2e}#tourFr{position:absolute;inset:0;width:100%;height:100%;border:0}#tourTop{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:max(10px,env(safe-area-inset-left,0px));background:rgba(20,26,46,.84);border:2px solid #3a4670;border-radius:8px;padding:8px 12px;color:#f5ecd8;max-width:70vw}#tourTop b{display:block;font-family:"Pixelify Sans",monospace;color:#ffd34d;font-size:18px}#tourTop span{font-size:12px;color:#a9b3cf}#tourBtns .btn{padding:8px 12px;font-size:14px;white-space:nowrap}#tourBtns .btn.ghost{background:rgba(20,26,46,.92);color:#f5ecd8;border-color:#3a4670}#tourSay{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(72px + env(safe-area-inset-bottom,0px));width:min(560px,calc(100vw - 32px));background:rgba(20,26,46,.9);border:2px solid #3a4670;border-radius:8px;padding:10px 14px;color:#f5ecd8;font-size:15px;line-height:1.4}#tourBtns{position:absolute;left:50%;transform:translateX(-50%);bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;gap:6px;flex-wrap:nowrap;justify-content:center;width:calc(100vw - 20px)}';
      document.head.appendChild(st);document.body.appendChild(ov);
      document.getElementById('tourNext').onclick=()=>{if(!TOUR)return;TOUR.i=(TOUR.i+1)%TOUR.T.guide.length;document.getElementById('tourSay').textContent=TOUR.T.guide[TOUR.i];};
      document.getElementById('tourCard').onclick=()=>{if(!TOUR)return;S.tourCards=S.tourCards||{};if(S.tourCards[TOUR.T.id]){toast('You already have this postcard',2);return;}S.tourCards[TOUR.T.id]=S.day||1;save();toast('Postcard kept: '+TOUR.T.name,2.4);};
      document.getElementById('tourBack').onclick=()=>endTour();}
    TOUR={T,i:0};overlay='tour';ui.hud.hidden=true;ui.act.hidden=true;ov.hidden=false;
    document.getElementById('tourName').textContent='Day tour · '+T.name;document.getElementById('tourSub').textContent='Siam Sydney Services · '+T.note;document.getElementById('tourSay').textContent=T.guide[0];
    const fr=document.getElementById('tourFr');const gold=S.time%1440>16*60;fr.srcdoc=TOUR_PAGE.replace("let cur='freo',time='day'","let cur='"+T.id+"',time='"+(gold?'gold':'day')+"'");
    transit=false;fadeTarget=0;S.tours=S.tours||{};S.tours[T.id]=(S.tours[T.id]||0)+1;save();},900);}
function endTour(){if(!TOUR)return;const T=TOUR.T;TOUR=null;transit=true;fadeTarget=.95;
  setTimeout(()=>{const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}overlay=null;ui.hud.hidden=false;ui.act.hidden=false;
    S.time+=T.hrs*60;const [x,z]=hqTpSpot(TOUR_DESK.x+.6,TOUR_DESK.z);player.x=x;player.z=z;updateCamera(0,true);fadeTarget=0;transit=false;toast('Back in Tudor Lane after a day at '+T.name,2.6);save();},700);}
{const _h4=hideOverlays;hideOverlays=function(){if(TOUR){TOUR=null;const ov=document.getElementById('tourOv');if(ov){ov.hidden=true;document.getElementById('tourFr').srcdoc='';}}_h4();};}
{const _tt=cbdTargets;cbdTargets=function(T){_tt(T);let zq;try{zq=zoneOf(player.x);}catch(e){return;}if(zq!=='cbd')return;T.push({x:TOUR_DESK.x+.5,z:TOUR_DESK.z,r:1.2,label:'Siam Sydney Services · day tours',act:()=>openTours()});};}
// ---------- TEX3 on Rottnest: soft shade at the foot of every wall, and painted vehicles ----------
function tex3Scene(){tex3Scene.done=true;const V3=new THREE.Vector3(),cache=new Map(),vcache=new Map();let walls=0,cars=0;
  const islandAt=o=>{o.getWorldPosition(V3);scene.worldToLocal(V3);try{return zoneOf(V3.x)==='island';}catch(e){return false;}};
  // vehicles: a group with three or more wheels; its biggest box is the body, dark boxes are glass
  const groups=new Set();scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='CylinderGeometry'&&o.parent&&o.parent!==scene){const p=o.parent;p.__wheels=(p.__wheels||0)+1;if(p.__wheels>=3)groups.add(p);}});
  const paint=(col,kind)=>{const key=col+kind;if(vcache.has(key))return vcache.get(key);const c=mk(32,16),x=c.getContext('2d');const B=T3.hex(col);const sh=k=>`rgb(${B.map(v=>Math.max(0,Math.min(255,Math.round(v*k)))).join(',')})`;
    if(kind==='glass'){x.fillStyle=sh(1);x.fillRect(0,0,32,16);x.fillStyle='rgba(190,220,250,.45)';for(let i=0;i<3;i++){x.beginPath();x.moveTo(4+i*11,0);x.lineTo(8+i*11,0);x.lineTo(2+i*11,16);x.lineTo(-2+i*11,16);x.fill();}x.fillStyle='rgba(255,255,255,.25)';x.fillRect(0,0,32,1);}
    else{for(let y=0;y<16;y++){const k=y<2?1.16:y<5?1.06:y>12?.82:1;x.fillStyle=sh(k);x.fillRect(0,y,32,1);}
      x.fillStyle=sh(.7);x.fillRect(11,3,1,10);x.fillRect(21,3,1,10);x.fillRect(0,9,32,1);x.fillStyle=sh(1.25);x.fillRect(0,2,32,1);
      x.fillStyle='#d8d8d4';x.fillRect(14,7,2,1);x.fillRect(24,7,2,1);
      for(let y=11;y<16;y++)for(let xx=0;xx<32;xx++)if(l2hash(xx,y,91)<(y-10)*.12){x.fillStyle=l2hash(xx,y,92)<.5?'rgba(150,92,56,.55)':'rgba(120,80,52,.5)';x.fillRect(xx,y,1,1);}}
    const t=ctex(c);const m=new THREE.MeshLambertMaterial({map:t});vcache.set(key,m);return m;};
  groups.forEach(g=>{if(!islandAt(g))return;let body=null,bv=0;g.children.forEach(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||o.material.map)return;const p=o.geometry.parameters,v=p.width*p.height*p.depth;
      const col='#'+o.material.color.getHexString(),l=o.material.color.r+o.material.color.g+o.material.color.b;
      if(l<.5&&p.height<.6){o.material=paint(col,'glass');return;}if(v>bv){bv=v;body=o;}});
    if(body){body.material=paint('#'+body.material.color.getHexString(),'body');cars++;}});
  // walls: darker at the foot, lighter up high, like light bouncing off the ground (soft contact shade)
  scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||!o.material||Array.isArray(o.material))return;const p=o.geometry.parameters;if(p.height<1.1||p.width<.6&&p.depth<.6)return;
    if(o.parent&&o.parent.__wheels>=3)return;if(!islandAt(o))return;const m=o.material;if(m.vertexColors||!(m.isMeshLambertMaterial||m.isMeshStandardMaterial))return;
    let mc=cache.get(m);if(!mc){mc=m.clone();mc.vertexColors=true;cache.set(m,mc);}
    const g=o.geometry.clone(),pos=g.attributes.position,col=new Float32Array(pos.count*3),h=p.height;
    for(let i=0;i<pos.count;i++){const y=pos.getY(i)+h/2;const k=.7+.3*Math.min(1,y/Math.min(1.4,h*.55));col[i*3]=k;col[i*3+1]=k*.99;col[i*3+2]=k*.97;}
    g.setAttribute('color',new THREE.BufferAttribute(col,3));o.geometry=g;o.material=mc;walls++;});
  tex3Scene.stats={walls,cars};}

if(WORLD.on&&(WORLD3D_LIVE||OW3D_ON)){let OW=null,root=null;
  const close3=()=>{if(OW)OW.close();if(root)root.hidden=true;};
  const ensure=()=>{if(OW)return;const st=document.createElement('style');st.textContent=OW3D_CSS;document.head.appendChild(st);root=document.createElement('div');root.id='owRoot';root.hidden=true;root.innerHTML=OW3D_HTML;document.body.appendChild(root);
    OW=OW3DBuild(root,{look2:OW_LOOK2_LIVE||/[?&#](lab|ow2)\b/.test(location.search+location.hash),enter:(id,side)=>{close3();WORLD.enter(id,side);},back:()=>hideOverlays(),
      carColor:()=>{const c=typeof carSel==='function'&&carSel();return c&&c!=='retro'&&typeof RRR!=='undefined'&&RRR.CARS[c]?RRR.CARS[c].color:null;}});};
  const _h3=hideOverlays;hideOverlays=function(){_h3();close3();};
  window.openWorld=function(from,side){if(transit||VISIT||(overlay&&overlay!=='wm'))return;transit=true;fadeTarget=.95;
    setTimeout(()=>{try{ensure();}catch(e){console.error(e);transit=false;fadeTarget=0;return;}transit=false;fadeTarget=0;overlay='wm';ui.hud.hidden=true;ui.act.hidden=true;root.hidden=false;OW.open(from);},500);};
}
})();
