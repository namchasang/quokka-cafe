// ---------- garden (Perth Hills produce) ----------
const CROPS={
 straw:{name:'Strawberry',plural:'strawberries',days:1,seed:4,yield:3,sell:5,col:'#e8344a',fact:'A favourite at Perth Hills pick-your-own farms.'},
 pump:{name:'Pumpkin',plural:'pumpkins',days:2,seed:6,yield:1,sell:26,col:'#f08a2a',fact:'Roast pumpkin is on every Aussie Sunday roast plate.'},
 nect:{name:'Nectarine',plural:'nectarines',days:2,seed:8,yield:4,sell:8,col:'#f4a03c',tree:true,fact:'Bickley Valley orchards in the Perth Hills are known for stone fruit.'},
 tom:{name:'Cherry tomato',plural:'cherry tomatoes',days:1,seed:5,yield:5,sell:3,col:'#e8344a',lock:'u_tom',fact:'Thrives in Perth\u2019s long, sunny summers.'},
 lemon:{name:'Lemon',plural:'lemons',days:3,seed:9,yield:6,sell:6,col:'#f4e04a',tree:true,lock:'u_lemon',fact:'Almost every old Perth backyard has a lemon tree.'},
 avo:{name:'Avocado',plural:'avocados',days:4,seed:14,yield:4,sell:16,col:'#3f6a24',tree:true,lock:'u_avo',fact:'Western Australia is one of the country\u2019s big avocado growers.'},
 chili:{name:'Thai chilli',plural:'Thai chillies',days:2,seed:5,yield:8,sell:3,col:'#d8343a',lock:'u_chili',fact:'Small, hot and loved in Thai kitchens all over Perth.'},
 olive:{name:'Kalamata olive',plural:'olives',days:3,seed:9,yield:8,sell:5,col:'#4a3a5a',tree:true,lock:'u_olive',fact:'Fremantle\u2019s Italian families brought olive trees to their backyards.'},
 basil:{name:'Basil',plural:'basil bunches',days:1,seed:4,yield:4,sell:4,col:'#3e8a3a',lock:'u_basil',fact:'Every pizza on the Cappuccino Strip needs fresh basil.'},
 fig:{name:'Fig',plural:'figs',days:3,seed:10,yield:5,sell:9,col:'#6a3a5a',tree:true,lock:'u_fig',fact:'Old Freo cottages often hide a fig tree out the back.'},
 lgrass:{name:'Lemongrass',plural:'lemongrass stalks',days:2,seed:5,yield:6,sell:4,col:'#c8d86a',lock:'u_lgrass',fact:'The fragrant base of Thai and Vietnamese soups on Albany Hwy.'},
 bokchoy:{name:'Bok choy',plural:'bok choy',days:1,seed:5,yield:4,sell:4,col:'#7ac860',lock:'u_bokchoy',fact:'A fast-growing Asian green, popular at Vic Park grocers.'},
 dragon:{name:'Dragon fruit',plural:'dragon fruit',days:4,seed:14,yield:4,sell:15,col:'#e8457a',lock:'u_dragon',fact:'Grown in WA\u2019s north, sold all along Albany Hwy.'},
 fish:{name:'Fish',plural:'fish',noPlant:true,sell:6,col:'#6fa8d8'},
 apple:{name:'Pink Lady apple',plural:'Pink Lady apples',days:3,seed:10,yield:4,sell:12,col:'#e8457a',tree:true,fact:'Bred in 1973 at the Stoneville Research Station in the Perth Hills.'}};
const PLOTS=[];[-11.3,-9.3,-7.3].forEach(x=>[-1.6,.9].forEach(z=>PLOTS.push({x,z})));
const soilCv=(base,dark)=>{const c=mk(16,16),x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,16,16);x.fillStyle=dark;for(let j=1;j<16;j+=4)x.fillRect(0,j,16,1);const r=mulberry32(base.length*7);x.fillStyle='rgba(255,230,190,.25)';for(let i=0;i<10;i++)x.fillRect(r()*16|0,r()*16|0,1,1);return c;};
const soilDry=new THREE.MeshLambertMaterial({map:ctex(soilCv('#7a5232','#5a3a22'))}),soilWet=new THREE.MeshLambertMaterial({map:ctex(soilCv('#4e3220','#3a2416'))});
const bedMat=lmat(counterC,[2,1]);
{const gm=lmat(pathC,[3,.7]);flat(6,1.3,gm,-9.3,.02,-.35);flat(5.9,.75,lmat(pathC,[3,.4]),-9.3,.02,1.9);flat(5.9,.6,lmat(pathC,[3,.3]),-9.3,.02,-2.5);[-10.3,-8.3].forEach(x=>flat(.9,5,lmat(pathC,[.5,2.5]),x,.021,-.3));flat(1.1,.7,lmat(pathC,[.6,.4]),-9.3,.021,2.55);}
PLOTS.forEach(p=>{box(1,.26,1.1,bedMat,p.x,.13,p.z);const s=new THREE.Mesh(new THREE.PlaneGeometry(.88,.98),soilDry);s.rotation.x=-Math.PI/2;s.position.set(p.x,.265,p.z);s.receiveShadow=true;scene.add(s);p.soil=s;
  p.spark=spriteMesh([iconCanvas('spark')],.4,.4,{basic:true,shadow:false});p.spark.visible=false;scene.add(p.spark);col(p.x-.5,p.z-.55,p.x+.5,p.z+.55);});
