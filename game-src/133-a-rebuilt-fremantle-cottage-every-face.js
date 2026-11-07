/* ---------- a rebuilt Fremantle cottage: every face painted, bullnose verandah, lace, tiles, fence, gate, path, mat ---------- */
function t2Cottage(G,hx,z,face,o){const W=1.7,D=2.6,H=1.45,fz=z+face*D/2;T2.seed(o.seed);const R=T2.rnd;
  const base=T2.WALLS[(o.seed*5+3)%T2.WALLS.length],trim=T2.TRIMS[(o.seed*3)%T2.TRIMS.length],dcol=T2.DOORS[(o.seed*7)%T2.DOORS.length];const kind=['board','board','stone','brick','render'][o.seed%5];
  const trimC=T2.lum(trim)<.4&&T2.lum(base)<.5?'#f6f2e8':trim;
  // front: door on the outer side of each pair, a sash window with a flower box, number, lantern
  const front=lit=>{T2.seed(o.seed);const Wp=Math.round(W*32),Hp=Math.round(H*32);const[c,x]=T2.cv(Wp,Hp);T2.surface(x,Wp,Hp,base,kind);T2.eave(x,Wp);T2.plinth(x,Wp,Hp,kind==='stone'?T2.sh(base,.85):'#c8bca4');
    const dl=o.hinge;const dx=dl?Wp-18:4;T2.door(x,dx,Hp-34,14,31,{col:dcol,frame:trimC,lit,n:o.num,hinge:dl,lamp:false,step:true});
    const wx=dl?6:Wp-24;T2.win(x,wx,12,17,18,{kind:'sash',lit,box:true,frame:trimC,room:o.seed%5,shutter:o.seed%4===0?T2.pick(['#2f5a46','#6a2a2a','#1d3a6e']):null});
    T2.num(x,dl?dx-11:dx+16,Hp-30,o.num,'#f4ecd8');if(o.left&&!dl)T2.pipe(x,1,3,Hp-2,trimC);if(o.right&&dl)T2.pipe(x,Wp-4,3,Hp-2,trimC);return c;};
  const back=lit=>{T2.seed(o.seed+1);const Wp=Math.round(W*32),Hp=Math.round(H*32);const[c,x]=T2.cv(Wp,Hp);T2.surface(x,Wp,Hp,mix2(base),kind==='stone'?'stone':'board');T2.eave(x,Wp);T2.plinth(x,Wp,Hp,'#b8a88c');
    T2.win(x,o.hinge?8:Wp-20,12,12,12,{kind:'case',lit,frame:'#f6f2e8',room:(o.seed+2)%5,lintel:false});T2.door(x,o.hinge?Wp-17:5,Hp-30,12,27,{col:T2.sh(dcol,1.1),frame:'#f6f2e8',lit,fan:false,lamp:false,hinge:!o.hinge});
    // a meter box and a tap
    T2.P(x,T2.INK,o.hinge?2:Wp-8,Hp-26,6,8);T2.P(x,'#d8d4c8',o.hinge?3:Wp-7,Hp-25,4,6);T2.P(x,'#3a3e48',o.hinge?4:Wp-6,Hp-23,2,2);T2.P(x,'#c8a040',o.hinge?4:Wp-6,Hp-10,2,2);return c;};
  const side=lit=>{T2.seed(o.seed+2);const Wp=Math.round(D*32),Hp=Math.round(H*32);const[c,x]=T2.cv(Wp,Hp);T2.surface(x,Wp,Hp,base,kind);T2.eave(x,Wp);T2.plinth(x,Wp,Hp,'#c8bca4');T2.win(x,(Wp>>1)-6,12,12,15,{kind:'sash',lit,frame:trimC,room:(o.seed+4)%5});T2.pipe(x,4,3,Hp-2,trimC);T2.vent(x,Wp-16,Hp-11);T2.vent(x,14,Hp-11);return c;};
  function mix2(b){return T2.mix(b,'#e8e0d0',.25);}
  const fm=t2Lit(front(false),front(true)),bm=t2Lit(back(false),back(true));
  const sm=(o.left||o.right)?t2Lit(side(false),side(true)):t2Col('party|'+base,T2.sh(base,.9));const top=t2Col('top|'+base,T2.sh(base,.7));
  const mats=face>0?[o.right?sm:top,o.left?sm:top,top,top,fm,bm]:[o.right?sm:top,o.left?sm:top,top,top,bm,fm];
  const body=new THREE.Mesh(new THREE.BoxGeometry(W,H,D),mats);body.position.set(hx,H/2,z);add(body);
  // the front face of a -1 row looks north: the texture order above already swaps front/back; mirror the side lists for it
  // gable roof: two sloped slabs (ridge cap at the top of each texture, gutter at the bottom), corrugated tin or tiles
  const rk=o.seed%4===1?'tile':'tin',rb=rk==='tile'?T2.ROOFS.tile[o.seed%5]:T2.ROOFS.tin[(o.seed*3)%8],ov=.14,run=D/2+ov,rise=.85,sl=Math.hypot(run,rise),pitch=Math.atan2(rise,run);
  const rm=t2Mat('cr|'+rk+'|'+rb+'|'+(o.seed%3),()=>T2.roof(W+.02,sl,{base:rb,kind:rk,ridge:true,gutter:true,seed:o.seed%3+1,vent:o.seed%3===0}));const edge=t2Col('re|'+rb,T2.sh(rb,.55));
  [1,-1].forEach(s=>{const g=new THREE.Group();g.position.set(hx,H-.05,z);g.rotation.y=s>0?0:Math.PI;const m=new THREE.Mesh(new THREE.BoxGeometry(W+.02,.04,sl),[edge,edge,rm,edge,edge,edge]);m.rotation.x=pitch;
    // place the slab so its low edge sits at the eave (z = +run) and its high edge at the ridge (z = 0)
    m.position.set(0,rise/2+.02,run/2);g.add(m);
    const gut=new THREE.Mesh(new THREE.BoxGeometry(W+.04,.06,.07),t2Col('gut',  '#e8e4d8'));gut.position.set(0,.0,run+.01);g.add(gut);G.add(g);g.traverse(q=>{if(q.isMesh){q.castShadow=q.receiveShadow=true;q.__pxSkip=1;}});});
  // exposed ends get a painted gable triangle with a vent and bargeboards
  [[o.left,-1],[o.right,1]].forEach(([on,s])=>{if(!on)return;const gw=D+2*ov,gh=rise;const geo=new THREE.BufferGeometry();const X=hx+s*(W/2+.001);
    geo.setAttribute('position',new THREE.Float32BufferAttribute([X,H-.05,z-run, X,H-.05,z+run, X,H+gh-.05,z],3));geo.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));geo.computeVertexNormals();
    const gm=t2Mat('gab|'+base+'|'+trimC,()=>T2.gable(gw,gh,base,{trim:trimC,seed:o.seed}),{side:THREE.DoubleSide});add(new THREE.Mesh(geo,gm));});
  // chimney on the party wall of every other cottage, two pots
  if(o.seed%2===0){const cxp=hx+(o.hinge?-1:1)*(W/2-.18),c=new THREE.Mesh(new THREE.BoxGeometry(.24,.62,.24),t2Mat('chim',()=>T2.chimney(.24,.62,'#a8583e')));c.position.set(cxp,H+.62,z-face*.35);add(c);
    [-.05,.05].forEach(d=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.1,6),t2Col('pot','#c8643a'));p.position.set(cxp+d,H+.98,z-face*.35);add(p);});}
  // bullnose verandah: a flat run and a curved lip, striped tin, posts with brackets, lace frieze, tiled floor
  const vd=.95,vz=fz+face*vd/2,stp=[['#2f5a46','#f2e6c8'],['#8a2a2a','#f2e6c8'],['#1d3a6e','#f6f2e8'],['#c8ccd0','#9aa0a6'],['#3d7a78','#f4ecd8']][o.seed%5];
  const vm=t2Mat('ver|'+stp[0],()=>T2.stripes(W,vd,stp[0],stp[1]));const ve=t2Col('ve|'+stp[0],T2.sh(stp[0],.6));
  const v1=new THREE.Mesh(new THREE.BoxGeometry(W-.02,.04,vd*.62),[ve,ve,vm,ve,ve,ve]);v1.position.set(hx,1.12,fz+face*vd*.31);v1.rotation.x=face*.12;add(v1);
  const v2=new THREE.Mesh(new THREE.BoxGeometry(W-.02,.04,vd*.42),[ve,ve,vm,ve,ve,ve]);v2.position.set(hx,1.0,fz+face*vd*.8);v2.rotation.x=face*.55;add(v2);
  const postM=t2Col('post|'+trimC,T2.lum(trimC)>.6?'#f6f2e8':trimC);[-W/2+.1,W/2-.1].forEach(dx=>{const p=new THREE.Mesh(new THREE.BoxGeometry(.05,.96,.05),postM);p.position.set(hx+dx,.48,fz+face*.9);add(p);
    const br=new THREE.Mesh(new THREE.BoxGeometry(.18,.05,.04),postM);br.position.set(hx+dx-Math.sign(dx)*.08,.86,fz+face*.9);br.rotation.z=Math.sign(dx)*.5;add(br);});
  const lm=t2Mat('lace|'+trimC,()=>T2.lace(W-.2,.16,T2.lum(trimC)>.6?'#f6f6f2':trimC),{transparent:false,alphaTest:.5,side:THREE.DoubleSide});const lc=new THREE.Mesh(new THREE.PlaneGeometry(W-.2,.16),lm);lc.position.set(hx,.86,fz+face*.91);if(face<0)lc.rotation.y=Math.PI;add(lc);
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(W-.04,vd-.05),t2Mat('tiles',()=>T2.tiles(W-.04,vd-.05)));fl.rotation.x=-Math.PI/2;fl.position.set(hx,.035,fz+face*vd/2);add(fl,true);
  const ds=(o.hinge?1:-1)*(face>0?1:-1),dxm=ds*(W/2-.36);const mt=new THREE.Mesh(new THREE.PlaneGeometry(.34,.18),t2Mat('mat|'+(o.seed%4),()=>{T2.seed(o.seed);return T2.mat(.34,.18);}));mt.rotation.x=-Math.PI/2;mt.position.set(hx+dxm,.04,fz+face*.14);add(mt,true);
  // front path to a gate in the picket fence, a letterbox on the fence
  const gz=fz+face*1.88;const pv=new THREE.Mesh(new THREE.PlaneGeometry(.42,.95),t2Mat('path',()=>T2.pave(.42,.95)));pv.rotation.x=-Math.PI/2;pv.position.set(hx+dxm,.034,fz+face*1.4);add(pv,true);
  t2Fence(G,hx-W/2+.05,hx+W/2-.05,gz,[hx+dxm-.24,hx+dxm+.24]);
  const lb=new THREE.Mesh(new THREE.BoxGeometry(.16,.14,.12),t2Col('lb|'+dcol,dcol));lb.position.set(hx+dxm-ds*.36,.42,gz);add(lb);const lp=new THREE.Mesh(new THREE.BoxGeometry(.05,.36,.05),t2Col('lbp','#6a4028'));lp.position.set(lb.position.x,.18,gz);add(lp);
  function add(m,flat){m.castShadow=!flat;m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;}}
