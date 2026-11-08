// ===== the car park: pale bitumen, white bays, timber log barriers, lamp posts =====
{const[c,x]=cvs(64,64);x.fillStyle='#8a8478';x.fillRect(0,0,64,64);const r=mulberry32(5);for(let i=0;i<260;i++){x.fillStyle=pick(['#7e786c','#969084','#a09a8c','#847e72']);x.fillRect(r()*64|0,r()*64|0,1,1);}
  const at=ctex(c,{rep:[1,1]});at.magFilter=THREE.NearestFilter;const g=new THREE.PlaneGeometry(CP.x2-CP.x1,CP.z2-CP.z1);g.rotateX(-Math.PI/2);const U=g.attributes.uv,P=g.attributes.position;for(let i=0;i<U.count;i++)U.setXY(i,P.getX(i)/2,P.getZ(i)/2);
  put(g,new THREE.MeshLambertMaterial({map:at,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4}),(CP.x1+CP.x2)/2,.5+.04,(CP.z1+CP.z2)/2,{nc:1});
  const lm=new THREE.MeshBasicMaterial({color:'#efeee6'});
  for(let i=0;i<7;i++){const x=CP.x1+1.4+i*2.6;put(B(.08,.01,4.6),lm,x,.56,CP.z2-2.6,{nc:1});}
  for(let i=0;i<5;i++){const x=CP.x1+8+i*2.6;put(B(.08,.01,4),lm,x,.56,CP.z1+2.3,{nc:1});}
  const log=M('#7a5a3a'),logE=M('#a8865a');
  const logs=(x1,z1,x2,z2)=>{const L=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(L/2.4));for(let i=0;i<n;i++){const a=i/n,b=(i+.9)/n,ax=x1+(x2-x1)*a,az=z1+(z2-z1)*a,bx=x1+(x2-x1)*b,bz=z1+(z2-z1)*b;const m=put(CY(.13,.13,Math.hypot(bx-ax,bz-az),7),[log,logE,logE],(ax+bx)/2,.64,(az+bz)/2,{rz:Math.PI/2,ry:-Math.atan2(bz-az,bx-ax)});}};
  logs(CP.x1,CP.z2,CP.x2,CP.z2);logs(CP.x2,CP.z1,CP.x2,CP.z2);logs(CP.x1,CP.z1+4.4,CP.x1,CP.z2);
  // lamp posts (warm at night)
  [[CP.x1+.6,CP.z1+.6],[CP.x2-.6,CP.z1+.6],[CP.x1+.6,CP.z2-.6],[CP.x2-.6,CP.z2-.6],[1028.6,29.4]].forEach(([x,z])=>{const y=H(x,z);put(CY(.06,.08,3.6,6),M('#4a4e56'),x,y+1.8,z);put(B(.5,.08,.2),M('#3a3e46'),x,y+3.6,z);const l=put(B(.36,.05,.16),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),x,y+3.55,z,{nc:1});PXB_LAMPS.push(l);col(x-.1,z-.1,x+.1,z+.1);});
  // a plain stone entry sign (no logos)
  {const[c2,x2]=cvs(96,40);PXK.blocks(x2,96,40,'#d8c090',{rowH:8});x2.fillStyle='#4a3a2a';x2.fillRect(6,8,84,22);x2.fillStyle='#f4e2b8';x2.font='bold 9px "Pixelify Sans", monospace';x2.textAlign='center';x2.textBaseline='middle';x2.fillText('THE PINNACLES',48,15);x2.font='7px "Pixelify Sans", monospace';x2.fillText('DESERT LOOP · CENTRE',48,25);
    const sm=texM(c2);put(B(3,1.25,.6),[M(STONE2),M(STONE2),M('#eadcb8'),M(STONE2),sm,sm],CP.x2-2.4,.5+.62,CP.z2+1.4);col(CP.x2-3.95,CP.z2+1.05,CP.x2-.85,CP.z2+1.75);}}
