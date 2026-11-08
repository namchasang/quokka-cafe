// ---------- Detail 2 (Look Lab ?det2, Paul Nov 2026): sharp pixels, finer ground. Grass tufts everywhere on the island lawns,
// soft ragged edges where lawn meets path or sand, pebbles and fallen leaves, soft contact shade under buildings, warm light with
// cool shadows, and little motes of light drifting in the air. No blur. ----------
var DET2_LIVE=true;const DET2_ON=DET2_LIVE||/[?&#]det2\b/.test(location.search+location.hash);
function det2Build(){const r=mulberry32(8080);const ctex=c=>{const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t;};
  const tuftTex=(cols,seed)=>{const c=document.createElement('canvas');c.width=24;c.height=16;const x=c.getContext('2d');const rr=mulberry32(seed);
    for(let i=0;i<14;i++){const bx=2+rr()*20,h=5+rr()*10,lean=(rr()-.5)*4,col=cols[rr()*cols.length|0];for(let k=0;k<h;k++){const t=k/h;x.fillStyle=k>h-2?cols[0]:col;x.fillRect(Math.round(bx+lean*t),15-k,1,1);}}
    for(let i=0;i<3;i++)if(rr()<.35){x.fillStyle=['#f4e8a0','#f0a0b0','#ffffff','#c8a8e8'][rr()*4|0];x.fillRect(2+rr()*20|0,2+rr()*6|0,2,2);}return c;};
  const mats=[['#4a8a3a','#6aaa48','#8cc45a'],['#5a9a40','#7ab454','#a8d070'],['#6a9a40','#8ab050','#b8c868']].map((c,i)=>{const t=ctex(tuftTex(c,11+i*7));return new THREE.MeshLambertMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,depthWrite:false,emissive:0xffffff,emissiveMap:t,emissiveIntensity:.6});});
  const geo=(()=>{const a=new THREE.PlaneGeometry(.42,.24);a.translate(0,.12,0);const b=a.clone();b.rotateY(Math.PI/2);const g=new THREE.BufferGeometry();const pa=a.attributes.position.array,pb=b.attributes.position.array,ua=a.attributes.uv.array,na=a.attributes.normal.array,nb=b.attributes.normal.array;const P2=new Float32Array(pa.length*2);P2.set(pa);P2.set(pb,pa.length);const U2=new Float32Array(ua.length*2);U2.set(ua);U2.set(ua,ua.length);const N2=new Float32Array(na.length*2);N2.fill(0);for(let i=1;i<N2.length;i+=3)N2[i]=1;const I=a.index.array,I2=[];for(const v of I)I2.push(v);for(const v of I)I2.push(v+pa.length/3);g.setAttribute('position',new THREE.BufferAttribute(P2,3));g.setAttribute('uv',new THREE.BufferAttribute(U2,2));g.setAttribute('normal',new THREE.BufferAttribute(N2,3));g.setIndex(I2);return g;})();
  const ok=(x,z)=>{if(x>99.5||landD(x,z)<1.2)return false;if(pathD(x,z)<.75)return false;if(typeof BLANES!=='undefined'&&BLANES.some(l=>l[0][0]<99.5&&segD(x,z,l[0][0],l[0][1],l[1][0],l[1][1])<(l[2]||1.15)/2+.25))return false;
    for(const c of colliders)if(c.x1<1e8&&x>c.x1-.3&&x<c.x2+.3&&z>c.z1-.3&&z<c.z2+.3)return false;if(x>DECK.x1-1&&x<DECK.x2+1&&z>DECK.z1-1&&z<DECK.z2+1)return false;if(typeof islGround==='function'){const g=islGround(x,z);if(g&&g.g&&(g.g.t==='lake'||g.g.t==='sand'))return false;}return true;};
  const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S3=new THREE.Vector3(),P=new THREE.Vector3(),UP=new THREE.Vector3(0,1,0);
  const N=[5200,5200,3600];const inst=mats.map((m,i)=>{const im=new THREE.InstancedMesh(geo,m,N[i]);im.__pxSkip=1;return im;});const cnt=[0,0,0];
  const sx=TB.x1+2,sw=Math.min(99,TB.x2)-sx,sz0=TB.z1+2,sd=TB.z2-TB.z1-4;let tries=0;
  while((cnt[0]<N[0]||cnt[1]<N[1])&&tries<160000){tries++;const x=sx+r()*sw,z=sz0+r()*sd;if(!ok(x,z))continue;
    // clumps: tufts gather near path edges and fences, thinner in the open
    const k=r()<.42?2:(r()<.5?0:1);if(cnt[k]>=N[k])continue;const pe=pathD(x,z);if(pe>3&&r()<.35)continue;
    const s=.7+r()*.7;Q.setFromAxisAngle(UP,r()*Math.PI);S3.set(s,s*(.8+r()*.5),s);P.set(x,groundY(x,z)+.005,z);M.compose(P,Q,S3);inst[k].setMatrixAt(cnt[k]++,M);}
  inst.forEach((im,i)=>{im.count=cnt[i];im.instanceMatrix.needsUpdate=true;scene.add(im);});
  // ragged lawn edge: little grass fringe tufts right at the edge of every path
  const fr=new THREE.InstancedMesh(geo,mats[0],6000);fr.__pxSkip=1;let nf=0;
  for(const p of PATHS)for(let i=0;i<p.length-1;i++){const a=p[i],b=p[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);if(a[0]>99.5)continue;const nx=-(b[1]-a[1])/L,nz=(b[0]-a[0])/L;
    for(let d=0;d<L&&nf<6000;d+=.35){for(const sd of[-1,1]){if(r()<.35)continue;const o=.55+r()*.25,x=a[0]+(b[0]-a[0])*d/L+nx*sd*o,z=a[1]+(b[1]-a[1])*d/L+nz*sd*o;if(landD(x,z)<1)continue;
      let bad=false;for(const c of colliders)if(c.x1<1e8&&x>c.x1-.2&&x<c.x2+.2&&z>c.z1-.2&&z<c.z2+.2){bad=true;break;}if(bad)continue;
      const s=.45+r()*.4;Q.setFromAxisAngle(UP,r()*Math.PI);S3.set(s,s*.7,s);P.set(x,groundY(x,z)+.004,z);M.compose(P,Q,S3);fr.setMatrixAt(nf++,M);}}}
  fr.count=nf;fr.instanceMatrix.needsUpdate=true;scene.add(fr);
  // pebbles and fallen leaves scattered on the paths
  const pc=document.createElement('canvas');pc.width=8;pc.height=8;{const x=pc.getContext('2d');x.fillStyle='#8a8070';x.fillRect(2,3,4,3);x.fillStyle='#b0a690';x.fillRect(2,3,3,1);x.fillStyle='#5a5448';x.fillRect(2,5,4,1);}
  const lc=document.createElement('canvas');lc.width=8;lc.height=8;{const x=lc.getContext('2d');x.fillStyle='#b8862e';x.fillRect(2,3,4,2);x.fillRect(3,2,2,4);x.fillStyle='#7a5a20';x.fillRect(4,3,1,2);}
  const flatG=new THREE.PlaneGeometry(.22,.22);flatG.rotateX(-Math.PI/2);const mk2=(c)=>new THREE.MeshLambertMaterial({map:ctex(c),alphaTest:.5,depthWrite:false,emissive:0xffffff,emissiveMap:ctex(c),emissiveIntensity:.5});
  [[pc,1800],[lc,900]].forEach(([c,n])=>{const im=new THREE.InstancedMesh(flatG,mk2(c),n);im.__pxSkip=1;let k=0;
    for(let t=0;t<n*4&&k<n;t++){const p=PATHS[r()*PATHS.length|0];if(!p||p.length<2||p[0][0]>99.5)continue;const i=r()*(p.length-1)|0,a=p[i],b=p[i+1],u=r(),x=a[0]+(b[0]-a[0])*u+(r()-.5)*1,z=a[1]+(b[1]-a[1])*u+(r()-.5)*1;if(landD(x,z)<1)continue;
      Q.setFromAxisAngle(UP,r()*6.28);S3.set(1,1,1);P.set(x,groundY(x,z)+.03,z);M.compose(P,Q,S3);im.setMatrixAt(k++,M);}im.count=k;im.instanceMatrix.needsUpdate=true;scene.add(im);});
  // soft contact shade round the foot of every island building
  const ao=document.createElement('canvas');ao.width=32;ao.height=32;{const x=ao.getContext('2d');const g=x.createRadialGradient(16,16,4,16,16,16);g.addColorStop(0,'rgba(20,28,16,.55)');g.addColorStop(1,'rgba(20,28,16,0)');x.fillStyle=g;x.fillRect(0,0,32,32);}
  const aoM=new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(ao),transparent:true,depthWrite:false});const B=new THREE.Box3(),C=new THREE.Vector3();scene.updateMatrixWorld(true);let na=0;
  scene.children.forEach(g=>{if(!g.visible||!(g.isGroup||g.isMesh))return;B.setFromObject(g);if(B.isEmpty())return;const sz=B.getSize(C);if(sz.y<1.2||sz.x>14||sz.z>14||sz.x<1||sz.z<1)return;const c=scene.worldToLocal(B.getCenter(new THREE.Vector3()));if(c.x>99.5||c.x<-260)return;
    const q=new THREE.Mesh(new THREE.PlaneGeometry(sz.x+1.4,sz.z+1.4),aoM);q.rotation.x=-Math.PI/2;q.position.set(c.x,.025,c.z);q.renderOrder=-1;q.__pxSkip=1;scene.add(q);na++;});
  // motes of light drifting in the air near the camera
  const mg=new THREE.BufferGeometry(),MN=90,mp=new Float32Array(MN*3);for(let i=0;i<MN;i++){mp[i*3]=(r()-.5)*30;mp[i*3+1]=.4+r()*3;mp[i*3+2]=(r()-.5)*22;}mg.setAttribute('position',new THREE.BufferAttribute(mp,3));
  const motes=new THREE.Points(mg,new THREE.PointsMaterial({color:'#fff2c0',size:2,sizeAttenuation:false,transparent:true,opacity:.55,depthWrite:false}));motes.__pxSkip=1;scene.add(motes);
  det2Build.tick=t=>{if(!running)return;motes.visible=zoneOf(player.x)==='island'&&(typeof wxC==='undefined'||wxC.rain<.5);motes.position.set(camTarget.x,0,camTarget.z);const a=mg.attributes.position;
    for(let i=0;i<MN;i++){a.array[i*3+1]=.4+((t*.12+i*.37)%3);a.array[i*3]+=Math.sin(t*.6+i)*.004;}a.needsUpdate=true;const n=typeof NIGHT==='number'?NIGHT:0;motes.material.color.set(n>.4?'#c8f0a0':'#fff2c0');motes.material.opacity=.35+n*.35;const ei=.62*(1-.85*n);mats.forEach(m=>m.emissiveIntensity=ei);};
  det2Build.stats={tufts:cnt,fringe:nf,ao:na};// fine pixel grain on the ground: the ground pictures are only 4-16 px per metre, so each ground shader gets crisp 16 px-per-metre grain
  // worked out per pixel from the world position (grass speckle and short blade marks, sand and path pebbles); no new textures, nothing blurs
  let ng=0;scene.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.parameters)return;const p=o.geometry.parameters;if((p.width||0)*(p.height||0)<1500)return;const m=o.material;if(Array.isArray(m)||!m||!m.isMeshLambertMaterial||!m.map||!m.map.image)return;
    const ppm=m.map.image.width/(p.width/m.map.repeat.x);if(ppm>17||m.__det2)return;m.__det2=1;ng++;
    m.onBeforeCompile=sh=>{sh.vertexShader='varying vec3 vDW;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvDW=(modelMatrix*vec4(transformed,1.0)).xyz;');
      sh.fragmentShader='varying vec3 vDW;\n'+sh.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
      {vec2 c=floor(vDW.xz*16.);float h=fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);float h2=fract(h*91.7+.31);
       vec3 d=diffuseColor.rgb;float gr=smoothstep(.03,.12,d.g-max(d.r,d.b));float sd=smoothstep(.04,.16,d.r-d.b)*(1.-gr);
       float hb=fract(sin(dot(vec2(c.x,floor(c.y*.34)),vec2(27.17,61.73)))*13758.5);
       float v=(h<.1?-.09:(h>.92?.08:0.))*(gr+sd*.7)+(hb>.94?-.11:(hb<.03?.07:0.))*gr;
       if(sd>.3&&h2>.982)v-=.22;diffuseColor.rgb*=1.+v;}`);};m.needsUpdate=true;});
  det2Build.stats.grain=ng;window.__det2=det2Build.stats;}