// a picket fence from x1 to x2 at z, with an opening [g1,g2] for a gate
function t2Fence(G,x1,x2,z,gap){const m=t2Col('picket','#f6f6f2');for(let x=x1;x<=x2+.001;x+=.19){if(gap&&x>gap[0]&&x<gap[1])continue;const p=new THREE.Mesh(new THREE.BoxGeometry(.035,.36,.035),m);p.position.set(x,.18,z);p.castShadow=true;p.__pxSkip=1;G.add(p);}
  const segs=gap?[[x1,gap[0]],[gap[1],x2]]:[[x1,x2]];segs.forEach(([a,b])=>{if(b-a<.05)return;const r=new THREE.Mesh(new THREE.BoxGeometry(b-a,.04,.04),m);r.position.set((a+b)/2,.3,z);r.__pxSkip=1;G.add(r);});}
// a plant sprite the plant look already repainted: the nearest street tree (tall) or bush (low) in the same town
function t2Like(x,z,tall,k){const V=new THREE.Vector3();let best=null,bd=1e9;for(const o of BB){if(!o.isMesh||(o.userData&&o.userData.frames)||!o.geometry||!o.geometry.parameters||o.geometry.type!=='PlaneGeometry'||!o.material||!o.material.map||(typeof SIGN_TEX!=='undefined'&&SIGN_TEX.has(o.material.map)))continue;
    const h=o.geometry.parameters.height*Math.abs(o.scale.y);if(tall?(h<2||h>6):(h<.35||h>1.3))continue;o.getWorldPosition(V);scene.worldToLocal(V);const d=Math.hypot(V.x-x,V.z-z)+((o.id*7+k*13)%5);if(d<bd&&d<60){bd=d;best=o;}}return best;}
