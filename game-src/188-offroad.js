// ---------- Businesses park off the road on the new island (Paul, 28 Nov 2026: 'รถ camper หาย รถขายไอติมหาย แล้วย้ายออกจากถนน') ----------
// The Rotto Scoops caravan and the bike hire stand were placed for the old island; on the Island Builder island they could stand
// on a road or path, and the island map's old-scenery pass hid them once bought (only the cone and the seller stayed). They are
// now kept (__islKeep) and, whenever their spot is on a road, path or water of the island map, moved with everything that
// belongs to them (sign, seller, cone, "for sale" post, collider, LOTS spot) to the nearest free ground.
(()=>{if(typeof IBMAP==='undefined'||!IBMAP.on||typeof bizMesh==='undefined')return;
  const off=(x,z)=>{try{const m=IBMAP.toMap(x,z),k=IBMAP.I.kindAt(m[0],m[1]);return k==='path'||k==='water'||k==='none';}catch(e){return false;}};
  const FOOT={ice:[1.6,1.1],bikes:[1.7,1.3]};
  function colOf(L,id){const f=FOOT[id];return colliders.find(c=>Math.abs((c.x1+c.x2)/2-L.x)<.6&&Math.abs((c.z1+c.z2)/2-L.z)<.9&&Math.abs((c.x2-c.x1)-f[0]*2)<1.2);}
  const bad=(x,z,id,C)=>{const [hw,hd]=FOOT[id];const keep=C?[C.x1,C.z1,C.x2,C.z2]:null;if(C){C.x1=C.z1=C.x2=C.z2=1e9;}
    let b=false;for(const dx of[-hw,0,hw])for(const dz of[-hd,0,hd+.9])if(!b&&(off(x+dx,z+dz)||blocked(x+dx,z+dz)))b=true;if(C)[C.x1,C.z1,C.x2,C.z2]=keep;return b;};
  function fix(id){const L=LOTS[id],M=bizMesh[id];if(!L||!M)return;M.g.__islKeep=1;if(!bad(L.x,L.z,id,null)&&!off(L.x,L.z))return;const C=colOf(L,id);
    let best=null;for(let r=1;r<=16&&!best;r+=.8)for(let a=0;a<28&&!best;a++){const t=a/28*6.283,x=L.x+Math.cos(t)*r,z=L.z+Math.sin(t)*r;if(!bad(x,z,id,C))best={x,z};}
    if(!best)return;const dx=best.x-L.x,dz=best.z-L.z;[M.g].concat(M.extra||[],M.sale?[M.sale]:[]).forEach(o=>{if(!o)return;o.position.x+=dx;o.position.z+=dz;try{o.position.y+=groundY(o.position.x,o.position.z)-groundY(o.position.x-dx,o.position.z-dz);}catch(e){}});
    if(C){C.x1+=dx;C.x2+=dx;C.z1+=dz;C.z2+=dz;}L.x+=dx;L.z+=dz;FIXED[id]=(FIXED[id]||0)+1;}
  const FIXED={};window.__OFFROAD=FIXED;
  setInterval(()=>{try{if(!IBMAP.done)return;['ice','bikes'].forEach(fix);}catch(e){console.warn('offroad',e);}},3000);
})();
