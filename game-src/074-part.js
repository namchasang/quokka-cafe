})();
// traffic, lights and night glow
CDET.tick=function(dt){if(!CDET.on||!CDET.g||!CDET.g.visible)return;const now=performance.now();if(now-CDET.last<4)return;CDET.last=now;dt=Math.min(dt||0,.1);
  const sg=CDET.sig;sg.t=(sg.t+dt)%18;const t=sg.t,EWg=t<8,EWa=t>=8&&t<9.5,NSg=t>=10.5&&t<16,NSa=t>=16&&t<17;
  if(sg.m){const set=(A,g,a)=>{A[0].color.setHex(!g&&!a?0xff3b30:0x3a1414);A[1].color.setHex(a?0xffb020:0x3a2a10);A[2].color.setHex(g?0x30e060:0x103a1a);};set(sg.m.EW,EWg,EWa);set(sg.m.NS,NSg,NSa);}
  if(CDET.clock&&typeof S!=='undefined'){const m=S.time%60,h=(S.time/60)%12;CDET.clock[0].rotation.z=-h/12*6.283;CDET.clock[1].rotation.z=-m/60*6.283;}
  const n=typeof NIGHT==='number'?NIGHT:0;CDET.glow.forEach(([m,d,k])=>m.color.copy(d).lerp(k,n));CDET.halos.forEach(h=>h.material.opacity=n*.85);CDET.em.forEach(m=>m.emissive.setScalar(n*1.1));
  const V=CDET.veh,people=[player];if(typeof walkers!=='undefined')for(const w of walkers)if(w.m.visible)people.push(w);
  // who is in front of whom (crossing cars use their length as width); two cars that block each other: the older one goes
  for(const c of V){c.blk=[];if(c.id==null)c.id=CDET.nid=(CDET.nid||0)+1;for(const o of V){if(o===c)continue;const dot=o.dx*c.dx+o.dz*c.dz;if(dot<-.7)continue;const ex=o.x-c.x,ez=o.z-c.z;const al=ex*c.dx+ez*c.dz;if(al<=0||al>4)continue;
      const la=Math.abs(-ex*c.dz+ez*c.dx),pp=Math.abs(dot)<.6;if(la<c.wid/2+(pp?o.len:o.wid)/2+.08){const need=c.len/2+(pp?o.wid:o.len)/2+(c.kind==='bike'?.9:.35);c.blk.push({o,lim:Math.max(0,(al-need)*2.2)});}}}
  for(const c of V){let tg=c.vmax;const front=c.s+c.len/2;
    for(const st of c.R.stops){const d=st.s-front;if(d>-.05&&d<2.4){const g=st.axis==='EW'?EWg:NSg,a=st.axis==='EW'?EWa:NSa;if(!g&&!(a&&d<.7))tg=Math.min(tg,Math.max(0,(d-.12)*2.2));}}
    if(c.kind==='bus'&&c.R.busS!=null&&!c.served){const d=c.R.busS-c.s;if(d<2.5&&d>-.2){tg=Math.min(tg,Math.max(0,d*1.4));if(d<.25&&c.v<.2){c.served=true;c.dwell=3.5;}}}
    if(c.dwell>0){c.dwell-=dt;tg=0;}
    let carBlock=false;
    if(c.ghost>0)c.ghost-=dt;else for(const b of c.blk){if(b.o.blk.some(q=>q.o===c)&&c.id<b.o.id)continue;if(b.lim<tg){tg=b.lim;carBlock=b.o.dx*c.dx+b.o.dz*c.dz<.7;}}
    for(const p of people){const ex=p.x-c.x,ez=p.z-c.z;const al=ex*c.dx+ez*c.dz;if(al<=0||al>c.len/2+1.7)continue;if(Math.abs(-ex*c.dz+ez*c.dx)<c.wid/2+(c.kind==='bike'?.22:.4))tg=Math.min(tg,Math.max(0,(al-c.len/2-.45)*2.4));}
    c.wait=(carBlock&&c.v<.05)?c.wait+dt:0;if(c.wait>8&&c.kind!=='bike'){c.ghost=1.2;c.wait=0;}
    c.v+=Math.max(-7*dt,Math.min(2.2*dt,tg-c.v));c.s+=c.v*dt;}
  for(let i=V.length-1;i>=0;i--){const c=V[i];if(c.s>=c.R.L-.05){c.g.parent&&c.g.parent.remove(c.g);V.splice(i,1);continue;}
    let i2=1;const R=c.R;while(i2<R.S.length-1&&R.S[i2]<c.s)i2++;const a=R.P[i2-1],b=R.P[i2],u=(c.s-R.S[i2-1])/Math.max(1e-6,R.S[i2]-R.S[i2-1]);let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;
    c.dx=dx/l;c.dz=dz/l;c.x=a[0]+dx*u;c.z=a[1]+dz*u;c.g.position.set(c.x,0,c.z);c.g.rotation.y=Math.atan2(-c.dz,c.dx);const k=Math.max(0,Math.min(1,Math.min(c.s,R.L-c.s)/1.3));c.g.scale.setScalar(k);c.g.visible=k>.02;
    const ex=player.x-c.x,ez=player.z-c.z,al=ex*c.dx+ez*c.dz,la=-ex*c.dz+ez*c.dx,hw=c.wid/2+.25;if(k>.5&&Math.abs(al)<c.len/2+.15&&Math.abs(la)<hw){const dl=(la<0?-hw:hw)-la;player.x+=dl*-c.dz;player.z+=dl*c.dx;}}
  // new cars come in from the edges of the map
  for(const R of CDET.routes||[]){R.t-=dt;if(R.t>0)continue;R.t=(R.bike?5:3.5)+Math.random()*6;const cnt=V.filter(v=>v.R===R).length;if(cnt>=R.n+1)continue;
    const q0=R.P[0];if(V.some(v=>Math.hypot(v.x-q0[0],v.z-q0[1])<3))continue;CDET.spawn(R,0);}};

