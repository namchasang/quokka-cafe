// ---------- world map engine (shared with the mockup) ----------

function wmBuild(cv,hooks){const X=cv.getContext('2d');X.imageSmoothingEnabled=false;let open=false;
const W=320,H=200;let view='perth',T=0;
const rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(1829);
// ---------- Perth region: land mask painted with shapes, then turned into pixel tiles ----------
function mask(draw){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,W,H);draw(x);const d=x.getImageData(0,0,W,H).data;const m=new Uint8Array(W*H);for(let i=0;i<W*H;i++)m[i]=d[i*4]>127?1:d[i*4+1]>127?2:0;return m;}
const pM=mask(x=>{x.fillStyle='#fff';
  // mainland: coast runs north-south, a bit wavy, with the river mouth at Fremantle
  x.beginPath();x.moveTo(132,0);const coast=[[128,20],[126,45],[123,70],[121,96],[119,118],[121,132],[118,150],[116,170],[118,200]];coast.forEach(p=>x.lineTo(...p));x.lineTo(W,200);x.lineTo(W,0);x.closePath();x.fill();
  // Rottnest Island and its little neighbour
  x.beginPath();x.ellipse(52,118,26,7,-.08,0,7);x.fill();x.beginPath();x.ellipse(30,121,9,4,0,0,7);x.fill();x.beginPath();x.ellipse(78,117,6,4,0,0,7);x.fill();
  // Garden Island to the south
  x.beginPath();x.ellipse(103,176,4,16,.05,0,7);x.fill();
  // Swan River: from the mouth, the wide Melville Water, Perth Water, round Heirisson Island and up the valley
  x.strokeStyle='#000';x.lineCap='round';x.lineJoin='round';
  x.lineWidth=5;x.beginPath();x.moveTo(116,128);x.bezierCurveTo(132,126,140,118,150,118);x.stroke();
  x.fillStyle='#000';x.beginPath();x.ellipse(165,114,20,10,-.25,0,7);x.fill();
  x.beginPath();x.ellipse(188,104,10,6,-.4,0,7);x.fill();
  x.beginPath();x.ellipse(209,96,12,6,-.15,0,7);x.fill();// Perth Water
  x.lineWidth=4;x.beginPath();x.moveTo(219,95);x.bezierCurveTo(228,94,232,96,236,90);x.bezierCurveTo(240,84,246,80,252,74);x.bezierCurveTo(258,66,262,58,272,52);x.stroke();
  x.fillStyle='#fff';x.beginPath();x.ellipse(227,94,4,1.6,-.2,0,7);x.fill();// Heirisson Island
  // hills to the east (green channel)
  x.fillStyle='#0f0';x.beginPath();x.moveTo(296,0);x.bezierCurveTo(286,60,300,120,290,200);x.lineTo(W,200);x.lineTo(W,0);x.closePath();x.fill();});
