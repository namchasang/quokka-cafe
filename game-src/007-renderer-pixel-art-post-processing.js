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

