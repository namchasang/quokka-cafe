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
  if(o.desert)d.desert=1;if(o.sand)d.sand=o.sand;if(o.keepPools)d.keepPools=1;if(o.sandTint)d.sandTint=o.sandTint;if(o.calm)d.calm=1;
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

// ---- Perth Airport (Paul, 20 Nov 2026: layout from the old airport map, more detail): north to south — the hills, the runway, the taxiway,
//      the apron with six gates (jet bridges, a plane at each), ONE long terminal covering every gate, the kerbside drop-off bays and
//      the kerb road; across the road to the south the open car park (right) and the multi-storey car park (left), with the airport
//      railway station below it and the line running west to the Perth CBD. Control tower and hangars at the ends. ----
map('airport','Perth Airport',{life:{walker:36,gull:2,pelican:0,dolphin:0,boat:0,kayak:0,swimmer:0,sunbather:0,fisher:0,picnic:0,kangaroo:3,flock:2},fol:{tuft:.5,flower:.12,bush:.015,tree:.001},
  h:(x,z)=>.5+nz(x,z)*.04+(z<-104?(-104-z)*.35*(1+.4*Math.sin(x*.05)):0),
  build(A){/* airside */A.road([[-116,-90],[116,-90]],'highway');/* the runway */A.road([[-104,-72],[104,-72]],'arterial');/* the taxiway */[-104,-40,40,104].forEach(x=>A.road([[x,-90],[x,-72]],'arterial'));
    A.path([[-100,-52],[100,-52]],26,'lane');/* the apron */[-82,-49,-16,16,49,82].forEach(x=>A.road([[x,-72],[x,-62]],'arterial'));
    const GX=[-82,-49,-16,16,49,82],COL=['#2f6fb0','#d8343a','#2fa86a','#e8a33a','#6a3ad0','#1d3a6e'];
    GX.forEach((x,i)=>{A.P('plane',x,-55,0,{color:COL[i],s:.95});A.P('jetbridge',x-4.5,-37,Math.PI,{len:7});A.V(['van','ute','hatch'][i%3],x+8,-48,0,0);});
    A.P('plane',-60,-90,Math.PI/2,{color:'#d8343a',s:.95});/* one on the runway */A.P('plane',70,-72,-Math.PI/2,{color:'#2fa86a',s:.95});/* one taxiing */
    /* the terminal: one long hall over every gate */A.B('bigbox',0,-28,0,{w:190,d:16,fh:7,wall:'#e8eef2',awning:'#2f6fb0',trim:'#c8d4dc'},'PERTH AIRPORT · DEPARTURES · ARRIVALS');
    A.B('lighthouse',108,-30,0,{w:4,d:4,floors:8,wall:'#e8eef2',trim:'#2f3a48'});[-108,-108].forEach((x,i)=>A.B('bigbox',x,i?-58:-46,0,{w:12,d:10,fh:7,wall:'#c8d0d8',awning:'#5a6a7a'},'HANGAR'));
    /* landside: kerbside bays in front of the terminal, then the kerb road */A.path([[-96,-16.5],[96,-16.5]],3,'lane');
    for(let x=-92;x<=92;x+=5.2){if(Math.abs(x)<6)continue;if(rnd()<.7)A.V(['taxi','sedan','hatch','suv','van','taxi'][((x+92)/5.2|0)%6],x,-16.5,Math.PI/2,0);}
    [-70,-35,0,35,70].forEach(x=>{A.P('busstop',x,-19.2,0);A.P('bench',x+3,-19.2,0);});for(let x=-96;x<=96;x+=12)A.P('lamp',x,-19.6);
    A.road([[-116,-11],[116,-11]],'arterial');/* the kerb road */A.road([[-116,-11],[-116,60]],'arterial');A.road([[116,-11],[116,60]],'arterial');A.road([[-116,60],[116,60]],'arterial');
    /* across the road: the multi-storey car park on the left, the open car park on the right */
    A.B('slab',-66,13,0,{w:56,d:26,floors:4,wall:'#c8ccd0',trim:'#8a9096'},'MULTI-STOREY CAR PARK');
    A.path([[-20,25],[100,25]],42,'lane');/* the open car park */
    for(let x=-16;x<=96;x+=3.4)[10,18,32,40].forEach((z,j)=>{if(rnd()<.72)A.V(['sedan','hatch','suv','ute','van','sedan'][((x+16)/3.4+j|0)%6],+x.toFixed(1),z,j%2?-Math.PI/2:Math.PI/2,0);});
    A.road([[40,-11],[40,4]],'street');A.road([[-66,-11],[-66,-4]],'street');/* entries */
    /* the airport station below the car park, the line west to the Perth CBD */
    const D=A.d;D.rail=[];for(let x=-118;x<=-30;x+=2)D.rail.push([x,34]);
    A.B('bigbox',-60,46,Math.PI,{w:24,d:8,fh:5,wall:'#e8eaec',awning:'#2e8a52',trim:'#1d3a6e'},'AIRPORT STATION · TRAINS TO PERTH CBD');
    A.path([[-60,41],[-60,24]],2.4);A.path([[-38,10],[-38,-20]],2.4);/* walkways: station - car park - terminal */A.P('sign',-56,40,0);
    /* gardens: gums and grass along the kerb road and round the car parks */for(let x=-110;x<=110;x+=14){A.T('gum',x,-6,.5);A.T('gum',x+7,56,.5);}forest(A,0,80,30,24,['gum','gum','pepper']);
    A.V('citybus',-40,-11,Math.PI/2,1);A.V('taxi',20,-11,-Math.PI/2,1);A.V('taxi',-90,-11,Math.PI/2,1);A.V('van',60,60,Math.PI/2,1);A.P('flagpole',-4,-20);A.P('flagpole',4,-20);}});

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
    strip(A,'x',0,3,38,-1,['SEAVIEW TAVERN','CRAYPOT CAFE','SALTY CRAY KITCHEN','CERVANTES STORE','TACKLE & BAIT','BAKERY','NEWS & POST'],3);strip(A,'x',0,3,38,1,['COAST GALLERY','PIZZA BAR','CHEMIST','DIVE SHOP','ICE CREAMS'],5);A.B('bigbox',60,-12,0,{w:14,d:10,fh:4,wall:'#e8dcc4',awning:'#d8343a'},'ROCK LOBSTER FACTORY');
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
    A.B('bigbox',-92,-96,.6,{w:18,d:10,fh:4,wall:'#d8b880',awning:'#7a5a3a'},'DISCOVERY CENTRE');A.path([[-80,-84],[-70,-76]],10,'lane');for(let i=0;i<5;i++)A.V(['campervan','suv','sedan','ute','caravan'][i],-84+i*4,-80,.6,0);
    A.P('sign',-60,-58,0);A.P('bench',0,0,0);A.P('flagpole',-96,-86);}});

