// ===== animals: emus (painted like Kip, light from the top left, a dark outline) and kangaroos =====
function emu32(step){const P=painter(30,40),Bd=RAMP('#6e5c48'),Dk=RAMP('#4a3c30',4),Nk=RAMP('#7c8a9a',4),Lg=RAMP('#8a8270',3);
  const a=step?2:-1;
  for(let j=26;j<38;j++){P.set(12+(j-26)*(a*.12),j,Lg[1]);P.set(13+(j-26)*(a*.12),j,Lg[2]);P.set(17-(j-26)*(a*.12),j,Lg[1]);P.set(18-(j-26)*(a*.12),j,Lg[0]);}
  P.ell(12+a*1.4,38.5,2.4,1,Lg);P.ell(17.5-a*1.4,38.5,2.4,1,Lg);
  P.ell(14,20,9.5,7,Bd);P.ell(7,23,4,5.5,Dk);P.ell(15,16,6,3.4,Bd);
  for(let i=0;i<8;i++)P.set(6+i*2.4,26+((i*5)%3),Dk[1]);
  for(let i=0;i<10;i++){const t=i/9;P.ell(20+t*2.2,15-t*10,1.7-t*.4,1.6,Nk);}
  P.ell(23,4.4,2.6,2.2,Dk);P.ell(26.4,5,1.8,.8,Dk.slice(0,2));P.set(24,3,[255,255,255]);P.set(24,4,[30,24,20]);
  return P.done([28,22,18]);}
{const ef=[emu32(0),emu32(1)];for(let i=0;i<3;i++){const m=spriteMesh(ef,1.25,1.65);m.visible=false;G.add(m);const sh=new THREE.Mesh(new THREE.CircleGeometry(.45,10),new THREE.MeshBasicMaterial({color:0x6a4a20,transparent:true,opacity:.28,depthWrite:false}));sh.rotation.x=-Math.PI/2;G.add(sh);
  PIN.emus.push({m,sh,i,ph:i*2.1});}}
{const rf=[roo32(false,false),roo32(true,false)],rj=[roo32(false,true),roo32(true,true)];
  const homes=[[1012,-6],[1010,-28],[1100,-40],[1114,10],[1060,-40],[1090,40],[1016,12]];
  homes.forEach(([x,z],i)=>{const m=spriteMesh(i===2?rj:rf,1.7,1.7);G.add(m);const sh=new THREE.Mesh(new THREE.CircleGeometry(.42,10),new THREE.MeshBasicMaterial({color:0x6a4a20,transparent:true,opacity:.25,depthWrite:false}));sh.rotation.x=-Math.PI/2;G.add(sh);
    PIN.roos.push({m,sh,hx:x,hz:z,x,z,tx:x,tz:z,wait:R()*4,hop:0});});}
// ===== visitors among the spires =====
{const looks=[{hair:'#1b1b2b',skin:'#e2b48a',shirt:'#2f6fb0',pants:'#c9b68a',hat:'#f3e2b0'},{hair:'#9b3b22',skin:'#f1c7a0',shirt:'#ef7d9a',pants:'#2f3b5c',hat:null},{hair:'#3a2a1a',skin:'#c08a60',shirt:'#3e9a5c',pants:'#2f3b5c',hat:'#e8e0c8'},
    {hair:'#d9b25a',skin:'#f1c7a0',shirt:'#f2f0ea',pants:'#3a3a44',hat:'#c84a3a'},{hair:'#1b1b2b',skin:'#e2b48a',shirt:'#2a2a34',pants:'#f2f0ea',hat:null},{hair:'#5a3a22',skin:'#e8bc90',shirt:'#e8a020',pants:'#4a5a7a',hat:'#f3e2b0'},
    {hair:'#1b1b2b',skin:'#d8a878',shirt:'#9478d4',pants:'#2f3b5c',hat:null},{hair:'#7a5a3a',skin:'#f1c7a0',shirt:'#c9473f',pants:'#c9b68a',hat:'#2f6fb0'}];
  const spots=[[1052,10],[1066,6],[1084,-2],[1096,-18],[1074,-30],[1048,-18],[1032,4],[1040,20]];
  looks.forEach((v,i)=>{const m=spriteMesh(humanFrames(v),.95,1.58);G.add(m);const [x,z]=spots[i];const n={m,x,z,hx:x,hz:z,tx:x,tz:z,wait:R()*5,photo:i%3===0,step:0};
    const sh=new THREE.Mesh(new THREE.CircleGeometry(.36,10),new THREE.MeshBasicMaterial({color:0x6a4a20,transparent:true,opacity:.28,depthWrite:false}));sh.rotation.x=-Math.PI/2;G.add(sh);n.sh=sh;PIN.npcs.push(n);});}
