/* big glass: shop fronts and glazed walls. Dark metal frame, a mullion every metre, a transom, glints, goods on shelves behind */
function glass(W,H,{lit=false,tint='#6a8aa6',seed=3}={}){S=seed;const[c,x]=cv(W,H);const g=rgb(tint),dark=sh(tint,.55),mid=sh(tint,.8),hi=sh(tint,1.25);
  for(let j=0;j<H;j++)P(x,lit?(j<H*.4?'#ffe8a8':'#ffc870'):(j<H*.35?hi:j<H*.7?mid:dark),0,j,W,1);
  // the shop inside: two shelves of goods, a counter and a hanging lamp
  const sy=[H*.38|0,H*.62|0];sy.forEach(y=>{P(x,lit?'#8a5a36':sh(tint,.45),0,y,W,1);for(let X=1;X<W-1;X+=3){if(rnd()<.7)P(x,['#e05a6a','#f4d04a','#5cc6d8','#7ab454','#f0f0f0'][rnd()*5|0],X,y-2-(rnd()*2|0),2,2+(rnd()*2|0));}});
  if(H>30){P(x,lit?'#6a4028':sh(tint,.4),W*.15|0,H*.78|0,W*.3|0,H*.22|0);P(x,lit?'#fff4c8':sh(tint,1.1),W*.3|0,H*.12|0,3,2);}
  if(!lit)for(let k=0;k<Math.min(W,H)*.7;k++){P(x,'rgba(240,250,255,.7)',(W*.2|0)+k,(H*.8|0)-k,2,1);P(x,'rgba(240,250,255,.45)',(W*.2|0)+k+6,(H*.8|0)-k,1,1);}
  const fr='#3a3e48';P(x,fr,0,0,W,2);P(x,fr,0,H-3,W,3);P(x,'#8a8e96',0,H-3,W,1);P(x,fr,0,0,2,H);P(x,fr,W-2,0,2,H);P(x,'#5a5e6a',0,0,W,1);
  for(let X=32;X<W-8;X+=32){P(x,fr,X-1,0,2,H);P(x,'#6a6e78',X-1,0,1,H);}if(H>40)P(x,fr,0,H*.24|0,W,2);
  return c;}
function glowDiff(day,lit){const e=document.createElement('canvas');e.width=day.width;e.height=day.height;const A=day.getContext('2d').getImageData(0,0,e.width,e.height),B=lit.getContext('2d').getImageData(0,0,e.width,e.height),E=e.getContext('2d').createImageData(e.width,e.height);
  for(let q=0;q<A.data.length;q+=4){const d=Math.abs(A.data[q]-B.data[q])+Math.abs(A.data[q+1]-B.data[q+1])+Math.abs(A.data[q+2]-B.data[q+2]);if(d>30){E.data[q]=B.data[q];E.data[q+1]=B.data[q+1];E.data[q+2]=B.data[q+2];}E.data[q+3]=255;}e.getContext('2d').putImageData(E,0,0);return e;}
