// ---------- HD pixel set on Rottnest only (Look Lab ?hd or ?lab, Paul Nov 2026; HDR_LIVE turns it on for everyone) ----------
// From the shared library (part 111b, PPL.hd): Settlement cottages become HD limestone cottages (same size, colours and spot),
// limestone outcrops get a mossy pixel-limestone skin. ?hdtrees also swaps island trees and bushes for the HD 3D trees, only to
// compare: the standing art rule keeps plants as sprites until Paul decides.
const HDR_LIVE=false;const HDR_ON=HDR_LIVE||/[?&#](hd|lab)\b/.test(location.search+location.hash);const HDT_ON=/[?&#]hdtrees\b/.test(location.search+location.hash);
function hdRottBuild(){if(hdRottBuild.done||!window.PPL||!PPL.hd)return;hdRottBuild.done=true;const T0=performance.now();PPL.hdMode({srgb:false,lambert:true});
  const st={cottages:0,rocks:0,trees:0,bushes:0};const skip=o=>o.traverse(x=>{x.__pxSkip=1;});
  const glow=g=>g.traverse(o=>{if(o.isMesh)[].concat(o.material).forEach(m=>{if(m.emissiveMap&&!m.__hdg){m.__hdg=1;m.__dim=.9;PXB_GLOW.push(m);}});});
  const isl=o=>o.position.x<=100;// zoneOf(): x <= 100 is Rottnest
  // 1. cottages: a group with the 3 x 1.9 x 2.4 wall box and the three-sided roof prism
  const cots=[];scene.children.forEach(g=>{if(!g.isGroup||!g.visible||!isl(g))return;let w=null,r=null;g.children.forEach(c=>{const p=c.geometry&&c.geometry.parameters;if(!p)return;
    if(c.geometry.type==='BoxGeometry'&&p.width===3&&p.height===1.9&&p.depth===2.4)w=c;if(c.geometry.type==='CylinderGeometry'&&p.radialSegments===3&&p.radiusTop===1.75)r=c;});if(w&&r)cots.push({g,w,r});});
  cots.forEach(({g,w,r},i)=>{const hx=m=>'#'+m.material.color.getHexString();const h=PPL.hd('hd-cottage',{w:3,d:2.4,h:1.9,c:hx(w),roof:hx(r),seed:13+i,doorAt:.64,lamp:false});
    h.position.copy(g.position);h.rotation.y=g.rotation.y;h.name='hdCottage';scene.add(h);skip(h);glow(h);skip(g);g.visible=false;st.cottages++;});
  // 2. limestone outcrops keep their shapes, get a mossy pixel limestone skin
  if(typeof limeMat!=='undefined'){const RM=new Map([[limeMat,PPL.hdRockMat(12,'#e6dbc2')],[limeDark,PPL.hdRockMat(21,'#c8b898')]]);
    scene.traverse(o=>{if(o.isMesh&&RM.has(o.material)&&isl(o)){o.material=RM.get(o.material);o.__pxSkip=1;st.rocks++;}});}
  // 3. ?hdtrees: HD gum trees and flowering bushes in place of the island's leafy tree and bush sprites (pines stay)
  if(HDT_ON){const tpl=[1,2,3,4].map(s=>{const g=PPL.hd('hd-gum',{seed:s});skip(g);return g;}),btpl=[1,2].map(s=>{const g=PPL.hd('hd-bush',{seed:s+7});skip(g);return g;});
    const put=(src,from,H0)=>{const p=from.geometry.parameters,H=p.height||1;const c=src.clone();c.scale.setScalar(H/H0);c.position.set(from.position.x,0,from.position.z);c.rotation.y=(from.position.x*7.3+from.position.z*3.1)%6.283;scene.add(c);from.visible=false;from.__hdHide=1;return c;};
    trees.forEach((t,i)=>{if(!t.m||!t.m.visible||!isl(t.m)||t.v===treeVariants[3])return;put(tpl[i%4],t.m,8.6);st.trees++;});
    const bm=new Set(bushVariants.map(v=>v.m));scene.children.forEach((o,i)=>{if(o.isMesh&&bm.has(o.material)&&o.visible&&isl(o)){put(btpl[i%2],o,1.25);st.bushes++;}});}
  st.ms=Math.round(performance.now()-T0);hdRottBuild.stats=st;}
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
</script>

<script>if('serviceWorker' in navigator)addEventListener('load',()=>{const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{const chk=()=>{if(!document.hidden)r.update().catch(()=>{});};document.addEventListener('visibilitychange',chk);setInterval(chk,600000);}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||document.getElementById('qcUpd'))return;const b=document.createElement('button');b.id='qcUpd';b.type='button';b.textContent=(document.documentElement.lang==='th'?'มีเวอร์ชันใหม่ · แตะเพื่อโหลด':'New version ready · tap to reload');b.style.cssText='position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9999;font:600 15px system-ui,sans-serif;background:#ffd34d;color:#141a2e;border:0;border-radius:10px;padding:12px 18px;box-shadow:0 4px 16px rgba(0,0,0,.35)';b.onclick=()=>location.reload();document.body.appendChild(b);});});</script>
