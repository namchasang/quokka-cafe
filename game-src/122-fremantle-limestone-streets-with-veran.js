// --- Fremantle: limestone streets with verandahs, the round gaol-house on its hill, cranes, containers, the wheel and a ferry ---
if(T.freo){const t=T.freo,g=t.g;hideOld(t);const[gx,gz]=gpos(t);
  const rhT=mkc(96,24),rx=rhT.getContext('2d');face(rx,null,0,0,96,24,{base:'#e4d4ac',kind:'stone',win:8,door:true,seed:44,frame:'#f4ecd8',litP:0});
  const rhm=new THREE.MeshLambertMaterial({map:TX(rhT)});add(g,new THREE.CylinderGeometry(2.3,2.4,1.5,12),rhm,-4,.75,-2);add(g,new THREE.CylinderGeometry(2.45,2.45,.25,12),flat('#efe2c0'),-4,1.62,-2);add(g,new THREE.CylinderGeometry(1.3,1.3,.08,12),flat('#c8b890'),-4,1.72,-2);
  add(g,new THREE.CylinderGeometry(3,3.4,.5,12),flat('#c8b48c'),-4,.0,-2);add(g,new THREE.CylinderGeometry(.04,.04,2.4,4),flat('#e8e4d8'),-4,2.9,-2);
  const STR=[[2,-3,3,2.2,1.8,'#efe3c4',1,'#c8344a'],[5.4,-3,2.6,2.2,2.4,'#e8d0a0',0,null],[2,1.2,3.2,2.4,1.9,'#f2e6c8',1,'#2f6a74'],[5.6,1.4,2.6,2.2,1.6,'#d8c4a0',1,'#e8b860'],[-1,4.2,3,2.2,2.1,'#efe3c4',0,null],[8.4,-1,2.2,2,2.6,'#e4d4ac',0,null]];
  STR.forEach(([a,b,w,d,h,c,tin,awn],i)=>{if(onRoad(gx+a,gz+b,Math.max(w,d)*.5+1.8))return;blockB(g,a,b,w,d,h,{base:c,kind:i%2?'stone':'plaster',rows:h>2?2:1,win:Math.max(1,Math.floor(w*1.2)),seed:50+i,awn,gable:tin?.7:0,tin,parapet:!tin,frame:'#f4ecd8',shut:i===2?'#2f6a74':null});
    if(awn||i===1){const vg=new THREE.Group();vg.position.set(a,0,b+d/2+.45);g.add(vg);add(vg,new THREE.BoxGeometry(w,.08,.9),flat('#8a8e94'),0,1.1,0);for(let k=-1;k<=1;k+=2)add(vg,new THREE.CylinderGeometry(.04,.04,1.1,4),flat('#e8e4d8'),k*w*.45,.55,.4);}});
  // container cranes and stacks on the wharf (north side of the town, over the water)
  [[-7,-8],[-3.5,-8.6]].forEach(([a,b],i)=>{const c=i?'#4a7aa8':'#d8e2ea',k=new THREE.Group();k.position.set(a,0,b);g.add(k);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([p,q])=>add(k,new THREE.BoxGeometry(.25,5,.25),flat(c),p,2.5,q));
    add(k,new THREE.BoxGeometry(2.4,.4,2.4),flat(c),0,5,0);add(k,new THREE.BoxGeometry(.4,.35,7.5),flat(c),0,5.4,-2.2);add(k,new THREE.BoxGeometry(.5,.8,.8),flat('#2a3038'),0,4.6,-.6);add(k,new THREE.BoxGeometry(.05,1.4,.05),flat('#2a3038'),0,4.4,-4.4);});
  const CC=['#c8344a','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#e86a1a'];const ctx2=mkc(16,8),cx2=ctx2.getContext('2d');for(let X=0;X<16;X+=2)PP(cx2,X%4?'#e8e8e8':'#b8b8b8',X,0,2,8);PP(cx2,'#888',0,0,16,1);PP(cx2,'#777',0,7,16,1);const ct=TX(ctx2);
  for(let k=0;k<14;k++){const a=-9+(k%5)*1.5,b=-5.4+((k/5)|0)*.8,lv=(k*7)%3===0?1:0;const m=new THREE.MeshLambertMaterial({map:ct,color:lin(CC[k%6])});add(g,new THREE.BoxGeometry(1.4,.6,.7),m,a,.3+lv*.6,b);}
  // the big wheel, with spokes
  const wh=new THREE.Group();wh.position.set(8,4,-4.5);g.add(wh);add(wh,new THREE.TorusGeometry(2.4,.1,6,24),flat('#f6f6f0'),0,0,0);for(let k=0;k<8;k++){const s=add(wh,new THREE.BoxGeometry(.05,4.8,.05),flat('#e8e8e0'),0,0,0);s.rotation.z=k*Math.PI/8;}
  for(let k=0;k<12;k++){const a=k/12*6.283;add(wh,new THREE.BoxGeometry(.4,.35,.35),flat(CC[k%6]),Math.cos(a)*2.4,Math.sin(a)*2.4,0);}[-1,1].forEach(s=>{const l=add(g,new THREE.BoxGeometry(.18,4.4,.18),flat('#d8d8d0'),8+s*.9,2,-4.5);l.rotation.z=-s*.22;});O.wheel=wh;
  // the Rottnest ferry tied up at the B-Shed jetty
  const f=new THREE.Group();f.position.set(ROTT.x-3.2,0,ROTT.z-1);f.rotation.y=.4;f.userData.L='veh';scene.add(f);add(f,new THREE.BoxGeometry(1.6,.6,4.4),flat('#f6f6f0'),0,.3,0);add(f,new THREE.BoxGeometry(1.62,.14,4.42),flat('#1d3a6e'),0,.35,0);
  const fw=mkc(32,8),fx=fw.getContext('2d');PP(fx,'#f6f6f0',0,0,32,8);for(let X=2;X<30;X+=4)PP(fx,'#3a5068',X,2,3,3);const fm=new THREE.MeshLambertMaterial({map:TX(fw)});add(f,new THREE.BoxGeometry(1.4,.6,3),fm,0,.9,-.2);add(f,new THREE.BoxGeometry(1,.4,1.4),fm,0,1.4,-.4);add(f,new THREE.CylinderGeometry(.1,.1,.5,6),flat('#e86a1a'),0,1.8,-.6);O.ferry=f;}
