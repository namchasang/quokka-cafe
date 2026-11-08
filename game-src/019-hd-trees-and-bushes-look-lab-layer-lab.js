// ---------- HD trees and bushes (Look Lab layer: ?lab or ?trees until TREES_HD_LIVE is true) ----------
// Twice the pixels, seven shades per tree with ordered dithering, leaf clumps, sky gaps, a sunlit rim, bark with branches, and a gentle sway in the wind.
const TREES_HD_LIVE=false;
const TREES_HD={on:false,live:false,t:{value:0},sets:[]};
function canopyHD(W,H,blobs,pal,r,trunk){const c=mk(W,H),x=c.getContext('2d');const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
  const hash=(a,b)=>{let h=(a*374761393+b*668265263+77)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295;};
  const vnoise=(px,py,s)=>{const gx=Math.floor(px/s),gy=Math.floor(py/s),fx=px/s-gx,fy=py/s-gy;const a=hash(gx,gy),b=hash(gx+1,gy),c2=hash(gx,gy+1),d=hash(gx+1,gy+1);const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);return a+(b-a)*u+(c2-a)*v+(a-b-c2+d)*u*v;};
  if(trunk){const [tx,ty,tw]=trunk;const bark=trunk[3]||['#2e1d12','#4a3020','#6b4428','#8f6038'],bulge=trunk[4]||0;
    // two branches reaching into the crown
    x.strokeStyle=bark[1];x.lineWidth=3;x.beginPath();x.moveTo(tx+tw/2,ty+14);x.lineTo(tx-6,ty-8);x.moveTo(tx+tw/2,ty+10);x.lineTo(tx+tw+7,ty-10);x.stroke();x.strokeStyle=bark[2];x.lineWidth=1;x.stroke();
    for(let py=ty;py<H;py++){const flare=(py>H-6?(py-(H-6)):0)+Math.round(bulge*Math.sin(Math.PI*Math.min(1,(py-ty)/(H-ty)*1.15)));for(let px=tx-flare;px<tx+tw+flare;px++){const e=(px-tx+flare)/(tw+2*flare);let i=e<.2?0:e<.45?1:e<.8?2:3;if(hash(px,py>>1)<.18)i=Math.max(0,i-1);if((py+px*3)%9===0)i=Math.max(0,i-1);x.fillStyle=bark[i];x.fillRect(px,py,1,1);}}}
  const img0=x.getImageData(0,0,W,H);const out=img0.data;const solid=new Uint8Array(W*H);const shadeA=new Float32Array(W*H);
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){let inside=false,sh=-9,edge=0;for(const [bx,by,br] of blobs){const dx=px-bx,dy=py-by,d=Math.sqrt(dx*dx+dy*dy);const wob=(vnoise(px,py,3)-.5)*3.2;if(d<br+wob){inside=true;const s=(-dx*.55-dy*.85)/br;if(s>sh){sh=s;edge=1-d/br;}}}
    if(!inside)continue;const k=py*W+px;
    // sky gaps inside the crown
    if(edge>.25&&vnoise(px,py,2.2)>.84&&hash(px,py)>.35)continue;
    let v=sh*.42+.52+(vnoise(px,py,2)-.5)*.42+(vnoise(px+40,py,5)-.5)*.22-(py/H)*.18;
    v=Math.max(0,Math.min(.999,v));let f=v*7+(B[(py&3)*4+(px&3)]/16-.5)*.9;let i=Math.max(0,Math.min(6,Math.floor(f)));
    solid[k]=1;shadeA[k]=i;}
  const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const PAL=pal.map(rgb);const OUT=rgb(pal[0]).map(c=>Math.round(c*.62));
  for(let py=0;py<H;py++)for(let px=0;px<W;px++){const k=py*W+px;if(!solid[k])continue;let i=shadeA[k];
    const up=py>0&&solid[k-W],lf=px>0&&solid[k-1],dn=py<H-1&&solid[k+W],rt=px<W-1&&solid[k+1];
    if(!up||!lf)i=Math.min(6,i+2);// sunlit rim on the top and left
    let col=PAL[i];if(!dn||!rt)col=(!dn&&!rt)?OUT:PAL[Math.max(0,i-2)];
    const o=k*4;out[o]=col[0];out[o+1]=col[1];out[o+2]=col[2];out[o+3]=255;}
  // a 1px dark outline so the tree reads against grass, softer on the sunny side
  const cp=new Uint8ClampedArray(out);for(let py=0;py<H;py++)for(let px=0;px<W;px++){const o=(py*W+px)*4;if(cp[o+3])continue;let n=0;if(px<W-1&&solid[py*W+px+1])n++;if(py<H-1&&solid[(py+1)*W+px])n++;if(px>0&&solid[py*W+px-1])n+=2;if(py>0&&solid[(py-1)*W+px])n+=2;
    if(n>=2){out[o]=OUT[0];out[o+1]=OUT[1];out[o+2]=OUT[2];out[o+3]=255;}}
  x.putImageData(img0,0,0);
  // a few blossoms or berries for some trees
  return c;}
