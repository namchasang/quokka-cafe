// ---------- Café area settle (QA 23 Nov 2026, Paul: "จักรยานจมพื้น กับมีจักรยานอยู่บนถนน" / "มีคนจมบนถนน") ----------
// The builder island's road and lawn round Kip's café sit up to ~0.35 above the old ground (y 0) that the café's own props were placed on.
// Once the island is built: every small static thing in the café area that stands on y 0 is lifted onto the visible ground, and small
// groups (bike stands, bins, signs) that now sit on the road are pushed sideways off it. Walkers follow groundY (fixed in part ibmap).
(()=>{const done=new WeakSet();
  const roads=()=>{const D=IBMAP.doc||{},K=IBMAP.K||.855,L=[];const g=(xb,zb)=>[-38-xb/K,-.5+zb/K];(D.roads||[]).forEach(r=>L.push({w:(r.type==='lane'?1.8:2.6)/K/2,pts:r.pts.map(p=>g(p[0],p[1]))}));(D.paths||[]).forEach(r=>L.push({w:(r.w||1.2)*1.2/K/2,pts:r.pts.map(p=>g(p[0],p[1]))}));return L;};
  const near=(L,x,z)=>{let best=null;for(const r of L)for(let i=1;i<r.pts.length;i++){const [ax,az]=r.pts[i-1],[bx,bz]=r.pts[i],dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz||1,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/l2)),px=ax+dx*t,pz=az+dz*t,d=Math.hypot(x-px,z-pz);
      if(!best||d-r.w<best.e)best={e:d-r.w,px,pz,w:r.w,nx:-dz/Math.sqrt(l2),nz:dx/Math.sqrt(l2)};}return best;};
  function settle(){if(!IBMAP.done||!IBMAP.groundAt)return;const C=IW(0,0),L=roads();let lifted=0,moved=0;const box=new THREE.Box3(),sz=new THREE.Vector3();
    scene.children.slice().forEach(o=>{if(done.has(o)||!o.visible||o.isLight||o.isCamera)return;const p=o.position;if(Math.hypot(p.x-C.x,p.z-C.z)>26)return;if(Math.abs(p.y)>.06&&p.y>-.35)return;
      if(p.x>DECK.x1-.2&&p.x<DECK.x2+.2&&p.z>DECK.z1-.2&&p.z<DECK.z2+.2)return;if(p.x>JETTY.x1-1&&p.x<JETTY.x2+1&&p.z>JETTY.z1-1&&p.z<JETTY.z2+1)return;
      if(o===player.mesh||o===player.bikeMesh||(typeof customers!=='undefined'&&customers.some(c=>c.mesh===o))||BB.includes(o))return;/* moving characters set their own height */
      box.setFromObject(o);box.getSize(sz);if(sz.x>4||sz.z>4||!isFinite(sz.x))return;done.add(o);
      if(o.isGroup&&o.children.length>=3){const n=near(L,p.x,p.z);if(n&&n.e<.6){const s=Math.sign((p.x-n.px)*n.nx+(p.z-n.pz)*n.nz)||1;const k=n.w+Math.max(sz.x,sz.z)/2+.5;p.x=n.px+n.nx*s*k;p.z=n.pz+n.nz*s*k;moved++;}}
      const g=IBMAP.groundAt(p.x,p.z);if(g>0&&g>p.y+.04){p.y+=g-Math.max(p.y,0);lifted++;}});
    if(lifted||moved)console.log('café area settle: lifted',lifted,'moved off the road',moved);}
  (function wait(){let ok=false;try{ok=IBMAP.on&&IBMAP.done&&ISL.done;}catch(e){}if(!ok){setTimeout(wait,800);return;}setTimeout(settle,1500);
    if(IBMAP.reload&&!IBMAP.reload.__st){const r=IBMAP.reload;IBMAP.reload=function(){const v=r.apply(this,arguments);setTimeout(settle,4000);return v;};IBMAP.reload.__st=1;}})();
  window.__SETTLE=()=>settle();})();
