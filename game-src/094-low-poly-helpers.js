// ---------- low-poly helpers ----------
const MC={};const M=c=>MC[c]||(MC[c]=new THREE.MeshLambertMaterial({color:lin(c)}));
const box=(g,w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
const cone=(g,r,h,c,x,y,z,s)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,s||4),M(c));m.position.set(x,y,z);if((s||4)===4)m.rotation.y=Math.PI/4;m.castShadow=true;g.add(m);return m;};
const cyl=(g,r,h,c,x,y,z,s)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s||10),M(c));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m;};
// pixel sprites for plants (same flat-facing look as the game)
const sprite=(draw,w,h,sw,sh)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.encoding=THREE.sRGBEncoding;
  const m=new THREE.SpriteMaterial({map:t,alphaTest:.5,fog:true});return()=>{const s=new THREE.Sprite(m);s.scale.set(sw,sh,1);s.center.set(.5,0);return s;};};
const blobTree=(cols,trunk)=>x=>{x.fillStyle=trunk;x.fillRect(7,10,3,8);for(let k=0;k<26;k++){const a=R()*6.28,rr=R()*5;x.fillStyle=cols[(k*7)%cols.length];x.beginPath();x.arc(8.5+Math.cos(a)*rr,7+Math.sin(a)*rr*.8,2.6,0,7);x.fill();}};
const TREES=[sprite(blobTree(['#3e6a2a','#5a8a34','#7aac46','#4a7a30'],'#6a4a30'),17,18,3.4,3.6),sprite(blobTree(['#5a7a4a','#7a9a5a','#4a6a3a'],'#d8d0c0'),17,18,3.8,4.2),
  sprite(x=>{x.fillStyle='#6a5a40';x.fillRect(7,6,2,14);const F=['#4a7a30','#6a9a3a','#8ab44a'];for(let k=0;k<9;k++){const a=-Math.PI+k/8*Math.PI;for(let t=0;t<1;t+=.12){x.fillStyle=F[(k+t*3|0)%3];x.fillRect(8+Math.cos(a)*7*t|0,6+Math.sin(a)*3*t+t*t*4|0,1,1);}}},16,20,2.6,4.4)];
if(!LOOK2)for(let i=0;i<1400;i++){const x=R()*WX,z=R()*WZ;if(!landAt(x,z)||onRoad(x,z,4)||Math.hypot(x-CBDP[0],z-CBDP[1])<16||Math.hypot(x-FRP[0],z-FRP[1])<9||DL[(z|0)*WX+(x|0)]<4)continue;const h=H(x,z);if(h<1)continue;
  const kp=Math.hypot(x-KPP[0],z-KPP[1])<20,near=kp||fbm(x*.02,z*.02)>.12;if(!near&&R()<.75)continue;const s=TREES[kp?1:(R()<.12?2:0)]();s.position.set(x,h-.1,z);s.userData.L='plants';const k=.8+R()*.6;s.scale.multiplyScalar(k);scene.add(s);}
// ---------- towns: small landmark models you walk into ----------
const TOWNS=[];
const ring=(g)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(5,.25,6,32),new THREE.MeshBasicMaterial({color:0xffd34d,transparent:true,opacity:.7}));m.rotation.x=Math.PI/2;m.position.y=.4;g.add(m);return m;};
function town(id,name,note,x,z,build){if(!landAt(x,z)){let b=null;for(let r=1;r<20&&!b;r++)for(let a=0;a<16;a++){const tx=x+Math.cos(a/16*6.283)*r,tz=z+Math.sin(a/16*6.283)*r;if(landAt(tx,tz)&&DL[(tz|0)*WX+(tx|0)]>3){b=[tx,tz];break;}}if(b)[x,z]=b;}const g=new THREE.Group();g.position.set(x,groundAt(x,z),z);scene.add(g);build(g);const rg=ring(g);TOWNS.push({id,name,note,x,z,g,rg});}
town('freo','Fremantle','Port city · Round House, markets, Cappuccino Strip',...G(115.748,-32.052),g=>{
  const rh=cyl(g,2.4,2.2,'#e2d2a8',-4,1.1,-2,8);cone(g,2.6,.8,'#8a7a6a',-4,2.6,-2,8);// the Round House
  [[2,-3,'#efe3c4'],[5,-1,'#e8d0a0'],[2,2,'#f2e6c8'],[6,3,'#d8c4a0'],[-1,4,'#efe3c4']].forEach(([a,b,c],i)=>{box(g,3,2+i%2,2.4,c,a,1+(i%2)/2,b);cone(g,2.2,1,['#b8562e','#a8acb0'][i%2],a,2.6+i%2,b);});
  [-6,-3].forEach(a=>{box(g,.5,6,.5,'#c8344a',a,3,-7);box(g,4,.5,.5,'#c8344a',a+1.5,6,-7);});// port cranes
  cyl(g,2.6,.3,'#f6f6f0',8,4,-4,16).rotation.x=Math.PI/2;});// the wheel
