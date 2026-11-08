// ===== 9. roads that join: connectors from every loose end to the nearest road, asphalt pads at junctions; the freeway in four lanes =====
{const asT=(()=>{const c=mkc(32,32),x=c.getContext('2d');PP(x,'#56585d',0,0,32,32);for(let k=0;k<110;k++)PP(x,['#4a4c50','#606268','#6a6c70','#505256'][k%4],HSH(k,7)*32,HSH(k,8)*32);return TX(c,true);})();
  const padM=new THREE.MeshLambertMaterial({map:asT,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
  const pad=(x,z,r)=>{const g=new THREE.CircleGeometry(r,20);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*r/2,uv.getY(i)*r/2);const m=new THREE.Mesh(g,padM);m.position.set(x,deckH(x,z)+.19,z);m.receiveShadow=true;m.userData.L='roads';scene.add(m);(O.pads||(O.pads=[])).push([x,z]);(O.padMeshes||(O.padMeshes=[])).push(m);};
  const ALL=[];ROADS.forEach(r=>ALL.push(r.p));if(SOUTH&&SOUTH.road)ALL.push(SOUTH.road);if(N)N.roads.forEach(r=>ALL.push(r.draw||r.p));
  const nearest=(x,z,skip)=>{let b=null,bd=1e9;ALL.forEach((P,j)=>{if(j===skip)return;for(let i=1;i<P.length;i++){const a=P[i-1],c=P[i],dx=c[0]-a[0],dz=c[1]-a[1],L=dx*dx+dz*dz;let t=L?((x-a[0])*dx+(z-a[1])*dz)/L:0;t=Math.max(0,Math.min(1,t));const px=a[0]+dx*t,pz=a[1]+dz*t,d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;b=[px,pz];}}});return[b,bd];};
  let nc=0,np=0;ALL.forEach((P,j)=>{[P[0],P[P.length-1]].forEach(e=>{const[b,d]=nearest(e[0],e[1],j);if(!b||d>14)return;if(d>.4){ribbon([e,b],4,roadM,.185,true);nc++;}pad(b[0],b[1],3);np++;});});
  // crossings
  const segs=[];ALL.forEach((P,j)=>{for(let i=1;i<P.length;i++)segs.push([P[i-1],P[i],j]);});
  for(let a=0;a<segs.length;a++)for(let b=a+1;b<segs.length;b++){const s=segs[a],t=segs[b];if(s[2]===t[2])continue;const p=s[0],r=[s[1][0]-p[0],s[1][1]-p[1]],q=t[0],u=[t[1][0]-q[0],t[1][1]-q[1]],den=r[0]*u[1]-r[1]*u[0];if(Math.abs(den)<1e-6)continue;
    const tt=((q[0]-p[0])*u[1]-(q[1]-p[1])*u[0])/den,uu=((q[0]-p[0])*r[1]-(q[1]-p[1])*r[0])/den;if(tt<0||tt>1||uu<0||uu>1)continue;pad(p[0]+r[0]*tt,p[1]+r[1]*tt,3.2);np++;}
  O.roadFix=[nc,np];

  // ---- fix 1 (Paul, Nov 2026): city junctions become signalised crossroads; green signs move off the carriageway onto the verge ----
  {const PADS=O.pads||[],CL=[];PADS.forEach(p=>{if(p[1]<2||p[1]>WZ-2||p[0]<2||p[0]>WX-2)return;const c=CL.find(c=>Math.hypot(c.x-p[0],c.z-p[1])<9);if(c){c.n++;c.x+=(p[0]-c.x)/c.n;c.z+=(p[1]-c.z)/c.n;c.m.push(p[2]);}else CL.push({x:p[0],z:p[1],n:1,m:[p[2]]});});
    const SIG=[];O.signals=SIG;
    const slabC=(()=>{const c=mkc(64,64),x=c.getContext('2d');PP(x,'#56585d',0,0,64,64);for(let k=0;k<260;k++)PP(x,['#4a4c50','#606268','#6a6c70','#505256'][k%4],HSH(k,21)*64,HSH(k,22)*64);
      const zeb=(hor,o)=>{for(let k=8;k<56;k+=4)hor?PP(x,'#f4f2e8',k,o,2,6):PP(x,'#f4f2e8',o,k,6,2);};zeb(true,1);zeb(true,57);zeb(false,1);zeb(false,57);
      PP(x,'#f4f2e8',8,9,22,1);PP(x,'#f4f2e8',34,54,22,1);PP(x,'#f4f2e8',9,34,1,22);PP(x,'#f4f2e8',54,8,1,22);
      const arr=(X,Y,r)=>{x.save();x.translate(X,Y);x.rotate(r);PP(x,'#f4f2e8',-.5,-3,1,5);PP(x,'#f4f2e8',-2,-3,4,1);PP(x,'#f4f2e8',-1,-4,2,1);x.restore();};arr(20,14,Math.PI);arr(44,50,0);arr(14,44,Math.PI/2);arr(50,20,-Math.PI/2);
      PP(x,'#e8c84a',31,12,1,40);PP(x,'#e8c84a',12,31,40,1);return c;})();
    const slabT=TX(slabC),slabM=new THREE.MeshLambertMaterial({map:slabT,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),kerbM=flat('#c8c4b8'),pathM=flat('#d8d2c4');
    CL.forEach((c,ci)=>{const x=c.x,z=c.z,[b]=nearest(x,z,-1);let best=null,bd=1e9;segs.forEach(s=>{const d=segDist(x,z,s[0],s[1]);if(d<bd){bd=d;best=s;}});if(!best)return;
      const ang=Math.atan2(best[1][0]-best[0][0],best[1][1]-best[0][1]),y=deckH(x,z)+.215,S2=11,g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ang;g.userData.L='roads';scene.add(g);
      const sl=new THREE.Mesh(new THREE.PlaneGeometry(S2,S2),slabM);sl.rotation.x=-Math.PI/2;sl.receiveShadow=true;g.add(sl);
      // corner footpaths with rounded kerbs, a traffic-light pole on each corner
      const heads=[];[[1,1],[-1,1],[-1,-1],[1,-1]].forEach(([sx,sz],k)=>{const cx=sx*S2/2,cz=sz*S2/2;const kb=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,.14,10,1,false,0,Math.PI/2),pathM);kb.position.set(cx,.07,cz);kb.rotation.y=Math.atan2(sx,sz)-Math.PI*3/4+Math.PI;g.add(kb);
        const rim=new THREE.Mesh(new THREE.TorusGeometry(1.6,.07,4,10,Math.PI/2),kerbM);rim.rotation.x=-Math.PI/2;rim.rotation.z=Math.atan2(sz,sx)+Math.PI/4+Math.PI/2;rim.position.set(cx,.12,cz);g.add(rim);
        const pole=new THREE.Mesh(new THREE.CylinderGeometry(.06,.07,2.4,6),flat('#3a3e48'));pole.position.set(cx-sx*.7,1.2,cz-sz*.7);pole.castShadow=true;g.add(pole);
        const hd=new THREE.Group();hd.position.set(cx-sx*.7,2.2,cz-sz*.7);hd.rotation.y=(k%2?0:Math.PI/2)+(sx*sz<0?Math.PI:0);g.add(hd);const box=new THREE.Mesh(new THREE.BoxGeometry(.3,.82,.22),flat('#22262c'));hd.add(box);
        const L=['#3a1010','#3a2a08','#0a2a12'].map((col,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.04),new THREE.MeshBasicMaterial({color:lin(col)}));m.position.set(0,.25-i*.25,.12);hd.add(m);return m;});heads.push({L,axis:k%2});});
      SIG.push({x,z,ang,ax:[Math.sin(ang),Math.cos(ang)],heads,ph:ci*3.7,g});});
    O.signalPhase=(s,t)=>{const T=(t+s.ph)%22;return T<8?[0,'g']:T<10?[0,'a']:T<11?[0,'r']:T<19?[1,'g']:T<21?[1,'a']:[1,'r'];};
    O.signalOk=(s,hx,hz,t)=>{const[ax,st]=O.signalPhase(s,t),along=Math.abs(hx*s.ax[0]+hz*s.ax[1])>.7?0:1;return ax===along&&st==='g';};
    // the old blobs under the crossroads go
    (O.padMeshes||[]).forEach(m=>{if(SIG.some(s=>Math.hypot(s.x-m.position.x,s.z-m.position.z)<8))m.visible=false;});
    // green signs that stand on a carriageway, a freeway corridor or a crossroads step out to the verge
    let moved=0;scene.traverse(o=>{if(!o.isGroup||o.userData.L!=='props'||!o.children.some(c=>c.geometry&&c.geometry.type==='BoxGeometry'&&Array.isArray(c.material)))return;
      const bad=(x,z)=>clearAt(x,z,.9)||SIG.some(s=>Math.hypot(s.x-x,s.z-z)<9);if(!bad(o.position.x,o.position.z))return;
      const[b,d]=nearest(o.position.x,o.position.z,-1);let dx=o.position.x-(b?b[0]:o.position.x-1),dz=o.position.z-(b?b[1]:o.position.z);const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;
      let x=o.position.x,z=o.position.z;for(let k=0;k<40&&bad(x,z);k++){x+=dx*.5;z+=dz*.5;}if(bad(x,z))return;o.position.set(x,Math.max(H(x,z),0),z);moved++;});O.signsMoved=moved;}
}
// the freeway: two carriageways of two lanes, a gravel median with the railway, overhead wire poles, stations
if(MP){const off=(P,o)=>P.map((p,i)=>{const q=P[Math.min(P.length-1,i+1)],r=P[Math.max(0,i-1)];let dx=q[0]-r[0],dz=q[1]-r[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;return[p[0]+dz*o,p[1]-dx*o];});
  const lane=(()=>{const c=mkc(32,32),x=c.getContext('2d');PP(x,'#56585d',0,0,32,32);for(let k=0;k<90;k++)PP(x,['#4a4c50','#606268','#6a6c70'][k%3],HSH(k,11)*32,HSH(k,12)*32);PP(x,'#4c4e52',7,0,3,32);PP(x,'#4c4e52',22,0,3,32);
    PP(x,'#f4f2e8',1,0,1,32);PP(x,'#f4f2e8',30,0,1,32);PP(x,'#f4f2e8',15,2,2,10);PP(x,'#f4f2e8',15,18,2,10);const t=TX(c,true);return new THREE.MeshLambertMaterial({map:t,side:THREE.DoubleSide});})();
  const gravel=(()=>{const c=mkc(16,16),x=c.getContext('2d');for(let k=0;k<256;k++)PP(x,['#8a7a68','#9a8a74','#7a6a5a','#a89880'][(HSH(k,3)*4)|0],k%16,k>>4);PP(x,'#c8c4b8',0,0,1,16);PP(x,'#c8c4b8',15,0,1,16);return new THREE.MeshLambertMaterial({map:TX(c,true)});})();
  // fix 1: the freeway ends in a long, smooth merge: carriageways taper together, chevron island, merge signs; the railway stops first at a terminus with buffer stops
  O.MPd=MP;const MS=[0];for(let i=1;i<MP.length;i++)MS.push(MS[i-1]+Math.hypot(MP[i][0]-MP[i-1][0],MP[i][1]-MP[i-1][1]));const ML=MS[MS.length-1],TZ0=ML-170,TZ1=ML-15;
  const mf=s=>ss(TZ0,TZ1,s),mo=s=>3.6*(1-mf(s))+1.1*mf(s),mw=s=>4*(1-mf(s))+2.3*mf(s);O.mitchTaper=(s,o)=>{const f=mf(s);return o*(1-f)+(o>3.6?1.1:1.1)*f;};O.mitchEdge=s=>mo(s)+mw(s)/2;
  const dense=(()=>{const P=[];for(let i=1;i<MP.length;i++){const a=MP[i-1],b=MP[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(L/2));for(let k=(i>1?1:0);k<=n;k++)P.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n,MS[i-1]+L*k/n]);}return P;})();
  const vrib=(P,offF,wF,mat,yo,uScale)=>{const v=[],uv=[],idx=[];P.forEach((p,i)=>{const q=P[Math.min(P.length-1,i+1)],o=P[Math.max(0,i-1)];let dx=q[0]-o[0],dz=q[1]-o[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const of=offF(p[2]),w=wF(p[2]),cx=p[0]+dz*of,cz=p[1]-dx*of,y=deckH(cx,cz)+yo;
      [-1,1].forEach(s2=>{v.push(cx-dz*w/2*s2,y,cz+dx*w/2*s2);uv.push(s2<0?0:1,p[2]/(uScale||4));});if(i){const b=(i-1)*2;idx.push(b,b+1,b+2,b+1,b+3,b+2);}});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.userData.L='roads';scene.add(m);return m;};
  const lane1=(()=>{const c=mkc(16,32),x=c.getContext('2d');PP(x,'#56585d',0,0,16,32);for(let k=0;k<50;k++)PP(x,['#4a4c50','#606268','#6a6c70'][k%3],HSH(k,31)*16,HSH(k,32)*32);PP(x,'#4c4e52',7,0,3,32);PP(x,'#f4f2e8',1,0,1,32);PP(x,'#f4f2e8',14,0,1,32);return new THREE.MeshLambertMaterial({map:TX(c,true),side:THREE.DoubleSide});})();
  const mainP=dense.filter(p=>p[2]<=TZ0+60),tailP=dense.filter(p=>p[2]>=TZ0+58);
  [1,-1].forEach(sd=>{vrib(mainP,s=>sd*mo(s),mw,lane,.2);vrib(tailP,s=>sd*mo(s),mw,lane1,.2);});
  vrib(dense.filter(p=>p[2]<=TZ0-40),()=>0,()=>3.2,gravel,.205,8);
  const chev=(()=>{const c=mkc(16,16),x=c.getContext('2d');PP(x,'#56585d',0,0,16,16);for(let y=0;y<16;y++)for(let X=0;X<16;X++){if(((X>>1)+Math.abs(y-8)+40)%6===0)PP(x,'#f4f2e8',X,y,1,1);}PP(x,'#f4f2e8',0,0,1,16);PP(x,'#f4f2e8',15,0,1,16);return new THREE.MeshLambertMaterial({map:TX(c,true)});})();
  vrib(dense.filter(p=>p[2]>=TZ0-42&&p[2]<=TZ1),()=>0,s=>Math.max(.05,2*mo(s)-mw(s)),chev,.204,3);
  // the railway: from the city terminus (just clear of the crossroads) to the last station before the merge, buffer stops at both ends
  const RS0=14,RS1=TZ0-70;const railP=dense.filter(p=>p[2]>=RS0&&p[2]<=RS1).map(p=>[p[0],p[1]]);const RP=ribbon(railP,1.6,new THREE.MeshLambertMaterial({map:railT}),.22,true);
  [[railP[0],railP[1]],[railP[railP.length-1],railP[railP.length-2]]].forEach(([p,q])=>{const a=Math.atan2(p[0]-q[0],p[1]-q[1]),g=new THREE.Group();g.position.set(p[0],deckH(p[0],p[1])+.22,p[1]);g.rotation.y=a;g.userData.L='props';scene.add(g);
    add(g,new THREE.BoxGeometry(1.5,.5,.3),flat('#c8344a'),0,.35,0);for(let k=-1;k<=1;k+=2)add(g,new THREE.BoxGeometry(.3,.12,.32),flat('#f4f2ec'),k*.4,.62,0);add(g,new THREE.BoxGeometry(.18,.5,.6),flat('#5a5e64'),.6,.25,-.3);add(g,new THREE.BoxGeometry(.18,.5,.6),flat('#5a5e64'),-.6,.25,-.3);});
  // merge signs: a yellow diamond on each verge before the taper
  {const c=mkc(24,24),x=c.getContext('2d');x.translate(12,12);x.rotate(Math.PI/4);PP(x,'#1c1c1e',-8,-8,16,16);PP(x,'#f2c84a',-7,-7,14,14);x.setTransform(1,0,0,1,0,0);PP(x,'#1c1c1e',8,6,2,12);PP(x,'#1c1c1e',14,6,2,5);for(let k=0;k<5;k++)PP(x,'#1c1c1e',13-k,11+k,2,1);
    const sm=new THREE.MeshLambertMaterial({map:TX(c),transparent:true,alphaTest:.5,side:THREE.DoubleSide});[TZ0-90,TZ0-40].forEach(s=>{const p=dense.find(q=>q[2]>=s);if(!p)return;const i=dense.indexOf(p),q=dense[Math.min(dense.length-1,i+1)],a=Math.atan2(q[0]-p[0],q[1]-p[1]);
      [1,-1].forEach(sd=>{const dx=Math.sin(a),dz=Math.cos(a),of=sd*(mo(s)+mw(s)/2+1.2),x=p[0]+dz*of,z=p[1]-dx*of,g=new THREE.Group();g.position.set(x,Math.max(H(x,z),0),z);g.rotation.y=a+Math.PI;g.userData.L='props';scene.add(g);
        add(g,new THREE.CylinderGeometry(.05,.05,1.8,5),flat('#9aa0a6'),0,.9,0);const pl=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),sm);pl.position.set(0,2,0.04);g.add(pl);});});}
  // guide posts that stood on the freeway move to its new kerb line
  scene.traverse(o=>{if(!o.isInstancedMesh||o.userData.L!=='props'||!o.geometry.parameters||Math.abs((o.geometry.parameters.height||0)-.85)>.01)return;const m4=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3();let mv=0;
    for(let i=0;i<o.count;i++){o.getMatrixAt(i,m4);m4.decompose(p,q,sc);if(mitchD(p.x,p.z)>7.2)continue;let bi=0,bd=1e9;for(let k=0;k<dense.length;k+=2){const d=(dense[k][0]-p.x)**2+(dense[k][1]-p.z)**2;if(d<bd){bd=d;bi=k;}}
      const c=dense[bi],n=dense[Math.min(dense.length-1,bi+1)],m=dense[Math.max(0,bi-1)];let dx=n[0]-m[0],dz=n[1]-m[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const side=((p.x-c[0])*dz-(p.z-c[1])*dx)>=0?1:-1,of=side*(O.mitchEdge(c[2])+.7);
      const x=c[0]+dz*of,z=c[1]-dx*of;p.set(x,deckH(x,z)-.05,z);m4.compose(p,q,sc);o.setMatrixAt(i,m4);mv++;}o.instanceMatrix.needsUpdate=true;O.postsMoved=(O.postsMoved||0)+mv;});
  O.MS=MS;

  // overhead wire poles every 9 units, a wire on top
  const PO=[];let acc=0;for(let i=1;i<RP.length;i++){const a=RP[i-1],b=RP[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]);acc+=L;if(acc>=9){acc=0;PO.push([b[0],b[1],Math.atan2(b[0]-a[0],b[1]-a[1])]);}}
  const pg=new THREE.BoxGeometry(.1,2.4,.1);pg.translate(0,1.2,0);const im=new THREE.InstancedMesh(pg,flat('#8a9098'),PO.length*2),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),one=new THREE.Vector3(1,1,1);
  const ag=new THREE.BoxGeometry(1.5,.08,.08);ag.translate(0,2.35,0);
  PO.forEach(([x,z,a],i)=>{e.set(0,a,0);q.setFromEuler(e);m4.compose(v.set(x+Math.cos(a)*.95,deckH(x,z)+.2,z-Math.sin(a)*.95),q,one);im.setMatrixAt(i*2,m4);m4.compose(v.set(x,deckH(x,z)+.2,z),q,new THREE.Vector3(1,0,1));im.setMatrixAt(i*2+1,m4);});
  im.castShadow=true;im.frustumCulled=false;im.userData.L='props';scene.add(im);
  const arms=new THREE.InstancedMesh(ag,flat('#8a9098'),PO.length);PO.forEach(([x,z,a],i)=>{e.set(0,a+Math.PI/2,0);q.setFromEuler(e);m4.compose(v.set(x+Math.cos(a)*.3,deckH(x,z)+.2,z-Math.sin(a)*.3),q,one);arms.setMatrixAt(i,m4);});arms.frustumCulled=false;arms.userData.L='props';scene.add(arms);
  // stations in the median
  let L0=0;const RS=[0];for(let i=1;i<RP.length;i++){L0+=Math.hypot(RP[i][0]-RP[i-1][0],RP[i][1]-RP[i-1][1]);RS.push(L0);}
  const at=s=>{s=Math.max(0,Math.min(L0-.01,s));let i=1;while(i<RS.length-1&&RS[i]<s)i++;const a=RP[i-1],b=RP[i],t=(s-RS[i-1])/(RS[i]-RS[i-1]||1);return{x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,a:Math.atan2(b[0]-a[0],b[1]-a[1])};};
  O.trainAt=at;O.trainLen=L0;
  const STN=[['Leederville',.07],['Glendalough',.17],['Stirling',.3],['Warwick',.48],['Whitfords',.66],['Edgewater',.82],['Joondalup',.95]];O.stations=[];
  STN.forEach(([nm,f])=>{const p=at(L0*f);if(p.z>WZ)return;const g=new THREE.Group();g.position.set(p.x,deckH(p.x,p.z)+.2,p.z);g.rotation.y=p.a;g.userData.L='build';scene.add(g);O.stations.push([nm,p.x,p.z]);
    [-1,1].forEach(s=>{add(g,new THREE.BoxGeometry(.7,.35,6),flat('#c8c4b8'),s*1.15,.17,0);add(g,new THREE.BoxGeometry(.7,.04,6),flat('#f2d24a'),s*1.15,.36,0);for(let k=-2;k<=2;k+=2)add(g,new THREE.BoxGeometry(.08,1.6,.08),flat('#e8ecf0'),s*1.3,1.1,k*1.2);add(g,new THREE.BoxGeometry(.9,.08,6.2),flat('#3e7d9c'),s*1.15,1.9,0);});
    const sc=mkc(64,12),sx=sc.getContext('2d');PP(sx,'#1d3a6e',0,0,64,12);sx.fillStyle='#f4f2ec';sx.font='bold 9px monospace';sx.textAlign='center';sx.fillText(nm.toUpperCase(),32,9);const sm=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.42),new THREE.MeshBasicMaterial({map:TX(sc),side:THREE.DoubleSide}));sm.position.set(1.5,1.5,0);sm.rotation.y=Math.PI/2;g.add(sm);});
  // the suburban electric train (three cars), up and down the line, stopping at the stations
  const tc=mkc(64,16),tx=tc.getContext('2d');PP(tx,'#f4f2ec',0,0,64,16);PP(tx,'#1d3a6e',0,11,64,3);PP(tx,'#f2d24a',0,10,64,1);for(let X=3;X<60;X+=7){PP(tx,'#2a2230',X,3,5,5);PP(tx,'#7ab0d0',X+1,4,3,2);PP(tx,'#4a7090',X+1,6,3,1);}PP(tx,'#5a6068',30,2,3,9);
  const tg=new THREE.Group();tg.userData.L='veh';scene.add(tg);const tm=new THREE.MeshLambertMaterial({map:TX(tc)}),tt=flat('#d8dce0'),tcar=[];
  for(let k=0;k<3;k++){const c=new THREE.Group();const b=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.3,4.4),[tm,tm,tt,tt,flat('#1d3a6e'),flat('#1d3a6e')]);b.position.y=.85;b.castShadow=true;c.add(b);const pan=new THREE.Mesh(new THREE.BoxGeometry(.6,.3,.1),flat('#3a3e48'));pan.position.y=1.65;c.add(pan);tg.add(c);tcar.push(c);}
  O.train={s:L0*.3,dir:1,wait:0,cars:tcar,stops:STN.map(s=>s[1]*L0)};}
