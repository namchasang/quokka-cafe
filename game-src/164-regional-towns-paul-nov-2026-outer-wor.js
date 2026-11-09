// ---------- Regional towns (Paul Nov 2026): the outer-world gate "rtn_<town>" switches the shared small-town map (zone rtn) to that town ----------
if(TRIP_ON&&TRIPS.rtn)(()=>{const T=TRIPS.rtn;
  RTOWN.names=c=>{T.name=c.name;T.title=c.name+' · '+c.sub;const Z=ZONE_DEF.rtn;if(Z){Z.title=T.title;Z.eb='Regional WA · '+(c.set==='coast'?'coast town':'country town');Z.bg=c.set==='coast'?'#2490c0':'#3f6a34';}
    TOWN_NAME.rtn=T.title;delete zoneCache.rtnB;delete zoneCache.rtnm;};
  // everything the last build added: colliders, night-glow materials, lamps, sprites, textures
  const _tb=TRIP_BUILD.rtn;TRIP_BUILD.rtn=function(G,K){const n0=[colliders.length,PXB_GLOW.length,PXB_LAMPS.length];try{_tb(G,K);}finally{RTOWN.own={col:colliders.slice(n0[0]),glow:PXB_GLOW.slice(n0[1]),lamps:PXB_LAMPS.slice(n0[2])};ISC.n=-1;}};
  RTOWN.tear=function(){const G=T.G,o=RTOWN.own;const rm=(A,L)=>{if(!A||!L||!L.length)return;const s=new Set(L);for(let i=A.length-1;i>=0;i--)if(s.has(A[i]))A.splice(i,1);};
    if(o){rm(colliders,o.col);rm(PXB_GLOW,o.glow);rm(PXB_LAMPS,o.lamps);ISC.n=-1;}
    const objs=new Set();G.traverse(m=>objs.add(m));[BB,DIR4].forEach(A=>{for(let i=A.length-1;i>=0;i--)if(objs.has(A[i]))A.splice(i,1);});
    const ms=new Set(),ts=new Set();G.traverse(m=>{if(m.geometry)m.geometry.dispose();[].concat(m.material||[],m.customDepthMaterial||[]).forEach(x=>ms.add(x));const fr=m.userData&&m.userData.frames;if(fr)fr.forEach(f=>{if(f.m)ms.add(f.m);if(f.d)ms.add(f.d);});});
    ms.forEach(x=>{['map','emissiveMap','alphaMap'].forEach(k=>{if(x[k])ts.add(x[k]);});x.dispose();});ts.forEach(t=>{t.dispose();SIGN_TEX.delete(t);});
    if(typeof LOOK2!=='undefined'&&LOOK2.tex)rm(LOOK2.tex,[...ts]);
    for(let i=G.children.length-1;i>=0;i--)G.remove(G.children[i]);T.K.targets=null;T.K.tick=null;RTOWN.own=null;RTOWN.built=null;T.built=false;};
  RTOWN.set=function(key){const c=RTOWN.list[key];if(!c)return false;RTOWN.cur=c;S.rtown=key;RTOWN.names(c);if(T.built&&RTOWN.built!==key)RTOWN.tear();return true;};
  const _en=owTripEnter;owTripEnter=function(id){if(typeof id==='string'&&id.indexOf('rtn_')===0){if(!RTOWN.set(id.slice(4)))return false;return _en('rtn');}return _en.apply(this,arguments);};
  const _bk=owTripBack;owTripBack=function(){if(OWTRIP==='rtn'&&RTOWN.cur)OWTRIP='rtn_'+RTOWN.cur.key;return _bk.apply(this,arguments);};
  RTOWN.names(RTOWN.list.yanchep);
})();
// ---------- TEX3 on Rottnest: soft shade at the foot of every wall, and painted vehicles ----------