town('cbd','Perth CBD','Towers, the bell tower, Hay St Mall · train to the airport',...G(115.859,-31.953),g=>{
  [[-6,-6,14,'#9ab0c0'],[-2,-8,20,'#c8d2d8'],[3,-6,16,'#8aa0b4'],[7,-7,24,'#b8c4cc'],[-8,-1,10,'#d0c8bc'],[5,-1,12,'#9ab0c0'],[10,-2,9,'#c8d2d8']].forEach(([a,b,h,c])=>box(g,3.4,h,3.4,c,a,h/2,b));
  cyl(g,.9,7,'#8fb8c8',0,3.5,6,10);cone(g,.9,4,'#a8d0dc',0,9,6,10);});// the bell tower by the water
town('sp','South Perth','Mends St Jetty · the Old Mill · ferry to the city',...G(115.851,-31.976),g=>{cyl(g,1.4,4.5,'#f6f2e8',-3,2.25,0,10);cone(g,1.6,1.4,'#5a4a3a',-3,5.2,0,10);
  [[0,0],[0,0,1.6]].forEach((_,k)=>{const s=box(g,.3,5.5,.6,'#f6f2e8',-3,5,0);s.rotation.z=k?.8:-.8;});[[2,2,'#efe3c4'],[5,-1,'#e8d0a0'],[4,3,'#f2e6c8']].forEach(([a,b,c])=>{box(g,3,2.4,2.4,c,a,1.2,b);cone(g,2.2,1,'#b8562e',a,2.9,b);});});
town('hi','Heirisson Island','Kangaroos in the middle of the river',...G(115.881,-31.962),g=>{for(let k=0;k<4;k++){const r2=sprite(x=>{x.fillStyle='#a08a70';x.fillRect(3,2,3,3);x.fillRect(2,5,5,6);x.fillRect(1,10,2,2);x.fillRect(6,10,3,2);x.fillStyle='#806a54';x.fillRect(0,7,3,1);},9,12,1.4,1.9)();r2.position.set(-3+k*2,0,(k%2)*2-1);g.add(r2);}});
town('vp','Victoria Park','Albany Highway · Kip’s old street, food from everywhere',...G(115.896,-31.979),g=>{[[-5,'#e86a1a'],[-1.5,'#c8344a'],[2,'#3e7d5c'],[5.5,'#1d3a6e']].forEach(([a,c])=>{box(g,3.2,3.2,3,'#efe3c4',a,1.6,0);box(g,3.3,.4,1,c,a,1.6,1.8);});});
town('air','Perth Airport','Planes · the control tower · flights east',...G(115.967,-31.941),g=>{box(g,16,2.6,5,'#d8dcde',0,1.3,0);cyl(g,.8,9,'#d8d0c4',10,4.5,-3,12);cyl(g,1.5,1.2,'#2a3038',10,9.4,-3,12);
  const pl=new THREE.Group();g.add(pl);pl.position.set(-4,0,-9);cyl(pl,.7,9,'#f4f4f2',0,1.4,0,12).rotation.z=Math.PI/2;box(pl,1.6,.15,9,'#f4f4f2',0,1.2,0);box(pl,.15,2,1.4,'#2a9a8a',-4,2.4,0);});
