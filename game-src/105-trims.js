/* --- trims --- */
function cornice(x,W,H,base){P(x,sh(base,1.18),0,0,W,2);P(x,sh(base,1.02),0,2,W,2);P(x,sh(base,.62),0,4,W,1);for(let X=2;X<W;X+=6)P(x,sh(base,.78),X,5,2,2);}
function plinth(x,W,H,base){const b=sh(base,.72);P(x,b,0,H-7,W,7);P(x,sh(base,.9),0,H-7,W,1);P(x,sh(base,.5),0,H-1,W,1);for(let X=0;X<W;X+=12+(rnd()*6|0))P(x,sh(base,.55),X,H-7,1,6);}
function quoins(x,W,H,base){[0,W-7].forEach(X=>{for(let y=6,k=0;y<H-8;y+=7,k++){const w=k%2?5:7,xx=X===0?0:W-w,f=.98+rnd()*.06;P(x,sh(base,.6),xx,y,w,7);P(x,sh(base,f*1.1),xx,y,w,6);P(x,sh(base,f*1.24),xx,y,w,1);}});}
/* --- openings painted into a wall --- */
function win(x,X,Y,w,h,{arch=false,shutter=null,box=true,lit=false,frame='#efe4cc',sash=true}={}){
  const glass=lit?['#ffe8a8','#ffc860','#f49a40']:['#6a8aa6','#86a8c2','#46627e'];
  P(x,INK,X-2,Y-2,w+4,h+4);P(x,frame,X-1,Y-1,w+2,h+2);
  for(let j=0;j<h;j++)P(x,glass[j<h*.3?0:j<h*.7?1:2],X,Y+j,w,1);
  if(arch){const r=w/2+1;for(let k=0;k<=r;k++){const yy=Math.round(Math.sqrt(Math.max(0,r*r-k*k))*.6);P(x,INK,X+w/2-k-1,Y-2-yy,1,1);P(x,INK,X+w/2+k,Y-2-yy,1,1);P(x,frame,X+w/2-k,Y-1-yy,1,yy);P(x,frame,X+w/2+k-1,Y-1-yy,1,yy);}
    P(x,sh(frame,.85),X+w/2-1,Y-3-Math.round(r*.6),2,2);}
  if(sash){P(x,frame,X+(w>>1),Y,1,h);P(x,frame,X,Y+(h>>1),w,1);if(h>14)P(x,frame,X,Y+(h>>2),w,1),P(x,frame,X,Y+(3*h>>2),w,1);}
  if(!lit){P(x,'#d8ecf8',X+1,Y+1,2,1);P(x,'#d8ecf8',X+1,Y+2,1,1);}
  P(x,sh(frame,.86),X-3,Y+h+1,w+6,2);P(x,INK,X-3,Y+h+3,w+6,1);P(x,sh(frame,1.1),X-2,Y-3,w+4,1);
  if(shutter)[X-2-5,X+w+2].forEach(sx=>{P(x,INK,sx,Y-2,5,h+4);P(x,shutter,sx+1,Y-1,3,h+2);for(let j=0;j<h+2;j+=2)P(x,sh(shutter,.75),sx+1,Y-1+j,3,1);});
  if(box){P(x,'#6a4028',X-1,Y+h+3,w+2,3);P(x,INK,X-1,Y+h+6,w+2,1);for(let k=0;k<w;k+=2){P(x,['#e05a6a','#f4d04a','#f0f0f0','#c070e0'][rnd()*4|0],X+k,Y+h+1,1,1);P(x,'#4f8a3a',X+k+1,Y+h+2,1,1);}}}
function door(x,X,Y,w,h,col='#2f6a74',{arch=true,lamp=true,step=true}={}){P(x,INK,X-2,Y-3,w+4,h+3);P(x,'#e8dcc0',X-1,Y-2,w+2,h+2);P(x,sh(col,.7),X,Y-1,w,h+1);
  for(let k=1;k<w-1;k+=4)P(x,col,X+k,Y+5,3,h-6),P(x,sh(col,1.15),X+k,Y+5,1,h-6);
  if(arch){P(x,'#ffe29a',X+2,Y+1,w-4,3);P(x,INK,X+(w>>1),Y+1,1,3);}P(x,'#f2c04a',X+w-4,Y+(h>>1)+2,2,2);
  if(step){P(x,sh('#b8a88c',1),X-4,Y+h-2,w+8,2);P(x,INK,X-4,Y+h-1,w+8,1);}
  if(lamp){P(x,INK,X+w+3,Y+2,4,6);P(x,'#ffd98a',X+w+4,Y+3,2,4);}}
/* --- whole wall face --- */
function wall(w,h,o={}){seed(o.seed||7);const W=Math.round(w*PPM),H=Math.round(h*PPM);const[c,x]=cv(W,H);const base=o.base||'#e4d2a8',kind=o.kind||(lum(base)>.8?'stone':'plaster');
  if(kind==='stone')blocks(x,W,H,base);else if(kind==='brick')bricks(x,W,H,base);else if(kind==='board')weatherboard(x,W,H,base);else plaster(x,W,H,base);
  const tb=o.trim||(kind==='stone'?mix(base,'#ffffff',.15):mix(base,'#f4ecd8',.55));
  if(o.quoins!==false&&kind!=='stone'&&W>40)quoins(x,W,H,mix(base,'#e8dcc0',.6));
  if(o.plinth!==false)plinth(x,W,H,kind==='stone'?sh(base,.85):'#b8a88c');
  if(o.cornice!==false&&H>40)cornice(x,W,H,tb);
  const n=o.win==null?Math.max(0,Math.floor((W-16)/44)):o.win;const doorAt=o.door?(o.doorAt!=null?o.doorAt:.5):-1;
  if(n||o.door){const slots=n+(o.door?1:0),step=W/slots;let k=0,dIdx=o.door?Math.min(slots-1,Math.round(doorAt*(slots-1))):-1;
    for(let i=0;i<slots;i++){const cx=step*(i+.5);if(i===dIdx){const dw=Math.min(26,step-10|0),dh=Math.min(H-14,44);door(x,cx-dw/2,H-dh-3,dw,dh,o.doorCol||'#2f6a74');}
      else{const ww=Math.min(o.winW||22,step-16|0),wh=Math.min(o.winH||26,H-30);if(ww>6&&wh>8)win(x,cx-ww/2,Math.max(10,H*.42-wh/2),ww,wh,{arch:o.arch,shutter:o.shutter,lit:o.lit,box:o.box!==false});k++;}}}
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
return{PPM,wall,roof,pane,doorPane,blocks,plaster,bricks,weatherboard,win,door,cornice,plinth,quoins,moss,ivy,mix,sh,lum,seed,rnd,cv,P};
})();