// --- South Perth: the old mill, foreshore apartments and palms ---
if(T.sp){const t=T.sp,g=t.g;hideOld(t);const[gx,gz]=gpos(t);
  const mc=mkc(32,32),mx=mc.getContext('2d');face(mx,null,0,0,32,32,{base:'#f6f2e8',kind:'plaster',win:1,rows:2,door:true,seed:61,litP:0});add(g,new THREE.CylinderGeometry(1,1.45,4.2,10),new THREE.MeshLambertMaterial({map:TX(mc)}),-3,2.1,0);
  add(g,new THREE.ConeGeometry(1.2,1.3,10),flat('#4a3a2e'),-3,4.85,0);const sl=mkc(8,32),sx=sl.getContext('2d');PP(sx,'#e8e2d4',0,0,8,32);for(let y=2;y<32;y+=3)PP(sx,'#7a6a58',1,y,6,1);PP(sx,'#7a6a58',3,0,2,32);
  const sails=new THREE.Group();sails.position.set(-3,4.4,1.1);g.add(sails);const sm2=new THREE.MeshLambertMaterial({map:TX(sl),side:THREE.DoubleSide});[0,1].forEach(k=>{const s=add(sails,new THREE.BoxGeometry(.45,5.6,.05),sm2,0,0,0);s.rotation.z=k?.8:-.8;});O.sails=sails;
  [[3,-4,2.4,2.4,7,{seed:71,sp:'#ece6da',punch:1}],[6.5,-3,2.4,2.2,9,{seed:72,gl:['#a8d0dc','#78a8bc','#4a7a96']}],[9.5,-5,2.2,2.2,6,{seed:73,sp:'#d8ccb8',punch:1}]].forEach(([a,b,w,d,h,o])=>{if(OWR2)for(let k=0;k<8&&!(landAt(gx+a,gz+b)&&landAt(gx+a,gz+b-1.4)&&landAt(gx+a-1.2,gz+b)&&landAt(gx+a+1.2,gz+b));k++)b+=.5;/* owroads2: stand on the foreshore, not in the river */if(!onRoad(gx+a,gz+b,3.5))tower(g,a,b,w,d,h,o);});
  [[2,2,'#efe3c4'],[5,3,'#e8d0a0']].forEach(([a,b,c],i)=>{if(!onRoad(gx+a,gz+b,3))blockB(g,a,b,2.6,2.2,1.6,{base:c,kind:'plaster',seed:80+i,gable:.8,roofCol:'#b8562e',win:2});});
  for(let k=0;k<7;k++){const a=-1+k*1.6,b=5.5+(k%2)*.4,x=gx+a,z=gz+b;if(landAt(x,z))PL.push([x,groundAt(x,z)-.05,z,5,3.6+(k%3)*.4,1]);}}
// --- Victoria Park: Albany Highway shopfronts with awnings and signs ---
if(T.vp){const t=T.vp,g=t.g;hideOld(t);const[gx,gz]=gpos(t);const SH=[['#efe3c4','#e86a1a','NOODLES'],['#f2e6c8','#c8344a','BAKERY'],['#e8d0a0','#3e7d5c','GELATO'],['#efe3c4','#1d3a6e','BOOKS']];
  SH.forEach(([c,awn,nm],i)=>{const a=-5.25+i*3.5;if(onRoad(gx+a,gz,3))return;blockB(g,a,0,3.2,3,2.6,{base:c,kind:i%2?'brick':'plaster',rows:2,win:2,seed:90+i,awn,parapet:1,frame:'#f4ecd8'});
    const s=mkc(48,10),x=s.getContext('2d');PP(x,awn,0,0,48,10);x.fillStyle='#f4f2ec';x.font='bold 8px monospace';x.textAlign='center';x.fillText(nm,24,8);const sm3=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.55),new THREE.MeshBasicMaterial({map:TX(s)}));sm3.position.set(a,2.95,1.52);g.add(sm3);});}