// ---------- ferry between the two jetties, the train on its line ----------
const shore=(x,z)=>{for(let r=0;r<20;r++)for(let a=0;a<24;a++){const tx=x+Math.cos(a/24*6.283)*r,tz=z+Math.sin(a/24*6.283)*r;if(landAt(tx,tz)&&DL[(tz|0)*WX+(tx|0)]<1.5)return[tx,tz];}return[x,z];};
const JET=[(()=>{const [x,z]=shore(...G(115.859,-31.958));return{x,z,to:1};})(),(()=>{const [x,z]=shore(...G(115.850,-31.970));return{x,z,to:0};})()];
const ROTT=(()=>{const [x,z]=shore(...G(115.742,-32.050));return{x,z};})();{const g=new THREE.Group();g.position.set(ROTT.x,0,ROTT.z);g.userData.L='roads';scene.add(g);box(g,2.6,.4,2.6,'#b98552',0,1.1,0);const s2=new THREE.Mesh(new THREE.PlaneGeometry(3,.6),new THREE.MeshBasicMaterial({map:(()=>{const c=document.createElement('canvas');c.width=96;c.height=16;const x=c.getContext('2d');x.fillStyle='#1d3a6e';x.fillRect(0,0,96,16);x.fillStyle='#fff';x.font='bold 10px monospace';x.textAlign='center';x.fillText('ROTTNEST FERRY',48,12);const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;return t;})(),side:THREE.DoubleSide}));s2.position.set(0,3,0);g.add(s2);}
const boat=new THREE.Group();boat.userData.L='veh';scene.add(boat);box(boat,2.4,.8,5,'#f6f6f0',0,.4,0);box(boat,2,1.2,2.4,'#1d3a6e',0,1.4,-.4);boat.position.set(JET[0].x,0,JET[0].z);
JET.forEach(j=>{const g=new THREE.Group();g.position.set(j.x,0,j.z);g.userData.L='roads';scene.add(g);box(g,2.6,.4,2.6,'#b98552',0,1.1,0);for(let k=0;k<4;k++)box(g,.3,2,.3,'#7a5a3a',k%2?1:-1,.4,k<2?-1:1);});
const train=new THREE.Group();train.userData.L='veh';scene.add(train);const tcars=[];for(let k=0;k<3;k++){const c=new THREE.Group();box(c,2,2,6,k?'#e8e8e0':'#1d3a6e',0,1.4,0);box(c,2.05,.5,6.05,'#c8344a',0,1.3,0);box(c,2.06,.7,4.6,'#3a4a5a',0,2,0);train.add(c);tcars.push(c);}
let railLen=0;const RS=[0];for(let i=1;i<RAILP.length;i++){railLen+=Math.hypot(RAILP[i][0]-RAILP[i-1][0],RAILP[i][1]-RAILP[i-1][1]);RS.push(railLen);}
const railAt=s=>{s=((s%railLen)+railLen)%railLen;let i=1;while(i<RS.length-1&&RS[i]<s)i++;const a=RAILP[i-1],b=RAILP[i],t=(s-RS[i-1])/(RS[i]-RS[i-1]||1);return{x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,a:Math.atan2(b[0]-a[0],b[1]-a[1])};};
// boats sailing, gulls circling
const sails=[];for(let k=0;k<4;k++){const g=new THREE.Group();box(g,1,.4,2.6,'#f6f6f0',0,.2,0);const s=new THREE.Mesh(new THREE.ConeGeometry(.9,2.4,3),M(['#f6f6f0','#e86a1a','#f6f6f0','#c8344a'][k]));s.position.y=1.6;g.add(s);g.userData.L='veh';scene.add(g);sails.push({g,cx:[205,180,322,22][k],cz:[205,170,104,230][k],rx:[16,10,10,6][k],rz:[10,6,4,40][k],sp:.05+k*.012,ph:k*2});}
