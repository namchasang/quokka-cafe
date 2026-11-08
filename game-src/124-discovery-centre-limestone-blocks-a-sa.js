// ===== the Discovery Centre: limestone blocks, a sage tin skillion roof, a verandah, a lookout deck over the desert =====
const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:ctex(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:ctex(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
const STONE='#dcc394',STONE2='#cdb282';
const h0=1.4;
{const x1=CEN.x1,x2=CEN.x2,z1=CEN.z1,z2=CEN.z2,W=x2-x1,D=z2-z1,Hh=3.6,cx=(x1+x2)/2,cz=(z1+z2)/2;
  const south=litMat(lit=>{const c=PXK.wall(W,Hh,{base:STONE,kind:'stone',win:4,door:true,doorAt:.62,doorCol:'#5a4632',lit,seed:61,cornice:false,winW:30,winH:34});return c;});
  const north=litMat(lit=>PXK.wall(W,Hh,{base:STONE,kind:'stone',win:5,lit,seed:62,cornice:false,winW:30,winH:34}));
  const west=litMat(lit=>PXK.wall(D,Hh,{base:STONE,kind:'stone',win:2,lit,seed:63,cornice:false}));
  // the east end faces the deck: a wall of glass between stone piers
  const east=litMat(lit=>{const c=PXK.wall(D,Hh,{base:STONE,kind:'stone',win:0,seed:64,cornice:false}),x=c.getContext('2d');const w=c.width,h=c.height;
    for(let i=0;i<3;i++){const gx=10+i*Math.floor((w-20)/3),gw=Math.floor((w-20)/3)-10;const gl=PXK.glass(gw,h-34,{lit,tint:'#6f8fa8',seed:5+i});x.fillStyle='#3a3026';x.fillRect(gx-2,14,gw+4,h-30);x.drawImage(gl,gx,16);}
    return c;});
  const roofT=texM(PXK.roof(W+2.4,D+3.6,{base:'#8e9c86',kind:'tin',seed:12}));
  put(B(W,Hh,D),[east,west,M(STONE2),M(STONE2),south,north],cx,h0+Hh/2,cz);
  put(B(W+.3,.32,D+.3),M('#b89a6a'),cx,h0+.16,cz,{nc:1});
  // skillion roof: high at the south (front), low at the north, deep eaves; verandah on the south front
  const rf=put(B(W+2.4,.16,D+3.6),[M('#6e7a68'),M('#6e7a68'),roofT,M('#5a6458'),M('#6e7a68'),M('#6e7a68')],cx,h0+Hh+.32,cz+.9,{rx:-.07});
  put(B(W+2.5,.34,.12),M('#5e6a5a'),cx,h0+Hh+.48,cz+.9+(D+3.6)/2,{nc:1});
  for(let i=0;i<5;i++){const px=x1+.5+i*(W-1)/4;put(B(.2,Hh+.3,.2),M('#7a5a3c'),px,h0+(Hh+.3)/2,z2+2.2);put(B(.5,.12,.1),M('#6a4a30'),px,h0+Hh-.1,z2+2.15,{nc:1});col(px-.15,z2+2.05,px+.15,z2+2.35);}
  put(B(W+.4,.16,.18),M('#6a4a30'),cx,h0+Hh+.12,z2+2.2,{nc:1});
  // fascia sign: plain name, no logos
  {const sg=put(new THREE.PlaneGeometry(5.2,.5),new THREE.MeshBasicMaterial({map:makeSign(['DISCOVERY CENTRE'],104,12,'#4a3a2a','#f4e2b8')}),cx,h0+Hh+.47,cz+.9+(D+3.6)/2+.07,{nc:1});}
  // solar panels, roof vents, a rainwater tank on the west side
  {const[c,x]=cvs(32,20);x.fillStyle='#1d2a44';x.fillRect(0,0,32,20);x.fillStyle='#2f4a74';for(let i=0;i<4;i++)for(let j=0;j<2;j++)x.fillRect(1+i*8,1+j*10,7,9);x.fillStyle='#8aa8d0';for(let i=0;i<4;i++)x.fillRect(2+i*8,2,2,1);
    const sp=texM(c);for(let i=0;i<3;i++)put(B(1.6,.06,1),[M('#c0c4c8'),M('#c0c4c8'),sp,M('#c0c4c8'),M('#c0c4c8'),M('#c0c4c8')],x1+2+i*1.8,h0+Hh+.52+.06*i*0,cz+1.6,{rx:-.07,nc:1});}
  put(CY(.14,.14,.4,8),M('#a8acae'),x2-1.4,h0+Hh+.55,cz-.6,{nc:1});put(new THREE.ConeGeometry(.22,.14,8),M('#8a8e90'),x2-1.4,h0+Hh+.82,cz-.6,{nc:1});
  {const[c,x]=cvs(64,48);for(let X=0;X<64;X+=2){x.fillStyle=X%4?'#b8c0b8':'#d0d6d0';x.fillRect(X,0,2,48);}x.fillStyle='#9aa49a';for(let y=0;y<48;y+=8)x.fillRect(0,y,64,1);
    put(CY(.95,.95,2.1,14),[texM(c),M('#c8cec8'),M('#c8cec8')],x1-1.3,h0+1.05,z1+1.6);put(new THREE.ConeGeometry(1,.3,14),M('#c0c6c0'),x1-1.3,h0+2.25,z1+1.6,{nc:1});col(x1-2.3,z1+.6,x1-.3,z1+2.6);}
  // lamps by the door and under the verandah (warm at night)
  [[x1+3,z2+.12],[x1+8.4,z2+.12]].forEach(([x,z])=>{put(B(.22,.3,.16),M('#2a2a30'),x,h0+2.5,z+.08,{nc:1});const l=put(B(.15,.2,.1),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,h0+2.5,z+.16,{nc:1});PXB_LAMPS.push(l);});
  // benches under the verandah and a drinking fountain
  [x1+1.6,x1+5].forEach(x=>{put(B(1.6,.08,.42),M('#8a6a44'),x,h0+.46,z2+1.2);put(B(1.6,.4,.06),M('#8a6a44'),x,h0+.72,z2+1.42);[-.7,.7].forEach(d=>put(B(.08,.44,.4),M('#3a3a40'),x+d,h0+.22,z2+1.2,{nc:1}));col(x-.85,z2+.95,x+.85,z2+1.5);});
  put(CY(.14,.18,.9,8),M('#9aa0a4'),x2-.6,h0+.45,z2+1.3);col(x2-.8,z2+1.1,x2-.4,z2+1.5);
  col(x1-.1,z1-.1,x2+.1,z2+.1);
  // paving round the centre (pale limestone flags)
  {const[c,x]=cvs(64,64);PXK.blocks(x,64,64,'#e6d6b0',{rowH:16,minW:14,varW:12,mortar:.82});const fl=ctex(c,{rep:[1,1]});fl.magFilter=THREE.NearestFilter;
    const flm=new THREE.MeshLambertMaterial({map:fl,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3});
    const pave=(x1_,x2_,z1_,z2_,y)=>{const g=new THREE.PlaneGeometry(x2_-x1_,z2_-z1_);g.rotateX(-Math.PI/2);const U=g.attributes.uv,P=g.attributes.position;for(let i=0;i<U.count;i++)U.setXY(i,(P.getX(i)+(x1_+x2_)/2)/2,-(P.getZ(i)+(z1_+z2_)/2)/2);const m=put(g,flm,(x1_+x2_)/2,y,(z1_+z2_)/2,{nc:1});return m;};
    pave(x1-2,DECK.x2,z2,z2+3.4,h0+.035);pave(DECK.x1,DECK.x2,DECK.z1,DECK.z2,h0+.035);
    // a ramp of flags down to the car park
    {const g=new THREE.PlaneGeometry(4.6,3.4,8,1);g.rotateX(-Math.PI/2);const P=g.attributes.position,U=g.attributes.uv;for(let i=0;i<P.count;i++){const x=P.getX(i)+1029,z=P.getZ(i)+30.9;P.setY(i,H(x,z)+.04);U.setXY(i,x/2,-z/2);}g.computeVertexNormals();put(g,flm,0,0,0,{nc:1});}}
  PIN.cen={cx,cz,h0};}
// the lookout deck: low limestone parapet with capping, a lectern board, a bench
{const wallT=(w,h,s)=>texM(PXK.wall(w,h,{base:STONE,kind:'stone',win:0,seed:s,cornice:false,moss:false}));
  const par=(x1,z1,x2,z2,s)=>{const w=Math.max(x2-x1,z2-z1),along=x2-x1>z2-z1;const t=wallT(w,.9,s);const m=put(B(along?w:.42,.9,along?.42:w),[t,t,M('#efe2c0'),M(STONE2),t,t],(x1+x2)/2,h0+.45,(z1+z2)/2);
    put(B(along?w+.1:.52,.1,along?.52:w+.1),M('#eee2c4'),(x1+x2)/2,h0+.95,(z1+z2)/2,{nc:1});col(Math.min(x1,x2)-.21,Math.min(z1,z2)-.21,Math.max(x1,x2)+.21,Math.max(z1,z2)+.21);};
  par(DECK.x1,DECK.z1+.21,DECK.x2,DECK.z1+.21,71);par(DECK.x2-.21,DECK.z1,DECK.x2-.21,DECK.z1+3.4,72);par(CEN.x2-.2,DECK.z1+.21,DECK.x1,DECK.z1+.21,73);
  put(B(1.6,.08,.42),M('#8a6a44'),1020.4,h0+.46,30.6);put(B(1.6,.4,.06),M('#8a6a44'),1020.4,h0+.72,30.84);col(1019.6,30.35,1021.2,30.9);}
// interpretive boards: a pixel panel on posts (upright) or a tilted lectern; painted text, a map strip, a little picture
function boardTex(title,lines,opt){opt=opt||{};const W=opt.W||128,Hh=opt.H||80,[c,x]=cvs(W,Hh);
  x.fillStyle=opt.bg||'#f2e6c6';x.fillRect(0,0,W,Hh);x.fillStyle=opt.band||'#a8782e';x.fillRect(0,0,W,13);x.fillStyle='#3a2a18';x.fillRect(0,13,W,1);
  x.fillStyle='#fff6dc';x.font='bold 9px "Pixelify Sans", monospace';x.textBaseline='top';x.fillText(title,4,2);
  // picture: a strip of spires on yellow sand under blue sky
  const py=16,ph_=Math.round(Hh*.32);x.fillStyle='#78b4e0';x.fillRect(4,py,W-8,ph_);x.fillStyle='#f4f4f0';x.fillRect(12,py+3,18,4);x.fillRect(60,py+5,24,4);x.fillStyle='#4f7a3a';x.fillRect(4,py+ph_*.55|0,W-8,3);x.fillStyle='#e8b450';x.fillRect(4,(py+ph_*.55|0)+3,W-8,ph_-(ph_*.55|0)-3);
  const r=mulberry32(title.length*13);for(let i=0;i<26;i++){const X=6+r()*(W-14)|0,h=2+r()*7|0,b=py+ph_-2-(r()*5|0);x.fillStyle=r()<.5?'#b89060':'#a08a70';x.fillRect(X,b-h,2+(r()*2|0),h);x.fillStyle='#d8b880';x.fillRect(X,b-h,1,h);}
  if(opt.emu){x.fillStyle='#4a3a2c';x.fillRect(W-30,py+ph_-12,7,5);x.fillRect(W-24,py+ph_-17,1,6);x.fillRect(W-25,py+ph_-18,2,2);x.fillRect(W-29,py+ph_-7,1,5);x.fillRect(W-26,py+ph_-7,1,5);}
  if(opt.map){x.fillStyle='#e8b450';x.fillRect(W-44,py,40,ph_);x.strokeStyle='#8a5a2a';x.lineWidth=1;x.beginPath();x.ellipse(W-24,py+ph_/2,15,ph_/2-3,0,0,6.283);x.stroke();x.fillStyle='#c03a2a';x.fillRect(W-38,py+ph_-6,3,3);x.fillStyle='#4f7a3a';x.fillRect(W-44,py,4,ph_);}
  x.fillStyle='#3a2a18';x.font='7px "Pixelify Sans", monospace';let y=py+ph_+4;for(const L of lines){x.fillText(L,4,y);y+=8;if(y>Hh-6)break;}
  x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,Hh-1,W,1);return ctex(c);}
const SIGNMATS=[];
function board(x,z,title,lines,o){o=o||{};const w=o.w||1.6,h=o.h||1,tex=boardTex(title,lines,o);const y0=o.y0!=null?o.y0:H(x,z);const face=new THREE.MeshLambertMaterial({map:tex,emissive:0x2a2418,emissiveMap:tex});SIGNMATS.push(face);
  const back=M(o.backCol||'#6a5a48'),frame=M(o.frame||'#8a8e92');
  if(o.lectern){const g=new THREE.Group();g.position.set(x,y0,z);if(o.ry)g.rotation.y=o.ry;G.add(g);
    [-w/2+.12,w/2-.12].forEach(d=>put(B(.1,.95,.1),frame,d,.47,0,{to:g}));
    const p=put(B(w,.05,h),[back,back,face,back,back,back],0,1.02,0,{to:g,rx:.55});return g;}
  [-w/2-.04,w/2+.04].forEach(d=>put(B(.1,h+1,.1),frame,x+d,y0+(h+1)/2,z));
  put(B(w+.12,h+.12,.06),[back,back,back,back,face,back],x,y0+.95+h/2,z);col(x-w/2-.1,z-.12,x+w/2+.1,z+.12);}
// the boards Kip can read (short guide facts in plain English)
const BOARDS=[];
function loopSpot(u,off){const p=LOOP.getPointAt(u),t=LOOP.getTangentAt(u);return[p.x-t.z*off,p.z+t.x*off];}
{const s1=[1046,29.2];board(s1[0],s1[1],'WELCOME TO THE PINNACLES',['Drive: the sandy one-way desert loop.','Walk: leave the car, wander the spires.','Discover: displays + lookout at the centre.','Stay on the track. Take only photos.'],{w:2.6,h:1.5,map:1,W:160,H:96,band:'#9a6a24'});
  BOARDS.push({id:'welcome',x:s1[0],z:s1[1]+.9,label:'Read the welcome board',lines:['WELCOME TO THE PINNACLES','Thousands of limestone spires stand in this yellow sand plain, some up to about 3.5 m tall.','Drive the one-way desert loop, or park and walk among the spires. Stay on the track and keep to the paths.','The Discovery Centre has displays about how the spires formed, and a lookout over the desert.']});
  const s2=loopSpot(.13,-3.6);board(s2[0],s2[1],'HOW THE SPIRES FORMED',['Sea shells became lime-rich sand.','Rain set the lime hard round roots.','Wind blew the loose sand away...','...and left the hard columns standing.'],{w:1.6,h:1,band:'#7a5a2a'});
  BOARDS.push({id:'formed',x:s2[0],z:s2[1]+.8,label:'Read: how the spires formed',lines:['HOW THE SPIRES FORMED','Long ago, broken sea shells blew inland as lime-rich sand and piled up into dunes.','Rain soaked down and set the lime hard, often around plant roots. Above it, a hard cap of rock formed.','Over many thousands of years the wind blew away the loose sand, and the hard columns were left standing.']});
  const s3=loopSpot(.47,3.8);board(s3[0],s3[1],'LIFE ON THE SAND PLAIN',['Emus and grey kangaroos feed here','in the cool of dawn and dusk.','The heath blooms in late winter','and spring. Please do not feed wildlife.'],{w:1.6,h:1,emu:1,band:'#4f7a3a'});
  BOARDS.push({id:'life',x:s3[0],z:s3[1]+.8,label:'Read: life on the sand plain',lines:['LIFE ON THE SAND PLAIN','Emus and western grey kangaroos live in the heath around the desert. They come out to feed in the cool of dawn and dusk.','The low coastal heath flowers from late winter into spring: banksias, wattles and little everlastings.','Please drive slowly at dusk, and never feed the wildlife.']});
  board(1016.4,36.4,'ENIGMAS IN STONE',['How old are the spires?','Why do they stand here?','Scientists still argue about','how and when they formed.'],{w:1.6,h:1,band:'#5a6a86',bg:'#eef0ea'});
  BOARDS.push({id:'enigma',x:1016.4,z:37.3,label:'Read: Enigmas in stone',lines:['ENIGMAS IN STONE','How old are the Pinnacles, and why do they stand here and nowhere else?','Most scientists think they formed over the last few hundred thousand years, as lime from shells hardened in the dunes.','Wind uncovers new spires and buries old ones. The desert you see today keeps changing.']});
  // a real spire specimen on a plinth next to the display
  {put(B(.8,.5,.8),M('#cdb282'),1018.2,h0+.25,36.4);const sm=new THREE.Mesh(SHAPES.midA.g,SPM);sm.position.set(1018.2,h0+.5,36.4);sm.scale.set(.8,.9,.8);sm.castShadow=sm.receiveShadow=true;sm.__pxSkip=1;G.add(sm);col(1017.75,35.95,1018.65,36.85);}
  board(1023,26.25,'READING THE LANDSCAPE',['Yellow sand plain, spires, green heath.','Beyond the heath: white dunes and sea.'],{lectern:1,w:1.7,h:.9,y0:h0,band:'#9a6a24'});
  // Desert View walk trail sign: framed on two steel posts (photo IMG_1346)
  board(1004.6,35,'DESERT VIEW WALK TRAIL',['Short loop through the heath','to a rise above the desert.','Easy walk. Stay on the path.'],{w:1.5,h:1.1,band:'#a8782e',frame:'#c8ccd0',map:1});
  BOARDS.push({id:'trail',x:1004.6,z:35.9,label:'Read: Desert View walk trail',lines:['DESERT VIEW WALK TRAIL','A short, easy loop through the heath to a rise with a view across the spires.','Look for small birds in the banksias, and for kangaroo tracks in the sand.','Please stay on the path so the heath can grow back.']});}
// one-way arrows and "keep to the track" posts along the loop
{const[c,x]=cvs(20,20);x.fillStyle='#f2f0ea';x.fillRect(0,0,20,20);x.fillStyle='#2a3a6a';x.fillRect(4,8,8,4);x.beginPath();x.moveTo(11,4);x.lineTo(17,10);x.lineTo(11,16);x.fill();const am=new THREE.MeshLambertMaterial({map:ctex(c)});
  [.05,.3,.62,.84].forEach(u=>{const [x,z]=loopSpot(u,2.9);const t=LOOP.getTangentAt(u);const g=new THREE.Group();g.position.set(x,H(x,z),z);G.add(g);put(B(.08,1,.08),M('#8a8e92'),0,.5,0,{to:g});const s=put(new THREE.PlaneGeometry(.42,.42),am,0,1.05,.05,{to:g,nc:1});
    s.rotation.y=0;s.scale.x=t.x<0?-1:1;});}
