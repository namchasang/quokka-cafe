// Builder start maps for the Master Builder map picker (Paul, 20 Nov 2026): Heirisson Island, Perth Airport, a regional town
// (shared by the regional towns: shopping strip, homes, campsite, car park, beach; a forest walk to a waterfall), and the
// tourist places Cervantes, Lancelin dunes, the Pinnacles, Albany and Esperance. All names of businesses are made up.
// node tools/town-maps.js  -> lib/engines/editor/<id>-start.json   (then tools/town-pages.sh builds the <id>-master.html pages)
const fs=require('fs');const N=121,OUT=__dirname+'/../lib/engines/editor/';
const sm=(e0,e1,x)=>{const t=Math.max(0,Math.min(1,(x-e0)/(e1-e0)));return t*t*(3-2*t);};
const nz=(x,z)=>Math.sin(x*.11+z*.07)*.5+Math.sin(x*.05-z*.13)*.5+Math.sin(x*.31+z*.23)*.15;

// No building on a road or on another building: shops and signed buildings first, then homes; anything that clashes is dropped.
const FOOT={house:[7,7],cottage:[6,5],bungalow:[8,7],flats:[10,8],units:[8,8]},RWID={street:3.3,arterial:5,highway:4.6,island:2.4,lane:2,bikepath:1.6};
function tidy(d){const box=b=>{const o=b.o||{};let w=o.w||(FOOT[b.s]||[8,8])[0],dd=o.d||(FOOT[b.s]||[8,8])[1];if(Math.abs(Math.sin(b.r))>.7)[w,dd]=[dd,w];return[b.x-w/2,b.x+w/2,b.z-dd/2,b.z+dd/2];};
  const segD=(x,z,p,q)=>{const dx=q[0]-p[0],dz=q[1]-p[1],t=Math.max(0,Math.min(1,((x-p[0])*dx+(z-p[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-p[0]-dx*t,z-p[1]-dz*t);};
  const onRoad=B=>d.roads.some(r=>{if(r.type==='bridge')return false;const hw=(RWID[r.type]||3)/2+.2;for(let k=1;k<r.pts.length;k++){for(let i=0;i<=4;i++)for(let j=0;j<=4;j++){const x=B[0]+(B[1]-B[0])*i/4,z=B[2]+(B[3]-B[2])*j/4;if(segD(x,z,r.pts[k-1],r.pts[k])<hw)return true;}}return false;});
  const ord=d.bld.slice().sort((a,b)=>(b.sign?1:0)-(a.sign?1:0)),keep=[],K=[];let drop=0;
  for(const b of ord){const B=box(b);if(onRoad(B)||K.some(c=>B[0]<c[1]-.1&&c[0]<B[1]-.1&&B[2]<c[3]-.1&&c[2]<B[3]-.1)){drop++;continue;}keep.push(b);K.push(B);}
  d.bld=d.bld.filter(b=>keep.includes(b));if(drop)console.log('  tidy: dropped',drop);}
function map(id,name,o){
  const d={v:1,ver:1,town:id,name,sea:0,h:[],paths:[],roads:[],props:[],bld:[],trees:[],culs:[],biz:[],veh:[],rail:[],fol:o.fol||{tuft:.6,flower:.3,bush:.03,tree:.003},
    life:Object.assign({walker:20,jogger:3,cyclist:4,gull:6,pelican:1,dolphin:2,boat:2,kayak:1,sitter:6,picnic:3,dogfetch:2,fisher:2,flock:2,butterfly:3,swimmer:2,sunbather:4,kangaroo:0,quokka:0},o.life||{})};
  if(o.desert)d.desert=1;if(o.sand)d.sand=o.sand;if(o.keepPools)d.keepPools=1;if(o.sandTint)d.sandTint=o.sandTint;
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i-60)*2,z=(j-60)*2;d.h.push(+o.h(x,z).toFixed(2));}
  const A={d,
    road:(pts,type)=>d.roads.push({pts,type:type||'street'}),path:(pts,w,kind)=>d.paths.push({pts,w:w||1.6,kind:kind||'path'}),
    B:(s,x,z,r,op,sign)=>d.bld.push(Object.assign({s,x,z,r:r||0},sign?{sign}:{},op?{o:op}:{})),P:(k,x,z,r,op)=>d.props.push(Object.assign({k,x,z,r:r||0},op||{})),
    T:(k,x,z,s)=>d.trees.push({k,x,z,s:s||.55}),V:(k,x,z,r,go)=>d.veh.push({k,x,z,r:r||0,go:!!go}),biz:(t,x,z,r)=>d.biz.push({t,x,z,r:r||0,lv:1})};
  o.build(A);tidy(d);fs.writeFileSync(OUT+id+'-start.json',JSON.stringify(d));console.log(id,d.bld.length+' bld',d.roads.length+' roads',d.paths.length+' paths',d.props.length+' props',d.trees.length+' trees',d.veh.length+' veh');}
const rnd=(s=>()=>{s=(s*9301+49297)%233280;return s/233280;})(17);
const forest=(A,cx,cz,r,n,kinds)=>{for(let i=0;i<n;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*r;A.T(kinds[i%kinds.length],cx+Math.cos(a)*d,cz+Math.sin(a)*d,.45+rnd()*.35);}};
const shops=(A,x1,x2,z,face,styles,names,op)=>{let k=0;for(let x=x1;x<=x2;x+=6.2,k++)A.B(styles[k%styles.length],x,z,face,Object.assign({wall:['#efe3c4','#e8d8b0','#b8d4d8','#e8b8b0','#f2dc96','#d8e2c8'][k%6],awning:['#e85a6a','#3e7d5c','#f2c14e','#2f6fb0','#e8a33a'][k%5]},op||{}),names[k%names.length]);};

// A shopping strip with mixed buildings (Paul, 20 Nov 2026: "เติมตึกหลากหลายแบบในย่าน shopping strip"): old two-storey banks and
// halls, a corner pub, verandah shops with tall parapets, two-storey shops, a café with tables out the front, takeaway kiosks,
// terraces with balconies, an arcade; mixed widths, colours, awnings and parapets; benches, planters, bikes and lamps on the footpath.
// axis 'x': the road runs along x at z=c; axis 'z': along z at x=c. side -1/+1 = which side of the road. Lots are packed along the road.
const LOTS=[
  ['heritage',{w:9,d:8,floors:2,fh:3.6,wall:'#e8d4a8',windows:'round',parapetH:1.6,verandah:true}],
  ['strip',{w:5.4,d:8,parapetH:1.9}],['shop',{w:6,d:7,floors:2}],['cafe',{w:7,d:6,deck:false}],['strip',{w:5.4,d:8,parapetH:1.2}],
  ['kiosk',{w:3.6,d:3.4}],['mallshop',{w:5.6,d:8}],['terrace',{w:4.6,d:8}],['terrace',{w:4.6,d:8}],['pub',{w:10,d:9}],
  ['shop',{w:5,d:7,floors:1,fh:3.6}],['strip',{w:6.4,d:8,parapetH:2.2}],['heritage',{w:8,d:8,floors:2,fh:3.4,wall:'#d8c8a8',parapetH:1.1,verandah:true}],
  ['cottage',{w:6,d:6,wall:'#f3eee0',verandah:true,awning:'#3e7d5c'}],['shop',{w:6.5,d:7,floors:2,windows:'sash',shutters:'#2f6fb0'}],['mallshop',{w:7,d:8,floors:1,fh:4}]];
const WALLS=['#efe3c4','#e8d8b0','#b8d4d8','#e8b8b0','#f2dc96','#d8e2c8','#f6f2e8','#d0b090','#c8d8e8','#e0c8d8'],AWN=['#e85a6a','#3e7d5c','#f2c14e','#2f6fb0','#e8a33a','#7a3a6a','#d8343a'];
const TIN=['#7a8088','#8a3a2a','#3e6d5c','#5a6a8a','#a85a3a'];
function strip(A,axis,c,from,to,side,names,seed){const r=(s=>()=>{s=(s*9301+49297)%233280;return s/233280;})(seed||7);let p=from,k=0;const ord=LOTS.map((l,i)=>[r(),i]).sort((a,b)=>a[0]-b[0]).map(a=>a[1]);
  if(names.some(n=>/HOTEL|TAVERN|ARMS/.test(n)))ord.unshift(9);
  while(true){const [st,base]=LOTS[ord[k%ord.length]];const o=Object.assign({},base);const w=o.w,d=o.d;if(p+w>to)break;
    if(!base.wall)o.wall=WALLS[(k*3+seed)%WALLS.length];if(st!=='heritage'&&st!=='pub'&&st!=='terrace'&&!base.awning)o.awning=AWN[(k+seed)%AWN.length];if(st==='strip'||st==='terrace')o.roofColor=TIN[(k+seed)%TIN.length];
    const m=p+w/2,off=c+side*(3.6+d/2);const x=axis==='x'?m:off,z=axis==='x'?off:m;const rot=axis==='x'?(side<0?0:Math.PI):(side<0?Math.PI/2:-Math.PI/2);
    A.B(st,+x.toFixed(2),+z.toFixed(2),rot,o,names[k%names.length]);
    const fx=axis==='x'?m:c+side*2.7,fz=axis==='x'?c+side*2.7:m,pr=['bench','planter','lamp','bikes','planter','bench'][k%6];
    if(st==='cafe')A.P('cafeset',+fx.toFixed(2),+fz.toFixed(2),rot);else if(k%2===0)A.P(pr,+fx.toFixed(2),+fz.toFixed(2),rot);
    p+=w+.5;k++;}}
const homes=(A,x1,x2,z,face,styles)=>{let k=0;for(let x=x1;x<=x2;x+=8.5,k++)A.B(styles[k%styles.length],x,z,face,{wall:['#f3eee0','#efe3c4','#b8d4d8','#e8d8b0','#f6f2e8','#d8e2c8'][k%6]});};
const lamps=(A,pts,step)=>{for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);for(let t=4;t<L;t+=step||10){const x=a[0]+(b[0]-a[0])*t/L,z=a[1]+(b[1]-a[1])*t/L,nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L;A.P('lamp',x+nx*3.4,z+nz*3.4);}}};

