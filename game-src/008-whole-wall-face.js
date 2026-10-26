/* --- whole wall face --- */
function wall(w,h,o={}){seed(o.seed||7);const W=Math.round(w*PPM),H=Math.round(h*PPM);const[c,x]=cv(W,H);const base=o.base||'#e4d2a8',kind=o.kind||(lum(base)>.8?'stone':'plaster');
  if(kind==='stone')blocks(x,W,H,base);else if(kind==='brick')bricks(x,W,H,base);else if(kind==='board')weatherboard(x,W,H,base);else plaster(x,W,H,base);
  const tb=o.trim||(kind==='stone'?mix(base,'#ffffff',.15):mix(base,'#f4ecd8',.55));
  if(o.quoins!==false&&kind!=='stone'&&W>40)quoins(x,W,H,mix(base,'#e8dcc0',.6));
  if(o.plinth!==false)plinth(x,W,H,kind==='stone'?sh(base,.85):'#b8a88c');
  if(o.cornice!==false&&H>40)cornice(x,W,H,tb);
  const n=o.win==null?Math.max(0,Math.floor((W-16)/44)):o.win;const doorAt=o.door?(o.doorAt!=null?o.doorAt:.5):-1;
  if(n||o.door){const slots=n+(o.door?1:0),step=W/slots;let k=0,dIdx=o.door?Math.min(slots-1,Math.round(doorAt*(slots-1))):-1;
    for(let i=0;i<slots;i++){const cx=step*(i+.5);if(i===dIdx){const dw=Math.min(26,step-10|0),dh=Math.min(H-14,44);door(x,cx-dw/2,H-dh-3,dw,dh,o.doorCol||'#2f6a74');}
      else{const ww=Math.min(o.winW||22,step-16|0),wh=Math.min(o.winH||26,H-30);if(ww>6&&wh>8)win(x,cx-ww/2,Math.max(10,H*.42-wh/2),ww,wh,{arch:o.arch,shutter:o.shutter,lit:o.lit,box:o.box!==false});k++;}}}
  if(o.moss!==false)moss(x,W,H,kind==='stone'?1:.5);if(o.ivy)ivy(x,o.ivy[0]*W,o.ivy[1]*W,H);
  return c;}
/* --- roofs --- */
function roofRows(x,W,H,base,kind){if(kind==='tin'){for(let X=0;X<W;X+=3){const f=X%6?.92:1.08;P(x,sh(base,f),X,0,3,H);P(x,sh(base,f*1.18),X,0,1,H);}for(let y=0;y<H;y+=24)P(x,sh(base,.7),0,y,W,1);return;}
  const tw=kind==='slate'?7:8,th=kind==='slate'?5:6;P(x,sh(base,.55),0,0,W,H);
  for(let y=0,r=0;y<H;y+=th,r++)for(let X=-(r%2)*(tw>>1);X<W;X+=tw){const f=.94+rnd()*.1;P(x,sh(base,f),X,y,tw,th);P(x,sh(base,f*1.16),X+1,y,tw-2,1);P(x,sh(base,f*.78),X,y+th-2,tw,1);P(x,sh(base,.52),X,y+th-1,tw,1);P(x,sh(base,f*.7),X+tw-1,y,1,th-1);
    if(rnd()<.035)P(x,'#6f8a44',X+2,y+2,2,1);}}
function roof(w,h,o={}){seed(o.seed||11);const W=Math.round(w*PPM),H=Math.round(h*PPM);const base=o.base||'#b85434',kind=o.kind||'tile';
  if(!o.across){const[c,x]=cv(W,H);roofRows(x,W,H,base,kind);return c;}
  // rows run along the canvas height (for cylinder prisms, whose slope goes around u)
  const[t,tx]=cv(H,W);roofRows(tx,H,W,base,kind);const[c,x]=cv(W,H);x.translate(W,0);x.rotate(Math.PI/2);x.drawImage(t,0,0);return c;}
function pane(lit,w=12,h=14,frame='#efe4cc'){const[c,x]=cv(w+6,h+6);P(x,INK,0,0,w+6,h+6);win(x,3,3,w,h,{lit,box:false,frame});return c;}
function doorPane(col,w=20,h=38){const[c,x]=cv(w+6,h+4);P(x,'#e8dcc0',0,0,w+6,h+4);door(x,3,3,w,h,col,{lamp:false,step:false});return c;}
return{PPM,wall,roof,pane,doorPane,blocks,plaster,bricks,weatherboard,win,door,cornice,plinth,quoins,moss,ivy,mix,sh,lum,seed,rnd,cv,P};
})();

