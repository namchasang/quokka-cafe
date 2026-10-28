// ===== Perth Station (pixel look): the 1890s front in red brick with cream rendered bands and quoins, tall arched windows
// with keystones, a central gabled clock tower whose clock shows the game time, corner pavilions with pediments, a bullnose
// verandah on cast-iron posts with lace, lamps that glow at night, slate roofs with iron cresting and finials.
// Same footprint (x 665..689, z -25.7..-22.7), same entrance (centre, x 677), no new colliders. Lives in the station's
// see-through group (CBD.cut); the verandah has its own see-through entry so only it fades when Kip stands under it.
function pxbBuild_perthstn(){
  if(typeof CBD==='undefined'||!CBD.cut||typeof PXK==='undefined')return;
  const host=CBD.cut.find(e=>Math.abs(e.g.position.x-677)<.05&&Math.abs(e.g.position.z+24.2)<.05);if(!host)return;
  const HG=host.g,OX=677,OZ=-24.2;
  // ---- hide the old station: its own box, parapet, sign and verandah, then the REF front painted over it ----
  HG.children.slice().forEach(o=>{o.visible=false;});
  {const sx=scene.scale.x;scene.scale.x=1;scene.updateMatrixWorld(true);const bx=new THREE.Box3(),c=new THREE.Vector3(),cut=new Set();CBD.cut.forEach(e=>e.g.traverse(o=>cut.add(o)));const bb=new Set(typeof BB!=='undefined'?BB:[]);const hid=[];
    scene.traverse(o=>{if(!o.isMesh||cut.has(o)||bb.has(o)||o.userData.frames)return;bx.setFromObject(o);if(bx.isEmpty())return;bx.getCenter(c);
      if(c.x<664.6||c.x>689.4||c.z<-23.05||c.z>-20.6||bx.max.y<.6)return;if(c.x>669.8&&c.x<672.2&&bx.min.y>2.5)return;// keep the glass footbridge
      if(bx.max.x-bx.min.x>40)return;hid.push(o);});
    hid.forEach(o=>o.visible=false);scene.scale.x=sx;scene.updateMatrixWorld(true);pxbBuild_perthstn.hid=hid.length;}
  // ---- palette and helpers ----
  const BR='#9a4632',CR='#efe2c0',IRON='#2e3a48',SLATE='#59626e',INK='#2a2230';const P=PXK.P,sh=PXK.sh;
  const T=c=>ctex(c);const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(c)},o||{}));const CM=c=>new THREE.MeshLambertMaterial({color:new THREE.Color(c)});
  const glows=[];// [mesh, original material(s)] so a see-through clone keeps glowing
  const litMat=(paint,dim)=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(PXK.glowDiff(a,b))});if(dim)m.__dim=dim;PXB_GLOW.push(m);return m;};
  const keepGlow=(m)=>{const orig=m.material;m.onBeforeRender=function(){const cur=this.material;if(cur===orig)return;if(Array.isArray(cur)){for(let i=0;i<cur.length;i++)if(orig[i]&&orig[i].emissiveMap&&cur[i].emissiveIntensity!==orig[i].emissiveIntensity)cur[i].emissiveIntensity=orig[i].emissiveIntensity;}
    else if(orig.emissiveMap&&cur.emissiveIntensity!==orig.emissiveIntensity)cur.emissiveIntensity=orig.emissiveIntensity;};};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||8);
  const add=(par,geo,mat,x,y,z,o)=>{o=o||{};const m=new THREE.Mesh(geo,mat);m.position.set(x-OX,y,z-OZ);if(o.rx)m.rotation.x=o.rx;if(o.ry)m.rotation.y=o.ry;if(o.rz)m.rotation.z=o.rz;m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;par.add(m);
    if(Array.isArray(mat)?mat.some(q=>q&&q.emissiveMap):mat&&mat.emissiveMap)keepGlow(m);return m;};
  const put=(geo,mat,x,y,z,o)=>add(HG,geo,mat,x,y,z,o);
  // a lantern: iron base, four corner bars, a warm glass box (PXB_LAMPS turns it warm at night) and a pyramid cap
  const lantern=(par,x,y,z,s)=>{s=s||1;const k=CM('#2a2a30');add(par,B(.24*s,.04*s,.24*s),k,x,y-.13*s,z,{nc:1});[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([a,b])=>add(par,B(.03*s,.24*s,.03*s),k,x+a*.095*s,y,z+b*.095*s,{nc:1}));
    const l=add(par,B(.17*s,.22*s,.17*s),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,y,z,{nc:1});PXB_LAMPS.push(l);add(par,new THREE.ConeGeometry(.19*s,.15*s,4),k,x,y+.19*s,z,{ry:Math.PI/4,nc:1});return l;};
  const VG=new THREE.Group();VG.position.copy(HG.position);scene.add(VG);const vput=(geo,mat,x,y,z,o)=>add(VG,geo,mat,x,y,z,o);
  // ---- pixel painters ----
  const quoinCol=(x,X,y0,y1,left)=>{for(let y=y0,k=0;y<y1;y+=7,k++){const w=k%2?5:8,xx=left?X:X-w,hh=Math.min(7,y1-y);P(x,sh(CR,.55),xx,y,w,hh);P(x,sh(CR,k%2?.98:1.04),xx,y,w,hh-1);P(x,sh(CR,1.14),xx,y,w,1);}};
  const band=(x,X,Y,W,h)=>{P(x,sh(CR,1.1),X,Y,W,1);P(x,CR,X,Y+1,W,h-2);P(x,sh(CR,.7),X,Y+h-1,W,1);P(x,'rgba(0,0,0,.22)',X,Y+h,W,1);};
  const dentils=(x,X,Y,W)=>{P(x,sh(CR,.92),X,Y,W,5);P(x,sh(CR,1.12),X,Y,W,1);for(let k=X+1;k<X+W-2;k+=4){P(x,sh(CR,.62),k+2,Y+2,1,3);}P(x,INK,X,Y+5,W,1);};
  const plinthR=(x,W,H,h)=>{const y0=H-h;P(x,sh(CR,.62),0,y0,W,h);for(let X=0,r=0;X<W;X+=12,r++){P(x,sh(CR,.82+((X*7)%5)*.03),X+1,y0+1,11,h-2);P(x,sh(CR,.95),X+1,y0+1,11,1);}P(x,sh(CR,1.12),0,y0,W,1);P(x,INK,0,H-1,W,1);};
  // a round-arched window: polychrome voussoirs, a keystone, glazing bars, fanlight rays, a sill
  const archWin=(x,cx,Y,w,h,lit,o)=>{o=o||{};const r=w/2;const glass=lit?['#fff0b8','#ffd070','#f4a040','#e08a34']:['#a8c8e0','#86a8c2','#6a8aa6','#46627e'];const g0=Y-r-1,gh=h+r+1;
    for(let py=Math.floor(Y-r-6);py<Y;py++)for(let px=Math.floor(cx-r-6);px<cx+r+6;px++){const d=Math.hypot(px+.5-cx,py+.5-Y);
      if(d<=r){const t=(py-g0)/gh;P(x,glass[Math.min(3,t*4|0)],px,py);}
      else if(d<=r+1)P(x,sh(CR,.8),px,py);
      else if(d<=r+4){const a=Math.atan2(Y-py-.5,px+.5-cx);P(x,(Math.floor(a/(Math.PI/9))%2)?sh(CR,1.02):sh(CR,.86),px,py);if(d>r+3.3)P(x,sh(CR,1.12),px,py);}
      else if(d<=r+5)P(x,'rgba(42,34,48,.85)',px,py);}
    for(let j=0;j<h;j++)P(x,glass[Math.min(3,((j+r+1)/gh*4)|0)],cx-r,Y+j,w,1);
    P(x,INK,cx-r-2,Y,1,h+1);P(x,INK,cx+r+1,Y,1,h+1);P(x,sh(CR,1.05),cx-r-1,Y,1,h);P(x,sh(CR,.75),cx+r,Y,1,h);
    // glazing: centre bar, transom, rays in the fanlight
    const bar=lit?'#8a5a2a':'#e8dcc0',bs=lit?'#6a3a1a':'#b8ac90';P(x,bar,cx-.5,Y,1,h);P(x,bs,cx+.5,Y,1,h);const ty=Y+Math.round(h*.42);P(x,bar,cx-r,ty,w,1);P(x,bs,cx-r,ty+1,w,1);P(x,bar,cx-r,Y,w,1);
    if(h>20)P(x,bar,cx-r,Y+Math.round(h*.72),w,1);
    for(const a of[.5,1.05,1.6,2.1,2.65])for(let k=2;k<r;k++)P(x,bar,cx+Math.cos(a)*k-.5,Y-Math.sin(a)*k-.5);
    if(!lit)for(let k=0;k<Math.min(w,h)*.7;k++){P(x,'#e8f4fc',cx-r+1+k,Y+h*.6-k);if(k%2===0)P(x,'#d0e6f4',cx-r+4+k,Y+h*.6-k);}
    // keystone and sill
    const ky=Y-r-6;P(x,INK,cx-4,ky-1,8,8);P(x,sh(CR,1.06),cx-3,ky,6,7);P(x,sh(CR,1.2),cx-3,ky,6,1);P(x,sh(CR,.78),cx+2,ky+1,1,6);P(x,sh(CR,.8),cx-2,ky+6,4,1);
    if(o.sill!==false){P(x,sh(CR,.9),cx-r-3,Y+h,w+6,3);P(x,sh(CR,1.15),cx-r-3,Y+h,w+6,1);P(x,INK,cx-r-3,Y+h+3,w+6,1);P(x,'rgba(0,0,0,.2)',cx-r-2,Y+h+4,w+4,1);}};
  // the station doors: two leaves of panelled timber with glazed tops under an arched fanlight
  const bigDoor=(x,cx,Y,w,h,lit)=>{const r=w/2;archWin(x,cx,Y,w,0,lit,{sill:false});P(x,INK,cx-r-2,Y,w+4,h+1);P(x,sh(CR,.95),cx-r-1,Y,w+2,h);
    const col='#2f5a46';[[cx-r,cx-1],[cx+1,cx+r]].forEach(([a,b])=>{const dw=b-a;P(x,sh(col,.6),a,Y+1,dw,h-1);P(x,col,a+1,Y+2,dw-2,h-3);P(x,sh(col,1.25),a+1,Y+2,dw-2,1);
      const gh=Math.round(h*.45);const gl=lit?['#fff0b8','#ffd070','#f4a040']:['#a8c8e0','#86a8c2','#6a8aa6'];for(let j=0;j<gh;j++)P(x,gl[Math.min(2,j/gh*3|0)],a+3,Y+4+j,dw-6,1);P(x,sh(col,.7),a+3+(dw-6>>1),Y+4,1,gh);
      P(x,sh(col,1.2),a+3,Y+gh+7,dw-6,1);P(x,sh(col,.55),a+3,Y+h-6,dw-6,1);P(x,sh(col,.5),a+3,Y+gh+7,1,h-gh-13);P(x,'#e2b04a',b===cx-1?b-2:a+1,Y+(h>>1)+3,1,2);});
    P(x,'#b8a888',cx-r-4,Y+h,w+8,2);P(x,INK,cx-r-4,Y+h+2,w+8,1);};
  // a little wall lantern painted in (the 3D lanterns do the real glowing)
  // ---- the main block: front, sides, back ----
  const FW=24,FH=4.45,W=768,H=Math.round(FH*32);// 142 px; top 8 px sit behind the cornice
  const Y0=8,SC=Y0+62,PL=10;// string course row, plinth height
  const bays=[0,102,307,461,666,768];
  function paintFront(lit){PXK.seed(901);const[c,x]=PXK.cv(W,H);PXK.bricks(x,W,H,BR);
    dentils(x,0,Y0-6,W);band(x,0,Y0,W,4);// frieze under the cornice
    band(x,0,SC,W,6);P(x,sh(CR,.86),0,SC+6,W,1);plinthR(x,W,H,PL);
    // polychrome brick: cream impost bands at the arch springing lines
    band(x,0,Y0+24,W,2);band(x,0,SC+22,W,2);
    // quoins at every bay edge
    bays.forEach((X,i)=>{if(i>0)quoinCol(x,X,Y0+4,H-PL,false);if(i<bays.length-1)quoinCol(x,X,Y0+4,H-PL,true);});
    // wings: four tall arched windows a floor, the odd one dark at night
    [[102,307],[461,666]].forEach(([a,b],wi)=>{const n=4,st=(b-a)/n;for(let i=0;i<n;i++){const cx=Math.round(a+st*(i+.5));archWin(x,cx,Y0+24,16,30,lit&&((i+wi*2)%5!==3));archWin(x,cx,SC+22,16,36,lit&&((i*3+wi)%4!==1));
      if(i<n-1){const px=Math.round(a+st*(i+1));P(x,sh(BR,.78),px-1,Y0+8,2,SC-Y0-10);P(x,sh(BR,.78),px-1,SC+10,2,H-PL-SC-12);}}});
    // pavilions: paired arches upstairs, a side door below with a lamp each side
    [51,717].forEach((cx,k)=>{archWin(x,cx-13,Y0+26,12,28,lit);archWin(x,cx+13,Y0+26,12,28,lit&&k===0);bigDoor(x,cx,SC+30,26,H-PL-SC-32,lit);});
    return c;}
  function paintSide(lit,k){PXK.seed(911+k);const w=96;const[c,x]=PXK.cv(w,H);PXK.bricks(x,w,H,BR);dentils(x,0,Y0-6,w);band(x,0,Y0,w,4);band(x,0,SC,w,6);plinthR(x,w,H,PL);band(x,0,Y0+24,w,2);band(x,0,SC+22,w,2);
    quoinCol(x,0,Y0+4,H-PL,true);quoinCol(x,w,Y0+4,H-PL,false);archWin(x,48,Y0+24,16,30,lit);archWin(x,48,SC+22,16,36,lit&&k===1);return c;}
  const backC=(()=>{const c=PXK.wall(FW,FH,{base:BR,kind:'brick',win:8,rows:2,arch:true,box:false,seed:921,trim:CR,moss:false});return c;})();
  const top=CM(sh(BR,.45));
  const frontM=litMat(paintFront),sideL=litMat(l=>paintSide(l,0)),sideR=litMat(l=>paintSide(l,1)),backM=LM(backC);
  put(B(FW,FH,3),[sideR,sideL,top,top,frontM,backM],677,FH/2,-24.2);
  // cornice, string course, and pilasters in 3D
  const cornC=(w,h)=>{const[c,x]=PXK.cv(Math.round(w*32),8);PXK.cornice(x,c.width,8,CR);return c;};
  const cornM=LM(cornC(24.4)),cornS=CM(sh(CR,.9));
  put(B(24.4,.26,.46),[cornS,cornS,CM(sh(CR,1.02)),cornS,cornM,cornM],677,FH-.12,-22.72);
  put(B(.46,.26,3.1),cornS,664.92,FH-.12,-24.2);put(B(.46,.26,3.1),cornS,689.08,FH-.12,-24.2);
  put(B(24.1,.1,.12),CM(CR),677,2.12,-22.64,{nc:1});
  const qC=(h)=>{const[c,x]=PXK.cv(8,Math.round(h*32));P(x,sh(CR,.55),0,0,8,c.height);for(let y=0,k=0;y<c.height;y+=7,k++){P(x,sh(CR,k%2?1:.93),0,y,8,6);P(x,sh(CR,1.1),0,y,8,1);}return c;};
  const qM=LM(qC(4.1)),qMT=LM(qC(7.1));
  [665.13,668.2,685.8,688.87].forEach(px=>put(B(.26,4.1,.12),qM,px,2.05,-22.66,{nc:1}));
  // ---- the clock tower (x 674.6..679.4) ----
  const TW=4.8,TH=7.2,TZ1=-22.6,TZ2=-25.3,TD=TZ1-TZ2,TCZ=(TZ1+TZ2)/2;const TWp=Math.round(TW*32),THp=Math.round(TH*32);const yp=m=>Math.round((TH-m)*32);
  function paintTower(lit){PXK.seed(931);const[c,x]=PXK.cv(TWp,THp);PXK.bricks(x,TWp,THp,BR);const cx=TWp>>1;
    // a corbel table under the top cornice
    P(x,sh(CR,.95),0,0,TWp,5);for(let k=2;k<TWp;k+=8){P(x,sh(CR,.9),k,5,4,3);P(x,INK,k,8,4,1);}
    band(x,0,yp(4.45),TWp,6);band(x,0,yp(2.26),TWp,6);P(x,sh(CR,.86),0,yp(2.26)+6,TWp,1);band(x,0,yp(3.75),TWp,2);band(x,0,yp(1.35),TWp,2);plinthR(x,TWp,THp,PL);
    quoinCol(x,0,8,THp-PL,true);quoinCol(x,TWp,8,THp-PL,false);
    // the clock stage: a cream roundel (the 3D clock sits on it), three narrow louvred lights below
    const ky=yp(5.75);for(let py=ky-28;py<=ky+28;py++)for(let px=cx-28;px<=cx+28;px++){const d=Math.hypot(px+.5-cx,py+.5-ky);if(d<=26&&d>23)P(x,(Math.floor(Math.atan2(py-ky,px-cx)/(Math.PI/12))%2)?sh(CR,1.02):sh(CR,.86),px,py);else if(d<=23)P(x,sh(CR,.9),px,py);else if(d<=27)P(x,INK,px,py);}
    [-16,0,16].forEach(o=>{const lx=cx+o-3,ly=yp(4.82);P(x,INK,lx-1,ly-1,8,14);P(x,'#3a2e28',lx,ly,6,12);for(let j=1;j<12;j+=3)P(x,sh(CR,.7),lx,ly+j,6,1);P(x,sh(CR,1.05),lx-1,ly-3,8,2);});
    // first floor: a three-light window, the centre one arched and taller
    archWin(x,cx,yp(3.75),22,28,lit);archWin(x,cx-30,yp(3.55),12,22,lit);archWin(x,cx+30,yp(3.55),12,22,lit);
    // ground floor: the grand entrance with two side lights
    bigDoor(x,cx,yp(1.4),40,yp(0)-PL-yp(1.4)-2,lit);archWin(x,cx-50,yp(1.5),14,26,lit);archWin(x,cx+50,yp(1.5),14,26,lit);
    return c;}
  function paintTowerSide(lit,k){PXK.seed(941+k);const w=Math.round(TD*32);const[c,x]=PXK.cv(w,THp);PXK.bricks(x,w,THp,BR);const cx=w>>1;
    P(x,sh(CR,.95),0,0,w,5);for(let q=2;q<w;q+=8){P(x,sh(CR,.9),q,5,4,3);P(x,INK,q,8,4,1);}band(x,0,yp(4.45),w,6);band(x,0,yp(2.26),w,6);plinthR(x,w,THp,PL);quoinCol(x,0,8,THp-PL,true);quoinCol(x,w,8,THp-PL,false);
    // a smaller painted clock and a louvred arch on each side
    const ky=yp(5.75);for(let py=ky-18;py<=ky+18;py++)for(let px=cx-18;px<=cx+18;px++){const d=Math.hypot(px+.5-cx,py+.5-ky);if(d<=13)P(x,lit?'#fff4d0':'#f6f0dc',px,py);else if(d<=16)P(x,sh(CR,.88),px,py);else if(d<=17)P(x,INK,px,py);}
    for(let a=0;a<12;a++){P(x,INK,cx+Math.cos(a*Math.PI/6)*11-.5,ky+Math.sin(a*Math.PI/6)*11-.5,1,1);}P(x,INK,cx-.5,ky-9,1,9);P(x,INK,cx,ky-.5,6,1);
    archWin(x,cx,yp(3.5),14,28,lit&&k===0);return c;}
  const towFront=litMat(paintTower),tsL=litMat(l=>paintTowerSide(l,0)),tsR=litMat(l=>paintTowerSide(l,1)),tTop=CM(sh(BR,.45));
  put(B(TW,TH,TD),[tsR,tsL,tTop,tTop,towFront,LM(PXK.wall(TW,TH,{base:BR,kind:'brick',win:1,rows:2,arch:true,box:false,seed:951,trim:CR,moss:false}))],677,TH/2,TCZ);
  [674.6,679.4].forEach(px=>put(B(.28,7.1,.14),qMT,px,3.55,TZ1+.05,{nc:1}));
  put(B(TW+.36,.3,TD+.36),[cornS,cornS,CM(sh(CR,1.02)),cornS,LM(cornC(TW+.36)),LM(cornC(TW+.36))],677,TH+.1,TCZ);
  // ---- gables (pediments) with a coped edge and an oculus, a slate roof behind, finials on top ----
  const gableGeo=(w,d,rise)=>{const hw=w/2,hd=d/2,pos=[],uv=[],idx=[];const quad=(a,b,c2,e)=>{const n=pos.length/3;pos.push(...a,...b,...c2,...e);uv.push(0,0,1,0,1,1,0,1);idx.push(n,n+1,n+2,n,n+2,n+3);};
    quad([-hw,0,hd],[hw,0,hd],[hw,rise,0],[-hw,rise,0]);quad([hw,0,-hd],[-hw,0,-hd],[-hw,rise,0],[hw,rise,0]);const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();return geo;};
  const slope=(span,rise)=>Math.hypot(span/2,rise);
  const triGeo=(w,h)=>{const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.closePath();const g=new THREE.ShapeGeometry(s);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)+w/2)/w,uv.getY(i)/h);return g;};
  const paintGable=(w,h,lit,oculus,seed)=>{PXK.seed(seed);const Wp=Math.round(w*32),Hp=Math.round(h*32);const[c,x]=PXK.cv(Wp,Hp);PXK.bricks(x,Wp,Hp,BR);
    // cream coping along both rakes and a cream base course
    for(let py=0;py<Hp;py++){const half=(Wp/2)*(py/Hp);for(let k=0;k<6;k++){P(x,k<1?INK:sh(CR,k===5?.8:1.02),Wp/2-half+k,py);P(x,k<1?INK:sh(CR,k===5?.8:.92),Wp/2+half-1-k,py);}}
    band(x,0,Hp-5,Wp,5);
    if(oculus){const cx=Wp/2,cy=Hp*.62,r=Math.min(Hp*.26,12);for(let py=cy-r-3|0;py<=cy+r+3;py++)for(let px=cx-r-3|0;px<=cx+r+3;px++){const d=Math.hypot(px+.5-cx,py+.5-cy);
      if(d<=r)P(x,lit?(((py|0)%3)?'#ffd070':'#c07a30'):(((py|0)%3)?'#3a2e28':sh(CR,.6)),px,py);else if(d<=r+2)P(x,sh(CR,(Math.floor(Math.atan2(py-cy,px-cx)/(Math.PI/6))%2)?1.04:.86),px,py);else if(d<=r+3)P(x,INK,px,py);}}
    return c;};
  const finial=(par,x,y,z,s)=>{s=s||1;const iron=CM('#2a2a30'),gold=CM('#e2b04a');add(par,B(.16*s,.14*s,.16*s),CM(CR),x,y+.07*s,z,{nc:1});add(par,C(.025*s,.04*s,.55*s,6),iron,x,y+.4*s,z,{nc:1});
    add(par,new THREE.SphereGeometry(.07*s,6,4),gold,x,y+.42*s,z,{nc:1});const sp=add(par,new THREE.ConeGeometry(.045*s,.22*s,4),iron,x,y+.76*s,z,{nc:1});return sp;};
  const pediment=(cx,w,h,y,zf,zb,lit,oc,seed)=>{const geo=triGeo(w,h);const fm=lit?litMat(l=>paintGable(w,h,l,oc,seed)):LM(paintGable(w,h,false,oc,seed));put(geo,fm,cx,y,zf+.005,{nc:1});
    put(triGeo(w,h),LM(paintGable(w,h,false,false,seed+1)),cx,y,zb-.005,{ry:Math.PI,nc:1});
    const ang=Math.atan2(h,w/2),L=Math.hypot(w/2,h)+.12;[-1,1].forEach(s=>{put(B(L,.14,.2),CM(sh(CR,1.02)),cx+s*w/4,y+h/2+.06,zf+.06,{rz:-s*ang,nc:1});
      // kneelers with ball finials at the feet of the gable
      put(B(.22,.2,.24),CM(CR),cx+s*(w/2+.02),y+.1,zf+.04,{nc:1});put(new THREE.SphereGeometry(.09,6,4),CM(sh(CR,1.05)),cx+s*(w/2+.02),y+.29,zf+.04,{nc:1});});
    finial(HG,cx,y+h+.02,zf+.02,1.2);
    const rm=LM(PXK.roof(Math.abs(zf-zb),slope(w,h),{base:SLATE,kind:'slate',seed}),{side:THREE.DoubleSide});const rg=gableGeo(Math.abs(zf-zb),w+.14,h);rg.rotateY(Math.PI/2);put(rg,rm,cx,y,(zf+zb)/2);
    put(B(.14,.12,Math.abs(zf-zb)),CM(sh(SLATE,.62)),cx,y+h+.02,(zf+zb)/2,{nc:1});};
  pediment(677,5.0,1.55,TH+.25,TZ1+.08,TZ2-.08,true,true,961);
  // the clock: a cream surround, a face that lights at night, iron hands that follow the game clock
  {const ck=new THREE.Group();ck.position.set(0,5.75,TZ1-OZ+.05);HG.add(ck);
    const sur=new THREE.Mesh(C(.7,.7,.1,20),CM(sh(CR,1.02)));sur.rotation.x=Math.PI/2;sur.__pxSkip=1;sur.castShadow=true;ck.add(sur);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(.6,.045,4,20),CM('#2a2a30'));rim.position.z=.06;rim.__pxSkip=1;ck.add(rim);
    const face=l=>{const[c,x]=PXK.cv(38,38);const cx=19,cy=19;for(let py=0;py<38;py++)for(let px=0;px<38;px++){const d=Math.hypot(px+.5-cx,py+.5-cy);if(d<=18.6)P(x,l?(d<14?'#fff6d8':'#ffe8a8'):(d<14?'#f8f4e6':'#ece4cc'),px,py);}
      for(let a=0;a<60;a++){const an=a*Math.PI/30,big=a%5===0,r1=big?13.5:15.5;for(let r=r1;r<=17;r+=.5)P(x,big?INK:'#7a7068',cx+Math.cos(an)*r-.5,cy+Math.sin(an)*r-.5);}
      P(x,'#c8a040',cx-1,cy-1,2,2);return c;};
    const fm=litMat(face,.75);const fc=new THREE.Mesh(new THREE.CircleGeometry(.57,24),fm);fc.position.z=.065;fc.__pxSkip=1;ck.add(fc);keepGlow(fc);
    const hand=(len,wid,col)=>{const g=new THREE.Group();const m=new THREE.Mesh(B(wid,len,.02),CM(col));m.position.y=len/2-.06;m.__pxSkip=1;g.add(m);g.position.z=.085;ck.add(g);return g;};
    const hh=hand(.32,.06,'#1c1c22'),mh=hand(.47,.04,'#1c1c22');const pin=new THREE.Mesh(C(.04,.04,.03,8),CM('#e2b04a'));pin.rotation.x=Math.PI/2;pin.position.z=.1;pin.__pxSkip=1;ck.add(pin);
    const prev=fc.onBeforeRender;fc.onBeforeRender=function(){prev.apply(this,arguments);const t=((typeof S!=='undefined'&&S.time!=null?S.time:720)%1440+1440)%1440;mh.rotation.z=-(t%60)/60*Math.PI*2;hh.rotation.z=-((t/60)%12)/12*Math.PI*2;};
    pxbBuild_perthstn.clock={hh,mh};
    // a little hood over the clock
    put(B(1.7,.1,.3),CM(sh(CR,1.02)),677,6.55,TZ1+.1,{nc:1});put(B(1.5,.08,.22),CM(sh(CR,.8)),677,6.48,TZ1+.08,{nc:1});}
  // ---- corner pavilions: an attic storey, a pediment, a slate roof, finials ----
  [[666.6,0],[687.4,1]].forEach(([cx,k])=>{const aw=3.2,ah=.9,ay=FH,zf=-22.7,zb=-25.6;
    const att=l=>{PXK.seed(971+k);const Wp=Math.round(aw*32),Hp=Math.round(ah*32);const[c,x]=PXK.cv(Wp,Hp);PXK.bricks(x,Wp,Hp,BR);band(x,0,0,Wp,3);band(x,0,Hp-4,Wp,4);quoinCol(x,0,3,Hp-4,true);quoinCol(x,Wp,3,Hp-4,false);
      // three little round-headed lights
      [-24,0,24].forEach(o=>archWin(x,Wp/2+o,10,8,10,l&&o!==24*(k?1:-1),{sill:false}));return c;};
    const am=litMat(att),as=LM(PXK.wall(3,ah,{base:BR,kind:'brick',win:0,plinth:false,cornice:false,moss:false,quoins:false,seed:981}));
    put(B(aw,ah,3),[as,as,top,top,am,as],cx,ay+ah/2,-24.2);
    put(B(aw+.3,.22,3.3),[cornS,cornS,CM(sh(CR,1.02)),cornS,LM(cornC(aw+.3)),LM(cornC(aw+.3))],cx,ay+ah+.05,-24.2);
    pediment(cx,3.3,1.0,ay+ah+.16,zf+.12,zb-.1,false,true,991+k);
    // a lantern on the pavilion's corner pilaster, next to its side door
    [-1,1].forEach(s=>{const lx=cx+s*.78;put(B(.05,.05,.3),CM('#2a2a30'),lx,1.98,-22.56,{nc:1});lantern(HG,lx,1.76,-22.4,.85);});});
  // ---- the long slate roof over both wings, with a ridge, iron cresting, dormers and chimneys ----
  {const RL=20.8,RD=3.1,RR=1.15,RY=FH+.02;const rg=gableGeo(RL,RD,RR);put(rg,LM(PXK.roof(RL,slope(RD,RR),{base:SLATE,kind:'slate',seed:1001}),{side:THREE.DoubleSide}),677,RY,-24.2);
    put(B(RL,.14,.22),CM(sh(SLATE,.62)),677,RY+RR+.02,-24.2,{nc:1});
    const crest=(()=>{const Wp=Math.round(RL*32),Hp=9;const[c,x]=PXK.cv(Wp,Hp);x.clearRect(0,0,Wp,Hp);P(x,'#2a2a30',0,Hp-2,Wp,2);
      for(let X=0;X<Wp;X+=8){P(x,'#2a2a30',X+3,1,2,Hp-2);P(x,'#2a2a30',X+1,3,6,1);P(x,'#2a2a30',X+2,2,1,1);P(x,'#2a2a30',X+5,2,1,1);P(x,'#e2b04a',X+3,0,2,1);}return c;})();
    put(new THREE.PlaneGeometry(RL,.28),new THREE.MeshLambertMaterial({map:T(crest),transparent:true,alphaTest:.5,side:THREE.DoubleSide}),677,RY+RR+.23,-24.2,{nc:1});
    // dormers with lit arched lights on the front slope
    [671.4,682.6].forEach((dx,k)=>{const dz=-23.35,dy=RY+.5;const dm=litMat(l=>{PXK.seed(1011+k);const[c,x]=PXK.cv(29,22);PXK.bricks(x,29,22,BR);quoinCol(x,0,0,22,true);quoinCol(x,29,0,22,false);archWin(x,14.5,9,10,10,l,{sill:false});return c;});
      const ds=CM(sh(BR,.8));put(B(.9,.7,.9),[ds,ds,top,top,dm,ds],dx,dy,dz-.2);const pg=gableGeo(1.0,1.06,.4);pg.rotateY(Math.PI/2);put(pg,LM(PXK.roof(1,slope(1.06,.4),{base:SLATE,kind:'slate',seed:1021})),dx,dy+.35,dz-.2);
      put(triGeo(.92,.36),CM(sh(CR,.95)),dx,dy+.35,dz+.255,{nc:1});finial(HG,dx,dy+.75,dz+.2,.6);});
    // chimneys with cream caps and pots
    [669.6,684.4].forEach(cx=>{const bm=LM((()=>{const[c,x]=PXK.cv(16,44);PXK.bricks(x,16,44,BR);band(x,0,30,16,2);return c;})());put(B(.5,1.4,.5),bm,cx,RY+RR+.2,-24.75);
      put(B(.66,.12,.66),CM(sh(CR,1.02)),cx,RY+RR+.95,-24.75,{nc:1});[-.1,.1].forEach(o=>put(C(.07,.08,.26,6),CM('#b8603a'),cx+o,RY+RR+1.12,-24.75,{nc:1}));});
    // finials at both ends of the ridge
    [677-RL/2+.15,677+RL/2-.15].forEach(fx=>finial(HG,fx,RY+RR+.08,-24.2,.9));}
  // ---- the verandah over the entrance: a bullnose iron roof on cast-iron posts with lace, the station's name on top ----
  {const X1=672.2,X2=681.8,VW=X2-X1,ZW=-22.62,ZF=-21.25,YB=2.86,YT=2.62,R=.36,PZ=-20.98;
    const stripe=(w,h,rot)=>{const Wp=Math.round(w*32),Hp=Math.max(4,Math.round(h*32));const[c,x]=PXK.cv(Wp,Hp);for(let X=0;X<Wp;X+=8){P(x,(X/8)%2?'#e8e0c8':'#3e6a5a',X,0,8,Hp);P(x,(X/8)%2?'#f6f0dc':'#4e7e6a',X,0,1,Hp);P(x,'rgba(0,0,0,.18)',X+7,0,1,Hp);}for(let y=0;y<Hp;y+=6)P(x,'rgba(0,0,0,.08)',0,y,Wp,1);return c;};
    const ceil=(()=>{const[c,x]=PXK.cv(Math.round(VW*32),44);for(let y=0;y<44;y+=4){P(x,'#e8dcc0',0,y,c.width,4);P(x,'#c8b898',0,y+3,c.width,1);}return c;})();
    const tin=LM(stripe(VW,1.4)),edge=CM('#3e6a5a');const dz=ZF-ZW,dy=YB-YT,L=Math.hypot(dz,dy);
    vput(B(VW,.05,L),[edge,edge,tin,LM(ceil),edge,edge],677,(YB+YT)/2,(ZW+ZF)/2,{rx:Math.atan2(dy,dz)});
    const bn=new THREE.CylinderGeometry(R,R,VW,10,1,true,0,Math.PI/2);bn.rotateZ(Math.PI/2);
    // after the turn the arc runs from the top (+y) to the front (+z); make it face the right way round
    const bm=vput(bn,new THREE.MeshLambertMaterial({map:T(stripe(VW,R*1.6)),side:THREE.DoubleSide}),677,YT-R,ZF);
    [-1,1].forEach(s=>{const cap=new THREE.Mesh(new THREE.CircleGeometry(R,8,0,Math.PI/2),new THREE.MeshLambertMaterial({color:'#2e4a40',side:THREE.DoubleSide}));cap.rotation.y=-Math.PI/2;cap.position.set(677+s*VW/2-OX,YT-R,ZF-OZ);cap.__pxSkip=1;VG.add(cap);});
    put(B(VW+.1,.12,.1),CM(IRON),677,YB+.02,ZW+.04,{nc:1});// a wall plate
    // posts: fluted iron columns with a base and a capital, lace brackets each side
    const iron=CM(IRON),ironL=CM(sh(IRON,1.4));const PX=[672.45,674.75,679.25,681.55];
    const brC=(()=>{const[c,x]=PXK.cv(14,14);x.clearRect(0,0,14,14);const I=IRON;for(let k=0;k<14;k++){P(x,I,k,0,1,2);P(x,I,13,k,1,1);}for(let k=0;k<13;k++)P(x,I,k,13-k,1,1);
      for(let a=0;a<6.3;a+=.35){P(x,I,9+Math.cos(a)*3,4+Math.sin(a)*3);P(x,I,4+Math.cos(a)*2,3+Math.sin(a)*2);}P(x,I,11,9,1,2);P(x,'#e2b04a',9,4);return c;})();
    const brM=new THREE.MeshLambertMaterial({map:T(brC),transparent:true,alphaTest:.5,side:THREE.DoubleSide});
    PX.forEach(px=>{vput(C(.05,.06,YT-R,8),iron,px,(YT-R)/2,PZ);vput(B(.18,.24,.18),iron,px,.12,PZ,{nc:1});vput(B(.2,.04,.2),ironL,px,.25,PZ,{nc:1});
      vput(C(.09,.05,.12,8),iron,px,YT-R-.06,PZ,{nc:1});vput(new THREE.SphereGeometry(.06,6,4),ironL,px,1.2,PZ,{nc:1});
      [-1,1].forEach(s=>{const b=vput(new THREE.PlaneGeometry(.44,.44),brM,px+s*.25,YT-R-.25,PZ,{nc:1});if(s<0)b.scale.x=-1;});});
    // lace frieze under the bullnose, between the posts
    const lace=(()=>{const Wp=Math.round(VW*32),Hp=8;const[c,x]=PXK.cv(Wp,Hp);x.clearRect(0,0,Wp,Hp);P(x,IRON,0,0,Wp,1);P(x,IRON,0,Hp-1,Wp,1);
      for(let X=0;X<Wp;X+=8){for(let a=0;a<6.3;a+=.5)P(x,IRON,X+4+Math.cos(a)*2.4,4+Math.sin(a)*2.4);P(x,IRON,X,1,1,6);P(x,'#e2b04a',X+4,4);}return c;})();
    vput(new THREE.PlaneGeometry(VW,.25),new THREE.MeshLambertMaterial({map:T(lace),transparent:true,alphaTest:.5,side:THREE.DoubleSide}),677,YT-R-.13,PZ+.01,{nc:1});
    // the station's name on a board standing on the verandah roof, in an iron frame with finials
    vput(B(4.5,.48,.06),iron,677,YT+.24,ZF+.02);
    const nm=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.34),new THREE.MeshBasicMaterial({map:makeSign(['PERTH STATION'],72,10,'#2e3a48','#f6f2e8')}));nm.position.set(677-OX,YT+.24,ZF+.06-OZ);nm.__pxSkip=1;VG.add(nm);
    [674.75,679.25].forEach(fx=>{vput(new THREE.SphereGeometry(.07,6,4),CM('#e2b04a'),fx,YT+.55,ZF+.02,{nc:1});});vput(B(.5,.18,.06),iron,677,YT+.56,ZF+.02,{nc:1});vput(new THREE.SphereGeometry(.08,6,4),CM('#e2b04a'),677,YT+.7,ZF+.02,{nc:1});
    // three lanterns hanging under the verandah
    [673.6,677,680.4].forEach(lx=>{vput(B(.02,.42,.02),CM('#2a2a30'),lx,YT-.15+(lx===677?.03:0),-21.75,{nc:1});lantern(VG,lx,2.0,-21.75,1);vput(B(.08,.06,.08),CM('#2a2a30'),lx,1.84,-21.75,{nc:1});});
    // two lamps on short iron stems above the outer posts
    [PX[0],PX[3]].forEach(lx=>{vput(C(.03,.04,.5,6),iron,lx,YT+.2,ZF+.12,{nc:1});lantern(VG,lx,YT+.58,ZF+.12,1);vput(new THREE.SphereGeometry(.035,6,4),CM('#e2b04a'),lx,YT+.8,ZF+.12,{nc:1});});
    CBD.cut.push({g:VG,x1:X1,x2:X2,z1:ZW,h:YT+.7});}
  pxbBuild_perthstn.done=true;
}

