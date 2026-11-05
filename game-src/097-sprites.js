// ---------- sprites ----------
function spr(rows,pal){const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const x=c.getContext('2d');rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='.')return;x.fillStyle=pal[ch];x.fillRect(i,j,1,1);}));return c;}
const KP={k:'#2a1e16',b:'#8a6040',l:'#b8865a',f:'#e8c8a0',e:'#141010',a:'#3e7d5c',w:'#f6f2e8'};
const KIP=[spr(['..k..k..','.kbkkbk.','.kbbbbk.','kblebelk','kbffffbk','.kaaaak.','.kawwak.','..k..k..'],KP),spr(['..k..k..','.kbkkbk.','.kbbbbk.','kblebelk','kbffffbk','.kaaaak.','.kawwak.','.k....k.'],KP)];
const IC={cafe:spr(['..rrrr..','.rrrrrr.','rwwwwwwr','.wbwwbw.','.wbwwdw.','.wwwwdw.'],{r:'#d8323a',w:'#f6f2e8',b:'#5cc6d8',d:'#7a4a2a'}),
  port:spr(['...ww...','..wwww..','.wlwwlw.','wwwwwwww','wlwddwlw','wwwddwww'],{w:'#e8d8b0',l:'#5a4a3a',d:'#3a2a20'}),
  mill:spr(['w..w..w.','.w.w.w..','..www...','.wwwww..','.wwdww..','.wwdww..'],{w:'#f6f2e8',d:'#5a4a3a'}),
  city:spr(['...b....','..bb.g..','.bbb.gg.','gbbbggg.','gbbbggg.','gbbbggg.'],{b:'#9ab0c0',g:'#c8d2d8'}),
  roo:spr(['...gg...','..ggg...','..gggg..','.ggggg..','.g..gg..','gg...g..'],{g:'#a08a70'}),
  food:spr(['.r.y.r..','rrryrrr.','wwwwwww.','.wwwww..','..www...'],{r:'#e8732a',y:'#ffd34d',w:'#f6f2e8'}),
  plane:spr(['...w....','...ww...','wwwwwwwt','...ww...','...w..t.'],{w:'#f4f4f2',t:'#2a9a8a'})};
// Kip drives a little two-tone retro hatchback on the Perth map (cream body, black roof, round lamps)
const CP={k:'#1c1c1e',g:'#9cc8e0',b:'#8a6040',e:'#141010',c:'#efe6cc',r:'#d8323a',y:'#ffe08a',t:'#1c1c1e',h:'#5a5d64'};
const CAR=[spr(['...kkkkk...','..kgbegg k.'.replace(' ','k'),'.ccccccccc.','rcccccccccy','.cchccchcc.','..tt...tt..'],CP),spr(['...kkkkk...','..kgbeggkk.','.ccccccccc.','rcccccccccy','.cchccchcc.','..tt...tt..'],CP)];
const BOAT=spr(['..w...','..ww..','rrrrrr','.rrrr.'],{w:'#f6f2e8',r:'#c8344a'}),PLANE=spr(['....w...','....ww..','wwwwwwwt','....ww..','....w.t.'],{w:'#f4f4f2',t:'#2a9a8a'});
const GULL=[spr(['w...w','.www.'],{w:'#f6f6f0'}),spr(['.....','wwwww'],{w:'#f6f6f0'})];
// ---------- driving: shortest way over land, ferries link the shores ----------
function wmPath(sx,sy,tx,ty){sx|=0;sy|=0;tx|=0;ty|=0;const N=W*H,prev=new Int32Array(N).fill(-1),fer=new Int8Array(N).fill(-1);const s=sy*W+sx;if(!land(sx,sy))return null;prev[s]=s;const q=[s];let best=s,bd=1e9;
  const ends=FERRY.map((f,i)=>[[f.ax|0,f.ay|0,f.bx|0,f.by|0,i],[f.bx|0,f.by|0,f.ax|0,f.ay|0,i]]).flat();
  for(let h=0;h<q.length;h++){const c=q[h],x=c%W,y=(c/W)|0;const d=Math.abs(x-tx)+Math.abs(y-ty);if(d<bd){bd=d;best=c;}if(d===0)break;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const n=ny*W+nx;if(prev[n]>=0||!land(nx,ny))continue;prev[n]=c;q.push(n);}
    for(const e of ends){if(Math.abs(x-e[0])+Math.abs(y-e[1])<4){let ox=e[2],oy=e[3];for(let k=0;k<6&&!land(ox,oy);k++)ox+=Math.sign(e[0]-e[2])||0;const n=oy*W+ox;if(land(ox,oy)&&prev[n]<0){prev[n]=c;fer[n]=e[4];q.push(n);}}}}
  const pts=[];let c=best,k=0;while(c!==s){const x=c%W,y=(c/W)|0;if(fer[c]>=0)pts.push({x,y,ferry:fer[c],fx:prev[c]%W,fy:(prev[c]/W)|0});else if(k++%3===0)pts.push({x,y});c=prev[c];}
  pts.reverse();if(pts.length&&!pts[pts.length-1].ferry){const l=best;pts.push({x:l%W,y:(l/W)|0});}return pts;}
