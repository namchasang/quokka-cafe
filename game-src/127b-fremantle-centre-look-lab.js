// ===== Fremantle centre (Look Lab ?ow2, Paul Nov 2026): a grid of small two-lane town streets, limestone shopfronts on every block, and landmarks (market hall, town hall clock tower, café strip, boat shed) =====
if(OWR2&&T.freo)try{if(O.inFreo){/* the square is Fremantle's own grid: other plans' streets and signals inside it go */for(let i=STREETS.length-1;i>=0;i--){const P=STREETS[i].P;if(P&&P.length&&P.filter(p=>O.inFreo(p[0],p[1],-.5)).length>=P.length*.5){const ri=ROUTES.indexOf(P);if(ri>=0)ROUTES.splice(ri,1);STREETS.splice(i,1);}}for(let i=SIGS.length-1;i>=0;i--)if(O.inFreo(SIGS[i].x,SIGS[i].z,-.5))SIGS.splice(i,1);}const t=T.freo,g=t.g,[gx,gz]=[t.x,t.z],gox=g.position.x,goz=g.position.z,sc=g.scale.x||1,gy0=g.position.y;
  const hsh=(a,b)=>{const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s);},PIT=6,K=5,R=K*PIT,keep=(x,z)=>{const a=(x-gox)/sc,b=(z-goz)/sc;return a>-12&&a<11&&b>-11&&b<6;};/* the old harbour piece stays as it is */
  const nearRail=(x,z)=>RAIL&&RAIL.some((p,i)=>i&&segDist(x,z,RAIL[i-1],p)<1.8);
  const okPt=(x,z)=>landAt(x,z)&&[[3.5,0],[-3.5,0],[0,3.5],[0,-3.5],[2.5,2.5],[-2.5,2.5],[2.5,-2.5],[-2.5,-2.5]].every(([a,b])=>landAt(x+a,z+b))/* solid ground only: nothing out on the moles or little islands (Paul Nov 2026) */&&!keep(x,z)&&!nearRail(x,z)&&Math.abs(x-gx)<=R+.01&&Math.abs(z-gz)<=R+.01;
  // streets on the grid lines, in runs over land
  const lines=[];for(let k=-K;k<=K;k++){const xs=[],zs=[];for(let q=-R;q<=R;q+=1){xs.push([gx+k*PIT,gz+q]);zs.push([gx+q,gz+k*PIT]);}lines.push([xs,0],[zs,k===0?1:0]);}
  let nS=0;lines.forEach(([L,main])=>{let cur=[];const flush=()=>{if(cur.length>2){addStreet(cur,main?'main':'local');STREETS[STREETS.length-1].freo=1;ROUTES.push(cur);nS++;}cur=[];};L.forEach(p=>{if(okPt(p[0],p[1])||(Math.abs(Math.abs(p[0]-gx)-R)<.01||Math.abs(Math.abs(p[1]-gz)-R)<.01)&&landAt(p[0],p[1])&&!keep(p[0],p[1]))cur.push(p);else flush();});flush();});
  // a building on each side of a block, facing its street
  const COL=['#efe3c4','#e8d0a0','#f2e6c8','#d8c4a0','#e4d4ac','#f4ead2','#e0c89c'],AW=['#c8344a','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#e86a1a'];
  const put=(x,z,w,d,h,ry,o)=>{const y=groundAt(x,z)-gy0,s=new THREE.Group();s.position.set((x-gx)/sc,y/sc,(z-gz)/sc);g.add(s);blockB(s,0,0,w,d,h,Object.assign({ry},o));for(let a=-w/2;a<=w/2;a+=.5)for(let b=-d/2;b<=d/2;b+=.5)markPt(x+a,z+b,2);return s;};
  const land4=(x,z,r)=>[[r,r],[-r,r],[r,-r],[-r,-r],[0,0]].every(([a,b])=>okPt(x+a,z+b));
  let nB=0,lm=0;const cen=[];
  for(let i=-K;i<K;i++)for(let j=-K;j<K;j++){const bx=gx+(i+.5)*PIT,bz=gz+(j+.5)*PIT;if(!land4(bx,bz,1.4))continue;cen.push([bx,bz,Math.hypot(bx-gx,bz-gz)]);}
  cen.sort((a,b)=>a[2]-b[2]);
  cen.forEach(([bx,bz],n)=>{const h1=hsh(bx*.7,bz*1.3),h2=hsh(bz*.9,bx*1.1);
    if(n===0){// town hall with a clock tower
      put(bx,bz,3.2,2.6,2.2,0,{base:'#f2e6c8',kind:'stone',rows:2,win:4,seed:301,parapet:1,frame:'#f4ecd8'});const s=put(bx+1.1,bz-.6,.9,.9,4.2,0,{base:'#efe3c4',kind:'stone',rows:3,win:1,seed:302,door:false});
      const ck=mkc(16,16),cx=ck.getContext('2d');PP(cx,'#f6f2e8',0,0,16,16);PP(cx,'#2a3038',7,3,1,6);PP(cx,'#2a3038',8,7,4,1);const cm=new THREE.MeshBasicMaterial({map:TX(ck)});[[0,.46,0],[0,-.46,Math.PI],[.46,0,Math.PI/2],[-.46,0,-Math.PI/2]].forEach(([a,b,r])=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(.6,.6),cm);p.position.set(a,3.6,b);p.rotation.y=r;s.add(p);});
      add(s,new THREE.ConeGeometry(.7,1,4),flat('#5a6a72'),0,4.7,0).rotation.y=Math.PI/4;lm++;return;}
    if(n===1){// market hall: a long gabled shed with a sign
      const s=put(bx,bz,4.2,3.2,1.8,0,{base:'#e8d0a0',kind:'brick',rows:1,win:5,seed:311,gable:.9,roofCol:'#8a5a3a',frame:'#f4ecd8'});const sg=mkc(64,12),sx=sg.getContext('2d');PP(sx,'#2f6a74',0,0,64,12);sx.fillStyle='#f4f2ec';sx.font='bold 9px monospace';sx.textAlign='center';sx.fillText('MARKET HALL',32,10);
      const p=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.5),new THREE.MeshBasicMaterial({map:TX(sg)}));p.position.set(0,2.1,1.62);s.add(p);lm++;return;}
    if(n===2){// boat shed with a sail roof, by the water side of town
      const s=put(bx,bz,3.6,2.4,1.2,0,{base:'#dfe6ea',kind:'plaster',rows:1,win:4,seed:321});[-1,1].forEach(k=>{const r=add(s,new THREE.ConeGeometry(1.4,2.2,3),flat('#f6f6f0'),k*.9,2.3,0);r.scale.set(1,1,.35);});lm++;return;}
    if(Math.max(Math.abs(bx-gx),Math.abs(bz-gz))>PIT*2.6){// outer blocks: limestone cottages with gardens
      [-1,1].forEach(side=>{for(let q=0;q<2;q++){const x=bx-1+q*2,z=bz+side*.95;if(!okPt(x,z))continue;put(x,z,1.5,1.4,1.05,side>0?0:Math.PI,{base:COL[(q+n)%COL.length],kind:(q+n)%2?'brick':'plaster',rows:1,win:2,seed:400+n*5+q,gable:.6,roofCol:['#b8562e','#8a8e94','#6a4a3a','#c86a3a'][(n+q)%4],frame:'#f4ecd8'});nB++;}});return;}
    // ordinary blocks: two or three shopfronts facing the street on the north and south sides, verandahs on the café street
    const cafe=Math.abs(bz-gz)<PIT*1.1;const nn=h1<.5?2:3,w=(PIT-2.7)/nn*1.0;
    [-1,1].forEach(side=>{for(let q=0;q<nn;q++){const x=bx-(PIT-2.7)/2+w*(q+.5),z=bz+side*.85,hh=1.9+((Math.floor(h1*7)+q*3+(side>0?1:0))%4)*.4;if(!okPt(x,z))continue;
      const s=put(x,z,w*.96,1.5,hh,side>0?0:Math.PI,{base:COL[(q*3+(h2*7|0)+(side>0?1:0))%COL.length],kind:(q+n)%3?'stone':'plaster',rows:hh>2?2:1,win:Math.max(1,Math.round(w*1.3)),seed:330+n*7+q,parapet:1,frame:'#f4ecd8',awn:cafe||q===1?AW[(q+n)%AW.length]:null});nB++;
      if(cafe){const vg=new THREE.Group();vg.position.set(0,0,.95);s.add(vg);add(vg,new THREE.BoxGeometry(w*.96,.07,.7),flat('#8a8e94'),0,1.05,0);for(let k=-1;k<=1;k+=2)add(vg,new THREE.CylinderGeometry(.035,.035,1.05,4),flat('#e8e4d8'),k*w*.42,.52,.3);}}});});
  O.freoCentre={streets:nS,shops:nB,landmarks:lm,blocks:cen.length};console.log('OWLOG freo centre',JSON.stringify(O.freoCentre));}catch(e){console.error('freo centre',e);}