function plantCanvas(k,st){const c=mk(16,16),x=c.getContext('2d'),r=mulberry32(k.length*31+st*7);const P=(a,b,col)=>{x.fillStyle=col;x.fillRect(a|0,b|0,1,1);};const L=['#2f6a35','#4f8f40','#7fb85a'];const tree=!!CROPS[k].tree;
  if(st===0){P(7,15,L[0]);P(7,14,L[0]);P(7,13,L[1]);P(6,12,L[2]);P(5,12,L[1]);P(8,12,L[2]);P(9,11,L[1]);P(8,13,L[1]);return c;}
  if(tree){x.fillStyle='#6b4428';x.fillRect(7,9,2,7);const R0=st===1?3.6:5.6,cy=st===1?8:6;for(let py=0;py<16;py++)for(let px=0;px<16;px++){const d=Math.hypot(px-7.5,py-cy);if(d<R0){const s=(7.5-px)*.1+(cy-py)*.12;P(px,py,L[s>.3?2:s>-.2?1:0]);}}}
  else if(k==='pump'){for(let py=6;py<16;py++)for(let px=1;px<15;px++){if(r()<.55&&Math.hypot(px-7.5,(py-11)*1.3)<(st===1?5:6.5))P(px,py,L[(r()*3)|0]);}}
  else{for(let py=7;py<16;py++)for(let px=2;px<14;px++){if(r()<.6&&Math.hypot(px-7.5,(py-12)*1.2)<(st===1?4:5.5))P(px,py,L[(r()*3)|0]);}}
  if(st===2){const col=CROPS[k].col;
    if(k==='pump'){x.fillStyle='#8a4a14';x.fillRect(4,10,8,6);x.fillStyle=col;x.fillRect(5,10,6,6);x.fillRect(4,11,8,4);x.fillStyle='#ffc070';x.fillRect(6,11,1,3);x.fillStyle='#3f6a2a';x.fillRect(7,9,2,1);}
    else{const spots=(k==='straw'||k==='tom'||k==='chili'||k==='basil'||k==='dragon')?[[4,12],[9,13],[11,10],[6,9],[8,11]]:[[4,5],[10,4],[6,8],[11,8],[8,3]];spots.forEach(([a,b])=>{x.fillStyle=col;x.fillRect(a,b,2,2);x.fillStyle='rgba(255,255,255,.7)';x.fillRect(a,b,1,1);if(k==='straw'){x.fillStyle='#3f8a3a';x.fillRect(a,b-1,2,1);}});}}
  return c;}
const plantCache={};
const dropIcon=(()=>{const c=mk(8,10),x=c.getContext('2d');x.fillStyle='#1d3a6e';x.fillRect(3,0,2,2);x.fillRect(2,2,4,2);x.fillRect(1,4,6,5);x.fillRect(2,9,4,1);x.fillStyle='#5cc6f0';x.fillRect(3,2,2,2);x.fillRect(2,4,4,4);x.fillStyle='#d8f4ff';x.fillRect(3,5,1,2);return c;})();
function refreshPlots(){PLOTS.forEach((p,i)=>{const st=S.plots[i];const ready=st&&st.g>=CROPS[st.k].days;const stage=!st?-1:ready?2:st.g===0?0:1;const key=st?st.k+stage:'';
  const spr=S.unlock&&S.unlock.sprinkler;p.soil.material=st&&(st.w||ready||spr)?soilWet:soilDry;p.spark.visible=!!ready;if(!p.drop){p.drop=spriteMesh([dropIcon],.32,.4,{basic:true,shadow:false});scene.add(p.drop);BB.push(p.drop);}p.drop.visible=!!st&&!ready&&!st.w&&!spr&&S.wx!==3;p.drop.position.set(p.x,1.2,p.z+.1);p.spark.position.set(p.x,1.75,p.z+.1);
  if(p.key===key)return;p.key=key;if(p.plant){scene.remove(p.plant);const bi=BB.indexOf(p.plant);if(bi>=0)BB.splice(bi,1);p.plant=null;}
  if(!st)return;const ck=st.k+stage;if(!plantCache[ck])plantCache[ck]=plantCanvas(st.k,stage);const sz=CROPS[st.k].tree&&stage>0?1.3:.95;
  p.plant=spriteMesh([plantCache[ck]],sz,sz);p.plant.position.set(p.x,.26,p.z+.1);scene.add(p.plant);});}
