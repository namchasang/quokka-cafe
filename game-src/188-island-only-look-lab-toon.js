// ---------- On Rottnest only Rottnest shows (Look Lab: ?toon) ----------
// Paul (Nov 2026): from the island's west end the South Perth map showed across the water. The other maps are laid out east of
// x = 99.5 in the same scene; while the camera is on the island, everything that lies wholly there is hidden, and the sea fills the view.
(function(){if(!TOON_ON)return;let L=null,state=null;
  function list(){L=[];const B=new THREE.Box3();scene.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(scene.matrixWorld).invert();
    const take=(o,deep)=>{if(o.isLight||o.isCamera||o.name==='sea3'||o.name==='sea3band')return;try{B.setFromObject(o);B.applyMatrix4(inv);}catch(e){return;}if(B.isEmpty())return;/* scene space: the island is drawn mirrored */
      if(B.min.x>=97.5){L.push(o);return;}if(B.max.x>99&&deep<2&&o.children.length)o.children.forEach(c=>take(c,deep+1));};
    scene.children.forEach(o=>take(o,0));}
  (function loop(){try{if(typeof ISL!=='undefined'&&ISL.done&&typeof camTarget!=='undefined'){if(!L)list();const on=zoneOf(camTarget.x)==='island';if(on!==state){state=on;if(typeof SEA3!=='undefined'&&SEA3.sea)SEA3.sea.visible=on;L.forEach(o=>{if(on){if(!o.__ioH){o.__io=o.visible;o.__ioH=1;}o.visible=false;}else if(o.__ioH){o.visible=o.__io;o.__ioH=0;}});}}}catch(e){}requestAnimationFrame(loop);})();
  setTimeout(()=>{L=null;state=null;},25000);// list again once late objects are built (Paul, 13 Nov: the second list used to save 'hidden' as the real state, so the city stayed invisible on the home screen; __ioH keeps the true state)
})();
