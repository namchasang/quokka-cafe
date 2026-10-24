trStart();document.querySelectorAll('.langBtn').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.l)));document.querySelectorAll('.langRow').forEach(r=>r.hidden=!THAI_READY);setLang(LANG);
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const R=mulberry32(20261021);
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;

// SPRITES START
const QK_TOP=[
"....oo...oo.....",
"...obpo.obpo....",
"...obbbobbbo....",
"..obbbbbbbbbo...",
"..obbbbbbwebo...",
"..obbbbbbeebbo..",
"..obbcblllllno..",
"...obblllllo....",
"....oooooooo....",
"...obaaaaaabo...",
"..obbaaaaaabbo..",
"..obbaaaaaabbo..",
"...obaaaaaabo...",
"..oobbbbbbbbo..."];
const QK_LEGS={
idle:["...obbo..obbo...","...oooo..oooo..."],
a:["..obbo....obbo..","..oooo....oooo.."],
b:["....obbo.obbo...","....oooo.oooo..."]};
const HU_HEAD=["....oooo....","...ohhhho...","..ohhhhhho.."];
const HU_HAT=["...HHHHHH...","..HHHHHHHH..","HHHHHHHHHHHH"];
const HU_REST=[
"..ohssssho..",
"..osesseso..",
"..ossssss" + "o..",
"...osssso...",
"..otttttto..",
".otttttttto.",
".osttttttso.",
".osttttttso.",
".oottttttoo.",
"..otttttto..",
"..oppppppo..",
"..oppppppo.."];
const HU_LEGS={
idle:["..oppo.oppo.","..oppo.oppo.","..oppo.oppo.","..okko.okko.","..oooo.oooo."],
a:["..oppo.oppo.","..oppo.oppo.","..okko.oppo.","..oooo.okko.",".......oooo."],
b:["..oppo.oppo.","..oppo.oppo.","..oppo.okko.","..okko.oooo.","..oooo......"]};
const WREN=[
"........oo..",
"........obo.",
"...ooo..obo.",
"..ouuuo.obo.",
".ouueuuoobo.",
"youuuuuuobo.",
".ouuuuubbo..",
"..owwwwbbo..",
"..owwwwbo...",
"...owwwo....",
"....o.o.....",
"...oo.oo...."];
const ICONS={
coffee:["...s..s.....","....s..s....","...s..s.....","............",".oooooooo...",".offfffooo..",".owwwwwwo.o.",".owwwwwwo.o.",".owwwwwwooo.","..owwwwo....",".oooooooooo.","............"],
lam:["............","............","...oooooo...","..ocdcdcdo..","..odcdcdco..","..ocdcdcdo..","..ojjjjjjo..","..ocdcdcdo..","..oooooooo..",".pppppppppp.","..pppppppp..","............"],
smo:["........r...",".......r....","......r.....","..oooorooo..","..ommmrmmo..","..ommmmmmo..","..ommmmmmo..","...ommmmo...","...ommmmo...","....oooo....","....oggo....","...oooooo..."],
shell:["............",".....oo.....","....oppo....","...oplplo...","..oplplplo..","..oplplplo..",".oplplplplo.",".oppppppppo.","..oooooooo..","............","............","............"],
heart:[".oo...oo.","orro.orro","orrrorrro","orrrrrrro",".orrrrro.","..orrro..","...oro...","....o...."],
spark:["...y...","...y...",".y.w.y.","yywwwyy",".y.w.y.","...y...","...y..."],
excl:["..ooo..",".oyyyo.",".oyyyo.",".oyyyo.","..oyo..","..ooo..",".oyyyo.","..ooo.."]};
// SPRITES END

const ICON_PAL={o:'#2a1d1a',s:'#ffffff',f:'#e8cfa6',w:'#f4efe6',c:'#5a3220',d:'#f3e9dc',j:'#c8344a',p:'#dfe7ee',m:'#ffb02e',r:'#e8457a',g:'#bfe3f0',l:'#fde3d8',y:'#ffd34d'};
const SHELL_PAL=Object.assign({},ICON_PAL,{p:'#f6b8a8',l:'#fde3d8'});
const HEART_PAL={o:'#3a1418',r:'#ff5d73'};
const SPARK_PAL={y:'#ffe9a0',w:'#ffffff'};

function pix(rows,pal){const h=rows.length,w=Math.max.apply(null,rows.map(r=>r.length));const c=mk(w,h),x=c.getContext('2d');rows.forEach((r,y)=>{for(let i=0;i<r.length;i++){const col=pal[r[i]];if(!col)continue;x.fillStyle=col;x.fillRect(i,y,1,1);}});return c;}
function ctex(c,o){o=o||{};const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;if(o.rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(o.rep[0],o.rep[1]);t.minFilter=THREE.LinearMipmapLinearFilter;t.generateMipmaps=true;}else if(o.smooth){t.magFilter=THREE.LinearFilter;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;}else{t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;}return t;}