// ===== where Kip may walk: the whole sand plain and heath, except the spires (and the colliders above) =====
K.walk=(x,z)=>x>X1+2&&x<X2-2&&z>Z1+3&&z<Z2-2.5&&!spHit(x,z,.22);
// ===== things to do =====
const tod=()=>((S.time%1440)+1440)%1440/60;
function pinSave(){S.pinn=S.pinn||{boards:{},emu:0,sunset:0,done:0};return S.pinn;}
function reward(n,why){S.coins+=n;popText('+'+n,{x:player.x,y:2,z:player.z});toast(why,2.6);}
function readBoard(b){const P=pinSave();say(b.lines);if(!P.boards[b.id]){P.boards[b.id]=1;const n=Object.keys(P.boards).length;
  if(n>=BOARDS.length&&!P.done){P.done=1;setTimeout(()=>reward(30,'You read every board at the Pinnacles · +30'),400);}else toast('Board '+n+' of '+BOARDS.length+' read',2);}save();}
const SUN={x:1078,z:-17};
K.targets=function(T){BOARDS.forEach(b=>T.push({x:b.x,z:b.z,r:1.3,label:b.label,act:()=>readBoard(b)}));
  T.push({x:1023,z:27.3,r:1.7,label:'Lookout · the view over the desert',act:()=>say(['Lookout: the yellow sand plain runs to the green heath, dotted with thousands of spires.','The tall ones near the loop are three to four metres high. Most are knee-high stumps and rounded lumps.','Guide: The light is best late in the afternoon, when the spires turn orange.'])});
  T.push({x:1007,z:-19,r:2.2,label:'Desert View · look over the spires',act:()=>say(['From this rise in the heath you can see the whole desert: the loop, the car park and the Discovery Centre.','Banksias and wattles grow here. Kangaroos rest in their shade in the heat of the day.'])});
  if(PIN.bbq){const q=PIN.bbq;T.push({x:q.x,z:q.z+1.25,r:1.4,label:q.t>0?'BBQ · the sausages are sizzling…':'Free BBQ · cook a sausage sizzle',act:()=>{if(q.t>0){say(['Kip turns the sausages. Nearly ready!']);return;}
    q.t=24;q.SZ.visible=true;const P=pinSave(),d=S.day||1;say(['Kip presses the big red button and the hotplate warms up. A free electric BBQ: every park in Australia has one!','Sausages and onions sizzle. Wrap one in a slice of bread with sauce: a real Aussie sausage sizzle.'],()=>{if(P.bbq!==d){P.bbq=d;reward(15,'Sausage sizzle at the picnic area · +15');save();}else toast('Yum! Clean the hotplate when you are done.',2.4);});}});
    T.push({x:1023.3,z:41.3,r:1.6,label:'Picnic tables · sit in the shade',act:()=>say(['Kip sits at a picnic table in the shade. Families eat lunch here after walking among the spires.','Guide: In Australia most parks have free BBQs and picnic shelters. Just clean up after yourself!'])});}
  const h=tod();
  if(h>=16.4&&h<19.3)T.push({x:SUN.x,z:SUN.z,r:2.6,label:'Watch the sunset from the dune',act:()=>{const P=pinSave();say(['The sun sinks toward the sea and the spires glow orange, their long shadows stretching across the sand.','Guide: This is the best time of day out here. Listen: the emus are starting to call.']);if(!P.sunset){P.sunset=S.day||1;reward(20,'Sunset at the Pinnacles · +20');save();}}});
  else T.push({x:SUN.x,z:SUN.z,r:2.6,label:h<16.4?'Sunset dune · wait here for the sunset':'Sunset dune · the sun has set',act:()=>{if(h<16.4){say(['Kip sits on the warm sand and waits for the late afternoon…'],()=>{fadeTarget=.9;setTimeout(()=>{S.time=Math.floor(S.time/1440)*1440+17*60+30;fadeTarget=0;toast('Late afternoon at the Pinnacles',2.4);},700);});}else say(['The sun has gone down. The spires are dark shapes against the stars now.','Guide: Time to head back to the van soon!']);}});
  const e=PIN.emus[0];if(e&&e.m.visible){T.push({x:e.x,z:e.z,r:4.2,label:'Photograph the emus',act:()=>{const P=pinSave();if(P.emu){say(['The emus stalk slowly through the spires, pecking at seeds. Their deep drumming call carries across the sand.']);return;}
      P.emu=S.day||1;say(['Click! Three emus walk in a line between the spires, glowing in the last light.','Emus are the tallest birds in Australia. The dad sits on the eggs and raises the chicks.']);reward(40,'Photo kept: emus at dusk · +40');save();}});}};
