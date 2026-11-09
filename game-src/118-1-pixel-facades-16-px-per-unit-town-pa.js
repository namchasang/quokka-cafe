// ===== 1. pixel facades (16 px per unit, the town painters scaled to the overworld) =====
// paints one wall face into ctx x (day) and g (glow) at X0,Y0 size W x Hh
function face(x,g,X0,Y0,W,Hh,o){const r=rng(o.seed||7),base=o.base||'#efe6d4',kind=o.kind||'plaster',rows=o.rows||1;
  if(kind==='brick'){PP(x,shc(base,.62),X0,Y0,W,Hh);for(let y=0,k=0;y<Hh;y+=2,k++)for(let X=-(k%2)*2;X<W;X+=4){const f=.88+r()*.22;PP(x,shc(base,f),X0+Math.max(0,X),Y0+y,Math.min(3,W-Math.max(0,X)),1);}}
  else if(kind==='stone'){PP(x,shc(base,.8),X0,Y0,W,Hh);for(let y=0,k=0;y<Hh;y+=3,k++)for(let X=-(k%2)*3;X<W;X+=5+(r()*3|0)){const f=.92+r()*.14;PP(x,shc(base,f),X0+Math.max(0,X)+1,Y0+y,4,2);PP(x,shc(base,f*1.08),X0+Math.max(0,X)+1,Y0+y,4,1);}}
  else if(kind==='board'){for(let y=0;y<Hh;y+=3){const f=.95+r()*.06;PP(x,shc(base,f),X0,Y0+y,W,3);PP(x,shc(base,f*.74),X0,Y0+y+2,W,1);}}
  else{PP(x,base,X0,Y0,W,Hh);for(let i=0;i<W*Hh/10;i++)PP(x,shc(base,r()<.5?.95:1.04),X0+r()*W,Y0+r()*Hh);}
  PP(x,shc(base,.62),X0,Y0,W,2);PP(x,'rgba(0,0,0,.18)',X0,Y0+2,W,1);// shade under the eaves
  PP(x,shc(o.trim||'#b8a88c',.8),X0,Y0+Hh-2,W,2);PP(x,'#3a3438',X0,Y0+Hh-1,W,1);// plinth
  const band=(Hh-3)/rows,fr=o.frame||'#f4ecd8';
  for(let rr=0;rr<rows;rr++){const top=Y0+2+rr*band,isG=rr===rows-1;const slots=o.win==null?Math.max(1,Math.floor(W/13)):o.win;const step=W/(slots+(isG&&o.door?1:0));let di=isG&&o.door?Math.min(slots,Math.round((o.doorAt==null?.5:o.doorAt)*slots)):-1;
    for(let i=0,s=0;i<slots+(di>=0?1:0);i++){const cx=X0+step*(i+.5);
      if(i===di){const dw=o.garage?11:4,dh=o.garage?Math.min(8,band-3):Math.min(8,band-2),dx=cx-dw/2|0,dy=top+band-dh-1|0;
        if(o.garage){PP(x,'#2a2230',dx-1,dy-1,dw+2,dh+1);PP(x,'#d8d4c8',dx,dy,dw,dh);for(let j=1;j<dh;j+=2)PP(x,'#b0aca0',dx,dy+j,dw,1);}
        else{PP(x,'#2a2230',dx-1,dy-1,dw+2,dh+1);PP(x,fr,dx-1,dy-1,dw+2,1);PP(x,o.doorCol||['#2f6a74','#8a3a2a','#3e5a3a','#6a4a32'][(o.seed||0)%4],dx,dy,dw,dh);PP(x,'#f2c04a',dx+dw-1,dy+(dh>>1),1,1);PP(x,'#ffe8a8',dx,dy,dw,1);if(g)PP(g,'#ffd070',dx,dy,dw,1);}
        continue;}
      const ww=o.ww||5,wh=Math.min(o.wh||5,band-4),wx=cx-ww/2|0,wy=(top+Math.max(2,band*.42-wh/2))|0;
      PP(x,'#2a2230',wx-1,wy-1,ww+2,wh+2);PP(x,fr,wx-1,wy-1,ww+2,1);PP(x,'#a8c8e0',wx,wy,ww,wh>>1);PP(x,'#5a7a96',wx,wy+(wh>>1),ww,wh-(wh>>1));PP(x,'#e8f4fc',wx+1,wy,1,1);
      if(ww>=5)PP(x,shc(fr,.85),wx+(ww>>1),wy,1,wh);PP(x,shc(fr,.9),wx-1,wy+wh+1,ww+2,1);
      if(o.shut){PP(x,o.shut,wx-2,wy,1,wh);PP(x,o.shut,wx+ww+1,wy,1,wh);}
      if(g&&r()<(o.litP==null?.6:o.litP)){PP(g,'#ffd070',wx,wy,ww,wh);PP(g,'#ffb050',wx,wy+wh-1,ww,1);PP(x,'#ffe8b0',wx,wy,0,0);}
      s++;}}
  if(o.awn){PP(x,'#2a2230',X0,Y0+Hh-band*.62|0,W,1);for(let X=0;X<W;X+=4)PP(x,X%8?'#f4f2ec':o.awn,X0+X,Y0+Hh-band*.62+1|0,4,2);}
  if(o.moss)for(let i=0;i<W/3;i++)PP(x,r()<.5?'#5d7a3a':'#7a9a48',X0+r()*W,Y0+Hh-3-(r()*r()*4|0));}