// ---- Heirisson Island: an island in the Swan River, the Causeway over it, kangaroos, gums, paths round the shore ----
map('hi','Heirisson Island',{keepPools:1,life:{kangaroo:14,pelican:4,gull:8,dolphin:0,boat:3,kayak:4,walker:14,cyclist:8,swimmer:0,sunbather:0},
  h:(x,z)=>{const isl=((x/58)**2+(z/30)**2),bank=Math.abs(z)>92?1:0;if(bank)return .6+nz(x,z)*.1;return isl<1?.5+(1-isl)*.8+nz(x,z)*.12:-1.6-Math.min(1.2,(isl-1)*1.4);},
  build(A){A.road([[-118,-6],[-60,-6]],'bridge');A.road([[-60,-6],[60,-6]],'street');A.road([[60,-6],[118,-6]],'bridge');
    A.road([[-118,-100],[118,-100]],'arterial');A.road([[-118,100],[118,100]],'arterial');A.road([[-118,-100],[-118,-6]],'arterial');A.road([[118,-6],[118,100]],'arterial');
    const loop=[];for(let i=0;i<=24;i++){const a=i/24*6.283;loop.push([+(Math.cos(a)*50).toFixed(1),+(Math.sin(a)*24).toFixed(1)]);}A.path(loop,1.8,'gravel');A.path([[0,-6],[0,24]],1.4,'gravel');
    forest(A,-28,10,14,26,['gum','gum','pepper']);forest(A,30,12,12,20,['gum','pepper']);forest(A,10,-16,9,10,['gum']);
    [[-20,-14],[22,-15],[0,16]].forEach(([x,z])=>{A.P('bench',x,z);A.P('bench',x+3,z,Math.PI);});A.P('sign',-6,-2,0);A.B('kiosk',-8,6,0,{wall:'#e8dcc4'},'ISLAND KIOSK');
    homes(A,-110,110,108,Math.PI,['house','cottage','bungalow']);for(let x=-100;x<=100;x+=40)A.B('flats',x,-112,0,{floors:3});
    A.V('sedan',-90,-6,Math.PI/2,1);A.V('hatch',80,-6,-Math.PI/2,1);A.V('citybus',-40,-100,Math.PI/2,1);}});