// distance to land for ocean shading
const dist=new Float32Array(W*H).fill(99);{const q=[];for(let i=0;i<W*H;i++)if(pM[i]){dist[i]=0;q.push(i);}for(let h=0;h<q.length;h++){const i=q[h],x0=i%W,y0=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x0+dx,ny=y0+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(dist[j]>dist[i]+1){dist[j]=dist[i]+1;q.push(j);}}}}
const land=(x,y)=>{x|=0;y|=0;return x>=0&&y>=0&&x<W&&y<H&&pM[y*W+x]>0;};
const nearWater=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!land(x+dx,y+dy))return true;return false;};
const base=document.createElement('canvas');base.width=W;base.height=H;{const b=base.getContext('2d'),img=b.createImageData(W,H),D=img.data;
  const set=(i,c)=>{D[i*4]=c[0];D[i*4+1]=c[1];D[i*4+2]=c[2];D[i*4+3]=255;};
  const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const OC=['#1b4f7a','#20608f','#2a73a6','#3a8cbf','#5cb0d6'].map(hex),SAND=hex('#e8d6a0'),SAND2=hex('#d8c088'),G=['#5f9a48','#6fae52','#7fbc5c','#8cc666'].map(hex),HILL=['#4f7a44','#5a8a4c','#6a9656'].map(hex),SALT=hex('#e8a0b8');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,m=pM[i];
    if(!m){const d=dist[i];const k=d<2?4:d<4?3:d<9?2:d<20?1:0;set(i,OC[((x*7+y*3)%11===0&&k>0)?k-1:k]);continue;}
    if(nearWater(x,y)&&!(x>140&&y<120&&x<300&&y>40&&false)){set(i,(x+y)%3?SAND:SAND2);continue;}
    if(m===2){set(i,HILL[(x*3+y*5+((x>>2)+(y>>2))%2)%3]);continue;}
    set(i,G[((x*13+y*7)%5+((x>>3)+(y>>3))%2)%4]);}
  // pink salt lakes on Rottnest
  [[48,117],[56,118],[62,116],[44,119]].forEach(([x,y])=>{for(let dy=-1;dy<=1;dy++)for(let dx=-2;dx<=2;dx++)if(Math.abs(dx)+Math.abs(dy)<3)set((y+dy)*W+x+dx,SALT);});
  b.putImageData(img,0,0);
  // roads: sandy lines between the towns
  b.fillStyle='#d9c79a';const road=(pts)=>{for(let k=0;k<pts.length-1;k++){const[a,c]=[pts[k],pts[k+1]],n=Math.hypot(c[0]-a[0],c[1]-a[1])|0;for(let s=0;s<=n;s++){const px=Math.round(a[0]+(c[0]-a[0])*s/n),py=Math.round(a[1]+(c[1]-a[1])*s/n);if(land(px,py))b.fillRect(px,py,1,1);}}};
  road([[128,124],[140,110],[170,100],[196,92],[206,88]]);road([[128,128],[150,132],[180,124],[200,110],[206,104]]);road([[208,106],[226,104],[240,108]]);road([[240,108],[262,96],[276,86]]);road([[214,86],[230,84],[250,86],[276,86]]);road([[42,120],[66,118],[80,116]]);
  // Kings Park: darker bush west of the city
  for(let i=0;i<60;i++){const x=190+rnd()*10|0,y=84+rnd()*7|0;if(land(x,y)){b.fillStyle=['#3f7a3a','#4a8a40'][i%2];b.fillRect(x,y,1,1);}}
  // city blocks around the CBD
  for(let i=0;i<26;i++){const x=200+(i%7)*2.3|0,y=82+((i/7)|0)*2;b.fillStyle=['#9ab0c0','#c8d2d8','#8aa0b4'][i%3];b.fillRect(x,y,2,1);}
  // the airport: two runways
  b.fillStyle='#5a5d64';for(let s=0;s<22;s++){b.fillRect(266+s,92-s*.6|0,2,1);b.fillRect(270+s*.3|0,78+s,1,1);}
}
// places: the areas in the game, a postcard icon each
const P=[
  {id:'island',name:'Rottnest Island',note:'Thomson Bay · Kip’s café by the jetty',st:'live',x:68,y:116,ic:'cafe'},
  {id:'freo',name:'Fremantle',note:'Port city · markets, the prison, Cappuccino Strip',st:'live',x:124,y:122,ic:'port'},
  {id:'sp',name:'South Perth',note:'Mends St Jetty · ferry to the city',st:'live',x:205,y:106,ic:'mill',lx:-14,ly:16},
  {id:'cbd',name:'Perth CBD',note:'Bell tower, Kings Park, Hay St Mall · train to the airport',st:'live',x:207,y:85,ic:'city',ly:-2,lx:-8},
  {id:'hi',name:'Heirisson Island',note:'Kangaroos in the middle of the river',st:'live',x:229,y:99,ic:'roo',lx:26,ly:-2},
  {id:'vp',name:'Victoria Park',note:'Albany Highway · Kip’s old street, food from everywhere',st:'live',x:242,y:110,ic:'food',ly:16,lx:10},
  {id:'air',name:'Perth Airport',note:'Flights east · Auntie June and Milo fly in from here',st:'live',x:276,y:86,ic:'plane',ly:-4}].filter(p=>p.id!=='air'||hooks.air);