// sparse traffic: little cars in their lanes (drive on the left), both directions, kept near Kip
{const RT=[];const addR=(P,offs)=>{let L=0;const S=[0];for(let i=1;i<P.length;i++){L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);S.push(L);}if(L>20)RT.push({P,S,L,offs});};
  ROADS.forEach(r=>{if(N&&r===N.cityRoad)return;addR(r.p,[1]);});if(N)N.roads.forEach(r=>{const P=r.draw||r.p;if(r===N.main&&MP){const z0=MP[MP.length-1][1];addR(P.filter(q=>q[1]<=z0+1),[1.1]);}else addR(P,[1]);});if(MP)addR(MP,[2.6,4.6]);if(SOUTH&&SOUTH.road)addR(SOUTH.road,[1.1]);
  const posOn=(R,s,o,dir)=>{s=Math.max(0,Math.min(R.L-.01,s));let i=1;while(i<R.S.length-1&&R.S[i]<s)i++;const a=R.P[i-1],b=R.P[i],t=(s-R.S[i-1])/(R.S[i]-R.S[i-1]||1);let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const fx=dx*dir,fz=dz*dir;
    return{x:a[0]+(b[0]-a[0])*t+fz*o,z:a[1]+(b[1]-a[1])*t-fx*o,a:Math.atan2(fx,fz)};};
  const COLS=['#c8344a','#f4f2ec','#2f6a74','#e8b860','#3e7d5c','#1d3a6e','#9aa0a6','#e86a1a','#2a2a30','#d8d0bc'];
  const wc=mkc(16,8),wx=wc.getContext('2d');PP(wx,'#2a2230',0,0,16,8);PP(wx,'#8ab4cc',1,1,6,6);PP(wx,'#8ab4cc',9,1,6,6);PP(wx,'#c8e0ec',2,1,2,2);const winM=new THREE.MeshLambertMaterial({map:TX(wc)});
  const CARS=[];for(let k=0;k<22;k++){const g=new THREE.Group();g.userData.L='veh';const c=COLS[k%COLS.length];const bc=mkc(24,8),bx=bc.getContext('2d');PP(bx,c,0,0,24,8);PP(bx,shc(c,1.2),0,0,24,1);PP(bx,shc(c,.6),0,7,24,1);PP(bx,shc(c,.7),8,1,1,6);PP(bx,shc(c,.7),15,1,1,6);PP(bx,'#2a2230',3,6,4,2);PP(bx,'#2a2230',17,6,4,2);
    const bm=new THREE.MeshLambertMaterial({map:TX(bc)}),van=k%5===0;const b=new THREE.Mesh(new THREE.BoxGeometry(1.15,.5,van?2.8:2.4),[bm,bm,flat(c),flat(c),flat('#e8e4d8'),flat('#d8323a')]);b.position.y=.42;b.castShadow=true;g.add(b);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(1.0,.42,van?2.2:1.2),[winM,winM,flat(c),flat(c),winM,winM]);cab.position.set(0,.88,van?-.2:-.1);g.add(cab);
    [[-.5,.75],[.5,.75],[-.5,-.75],[.5,-.75]].forEach(([a,z2])=>{const w=new THREE.Mesh(new THREE.BoxGeometry(.18,.32,.32),flat('#1c1c1e'));w.position.set(a*1.05,.18,z2*(van?1.2:1));g.add(w);});
    const hl=new THREE.Mesh(new THREE.BoxGeometry(.9,.08,.04),new THREE.MeshBasicMaterial({color:0xfff2c0}));hl.position.set(0,.5,(van?1.4:1.2)+.01);g.add(hl);
    g.visible=false;scene.add(g);CARS.push({g,R:null,s:0,dir:1,o:1,v:10+HSH(k,1)*6});}
  const spawn=(c,px,pz)=>{for(let t=0;t<14;t++){const R=RT[(Math.random()*RT.length)|0],s=Math.random()*R.L,o=R.offs[(Math.random()*R.offs.length)|0],dir=Math.random()<.5?1:-1,p=posOn(R,s,o,dir),d=Math.hypot(p.x-px,p.z-pz);if(d<40||d>170)continue;Object.assign(c,{R,s,o,dir});c.g.visible=true;return;}c.g.visible=false;c.R=null;};
  O.traffic=(dt,px,pz)=>{CARS.forEach(c=>{if(!c.R||Math.hypot(c.g.position.x-px,c.g.position.z-pz)>210){spawn(c,px,pz);if(!c.R)return;}
      if(O.signals&&O.signals.length){const hx=Math.sin(c.g.rotation.y),hz=Math.cos(c.g.rotation.y);const red=O.signals.find(s=>{const dx=s.x-c.g.position.x,dz=s.z-c.g.position.z,d=Math.hypot(dx,dz);return d>6.5&&d<11&&(dx*hx+dz*hz)/d>.6&&!O.signalOk(s,hx,hz,O.t);});if(red)return;}c.s+=c.v*c.dir*dt;if(c.s<0||c.s>c.R.L){c.R=null;c.g.visible=false;return;}const p=posOn(c.R,c.s,(c.R.P===O.MPd&&O.mitchTaper)?O.mitchTaper(c.s,c.o):c.o,c.dir);
      if(Math.hypot(p.x-px,p.z-pz)<3.2&&ST.inCar){c.s-=c.v*c.dir*dt;return;}c.g.position.set(p.x,deckH(p.x,p.z)+.2,p.z);c.g.rotation.y=p.a;});};
  O.carsN=CARS.length;O.roadsT=RT.length;}

