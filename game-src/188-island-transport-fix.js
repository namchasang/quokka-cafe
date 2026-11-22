// ---------- Bus stops and stations on the engine-built Rottnest (Paul, 22 Nov 2026: "สถานีรถไฟกับบัสที่ rottnest ขึ้นไม่ได้") ----------
// Since the island is the Island Builder map, the old BUS signs are hidden with the old scenery and players only see the builder's
// own bus stops and station huts. The ride points still sat at the old spots (up to ~18 units away), so nothing happened at the stops
// and stations players could see. Fix: every builder bus stop also opens the Island Loop bus (from the nearest loop stop), and the
// Quokka Express points move to the ends of the railway, beside the builder's station huts.
(function(){
  const S2=[];let st=null;
  function setup(){if(typeof IBMAP==='undefined'||!IBMAP.done||!IBMAP.doc||typeof COACH==='undefined'||!COACH.length)return false;
    S2.length=0;(IBMAP.doc.props||[]).filter(p=>p.k==='busstop').forEach(p=>{const g=IBMAP.toGame(p.x,p.z);let best=null,bd=1e9;COACH.forEach(c=>{const d=Math.hypot(c.x-g[0],c.z-g[1]);if(d<bd){bd=d;best=c;}});
      if(best&&bd>2.5)S2.push({x:g[0],z:g[1],c:best});});
    st=null;if(typeof WEST!=='undefined'&&WEST.rail&&WEST.rail.length>1){const huts=(IBMAP.doc.stHut||[]).map(h=>{const g=IBMAP.toGame(h.x,h.z);return{x:g[0],z:g[1]};});
      const end=e=>{let h=null,hd=1e9;huts.forEach(q=>{const d=Math.hypot(q.x-e[0],q.z-e[1]);if(d<hd){hd=d;h=q;}});const m=h&&hd<12?{x:(h.x+e[0])/2,z:(h.z+e[1])/2}:{x:e[0],z:e[1]};try{if(blocked(m.x,m.z))for(let r=.5;r<=4;r+=.5)for(let a=0;a<16;a++){const X=m.x+Math.cos(a/16*6.283)*r,Z=m.z+Math.sin(a/16*6.283)*r;if(!blocked(X,Z))return{x:X,z:Z};}}catch(err){}return m;};
      st={settle:end(WEST.rail[0]),oliver:end(WEST.rail[WEST.rail.length-1])};}
    return true;}
  let ok=false;(function wait(){ok=setup();if(!ok)setTimeout(wait,1500);})();
  if(typeof IBMAP!=='undefined'){const _r=IBMAP.reload;if(_r)IBMAP.reload=function(){const r=_r.apply(this,arguments);setTimeout(()=>{ok=setup();},4000);return r;};}
  const _tg=cbdTargets;cbdTargets=function(T){_tg(T);if(!ok||zoneOf(player.x)!=='island'||VISIT)return;
    S2.forEach(s=>T.push({x:s.x,z:s.z,r:1.4,label:unlocked('coach')?'Island Loop bus · '+s.c.name:'Bus stop (the bus starts day 3)',act:()=>unlocked('coach')?openCoach(s.c.id):say([{who:'Timetable',text:'The Island Loop bus starts running on day 3.'}])}));
};
  const _bt=buildTargets;buildTargets=function(){const T=_bt.apply(this,arguments);try{if(ok&&st&&zoneOf(player.x)==='island'){const A=IW(14.2,-3.6),B=IW(54.6,.2);T.forEach(t=>{if(!/Quokka Express|Settlement Station/.test(t.label||''))return;const da=Math.hypot(t.x-A.x,t.z-A.z),db=Math.hypot(t.x-B.x,t.z-B.z);
      if(Math.min(da,db)>3)return;const p=da<db?st.settle:st.oliver;t.x=p.x;t.z=p.z;t.r=Math.max(t.r||1.3,2.2);});}}catch(e){}return T;};
  window.__TRFIX={get stops(){return S2.map(s=>[+s.x.toFixed(1),+s.z.toFixed(1),s.c.id]);},get st(){return st;},setup};
})();