// ---- Perth Airport: runway, taxiway, terminal with gates and planes, control tower, hangars, car park ----
map('airport','Perth Airport',{life:{walker:30,gull:2,pelican:0,dolphin:0,boat:0,kayak:0,swimmer:0,sunbather:0,fisher:0,picnic:0,kangaroo:4},fol:{tuft:.5,flower:.1,bush:.01,tree:.001},
  h:(x,z)=>.5+nz(x,z)*.05,
  build(A){A.road([[-112,-70],[112,-70]],'highway');/* runway */A.road([[-100,-50],[100,-50]],'arterial');/* taxiway */[-80,-20,40,90].forEach(x=>A.road([[x,-70],[x,-50]],'arterial'));
    [-60,-30,0,30,60].forEach(x=>A.road([[x,-50],[x,-26]],'arterial'));A.B('bigbox',0,-14,0,{w:84,d:16,fh:6,wall:'#e8eef2',awning:'#2f6fb0'},'PERTH AIRPORT · DEPARTURES');
    [-60,-30,0,30,60].forEach((x,i)=>A.P('plane',x,-36,Math.PI,{color:['#2f6fb0','#d8343a','#2fa86a','#e8a33a','#6a3ad0'][i],s:.9}));A.P('plane',-40,-70,Math.PI/2,{color:'#d8343a',s:.9});
    A.B('lighthouse',96,-24,0,{w:4,d:4,floors:7,wall:'#e8eef2',trim:'#2f3a48'});[-100,-80].forEach(x=>A.B('bigbox',x,-24,0,{w:16,d:14,fh:7,wall:'#c8d0d8'},'HANGAR'));
    A.road([[-112,6],[112,6]],'arterial');A.road([[0,6],[0,112]],'arterial');A.path([[-60,24],[60,24],[60,58],[-60,58],[-60,24]],30,'lane');/* the car park */
    for(let x=-54;x<=54;x+=4.6)[30,38,46,52].forEach((z,j)=>{if(rnd()<.75)A.V(['sedan','hatch','suv','ute','van'][(x|0+j)%5&3],x,z,Math.PI/2,0);});
    A.V('taxi',-20,6,0,1);A.V('citybus',20,6,Math.PI,1);A.V('taxi',0,40,Math.PI/2,1);for(let x=-104;x<=104;x+=16){A.T('gum',x,16,.5);A.T('gum',x,66,.5);}A.P('flagpole',-6,0);A.P('flagpole',6,0);}});