// picket fence + rainwater tank
const fenceMat=new THREE.MeshLambertMaterial({color:0xf3efe6});
function fenceRun(x1,z1,x2,z2){const len=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.ceil(len/.38));for(let i=0;i<=n;i++){const t=i/n;const p=new THREE.Mesh(new THREE.BoxGeometry(.08,.55,.08),fenceMat);p.position.set(lerp(x1,x2,t),.28,lerp(z1,z2,t));p.castShadow=true;scene.add(p);}
  const rail=new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2-x1)||.05,.06,Math.abs(z2-z1)||.05),fenceMat);rail.position.set((x1+x2)/2,.4,(z1+z2)/2);rail.castShadow=true;scene.add(rail);
  col(Math.min(x1,x2)-.05,Math.min(z1,z2)-.05,Math.max(x1,x2)+.05,Math.max(z1,z2)+.05);}
fenceRun(GARDEN.x1,GARDEN.z1,GARDEN.x2,GARDEN.z1);fenceRun(GARDEN.x1,GARDEN.z1,GARDEN.x1,GARDEN.z2);fenceRun(GARDEN.x2,GARDEN.z1,GARDEN.x2,GARDEN.z2);fenceRun(GARDEN.x1,GARDEN.z2,-9.9,GARDEN.z2);fenceRun(-8.7,GARDEN.z2,GARDEN.x2,GARDEN.z2);
(()=>{const c=mk(16,16),x=c.getContext('2d');for(let i=0;i<16;i++){x.fillStyle=i%2?'#9aa3ab':'#c3cbd2';x.fillRect(i,0,1,16);}const t=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,1.4,14),lmat(c,[4,1]));t.position.set(-13,.7,-.6);t.castShadow=t.receiveShadow=true;scene.add(t);
  const lid=new THREE.Mesh(new THREE.ConeGeometry(.6,.25,14),new THREE.MeshLambertMaterial({color:0x8a939b}));lid.position.set(-13,1.52,-.6);scene.add(lid);col(-13.6,-1.2,-12.4,0);})();
signPost(-11.3,2.75,makeSign(['KIP’S GARDEN'],56,12,'#7a5033','#f5ecd8'),1.3,.34);
// flower planters, shrubs
function planter(x,z,w,d){box(w,.34,d,bedMat,x,.17,z);const s=new THREE.Mesh(new THREE.PlaneGeometry(w-.12,d-.12),soilDry);s.rotation.x=-Math.PI/2;s.position.set(x,.345,z);scene.add(s);
  const n=Math.max(2,Math.round(Math.max(w,d)/.55));for(let i=0;i<n;i++){const t=(i+.5)/n;const fx=w>d?x-w/2+t*w:x,fz=w>d?z:z-d/2+t*d;const g=new THREE.PlaneGeometry(.7,.5);g.translate(0,.25,0);const m=new THREE.Mesh(g,flowerMats[(i+(x|0))%3]);m.position.set(fx,.33,fz);scene.add(m);BB.push(m);}
  col(x-w/2,z-d/2,x+w/2,z+d/2);}
planter(-3.6,3.95,2.6,.5);planter(3.6,3.95,2.6,.5);planter(5.95,-3.4,.5,2.1);
function shrub(x,z,s){const v=bushVariants[(x*7|0)&1];const g=new THREE.PlaneGeometry(1.6*s,1*s);g.translate(0,.5*s,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);}
[[-6.4,-8],[-2.4,-10],[1.6,-8.2],[-6.6,-6.9],[31.6,-7.8],[35.4,-7.4],[35.6,-5],[-12.9,-3.4],[-12.9,2.7],[-6,-3.6],[18.6,-9.6],[45.2,-5.8],[47.6,-3.6],[8.9,-4.6],[-4.8,-9.9]].forEach(([x,z])=>shrub(x,z,.85+((x*13|0)%3)*.12));

