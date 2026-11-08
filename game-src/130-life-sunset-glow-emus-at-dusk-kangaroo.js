// ===== life: sunset glow, emus at dusk, kangaroos, visitors, cars on the loop =====
const EMU={x:1092,z:-24};
const _c=new THREE.Color(),_s=new THREE.Color('#ffb070');
K.tick=function(dt,t){dt=Math.min(dt,.1);const h=tod();
  // the spires glow orange late in the afternoon
  const g=h>14&&h<20?Math.exp(-Math.pow((h-17.9)/.85,2)):0;if(PIN._g!==g){PIN._g=g;SPM.emissive.setRGB(.42*g,.16*g,.03*g);if(PIN.sandM){PIN.sandM.emissive=PIN.sandM.emissive||new THREE.Color();PIN.sandM.emissive.setRGB(.12*g,.05*g,0);}}
  SIGNMATS.forEach(m=>{const n=typeof NIGHT==='number'?NIGHT:0;m.emissive.setRGB(.16+n*.1,.14+n*.08,.1+n*.05);});
  // emus: out on the sand from late afternoon until after dark
  const show=h>=16.6&&h<20.4;PIN.emus.forEach((e,i)=>{e.m.visible=show;e.sh.visible=show;if(!show)return;const a=t*.07+e.ph,x=EMU.x+Math.cos(a)*7.5,z=EMU.z+Math.sin(a)*4.2;
    e.x=x;e.z=z;e.m.position.set(x,H(x,z),z);e.sh.position.set(x,H(x,z)+.03,z);setFrame(e.m,Math.floor(t*3+i)%2);e.m.scale.x=Math.sin(a)>0?-1:1;});
  // kangaroos: graze, then hop to a new spot near home
  PIN.roos.forEach(k=>{if(k.wait>0){k.wait-=dt;setFrame(k.m,0);}else{const dx=k.tx-k.x,dz=k.tz-k.z,d=Math.hypot(dx,dz);if(d<.15){k.wait=2+R()*6;const a=R()*6.283,rad=2+R()*6;const nx=k.hx+Math.cos(a)*rad,nz=k.hz+Math.sin(a)*rad;if(!spHit(nx,nz,.6)&&nx>X1+3&&nx<X2-3&&nz>Z1+4&&nz<Z2-3){k.tx=nx;k.tz=nz;}}
      else{const s=Math.min(d,2.6*dt);k.x+=dx/d*s;k.z+=dz/d*s;k.hop+=dt*5;setFrame(k.m,Math.floor(k.hop)%2);if(Math.abs(dx)>.05)k.m.scale.x=dx>0?1:-1;}}
    const y=H(k.x,k.z),lift=k.wait>0?0:Math.abs(Math.sin(k.hop*Math.PI))*.25;k.m.position.set(k.x,y+lift,k.z);k.sh.position.set(k.x,y+.03,k.z);});
  if(PIN.bbq&&PIN.bbq.t>0){const q=PIN.bbq;q.t-=dt;q.SZ.visible=q.t>0;q.smoke.forEach((m,i)=>{const a=((t*.5+i/4)%1);m.position.set(q.x-.3+i*.15,q.y+1+a*1.4,q.z-.05);m.material.opacity=.45*(1-a);m.scale.setScalar(.6+a*1.4);m.quaternion.copy(camera.quaternion);});}
  // visitors: stroll between spires, stop for photos
  PIN.npcs.forEach(n=>{if(n.wait>0){n.wait-=dt;setFrame(n.m,0);}else{const dx=n.tx-n.x,dz=n.tz-n.z,d=Math.hypot(dx,dz);
      if(d<.12){n.wait=n.photo?6+R()*8:2+R()*5;for(let k=0;k<8;k++){const nx=n.hx+(R()-.5)*14,nz=n.hz+(R()-.5)*10;if(nx>X1+4&&nx<X2-4&&nz>Z1+5&&nz<Z2-4&&loopD(nx,nz)>2.8&&heathW(nx,nz)<.5&&!spHit(nx,nz,.5)){n.tx=nx;n.tz=nz;break;}}}
      else{const s=Math.min(d,.85*dt),nx=n.x+dx/d*s,nz=n.z+dz/d*s;if(spHit(nx,nz,.25)){n.tx=n.x;n.tz=n.z;}else{n.x=nx;n.z=nz;}n.step+=dt*5;setFrame(n.m,1+Math.floor(n.step)%2);}}
    const y=H(n.x,n.z);n.m.position.set(n.x,y,n.z);n.sh.position.set(n.x,y+.03,n.z);});
  // cars: slowly round the one-way loop, waiting if Kip is in the way
  PIN.cars.forEach(c=>{const p=LOOP.getPointAt(c.u),tg=LOOP.getTangentAt(c.u);const ax=p.x+tg.x*3-player.x,az=p.z+tg.z*3-player.z;const block=Math.hypot(ax,az)<2.6||PIN.cars.some(o=>o!==c&&((o.u-c.u+1)%1)<9/LOOPL);
    if(!block)c.u=(c.u+c.v*dt/LOOPL)%1;c.g.position.set(p.x,H(p.x,p.z),p.z);c.g.rotation.y=Math.atan2(-tg.z,tg.x);});};
// ===== the map =====
{const rects=[[X1,Z1,X2,Z2,'#e8b85a'],[X1,Z1,1013,Z2,'#8aa860'],[X1,Z1,X2,-37,'#8aa860'],[1111,Z1,X2,Z2,'#8aa860'],[X1,40,X2,Z2,'#8aa860']];
  for(let i=0;i<LP.length;i+=5)rects.push([LP[i].x-1.6,LP[i].z-1.6,LP[i].x+1.6,LP[i].z+1.6,'#f4d68a']);
  for(let i=0;i<TP.length;i+=4)rects.push([TP[i].x-.7,TP[i].z-.7,TP[i].x+.7,TP[i].z+.7,'#efe0b4']);
  rects.push([CP.x1,CP.z1,CP.x2,CP.z2,'#9a948a'],[CEN.x1,CEN.z1,CEN.x2,CEN.z2,'#cdb282'],[DECK.x1,DECK.z1,DECK.x2,DECK.z2,'#eadcb8'],[PIC.x1,PIC.z1,PIC.x2,PIC.z2,'#7aa05a']);
  K.zone={rects,labels:[['The Pinnacles',1068,-6,1],['Discovery Centre',1012,26,0],['Lookout',1023,23.6,0],['Car park',1040,43,0],['Desert loop',1092,-10,0],['Desert View trail',1009,-26,0],['Sunset dune',1078,-21,0],['Picnic area · BBQ',1024,44,0]]};}
};
/* Lucky Bay data: heightmap (1 m, h=v*0.05-4), granite<<4|ao (Blender Cycles AO bake), boulder meshes (Blender) */