// ---- Regional town (shared map for the regional towns): coast to the west, main street shopping strip, homes, campsite,
//      car park, beach and jetty; a forest walk up the hill to a waterfall ----
map('regional','Regional Town',{life:{walker:22,kangaroo:6,cyclist:4,dolphin:2,boat:2,kayak:2,swimmer:3,sunbather:6},
  h:(x,z)=>{const coast=-70+nz(0,z)*8;if(x<coast)return -Math.min(2.6,.5+(coast-x)*.08);const hill=Math.max(0,(x-50))*.07+Math.max(0,-(z+30))*.03;return .35+sm(coast,coast+10,x)*.4+hill+nz(x,z)*.15;},
  build(A){A.road([[-60,0],[110,0]],'street');[-30,10,50].forEach(x=>A.road([[x,-70],[x,70]],'street'));A.road([[-30,40],[110,40]],'street');A.road([[-30,-40],[50,-40]],'street');A.road([[110,0],[110,-90]],'island');
    strip(A,'x',0,-27,7.5,-1,['OCEANVIEW HOTEL','SALTBUSH BAKERY','THE CORNER STORE','DUNNART NEWS','SURF & TACKLE','RIVERGUM CAFE'],3);strip(A,'x',0,12.5,46,-1,['POST OFFICE','FISH & CHIPS','HARDWARE','CHEMIST','SHIRE OFFICE'],5);
    strip(A,'x',0,-27,7.5,1,['VISITOR CENTRE','GENERAL STORE','OP SHOP','GALAH GALLERY','BUTCHER'],11);strip(A,'x',0,12.5,46,1,['PIZZA','TAKEAWAY','BOOKSHOP','NEWSAGENCY','GROCER'],13);lamps(A,[[-60,0],[40,0]],12);
    [16,30,52,64].forEach(z=>{homes(A,-24,44,z,z<40?Math.PI:0,['house','cottage','bungalow','cottage']);homes(A,-24,44,-z,-z<-40?0:Math.PI,['cottage','house','bungalow']);});
    A.path([[-62,-24],[-62,30]],1.6);A.P('jetty',-80,8,0,{lines:[[-66,8],[-96,8]],w:2.4});A.P('busstop',0,-4.5);A.P('playground',62,20);
    A.path([[-56,-60],[-20,-60],[-20,-86],[-56,-86],[-56,-60]],16,'gravel');/* campsite */for(let i=0;i<10;i++)A.P('tent',-52+(i%5)*7,-66-Math.floor(i/5)*12,rnd()*3,{seed:i});A.P('campfire',-38,-73);A.V('campervan',-26,-66,0,0);A.V('caravan',-26,-78,0,0);
    A.path([[-56,52],[-34,52],[-34,70],[-56,70],[-56,52]],16,'lane');/* car park */for(let x=-54;x<=-36;x+=4.2)A.V(['sedan','ute','hatch','suv'][((x+60)|0)%4],x,58,Math.PI/2,0);
    forest(A,85,-55,30,90,['gum','gum','pepper','gum']);A.path([[110,-20],[96,-40],[100,-60],[92,-80]],1.2,'gravel');A.P('waterfall',92,-88,0,{h:5,w:2.6});A.P('sign',108,-18,0);A.P('bench',96,-78,0);
    A.V('ute',10,0,0,1);A.V('sedan',-30,20,Math.PI/2,1);A.V('truck',50,-20,Math.PI/2,1);}});

