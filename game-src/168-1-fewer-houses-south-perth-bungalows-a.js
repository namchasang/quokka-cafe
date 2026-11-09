/* ---------- 1. fewer houses: South Perth bungalows and Fremantle terraces ---------- */
function town2Thin(){const out={sp:0,freo:0,vp:0,cbd:0,cottages:0,kept:0,gaps:[]};town2Thin.out=out;window.__town2=out;scene.updateMatrixWorld(true);
  const B=new THREE.Box3(),L=new THREE.Box3(),V=new THREE.Vector3();
  const lbox=o=>{B.setFromObject(o);if(B.isEmpty())return null;L.makeEmpty();for(const x of[B.min.x,B.max.x])for(const y of[B.min.y,B.max.y])for(const z of[B.min.z,B.max.z]){V.set(x,y,z);scene.worldToLocal(V);L.expandByPoint(V);}return L.clone();};
  // everything the story or a shop needs stays: interaction spots in every town, homes for sale, shop people
  let T=[];const px=player.x,pz=player.z;for(const zx of[150,300,520,650]){player.x=zx;try{T=T.concat(buildTargets().map(t=>[t.x,t.z]));}catch(e){}}player.x=px;player.z=pz;
  try{PROP_LIST.forEach(p=>T.push([p.x,p.z]));}catch(e){}try{FREO_NPCS.forEach(n=>T.push([n.x,n.z]));}catch(e){}try{VP_SHOPS.forEach(s=>T.push([s.npc.x,s.npc.z]));}catch(e){}town2Thin.T=T;
  const signs=[];scene.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)&&o.material.map&&SIGN_TEX.has(o.material.map)){const b=lbox(o);if(b)signs.push(b);}});
  const used=(b,pad)=>T.some(([x,z])=>x>b.min.x-pad&&x<b.max.x+pad&&z>b.min.z-pad&&z<b.max.z+pad)||signs.some(q=>q.max.x>b.min.x-.4&&q.min.x<b.max.x+.4&&q.max.z>b.min.z-.4&&q.min.z<b.max.z+.4);
  const BBs=new Set(BB);const G=new THREE.Group();G.name='town2';G.__pxSkip=1;scene.add(G);town2Thin.g=G;
  const killCols=b=>colliders.forEach(c=>{if(c.x1<1e8&&c.x1>=b.min.x-.35&&c.x2<=b.max.x+.35&&c.z1>=b.min.z-.35&&c.z2<=b.max.z+.35){c.x1=c.z1=c.x2=c.z2=1e9;}});
  // hide a house and every loose part that belongs to it (doors, panes, posts, pickets), never plants or people
  const hideIn=(b,keep)=>{scene.traverse(o=>{if(!o.isMesh||!o.visible||keep.has(o)||BBs.has(o)||(o.userData&&o.userData.frames)||o.isInstancedMesh)return;for(let p=o.parent;p&&p!==scene;p=p.parent)if(p===G)return;const q=lbox(o);if(!q||q.max.x-q.min.x>6||q.max.z-q.min.z>6)return;
      if(q.min.x>=b.min.x-.05&&q.max.x<=b.max.x+.05&&q.min.z>=b.min.z-.05&&q.max.z<=b.max.z+.05&&q.max.y<=b.max.y+.2&&q.max.y>.07){o.visible=false;o.__t2gone=1;}});};
  /* --- South Perth: little houses in tight rows (plain box + roof, or the bungalows) --- */
  const cand=[];scene.children.forEach(g=>{if(!g.isGroup||!g.visible||g.__pxSkip||g===G)return;const b=lbox(g);if(!b)return;const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;
    if(cx<100||cx>250||cz<8||cz>32)return;const w=b.max.x-b.min.x,d=b.max.z-b.min.z,h=b.max.y-b.min.y;if(w>5.2||d>5||h>3.6||h<1.6)return;
    let wall=0,glassy=0;g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type==='BoxGeometry'&&o.geometry.parameters.height>1.2)wall++;});if(!wall)return;
    const core=b.clone();core.expandByScalar(-.2);cand.push({g,b,cx,cz,w,keep:used(core,1.2)});});
  const rows=new Map();cand.forEach(c=>{const k=Math.round(c.cz);let r=rows.get(k);if(!r){r=[];rows.set(k,r);}r.push(c);});
  // a house squeezed against one that must stay goes; in a row of free houses every third one goes
  rows.forEach(r=>{r.sort((a,b)=>a.cx-b.cx);let run=[];const flush=()=>{const free=run.filter(c=>!c.keep);run.forEach((c,i)=>{if(c.keep)return;const nb=[run[i-1],run[i+1]].filter(Boolean);if(nb.some(n=>n.keep&&Math.abs(n.cx-c.cx)-(n.w+c.w)/2<1.6))c.go=1;});
      if(free.length>=3)free.forEach((c,i)=>{if(i%3===1)c.go=1;});run=[];};
    r.forEach(c=>{if(run.length&&c.cx-run[run.length-1].cx>9)flush();run.push(c);});flush();});
  cand.filter(c=>c.go).forEach(c=>{const b=c.b.clone();b.max.z+=1.9;b.min.z-=1.9;b.min.x-=.3;b.max.x+=.3;// the picket fences stand up to 1.7 m in front (or behind)
    c.g.visible=false;killCols(c.b);const ins=new Set();c.g.traverse(o=>ins.add(o));hideIn(b,ins);out.sp++;out.gaps.push(['sp',+c.cx.toFixed(1),+c.cz.toFixed(1)]);t2Garden(G,c.cx,c.cz,c.w,(c.cx*7|0)%3,'sp');});
  /* --- Fremantle: the terrace rows on Wray Ave / Hampton Rd are rebuilt as pairs of detailed cottages with gardens between --- */
  if(typeof FDET!=='undefined'&&FDET.g){const FG=FDET.g;const rowsF=[];FG.children.forEach(o=>{if(!o.isMesh||!o.visible||!o.geometry||o.geometry.type!=='BoxGeometry'||!Array.isArray(o.material))return;const p=o.geometry.parameters;
      if(Math.abs(p.height-1.45)>.01||Math.abs(p.depth-2.6)>.01||p.width<3)return;const face=o.material[4]&&o.material[4].map?1:-1;rowsF.push({o,L:p.width,x1:o.position.x-p.width/2,z:o.position.z,face});});
    FG.children.forEach(o=>{if(!o.isMesh||!o.geometry||o.geometry.type!=='BoxGeometry'||Array.isArray(o.material))return;const p=o.geometry.parameters;if(Math.abs(p.height-.9)>.01||Math.abs(p.depth-.06)>.01||p.width<3||Math.abs(o.position.z-33.4)>1)return;
      const brush=o.position.z>33.4,c=brush?'#a89070':'#9aa0a6';const m=t2Mat('lanef|'+c+'|'+Math.round(p.width),()=>{const W=Math.round(p.width*32),H=29;const[cc,x]=T2.cv(W,H);if(brush){const r=T2.ramp(c);for(let X=0;X<W;X++){T2.P(x,r[2+(T2.hash(X,1,3)*3|0)],X,0,1,H);if(T2.hash(X,2,3)<.3)T2.P(x,r[5],X,(T2.hash(X,3,3)*6|0),1,3);}T2.P(x,r[0],0,H*.45|0,W,1);T2.P(x,r[4],0,(H*.45|0)+1,W,1);T2.P(x,r[1],0,0,W,2);}
        else{T2.roofRows(x,W,H,c,'tin',0);const r=T2.ramp('#6a4a2a');for(let X=0;X<W;X+=48){T2.P(x,r[2],X,0,3,H);T2.P(x,r[4],X,0,1,H);}const R=T2.ramp(c);T2.P(x,R[5],0,0,W,1);}return cc;});
      const side=t2Col('lanes|'+c,T2.sh(c,.7));o.material=[side,side,side,side,m,m];o.__pxSkip=1;});
    const FC=new THREE.Group();FC.name='town2freo';FC.__pxSkip=1;FG.add(FC);
    rowsF.forEach((R,ri)=>{const W=1.7,n=Math.round(R.L/W),D=2.6,H=1.45,fz=R.z+R.face*D/2;
      const za=R.face<0?fz-1.97:R.z-D/2-.06,zb=R.face<0?R.z+D/2+.06:fz+1.97;const box=new THREE.Box3(new THREE.Vector3(R.x1-.08,-1,Math.min(za,zb)),new THREE.Vector3(R.x1+R.L+.08,H+2,Math.max(za,zb)));
      // the old row: the body, roofs, chimneys, verandahs, posts and pickets (not the long lane fences, the gardens or the plants)
      R.o.visible=false;FG.children.forEach(o=>{if(o===R.o||o===FC||!o.isMesh||!o.visible||BBs.has(o))return;const q=lbox(o);if(!q||q.max.y<.07)return;const w=q.max.x-q.min.x;if(w>2.2)return;
        const cx=(q.min.x+q.max.x)/2,cz=(q.min.z+q.max.z)/2;if(cx>box.min.x&&cx<box.max.x&&cz>box.min.z&&cz<box.max.z){o.visible=false;o.__t2gone=1;}});
      const zc1=R.z-D/2,zc2=R.z+D/2;colliders.forEach(c=>{if(c.x1<1e8&&Math.abs(c.x1-R.x1)<.06&&Math.abs(c.z1-zc1)<.06&&Math.abs(c.z2-zc2)<.06){c.x1=c.z1=c.x2=c.z2=1e9;}});
      // keep two, leave one (pairs of semis with a garden between); short rows lose one in the middle
      const keep=[];for(let i=0;i<n;i++)keep.push(n<=3?true:n<=5?i!==2:(i%3)!==2);
      for(let i=0;i<n;){if(!keep[i]){const hx=R.x1+W/2+i*W;t2Garden(FC,hx,fz+R.face*.2,W,(ri*3+i)%4,'freo',R.face,R.z);out.freo++;out.gaps.push(['freo',+hx.toFixed(1),+R.z.toFixed(1)]);i++;continue;}
        let j=i;while(j<n&&keep[j])j++;const a=R.x1+i*W,b=R.x1+j*W;col(a,zc1,b,zc2);for(let k=i;k<j;k++){t2Cottage(FC,R.x1+W/2+k*W,R.z,R.face,{seed:ri*31+k*7+3,left:k===i,right:k===j-1,num:((ri*17+k*2)%60)+1,hinge:(k-i)%2===1});out.cottages++;}i=j;}});}
  out.ms=0;return out;}
