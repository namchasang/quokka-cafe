// ---------- Perth houses from Roo Road Rescue (Look Lab ?town2, Paul Nov 2026) ----------
// Paul: "the characteristic Perth houses are already designed in Roo Road Rescue's assets, use them" and "colour them as
// nicely as the Fremantle cottages". The three Perth designs of that game's house kit (blender/models.py: the 1980s
// brick-veneer house with a low hip roof in concrete tiles, a garage, aircon and solar panels; the weatherboard cottage on
// stumps with a bullnose verandah, a brick chimney and a rainwater tank; and a Federation red-brick bungalow with a front
// gable over a bay window, a cream render band, leadlights and tall chimneys) are rebuilt here as low-poly shapes fitted
// to the old houses' exact footprints, and every face is painted by the town painter T2 at 32 px per metre with 6-tone
// ramps. The old plain boxes are hidden; colliders, fences, lots for sale and story spots are untouched.
const T3H=(function(){
  const P=T2.P,ramp=T2.ramp,INK=T2.INK;
  function cvm(wm,hm){return T2.cv(Math.max(8,Math.round(wm*32)),Math.max(8,Math.round(hm*32)));}
  // a panel-lift garage door with ribs, a hood shadow and a handle
  function garage(x,X,Y,w,h,col){const C=ramp(col),F=ramp('#e8e4d8');P(x,INK,X-2,Y-2,w+4,h+2);P(x,F[3],X-1,Y-1,w+2,h+1);P(x,F[5],X-1,Y-1,w+2,1);
    for(let y=0;y<h;y++){const k=y%5;P(x,k===0?C[5]:k===1?C[4]:k<4?C[3]:C[1],X,Y+y,w,1);}P(x,C[0],X,Y,w,2);P(x,'rgba(30,20,40,.25)',X,Y+2,w,2);
    P(x,'#5a5e66',X+(w>>1)-3,Y+h-7,6,2);P(x,'#c8ccd0',X+(w>>1)-3,Y+h-7,6,1);P(x,C[0],X,Y+h-1,w,1);}
  // a split-system aircon unit painted on a wall (the 3D box is added too where it shows)
  function meter(x,X,Y){P(x,INK,X,Y,7,9);P(x,'#d8d4c8',X+1,Y+1,5,7);P(x,'#f4f0e6',X+1,Y+1,5,1);P(x,'#3a3e48',X+2,Y+3,3,2);}
  // leadlight: little coloured panes along the top of a window
  function lead(x,X,Y,w){const c=['#c84a4a','#e8b848','#4a8a5a','#4a6aa8','#f4ecd8'];for(let i=0;i<w;i+=3){P(x,c[(i/3|0)%c.length],X+i,Y,2,3);P(x,'#3a3020',X+i+2,Y,1,3);}P(x,'#3a3020',X,Y+3,w,1);}
  // one wall face: surface, eave shadow, plinth, bands, stumps, then windows, doors and the garage
  function face(wm,hm,o,lit){T2.seed(o.seed);const[c,x]=cvm(wm,hm);const W=c.width,H=c.height;T2.surface(x,W,H,o.base,o.kind);
    if(o.bandY){const r=ramp(o.bandCol||'#efe3c4'),y=o.bandY;P(x,r[5],0,y,W,1);P(x,r[4],0,y+1,W,2);P(x,r[2],0,y+3,W,1);P(x,r[0],0,y+4,W,1);}
    if(o.stumps){for(let X=0;X<W;X++)for(let y=H-6;y<H;y++)P(x,((X+y)%4===0||(X-y+40)%4===0)?'#8a7a62':'#3a3028',X,y);P(x,ramp(o.base)[1],0,H-7,W,1);}
    else T2.plinth(x,W,H,o.kind==='board'?'#8a8278':'#b8a88c');
    T2.eave(x,W);
    (o.items||[]).forEach(it=>{const X=Math.round(it.x*W-it.w/2);
      if(it.t==='win'){T2.win(x,X,it.y,it.w,it.h,{kind:it.kind,lit,box:it.box,frame:o.frame,room:it.room!=null?it.room:(o.seed+X)%5,shutter:it.shutter,lintel:it.lintel,wall:o.base});if(it.lead&&!lit)lead(x,X,it.y,it.w);}
      else if(it.t==='door')T2.door(x,X,H-it.h-3,it.w,it.h,{col:o.door,frame:o.frame,lit,n:it.n,hinge:it.hinge,lamp:it.lamp!==false,fan:it.fan,step:it.step});
      else if(it.t==='garage')garage(x,X,H-it.h-1,it.w,it.h,o.garage||'#e8e4dc');
      else if(it.t==='pipe')T2.pipe(x,X,3,H-2,o.frame);
      else if(it.t==='vent')T2.vent(x,X,H-11);
      else if(it.t==='meter')meter(x,X,it.y);});
    return c;}
  // a hip roof (four planes, equal pitch) as one geometry; the texture rows run along the eaves, ridge cap at the top
  function hipGeo(Wo,Do,rise){const sw=Do>Wo;if(sw){const t=Wo;Wo=Do;Do=t;}const a=(Wo-Do)/2,L=Wo,hw=Wo/2,hd=Do/2;const pos=[],uv=[];
    const tri=(p,q)=>{for(let i=0;i<3;i++){pos.push(...p[i]);uv.push(...q[i]);}};
    const E1=[-hw,0,hd],E2=[hw,0,hd],E3=[hw,0,-hd],E4=[-hw,0,-hd],R1=[-a,rise,0],R2=[a,rise,0];
    // front and back trapezoids
    tri([E1,E2,R2],[[0,0],[Wo/L,0],[(hw+a)/L,1]]);tri([E1,R2,R1],[[0,0],[(hw+a)/L,1],[(hw-a)/L,1]]);
    tri([E3,E4,R1],[[0,0],[Wo/L,0],[(hw+a)/L,1]]);tri([E3,R1,R2],[[0,0],[(hw+a)/L,1],[(hw-a)/L,1]]);
    // hip ends
    tri([E2,E3,R2],[[0,0],[Do/L,0],[hd/L,1]]);tri([E4,E1,R1],[[0,0],[Do/L,0],[hd/L,1]]);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();
    if(sw)g.rotateY(Math.PI/2);return{g,a,run:hd,sl:Math.hypot(hd,rise),L,sw};}
  // solar panel and plain pixel textures
  function solar(){const[c,x]=T2.cv(16,26);P(x,'#c8ccd0',0,0,16,26);P(x,'#1d2b48',1,1,14,24);for(let y=1;y<25;y+=4)for(let X=1;X<15;X+=4){P(x,'#2a3e66',X,y,3,3);P(x,'#3e5a8a',X,y,3,1);}P(x,'#8ab0e0',2,2,4,1);P(x,'#5a7ab0',2,3,2,1);return c;}
  function slats(w,h,base){const[c,x]=cvm(w,h);const r=ramp(base);for(let y=0;y<c.height;y++)P(x,y%3===0?r[5]:y%3===1?r[3]:r[1],0,y,c.width,1);P(x,r[0],0,c.height-1,c.width,1);return c;}
  function halfTimber(w,h,base,timber){const[c,x]=cvm(w,h);const W=c.width,H=c.height;T2.render(x,W,H,base);const t=ramp(timber),r=ramp('#f6f2e8');
    for(let X=3;X<W-2;X+=6){P(x,t[2],X,0,2,H);P(x,t[4],X,0,1,H);}P(x,t[1],0,H-4,W,4);P(x,t[3],0,H-4,W,1);
    for(let y=0;y<H;y++){const half=(W/2)*(y/H);P(x,r[3],W/2-half-2|0,y,4,1);P(x,r[5],W/2-half-2|0,y,1,1);P(x,r[3],W/2+half-2|0,y,4,1);P(x,r[1],W/2+half+1|0,y,1,1);}
    const vx=W/2|0,vy=H*.42|0;P(x,INK,vx-4,vy-2,8,5);for(let i=0;i<6;i+=2)P(x,'#5a4a3a',vx-3+i,vy-1,1,3);P(x,r[5],vx-4,vy-2,8,1);return c;}
  // Perth palettes (no brand names): face bricks, tile and sheet roofs, painted boards
  const BRICK=['#b8603e','#c8875a','#d8b48a','#9a4a36','#c49a6a','#b07050'],TILE=['#b8562e','#5a5e66','#7a4a3a','#4e6070','#a84a2a','#8a5a46'],
    TIN=['#a8acb0','#3e6a52','#8a3a2e','#2f5a7a','#6a7a5a','#c8ccd0','#5a4a7a'],BOARD=['#efe3c4','#b9c8a8','#b8d4d8','#f2dc96','#e8e4d8','#c8d0e0','#f0c8a0','#e0cce0'],
    FED=['#a84a32','#9a4430','#b0583c'],FDOOR=['#2c4a3a','#8a2a2a','#1d3a6e','#5a3a22','#2f6a74'];
  return{cvm,face,hipGeo,solar,slats,halfTimber,garage,BRICK,TILE,TIN,BOARD,FED,FDOOR};})();