// ---- Cervantes: crayfish town by the sea, jetty and boats, a caravan park, a little lake behind the dunes ----
map('cervantes','Cervantes',{keepPools:1,sand:[{x:-40,z:-60,r:30},{x:-46,z:60,r:28}],life:{walker:14,boat:4,pelican:4,gull:10,swimmer:2,sunbather:5,kangaroo:3},
  h:(x,z)=>{const coast=-58+nz(0,z)*6;if(x<coast)return -Math.min(2.6,.4+(coast-x)*.07);const lake=((x-60)/20)**2+((z+40)/12)**2;if(lake<1)return -.4;return .3+sm(coast,coast+12,x)*.5+nz(x,z)*.2;},
  build(A){A.road([[-40,0],[110,0]],'street');[0,40].forEach(x=>A.road([[x,-60],[x,60]],'street'));A.road([[0,30],[90,30]],'street');
    strip(A,'x',0,3,38,-1,['SEAVIEW TAVERN','CRAYPOT CAFE','LOBSTER SHACK','CERVANTES STORE','TACKLE & BAIT','BAKERY','NEWS & POST'],3);strip(A,'x',0,3,38,1,['COAST GALLERY','PIZZA BAR','CHEMIST','DIVE SHOP','ICE CREAMS'],5);A.B('bigbox',60,-12,0,{w:14,d:10,fh:4,wall:'#e8dcc4',awning:'#d8343a'},'ROCK LOBSTER FACTORY');
    homes(A,6,36,12,Math.PI,['cottage','house']);homes(A,6,80,40,Math.PI,['house','cottage','bungalow']);homes(A,48,96,-64,0,['cottage','house']);
    A.P('jetty',-64,0,0,{lines:[[-56,0],[-90,0]],w:2.4});A.biz('fishing',-80,8,0);A.biz('fishing',-82,-8,0);A.path([[-50,-40],[-50,40]],1.4,'gravel');
    A.path([[60,10],[86,10],[86,24],[60,24],[60,10]],12,'gravel');for(let i=0;i<6;i++)A.V(i%2?'caravan':'campervan',62+(i%3)*9,13+Math.floor(i/3)*8,0,0);A.path([[50,-40],[70,-40]],1.2,'path');A.P('bench',70,-40,0);}});