// ===== picnic area (Paul: every country place gets one): a patch of grass, a shade shelter, picnic tables and a free electric BBQ =====
const PIC={x1:1019.4,x2:1029.4,z1:37.9,z2:42.4,bbq:[1027.8,39.0]};
{// grass: 16 px per metre, ragged edges cut out with alpha so it melts into the sand
  const GW=Math.round((PIC.x2-PIC.x1)*16),GH=Math.round((PIC.z2-PIC.z1)*16),[c,x]=cvs(GW,GH);const img=x.createImageData(GW,GH),D=img.data;
  const GP=[[62,90,48],[76,104,54],[90,118,60],[106,132,68],[124,142,80]];
  for(let y=0;y<GH;y++)for(let X=0;X<GW;X++){const e=Math.min(X,GW-1-X,y,GH-1-y)/10+(pn(X,y,6,1e6,51)-.5)*1.1;if(e<.25)continue;const n=pn(X,y,5,1e6,52);let k=1+(n>.55?1:0)+(n>.75?1:0)-(n<.3?1:0);
    if(ph(X,y,53)<.08)k+=ph(y,X,54)<.5?1:-1;if(e<.7&&ph(X,y,55)<.4)k=0;k=cl(k,0,4);const q=(y*GW+X)*4;D[q]=GP[k][0];D[q+1]=GP[k][1];D[q+2]=GP[k][2];D[q+3]=255;}
  x.putImageData(img,0,0);for(let i=0;i<40;i++){x.fillStyle=R()<.5?'#f4f2ea':'#f2d04a';const X=8+R()*(GW-16)|0,Y=6+R()*(GH-12)|0;if(D[(Y*GW+X)*4+3])x.fillRect(X,Y,1,1);}
  const g=new THREE.PlaneGeometry(PIC.x2-PIC.x1,PIC.z2-PIC.z1,10,5);g.rotateX(-Math.PI/2);const P=g.attributes.position;
  for(let i=0;i<P.count;i++){const px=P.getX(i)+(PIC.x1+PIC.x2)/2,pz=P.getZ(i)+(PIC.z1+PIC.z2)/2;P.setY(i,H(px,pz)+.04);P.setX(i,px);P.setZ(i,pz);}g.computeVertexNormals();
  put(g,new THREE.MeshLambertMaterial({map:ctex(c),alphaTest:.5,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3}),0,0,0,{nc:1});}
{const wd=M('#a8865a'),wd2=M('#8a6a44'),leg=M('#4a4e56');
  [[1021.8,39.6],[1024.8,39.6]].forEach(([x,z])=>{const y=H(x,z);put(B(1.8,.07,.8),wd,x,y+.76,z);[-.62,.62].forEach(d=>put(B(1.8,.06,.3),wd2,x,y+.45,z+d));
    [-.75,.75].forEach(d=>put(B(.08,.76,1.5),leg,x+d,y+.38,z,{nc:1}));col(x-.95,z-.8,x+.95,z+.8);});
  // shade shelter: steel posts, a skillion tin roof
  {const y=H(1024.3,39.6)+2.75,sx1=1020.2,sx2=1029.2,sz1=37.9,sz2=41.4;
    const rt=texM(PXK.roof(sx2-sx1+.4,sz2-sz1+.6,{base:'#8e9c86',kind:'tin',seed:31}));
    put(B(sx2-sx1+.4,.1,sz2-sz1+.6),[M('#6e7a68'),M('#6e7a68'),rt,M('#5a6458'),M('#6e7a68'),M('#6e7a68')],(sx1+sx2)/2,y,(sz1+sz2)/2,{rx:-.06});
    [[sx1,sz1],[sx2,sz1],[sx1,sz2],[sx2,sz2],[(sx1+sx2)/2,sz1],[(sx1+sx2)/2,sz2]].forEach(([px,pz])=>{const yy=H(px,pz);put(CY(.07,.07,y-yy,6),leg,px,(yy+y)/2,pz);col(px-.1,pz-.1,px+.1,pz+.1);});
    const l=put(B(.4,.05,.14),new THREE.MeshBasicMaterial({color:'#e8d8a8'}),(sx1+sx2)/2,y-.1,(sz1+sz2)/2,{nc:1});PXB_LAMPS.push(l);}
  // the free electric BBQ: a limestone-block cabinet with a steel hotplate, a big red start button and a little sign
  {const [bx,bz]=PIC.bbq,y=H(bx,bz);const cab=texM(PXK.wall(1.5,.85,{base:STONE,kind:'stone',win:0,seed:81,cornice:false,moss:false}));
    put(B(1.5,.85,.75),[cab,cab,M('#c8c8c4'),M(STONE2),cab,cab],bx,y+.425,bz);
    {const[c,x]=cvs(40,20);x.fillStyle='#3a3c40';x.fillRect(0,0,40,20);x.fillStyle='#4a4c52';for(let i=2;i<40;i+=4)x.fillRect(i,2,2,16);x.fillStyle='#8a8c90';x.fillRect(0,0,40,1);x.fillRect(0,19,40,1);
      put(B(1.1,.04,.55),[M('#2a2c30'),M('#2a2c30'),texM(c),M('#2a2c30'),M('#2a2c30'),M('#2a2c30')],bx-.12,y+.87,bz,{nc:1});}
    put(B(.18,.18,.06),M('#c8c8c4'),bx+.58,y+.7,bz+.38,{nc:1});const btn=put(CY(.05,.05,.04,10),new THREE.MeshBasicMaterial({color:'#d03a2a'}),bx+.58,y+.7,bz+.42,{rx:Math.PI/2,nc:1});
    {const[c,x]=cvs(48,16);x.fillStyle='#1d3a6e';x.fillRect(0,0,48,16);x.fillStyle='#ffffff';x.font='bold 6px "Pixelify Sans", monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('FREE BBQ',24,5);x.font='5px "Pixelify Sans", monospace';x.fillText('clean up after use',24,12);
      put(new THREE.PlaneGeometry(.6,.2),new THREE.MeshLambertMaterial({map:ctex(c)}),bx-.3,y+.6,bz+.378,{nc:1});}
    // sausages and onions that appear while Kip cooks
    const SZ=new THREE.Group();SZ.visible=false;G.add(SZ);const sm=M('#8a4a2a'),sm2=M('#a85a32'),on=M('#e8d8a0');
    for(let i=0;i<6;i++)put(CY(.035,.035,.32,6),i%2?sm:sm2,bx-.45+i*.1,y+.91,bz-.05,{rx:Math.PI/2,nc:1,to:SZ});put(B(.3,.02,.25),on,bx+.25,y+.9,bz,{nc:1,to:SZ});
    const smoke=[];for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.3,.3),new THREE.MeshBasicMaterial({color:0xeeeeee,transparent:true,opacity:.4,depthWrite:false}));m.position.set(bx-.1,y+1,bz);SZ.add(m);smoke.push(m);}
    col(bx-.8,bz-.42,bx+.8,bz+.42);PIN.bbq={SZ,smoke,btn,x:bx,z:bz,y,t:0};}}