// the gap where a house was: a little garden (tree + flower bed, bench + bushes, veggie patch + tank, or a side path with a bike)
function t2Garden(G,x,z,w,kind,zone,face,rz){T2.seed((x*13|0)+kind);const add=(m,flat)=>{m.castShadow=!flat;m.receiveShadow=true;m.__pxSkip=1;G.add(m);return m;};
  const bb=(tall,X,Z,s)=>{const src=t2Like(X,Z,tall,kind);if(!src)return null;const p=src.geometry.parameters,ww=p.width*Math.abs(src.scale.x)*s,hh=p.height*Math.abs(src.scale.y)*s;const g=new THREE.PlaneGeometry(ww,hh);g.translate(0,hh/2,0);
    const m=new THREE.Mesh(g,src.material);if(src.customDepthMaterial)m.customDepthMaterial=src.customDepthMaterial;m.castShadow=true;m.receiveShadow=true;m.position.set(X,0,Z);G.add(m);BB.push(m);
    try{const tr=trees.find(t=>t.m===src);if(tr)trees.push(Object.assign({},tr,{x:X,z:Z,m,fade:false}));}catch(e){}return m;};
  const lawn=new THREE.Mesh(new THREE.PlaneGeometry(w-.1,zone==='freo'?4.3:2.4),t2Mat('lawn',()=>{const[c,x]=T2.cv(48,48);const r=T2.ramp('#6e9446');T2.P(x,r[3],0,0,48,48);for(let i=0;i<420;i++)T2.P(x,T2.rnd()<.55?r[2]:T2.mix(r[3],r[4],.5),T2.rnd()*48,T2.rnd()*48,1,T2.rnd()<.3?2:1);for(let i=0;i<10;i++)T2.P(x,['#f4d04a','#f8f8f0','#e05a6a'][i%3],T2.rnd()*48,T2.rnd()*48);return c;}));
  lawn.rotation.x=-Math.PI/2;const cz=zone==='freo'?rz+face*.94:z;lawn.position.set(x,.036,cz);add(lawn,true);
  const bush=(X,Z,s)=>bb(false,X,Z,s);
  if(kind===0){bb(true,x,cz,zone==='freo'?.62:.8);const fb=new THREE.Mesh(new THREE.BoxGeometry(w*.7,.12,.4),t2Mat('bed',()=>T2.veg(1.2,.4)));fb.position.set(x,.06,cz+(face||1)*.9);add(fb);}
  else if(kind===1){const bz=zone==='freo'?cz+(face||1)*1.1:z+.4;const seat=new THREE.Mesh(new THREE.BoxGeometry(1,.06,.3),t2Mat('bench',()=>T2.wood(1,.3)));seat.position.set(x,.32,bz);add(seat);const bk=new THREE.Mesh(new THREE.BoxGeometry(1,.26,.05),t2Mat('bench',()=>T2.wood(1,.3)));bk.position.set(x,.5,bz-(face||1)*.14);add(bk);
    [-.42,.42].forEach(d=>{const l=new THREE.Mesh(new THREE.BoxGeometry(.06,.3,.28),t2Col('iron','#2a2230'));l.position.set(x+d,.15,bz);add(l);});col(x-.5,bz-.18,x+.5,bz+.18);bush(x-w*.3,cz-(face||1)*.6,.55);bush(x+w*.3,cz-(face||1)*.5,.5);if(zone!=='freo')bb(true,x+.9,z-.6,.7);}
  else if(kind===2){const vp=new THREE.Mesh(new THREE.BoxGeometry(w*.75,.16,1.2),t2Mat('veg',()=>T2.veg(1.2,1.2)));vp.position.set(x,.08,cz);add(vp);
    const tk=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.8,10),t2Mat('tank',()=>T2.tank(2,.8)));tk.position.set(x+(w/2-.42)*((x|0)%2?1:-1),.4,cz-(face||1)*.9);add(tk);const tl=new THREE.Mesh(new THREE.CylinderGeometry(.33,.33,.04,10),t2Col('tankl','#c8ccd0'));tl.position.set(tk.position.x,.82,tk.position.z);add(tl);}
  else{const pv=new THREE.Mesh(new THREE.PlaneGeometry(.5,zone==='freo'?3.4:2),t2Mat('path',()=>T2.pave(.42,.95)));pv.rotation.x=-Math.PI/2;pv.position.set(x,.034,cz);add(pv,true);bush(x-.55,cz,.5);bush(x+.55,cz+.4,.45);bb(true,x+.5,cz-(face||1)*1.1,zone==='freo'?.5:.7);}
  if(zone==='freo'){const gz=rz+face*(1.3+1.88);t2Fence(G,x-w/2+.05,x+w/2-.05,gz,kind===3?[x-.3,x+.3]:null);}}
