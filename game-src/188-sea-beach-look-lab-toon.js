// ---------- Sea and beach like the Tree Lab, Rottnest only (Look Lab: ?toon until SEA3_LIVE is true) ----------
// Paul (Nov 2026): no more pixel water round the island. The sea is one smooth shaded plane: clear turquoise over the sand at the
// shore deepening to a dark blue, gentle moving ripples and glints, a white foam line on the beach and swash bands that run up the
// sand and fade. On the land side a damp darker band of wet sand follows the waterline. It reads the island's own distance-to-shore
// grid (Dg), so every bay, reef edge and jetty keeps its shape. Other maps keep their water.
const SEA3_LIVE=false;
const SEA3={on:SEA3_LIVE||/[?&#]toon\b/.test(location.search+location.hash),built:false};
(function(){if(!SEA3.on)return;
  const SR=c=>{const k=new THREE.Color(c);k.convertSRGBToLinear();return `vec3(${k.r.toFixed(4)},${k.g.toFixed(4)},${k.b.toFixed(4)})`;};
  const NOISE=`float s3h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float s3n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(s3h(i),s3h(i+vec2(1,0)),f.x),mix(s3h(i+vec2(0,1)),s3h(i+vec2(1,1)),f.x),f.y);}`;
  function build(){if(SEA3.built)return;SEA3.built=true;
    // depth texture from the island grid: r = (water depth + 2) / 12, clamped (land is below 2/12)
    const W=GW,Hh=GH,data=new Uint8Array(W*Hh*4);
    for(let j=0;j<Hh;j++)for(let i=0;i<W;i++){const k=j*W+i,d=-Dg[k],v=Math.max(0,Math.min(255,Math.round((d+2)/12*255)));data[k*4]=v;data[k*4+1]=v;data[k*4+2]=v;data[k*4+3]=255;}
    const tD=new THREE.DataTexture(data,W,Hh,THREE.RGBAFormat);tD.magFilter=THREE.LinearFilter;tD.minFilter=THREE.LinearFilter;tD.wrapS=tD.wrapT=THREE.ClampToEdgeWrapping;tD.needsUpdate=true;
    const U={tD:{value:tD},uB:{value:new THREE.Vector4(TB.x1,TB.z1,(GW-1)/GR,(GH-1)/GR)},uT:{value:0},uMir:{value:1}};// uMir: the island scene may be drawn mirrored (scene.scale.x = -1)
    const pre=`uniform sampler2D tD;uniform vec4 uB;uniform float uT;uniform float uMir;varying vec3 vWp3;\n${NOISE}
      float s3d(vec2 p){vec2 uv=(p-uB.xy)/uB.zw;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return 10.;return texture2D(tD,uv).r*12.-2.;}`;
    const vtx=sh=>{sh.vertexShader='varying vec3 vWp3;\n'+sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWp3=(modelMatrix*vec4(transformed,1.)).xyz;');};
    // --- the sea ---
    const seaM=new THREE.MeshLambertMaterial({color:0xffffff,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
    seaM.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U);vtx(sh);
      sh.fragmentShader=pre+sh.fragmentShader.replace('#include <map_fragment>',`
        vec2 wp=vec2(vWp3.x*uMir,vWp3.z);float d=s3d(wp+vec2(sin(uT*.5+wp.y*.9),cos(uT*.4+wp.x*.8))*.06);
        float wob=(s3n(wp*.35+uT*.05)-.5)*1.2;float dd=max(d+wob*.35,0.);
        vec3 c=mix(${SR('#7fd6c8')},${SR('#36b4c6')},smoothstep(0.,2.2,dd));c=mix(c,${SR('#1d84b6')},smoothstep(1.8,5.,dd));c=mix(c,${SR('#1a64a0')},smoothstep(4.5,9.5,dd));
        c*=1.+(s3n(wp*.9+vec2(uT*.35,-uT*.2))-.5)*.10+(s3n(wp*2.3-vec2(uT*.5,uT*.3))-.5)*.06;
        float gl=s3n(wp*3.1+vec2(uT*.7,uT*.4))*s3n(wp*2.2-vec2(uT*.45,-uT*.6));c+=vec3(.55)*smoothstep(.62,.8,gl)*smoothstep(.4,2.5,dd);
        float br=smoothstep(.25,.75,s3n(wp*1.4+vec2(uT*.1,0.)));
        float f1=exp(-pow((d-.38)/.15,2.))*(.75+.25*br);
        float ph=fract(uT*.11+s3n(wp*.15)*.6);float f2=exp(-pow((d-(.45+ph*1.4))/.12,2.))*(1.-ph)*.85*br;
        float f3=exp(-pow((d-(1.2+fract(uT*.07+.5)*1.8))/.09,2.))*.28*br;
        c=mix(c,${SR('#ffffff')},clamp(f1+f2+f3,0.,1.)*.92);
        diffuseColor.rgb=c;`);};
    const ext=60,x1=TB.x1-ext,x2=Math.min(99.5,TB.x2+ext),z1=TB.z1-ext,z2=TB.z2+ext;
    // it lies under every ground mesh (the settlement lawns are separate meshes over the grid's water) and over the old pixel water layers
    const sea=flat(x2-x1,z2-z1,seaM,(x1+x2)/2,-.09,(z1+z2)/2);sea.receiveShadow=true;sea.renderOrder=-1;sea.name='sea3';
    // wet sand is painted into the ground itself (part 016, beach rule, ?toon): an overlay would also darken the settlement lawns
    sea.onBeforeRender=()=>{U.uT.value=performance.now()/1000;U.uMir.value=scene.scale.x<0?-1:1;};
    SEA3.sea=sea;}
  const wait=()=>{if(typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'){try{build();}catch(e){console.error('sea3',e);}return;}setTimeout(wait,400);};wait();
})();