// ---- Albany: a harbour town under a granite hill, heritage main street, the harbour jetty, granite boulders, karri forest ----
map('albany','Albany',{life:{walker:22,boat:4,pelican:3,gull:8,dolphin:3,swimmer:1,sunbather:2,kangaroo:3},
  h:(x,z)=>{const coast=-40+nz(x,0)*6;if(z<coast)return -Math.min(2.6,.4+(coast-z)*.06);const hill=4.5*Math.exp(-((x-60)**2+(z-40)**2)/900)+3*Math.exp(-((x+70)**2+(z-70)**2)/700);return .4+sm(coast,coast+8,z)*.5+hill+nz(x,z)*.2;},
  build(A){A.road([[-110,-28],[110,-28]],'street');A.road([[-10,-28],[-10,100]],'street');[-50,30].forEach(x=>A.road([[x,-28],[x,60]],'street'));A.road([[-50,20],[30,20]],'street');
    strip(A,"z",-10,-24,15,-1,["TOWN HALL","HARBOUR BANK","GRANITE & GULL CAFE","GRANITE BOOKS","WHALERS ARMS","SADDLERY","SWEET SHOP"],29);strip(A,"z",-10,-24,15,1,["KING GEORGE STORE","SOUTHERN OCEAN GALLERY","PRINCESS ROYAL CAFE","KARRI CRAFTS","POST OFFICE","DRAPERY","WOOL STORE"],31);strip(A,"x",-28,-46,-14,1,["HARBOUR VIEW HOTEL","FISH MARKET","CHANDLERY","BAKERY"],37);
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

// ======== East-coast cities and the road trip (Paul, 21 Nov 2026) ========
const grid=(A,xs,zs,type)=>{xs.forEach(x=>A.road([[x,zs[0]],[x,zs[zs.length-1]]],type||'street'));zs.forEach(z=>A.road([[xs[0],z],[xs[xs.length-1],z]],type||'street'));};
const towers=(A,x1,x2,z1,z2,step,fl,names,seed)=>{const r=(s=>()=>{s=(s*9301+49297)%233280;return s/233280;})(seed||3);let k=0;
  for(let x=x1;x<=x2;x+=step)for(let z=z1;z<=z2;z+=step){if(r()<.18)continue;const f=fl[0]+Math.floor(r()*(fl[1]-fl[0]));A.B(f>6?'tower':'flats',x+(r()-.5)*2,z+(r()-.5)*2,(r()*4|0)*Math.PI/2,{w:9+r()*5,d:9+r()*5,floors:f,wall:['#c8d4dc','#d8dce0','#b8c8d4','#e0d8c8','#a8b8c8','#d4c8b8'][k%6]},r()<.4?names[k%names.length]:undefined);k++;}};

// ---- Sydney: the harbour across the middle opening to the sea in the east, the steel arch bridge, the ferry wharves at the quay,
//      the white-shelled concert hall on its point, the CBD towers behind the quay, the botanic gardens, the north shore on its hills ----
map('sydney','Sydney',{life:{walker:40,jogger:6,cyclist:6,gull:12,pelican:2,dolphin:2,boat:6,kayak:3,sitter:10,picnic:6,dogfetch:3,fisher:3,swimmer:0,sunbather:2,flock:3,butterfly:2},
  h:(x,z)=>{const n=-30+Math.sin(x*.035)*5,s=10+Math.sin(x*.05+1)*3;const point=x>16&&x<38&&z<14&&z>-8;/* the concert hall point */
    if(z>n&&z<s&&!point&&!(x>70&&z<s+40&&z>n-30&&x>90))return -2.2;if(x>96&&(z<n+10||z>s-8))return -2.2;
    return z<=n?.6+Math.max(0,n-z)*.08+nz(x,z)*.3:.5+Math.max(0,z-s)*.03+nz(x,z)*.1;},
  build(A){A.P('archbridge',-34,-10,Math.PI/2,{len:60,h:5,rise:14});A.road([[-34,-60],[-34,-40],[-34,20],[-34,110]],'highway');
    grid(A,[-70,-50,-10,10,30],[24,44,64,84,104],'street');A.road([[-118,24],[-70,24]],'arterial');A.road([[30,24],[60,24]],'street');
    towers(A,-66,26,32,100,20,[8,30],['HARBOUR TOWER','QUAYSIDE','ONE BRIDGE ST','THE EXCHANGE','MARKET HOUSE'],5);
    A.path([[-26,14],[40,14]],4);/* the quay promenade */[-20,-8,4].forEach((x,i)=>{A.P('jetty',x,8,0,{lines:[[x,12],[x,-2]],w:2.4});A.V('ferry',x+3,1,Math.PI/2,i===1);});A.V('ferry',0,-14,0,1);A.V('ferry',60,-10,Math.PI,1);
    A.P('concerthall',27,2,0,{s:.9});A.path([[16,14],[27,10]],3);[[-12,16],[0,16],[12,16]].forEach(([x,z])=>{A.P('bench',x,z,Math.PI);A.P('lamp',x+3,z);});A.P('cafeset',-4,17,0);A.P('cafeset',8,17,0);A.P('busstop',-24,22,0);
    forest(A,70,50,32,60,['fig','palm','fig','pepper']);A.path([[44,30],[70,40],[96,60]],2,'gravel');A.P('sign',44,28,0);
    homes(A,-110,90,-60,0,['house','cottage','bungalow','units']);homes(A,-110,90,-84,Math.PI,['house','bungalow','units']);towers(A,-22,10,-58,-48,14,[6,14],['NORTH SHORE PLAZA'],9);
    forest(A,-80,-100,18,20,['gum','fig']);forest(A,60,-100,18,20,['gum','fig']);A.V('yacht',50,-18,.3,1);A.V('yacht',-60,-6,2,1);A.V('speedboat',20,-20,1,1);A.V('kayak',-50,4,0,1);
    A.V('citybus',-70,40,0,1);A.V('taxi',-10,60,Math.PI/2,1);A.V('sedan',10,44,0,1);A.V('ute',-34,60,Math.PI/2,1);}});

// ---- Melbourne: the river through the middle, the CBD grid north of it with trams, laneways of cafés, the big domed station by the river,
//      Southbank towers and the promenade south of it, gardens to the east ----
map('melbourne','Melbourne',{keepPools:1,calm:1,life:{walker:44,jogger:6,cyclist:10,gull:6,pelican:1,dolphin:0,boat:3,kayak:4,sitter:10,picnic:6,dogfetch:3,fisher:2,swimmer:0,sunbather:0,flock:3,butterfly:2},
  h:(x,z)=>{const c=22+Math.sin(x*.03)*6;if(Math.abs(z-c)<6)return -1.6;return .5+nz(x,z)*.08;},
  build(A){grid(A,[-90,-60,-30,0,30,60],[-90,-60,-30,0],'arterial');towers(A,-75,45,-75,-15,30,[8,30],['COLLINS HOUSE','FLINDERS LANE','BOURKE PLACE','THE GALLERIA','MARKET TOWER','ELIZABETH COURT'],7);
    [[-75,-45],[-15,-45],[45,-15]].forEach(([x,z])=>{A.path([[x-12,z],[x+12,z]],2.4);strip(A,'x',z-2.4,x-12,x+12,-1,['ESPRESSO LANE','THE LITTLE DUMPLING','DEGRAVES-STYLE CAFE'.replace('DEGRAVES-STYLE ','LANEWAY '),'RECORD BAR','BAGEL CORNER','NOODLE HOUSE'],x&7|1);});
    [[-90,-75,0],[0,-30,Math.PI/2],[-60,-90,0],[30,-60,Math.PI/2]].forEach(([x,z,r],i)=>A.P('tram',x,z,r,{color:i%2?'#2f8a5a':'#e8a33a'}));
    A.B('heritage',-14,10,Math.PI,{w:30,d:10,floors:2,fh:4,wall:'#f2c14e',parapetH:2,windows:'round'},'CENTRAL STATION');A.P('flagpole',-14,4);A.P('busstop',-4,4,0);
    [-30,0,30].forEach(x=>A.road([[x,0],[x,44]],'bridge'));A.road([[-118,44],[118,44]],'arterial');towers(A,-80,80,60,92,20,[8,24],['SOUTHBANK TOWER','RIVERSIDE','ARTS CENTRE','CROWN-LESS PLAZA'.replace('CROWN-LESS ','RIVER ')],11);
    A.path([[-110,32],[110,32]],3);for(let x=-100;x<=100;x+=16){A.P('bench',x,31,0);A.P('lamp',x+6,33);A.T('pepper',x+10,34,.5);}
    forest(A,95,-50,22,40,['fig','gum','pepper']);A.path([[78,-70],[96,-48],[112,-30]],2,'gravel');A.V('kayak',-40,22,0,1);A.V('kayak',20,20,0,1);A.V('partyboat',60,22,0,1);
    A.V('citybus',-60,-60,Math.PI/2,1);A.V('taxi',0,-60,0,1);A.V('sedan',30,-30,Math.PI/2,1);}});

// ---- Katoomba (Blue Mountains): the town on the plateau with its main street and railway, the cliff edge with a lookout, three tall
//      rock pillars below it, a waterfall off the cliff, the cable car over the valley, the bush walk down into the forest ----
map('katoomba','Katoomba (Blue Mountains)',{calm:1,life:{walker:24,jogger:2,cyclist:2,gull:0,pelican:0,dolphin:0,boat:0,kayak:0,sitter:6,picnic:4,dogfetch:2,fisher:0,swimmer:0,sunbather:0,flock:4,butterfly:4,kangaroo:3},
  h:(x,z)=>{const edge=-2+Math.sin(x*.06)*3+Math.sin(x*.023)*3;const top=14+nz(x,z)*.6,valley=1.2+nz(x,z)*1.2+Math.max(0,z-90)*.1;return z<edge?top:valley+(top-valley)*(1-sm(edge,edge+7,z));},
  build(A){A.rail=1;const D=A.d;D.rail=[];for(let x=-118;x<=118;x+=2)D.rail.push([x,-92]);A.road([[-118,-78],[118,-78]],'arterial');A.road([[0,-78],[0,-20]],'street');A.road([[-60,-78],[-60,-20]],'street');A.road([[-60,-20],[60,-20]],'street');
    strip(A,'z',0,-74,-26,-1,['MOUNTAIN BAKERY','THE MIST CAFE','ANTIQUES','BUSHWALK GEAR','OLD THEATRE','CHOCOLATERIE','GALLERY ON THE HILL','BOOK BARN'],41);strip(A,'z',0,-74,-26,1,['GUESTHOUSE','POST OFFICE','PIE SHOP','CRYSTALS & GIFTS','HARDWARE','THE CARRINGTON-STYLE HOTEL'.replace('CARRINGTON-STYLE ','GRAND ')],43);
    A.B('heritage',-30,-86,0,{w:16,d:6,floors:1,fh:3.6,wall:'#c8a878'},'KATOOMBA STATION');homes(A,-110,-70,-60,0,['cottage','house','bungalow']);homes(A,30,110,-60,0,['cottage','house','bungalow']);homes(A,30,110,-40,Math.PI,['house','cottage']);
    A.path([[-40,-20],[-40,-12]],3);A.P('sign',-40,-14,0);[-46,-40,-34].forEach(x=>A.P('bench',x,-11,Math.PI));A.P('flagpole',-50,-12);/* the lookout */
    [[-46,12,9],[-39,13,11],[-32,12,8]].forEach(([x,z,h])=>A.P('rockpillar',x,z,0,{h:h*1.4,w:2.8}));/* three rock pillars below the lookout */
    A.P('waterfall',30,6,0,{h:12,w:2.6});A.P('cablecar',10,40,Math.PI/2,{len:70,h0:14,h1:2,top:4});
    A.path([[-10,-18],[-14,-4],[-4,6],[-16,18],[-6,32],[-20,50]],1.2,'gravel');A.path([[-6,32],[20,40],[30,8]],1.2,'gravel');A.P('sign',-10,-18,0);
    forest(A,0,70,110,320,['gum','gum','gum','pepper','fig']);forest(A,80,-10,20,24,['gum']);forest(A,-90,-10,20,24,['gum']);
    A.V('citybus',-30,-78,Math.PI/2,1);A.V('sedan',0,-50,0,1);A.V('suv',40,-78,-Math.PI/2,1);}});

// ---- The Great Ocean Road: a seaside town with a surf beach in the east, the road winding west along the cliffs past a lighthouse on
//      its headland, forest on the hills, to the lookout and visitor centre over the Twelve Apostles sea stacks in the west ----
const GOR=x=>28+Math.sin(x*.035)*14+Math.sin(x*.09)*4;/* the coastline: land north (z<), the ocean south */
map('gor','Great Ocean Road · Twelve Apostles',{sand:[{x:90,z:42,r:26}],life:{walker:18,jogger:2,cyclist:4,gull:14,pelican:2,dolphin:4,boat:3,kayak:1,sitter:6,picnic:4,dogfetch:2,fisher:3,swimmer:4,sunbather:6,flock:3,butterfly:2,kangaroo:4,seal:4},
  h:(x,z)=>{const c=GOR(x);if(z>c){const st=[[-96,62],[-84,54],[-76,66],[-66,58],[-58,70],[-50,60],[-104,72],[-40,66]].some(([a,b])=>Math.hypot(x-a,z-b)<3.2);return st?10:-Math.min(3,.5+(z-c)*.06);}
    const cliff=x<60?9-Math.max(0,x)*.04:sm(110,60,x)*6+.6;return .6+cliff*sm(c,c-6,z)+Math.max(0,c-6-z)*.05*(x<60?1:.4)+nz(x,z)*.4;},
  build(A){const pts=[];for(let x=118;x>=-108;x-=6)pts.push([x,+(GOR(x)-10-(x<60?2:0)).toFixed(1)]);A.road(pts,'arterial');
    strip(A,'x',GOR(90)-10,74,112,-1,['SURF CLUB CAFE','BOARD HIRE','FISH & CHIPS','THE OCEAN HOTEL','GENERAL STORE','ICE CREAMS'],51);homes(A,72,112,GOR(90)-32,0,['cottage','house','bungalow']);
    A.P('jetty',100,GOR(100)+2,0,{lines:[[100,GOR(100)],[100,GOR(100)+16]],w:2.2});A.V('fishingboat',104,GOR(104)+12,0,0);for(let x=80;x<=108;x+=7){A.P('umbrella',x,GOR(x)+3);A.P('towel',x+2,GOR(x)+4);}
    A.B('lighthouse',10,GOR(10)-4,0,{w:3.6,d:3.6,floors:5,wall:'#f4f2ea',trim:'#d8343a'},'CAPE LIGHTHOUSE');A.B('cottage',18,GOR(18)-10,0,{wall:'#f4f2ea'},'KEEPERS COTTAGE');A.road([[10,GOR(10)-10],[10,GOR(10)-5]],'island');
    A.B('bigbox',-70,GOR(-70)-26,0,{w:16,d:8,fh:4,wall:'#d8c8a8',awning:'#3e6d5c'},'TWELVE APOSTLES VISITOR CENTRE');A.path([[-80,GOR(-80)-20],[-56,GOR(-56)-20]],12,'lane');for(let x=-78;x<=-58;x+=4.2)A.V(['campervan','suv','sedan','hatch','ute'][((x+80)/4.2|0)%5],x,GOR(x)-20,Math.PI/2,0);
    A.path([[-70,GOR(-70)-20],[-74,GOR(-74)-4],[-80,GOR(-80)-2],[-66,GOR(-66)-2]],1.6,'path');[-80,-73,-66].forEach(x=>{A.P('bench',x,GOR(x)-3,0);A.P('fence',x+2,GOR(x)-1.5,0);});A.P('sign',-70,GOR(-70)-14,0);
    forest(A,0,-70,110,180,['gum','gum','pepper','gum']);A.P('sign',112,GOR(112)-14,0);A.P('waterfall',-20,-60,0,{h:4,w:2});A.path([[-20,GOR(-20)-12],[-24,-30],[-20,-56]],1.2,'gravel');
    A.V('campervan',40,GOR(40)-12,-Math.PI/2,1);A.V('sedan',-20,GOR(-20)-12,Math.PI/2,1);A.V('caravan',80,GOR(80)-12,-Math.PI/2,1);A.V('ute',-60,GOR(-60)-12,Math.PI/2,1);}});