const TREE_PAL=[['#16301f','#1f4129','#2a5634','#3a6e40','#4f8a4b','#6fa65a','#a3cc78'],['#1d301a','#2a4722','#3b602c','#507b36','#6a9741','#8db455','#c1d985'],['#16302c','#203f36','#2c5541','#3e6d4b','#578a57','#7aa66a','#a9c98e']];
(function(){if(!TREES_HD.on)return;
  treeVariants.slice(0,3).forEach((v,vi)=>{const r=mulberry32(900+vi);const blobs=[];for(let i=0;i<11;i++)blobs.push([32+(r()-.5)*30,25+(r()-.5)*20,10+r()*9]);blobs.push([32,14,11]);
    const c=canopyHD(64,88,blobs,TREE_PAL[vi],r,[28,46,8]);TREES_HD.sets.push({v,old:v.t,hd:ctex(c)});});
  bushVariants.forEach((v,vi)=>{const r=mulberry32(950+vi);const blobs=[];for(let i=0;i<6;i++)blobs.push([16+(r()-.5)*16,12+(r()-.5)*4,6+r()*4]);const c=canopyHD(32,20,blobs,TREE_PAL[vi+1],r,null);TREES_HD.sets.push({v,old:v.m.map,hd:ctex(c)});});
  // sway: the top of each tree moves a little, phase by position, shadows follow
  const sway=m=>{m.onBeforeCompile=sh=>{sh.uniforms.uSway=TREES_HD.t;sh.vertexShader='uniform float uSway;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_MAP\n{float sw=max(0.,uv.y-.35);sw*=sw;vec4 wp=modelMatrix*vec4(0.,0.,0.,1.);transformed.x+=sin(uSway*1.4+wp.x*.7+wp.z*.43)*.16*sw;}\n#endif');};m.customProgramCacheKey=()=>'sway';m.needsUpdate=true;};
  TREES_HD.sets.forEach(s=>{[s.v.m,s.v.f,s.v.d].forEach(m=>m&&sway(m));});
  TREES_HD.set=function(on){this.live=on;this.sets.forEach(s=>{const t=on?s.hd:s.old;[s.v.m,s.v.f,s.v.d].forEach(m=>{if(!m)return;m.map=t;if(m.emissiveMap)m.emissiveMap=t;m.needsUpdate=true;});});};
  TREES_HD.set(true);(function L(){TREES_HD.t.value=performance.now()/1000;requestAnimationFrame(L);})();})();
const trees=[];const COACH_KEEP=[[71.6,-3.4],[70,-3.4],[73.2,-3.4],[71.6,-1.4],[10.4,-1.8],[22,-6.6],[32.2,-4.6],[59.4,-2.6],[71.2,.8],[89.6,-.6],[14.2,-4.6],[54.6,1.2],[61.4,-2.9]];
const KEEP=[[-11.5,3.6,2],[24,5,5.4],[6.6,3.4,1.2],[4.6,-8.4,2.8],[-9.3,-.3,4.6],[-13,-.6,1.5],[-4.4,-8.3,2.8],[-.4,-8.5,2.8],[46.5,-4.5,1.8],[19.5,-8.4,1.8],[17.2,-8.6,1.9],[14.5,1.3,1.3],[7.4,2.9,2.2],[6,-1.5,1.4],[17,-6.6,2],[26,-6.2,2],[40.5,1.2,2],[30.8,-2.6,2.2],[HAMMOCK.x,HAMMOCK.z,2.6],[HUT.x,HUT.z,2.8]].concat(LORE.map(L=>[L.x,L.z,2.2]));
function treeOK(x,z){if(landD(x,z)<1.6||pathD(x,z)<1.5)return false;if(x>-10.5&&x<10.5&&z>-6.2)return false;if(x<49){if(x>3&&x<37&&Math.abs(z)<1.9)return false;
  if(x>29&&x<33&&z>-6&&z<1)return false;if(x>33&&x<37&&z>-.5&&z<5)return false;if(Math.hypot(x-33.5,z+6.3)<3.2)return false;if(x>37.5&&z<-5)return false;if(x>31&&z>3)return false;if(z>8.6)return false;}if(x<-11&&z>2.5&&z<7)return false;
  if(x>=49){if(Math.hypot(x-56.6,z-3.6)<4)return false;if(x>52&&x<68&&z<-2)return false;if(x>88)return false;if(Math.hypot(x-66.2,z-2.7)<3.4)return false;if(z>5.2)return false;}if(COACH_KEEP.some(([a,b])=>Math.hypot(x-a,z-b)<1.6))return false;
  for(const [kx,kz,kr] of KEEP)if(Math.hypot(x-kx,z-kz)<kr)return false;for(const t of trees)if(Math.hypot(x-t.x,z-t.z)<2.1)return false;return true;}
for(let tries=0;tries<5200&&trees.length<128;tries++){const west=tries>=2600;if(!west&&trees.length>=74)continue;const x=west?49+R()*40:-15+R()*63,z=west?-5+R()*11:-11+R()*20;if(!treeOK(x,z))continue;const v=treeVariants[trees.length%4];const s=.9+R()*.35;
  const g=new THREE.PlaneGeometry(v.w*s,v.h*s);g.translate(0,v.h*s/2,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);if(R()<.5)m.scale.x=-1;scene.add(m);BB.push(m);
  trees.push({x,z,m,v,fade:false});col(x-.25,z-.12,x+.25,z+.12);}
for(let i=0,n=0;i<900&&n<46;i++){const x=-15+R()*63,z=-11+R()*21;if(landD(x,z)<.8||pathD(x,z)<1||inGarden(x,z))continue;if(x>-7&&x<7&&z>-5.5&&z<7.5)continue;if(x>3&&x<37&&Math.abs(z)<1.1)continue;if(x>38&&z<-5.5)continue;if(Math.hypot(x-33.5,z+6.3)<2)continue;if(x<-12&&z>3.5&&z<6.5)continue;
  const v=bushVariants[n%2];const g=new THREE.PlaneGeometry(1.6,1);g.translate(0,.5,0);const m=new THREE.Mesh(g,v.m);m.customDepthMaterial=v.d;m.castShadow=true;m.position.set(x,0,z);scene.add(m);BB.push(m);n++;}