// --- Perth Airport: a glass terminal with a curved roof, the control tower, planes and a runway ---
if(T.air){const t=T.air,g=t.g;hideOld(t);
  const[ta,tg]=towerTex(16,2.6,{seed:31,gl:['#b8d8e8','#88b4cc','#5a88a8'],sp:'#d8dcde'});add(g,new THREE.BoxGeometry(16,2.6,5),[flat('#d8dcde'),flat('#d8dcde'),flat('#9aa0a6'),flat('#9aa0a6'),litMat(ta,tg),litMat(ta,tg)],0,1.3,0);
  const rf=add(g,new THREE.CylinderGeometry(3,3,16.6,16,1,false,0,Math.PI),flat('#e8ecee'),0,2.2,0);rf.rotation.z=Math.PI/2;rf.scale.set(1,1,.3);
  add(g,new THREE.CylinderGeometry(.55,.8,9,10),flat('#d8d0c4'),10,4.5,-3);const[ca,cg]=towerTex(5,1.1,{seed:33,gl:['#3a5068','#2a3a50','#1a2a40'],sp:'#2a3038'});add(g,new THREE.CylinderGeometry(1.5,1.2,1.1,10),litMat(ca,cg),10,9.5,-3);add(g,new THREE.CylinderGeometry(1.6,1.6,.2,10),flat('#e8ecee'),10,10.1,-3);
  const plane=(x,z,ry,tail)=>{const p=new THREE.Group();p.position.set(x,0,z);p.rotation.y=ry;g.add(p);const f=add(p,new THREE.CylinderGeometry(.6,.6,8,10),flat('#f4f4f2'),0,1.3,0);f.rotation.x=Math.PI/2;add(p,new THREE.ConeGeometry(.6,1.2,10),flat('#f4f4f2'),0,1.3,4.6).rotation.x=Math.PI/2;
    add(p,new THREE.BoxGeometry(9,.12,1.6),flat('#e8e8e6'),0,1.1,.2);add(p,new THREE.BoxGeometry(3,.1,.9),flat('#e8e8e6'),0,1.5,-3.6);add(p,new THREE.BoxGeometry(.12,1.8,1.3),flat(tail),0,2.4,-3.6);
    [-2,2].forEach(s=>add(p,new THREE.CylinderGeometry(.3,.3,1,8),flat('#9aa0a6'),s,.8,.6).rotation.x=Math.PI/2);for(let k=-3;k<=3;k++)add(p,new THREE.BoxGeometry(.05,.22,.2),flat('#2a3038'),.61,1.5,k*.9);};
  if(OWR2){plane(-5.2,-7.4,0,'#2a9a8a');plane(5.2,-7.4,0,'#e86a1a');// owroads2 (Paul, Nov 2026): planes wait at the gates, the runway stays clear
    // Airport Central: the train ends at its own station west of the terminal (a platform, a canopy, a glass box and a footbridge to the terminal)
    const sx=AIRST[0]-t.g.position.x,sz=AIRST[1]-t.g.position.z;add(g,new THREE.BoxGeometry(7,.35,1.3),flat('#c8c4b8'),sx,.18,sz+1.25);add(g,new THREE.BoxGeometry(7.2,.12,1.6),flat('#e8ecee'),sx,1.9,sz+1.25);
    [-3,-1,1,3].forEach(k=>add(g,new THREE.BoxGeometry(.1,1.6,.1),flat('#9aa0a6'),sx+k,1.1,sz+1.8));const[sa,sg]=towerTex(3,1.6,{seed:35,gl:['#b8d8e8','#88b4cc','#5a88a8'],sp:'#d8dcde'});add(g,new THREE.BoxGeometry(3,1.6,1.8),litMat(sa,sg),sx+1,.8,sz+3);
    const fb=add(g,new THREE.BoxGeometry(Math.max(1,-8-sx-2.5),.5,.9),flat('#e8ecee'),(sx+2.5-8)/2,1.9,sz+3);fb.castShadow=true;}
  else{plane(-4,-9,0,'#2a9a8a');plane(4,-9.5,.2,'#e86a1a');}
  const rw=mkc(16,64),rx2=rw.getContext('2d');PP(rx2,'#55575c',0,0,16,64);for(let y=0;y<64;y+=8)PP(rx2,'#f4f2ec',7,y,2,4);PP(rx2,'#f4f2ec',1,0,1,64);PP(rx2,'#f4f2ec',14,0,1,64);for(let k=0;k<60;k++)PP(rx2,'#4a4c50',HSH(k,1)*16,HSH(k,2)*64);
  const rt2=TX(rw,true);rt2.repeat.set(1,6);const r=OWR2?add(g,new THREE.PlaneGeometry(3.6,46),new THREE.MeshLambertMaterial({map:rt2}),-12,.12,-15):add(g,new THREE.PlaneGeometry(3,40),new THREE.MeshLambertMaterial({map:rt2}),-14,.12,-6);if(OWR2)rt2.repeat.set(1,7);r.rotation.x=-Math.PI/2;r.rotation.z=Math.PI/2;r.castShadow=false;}