// ---- Lancelin: a small coastal town with big white sand dunes inland, utes on the sand ----
map('lancelin','Lancelin Sand Dunes',{sandTint:'#fff4e0',sand:[{x:50,z:0,r:80},{x:70,z:70,r:50},{x:80,z:-70,r:50}],life:{walker:12,kangaroo:2,sunbather:6,swimmer:3,boat:2,gull:8},fol:{tuft:.3,flower:.1,bush:.02,tree:.001},
  h:(x,z)=>{const coast=-70+nz(0,z)*5;if(x<coast)return -Math.min(2.6,.4+(coast-x)*.08);const dune=Math.max(0,x+10)*.05*(1.2+Math.sin(x*.09+z*.05)*.6+Math.sin(z*.13)*.4)+Math.max(0,Math.sin(x*.05+z*.03))*3;return .35+sm(coast,coast+10,x)*.4+(x>0?dune:nz(x,z)*.2);},
  build(A){A.road([[-60,0],[10,0]],'street');A.road([[-30,-50],[-30,50]],'street');strip(A,'x',0,-58,-33,-1,['THE BREAKERS','DUNE SURF','LANCELIN GENERAL STORE','CAFE ON THE SAND','SANDBOARD HIRE','TAKEAWAY'],9);strip(A,'x',0,-58,-33,1,['BAIT & TACKLE','BAKERY','OP SHOP','POST OFFICE'],13);
    homes(A,-26,-8,12,Math.PI,['cottage','house']);homes(A,-26,-8,-14,0,['house','cottage']);homes(A,-56,-36,24,Math.PI,['cottage','house']);homes(A,-56,-36,-26,0,['house','cottage']);A.P('jetty',-80,4,0,{lines:[[-70,4],[-98,4]],w:2.2});
    A.path([[10,0],[40,10],[70,-10],[100,20]],3,'gravel');/* sand track */A.V('ute',40,10,.3,1);A.V('suv',70,-10,1.2,1);A.V('ute',90,30,2,0);
    A.P('sign',8,-3,0);A.P('dunefence',-62,-30,0,{lines:[[-62,-40],[-62,40]]});}});

// ---- The Pinnacles: limestone pillars across yellow desert sand, a loop drive, a lookout and the visitor centre ----
map('pinnacles','The Pinnacles',{desert:1,sandTint:'#f0b860',life:{walker:16,kangaroo:5,gull:2,pelican:0,dolphin:0,boat:0,kayak:0,swimmer:0,sunbather:0,picnic:0,fisher:0,cyclist:0,dogfetch:0,butterfly:1},fol:{tuft:.18,flower:.04,bush:.02,tree:0},
  h:(x,z)=>1.1+nz(x,z)*.4+Math.max(0,Math.sin(x*.04)*Math.cos(z*.05))*1.2,
  build(A){const loop=[];for(let i=0;i<=28;i++){const a=i/28*6.283;loop.push([+(Math.cos(a)*62+Math.sin(a*3)*8).toFixed(1),+(Math.sin(a)*48).toFixed(1)]);}A.path(loop,4,'gravel');A.road([[-110,-90],[-60,-60],[-62,0]],'island');
    for(let i=0;i<420;i++){const x=-108+rnd()*216,z=-108+rnd()*216;if(Math.abs(Math.hypot(x/62,z/48)-1)<.08)continue;if(x<-50&&z<-40)continue;A.P('pinnacle',+x.toFixed(1),+z.toFixed(1),rnd()*6,{h:.8+rnd()*2.4,s:1});}
    A.B('bigbox',-92,-96,.6,{w:18,d:10,fh:4,wall:'#d8b880',awning:'#7a5a3a'},'PINNACLES DISCOVERY CENTRE');A.path([[-80,-84],[-70,-76]],10,'lane');for(let i=0;i<5;i++)A.V(['campervan','suv','sedan','ute','caravan'][i],-84+i*4,-80,.6,0);
    A.P('sign',-60,-58,0);A.P('bench',0,0,0);A.P('flagpole',-96,-86);}});

