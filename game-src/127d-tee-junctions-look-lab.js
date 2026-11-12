// ===== three-way junctions (Look Lab ?ow2, Paul Nov 2026, from his street photo): the side road flares out at the mouth, a kerbed teardrop splits
// it, a grass "pork-chop" island sets off the free left-turn slip lane, give-way line and turn arrows on the approach =====
const TEE3=[];O.tee3L=TEE3;O.tee3=(x,z,tx,tz,nx,nz,hw,sw)=>{if(!OWR2)return;if(TEE3.some(t=>Math.hypot(t[0]-x,t[1]-z)<3))return;TEE3.push([x,z,tx,tz,nx,nz,hw,sw]);};
O.tee3Build=()=>{if(!TEE3.length)return 0;const P=[],C=[],I=[];const col=h=>{const c=new THREE.Color(h).convertSRGBToLinear();return[c.r,c.g,c.b];};
  const ASP=col('#5a5c60'),KERB=col('#e8e4da'),GR=col('#6aa040'),WH=col('#f4f2ec');
  const poly=(pts,y,c)=>{const b=P.length/3;pts.forEach(p=>{P.push(p[0],(p[2]!==undefined?p[2]:gy(p[0],p[1]))+y,p[1]);C.push(...c);});for(let k=1;k<pts.length-1;k++)I.push(b,b+k+1,b+k);};
  TEE3.forEach(([x,z,tx,tz,nx,nz,hw,sw])=>{const W=(u,v)=>[x+nx*(hw+v)+tx*u,z+nz*(hw+v)+tz*u];const y0=gy(x+nx*hw,z+nz*hw);const Wy=(u,v)=>{const p=W(u,v);p[2]=y0;return p;};
    // asphalt flare: the mouth widens to the slip lane on +u, with a curved corner on each side
    const fl=[];for(let k=0;k<=6;k++){const a=k/6*Math.PI/2;fl.push(Wy(-sw-2.2+2.2*(1-Math.cos(a)),-.05+2.2*Math.sin(a)));}
    const fr=[];for(let k=6;k>=0;k--){const a=k/6*Math.PI/2;fr.push(Wy(sw+3.2-3.2*(1-Math.cos(a)),-.05+3.2*Math.sin(a)));}
    poly([Wy(0,-.05)].concat(fl,[Wy(-sw,5),Wy(sw,5)],fr),.135,ASP);
    // pork-chop island between the slip lane and the turning lanes (kerb then grass)
    const pc=(s)=>[Wy(.35*sw+.1*s,.9-.1*s),Wy(sw+1.25-.25*s,.55+.12*s),Wy(sw-.15-.12*s,2.8-.25*s)];poly(pc(0),.2,KERB);poly(pc(1),.215,GR);
    // teardrop splitter on the side road
    const td=s=>[Wy(-.12,1.3+s*.15),Wy(-.42+s*.08,2.4),Wy(-.3+s*.06,4.6-s*.2),Wy(-.05-s*.03,4.6-s*.2),Wy(.12-s*.06,2.4)];poly(td(0),.2,KERB);poly(td(1),.215,col('#d8d2c4'));
    // give-way line, centre line and arrows on the inbound half (u<0)
    for(let u=-sw+.1;u<-.15;u+=.32)poly([Wy(u,.75),Wy(u+.18,.75),Wy(u+.18,.62),Wy(u,.62)],.15,WH);
    poly([Wy(-.04,4.7),Wy(.04,4.7),Wy(.04,6.6),Wy(-.04,6.6)],.15,WH);
    const arrow=(u0,v0,dir)=>{poly([Wy(u0-.05,v0),Wy(u0+.05,v0),Wy(u0+.05,v0+.9),Wy(u0-.05,v0+.9)],.15,WH);poly([Wy(u0,v0-.05),Wy(u0+dir*.38,v0+.12),Wy(u0+dir*.12,v0+.2),Wy(u0+dir*.12,v0+.04)],.15,WH);};
    arrow(-sw*.5,1.7,-1);arrow(-sw*.5,1.7,1);});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));g.setIndex(I);g.computeVertexNormals();
  const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-16}));m.receiveShadow=true;m.userData.L='roads';m.name='rk:tee3';scene.add(m);return TEE3.length;};
// arterial tees in the suburbs: find the real road directions out of each vertex from the drawn main roads (they may have been joined or extended)
if(OWR2){VX.forEach(v=>{if(!v.arms||v.arms.length!==3)return;if(O.KWP&&O.KWP.some(p=>Math.hypot(p[0]-v.x,p[1]-v.z)<10))return;const dirs=[];
    STREETS.forEach(s=>{if(s.kind!=='art')return;const P=s.P;let bi=-1,bd=1.2;for(let i=0;i<P.length;i++){const d=Math.hypot(P[i][0]-v.x,P[i][1]-v.z);if(d<bd){bd=d;bi=i;}}if(bi<0)return;
      [-1,1].forEach(sg=>{let j=bi,acc=0;while(j+sg>=0&&j+sg<P.length&&acc<3){acc+=Math.hypot(P[j+sg][0]-P[j][0],P[j+sg][1]-P[j][1]);j+=sg;}if(acc<1.5)return;let dx=P[j][0]-v.x,dz=P[j][1]-v.z;const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;if(!dirs.some(d=>d[0]*dx+d[1]*dz>.85))dirs.push([dx,dz]);});});
    if(dirs.length!==3)return;let best=null;for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const d=dirs[i][0]*dirs[j][0]+dirs[i][1]*dirs[j][1];if(!best||d<best.d)best={d,i,j};}if(best.d>-.8)return;
    const k=3-best.i-best.j,n=dirs[k],t=[-n[1],n[0]];v.tee=1;O.tee3(v.x,v.z,t[0],t[1],n[0],n[1],1.5,1.5);});}
