// ===== Outer world built with the real engines (Look Lab ?owengine, Paul 14 Nov 2026: 'ทำ map ด้วย engine: Rottnest กับ outer world') =====
// Phase 3, first pass. The same map data, rebuilt by the library engines (parts 188-engine-*), no look-alikes:
//  - RoadEngine: every road of the outer world (the city ribbons and every street, arterial, lane and ramp of the road kit, from their
//    own centre lines) as one joined network: smooth 6% profiles, real junction pads, kerbs, lines. The old road meshes are hidden.
//  - TerrainEngine: the ground of the Perth map (Fremantle to the airport) from its own heights, fitted to the road beds with the road
//    engine's groundAt (cut/fill + blend), in 50-unit tiles built near the car first. The old ground hides once every tile is in.
//  - FoliageEngine: grass, flowers and bushes round the car, never on roads, sand, water, towns or under buildings.
// Kip and the car stand on the engine ground and roads (OWG_HOOK in the part with groundAt). Includes the CBD, Perth Water and
// South Perth (Paul allowed it, 14 Nov 2026): nothing there moves, the engines only redraw ground and roads in place.
// OWENGINE_LIVE turns it on for everyone once Paul has tested it on his phone.
const OWENGINE_LIVE=false,OWENG=(OWENGINE_LIVE||/[?&#]owengine\b/.test(location.search+location.hash))&&typeof RoadEngine!=='undefined'&&typeof TerrainEngine!=='undefined';
/* built on the first frame the outer world is open, after every town, station and house of the map exists */
if(OWENG){const owengRun=()=>{try{(()=>{const t0=performance.now(),E={tiles:[],todo:[],done:0};window.__OWE=E;
  const q=String((typeof GFX!=='undefined'&&GFX.level)||'').toLowerCase(),LOW=q.startsWith('l'),MED=q.startsWith('m');
  // ---- 1. roads: centre lines from the city ribbons and the road kit ----
  const lines=[];const inWorld=p=>p&&isFinite(p[0])&&isFinite(p[1]);
  const clean=P=>{const o=[];P.forEach(p=>{if(!inWorld(p))return;const l=o[o.length-1];if(!l||Math.hypot(p[0]-l[0],p[1]-l[1])>.6)o.push([p[0],p[1]]);});return o;};
  RIBS.forEach(r=>{if(!r.m.visible||r.hidden||r.pts===RAIL||r.w<2)return;/* narrow ribbons (1.6) are the other railway lines *//* the railway is drawn as a ribbon too: it stays as it is */const P=clean(r.pts);if(P.length<2)return;lines.push({P,w:r.w,kind:r.w>=4?'art':'street',deck:true,m:r.m});});
  (O.rkLines||[]).forEach(l=>{if(!/^(street|art|lane|ramp)$/.test(l.kind))return;const P=clean(l.P);if(P.length<2)return;
    let len=0;for(let i=1;i<P.length;i++)len+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(len<1.5)return;lines.push({P,w:l.w,kind:l.kind});});
  /* the same street often comes as several short strips: join the ones that meet end to end with the same kind and width */
  {const key=p=>Math.round(p[0]*2)+','+Math.round(p[1]*2);let merged=true,guard=0;while(merged&&guard++<6){merged=false;const ends=new Map();lines.forEach((l,i)=>{if(l.gone)return;[key(l.P[0]),key(l.P[l.P.length-1])].forEach(k=>{(ends.get(k)||ends.set(k,[]).get(k)).push(i);});});
    ends.forEach(ids=>{if(ids.length!==2)return;const a=lines[ids[0]],b=lines[ids[1]];if(a===b||a.gone||b.gone||a.deck||b.deck||a.kind!==b.kind||Math.abs(a.w-b.w)>.2)return;
      const A=a.P,B=b.P,ka=[key(A[0]),key(A[A.length-1])],kb=[key(B[0]),key(B[B.length-1])];let P=null;
      if(ka[1]===kb[0])P=A.concat(B.slice(1));else if(ka[1]===kb[1])P=A.concat(B.slice(0,-1).reverse());else if(ka[0]===kb[1])P=B.concat(A.slice(1));else if(ka[0]===kb[0])P=A.slice().reverse().concat(B.slice(1));
      if(!P)return;/* never join into a hairpin: the turn at the joint must stay under about 70 degrees */{const n=(ka[1]===kb[0]||ka[1]===kb[1])?A.length-1:(ka[0]===kb[1]?B.length-1:A.length-1);const p0=P[n-1],p1=P[n],p2=P[n+1];if(p0&&p2){const ux=p1[0]-p0[0],uz=p1[1]-p0[1],vx=p2[0]-p1[0],vz=p2[1]-p1[1],c=(ux*vx+uz*vz)/((Math.hypot(ux,uz)*Math.hypot(vx,vz))||1);if(c<.35)return;}}a.P=P;b.gone=true;merged=true;});}
    for(let i=lines.length-1;i>=0;i--){if(!lines[i].gone)lines[i].P=clean(lines[i].P);const l=lines[i];let len=0;if(!l.gone)for(let k=1;k<l.P.length;k++)len+=Math.hypot(l.P[k][0]-l.P[k-1][0],l.P[k][1]-l.P[k-1][1]);/* stubs shorter than a junction pad would be cut back to nothing */if(l.gone||l.P.length<2||len<1.5)lines.splice(i,1);}}
  /* this pass rebuilds the Perth map (Fremantle to the airport); the north and south stretches keep their old roads and ground for now.
     Every centre line is clipped at the map edge, where it meets the old road exactly. */
  {const IN=(p)=>p[0]>=0&&p[1]>=0&&p[0]<=WX&&p[1]<=WZ,cut=(a,b)=>{let t0=0,t1=1;const dx=b[0]-a[0],dz=b[1]-a[1];[[-dx,a[0]],[dx,WX-a[0]],[-dz,a[1]],[dz,WZ-a[1]]].forEach(([p,q])=>{if(p===0){if(q<0)t1=-1;return;}const r=q/p;if(p<0)t0=Math.max(t0,r);else t1=Math.min(t1,r);});return t0<=t1?[[a[0]+dx*t0,a[1]+dz*t0],[a[0]+dx*t1,a[1]+dz*t1]]:null;};
    const out=[];lines.forEach(l=>{let cur=null;for(let i=1;i<l.P.length;i++){const c=cut(l.P[i-1],l.P[i]);if(!c){if(cur){out.push(cur);cur=null;}continue;}if(!cur)cur={...l,P:[c[0]]};cur.P.push(c[1]);if(!IN(l.P[i])){out.push(cur);cur=null;}}if(cur)out.push(cur);});
    lines.length=0;out.forEach(l=>{l.P=clean(l.P);let len=0;for(let k=1;k<l.P.length;k++)len+=Math.hypot(l.P[k][0]-l.P[k-1][0],l.P[k][1]-l.P[k-1][1]);if(l.P.length>=2&&len>=1.5)lines.push(l);});}
  const gy=(x,z)=>Math.max(H(x,z),H(x+.6,z),H(x-.6,z),H(x,z+.6),H(x,z-.6));const roadH=(x,z,deck)=>(deck&&H(x,z)<.5?deckH(x,z)/* city roads lift to deck height only over water (bridges); on land every road follows the same ground so junctions meet level */:Math.max(gy(x,z),.05))+(O.brLift?O.brLift(x,z):0);
  /* a kit street that runs under a house was hidden by it in the old map: drop the stretches under buildings */
  {/* roofs rasterised at 2 cells per unit from every building mesh (merged house rows too): a cell is 'under a building' when a roof or top face
      stands more than .8 over the ground there */
    const RR=2,RW=WX*RR+1,RD=WZ*RR+1,ROOF=new Uint8Array(RW*RD),v=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()];scene.updateMatrixWorld(true);
    scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||!o.geometry.attributes.position)return;let L=null;for(let q=o;q;q=q.parent)if(q.userData&&q.userData.L){L=q.userData.L;break;}if(L!=='build')return;
      const g=o.geometry,p=g.attributes.position,ix=g.index,n=ix?ix.count/3:p.count/3;
      for(let t=0;t<n;t++){for(let k=0;k<3;k++)v[k].fromBufferAttribute(p,ix?ix.getX(t*3+k):t*3+k).applyMatrix4(o.matrixWorld);
        const cy=(v[0].y+v[1].y+v[2].y)/3,cx=(v[0].x+v[1].x+v[2].x)/3,cz=(v[0].z+v[1].z+v[2].z)/3;if(cx<0||cz<0||cx>WX||cz>WZ||cy<H(cx,cz)+.8)continue;
        const ux=v[1].x-v[0].x,uz=v[1].z-v[0].z,wx=v[2].x-v[0].x,wz=v[2].z-v[0].z,ar=Math.abs(ux*wz-uz*wx)/2;if(ar<1e-4)continue;
        const x0=Math.max(0,Math.ceil(Math.min(v[0].x,v[1].x,v[2].x)*RR)),x1=Math.min(RW-1,Math.floor(Math.max(v[0].x,v[1].x,v[2].x)*RR)),z0=Math.max(0,Math.ceil(Math.min(v[0].z,v[1].z,v[2].z)*RR)),z1=Math.min(RD-1,Math.floor(Math.max(v[0].z,v[1].z,v[2].z)*RR));
        if((x1-x0)*(z1-z0)>400)continue;const d=(v[1].z-v[2].z)*(v[0].x-v[2].x)+(v[2].x-v[1].x)*(v[0].z-v[2].z);
        for(let j=z0;j<=z1;j++)for(let i=x0;i<=x1;i++){const x=i/RR,z=j/RR,l1=((v[1].z-v[2].z)*(x-v[2].x)+(v[2].x-v[1].x)*(z-v[2].z))/d,l2=((v[2].z-v[0].z)*(x-v[2].x)+(v[0].x-v[2].x)*(z-v[2].z))/d;if(l1<0||l2<0||l1+l2>1)continue;ROOF[j*RW+i]=1;}}});
    const under=E.under=(x,z)=>{if(x<0||z<0||x>WX||z>WZ)return false;return ROOF[Math.round(z*RR)*RW+Math.round(x*RR)]===1;};
    const out=[];let cut=0;lines.forEach(l=>{if(l.deck){out.push(l);return;}let cur=[];const flush=()=>{if(cur.length>=2)out.push({...l,P:cur});cur=[];};
      for(let i=0;i<l.P.length;i++){const p=l.P[i];if(i){const a=l.P[i-1],n=Math.max(1,Math.ceil(Math.hypot(p[0]-a[0],p[1]-a[1])/.5));for(let k=1;k<=n;k++){const q=[a[0]+(p[0]-a[0])*k/n,a[1]+(p[1]-a[1])*k/n];if(under(q[0],q[1])){cut++;if(cur.length)flush();}else{if(!cur.length||k===n||Math.hypot(q[0]-cur[cur.length-1][0],q[1]-cur[cur.length-1][1])>2)cur.push(q);}}}else if(!under(p[0],p[1]))cur.push(p);}flush();});
    /* an end that stops at a wall steps back 1.6 so its kerb, end cap or junction pad never pokes under the house */
    const nearRoof=p=>{for(let a=0;a<8;a++)if(under(p[0]+Math.cos(a*.785)*1.3,p[1]+Math.sin(a*.785)*1.3))return true;return under(p[0],p[1]);};
    const shorten=(P,d)=>{while(P.length>=2&&d>0){const a=P[P.length-1],b=P[P.length-2],l=Math.hypot(a[0]-b[0],a[1]-b[1]);if(l>d){P[P.length-1]=[a[0]+(b[0]-a[0])*d/l,a[1]+(b[1]-a[1])*d/l];return P;}P.pop();d-=l;}return P;};
    out.forEach(l=>{if(l.deck)return;if(nearRoof(l.P[l.P.length-1]))shorten(l.P,1.6);if(l.P.length>=2&&nearRoof(l.P[0])){l.P.reverse();shorten(l.P,1.6);l.P.reverse();}});
    lines.length=0;out.forEach(l=>{l.P=clean(l.P);let len=0;for(let k=1;k<l.P.length;k++)len+=Math.hypot(l.P[k][0]-l.P[k-1][0],l.P[k][1]-l.P[k-1][1]);if(l.P.length>=2&&len>=2)lines.push(l);});E.underCut=cut;}
  const DH=new Map();lines.forEach(l=>{if(!l.deck)return;for(let i=1;i<l.P.length;i++){const a=l.P[i-1],b=l.P[i],r=l.w/2+.5;for(let gx=Math.floor((Math.min(a[0],b[0])-r)/8);gx<=Math.floor((Math.max(a[0],b[0])+r)/8);gx++)for(let gz=Math.floor((Math.min(a[1],b[1])-r)/8);gz<=Math.floor((Math.max(a[1],b[1])+r)/8);gz++){const k=gx*100003+gz;(DH.get(k)||DH.set(k,[]).get(k)).push([a,b,r]);}}});
  const deckAt=(x,z)=>{const L=DH.get(Math.floor(x/8)*100003+Math.floor(z/8));return!!L&&L.some(s=>segDist(x,z,s[0],s[1])<s[2]);};
  const RG=new THREE.Group();RG.name='owengine-roads';scene.add(RG);RG.userData.L='roads';
  const N=RoadEngine.create({scene:RG,roundabouts:false,heightAt:(x,z)=>roadH(x,z,deckAt(x,z)),smooth:true,maxGrade:.08});E.N=N;
  /* carriageway widths as the map draws them (the kit's 'art' strip of 6.5 includes verges and footpaths; its carriageway is 3.1) */
  lines.forEach(l=>{const t=l.deck?{type:'arterial',lanes:4,lw:l.w/4,kerb:false,footpath:false,median:false}:l.kind==='art'?{type:'arterial',lanes:2,lw:1.6,kerb:.12,footpath:true,foot:.9}:l.kind==='street'?{type:'street',lanes:2,lw:1.1,kerb:.1,footpath:false}:l.kind==='ramp'?{type:'lane',lanes:2,lw:.8,kerb:false}:{type:'lane',lanes:2,lw:.6,kerb:false};
    if(O.brLift&&l.P.some((p,i)=>{if(!i)return O.brLift(p[0],p[1])>.3;const a=l.P[i-1],n=Math.ceil(Math.hypot(p[0]-a[0],p[1]-a[1]));for(let k=0;k<=n;k++)if(O.brLift(a[0]+(p[0]-a[0])*k/n,a[1]+(p[1]-a[1])*k/n)>.3)return true;return false;})){t.maxGrade=.3;t.smoothR=1;}/* roads that climb over the railway keep their bridge hump */l.id=N.road(l.P,t);});
  E.lines=lines.map(l=>({P:l.P,w:l.w,kind:l.kind,deck:!!l.deck,t:l.t}));E.tm={lines:Math.round(performance.now()-t0)};N.build();E.tm.build=Math.round(performance.now()-t0);/* the map keeps its own signals and signs */['patches','cracks','leaves','skids','headlights','parking','lights','signs'].forEach(n=>{try{N.setLayer(n,false);}catch(e){}});
  /* one draw per material: the engine adds every decal, sign and kerb as its own mesh (hundreds over a whole map) */
  (function mergeStatic(root){root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),by=new Map(),drop=[];
    root.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry||!o.geometry.attributes.position)return;let p=o.parent;while(p&&p!==root){if(!p.visible)return;p=p.parent;}if(!o.visible)return;
      const m=Array.isArray(o.material)?null:o.material;if(!m)return;const k=m.uuid;(by.get(k)||by.set(k,{m,list:[]}).get(k)).list.push(o);});
    by.forEach(({m,list})=>{if(list.length<2)return;const P=[],Nn=[],U=[],I=[];let base=0;const mx=new THREE.Matrix4(),nm=new THREE.Matrix3(),v=new THREE.Vector3();
      list.forEach(o=>{const g=o.geometry.index?o.geometry:o.geometry;mx.multiplyMatrices(inv,o.matrixWorld);nm.getNormalMatrix(mx);const pa=g.attributes.position,na=g.attributes.normal,ua=g.attributes.uv;
        for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(mx);P.push(v.x,v.y,v.z);if(na){v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();Nn.push(v.x,v.y,v.z);}else Nn.push(0,1,0);U.push(ua?ua.getX(i):0,ua?ua.getY(i):0);}
        if(g.index)for(let i=0;i<g.index.count;i++)I.push(g.index.getX(i)+base);else for(let i=0;i<pa.count;i++)I.push(i+base);base+=pa.count;drop.push(o);});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
      g.setIndex(base>65535?new THREE.Uint32BufferAttribute(I,1):new THREE.Uint16BufferAttribute(I,1));g.computeBoundingSphere();const me=new THREE.Mesh(g,m);me.receiveShadow=true;me.castShadow=list.some(o=>o.castShadow);me.name='owengine-merged';root.add(me);});
    drop.forEach(o=>{if(o.parent)o.parent.remove(o);});E.merged=drop.length;})(RG);
  E.tm.merge=Math.round(performance.now()-t0);
  /* cul-de-sac bulbs and turning circles of the road kit (the engine draws junctions, not dead ends) */
  {const asM=new THREE.MeshLambertMaterial({color:new THREE.Color('#5a5d61').convertSRGBToLinear(),polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});const ENDS=[];lines.forEach(l=>{ENDS.push(l.P[0],l.P[l.P.length-1]);});/* only real dead ends: a road's end lies inside the disc (other discs were round islands or plazas, and houses stand on them) */const D=(O.auDisc||[]).filter(d=>d[2]<5&&d[0]>0&&d[1]>0&&d[0]<WX&&d[1]<WZ&&ENDS.some(e=>Math.hypot(e[0]-d[0],e[1]-d[1])<d[2]+.3)&&![[0,0],[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>E.under&&E.under(d[0]+a*d[2]*.8,d[1]+b*d[2]*.8)));
    if(D.length){const P=[],I=[];D.forEach(([x,z,r])=>{const b=P.length/3,n=18;P.push(x,N.groundAt(x,z,roadH(x,z,false))+.035,z);for(let k=0;k<=n;k++){const a=k/n*6.2832,X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;P.push(X,N.groundAt(X,Z,roadH(X,Z,false))+.035,Z);if(k)I.push(b,b+k+1,b+k);}});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setIndex(I);g.computeVertexNormals();const m=new THREE.Mesh(g,asM);m.receiveShadow=true;m.name='owengine-bulbs';RG.add(m);E.bulbs=D.length;}
    /* Paul 14 Nov: road ends need their white kerb. A dead end gets a kerb bar across it; a turning-circle bulb gets a white kerb ring.
       Ends at the map edge (the old road carries on) and ends inside a junction or a bulb get none. */
    const kM=new THREE.MeshLambertMaterial({color:new THREE.Color('#ece8de').convertSRGBToLinear()}),bars=[],rings=[];
    const inJ=(x,z)=>(N.junctions||[]).some(j=>Math.hypot(j.c.x-x,j.c.z-z)<j.R+.6),inD=(x,z)=>D.some(d=>Math.hypot(d[0]-x,d[1]-z)<d[2]+.8),edge=(x,z)=>x<1||z<1||x>WX-1||z>WZ-1;
    N.roads.forEach(r=>{if(!r.cv)return;const L=r.cv.getLength();(r.kept||[[0,1]]).forEach(([a,b])=>{[[a,-1],[b,1]].forEach(([t,dir])=>{if(t>.001&&t<.999)return;const p=r.cv.getPointAt(t),tg=r.cv.getTangentAt(t);if(edge(p.x,p.z)||inJ(p.x,p.z)||inD(p.x,p.z))return;
      const y=(N.surfaceAt(p.x-tg.x*dir*.3,p.z-tg.z*dir*.3)??roadH(p.x,p.z,false));bars.push({x:p.x+tg.x*dir*.05,z:p.z+tg.z*dir*.05,y,a:Math.atan2(tg.x,tg.z),w:(r.W||2)+.3});});});});
    D.forEach(([x,z,rr])=>rings.push({x,z,r:rr,y:N.groundAt(x,z,roadH(x,z,false))+.035}));
    if(bars.length){const g=new THREE.BoxGeometry(1,.14,.28),im=new THREE.InstancedMesh(g,kM,bars.length),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler();
      bars.forEach((b,i)=>{q.setFromEuler(e.set(0,b.a,0));m4.compose(new THREE.Vector3(b.x,b.y+.05,b.z),q,new THREE.Vector3(b.w,1,1));im.setMatrixAt(i,m4);});im.receiveShadow=true;im.name='owengine-endkerbs';RG.add(im);}
    if(rings.length){const g=new THREE.TorusGeometry(1,.09,5,28);g.rotateX(Math.PI/2);const im=new THREE.InstancedMesh(g,kM,rings.length),m4=new THREE.Matrix4();
      rings.forEach((b,i)=>{m4.compose(new THREE.Vector3(b.x,b.y+.04,b.z),new THREE.Quaternion(),new THREE.Vector3(b.r,1,b.r));im.setMatrixAt(i,m4);});im.receiveShadow=true;im.name='owengine-bulbkerbs';RG.add(im);}
    E.endKerbs=bars.length;E.bulbKerbs=rings.length;}
  RG.traverse(o=>{o.__pxSkip=1;});
  /* what the wheels stand on: the top of the drawn road surface, rasterised once at 4 cells per unit (only up-facing triangles near the road profile, never poles or sign tops) */
  const SR=4,SW=WX*SR+1,SD=WZ*SR+1,SURF=new Float32Array(SW*SD).fill(NaN);
  {RG.updateMatrixWorld(true);const v=[new THREE.Vector3(),new THREE.Vector3(),new THREE.Vector3()];RG.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes.position)return;let vis=true;for(let q=o;q&&q!==RG;q=q.parent)if(!q.visible)vis=false;if(!vis)return;
    const g=o.geometry,p=g.attributes.position,ix=g.index,n=ix?ix.count/3:p.count/3;
    for(let t=0;t<n;t++){for(let k=0;k<3;k++)v[k].fromBufferAttribute(p,ix?ix.getX(t*3+k):t*3+k).applyMatrix4(o.matrixWorld);
      const ux=v[1].x-v[0].x,uy=v[1].y-v[0].y,uz=v[1].z-v[0].z,wx=v[2].x-v[0].x,wy=v[2].y-v[0].y,wz=v[2].z-v[0].z,nx=uy*wz-uz*wy,ny=uz*wx-ux*wz,nz=ux*wy-uy*wx,nl=Math.hypot(nx,ny,nz)||1;if(Math.abs(ny/nl)<.92)continue;
      const cx=(v[0].x+v[1].x+v[2].x)/3,cz=(v[0].z+v[1].z+v[2].z)/3,cy=(v[0].y+v[1].y+v[2].y)/3,es=N.surfaceAt(cx,cz);if(es===null||cy>es+.3||cy<es-.6)continue;
      const x0=Math.max(0,Math.ceil(Math.min(v[0].x,v[1].x,v[2].x)*SR)),x1=Math.min(SW-1,Math.floor(Math.max(v[0].x,v[1].x,v[2].x)*SR)),z0=Math.max(0,Math.ceil(Math.min(v[0].z,v[1].z,v[2].z)*SR)),z1=Math.min(SD-1,Math.floor(Math.max(v[0].z,v[1].z,v[2].z)*SR));
      const d=(v[1].z-v[2].z)*(v[0].x-v[2].x)+(v[2].x-v[1].x)*(v[0].z-v[2].z);if(Math.abs(d)<1e-9)continue;
      for(let j=z0;j<=z1;j++)for(let i=x0;i<=x1;i++){const x=i/SR,z=j/SR,l1=((v[1].z-v[2].z)*(x-v[2].x)+(v[2].x-v[1].x)*(z-v[2].z))/d,l2=((v[2].z-v[0].z)*(x-v[2].x)+(v[0].x-v[2].x)*(z-v[2].z))/d,l3=1-l1-l2;if(l1<-.02||l2<-.02||l3<-.02)continue;
        const y=l1*v[0].y+l2*v[1].y+l3*v[2].y,k=j*SW+i;if(!(SURF[k]>=y))SURF[k]=y;}}});}
  const surfAt=(x,z)=>{if(x<0||z<0||x>WX||z>WZ)return null;const v=SURF[Math.round(z*SR)*SW+Math.round(x*SR)];return v===v?v:null;};E.surfAt=surfAt;
  /* lamp posts, signs, bins and other small things of the old map that now stand on the new asphalt step to the nearest verge; old roundabout rings with no road left are hidden */
  const moveProps=()=>{let moved=0,ringed=0;const Bx=new THREE.Box3(),cand=[];scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh||o===RG)return;for(let q=o.parent;q;q=q.parent)if(q===RG||q.name==='owengine-ground')return;let L=null;for(let q=o;q;q=q.parent)if(q.userData&&q.userData.L){L=q.userData.L;break;}
      if(o.geometry&&o.geometry.type==='TorusGeometry'&&L==='roads'){const p=new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);if(p.x>0&&p.z>0&&p.x<WX&&p.z<WZ){o.visible=false;ringed++;}/* the engine draws its own junctions: the old roundabout kerb rings go */return;}
      if(L==='build'&&o.geometry){try{Bx.setFromObject(o);}catch(e){return;}const w=Bx.max.x-Bx.min.x,h=Bx.max.y-Bx.min.y;if(w<5&&h<.4){const cx=(Bx.min.x+Bx.max.x)/2,cz=(Bx.min.z+Bx.max.z)/2;if(cx>0&&cz>0&&cx<WX&&cz<WZ&&(O.auDisc||[]).some(d=>Math.hypot(d[0]-cx,d[1]-cz)<.7)){o.visible=false;ringed++;return;}}}/* the old turning-circle kerb rings at dead ends */if(/roads|ground|water|sky|chars|veh|plants|trees|fx/.test(String(L))||o.isInstancedMesh||o.isSkinnedMesh)return;try{Bx.setFromObject(o);}catch(e){return;}const w=Bx.max.x-Bx.min.x,d=Bx.max.z-Bx.min.z;if(w>1.6||d>1.6||w<.01)return;const cx=(Bx.min.x+Bx.max.x)/2,cz=(Bx.min.z+Bx.max.z)/2,sy=surfAt(cx,cz);/* old bridge piers left standing in open water beside the new deck */if(sy===null&&cx>0&&cz>0&&cx<WX&&cz<WZ&&H(cx,cz)<.05&&Bx.max.y-Bx.min.y>.3){let nr=false;for(let a=0;a<8&&!nr;a++)nr=surfAt(cx+Math.cos(a*.785)*.7,cz+Math.sin(a*.785)*.7)!==null;if(!nr){o.visible=false;E.piers=(E.piers||0)+1;return;}}if(sy===null||Bx.min.y>sy+1.2||Bx.max.y<sy+.05)return;cand.push([o,cx,cz]);});
    cand.forEach(([o,cx,cz])=>{for(let r=.5;r<=4;r+=.5){let ok=null;for(let a=0;a<16&&!ok;a++){const x=cx+Math.cos(a/16*6.283)*r,z=cz+Math.sin(a/16*6.283)*r;if(surfAt(x,z)===null&&surfAt(x+.4,z)===null&&surfAt(x-.4,z)===null&&surfAt(x,z+.4)===null&&surfAt(x,z-.4)===null&&H(x,z)>.3)ok=[x,z];}
      if(ok){const P=o.parent,a=P.worldToLocal(new THREE.Vector3(cx,0,cz)),b=P.worldToLocal(new THREE.Vector3(ok[0],fitH(ok[0],ok[1])-fitH(cx,cz),ok[1]));o.position.add(b.sub(a));o.updateMatrix();moved++;return;}}o.visible=false;E.hid=(E.hid||0)+1;});E.moved=moved;E.rings=ringed;E.cand=cand.length;};
  /* the old roads go: city ribbons and the road kit's merged chunks (streets, arterials, lanes, ramps, junction boxes, bulbs, crossings) */
  /* old road meshes lose only their triangles inside the Perth map: the north and south keep theirs */
  const trimmed=new Set(),trim=o=>{if(trimmed.has(o)||!o.geometry||!o.geometry.attributes.position)return;trimmed.add(o);o.updateMatrixWorld(true);const g=o.geometry,p=g.attributes.position,ix=g.index,n=ix?ix.count/3:p.count/3,keep=[],v=new THREE.Vector3();let cut=0;
    for(let t=0;t<n;t++){let cx=0,cz=0;for(let k=0;k<3;k++){v.fromBufferAttribute(p,ix?ix.getX(t*3+k):t*3+k).applyMatrix4(o.matrixWorld);cx+=v.x/3;cz+=v.z/3;}
      if(cx>=0&&cz>=0&&cx<=WX&&cz<=WZ){cut++;continue;}for(let k=0;k<3;k++)keep.push(ix?ix.getX(t*3+k):t*3+k);}
    if(!cut)return;if(!keep.length){o.visible=false;return;}const ng=g.clone();ng.setIndex(keep);o.geometry=ng;};
  const hideOld=()=>{RIBS.forEach(r=>{if(r.m&&!r.hidden&&r.pts!==RAIL&&r.w>=2)trim(r.m);});scene.traverse(o=>{if(o.isMesh&&o.name&&/^rk:/.test(o.name))trim(o);});};hideOld();
  // ---- 2. ground: the map's heights fitted to the road beds, baked once on a 1-unit grid ----
  const nearRail=(x,z)=>{for(let i=1;i<RAIL.length;i++)if(segDist(x,z,RAIL[i-1],RAIL[i])<2.2)return true;return false;};const X0=0,Z0=0,X1=WX,Z1=WZ,GW=WX+1,GD=WZ+1,FG=new Float32Array(GW*GD);
  for(let j=0;j<GD;j++)for(let i=0;i<GW;i++){const x=X0+i,z=Z0+j,h=H(x,z);let g=h>.05?N.groundAt(x,z,h):h;/* Paul 14 Nov: no lawn shelf over the river. By the water the road fill stays under the road and its kerb only; the blend that raised the bank goes */
    /* by the water (within 6 of the shore) the road fill only builds the embankment right under the road: full height to .8 from the road
       surface, gone 3.2 out, so no lawn shelf hangs over the river; then the last 2.5 units of bank ease down to just over the water */
    {const ci=Math.min(WZ-1,z)*WX+Math.min(WX-1,x);if(LAND[ci]&&DL[ci]<6&&h>.05){let dR=surfAt(x,z)!==null?0:9;for(const rr of [.8,1.6,2.4,3.2]){if(dR<9)break;for(let a=0;a<8;a++)if(surfAt(x+Math.cos(a*.785)*rr,z+Math.sin(a*.785)*rr)!==null){dR=rr;break;}}
      if(g>h){const keep=dR<=.8?1:dR>=9?0:Math.max(0,1-(dR-.8)/2.4);g=h+(g-h)*keep;}
      if(DL[ci]<2.5&&dR>1.6){const u=DL[ci]/2.5,k=u*u*(3-2*u);g=.06+(g-.06)*k;}}}
    /* and the water side of the bank: a shallow shelf for the first 2.5 units instead of a wall straight down to -0.9 */
    {const ci=Math.min(WZ-1,z)*WX+Math.min(WX-1,x);if(!LAND[ci]&&h<.05&&DW[ci]<2.5){const u=DW[ci]/2.5,k=u*u*(3-2*u);g=-.12+(h+.12)*k;}}/* the railway (in the freeway median too) keeps its own bed: no fill over it */if(nearRail(x,z))g=Math.min(g,h-.05);FG[j*GW+i]=g;}
  E.tm.grid=Math.round(performance.now()-t0);const fitH=(x,z)=>{if(x<X0||z<Z0||x>X1||z>Z1)return H(x,z);const fx=Math.min(GW-1.001,x-X0),fz=Math.min(GD-1.001,z-Z0),i=fx|0,j=fz|0,u=fx-i,w=fz-j,k=j*GW+i;return(FG[k]*(1-u)+FG[k+1]*u)*(1-w)+(FG[k+GW]*(1-u)+FG[k+GW+1]*u)*w;};
  E.fitH=fitH;moveProps();OWG_HOOK=(x,z)=>{/* wheels stand on the engine road surface wherever there is one (north and south too), else on the engine ground (fitted terrain tile top), else the old ground */const s=surfAt(x,z);if(s!==null)return s;const g=groundAt0(x,z);return x>=X0&&z>=Z0&&x<=X1&&z<=Z1&&H(x,z)>.05?fitH(x,z)+.02:g;};
  const PAL={/* Perth's coastal-plain greens: a touch drier and warmer than the island lawn */g0:'#4c7a2c',g1:'#5a8634',g2:'#68903c',g3:'#7a9a46',g4:'#8ea452',dry:'#a8a466',sand:'#f2ead6',sandB:'#e6dcc0',sandW:'#c9bc9a'};
  const TS=50;for(let tz=Z0;tz<Z1;tz+=TS)for(let tx=X0;tx<X1;tx+=TS)E.todo.push([tx,tz,Math.min(TS,X1-tx),Math.min(TS,Z1-tz)]);E.total=E.todo.length;
  const GG=new THREE.Group();GG.name='owengine-ground';scene.add(GG);GG.userData.L='ground';
  function buildTile(t){const[x0,z0,w,d]=t;const T=TerrainEngine.create({palette:PAL,size:[w,d],center:[x0+w/2,z0+d/2],res:LOW?1:.5,heightAt:fitH,seaLevel:0});
    T.mesh.position.y=.02;T.mesh.receiveShadow=true;T.mesh.__pxSkip=1;T.mesh.userData.L='ground';try{if(LOW)T.setQuality(0);else if(MED)T.setQuality(1);}catch(e){}GG.add(T.mesh);E.tiles.push({T,b:t});}
  // ---- 3. foliage round the car ----
  const boxes=[];{const B=new THREE.Box3();scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.geometry)return;let p=o,L=null;while(p){if(p.userData&&p.userData.L){L=p.userData.L;break;}p=p.parent;}
    if(L!=='build'&&L!=='mark'&&L!=='props')return;try{if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();B.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld);}catch(e){return;}
    const w=B.max.x-B.min.x,dd=B.max.z-B.min.z;if(w>30||dd>30||w<.2)return;boxes.push([B.min.x-.4,B.min.z-.4,B.max.x+.4,B.max.z+.4]);});}
  const BH=new Map();boxes.forEach(b=>{for(let i=Math.floor(b[0]/8);i<=Math.floor(b[2]/8);i++)for(let j=Math.floor(b[1]/8);j<=Math.floor(b[3]/8);j++){const k=i*100003+j;(BH.get(k)||BH.set(k,[]).get(k)).push(b);}});
  const inBox=(x,z)=>{const L=BH.get(Math.floor(x/8)*100003+Math.floor(z/8));return!!L&&L.some(b=>x>b[0]&&x<b[2]&&z>b[1]&&z<b[3]);};
  const LH=new Map();lines.forEach(l=>{for(let i=1;i<l.P.length;i++){const a=l.P[i-1],b=l.P[i],r=l.w/2+1.2;for(let gx=Math.floor((Math.min(a[0],b[0])-r)/8);gx<=Math.floor((Math.max(a[0],b[0])+r)/8);gx++)for(let gz=Math.floor((Math.min(a[1],b[1])-r)/8);gz<=Math.floor((Math.max(a[1],b[1])+r)/8);gz++){const k=gx*100003+gz;(LH.get(k)||LH.set(k,[]).get(k)).push([a,b,r]);}}});
  const nearRoad=(x,z)=>{const L=LH.get(Math.floor(x/8)*100003+Math.floor(z/8));return!!L&&L.some(s=>segDist(x,z,s[0],s[1])<s[2]);};
  const kindAt=(x,z)=>{const h=H(x,z);if(h<.1)return'water';const i=Math.min(WZ-1,Math.max(0,z|0))*WX+Math.min(WX-1,Math.max(0,x|0));if(LAND[i]&&DL[i]<2.2)return'sand';if(nearRoad(x,z))return'path';
    if(Math.hypot(x-CBDP[0],z-CBDP[1])<9||Math.hypot(x-FRP[0],z-FRP[1])<6)return'none';return'grass';};
  const F=typeof FoliageEngine!=='undefined'?FoliageEngine.create({scene:GG,bounds:[X0,Z0,X1,Z1],heightAt:(x,z)=>fitH(x,z)+.04,kindAt,keepOut:inBox,palette:{blades:['#4c8434','#5e963e','#72a848','#88b654','#9ec462']},
    density:{tuft:LOW?.9:1.5,flower:.3,bush:.025,tree:0},radius:LOW?24:34,chunk:10}):null;
  if(F){['reeds','saplings'].forEach(n=>{try{F.setLayer(n,false);}catch(e){}});try{if(LOW)F.setQuality(0);else if(MED)F.setQuality(1);}catch(e){}}E.F=F;
  E.ms=Math.round(performance.now()-t0);console.log('OWENGINE '+JSON.stringify(E.tm)+' roads '+lines.length+', junctions '+((N.junctions||[]).length)+', merged '+E.merged+', boxes '+boxes.length+', '+E.ms+' ms');
  // ---- each frame while the outer world is open: build the nearest ground tile, then move the foliage and the roads ----
  /* the old map ground: the main mesh and its copies on other camera layers (the town look draws one per pass) */const oldGs=()=>{const o=[];scene.traverse(m=>{if(m.isMesh&&m.geometry&&m.geometry.type==='PlaneGeometry'&&m.geometry.parameters&&m.geometry.parameters.width===WX&&m.geometry.parameters.height===WZ){let L=null;for(let p=m;p;p=p.parent)if(p.userData&&p.userData.L){L=p.userData.L;break;}if(L==='ground')o.push(m);}});return o;};let oldG=oldGs();
  const tS=performance.now();(function loop(){requestAnimationFrame(loop);if(!OPEN)return;const t=(performance.now()-tS)/1000;
    if(E.todo.length){const cx=ST.inCar?ST.carX:ST.x,cz=ST.inCar?ST.carZ:ST.z;let bi=0,bd=1e9;E.todo.forEach((b,i)=>{const d=Math.hypot(b[0]+b[2]/2-cx,b[1]+b[3]/2-cz);if(d<bd){bd=d;bi=i;}});
      const b=E.todo.splice(bi,1)[0];const t1=performance.now();try{buildTile(b);}catch(e){console.error('owengine tile',e);}E.done++;E.tileMs=(E.tileMs||0)+performance.now()-t1;
      if(!E.todo.length){oldG.forEach(m=>{m.visible=false;m.position.y=-60;m.updateMatrix();m.updateMatrixWorld(true);/* the town-look pass shows its ground again every frame: move it out of sight instead */});console.log('OWENGINE ground done: '+E.done+' tiles, '+Math.round(E.tileMs)+' ms');}}
    
    const cx=ST.inCar?ST.carX:ST.x,cz=ST.inCar?ST.carZ:ST.z;try{E.tiles.forEach(o=>o.T.update&&o.T.update(t));if(F)F.update(t,cx,cz,{push:[cx,cz]});N.update(t,1/60);}catch(e){}
    if((E.k=(E.k||0)+1)%180===0){hideOld();if(!E.todo.length){oldG=oldGs();oldG.forEach(m=>{m.visible=false;m.position.y=-60;m.updateMatrix();m.updateMatrixWorld(true);/* the town-look pass shows its ground again every frame: move it out of sight instead */});}}})();
})();}catch(e){console.error('owengine',e&&e.stack);}};(function owengWait(){if(OPEN)owengRun();else requestAnimationFrame(owengWait);})();}