// ---- Albany: a harbour town under a granite hill, heritage main street, the harbour jetty, granite boulders, karri forest ----
map('albany','Albany',{life:{walker:22,boat:4,pelican:3,gull:8,dolphin:3,swimmer:1,sunbather:2,kangaroo:3},
  h:(x,z)=>{const coast=-40+nz(x,0)*6;if(z<coast)return -Math.min(2.6,.4+(coast-z)*.06);const hill=4.5*Math.exp(-((x-60)**2+(z-40)**2)/900)+3*Math.exp(-((x+70)**2+(z-70)**2)/700);return .4+sm(coast,coast+8,z)*.5+hill+nz(x,z)*.2;},
  build(A){A.road([[-110,-28],[110,-28]],'street');A.road([[-10,-28],[-10,100]],'street');[-50,30].forEach(x=>A.road([[x,-28],[x,60]],'street'));A.road([[-50,20],[30,20]],'street');
    strip(A,"z",-10,-24,15,-1,["TOWN HALL","HARBOUR BANK","ANZAC CAFE","GRANITE BOOKS","WHALERS ARMS","SADDLERY","SWEET SHOP"],29);strip(A,"z",-10,-24,15,1,["KING GEORGE STORE","SOUTHERN OCEAN GALLERY","PRINCESS ROYAL CAFE","KARRI CRAFTS","POST OFFICE","DRAPERY","WOOL STORE"],31);strip(A,"x",-28,-46,-14,1,["HARBOUR VIEW HOTEL","FISH MARKET","CHANDLERY","BAKERY"],37);
    homes(A,-46,26,30,Math.PI,['cottage','house','bungalow']);homes(A,-46,26,50,0,['house','cottage']);homes(A,36,96,-14,0,['cottage','house','bungalow']);
    A.P('jetty',0,-40,0,{lines:[[0,-36],[0,-70]],w:3});A.biz('fishing',8,-56,0);A.biz('party',-10,-62,0);A.B('bigbox',40,-36,0,{w:16,d:10,fh:5,wall:'#c8ccd0'},'WHARF SHED');
    for(let i=0;i<40;i++){const a=rnd()*6.283,r=rnd()*24;A.P('rock',60+Math.cos(a)*r,40+Math.sin(a)*r,rnd()*6);}forest(A,-70,70,28,70,['gum','gum','pepper']);forest(A,90,80,20,30,['gum']);
    A.path([[30,20],[48,30],[60,40]],1.2,'gravel');A.P('sign',30,24,0);A.P('flagpole',60,40);lamps(A,[[-110,-28],[110,-28]],14);A.V('sedan',-60,-28,Math.PI/2,1);A.V('ute',20,-28,-Math.PI/2,1);}});

// ---- Esperance: white beaches and a turquoise bay, the town foreshore and the long jetty, a pink lake, islands offshore,
//      kangaroos on the sand ----
map('esperance','Esperance',{keepPools:1,life:{walker:16,kangaroo:8,swimmer:4,sunbather:8,boat:3,dolphin:4,seal:0,gull:10,pelican:2},
  h:(x,z)=>{const coast=-30+nz(x,0)*10+Math.sin(x*.03)*10;const isl=[[-70,-90,12],[40,-100,9],[90,-80,7]].some(([a,b,r])=>Math.hypot(x-a,z-b)<r);if(isl)return .4+nz(x,z)*.5;
    if(z<coast)return -Math.min(2.6,.3+(coast-z)*.035);const lake=((x+60)/22)**2+((z-60)/14)**2;if(lake<1)return -.35;return .3+sm(coast,coast+14,z)*.5+Math.max(0,z-60)*.02+nz(x,z)*.2;},
  build(A){A.road([[-110,-6],[110,-6]],'street');[-30,20].forEach(x=>A.road([[x,-6],[x,90]],'street'));A.road([[-30,30],[60,30]],'street');
    strip(A,'x',-6,-27,17,1,['BAYVIEW HOTEL','SOUTHERN SANDS CAFE','ESPERANCE GENERAL','SURF SHACK','FORESHORE FISH & CHIPS','GALLERY BY THE BAY','BOOKS & MAPS','CHEMIST'],17);strip(A,'z',-30,4,26,-1,['HARDWARE','PIZZA','NEWSAGENCY','BUTCHER'],19);strip(A,'z',20,4,26,1,['OP SHOP','BIKE HIRE','HAIR SALON','TAKEAWAY'],23);
    homes(A,-24,56,40,Math.PI,['house','cottage','bungalow']);homes(A,-24,56,22,0,['cottage','house']);A.P('jetty',0,-20,0,{lines:[[0,-14],[0,-70]],w:2.6});A.biz('fishing',12,-50,0);
    A.path([[-110,-16],[110,-16]],1.6);for(let x=-90;x<=90;x+=30){A.P('bench',x,-14,Math.PI);A.T('datepalm',x+6,-12);}A.P('sign',-60,40,0);A.path([[-38,40],[-60,46]],1.2,'gravel');}});
