// ---------- Photo mode (?shot=x,z,hour[,weather,zoom,yaw]): the real game with no menus, no saving, a fixed place and time ----------
// For website and post screenshots. Nothing is saved and the player's own slots are never touched. Weather 0 sun, 3 rain.
const SHOT=(()=>{const m=location.search.match(/[?&]shot=([-0-9.,]+)/);if(!m||LIVE)return null;const a=m[1].split(',').map(Number);
  return{x:a[0],z:a[1],h:isFinite(a[2])?a[2]:10,wx:a[3]|0,zm:a[4]||1,yaw:a[5]||0};})();
if(SHOT){save=function(){};hasPass=function(){return true;};
  const _u=update;update=function(dt){if(!ui.dlg.hidden){dlgQ=[];dlgDone=null;ui.dlg.hidden=true;}if(overlay&&running)hideOverlays();S.time=SHOT.h*60;S.wx=SHOT.wx;_u(dt);};
  const _c=updateCamera;updateCamera=function(dt,snap){if(running&&!overlay){yawT=SHOT.yaw;zm=SHOT.zm;}return _c(dt,snap);};
  setTimeout(()=>{startGame({day:5});STUDIO=true;document.body.classList.add('studio');S.pass=true;player.x=SHOT.x;player.z=SHOT.z;S.wx=SHOT.wx;S.time=SHOT.h*60;updateCamera(0,true);},900);}

if(WORLD.on&&(WORLD3D_LIVE||OW3D_ON)){let OW=null,root=null;
  const close3=()=>{if(OW)OW.close();if(root)root.hidden=true;};
  const ensure=()=>{if(OW)return;const st=document.createElement('style');st.textContent=OW3D_CSS;document.head.appendChild(st);root=document.createElement('div');root.id='owRoot';root.hidden=true;root.innerHTML=OW3D_HTML;document.body.appendChild(root);
    OW=OW3DBuild(root,{look2:OW_LOOK2_LIVE||/[?&#](lab|ow2)\b/.test(location.search+location.hash),enter:(id,side)=>{close3();if(typeof owTripEnter==='function'&&owTripEnter(id))return;WORLD.enter(id,side);},back:()=>hideOverlays(),
      carColor:()=>{const c=typeof carSel==='function'&&carSel();return c&&c!=='retro'&&typeof RRR!=='undefined'&&RRR.CARS[c]?RRR.CARS[c].color:null;}});};
  const _h3=hideOverlays;hideOverlays=function(){_h3();close3();};
  window.openWorld=function(from,side){if(transit||VISIT||(overlay&&overlay!=='wm'))return;transit=true;fadeTarget=.95;
    setTimeout(()=>{try{ensure();}catch(e){console.error(e);transit=false;fadeTarget=0;return;}transit=false;fadeTarget=0;overlay='wm';ui.hud.hidden=true;ui.act.hidden=true;root.hidden=false;OW.open(from);},500);};
}
})();
</script>

<script>if('serviceWorker' in navigator)addEventListener('load',()=>{const had=!!navigator.serviceWorker.controller;navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{const chk=()=>{if(!document.hidden)r.update().catch(()=>{});};document.addEventListener('visibilitychange',chk);setInterval(chk,600000);}).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had||document.getElementById('qcUpd'))return;const b=document.createElement('button');b.id='qcUpd';b.type='button';b.textContent=(document.documentElement.lang==='th'?'มีเวอร์ชันใหม่ · แตะเพื่อโหลด':'New version ready · tap to reload');b.style.cssText='position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9999;font:600 15px system-ui,sans-serif;background:#ffd34d;color:#141a2e;border:0;border-radius:10px;padding:12px 18px;box-shadow:0 4px 16px rgba(0,0,0,.35)';b.onclick=()=>location.reload();document.body.appendChild(b);});});</script>
