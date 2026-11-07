// ---------- Towns with room to breathe (Look Lab ?town2, Paul Nov 2026) ----------
// Paul: the town streets felt packed. Fewer filler houses in South Perth and Fremantle (the gaps become little
// gardens with a tree, a bench, a veggie patch or a water tank), and much richer pixel painting on what stays:
// windows with frames, sills, lintels, glazing bars, glints, curtains, blinds and pot plants; panelled doors with
// fanlights, brass knobs, house numbers, steps and mats; roofs with tile courses, ridge caps, gutters and moss;
// 6-step colour ramps (cool shadows, warm lights) and a different wall colour and trim on every house.
// Quokkas (Kip and friends) are painted natively at twice the pixels with fur strands, glossy eyes, inner ears,
// blush, a shiny nose and toes. The flag TOWN2_LIVE / TOWN2_ON is declared near the top of the file (the quokka
// painters run before this point). Hooks: town2Thin() and town2Skin() are called from pxbScene().
const T2=(function(){
  const PPM=32,INK='#2a2230';
  let S=1;const rnd=()=>(S=(S*16807)%2147483647)/2147483647,seed=s=>{S=(Math.abs(s|0))%2147483646+1;rnd();};
  const rgb=c=>{if(Array.isArray(c))return c;if(c[0]==='r'){return c.match(/[\d.]+/g).slice(0,3).map(Number);}const n=parseInt(c.replace('#',''),16);return[(n>>16)&255,(n>>8)&255,n&255];};
  const hx=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
  const sh=(c,f)=>{const a=rgb(c);return hx([a[0]*f,a[1]*f,a[2]*f]);};
  const mix=(a,b,t)=>{a=rgb(a);b=rgb(b);return hx([0,1,2].map(i=>a[i]+(b[i]-a[i])*t));};
  const lum=c=>{const a=rgb(c);return(a[0]*.3+a[1]*.59+a[2]*.11)/255;};
  // six tones: cool purple shadows, warm cream lights (more colours than the old three-step shading)
  const RC=new Map();
  function ramp(b){let r=RC.get(b);if(r)return r;r=[mix(sh(b,.5),'#2a2440',.3),mix(sh(b,.68),'#3a3860',.16),mix(sh(b,.85),'#504868',.05),b,mix(sh(b,1.09),'#fff0c8',.16),mix(sh(b,1.18),'#fff8e6',.42)];RC.set(b,r);return r;}
  const hash=(x,y,s)=>{let h=(x*374761393+y*668265263+(s|0)*1442695041)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;};
  function cv(w,h){const c=document.createElement('canvas');c.width=Math.max(2,w|0);c.height=Math.max(2,h|0);const x=c.getContext('2d');x.imageSmoothingEnabled=false;return[c,x];}
  const P=(x,c,X,Y,W=1,H=1)=>{if(W<=0||H<=0)return;x.fillStyle=c;x.fillRect(X|0,Y|0,W|0,H|0);};
  const pick=a=>a[rnd()*a.length|0];
  /* ---------- palettes (Fremantle / South Perth heritage colours, fictional, no brands) ---------- */
  const WALLS=['#efe3c4','#b9c8a8','#b8d4d8','#e8b8b0','#f2dc96','#d8a07a','#e8e4d8','#c8d0e0','#d8c0a0','#c4d8b8','#f0c8a0','#a8c0c8','#e0cce0','#f4e8b0'];
  const TRIMS=['#f6f2e8','#fffaf0','#2f5a46','#6a2a2a','#1d3a6e','#e8dcc0','#3d7a78','#f2e6c8'];
  const DOORS=['#2c4a3a','#8a2a2a','#1d3a6e','#5a3a22','#c8a040','#3a5a6a','#6a3a6a','#2f6a74','#a8402a','#3a6a3a'];
  const CURT=['#e8dcc8','#c9473f','#3d7a78','#e8b860','#9478d4','#f2a0c0','#7ab454','#f4ecd8','#5a7ab0'];
  const ROOFS={tile:['#b8562e','#a84a2a','#c8643a','#8a3a2e','#9a5a3a'],tin:['#3e6a52','#8a3a2e','#2f5a7a','#a8acb0','#b8562e','#6a7a5a','#5a4a7a','#9a6a3e'],slate:['#4e5a6a','#5a6470','#46505e']};
  /* ---------- wall surfaces ---------- */
  function board(x,W,H,base,y0=0){const r=ramp(base);for(let y=y0,k=0;y<H;y+=5,k++){const v=hash(k,7,S);const b=v<.2?r[2]:v>.85?r[4]:r[3];P(x,b,0,y,W,5);P(x,r[4],0,y,W,1);if(v>.6)P(x,r[5],0,y,W>>1,1);P(x,r[2],0,y+3,W,1);P(x,r[1],0,y+4,W,1);
      for(let X=(hash(k,3,S)*9|0);X<W;X+=6+(hash(X,k,S)*11|0)){const L=2+(hash(X,k+1,S)*5|0);P(x,hash(X,k,9)<.5?r[2]:r[4],X,y+1+(hash(X,k,5)*2|0),L,1);}
      if(hash(k,11,S)<.3){const X=hash(k,12,S)*W|0;P(x,r[1],X,y+1,1,3);}}}
  function brick(x,W,H,base,y0=0){const r=ramp(base),m=ramp(mix(base,'#e8dcc8',.62));P(x,m[2],0,y0,W,H-y0);
    for(let y=y0,row=0;y<H;y+=4,row++)for(let X=-(row%2)*4;X<W;X+=8){const v=hash(X,row,S);const f=v<.08?r[1]:v<.3?r[2]:v>.9?r[5]:v>.7?r[4]:r[3];P(x,f,X,y,7,3);P(x,v>.5?r[5]:r[4],X,y,7,1);P(x,r[1],X+6,y+1,1,2);if(v>.45&&v<.5)P(x,r[0],X+2,y+1,2,1);}}
  function stone(x,W,H,base,y0=0){const r=ramp(base),m=mix(base,'#fff8e8',.3);P(x,sh(base,.7),0,y0,W,H-y0);
    for(let y=y0,row=0;y<H;y+=7,row++){const bh=Math.min(7,H-y);let X=-((row*5)%9);while(X<W){const bw=9+(hash(X,row,S)*8|0),v=hash(X+1,row,S),f=v<.25?r[2]:v>.8?r[4]:r[3];
        P(x,f,X+1,y+1,bw-1,bh-1);P(x,r[5],X+1,y+1,bw-1,1);P(x,r[4],X+1,y+1,1,bh-2);P(x,r[1],X+1,y+bh-1,bw-1,1);P(x,r[2],X+bw-1,y+1,1,bh-1);
        for(let k=0;k<3;k++)if(hash(X,row,k+S)<.6)P(x,hash(X,k,row)<.5?r[2]:m,X+2+(hash(X,k,1)*(bw-4)|0),y+2+(hash(X,k,2)*Math.max(1,bh-4)|0));X+=bw;}}}
  function render(x,W,H,base,y0=0){const r=ramp(base);P(x,r[3],0,y0,W,H-y0);
    for(let y=y0;y<H;y++)for(let X=0;X<W;X++){const v=hash(X,y,S);if(v<.06)P(x,r[2],X,y);else if(v>.95)P(x,r[4],X,y);}
    for(let y=H-10;y<H;y++)for(let X=0;X<W;X++)if(((X+y)&1)&&hash(X,y,3)<(y-(H-10))/14)P(x,r[2],X,y);}
  function surface(x,W,H,base,kind){if(kind==='brick')brick(x,W,H,base);else if(kind==='stone')stone(x,W,H,base);else if(kind==='board')board(x,W,H,base);else render(x,W,H,base);}
  /* ---------- trims ---------- */
  function eave(x,W){P(x,'rgba(30,20,40,.34)',0,0,W,2);P(x,'rgba(30,20,40,.2)',0,2,W,2);P(x,'rgba(30,20,40,.1)',0,4,W,2);}
  function plinth(x,W,H,base){const r=ramp(base);P(x,r[2],0,H-6,W,6);P(x,r[4],0,H-6,W,1);P(x,r[1],0,H-2,W,1);P(x,r[0],0,H-1,W,1);for(let X=3;X<W;X+=10+(hash(X,1,S)*5|0))P(x,r[1],X,H-5,1,3);}
  function cornice(x,W,base){const r=ramp(base);P(x,r[5],0,0,W,1);P(x,r[4],0,1,W,2);P(x,r[2],0,3,W,1);P(x,r[0],0,4,W,1);for(let X=1;X<W;X+=4){P(x,r[3],X,5,2,2);P(x,r[1],X+1,6,1,1);}}
  function quoins(x,W,H,base){const r=ramp(base);[0,1].forEach(s=>{for(let y=7,k=0;y<H-8;y+=6,k++){const w=k%2?4:6,X=s?W-w:0;P(x,r[1],X,y,w,6);P(x,r[4],X,y,w,5);P(x,r[5],X,y,w,1);P(x,r[2],s?X:X+w-1,y+1,1,4);}});}
  function pipe(x,X,Y0,Y1,col){const r=ramp(col);P(x,r[1],X,Y0,3,Y1-Y0);P(x,r[3],X,Y0,2,Y1-Y0);P(x,r[5],X,Y0,1,Y1-Y0);for(let y=Y0+6;y<Y1-3;y+=12){P(x,r[0],X-1,y,5,1);P(x,r[4],X-1,y-1,5,1);}P(x,r[2],X-1,Y1-3,5,3);P(x,r[4],X-1,Y1-3,5,1);}
  function vent(x,X,Y){P(x,INK,X-1,Y-1,7,5);P(x,'#c8643a',X,Y,5,3);for(let i=0;i<5;i+=2)P(x,'#5a2a1a',X+i,Y+1,1,1);P(x,'#e8906a',X,Y,5,1);}
  const DIG=['111101101101111','010110010010111','111001111100111','111001111001111','101101111001001','111100111001111','111100111101111','111001010010010','111101111101111','111101111001111'];
  function num(x,X,Y,n,bg='#f4ecd8',fg='#2a2230'){const s=String(n);const w=s.length*4+2;P(x,INK,X-1,Y-1,w+2,9);P(x,bg,X,Y,w,7);P(x,mix(bg,'#ffffff',.5),X,Y,w,1);
    for(let k=0;k<s.length;k++){const d=DIG[+s[k]];for(let i=0;i<15;i++)if(d[i]==='1')P(x,fg,X+1+k*4+(i%3),Y+1+(i/3|0));}}
  function ivy(x,X0,W,H){const top=H*(.3+rnd()*.35);for(let i=0;i<W*H*.1;i++){const X=X0+rnd()*W|0,Y=H-(Math.pow(rnd(),.8)*(H-top))|0;P(x,['#2f6a2e','#3f7a34','#5a9a40','#78b050','#4a8a3a'][rnd()*5|0],X,Y,2,2);if(rnd()<.25)P(x,'#a8d070',X,Y);if(rnd()<.04)P(x,'#f2a0c0',X+1,Y);}}
  /* ---------- a window: lintel, frame with bevel, glass ramp, the room behind, glazing bars, glints, sill, flower box ---------- */
  function win(x,X,Y,w,h,o={}){X|=0;Y|=0;w|=0;h|=0;const lit=!!o.lit,fr=o.frame||'#f6f2e8',F=ramp(fr),wall=o.wall||'#e4d2a8';
    const glass=lit?['#fff2c0','#ffdc84','#f8b850','#f09a3a','#d8782a']:['#cfe6f4','#a8cce4','#86aed0','#6a90b4','#4c6e94'];
    const room=o.room!=null?o.room:(X*7+Y*13+w)%5;const curt=o.curtain||CURT[(X*3+Y*7)%CURT.length];
    // lintel / arch head
    if(o.arch&&w>=8){const rr=w/2+1;for(let k=-rr;k<=rr;k++){const yy=Math.round(Math.sqrt(Math.max(0,rr*rr-k*k))*.55);P(x,INK,X+w/2+k-1,Y-3-yy,1,1);P(x,F[3],X+w/2+k-1,Y-2-yy,1,yy+2);P(x,F[5],X+w/2+k-1,Y-2-yy,1,1);}
      P(x,F[2],X+(w>>1)-2,Y-4-Math.round(rr*.55),4,3);P(x,F[5],X+(w>>1)-2,Y-4-Math.round(rr*.55),4,1);}
    else if(w>=8&&o.lintel!==false){P(x,INK,X-3,Y-6,w+6,1);P(x,F[3],X-3,Y-5,w+6,3);P(x,F[5],X-3,Y-5,w+6,1);P(x,F[1],X-3,Y-2,w+6,1);if(w>=12){P(x,F[2],X+(w>>1)-2,Y-6,4,4);P(x,F[5],X+(w>>1)-2,Y-6,4,1);}}
    // shutters behind the frame
    if(o.shutter){const S2=ramp(o.shutter),sw=Math.max(3,w*.3|0);[X-2-sw,X+w+2].forEach((sx,si)=>{P(x,INK,sx-1,Y-2,sw+2,h+4);P(x,S2[3],sx,Y-1,sw,h+2);P(x,S2[4],sx,Y-1,1,h+2);for(let j=0;j<h+2;j+=2){P(x,S2[1],sx,Y-1+j,sw,1);P(x,S2[4],sx+1,Y+j,sw-2,1);}P(x,'#d8b860',si?sx:sx+sw-1,Y+3,1,1);P(x,'#d8b860',si?sx:sx+sw-1,Y+h-3,1,1);});}
    // frame
    P(x,INK,X-2,Y-2,w+4,h+4);P(x,F[3],X-1,Y-1,w+2,h+2);P(x,F[5],X-1,Y-1,w+2,1);P(x,F[4],X-1,Y,1,h);P(x,F[1],X+w,Y,1,h+1);P(x,F[2],X-1,Y+h,w+2,1);
    // glass ramp (sky top, deeper below)
    for(let j=0;j<h;j++)P(x,glass[Math.min(4,(j/h*5)|0)],X,Y+j,w,1);
    // the room behind
    if(w>=8&&h>=9){const C=ramp(curt);
      if(room===0||room===1){const cw=Math.max(2,w/4|0);for(let j=0;j<h-1;j++){const t=j/h,ww=Math.max(1,Math.round(cw*(t<.5?1:1.5-t*.9)));P(x,lit?C[2]:C[3],X,Y+j,ww,1);P(x,lit?C[1]:C[2],X+ww-1,Y+j,1,1);P(x,lit?C[2]:C[3],X+w-ww,Y+j,ww,1);P(x,lit?C[1]:C[2],X+w-ww,Y+j,1,1);}
        P(x,C[5],X,Y,w,1);P(x,C[1],X+cw-1,Y+(h*.5|0),2,1);P(x,C[1],X+w-cw-1,Y+(h*.5|0),2,1);}
      else if(room===2){const bh=Math.max(3,h*(.3+((X+Y)%3)*.12)|0);for(let j=0;j<bh;j++)P(x,j%2?(lit?'#e8c080':'#e8dcc4'):(lit?'#d0a060':'#d4c8b0'),X,Y+j,w,1);P(x,'#8a7a5a',X,Y+bh,w,1);P(x,'#b8a88c',X+(w>>1),Y+bh+1,1,2);}
      else if(room===3){for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(((i+j)&1)&&j<h*.7)P(x,lit?'#ffe8b0':'rgba(244,240,232,.55)',X+i,Y+j);}
      if(lit){P(x,'#fff8d8',X+(w>>1)-1,Y+1,3,2);P(x,'#8a5a36',X+(w>>1),Y,1,1);}
      // a pot plant or a vase on the inside sill
      if((X+Y*3)%4!==1){const px=X+(((X*5+Y)%3)+1)*w/4|0;P(x,'#a8583a',px-1,Y+h-4,3,3);P(x,'#c8784a',px-1,Y+h-4,3,1);P(x,'#3f7a34',px-2,Y+h-7,5,3);P(x,'#5a9a40',px-1,Y+h-8,3,2);P(x,'#8ac060',px,Y+h-8,1,1);if((X+Y)%3===0)P(x,'#f2a0c0',px+1,Y+h-8,1,1);}
      P(x,lit?'#8a5a2a':'#3e5068',X,Y+h-1,w,1);}
    // glazing bars (sash: meeting rail + a bar; casement: a cross; small: one bar)
    const bar=F[3],bs=F[1];const kind=o.kind||(h>w*1.15?'sash':'case');
    if(w>=6){if(kind==='sash'){P(x,bar,X,Y+(h>>1)-1,w,2);P(x,F[5],X,Y+(h>>1)-1,w,1);P(x,bs,X,Y+(h>>1)+1,w,1);P(x,bar,X+(w>>1),Y,1,h);if(h>=18){P(x,bar,X,Y+(h>>2),w,1);P(x,bar,X,Y+(3*h>>2),w,1);}}
      else{P(x,bar,X+(w>>1),Y,1,h);P(x,bs,X+(w>>1)+1,Y,1,h);P(x,bar,X,Y+(h/3|0),w,1);if(w>=16){P(x,bar,X+(w>>2),Y,1,h/3|0);P(x,bar,X+(3*w>>2),Y,1,h/3|0);}}}
    // glints on day glass
    if(!lit&&w>=5&&h>=5){for(let k=0;k<Math.min(w,h)*.55;k++){P(x,'#f4fbff',X+1+k,Y+(h*.6|0)-k,1,1);P(x,'#e0f0fa',X+2+k,Y+(h*.6|0)-k,1,1);if(k%2===0)P(x,'#e8f4fc',X+5+k,Y+(h*.6|0)-k,1,1);}P(x,'#ffffff',X+1,Y+1,1,1);}
    // sill with a drop shadow
    P(x,INK,X-3,Y+h+1,w+6,4);P(x,F[4],X-3,Y+h+1,w+6,1);P(x,F[3],X-3,Y+h+2,w+6,1);P(x,F[1],X-3,Y+h+3,w+6,1);P(x,'rgba(30,20,40,.3)',X-2,Y+h+5,w+4,1);P(x,'rgba(30,20,40,.14)',X-2,Y+h+6,w+4,1);
    // flower box
    if(o.box){const bc=o.boxCol||pick(['#6a4028','#2f5a46','#f6f2e8','#8a2a2a']),B=ramp(bc),by=Y+h+5;P(x,INK,X-2,by,w+4,5);P(x,B[3],X-1,by,w+2,3);P(x,B[5],X-1,by,w+2,1);P(x,B[1],X-1,by+3,w+2,1);
      const fl=[['#e05a6a','#ff9aa8'],['#f4d04a','#fff0a0'],['#f8f8f0','#ffffff'],['#c070e0','#e0b0f8'],['#f08a3a','#ffc080']];
      for(let k=0;k<w+2;k+=2){const L=['#2f6a2e','#4f8a3a','#6aa848'][(k+X)%3];P(x,L,X-1+k,by-2,2,2);if(rnd()<.8){const f=pick(fl);P(x,f[0],X-1+k,by-3-(rnd()*2|0),1,1);P(x,f[1],X+k,by-3,1,1);}if(rnd()<.35)P(x,L,X-1+k,by+5,1,1+(rnd()*3|0));}}}
  /* ---------- a front door: architrave, fanlight, panels, brass, number, step, wall lantern ---------- */
  function door(x,X,Y,w,h,o={}){X|=0;Y|=0;w|=0;h|=0;const col=o.col||'#2f6a74',C=ramp(col),fr=o.frame||'#f6f2e8',F=ramp(fr),lit=!!o.lit;
    P(x,INK,X-3,Y-4,w+6,h+4);P(x,F[3],X-2,Y-3,w+4,h+3);P(x,F[5],X-2,Y-3,w+4,1);P(x,F[4],X-2,Y-3,1,h+3);P(x,F[1],X+w+1,Y-2,1,h+2);
    const fl=o.fan===false?0:Math.max(3,Math.min(7,h/6|0));
    if(fl){const g=lit?['#fff2c0','#ffd070']:['#c8e0f0','#8aaed0'];for(let j=0;j<fl;j++)P(x,g[j<fl/2?0:1],X,Y-1+j,w,1);for(let k=1;k<w;k+=3)P(x,F[3],X+k,Y-1,1,fl);P(x,F[4],X,Y-1+fl,w,1);if(!lit)P(x,'#ffffff',X+1,Y,1,1);}
    const y0=Y+fl,dh=h-fl;P(x,C[1],X,y0,w,dh);P(x,C[3],X+1,y0+1,w-2,dh-2);P(x,C[4],X+1,y0+1,1,dh-2);
    // panels: 2 x 2 (or 2 x 3 on tall doors), recessed: dark top-left edge, light bottom-right
    const rows=dh>=34?3:2,pw=Math.max(2,(w-5)>>1),ph=Math.max(2,((dh-4-(rows+1))/rows)|0);
    for(let r=0;r<rows;r++)for(let c=0;c<2;c++){const a=X+2+c*(pw+1),b=y0+2+r*(ph+1)+(r===rows-1?1:0);if(pw<2||ph<2)continue;P(x,C[2],a,b,pw,ph);P(x,C[1],a,b,pw,1);P(x,C[1],a,b,1,ph);P(x,C[4],a,b+ph-1,pw,1);P(x,C[4],a+pw-1,b,1,ph);if(pw>3&&ph>4)P(x,C[3],a+1,b+1,pw-2,ph-2);}
    // brass: knob, letter slot, kick plate
    const kx=o.hinge?X+2:X+w-3;P(x,'#7a5a20',kx,Y+(h*.55|0),2,2);P(x,'#f2c04a',kx,Y+(h*.55|0),1,1);P(x,'#fff0a0',kx,Y+(h*.55|0)-1,1,1);
    P(x,'#7a5a20',X+(w>>1)-2,y0+(dh*.5|0),5,2);P(x,'#e8b848',X+(w>>1)-2,y0+(dh*.5|0),5,1);
    if(dh>20){P(x,'#b89048',X+1,Y+h-4,w-2,3);P(x,'#e8c870',X+1,Y+h-4,w-2,1);}
    // number plaque and lantern beside the door
    if(o.n!=null){const right=o.hinge?X-12:X+w+4;num(x,right,Y+fl+2,o.n,o.plate||'#f4ecd8',o.plateInk||INK);}
    if(o.lamp!==false){const lx=o.hinge?X+w+4:X-8;P(x,INK,lx,Y+1,5,8);P(x,lit?'#fff4c8':'#ffd98a',lx+1,Y+2,3,5);P(x,lit?'#ffffff':'#fff4c8',lx+1,Y+2,1,2);P(x,INK,lx+2,Y-2,1,3);P(x,'#5a4a3a',lx,Y+9,5,1);}
    // step(s)
    if(o.step!==false){const s=ramp('#c8bca4');P(x,s[3],X-4,Y+h-2,w+8,2);P(x,s[5],X-4,Y+h-2,w+8,1);P(x,INK,X-4,Y+h,w+8,1);P(x,'#8a5a3a',X+1,Y+h-2,w-2,1);}}
  /* ---------- whole wall face (same options as PXK.wall, so it can stand in for it on town houses) ---------- */
  function wall(w,h,o={}){seed((o.seed||7)*31+7);const W=Math.max(8,Math.round(w*PPM)),H=Math.max(8,Math.round(h*PPM));const[c,x]=cv(W,H);
    const base=o.base||'#e4d2a8';let kind=o.kind||(lum(base)>.84?'stone':'plaster');if(kind==='plaster'&&o.house&&rnd()<.45)kind='board';
    surface(x,W,H,base,kind);
    const tb=o.trim||(kind==='stone'?mix(base,'#ffffff',.2):pick(TRIMS));
    if(o.quoins!==false&&kind!=='stone'&&kind!=='board'&&W>40&&rnd()<.6)quoins(x,W,H,mix(base,'#e8dcc0',.6));
    if(o.plinth!==false)plinth(x,W,H,kind==='stone'?sh(base,.85):'#b8a88c');
    if(o.cornice!==false&&H>40)cornice(x,W,tb);else eave(x,W);
    const n=o.win==null?Math.max(0,Math.floor((W-16)/44)):o.win;const rows=o.rows||Math.max(1,Math.round(h/2.9)),band=H/rows;
    if(rows>1)for(let r=1;r<rows;r++){const Y=Math.round(r*band),T=ramp(tb);P(x,T[5],0,Y-3,W,1);P(x,T[3],0,Y-2,W,1);P(x,T[1],0,Y,W,1);}
    const dcol=o.doorCol||DOORS[(o.seed||0)%DOORS.length];const sh2=o.shutter||(rnd()<.3?pick(['#3d7a78','#2f5a46','#6a2a2a','#1d3a6e','#c8a040']):null);
    const room0=(o.seed||0)%5,curt=CURT[((o.seed||0)*3)%CURT.length];let pipeAt=-1;
    if(n||o.door)for(let r=0;r<rows;r++){const top=r*band,bottom=r===rows-1,doorRow=bottom&&o.door;const slots=n+(doorRow?1:0);if(!slots)continue;const step=W/slots;const dIdx=doorRow?Math.min(slots-1,Math.round((o.doorAt!=null?o.doorAt:.5)*(slots-1))):-1;
      for(let i=0;i<slots;i++){const cx=step*(i+.5);if(i===dIdx){const dw=Math.min(22,step-10|0),dh=Math.min(band-12,40);if(dw>8)door(x,cx-dw/2,H-dh-3,dw,dh,{col:dcol,frame:tb,lit:o.lit,n:o.num!=null?o.num:((o.seed||1)*7)%89+3,lamp:true});}
        else{const ww=Math.min(o.winW||20,step-14|0),wh=Math.min(o.winH||24,band-26);if(ww>6&&wh>8)win(x,cx-ww/2,Math.max(top+9,top+band*.44-wh/2),ww,wh,{arch:o.arch&&r===0,shutter:sh2&&ww<18?sh2:null,lit:o.lit,box:o.box!==false&&bottom&&rows<=2,frame:tb,wall:base,room:(room0+i+r)%5,curtain:curt});}}}
    if(W>40&&rnd()<.7){pipeAt=rnd()<.5?2:W-5;pipe(x,pipeAt,3,H-3,kind==='brick'?'#e8e4d8':sh(tb,.9));}
    if(o.vents!==false&&H<=96)for(let X=12;X<W-10;X+=30)vent(x,X,H-11);
    if(o.moss!==false){for(let i=0;i<W*.5;i++){const X=rnd()*W|0,Y=H-1-(Math.pow(rnd(),2.4)*H*.2|0);P(x,rnd()<.5?'#5d7a3a':'#7a9a48',X,Y);}}
    if(o.ivy)ivy(x,o.ivy[0]*W,o.ivy[1]*W,H);
    return c;}
  /* ---------- roofs: courses with a lit top row and a dark lap, per-tile tones, moss, ridge cap and gutter ---------- */
  function roofRows(x,W,H,base,kind,y0=0){const r=ramp(base);
    if(kind==='tin'){for(let X=0;X<W;X++){const p=X%5;P(x,p===0?r[5]:p===1?r[4]:p===2?r[3]:p===3?r[2]:r[1],X,y0,1,H-y0);}
      for(let y=y0+12;y<H;y+=16){P(x,r[0],0,y,W,1);P(x,r[4],0,y+1,W,1);for(let X=1;X<W;X+=8)P(x,'#e8e4dc',X,y-2,1,1);}
      for(let i=0;i<W/10;i++){const X=rnd()*W|0,Y0=y0+(rnd()*H|0),L=3+(rnd()*8|0);for(let k=0;k<L;k++)if(((X+k)&1)===0)P(x,'rgba(150,80,40,.45)',X+(k%2),Y0+k);}return;}
    const tw=kind==='slate'?7:kind==='shingle'?6:8,th=kind==='slate'?5:kind==='shingle'?5:6;P(x,r[0],0,y0,W,H-y0);
    for(let y=y0,row=0;y<H;y+=th,row++)for(let X=-(row%2)*(tw>>1);X<W;X+=tw){const v=hash(X,row,S),f=v<.15?r[2]:v>.88?r[5]:v>.62?r[4]:r[3];
      P(x,f,X,y,tw-1,th-1);P(x,v>.5?r[5]:r[4],X,y,tw-1,1);if(kind==='tile'){P(x,r[5],X+1,y+1,1,th-3);P(x,r[2],X+tw-3,y+1,1,th-2);}P(x,r[1],X,y+th-2,tw-1,1);P(x,r[2],X+tw-2,y+1,1,th-2);
      if(v>.3&&v<.33)P(x,'#6f8a44',X+2,y+2,2,1);if(v>.33&&v<.345)P(x,'#c8c070',X+3,y+1,1,1);}}
  function roof(w,h,o={}){seed((o.seed||11)*17+3);const W=Math.max(8,Math.round(w*PPM)),H=Math.max(8,Math.round(h*PPM));const base=o.base||'#b85434',kind=o.kind||'tile';
    const paint=(x,W,H)=>{roofRows(x,W,H,base,kind,0);const r=ramp(base);
      if(o.ridge){const R=ramp(kind==='tin'?sh(base,.95):mix(base,'#8a3a2e',.2));P(x,R[0],0,0,W,6);P(x,R[3],0,0,W,4);P(x,R[5],0,0,W,1);P(x,R[4],0,1,W,1);for(let X=0;X<W;X+=10){P(x,R[1],X,0,1,5);P(x,R[5],X+1,1,1,2);}P(x,'rgba(30,20,40,.3)',0,6,W,1);}
      if(o.gutter){const G=ramp(o.gutterCol||'#e8e4d8');P(x,G[1],0,H-4,W,4);P(x,G[3],0,H-4,W,2);P(x,G[5],0,H-4,W,1);P(x,G[0],0,H-1,W,1);}
      if(o.moss!==false&&kind!=='tin')for(let i=0;i<W*H/90;i++){const X=rnd()*W|0,Y=(o.ridge?7:0)+(rnd()*(H-12)|0);P(x,rnd()<.5?'#6f8a44':'#8aa858',X,Y,1+(rnd()*2|0),1);}
      if(o.vent){const vx=W*.7|0,vy=o.ridge?10:4;P(x,INK,vx-1,vy-1,8,7);P(x,'#9aa0a6',vx,vy,6,5);P(x,'#c8ccd0',vx,vy,6,1);P(x,'#5a5e6a',vx+1,vy+2,4,1);}};
    if(!o.across){const[c,x]=cv(W,H);paint(x,W,H);return c;}
    const[t,tx]=cv(H,W);paint(tx,H,W);const[c,x]=cv(W,H);x.translate(W,0);x.rotate(Math.PI/2);x.drawImage(t,0,0);return c;}
  /* ---------- small pieces for the rebuilt cottages ---------- */
  function chimney(w,h,base){seed(91);const W=Math.max(6,Math.round(w*PPM)),H=Math.max(6,Math.round(h*PPM));const[c,x]=cv(W,H);brick(x,W,H,base);const r=ramp('#e8dcc8');P(x,r[3],0,0,W,3);P(x,r[5],0,0,W,1);P(x,r[1],0,3,W,1);return c;}
  function stripes(w,d,a,b){const W=Math.round(w*PPM),H=Math.round(d*PPM);const[c,x]=cv(W,H);const A=ramp(a),B=ramp(b);for(let X=0;X<W;X++){const s=((X/6)|0)%2?B:A,p=X%3;P(x,p===0?s[5]:p===1?s[3]:s[2],X,0,1,H);}P(x,A[0],0,H-2,W,2);return c;}
  function lace(w,h,col='#f6f6f2'){const W=Math.round(w*PPM),H=Math.round(h*PPM);const[c,x]=cv(W,H);const r=ramp(col);P(x,r[3],0,0,W,2);P(x,r[5],0,0,W,1);
    for(let X=0;X<W;X++)for(let y=2;y<H;y++){const u=X%8,v=y-2;const on=(v===0)||(u===0&&v<H-3)||(Math.abs(u-4)===(v%5))&&v<H-2||(v===H-3&&u%2===0);if(on)P(x,v>H*.5?r[2]:r[3],X,y);}return c;}
  function tiles(w,d){const W=Math.round(w*PPM),H=Math.round(d*PPM);const[c,x]=cv(W,H);for(let y=0;y<H;y+=4)for(let X=0;X<W;X+=4){const k=((X>>2)+(y>>2))%2;P(x,k?'#a8402a':'#efe3c4',X,y,4,4);P(x,k?'#c8603a':'#fff8e6',X,y,4,1);}P(x,'#5a3a22',0,0,W,1);return c;}
  function gable(W,H,base,o={}){seed(o.seed||5);const w=Math.round(W*PPM),h=Math.round(H*PPM);const[c,x]=cv(w,h);board(x,w,h,base);const r=ramp(o.trim||'#f6f2e8');
    // a round vent and the bargeboards follow the triangle edges (the triangle uses the canvas: base along the bottom, apex at the top middle)
    const vx=w/2|0,vy=h*.45|0;for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++)if(i*i+j*j<=10)P(x,i*i+j*j>=6?INK:(j%2?'#5a4a3a':'#8a7a5a'),vx+i,vy+j);
    for(let y=0;y<h;y++){const half=(w/2)*(y/h);P(x,r[3],w/2-half-1|0,y,3,1);P(x,r[5],w/2-half-1|0,y,1,1);P(x,r[3],w/2+half-2|0,y,3,1);P(x,r[1],w/2+half|0,y,1,1);}
    P(x,r[3],vx-1,0,3,3);P(x,r[5],vx-1,0,1,3);return c;}
  function veg(w,d){const W=Math.round(w*PPM),H=Math.round(d*PPM);const[c,x]=cv(W,H);P(x,'#6a4a2a',0,0,W,H);for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(hash(X,y,4)<.2)P(x,'#5a3a22',X,y);
    for(let y=3;y<H-2;y+=6)for(let X=2;X<W-2;X+=4){P(x,'#3f7a34',X,y,3,3);P(x,'#5a9a40',X,y,2,2);P(x,'#8ac060',X,y,1,1);if(hash(X,y,2)<.3)P(x,'#e05a3a',X+1,y+2,1,1);}return c;}
  function pave(w,d,base='#cfc4b0'){seed(77);const W=Math.max(4,Math.round(w*PPM)),H=Math.max(4,Math.round(d*PPM));const[c,x]=cv(W,H);const r=ramp(base);P(x,r[1],0,0,W,H);
    for(let y=0,row=0;y<H;y+=5,row++)for(let X=-(row%2)*3;X<W;X+=6){const v=hash(X,row,1);P(x,v<.3?r[2]:v>.8?r[4]:r[3],X,y,5,4);P(x,r[5],X,y,5,1);}return c;}
  function mat(w,d){const W=Math.max(4,Math.round(w*PPM)),H=Math.max(3,Math.round(d*PPM));const[c,x]=cv(W,H);const col=pick(['#8a2a2a','#3a5a3a','#5a3a22','#2f4a6e']),r=ramp(col);P(x,r[1],0,0,W,H);P(x,r[3],1,1,W-2,H-2);for(let X=2;X<W-2;X+=2)P(x,r[4],X,2,1,H-4);return c;}
  function wood(w,d,base='#8a5a36'){const W=Math.max(4,Math.round(w*PPM)),H=Math.max(2,Math.round(d*PPM));const[c,x]=cv(W,H);const r=ramp(base);for(let y=0;y<H;y+=3){P(x,r[3],0,y,W,3);P(x,r[5],0,y,W,1);P(x,r[1],0,y+2,W,1);}return c;}
  function tank(w,h,base='#9aa0a6'){const W=Math.max(8,Math.round(w*PPM)),H=Math.max(8,Math.round(h*PPM));const[c,x]=cv(W,H);roofRows(x,W,H,base,'tin',0);const r=ramp(base);for(let y=4;y<H;y+=7){P(x,r[0],0,y,W,1);P(x,r[5],0,y+1,W,1);}return c;}
  return{PPM,INK,ramp,mix,sh,lum,hash,seed,rnd,cv,P,pick,WALLS,TRIMS,DOORS,ROOFS,CURT,board,brick,stone,render,surface,eave,plinth,cornice,quoins,pipe,vent,num,win,door,wall,roof,roofRows,chimney,stripes,lace,tiles,gable,veg,pave,mat,wood,tank,cur:null};
})();
// glow at night: lit minus day leaves the glass only (like CAFE_PX's litMat). Textures marked __t2 keep their extra tones.
function t2Tex(c,rep){const t=ctex(c);t.__t2=1;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
function t2Lit(day,lit,o){const m=new THREE.MeshLambertMaterial(Object.assign({map:t2Tex(day),emissive:0xffffff,emissiveIntensity:0,emissiveMap:t2Tex(PXK.glowDiff(day,lit))},o||{}));PXB_GLOW.push(m);return m;}
const T2M=new Map();function t2Mat(key,make,o){let m=T2M.get(key);if(!m){m=new THREE.MeshLambertMaterial(Object.assign({map:t2Tex(make())},o||{}));T2M.set(key,m);}return m;}
function t2Col(key,c){let m=T2M.get('c|'+key);if(!m){m=new THREE.MeshLambertMaterial({color:new THREE.Color(c)});T2M.set('c|'+key,m);}return m;}
// the pixel kit's wall painter hands town houses to T2.wall while pxbScene skins them (T2.cur is set per wall)
if(TOWN2_ON){const _pw=PXK.wall;PXK.wall=function(w,h,o){const W=T2.cur;if(W&&W.__t2){const k=o&&o.seed!=null?Math.round(((o.seed-13-((w*10)|0))/7)):0;const small=!!W.__small;
    return T2.wall(w,h,Object.assign({},o,{house:small,door:o.door||(small&&!W.faces.some(f=>f>0)&&(k===0||k===2)&&w>=2.4),doorAt:(W.__s%3)/2,seed:(o.seed||7)+W.__s*13,num:W.__s%89+2}));}return _pw(w,h,o);};}
function t2Zone(x){return x>100&&x<250?'sp':x>=250&&x<380?'freo':x>=470&&x<590?'vp':x>=590&&x<=710?'cbd':null;}
const T2V=new THREE.Vector3();function t2Local(o){o.getWorldPosition(T2V);scene.worldToLocal(T2V);return T2V;}
// pxbScene marks which walls are town houses (plain kit walls, house height, in the four mainland towns) and gives each its own colour
function town2Mark(walls){let n=0;const B=new THREE.Box3(),signs=[];scene.traverse(o=>{if(o.isMesh&&o.visible&&o.material&&!Array.isArray(o.material)&&o.material.map&&SIGN_TEX.has(o.material.map)){B.setFromObject(o);if(!B.isEmpty())signs.push(B.clone());}});
  walls.forEach(W=>{if(W.o.__pxSkip)return;const p=t2Local(W.o);const z=t2Zone(p.x);if(!z||W.h>6.6||Math.max(W.w,W.d)>14)return;W.__t2=z;W.__s=(Math.round(p.x*3)*7+Math.round(p.z*5)*13)>>>0;
    B.setFromObject(W.o);B.expandByScalar(.5);W.__sign=signs.some(q=>q.intersectsBox(B));W.__small=W.h<3.4&&W.w*W.d<16&&!W.__sign;n++;});town2Mark.n=n;}
T2.base=function(W,b){if(!W.__t2||!W.__small)return b;const l=T2.lum(b);if(l<.3)return b;// bricks stay brick; plain renders get a heritage colour, nudged so the kit's cache never shares it
  const c=T2.WALLS[W.__s%T2.WALLS.length];const a=new THREE.Color(T2.mix(b,c,.75));return'#'+a.getHexString().slice(0,5)+((parseInt(a.getHexString().slice(5),16)|1).toString(16));};