// roof pixels (greyscale, tinted per house): left half tiles, right half corrugated tin; 64 x 32, repeats
const roofC=(()=>{const c=mkc(64,32),x=c.getContext('2d');PP(x,'#7a7a7a',0,0,32,32);for(let y=0,k=0;y<32;y+=4,k++)for(let X=-(k%2)*3;X<32;X+=6){const f=.9+HSH(X,y)*.12;const v=Math.round(225*f);PP(x,`rgb(${v},${v},${v})`,X,y,6,3);PP(x,'#f4f4f4',X+1,y,4,1);PP(x,'#8a8a8a',X,y+3,6,1);}
  for(let X=32;X<64;X+=2){PP(x,X%4?'#c8c8c8':'#ececec',X,0,2,32);}for(let y=0;y<32;y+=16)PP(x,'#9a9a9a',32,y,32,1);return c;})();

// ===== 0. Mitchell Fwy corridor (four lanes, a median with the northern railway), road and rail corridors kept clear =====
const MP=(()=>{if(!N)return null;const z0=N.ZF?(-N.ZF.ZK+(-750+N.ZF.ZK)*N.ZF.ZF):-750;const P=N.main.p,out=[];for(const q of P){out.push(q);if(q[1]<z0)break;}return out.length>3?out:null;})();
O.MP=MP;
const MB={};if(MP)for(let i=1;i<MP.length;i++){const a=MP[i-1],b=MP[i],k0=Math.floor((Math.min(a[1],b[1])-12)/40),k1=Math.floor((Math.max(a[1],b[1])+12)/40);for(let k=k0;k<=k1;k++)(MB[k]||(MB[k]=[])).push([a,b]);}
const mitchD=(x,z)=>{const L=MB[Math.floor(z/40)];if(!L)return 1e9;let d=1e9;for(const s of L){const e=segDist(x,z,s[0],s[1]);if(e<d)d=e;}return d;};
O.mitchD=mitchD;
if(N&&MP){const orig=N.onRoad.bind(N),origAt=N.roadAt.bind(N);N.onRoad=(x,z,w)=>orig(x,z,w)||mitchD(x,z)<w+3.8;N.roadAt=(x,z,w)=>origAt(x,z,w)||(mitchD(x,z)<w+3.8?N.main:null);}
const railD=(x,z)=>{let d=1e9;for(let i=1;i<RAIL.length;i++){const e=segDist(x,z,RAIL[i-1],RAIL[i]);if(e<d)d=e;}return d;};
// true where nothing may stand: a road (with its verge), the railway, the freeway corridor
const clearAt=(x,z,pad)=>onRoad(x,z,2.4+pad)||(z>-40&&railD(x,z)<1.6+pad)||(MP&&mitchD(x,z)<5.8+pad);
O.clearAt=clearAt;

