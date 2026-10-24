// ---------- Layered pixel trees (2.5D) · Look Lab layer: ?lab or ?layers until TREE_LAYERS_LIVE is true ----------
// Each tree gets a dark back crown behind it and a cluster of near leaves in front of it, as extra pixel sheets.
// When the camera turns or Kip walks by, the sheets slide past each other a little, so the tree has depth but stays pixel art.
const TREE_LAYERS_LIVE=false;
const TLAY={on:TREE_LAYERS_LIVE||/[?&#](lab|layers)\b/.test(location.search+location.hash),show:true,kids:[],cache:new Map(),mats:[]};
function treeLayerPaint(img,seed){const W=img.width,H=img.height,src=img.getContext('2d').getImageData(0,0,W,H).data;
  // crown = leafy pixels (green-ish or purple), not bark
  const crown=new Uint8Array(W*H);let minY=H,maxY=0,cx=0,n=0;
  for(let i=0;i<W*H;i++){const o=i*4;if(src[o+3]<128)continue;const r=src[o],g=src[o+1],b=src[o+2];const leafy=(g>r*1.02&&g>b)||(b>g&&r>g)||(r>140&&g>100&&b<90);if(!leafy)continue;crown[i]=1;const y=(i/W)|0;minY=Math.min(minY,y);maxY=Math.max(maxY,y);cx+=i%W;n++;}
  if(n<40)return null;cx/=n;const ch=maxY-minY+1;
  const mkc=()=>{const c=mk(W,H);return[c,c.getContext('2d').createImageData(W,H)];};
  // back sheet: the crown grown by 2px, in the darkest leaf tones, peeking out around the edges
  const [bc,bd]=mkc();let dark=[0,0,0],dn=0;for(let i=0;i<W*H;i++)if(crown[i]){const o=i*4,l=src[o]+src[o+1]+src[o+2];if(l<240){dark[0]+=src[o];dark[1]+=src[o+1];dark[2]+=src[o+2];dn++;}}
  dark=dn?dark.map(v=>v/dn):[40,70,40];
  // back sheet: the same crown, darker and cooler, so it shows as shadowed leaves deeper in the tree
  for(let i=0;i<W*H;i++){if(!crown[i])continue;const o=i*4;const k=.58+l2hash(i%W>>1,(i/W|0)>>1,seed)*.12;bd.data[o]=src[o]*k*.92;bd.data[o+1]=src[o+1]*k;bd.data[o+2]=Math.min(255,src[o+2]*k*1.12);bd.data[o+3]=255;}
  bc.getContext('2d').putImageData(bd,0,0);
  // front sheet: a few leaf clumps from the lower front of the crown, lit, with their own outline
  const [fc,fd]=mkc();const pick=new Uint8Array(W*H);
  const clumps=[];const rnd=mulberry32(seed+5);for(let k=0;k<6;k++)clumps.push([cx+(rnd()-.5)*W*.55,minY+ch*(.45+rnd()*.42),W*(.07+rnd()*.06)]);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!crown[i])continue;for(const[a,b,r]of clumps){const dx=x-a,dy=(y-b)*1.15;if(dx*dx+dy*dy<r*r){pick[i]=1;break;}}}
  for(let i=0;i<W*H;i++){if(!pick[i])continue;const o=i*4,x=i%W,y=(i/W)|0;const up=y>0&&pick[i-W],lf=x>0&&pick[i-1];const lit=(!up||!lf)?1.18:1.05;
    fd.data[o]=Math.min(255,src[o]*lit);fd.data[o+1]=Math.min(255,src[o+1]*lit);fd.data[o+2]=Math.min(255,src[o+2]*lit*.96);fd.data[o+3]=255;}
  const OUT=dark.map(v=>v*.45);for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(pick[i])continue;const o=i*4;const n2=(x>0&&pick[i-1])||(x<W-1&&pick[i+1])||(y>0&&pick[i-W])||(y<H-1&&pick[i+W]);if(n2){fd.data[o]=OUT[0];fd.data[o+1]=OUT[1];fd.data[o+2]=OUT[2];fd.data[o+3]=255;}}
  fc.getContext('2d').putImageData(fd,0,0);
  const tx=c=>{const t=ctex(c);return t;};return{back:tx(bc),front:tx(fc)};}
function treeLayersApply(){if(!TLAY.on||typeof LOOK2==='undefined'||!LOOK2.on)return;
  for(const tr of trees){const o=tr.m;if(!o||!o.__l2||o.__tl)continue;const v=o.__l2.v;const t=v.tex;if(!t||!t.image||t.image.height<64)continue;
    const L=t.__l2||(LOOK2.tex.find(q=>q.__l2&&q.__l2.tB===t)||{}).__l2;if(L&&L.P&&(L.P.kind==='palm'))continue;
    let set=TLAY.cache.get(v);if(!set){const p=treeLayerPaint(t.image,(t.image.width*7+t.image.height)|0);if(!p){TLAY.cache.set(v,null);continue;}
      const mk2=(map,dz,sc,col)=>{const m=v.m.clone();m.map=map;m.emissiveMap=null;m.emissive=new THREE.Color(0);if(col)m.color=new THREE.Color(col);plantSway(m);TLAY.mats.push(m);return{m,dz,sc};};
      set=[mk2(p.back,-.45,1.02,null),mk2(p.front,.4,.985,null)];set.src=t.image;TLAY.cache.set(v,set);}
    if(!set)continue;o.__tl=[];for(const s of set){const c=new THREE.Mesh(o.geometry,s.m);c.position.z=s.dz;c.scale.setScalar(s.sc);c.position.y=(1-s.sc)*0;c.castShadow=false;c.receiveShadow=true;o.add(c);o.__tl.push(c);TLAY.kids.push(c);}}}
function treeLayersTick(){if(!TLAY.on)return;
  // repaint when the season repaints the tree, hide the extra sheets when the tree turns see-through in front of Kip
  for(const [v,set] of TLAY.cache){if(!set)continue;const t=v.tex;if(t&&t.image!==set.src){set.src=t.image;const p=treeLayerPaint(t.image,(t.image.width*7+t.image.height)|0);if(p){set[0].m.map=p.back;set[1].m.map=p.front;set[0].m.needsUpdate=set[1].m.needsUpdate=true;}}}
  const cx=camera.position.x*(scene.scale.x<0?-1:1),cz=camera.position.z;for(const tr of trees){const o=tr.m;if(!o||!o.__tl)continue;const vis=TLAY.show&&!tr.fade&&o.material===o.__l2.v.m&&Math.hypot(tr.x-cx,tr.z-cz)>6;for(const c of o.__tl)c.visible=vis;}}
TLAY.set=function(on){this.show=on;treeLayersTick();};
if(TLAY.on){treeLayersApply();(function TL(){treeLayersTick();requestAnimationFrame(TL);})();}
if(LAB.start)setTimeout(()=>LAB.toggle(true),600);