// the Moorings Hotel, Fremantle (William St corner of Phillimore St): pixel-look rebuild
function pxbBuild_freohotel(){
  const X1=310.8,X2=315.0,Z1=-13.6,Z2=-10.4,H=3.8,CX=(X1+X2)/2,CZ=(Z1+Z2)/2;
  const COL='#8a9890',CREAM='#efe3c4',IRON='#2c4a3a',INK='#2a2230';
  const TX=X2-.55,TZ=Z2-.55,TR=.6,TH=H+1.2;// the corner tower (same place as before)
  const BX2=TX-TR;// the balcony and arcade end where the tower begins
  scene.updateMatrixWorld(true);
  // 1. find the old hotel: its main block (4.2 x 3.8 x 3.2) and every mesh of the same group inside the plot
  let hb=null;scene.traverse(o=>{if(hb||!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry')return;const p=o.geometry.parameters;if(Math.abs(p.width-4.2)>.01||Math.abs(p.height-3.8)>.01||Math.abs(p.depth-3.2)>.01)return;
    const v=scene.worldToLocal(o.getWorldPosition(new THREE.Vector3()));if(Math.abs(v.x-CX)<.2&&Math.abs(v.z-CZ)<.2)hb=o;});
  if(!hb){console.warn('freohotel: old hotel not found');return;}
  const host=hb.parent||scene;const bb=new THREE.Box3(),c=new THREE.Vector3();let nHid=0;
  host.traverse(o=>{if(!o.isMesh||!o.visible)return;bb.setFromObject(o);if(bb.max.x-bb.min.x>4.5||bb.max.z-bb.min.z>3.5||bb.max.y<.12)return;bb.getCenter(c);scene.worldToLocal(c);
    if(c.x>X1-.25&&c.x<X2+.25&&c.z>Z1-.2&&c.z<Z2+1.0&&c.y<H+3)if(o===hb||c.x>X1-.25){o.visible=false;nHid++;}});
  // 2. a group whose local space is the scene's local space, placed in the old hotel's group (so it hides/shows with Fremantle)
  const g=new THREE.Group();g.name='pxb_freohotel';host.add(g);g.matrixAutoUpdate=false;
  g.matrix.copy(new THREE.Matrix4().copy(host.matrixWorld).invert().multiply(scene.matrixWorld));g.updateMatrixWorld(true);
  const T=cv=>ctex(cv);
  const LM=(cv,o)=>new THREE.MeshLambertMaterial(Object.assign({map:T(cv)},o||{}));
  const MC={};const M=col=>MC[col]||(MC[col]=new THREE.MeshLambertMaterial({color:new THREE.Color(col)}));
  const litMat=paint=>{const a=paint(false),b=paint(true);const m=new THREE.MeshLambertMaterial({map:T(a),emissive:0xffffff,emissiveIntensity:0,emissiveMap:T(PXK.glowDiff(a,b))});PXB_GLOW.push(m);return m;};
  const mesh=(geo,mat,x,y,z,o={})=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);if(o.ry)m.rotation.y=o.ry;if(o.rx)m.rotation.x=o.rx;if(o.rz)m.rotation.z=o.rz;if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);
    m.castShadow=!o.nc;m.receiveShadow=true;m.__pxSkip=1;g.add(m);return m;};
  const B=(w,h,d)=>new THREE.BoxGeometry(w,h,d),C=(a,b,h,s,o)=>new THREE.CylinderGeometry(a,b,h,s||8,1,!!o);
  const P=PXK.P,sh=PXK.sh,PPM=32;
  const px=m=>Math.round(m*PPM);
  // ---------- painted faces ----------
  const W_F=px(X2-X1),H_W=px(H),BAND=px(H)-px(1.95);// band = the first-floor line (balcony slab)
  const bayN=3,bayW=(BX2-X1)/bayN,bayC=k=>X1+bayW*(k+.5);
  function rendered(w,h,seed){const cv=PXK.wall(w,h,{base:COL,kind:'plaster',win:0,door:false,rows:1,quoins:false,cornice:true,trim:CREAM,moss:true,seed});const x=cv.getContext('2d');
    // rusticated ground floor: lines of channelled render, a cream string course under the first floor
    const W=cv.width,Hh=cv.height;for(let y=Hh-10;y>BAND+4;y-=8)P(x,sh(COL,.8),0,y,W,1);
    P(x,INK,0,BAND+1,W,1);P(x,CREAM,0,BAND-4,W,5);P(x,sh(CREAM,1.08),0,BAND-4,W,1);P(x,sh(CREAM,.7),0,BAND,W,1);
    // frieze under the top cornice with dentils
    P(x,sh(CREAM,.95),0,8,W,5);for(let X=1;X<W;X+=4)P(x,sh(CREAM,.68),X,10,2,3);P(x,INK,0,13,W,1);
    return[cv,x];}
  // glazed arch of the ground-floor arcade (window or door), with a keystone
  function arcadeArch(x,cxp,lit,isDoor){const w=22,h=isDoor?40:34,X=Math.round(cxp-w/2),Y=H_W-7-h-(isDoor?0:4);
    if(isDoor){PXK.door(x,X+1,Y+2,w-2,h-2,'#3a5a4a',{lamp:false,step:true});}
    else PXK.win(x,X,Y,w,h,{arch:true,lit,box:false,frame:CREAM});
    // the arch head of render with a keystone
    const r=w/2+3;for(let k=-r;k<=r;k++){const yy=Math.round(Math.sqrt(Math.max(0,r*r-k*k))*.62);P(x,sh(CREAM,.95),cxp+k,Y-2-yy,1,3);}P(x,sh(CREAM,.8),cxp-2,Y-4-Math.round(r*.62),5,5);P(x,sh(CREAM,1.12),cxp-2,Y-4-Math.round(r*.62),5,1);
    // the lit window gets a gilt name band on its fanlight
    if(!isDoor){P(x,lit?'#ffe8a8':'#c8a040',X+3,Y+h*.36|0,w-6,1);}}
  // tall arched French doors of the first floor, with a hood moulding
  function frenchDoor(x,cxp,lit){const w=16,h=32,X=Math.round(cxp-w/2),Y=BAND-6-h;PXK.win(x,X,Y,w,h,{arch:true,lit,box:false,frame:CREAM,curtain:'#c9473f'});
    P(x,INK,X-4,Y-9,w+8,1);P(x,sh(CREAM,1.05),X-4,Y-8,w+8,2);P(x,sh(CREAM,.75),X-3,Y-6,w+6,1);P(x,sh(CREAM,.85),X-5,Y-8,2,5);P(x,sh(CREAM,.85),X+w+3,Y-8,2,5);}
  const frontMat=litMat(lit=>{const[cv,x]=rendered(X2-X1,H,21);
    for(let k=0;k<bayN;k++){const cxp=px(bayC(k)-X1);arcadeArch(x,cxp,lit,k===1);frenchDoor(x,cxp,lit);}
    // brass plaque by the door, house lamps painted on the piers
    const dx=px(bayC(1)-X1);P(x,INK,dx+14,H_W-38,7,5);P(x,'#d8b850',dx+15,H_W-37,5,3);
    return cv;});
  // a side wall: two bays, sash windows above, arched windows below
  function sideMat(w,seed,skip){return litMat(lit=>{const[cv,x]=rendered(w,H,seed);const W=cv.width;const n=2,step=(W-skip)/n;
    for(let k=0;k<n;k++){const cxp=Math.round(step*(k+.5)+(skip<0?-skip:0));
      PXK.win(x,cxp-9,H_W-48,18,30,{arch:true,lit,box:false,frame:CREAM});
      PXK.win(x,cxp-7,BAND-40,14,26,{lit,box:true,frame:CREAM,curtain:'#e8dcc8'});}
    return cv;});}
  // +x face (William St): u runs from +z (front) to -z; the tower covers the first ~1.2 m
  const eastMat=sideMat(Z2-Z1,22,px(1.25)),westMat=sideMat(Z2-Z1,23,-px(.1));
  const backMat=LM(PXK.wall(X2-X1,H,{base:sh(COL,.92),kind:'plaster',win:2,rows:2,lit:false,quoins:false,seed:24,box:false}));
  const topMat=LM((()=>{const[cv,x]=PXK.cv(px(X2-X1)/2,px(Z2-Z1)/2);P(x,'#6a6e70',0,0,cv.width,cv.height);for(let y=0;y<cv.height;y+=6)P(x,'#5e6264',0,y,cv.width,1);for(let X=0;X<cv.width;X+=11)P(x,'#76797a',X,0,1,cv.height);return cv;})());
  const body=mesh(B(X2-X1,H,Z2-Z1),[eastMat,westMat,topMat,topMat,frontMat,backMat],CX,H/2,CZ);
  // ---------- 3D detail of the front ----------
  const cream=M(CREAM),creamD=M(sh(CREAM,.84)),iron=M(IRON),ironD=M('#1f3329'),gold=M('#d8b04a');
  const cornTex=(w,col)=>{const W=px(w),[cv,x]=PXK.cv(W,8);PXK.cornice(x,W,8,col);return LM(cv);};
  const corn=cornTex(X2-X1+.2,CREAM),cornT=cornTex(TR*2*Math.PI,CREAM);
  // pilasters between the bays, both storeys, with caps
  for(let k=0;k<=bayN;k++){const x=X1+k*bayW+(k===0?.07:k===bayN?-.04:0);
    mesh(B(.16,1.9,.1),creamD,x,.95,Z2+.05);mesh(B(.22,.1,.14),cream,x,1.82,Z2+.06,{nc:1});mesh(B(.22,.14,.14),creamD,x,.07,Z2+.06,{nc:1});
    mesh(B(.13,1.75,.08),creamD,x,2.85,Z2+.04);mesh(B(.19,.1,.12),cream,x,3.68,Z2+.05,{nc:1});}
  // arch mouldings over the arcade
  for(let k=0;k<bayN;k++){const t=mesh(new THREE.TorusGeometry(.4,.045,4,12,Math.PI),cream,bayC(k),(k===1?1.53:1.42)-(k===1?.12:0),Z2+.04,{nc:1});}
  // the string course + balcony slab on cast-iron brackets
  const BL=BX2-X1+.08,BCX=(X1+BX2)/2-.04,BD=.55,BZ=Z2+BD/2,BY=1.95;
  mesh(B(X2-X1+.12,.12,.16),corn,CX,1.9,Z2+.05,{nc:1});
  mesh(B(BL,.1,BD),M('#6a6258'),BCX,BY,BZ);mesh(B(BL,.05,.04),cream,BCX,BY+.02,Z2+BD+.01,{nc:1});
  for(let k=0;k<=bayN;k++){const x=X1+k*bayW+(k===0?.07:k===bayN?-.04:0);mesh(B(.05,.32,.05),iron,x,1.76,Z2+.2,{rx:.8,nc:1});mesh(B(.05,.05,.4),iron,x,1.88,Z2+.24,{nc:1});}
  // cast-iron lace balustrade (front + the open west end)
  const laceTex=(W,Hh)=>{const[cv,x]=PXK.cv(W,Hh);const ic=IRON,hi='#4f7a62';
    P(x,ic,0,0,W,2);P(x,hi,0,0,W,1);P(x,ic,0,Hh-2,W,2);
    for(let X=0;X<W;X+=8){P(x,ic,X,0,1,Hh);// bars, a circle and a fleur in each panel
      for(let a=0;a<12;a++){const t=a/12*Math.PI*2;P(x,ic,X+4+Math.round(Math.cos(t)*2.6),(Hh>>1)+Math.round(Math.sin(t)*2.6));}
      P(x,ic,X+4,2,1,3);P(x,ic,X+3,3,3,1);P(x,ic,X+4,Hh-5,1,3);P(x,ic,X+3,Hh-4,3,1);P(x,hi,X+2,(Hh>>1)-2,1,1);}
    return LM(cv,{transparent:true,alphaTest:.5,side:THREE.DoubleSide});};
  const balH=.5;mesh(new THREE.PlaneGeometry(BL,balH),laceTex(px(BL),px(balH)),BCX,BY+.05+balH/2,Z2+BD-.02,{nc:1});
  mesh(new THREE.PlaneGeometry(BD,balH),laceTex(px(BD),px(balH)),X1-.02,BY+.05+balH/2,BZ,{ry:Math.PI/2,nc:1});
  mesh(B(BL,.05,.07),iron,BCX,BY+.07+balH,Z2+BD-.02,{nc:1});mesh(B(.07,.05,BD),iron,X1-.02,BY+.07+balH,BZ,{nc:1});
  // balcony posts with brackets, lace frieze and a striped bullnose verandah roof
  const VY=3.12,VR=.55;
  const posts=[];for(let k=0;k<=bayN;k++)posts.push(X1+.04+k*(BL-.12)/bayN);
  posts.forEach(x=>{mesh(B(.06,VY-BY,.06),iron,x,(BY+VY)/2,Z2+BD-.06);mesh(B(.1,.08,.1),ironD,x,BY+.09,Z2+BD-.06,{nc:1});
    [-1,1].forEach(s=>{if((x<X1+.1&&s<0)||(x>BX2-.1&&s>0))return;mesh(B(.04,.26,.04),iron,x+s*.1,VY-.14,Z2+BD-.06,{rz:s*.75,nc:1});});});
  mesh(new THREE.PlaneGeometry(BL,.16),laceTex(px(BL),6),BCX,VY-.1,Z2+BD-.06,{nc:1});
  const bullTex=(()=>{const L=px(BL),A=px(VR*Math.PI/2);const[cv,x]=PXK.cv(A,L);// u = around the curve, v = along the street
    for(let y=0;y<L;y++){const s=((y/10)|0)%2;const base=s?'#2f5a46':'#e8e0cc';P(x,sh(base,y%3===0?1.1:y%3===1?.95:.86),0,y,A,1);}
    P(x,'#2a2a2a',0,0,1,L);return LM(cv,{side:THREE.DoubleSide});})();
  mesh(new THREE.CylinderGeometry(VR,VR,BL,10,1,true,0,Math.PI/2),bullTex,BCX,VY,Z2,{rz:Math.PI/2});
  // the bullnose's ends: two small quarter discs
  [X1-.04+.0,BX2].forEach(x=>{const s=new THREE.Mesh(new THREE.CircleGeometry(VR,8,0,Math.PI/2),M('#d8d0bc'));s.material.side=THREE.DoubleSide;s.rotation.y=-Math.PI/2;s.position.set(x,VY,Z2);s.__pxSkip=1;s.castShadow=true;g.add(s);});
  mesh(B(BL,.04,.04),M('#2a2a2a'),BCX,VY,Z2+VR,{nc:1});
  // ---------- top: cornice, balustraded parapet, name pediment, urns, chimneys ----------
  mesh(B(X2-X1+.18,.18,Z2-Z1+.18),corn,CX,H+.04,CZ);
  mesh(B(X2-X1+.24,.06,Z2-Z1+.24),creamD,CX,H+.15,CZ,{nc:1});
  const parY=H+.18,parH=.5;const parTex=LM(PXK.wall(X2-X1,parH,{base:COL,kind:'plaster',win:0,cornice:false,plinth:false,quoins:false,moss:false,seed:25}));
  mesh(B(.12,parH,Z2-Z1-.1),parTex,X1+.08,parY+parH/2,CZ);mesh(B(.12,parH,Z2-Z1-.1),parTex,X2-.08,parY+parH/2,CZ-.4);mesh(B(X2-X1-.1,parH,.12),parTex,CX,parY+parH/2,Z1+.08);
  mesh(B(.18,.05,Z2-Z1-.1),cream,X1+.08,parY+parH+.025,CZ,{nc:1});mesh(B(.18,.05,Z2-Z1-.1),cream,X2-.08,parY+parH+.025,CZ-.4,{nc:1});mesh(B(X2-X1-.1,.05,.18),cream,CX,parY+parH+.025,Z1+.08,{nc:1});
  // a glazed roof lantern over the stair and a vent
  {const gl=litMat(lit=>{const[cv,x]=PXK.cv(40,12);P(x,'#3a3e48',0,0,40,12);for(let X=2;X<38;X+=6)PXK.win(x,X+1,3,4,6,{lit,box:false,sash:false,frame:'#d8d0bc'});return cv;});
    const sx=X1+1.8,sz=CZ-.2;mesh(B(1.2,.36,.8),[gl,gl,M('#5a5e62'),M('#5a5e62'),gl,gl],sx,H+.18+.18,sz);mesh(new THREE.CylinderGeometry(.01,.62,.3,4,1),M('#4a5a56'),sx,H+.69,sz,{ry:Math.PI/4,s:[1,1,.66]});
    mesh(B(.22,.3,.22),M('#8a8e90'),X1+3.1,H+.3,Z1+1.2);mesh(B(.3,.06,.3),M('#6a6e70'),X1+3.1,H+.48,Z1+1.2,{nc:1});}
  // front: plinth, balusters, top rail, piers with urns; the name panel in the middle
  const PZ=Z2-.05,PL=BX2-X1;
  mesh(B(PL+.05,.08,.2),cream,X1+PL/2,parY+.04,PZ);mesh(B(PL+.05,.08,.22),cream,X1+PL/2,parY+parH-.04,PZ,{nc:1});
  const panW=1.5,panX=bayC(1);
  const balG=new THREE.CylinderGeometry(.03,.045,parH-.16,6);
  for(let x=X1+.18;x<BX2-.1;x+=.13){if(Math.abs(x-panX)<panW/2+.05)continue;const b=mesh(balG,cream,x,parY+parH/2,PZ,{nc:1});b.castShadow=true;}
  const urn=(x,y,z)=>{mesh(B(.22,.08,.22),creamD,x,y+.04,z,{nc:1});mesh(new THREE.CylinderGeometry(.05,.03,.08,8),cream,x,y+.12,z,{nc:1});mesh(new THREE.SphereGeometry(.09,8,6),cream,x,y+.22,z,{s:[1,.85,1]});mesh(new THREE.CylinderGeometry(.06,.08,.05,8),cream,x,y+.3,z,{nc:1});mesh(new THREE.SphereGeometry(.03,6,4),cream,x,y+.36,z,{nc:1});};
  [X1+.08,BX2-.02].forEach(x=>{mesh(B(.2,parH+.06,.24),creamD,x,parY+(parH+.06)/2,PZ);urn(x,parY+parH+.06,PZ);});
  // name panel: a rendered pediment with the hotel's name, a segmental top and a little urn on each side
  const nameTex=makeSign(['MOORINGS HOTEL'],96,14,'#f2ead6','#2c4a3a');
  mesh(B(panW,parH+.3,.18),cream,panX,parY+(parH+.3)/2,PZ);
  const np=new THREE.Mesh(new THREE.PlaneGeometry(panW-.14,.3),new THREE.MeshLambertMaterial({map:nameTex,emissive:0xffffff,emissiveIntensity:0,emissiveMap:nameTex}));np.material.__dim=.35;PXB_GLOW.push(np.material);np.position.set(panX,parY+.32,PZ+.095);np.__pxSkip=1;g.add(np);
  {const s=new THREE.Shape();s.moveTo(-panW/2-.04,0);s.lineTo(panW/2+.04,0);s.absarc(0,-1.05,1.24,Math.asin(1.05/1.24),Math.PI-Math.asin(1.05/1.24),false);s.closePath();
    const pg=new THREE.ExtrudeGeometry(s,{depth:.2,bevelEnabled:false,curveSegments:10});mesh(pg,cream,panX,parY+parH+.3,PZ-.1);}
  mesh(new THREE.SphereGeometry(.07,8,6),cream,panX,parY+parH+.55,PZ,{nc:1});
  // roof behind the parapet: two chimneys at the back
  [[X1+.9],[X1+2.6]].forEach(([x])=>{const brk=LM((()=>{const[cv,cx]=PXK.cv(16,30);PXK.plaster(cx,16,30,sh(COL,.95));P(cx,CREAM,0,0,16,3);return cv;})());
    mesh(B(.45,.9,.35),brk,x,H+.45,Z1+.45);mesh(B(.55,.08,.45),cream,x,H+.93,Z1+.45,{nc:1});[-.1,.1].forEach(o=>mesh(new THREE.CylinderGeometry(.05,.06,.18,6),M('#b8603a'),x+o,H+1.05,Z1+.45,{nc:1}));});
  // ---------- the octagonal corner tower ----------
  // faces are centred on 0, 45, 90... degrees (face 0 looks down Phillimore St +z, face 1 at the corner, face 2 along William St +x)
  const TS=-Math.PI/8,TW=8*16,THp=px(TH);
  const towerMat=litMat(lit=>{const[cv,x]=PXK.cv(TW,THp);PXK.seed(26);PXK.plaster(x,TW,THp,COL);
    const yBand=THp-BAND,yTop=THp-H_W;
    // string courses + ground rustication + top cornice
    for(let y=THp-10;y>yBand+4;y-=8)P(x,sh(COL,.8),0,y,TW,1);
    P(x,CREAM,0,yBand-4,TW,5);P(x,sh(CREAM,.7),0,yBand,TW,1);P(x,CREAM,0,yTop-3,TW,4);P(x,sh(CREAM,.7),0,yTop+1,TW,1);
    PXK.cornice(x,TW,8,CREAM);PXK.plinth(x,TW,THp,'#b8a88c');
    for(let f=0;f<8;f++){const cx=f*16+8;
      // ground: the corner door on face 1, tall arched windows on the others
      if(f===1){PXK.door(x,cx-6,THp-48,12,44,'#3a5a4a',{lamp:false,step:true});if(lit)P(x,'#ffe0a0',cx-5,THp-48,10,3);}
      else PXK.win(x,cx-4,THp-46,8,34,{arch:true,lit,box:false,frame:CREAM,sash:true});
      // first floor: tall arched windows; belvedere: small round-headed lights
      PXK.win(x,cx-4,yBand-40,8,32,{arch:true,lit,box:false,frame:CREAM});
      PXK.win(x,cx-3,yTop-24,6,14,{arch:true,lit,box:false,frame:CREAM,sash:false});
      // pilaster strips at the angles
      P(x,sh(CREAM,.9),f*16,10,2,THp-17);P(x,sh(CREAM,1.05),f*16,10,1,THp-17);}
    return cv;});
  mesh(new THREE.CylinderGeometry(TR,TR,TH,8,1,false,TS,Math.PI*2),towerMat,TX,TH/2,TZ);
  // angle pilasters + the cornices that ring the tower
  for(let k=0;k<8;k++){const a=TS+k*Math.PI/4;mesh(B(.07,TH-.2,.07),creamD,TX+Math.sin(a)*(TR+.01),TH/2,TZ+Math.cos(a)*(TR+.01),{ry:a,nc:1});}
  const ring=(r1,r2,h,y,mat)=>mesh(new THREE.CylinderGeometry(r1,r2,h,8,1,false,TS,Math.PI*2),mat,TX,y,TZ);
  ring(TR+.08,TR+.05,.1,1.92,cream);ring(TR+.07,TR+.04,.1,H+.02,cream);
  ring(TR+.13,TR+.06,.16,TH+.06,cornT);ring(TR+.15,TR+.15,.05,TH+.16,creamD);
  // a little balustraded drum, then the dome with ribs, a lantern and a gilt finial
  ring(TR-.04,TR-.04,.22,TH+.3,LM((()=>{const[cv,x]=PXK.cv(TW,8);P(x,COL,0,0,TW,8);for(let X=2;X<TW;X+=5){P(x,CREAM,X,1,2,7);P(x,sh(CREAM,.7),X+1,1,1,7);}P(x,CREAM,0,0,TW,1);return cv;})()));
  const domeTex=LM((()=>{const W=96,Hh=48;const[cv,x]=PXK.cv(W,Hh);const base='#9aa6a4';P(x,sh(base,.6),0,0,W,Hh);
    for(let y=0,r=0;y<Hh;y+=4,r++)for(let X=-(r%2)*3;X<W;X+=6){const f=.92+((X*7+y*13)%9)/60;P(x,sh(base,f),X,y,6,4);P(x,sh(base,f*1.15),X+1,y,4,1);P(x,sh(base,f*.7),X,y+3,6,1);P(x,sh(base,f*.8),X,y+1,1,2);P(x,sh(base,f*.8),X+5,y+1,1,2);}
    for(let k=0;k<8;k++)P(x,sh(CREAM,.92),k*12,0,2,Hh);return cv;})());
  const DY=TH+.41;const dome=mesh(new THREE.SphereGeometry(TR-.02,8,6,TS,Math.PI*2,0,Math.PI/2),domeTex,TX,DY,TZ,{s:[1,1.45,1]});
  for(let k=0;k<8;k++){const a=TS+k*Math.PI/4;// ribs follow the dome's curve
    for(let j=1;j<6;j++){const t=j/6*Math.PI/2,r=(TR-.0)*Math.sin(Math.PI/2-t),y=DY+(TR-.02)*1.45*Math.sin(t);mesh(B(.04,.16,.04),cream,TX+Math.sin(a)*r,y,TZ+Math.cos(a)*r,{ry:a,rx:-t*.9,nc:1});}}
  const LY=DY+(TR-.02)*1.45;
  mesh(new THREE.CylinderGeometry(.14,.16,.06,8),cream,TX,LY,TZ,{nc:1});
  const lan=mesh(new THREE.CylinderGeometry(.1,.1,.22,8),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),TX,LY+.14,TZ,{nc:1});PXB_LAMPS.push(lan);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;mesh(B(.03,.22,.03),ironD,TX+Math.sin(a)*.11,LY+.14,TZ+Math.cos(a)*.11,{nc:1});}
  mesh(new THREE.ConeGeometry(.15,.16,8),M('#7a8886'),TX,LY+.33,TZ,{nc:1});
  mesh(new THREE.SphereGeometry(.05,6,4),gold,TX,LY+.45,TZ,{nc:1});mesh(new THREE.CylinderGeometry(.008,.02,.32,4),gold,TX,LY+.62,TZ,{nc:1});
  // ---------- lamps, sign, café tables ----------
  const lampAt=(x,y,z,ry)=>{mesh(B(.04,.04,.18),ironD,x,y+.18,z-.04,{nc:1});mesh(B(.16,.04,.16),ironD,x,y+.13,z+.06,{nc:1});
    const l=mesh(B(.11,.17,.11),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,y,z+.06,{nc:1});PXB_LAMPS.push(l);mesh(B(.08,.04,.08),ironD,x,y-.1,z+.06,{nc:1});};
  for(let k=1;k<bayN;k++)lampAt(X1+k*bayW,1.45,Z2+.1);
  // a lamp on each side of the corner door, on the tower's angle pilasters
  [0,1].forEach(k=>{const a=TS+(k+1)*Math.PI/4;lampAt(TX+Math.sin(a)*(TR+.06),1.55,TZ+Math.cos(a)*(TR+.06)-.06);});
  // hanging blade sign under the balcony, by the door
  {const st=makeSign(['HOTEL'],40,12,'#2c4a3a','#f2d27a');const sm=new THREE.MeshLambertMaterial({map:st,side:THREE.DoubleSide,emissive:0xffffff,emissiveIntensity:0,emissiveMap:st});sm.__dim=.3;PXB_GLOW.push(sm);
    const sx=X1+2*bayW-.02;mesh(B(.03,.03,.5),ironD,sx,1.78,Z2+.25,{nc:1});const s=mesh(new THREE.PlaneGeometry(.5,.16),sm,sx,1.64,Z2+.45,{ry:Math.PI/2,nc:1});}
  // two striped café umbrellas with tables and chairs on the footpath (where the old ones stood)
  const umbTex=LM((()=>{const[cv,x]=PXK.cv(64,12);for(let k=0;k<8;k++){const col=k%2?'#2f5a46':'#f2ead6';P(x,col,k*8,0,8,12);P(x,sh(col,.82),k*8,10,8,2);P(x,sh(col,1.08),k*8,0,8,1);}return cv;})(),{side:THREE.DoubleSide});
  const wood=M('#7a5236'),chairM=M('#2f4a3e');
  [[X1+.8,Z2+.75],[X1+2.2,Z2+.75]].forEach(([ux,uz],i)=>{
    mesh(new THREE.ConeGeometry(.66,.26,8,1,true),umbTex,ux,1.72,uz);mesh(new THREE.CylinderGeometry(.66,.66,.06,8,1,true),umbTex,ux,1.57,uz,{nc:1});
    mesh(C(.025,.025,1.7,6),M('#e8e8e4'),ux,.85,uz,{nc:1});mesh(new THREE.SphereGeometry(.03,6,4),M('#e8e8e4'),ux,1.87,uz,{nc:1});
    mesh(C(.3,.3,.04,10),wood,ux,.72,uz);mesh(C(.04,.06,.7,6),ironD,ux,.36,uz,{nc:1});mesh(C(.18,.2,.04,8),ironD,ux,.02,uz,{nc:1});
    [-1,1].forEach(s=>{const cx=ux+s*.48;mesh(B(.3,.04,.3),chairM,cx,.42,uz);mesh(B(.04,.36,.3),chairM,cx+s*.14,.62,uz,{nc:1});[[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([a,b])=>mesh(B(.03,.42,.03),chairM,cx+a*.12,.21,uz+b*.12,{nc:1}));});
    // a cup and a little vase on each table
    mesh(C(.03,.025,.05,6),M('#f6f2e8'),ux-.08,.765,uz+.06,{nc:1});mesh(C(.025,.03,.08,6),M('#4f7ab0'),ux+.08,.78,uz-.05,{nc:1});mesh(B(.06,.05,.06),M(i?'#e05a6a':'#f4d04a'),ux+.08,.84,uz-.05,{nc:1});});
  // planters either side of the corner door
  [[X2+.1,Z2-1.45],[X1+.12,Z2+.25]].forEach(([x,z])=>{mesh(B(.3,.32,.3),M('#5a5e62'),x,.16,z);mesh(new THREE.IcosahedronGeometry(.2,0),new THREE.MeshLambertMaterial({color:'#4f8a3a',flatShading:true}),x,.42,z);
    for(let k=0;k<4;k++)mesh(B(.06,.06,.06),M(['#e05a6a','#f4d04a','#f0f0f0','#c070e0'][k]),x+Math.cos(k*1.6)*.14,.55,z+Math.sin(k*1.6)*.14,{nc:1});});
  window.__freohotel={hid:nHid,meshes:g.children.length};