// ---------- Pixel buildings (Look Lab ?pxb, Paul Oct 2026): 3d shapes keep their size, walls/roofs/windows/doors get pixel skins from PXKIT ----------
// Runs once after the world is built. Only Rottnest for now (Thomson Bay first). Walls without panes get windows painted in;
// walls with panes keep them, and the panes get pixel frames that glow at night. Roof prisms, hip cones and flat awnings get tiles, slate or tin.
// ---------- One look (Look Lab ?pxb, Paul Oct 2026): every surface follows the façade rules ----------
// 1 one game palette: background colours lean 55% toward the nearest palette colour and lose a little saturation, so the scene is calm;
// 2 props and vehicles (benches, lamps, bins, cars, boats, umbrellas...) get pixel faces at 32 px per metre: lit top row, shaded foot, inked rim;
// 3 ground, roads and paths stay sharp at a distance (nearest-pixel filtering), 4 no tilt-shift blur, 5 people and animals pop a little brighter.
const PXPAL=['#2a2230','#3a3e48','#5a5e6a','#8a8e96','#b8bcc0','#e4e6e8','#ffffff','#2f5a2e','#3f7a34','#5a9a40','#7ab454','#a8d070','#f4ecd8','#e8d6aa','#d8c49c','#b8a88c','#8a7a5a',
  '#5a3a22','#7a4a2a','#9a6a3e','#b98552','#d9b98a','#6a2a2a','#a8303a','#c9473f','#e2584f','#f08a6a','#f2c8a0','#f2b04a','#f4d04a','#fff0b0','#1d3a6e','#2f6fb0','#4a8ac8','#5cc6d8','#a8d8e8',
  '#3d7a78','#7fb3ad','#2f8a8a','#5a4a7a','#9478d4','#c8a8e8','#e8457a','#f2a0c0','#4e6a86','#6a8aa6'].map(h=>{const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];});
const PXSNAP=new Map();
function pxSnap(r,g,b,amt=.55,desat=.08){const k=((r>>3)<<10)|((g>>3)<<5)|(b>>3),kk=k*4+Math.round(amt*3);let v=PXSNAP.get(kk);if(v)return v;
  let best=1e9,bp=PXPAL[0];for(const p of PXPAL){const dr=r-p[0],dg=g-p[1],db=b-p[2],d=dr*dr*.3+dg*dg*.59+db*db*.11;if(d<best){best=d;bp=p;}}
  let R=r+(bp[0]-r)*amt,G=g+(bp[1]-g)*amt,B=b+(bp[2]-b)*amt;const l=R*.3+G*.59+B*.11;R+=(l-R)*desat;G+=(l-G)*desat;B+=(l-B)*desat;v=[R|0,G|0,B|0];PXSNAP.set(kk,v);return v;}
function pxSnapCanvas(c){try{const x=c.getContext('2d'),id=x.getImageData(0,0,c.width,c.height),d=id.data;for(let q=0;q<d.length;q+=4){if(d[q+3]<8)continue;const v=pxSnap(d[q],d[q+1],d[q+2]);d[q]=v[0];d[q+1]=v[1];d[q+2]=v[2];}x.putImageData(id,0,0);c.__snapH=pxImgHash(d);}catch(e){}return c;}
// opaque pixels only (they survive a put/get round trip unchanged)
function pxImgHash(d){let h=0;for(let q=0;q<d.length;q+=4)if(d[q+3]===255)h=(Math.imul(h,31)+d[q]+(d[q+1]<<8)+(d[q+2]<<16))|0;return h;}
function pxRedrawn(t){const im=t.image;if(!im||!im.getContext||im.__snapH===undefined){t.__snapV=t.version;return false;}let hh;try{hh=pxImgHash(im.getContext('2d').getImageData(0,0,im.width,im.height).data);}catch(e){return false;}if(hh===im.__snapH){t.__snapV=t.version;return false;}return true;}
function pxSnapHex(h){const c=new THREE.Color(h);const v=pxSnap(c.r*255|0,c.g*255|0,c.b*255|0);return'#'+v.map(n=>n.toString(16).padStart(2,'0')).join('');}