// ---------- state ----------
const kip={x:214,y:90,tx:null,ty:null,dir:1,step:0};let ride=null,cur=null,keys={};let flight=null;
const clouds=[...Array(6)].map(()=>({x:rnd()*W,y:rnd()*H,r:10+rnd()*16,v:3+rnd()*4}));
const sails=[{t:0,ax:84,ay:121,bx:116,by:126,T:22},{t:9,ax:150,ay:113,bx:182,by:110,T:16}];
const name=hooks.el.name,note=hooks.el.note,act=hooks.el.act;const wmSide=p=>hooks.side(p.id,kip.x<p.x?'w':'e');
const pill=st=>st==='soon'?' <small style="color:#c79bff">· soon</small>':'';
function hud(){let p=null,f=null;if(view==='perth'){if(ride){name.innerHTML='On the ferry';note.textContent=ride.f.name;act.disabled=true;act.textContent='…';return;}
    P.forEach(q=>{if(Math.hypot(q.x-kip.x,q.y-kip.y)<7)p=q;});if(!p)FERRY.forEach(q=>{if(Math.hypot(q.ax-kip.x,q.ay-kip.y)<6)f={q,to:q.b,fx:q.bx,fy:q.by,from:[q.ax,q.ay]};else if(Math.hypot(q.bx-kip.x,q.by-kip.y)<6)f={q,to:q.a,fx:q.ax,fy:q.ay,from:[q.bx,q.by]};});
    cur=p?{type:'place',p}:f?{type:'ferry',f}:null;
    if(p){name.innerHTML=p.name+pill(p.st);note.textContent=p.note;act.disabled=false;act.textContent=p.id==='island'?'Ride into Thomson Bay':'Enter '+p.name+' · '+(wmSide(p)==='w'?'west':'east')+' gate';}
    else if(f){name.innerHTML='Ferry dock';note.textContent=f.q.name;act.disabled=false;act.textContent='Take the ferry';}
    else{name.textContent='Out on the road';note.textContent='Drive to a town to enter it. The car rides the ferry across the water.';act.disabled=true;act.textContent='Enter';}}
  else{const c=CITIES[sel];name.innerHTML=c.name+pill(c.st);note.textContent=c.note;act.disabled=!!flight||c.id==='perth'&&false;act.textContent=c.id==='perth'?'Back to Perth map':'Fly to '+c.name;}}
let sel=0;
function doAct(){if(view==='perth'){if(!cur)return;if(cur.type==='ferry'){const f=cur.f;ride={f:f.q,t:0,ax:f.from[0],ay:f.from[1],bx:f.fx,by:f.fy};return;}
    hooks.enter(cur.p.id,wmSide(cur.p));return;}
  const c=CITIES[sel];if(c.id==='perth'){setView('perth');return;}if(flight)return;flight={from:CITIES[0],to:c,t:0};}
let flashT=0,flashTxt='';function flash(t){flashTxt=t;flashT=1.6;}
function setView(v){view=v;hooks.el.tabP.setAttribute('aria-pressed',v==='perth');hooks.el.tabA.setAttribute('aria-pressed',v==='aus');if(v==='aus'){sel=1;flight=null;}hud();}
hooks.el.tabP.onclick=()=>setView('perth');hooks.el.tabA.onclick=()=>setView('aus');act.onclick=doAct;
addEventListener('keydown',e=>{if(!open)return;const k=e.key.toLowerCase();if(k==='escape')return;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();keys[k]=1;if(k===' '||k==='enter')doAct();
  if(view==='aus'&&(k==='arrowleft'||k==='arrowright')){sel=(sel+(k==='arrowright'?1:2))%3;hud();}});
addEventListener('keyup',e=>{if(!open)return;keys[e.key.toLowerCase()]=0;});
cv.addEventListener('pointerdown',e=>{const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  if(view==='perth'){if(ride)return;kip.path=wmPath(kip.x,kip.y+2,x,y+2);kip.tx=null;}else{let b=-1,bd=1e9;CITIES.forEach((c,i)=>{const d=Math.hypot(ax(c.lon)-x,ay(c.lat)-y);if(d<bd){bd=d;b=i;}});if(bd<30){sel=b;hud();}}});
