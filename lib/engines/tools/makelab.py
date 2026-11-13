#!/usr/bin/env python3
"""Build a self-contained engine lab page: python3 makelab.py <out.html> <title> <blurb> <scene.js> <engine.js> [engine.js...]
The scene script gets: R (renderer), scene, cam, ctl (OrbitControls), sun, hemi, ui(html) to add controls, onFrame(fn(t,dt)), and
the shared island test ground H(x,z), kind(x,z), PATHS. It runs after the engines are loaded."""
import sys
out,title,blurb,scene_js=sys.argv[1:5];engines=sys.argv[5:]
eng=''.join('<script>'+open(p).read()+'</script>\n' for p in engines)
shell='''<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%(t)s</title>
<style>body{margin:0;overflow:hidden;background:#9fd3ea;font-family:system-ui,sans-serif}#ui{position:fixed;left:10px;top:10px;background:rgba(20,28,40,.84);color:#fff;padding:10px 12px;border-radius:12px;font-size:13px;max-width:300px;max-height:90vh;overflow:auto}
#ui b{font-size:14px}#ui label{display:block;margin:4px 0;cursor:pointer}#ui button{margin:6px 6px 0 0;padding:6px 10px;border:0;border-radius:8px;background:#3e7d5c;color:#fff;font-weight:600;cursor:pointer}#ui input[type=range]{width:130px;vertical-align:middle}#fps{opacity:.75;margin-top:6px}</style></head><body>
<div id="ui"><b>%(t)s</b><div style="opacity:.8;margin:4px 0 6px">%(b)s</div><div id="ctl"></div><button id="bTop">Top view</button><button id="bLow">Low view</button><div id="fps"></div></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
%(e)s<script>
(()=>{const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);R.outputEncoding=THREE.sRGBEncoding;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;document.body.appendChild(R.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x9fd3ea);const cam=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.3,800);cam.position.set(-4,24,36);
const ctl=new THREE.OrbitControls(cam,R.domElement);ctl.target.set(4,0,4);ctl.maxPolarAngle=1.48;ctl.enableDamping=true;
const hemi=new THREE.HemisphereLight(0xbfe4ff,0x8a7a58,.5),sun=new THREE.DirectionalLight(0xfff2dc,1.05);sun.position.set(-30,45,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const sc=sun.shadow.camera;sc.left=sc.bottom=-50;sc.right=sc.top=50;sc.far=200;scene.add(hemi,sun,sun.target);
const hash=(x,y)=>{const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s);};const vn=(x,y)=>{const i=Math.floor(x),j=Math.floor(y),f=x-i,g=y-j,u=f*f*(3-2*f),v=g*g*(3-2*g);return(hash(i,j)*(1-u)+hash(i+1,j)*u)*(1-v)+(hash(i,j+1)*(1-u)+hash(i+1,j+1)*u)*v;};
const fbm=(x,y)=>{let s=0,a=.5;for(let o=0;o<4;o++){s+=vn(x,y)*a;x*=2.03;y*=2.03;a*=.5;}return s;};
const H=(x,z)=>{const coast=-14+Math.sin(z*.07)*5+fbm(z*.05,3)*6,d=x-coast;let h;if(d<0)h=-Math.min(-d,8)*.18-Math.max(0,-d-8)*.05;else h=Math.min(d,5)*.22+(fbm(x*.06,z*.06)-.4)*1.4*Math.min(1,d/8);h+=Math.max(0,x-22)*.5*fbm(z*.08,9);return h;};
const PATHS=[{pts:[[-10,-30],[-6,-14],[-4,0],[2,10],[6,30]],w:1.1,kind:'path'},{pts:[[-4,0],[8,2],[20,-2],[30,0]],w:.9,kind:'path'},{pts:[[-2,-30],[2,-16],[6,-6],[10,4],[14,16],[16,30]],w:1.3,kind:'lane'}];
const segD=(x,z,a,b)=>{const vx=b[0]-a[0],vz=b[1]-a[1],L=vx*vx+vz*vz||1e-6;let t=((x-a[0])*vx+(z-a[1])*vz)/L;t=Math.max(0,Math.min(1,t));return Math.hypot(x-a[0]-vx*t,z-a[1]-vz*t);};
const nearPath=(x,z,m)=>PATHS.some(p=>{for(let i=1;i<p.pts.length;i++)if(segD(x,z,p.pts[i-1],p.pts[i])<p.w/2+(m||0))return true;return false;});
const kind=(x,z)=>{const h=H(x,z);if(h<0)return'water';if(nearPath(x,z,.3))return'path';if(h<.9)return'sand';return'grass';};
const ctlBox=document.getElementById('ctl');const ui=h=>{const d=document.createElement('div');d.innerHTML=h;ctlBox.appendChild(d);return d;};const frames=[];const onFrame=f=>frames.push(f);
document.getElementById('bTop').onclick=()=>{cam.position.set(4,60,8);ctl.target.set(4,0,4);};document.getElementById('bLow').onclick=()=>{cam.position.set(-6,3,14);ctl.target.set(2,1,0);};
let renderFn=null;const setRender=f=>{renderFn=f;};
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();});
%(s)s
let fr=0,ft=performance.now(),last=performance.now();const fe=document.getElementById('fps');(function loop(){requestAnimationFrame(loop);ctl.update();const now=performance.now(),t=now/1000,dt=Math.min(.1,(now-last)/1000);last=now;frames.forEach(f=>f(t,dt));
  if(renderFn)renderFn(t);else R.render(scene,cam);fr++;if(now-ft>1000){fe.textContent=fr+' fps';fr=0;ft=now;}})();})();
</script></body></html>'''
open(out,'w').write(shell%{'t':title,'b':blurb,'e':eng,'s':open(scene_js).read()})