/* --- whole wall face --- */
function wall(w,h,o={}){seed(o.seed||7);const W=Math.round(w*PPM),H=Math.round(h*PPM);const[c,x]=cv(W,H);const base=o.base||'#e4d2a8',kind=o.kind||(lum(base)>.8?'stone':'plaster');
  if(kind==='stone')blocks(x,W,H,base);else if(kind==='brick')bricks(x,W,H,base);else if(kind==='board')weatherboard(x,W,H,base);else plaster(x,W,H,base);
  const tb=o.trim||(kind==='stone'?mix(base,'#ffffff',.15):mix(base,'#f4ecd8',.55));
  if(o.quoins!==false&&kind!=='stone'&&W>40)quoins(x,W,H,mix(base,'#e8dcc0',.6));
  if(o.plinth!==false)plinth(x,W,H,kind==='stone'?sh(base,.85):'#b8a88c');
  if(o.cornice!==false&&H>40)cornice(x,W,H,tb);
  const n=o.win==null?Math.max(0,Math.floor((W-16)/44)):o.win;const doorAt=o.door?(o.doorAt!=null?o.doorAt:.5):-1;
  const rows=o.rows||Math.max(1,Math.round(h/2.9)),band=H/rows;
  if(rows>1)for(let r=1;r<rows;r++){const Y=Math.round(r*band);P(x,sh(tb,1.08),0,Y-2,W,2);P(x,sh(tb,.66),0,Y,W,1);}
  if(n||o.door)for(let r=0;r<rows;r++){const top=r*band,bottom=r===rows-1,doorRow=bottom&&o.door;const slots=n+(doorRow?1:0);if(!slots)continue;const step=W/slots;let dIdx=doorRow?Math.min(slots-1,Math.round(doorAt*(slots-1))):-1;
    for(let i=0;i<slots;i++){const cx=step*(i+.5);if(i===dIdx){const dw=Math.min(26,step-10|0),dh=Math.min(band-14,44);door(x,cx-dw/2,H-dh-3,dw,dh,o.doorCol||'#2f6a74');}
      else{const ww=Math.min(o.winW||22,step-16|0),wh=Math.min(o.winH||26,band-30);if(ww>6&&wh>8)win(x,cx-ww/2,Math.max(top+10,top+band*.42-wh/2),ww,wh,{arch:o.arch&&r===0,shutter:o.shutter,lit:o.lit,box:o.box!==false&&r<2});}}}
  if(o.moss!==false)moss(x,W,H,kind==='stone'?1:.5);if(o.ivy)ivy(x,o.ivy[0]*W,o.ivy[1]*W,H);
  return c;}
/* --- roofs --- */
function roofRows(x,W,H,base,kind){if(kind==='tin'){for(let X=0;X<W;X+=3){const f=X%6?.92:1.08;P(x,sh(base,f),X,0,3,H);P(x,sh(base,f*1.18),X,0,1,H);}for(let y=0;y<H;y+=24)P(x,sh(base,.7),0,y,W,1);return;}
  const tw=kind==='slate'?7:8,th=kind==='slate'?5:6;P(x,sh(base,.55),0,0,W,H);
  for(let y=0,r=0;y<H;y+=th,r++)for(let X=-(r%2)*(tw>>1);X<W;X+=tw){const f=.94+rnd()*.1;P(x,sh(base,f),X,y,tw,th);P(x,sh(base,f*1.16),X+1,y,tw-2,1);P(x,sh(base,f*.78),X,y+th-2,tw,1);P(x,sh(base,.52),X,y+th-1,tw,1);P(x,sh(base,f*.7),X+tw-1,y,1,th-1);
    if(rnd()<.035)P(x,'#6f8a44',X+2,y+2,2,1);}}
function roof(w,h,o={}){seed(o.seed||11);const W=Math.round(w*PPM),H=Math.round(h*PPM);const base=o.base||'#b85434',kind=o.kind||'tile';
  if(!o.across){const[c,x]=cv(W,H);roofRows(x,W,H,base,kind);return c;}
  // rows run along the canvas height (for cylinder prisms, whose slope goes around u)
  const[t,tx]=cv(H,W);roofRows(tx,H,W,base,kind);const[c,x]=cv(W,H);x.translate(W,0);x.rotate(Math.PI/2);x.drawImage(t,0,0);return c;}
function pane(lit,w=12,h=14,frame='#efe4cc'){const[c,x]=cv(w+6,h+6);P(x,INK,0,0,w+6,h+6);win(x,3,3,w,h,{lit,box:false,frame});return c;}
function doorPane(col,w=20,h=38){const[c,x]=cv(w+6,h+4);P(x,'#e8dcc0',0,0,w+6,h+4);door(x,3,3,w,h,col,{lamp:false,step:false});return c;}
return{PPM,wall,roof,pane,doorPane,glass,glowDiff,blocks,plaster,bricks,weatherboard,win,door,cornice,plinth,quoins,moss,ivy,mix,sh,lum,seed,rnd,cv,P};
})();