// ---------- renderer + pixel-art post-processing ----------
const stage=$('#stage');
const renderer=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});
const DPR=Math.min(window.devicePixelRatio||1,/[?&#]px4\b/.test(location.search+location.hash)?2:1.5);// Look Lab ?px4: sharper screen
renderer.setPixelRatio(DPR);
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const FOG=new THREE.Color('#78bfd0');
scene.background=FOG.clone();scene.fog=new THREE.Fog(FOG,20,46);
const camera=new THREE.PerspectiveCamera(30,1,.1,200);
const CAM_DIR=new THREE.Vector3(0,.6,.8).normalize();
let camDist=14,yaw=0,yawT=0,zm=1;
const camOff=new THREE.Vector3();
const rt=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat});
var CINE_LIVE=false;const CINE_ON=CINE_LIVE||/[?&#](lab|cine|r3)\b/.test(location.search+location.hash);// Look Lab: Cinematic camera, Rottnest first
var PXB_LIVE=false;const PXB_ON=PXB_LIVE||/[?&#]pxb\b/.test(location.search+location.hash);// Look Lab: pixel buildings (3d shapes, pixel skins), Rottnest first
if(CINE_ON||PXB_ON){rt.depthTexture=new THREE.DepthTexture(2,2);rt.depthTexture.type=THREE.UnsignedIntType;}
const post=new THREE.ShaderMaterial({
  uniforms:Object.assign({tDiffuse:{value:rt.texture},res:{value:new THREE.Vector2(2,2)},tint:{value:new THREE.Vector3(1,1,1)},focus:{value:.45},px:{value:DPR},fade:{value:0},bloomK:{value:1},blurK:{value:1}},PXB_ON?{tDepth:{value:null},outl:{value:0},nf:{value:new THREE.Vector2(.1,200)}}:{}),
  vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
  fragmentShader:[
  (PXB_ON?'uniform sampler2D tDepth;uniform float outl;uniform vec2 nf;float pxZ(vec2 u){float d=texture2D(tDepth,u).x;return nf.x*nf.y/(nf.y-d*(nf.y-nf.x));}':'')+'uniform sampler2D tDiffuse;uniform vec2 res;uniform vec3 tint;uniform float focus;uniform float px;uniform float fade;uniform float bloomK;uniform float blurK;varying vec2 vUv;',
  'vec3 box4(vec2 uv,float o){vec2 t=o/res;return(texture2D(tDiffuse,uv+vec2(t.x,t.y)).rgb+texture2D(tDiffuse,uv+vec2(-t.x,t.y)).rgb+texture2D(tDiffuse,uv+vec2(t.x,-t.y)).rgb+texture2D(tDiffuse,uv-t).rgb)*.25;}',
  'vec3 disc(vec2 uv,float r){vec3 a=vec3(0.);for(int i=0;i<14;i++){float fi=float(i);float ang=fi*2.39996;float rr=sqrt((fi+.5)/14.)*r;a+=texture2D(tDiffuse,uv+vec2(cos(ang),sin(ang))*rr/res).rgb;}return a/14.;}',
  'void main(){vec3 base=texture2D(tDiffuse,vUv).rgb;'+(PXB_ON?'if(outl>.5){vec2 o=1./res;float z=pxZ(vUv);float e=max(max(pxZ(vUv+vec2(o.x,0.)),pxZ(vUv-vec2(o.x,0.))),max(pxZ(vUv+vec2(0.,o.y)),pxZ(vUv-vec2(0.,o.y))))-z;base=mix(base,base*vec3(.34,.3,.4),smoothstep(.05+z*.05,.1+z*.1,e)*.85);}':'')+'vec3 bl0=box4(vUv,1.5);base=base+(base-bl0)*.3;float d=abs(vUv.y-focus);float b=smoothstep(.2,.68,d)*blurK;vec3 col=base;',
  'if(b>.01){col=mix(base,disc(vUv,b*6.*px),b);}',
  'vec3 wide=disc(vUv,15.*px);col+=max(wide-vec3(.62),0.)*1.05*bloomK;',
  'col*=tint;float l=dot(col,vec3(.299,.587,.114));col=mix(vec3(l),col,1.1);col=(col-.5)*1.08+.5;col=mix(col*vec3(.92,.97,1.08),col,smoothstep(.15,.6,l));',
  'vec2 q=vUv-.5;col*=1.-dot(q,q)*.9;col=mix(col,vec3(.05,.06,.12),fade);gl_FragColor=vec4(col,1.);}'].join('\n'),
  depthTest:false,depthWrite:false});
const postScene=new THREE.Scene();const postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),post));

function resize(){
  const w=stage.clientWidth||innerWidth,h=stage.clientHeight||innerHeight;
  renderer.setSize(w,h,false);
  rt.setSize(Math.max(2,Math.floor(w*DPR)),Math.max(2,Math.floor(h*DPR)));
  post.uniforms.res.value.set(w*DPR,h*DPR);
  const a=w/h;camera.aspect=a;camera.fov=a<1?40:30;camDist=a<1?Math.min(34,14*1.05/a):14;
  camera.updateProjectionMatrix();scene.fog.near=camDist+5;scene.fog.far=camDist+30;
}
new ResizeObserver(resize).observe(stage);resize();