const FERRY=[{a:'island',b:'freo',ax:80,ay:117,bx:118,by:122,name:'Ferry · Rottnest ⇄ Fremantle'},{a:'sp',b:'cbd',ax:206,ay:103,bx:207,by:89,name:'Ferry · Mends St ⇄ Barrack St'}];
// Australia view: continent outline from real coordinates
const AUS=[[113.6,-22],[114.2,-26],[115,-30],[115.7,-33.5],[117.9,-35],[123.5,-33.9],[126,-32.3],[131,-31.5],[135,-34.8],[137.8,-32.7],[138.5,-35.6],[140.8,-38],[144,-38.4],[146.3,-39.1],[147.8,-37.9],[150,-37.5],[151.2,-33.9],[153.1,-30],[153.6,-28],[153,-25],[150.8,-22.6],[146,-18.8],[145.4,-14.9],[143.5,-12.8],[142.5,-10.7],[141.6,-13.5],[141.5,-17],[140,-17.7],[136.8,-15.9],[135.9,-13.4],[136.9,-12.2],[132.6,-11.5],[130.2,-12.4],[129,-14.9],[126.1,-14],[123.5,-16.6],[121,-19.5],[117.4,-20.7]];
const TAS=[[144.6,-40.7],[148.3,-40.9],[148.2,-42.2],[146.9,-43.6],[145.2,-42.3]];
const ax=lon=>12+(lon-112)/(155-112)*296,ay=lat=>10+(-10-lat)/(45-10)*182;
const aM=mask(x=>{x.fillStyle='#fff';[AUS,TAS].forEach(poly=>{x.beginPath();poly.forEach(([lo,la],i)=>i?x.lineTo(ax(lo),ay(la)):x.moveTo(ax(lo),ay(la)));x.closePath();x.fill();});});
const abase=document.createElement('canvas');abase.width=W;abase.height=H;{const b=abase.getContext('2d'),img=b.createImageData(W,H),D=img.data;const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
  const SEA=['#173f66','#1b4f7a'].map(hex),RED=['#c8703a','#b8603a','#d88048','#a85a34'].map(hex),GR=['#6a9a4a','#7aaa52','#5a8a44'].map(hex),SAND=hex('#e8d6a0');
  const ad=new Float32Array(W*H).fill(99);{const q=[];for(let i=0;i<W*H;i++)if(!aM[i]){ad[i]=0;q.push(i);}for(let h=0;h<q.length;h++){const i=q[h],x0=i%W,y0=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x0+dx,ny=y0+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;if(ad[j]>ad[i]+1){ad[j]=ad[i]+1;q.push(j);}}}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let c;if(!aM[i])c=SEA[(x+y*3)%17===0?1:0];else{const lon=112+(x-12)/296*43,lat=-10-(y-10)/182*35;const edge=!aM[i-1]||!aM[i+1]||!aM[i-W]||!aM[i+W];
      const d=ad[i]+((x*7+y*13)%5)*.6;const green=(lon>139&&d<26)||(lon<119&&lat<-29&&d<12)||(lat>-17&&d<10)||(lat<-36);c=edge?SAND:green?GR[(x*3+y*7)%3]:RED[(x*5+y*3+((x>>2)+(y>>2)))%4];}
    D[i*4]=c[0];D[i*4+1]=c[1];D[i*4+2]=c[2];D[i*4+3]=255;}b.putImageData(img,0,0);}
const CITIES=[{id:'perth',name:'Perth',note:'Home · Rottnest, Fremantle, the city and the airport',st:'live',lon:115.86,lat:-31.95},
  {id:'mel',name:'Melbourne',note:'Auntie June and cousin Milo · lanes, trams and very serious coffee',st:'soon',lon:144.96,lat:-37.81},
  {id:'syd',name:'Sydney',note:'More family by the harbour · the bridge, the ferries, the beaches',st:'soon',lon:151.21,lat:-33.87}];
