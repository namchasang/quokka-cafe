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
    const pre=`uniform sampler2D tD;uniform vec4 uB;uniform float uT;uniform float uMir;uniform float uBand;varying vec3 vWp3;\n${NOISE}
      float s3d(vec2 p){vec2 uv=(p-uB.xy)/uB.zw;if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return 10.;return texture2D(tD,uv).r*12.-2.;}`;
    const vtx=sh=>{sh.vertexShader='varying vec3 vWp3;\n'+sh.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvWp3=(modelMatrix*vec4(transformed,1.)).xyz;');};
    // --- the sea ---
    const mkSea=band=>{const m=new THREE.MeshLambertMaterial({color:0xffffff,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
    m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,U,{uBand:{value:band}});vtx(sh);
      sh.fragmentShader=pre+sh.fragmentShader.replace('#include <map_fragment>',`
        vec2 wp=vec2(vWp3.x*uMir,vWp3.z);float d0=s3d(wp);if(uBand>.5&&(d0<0.||d0>1.6))discard;float d=s3d(wp+vec2(sin(uT*.5+wp.y*.9),cos(uT*.4+wp.x*.8))*.06*(1.-uBand));
        float wob=(s3n(wp*.35+uT*.05)-.5)*1.2;float dd=max(d+wob*.35,0.);
        // Tree Lab sea: sand shows through the shallows, then turquoise, then a calm deep blue
        vec3 c=mix(${SR('#d8cba0')},${SR('#9adccc')},smoothstep(0.,.7,dd));c=mix(c,${SR('#3fb0c4')},smoothstep(.6,2.6,dd));c=mix(c,${SR('#1f86b4')},smoothstep(2.2,5.5,dd));c=mix(c,${SR('#165c92')},smoothstep(5.,10.,dd));
        c*=1.+(s3n(wp*.7+vec2(uT*.25,-uT*.15))-.5)*.07+(s3n(wp*1.9-vec2(uT*.35,uT*.2))-.5)*.04;
        float gl=s3n(wp*3.1+vec2(uT*.7,uT*.4))*s3n(wp*2.2-vec2(uT*.45,-uT*.6));c+=vec3(.25)*smoothstep(.7,.85,gl)*smoothstep(1.,3.,dd);
        float br=smoothstep(.2,.8,s3n(wp*1.4+vec2(uT*.1,0.)));
        float ph=fract(uT*.09+s3n(wp*.15)*.6);
        float f1=exp(-pow((d-.16)/.09,2.))*(.7+.3*br)*(.65+.35*s3n(wp*6.));
        float f2=exp(-pow((d-(.25+ph*1.1))/.09,2.))*(1.-ph)*.65*br*(.5+.5*s3n(wp*5.+uT));
        c=mix(c,${SR('#fbfaf4')},clamp(f1+f2,0.,1.)*.8);
        diffuseColor.rgb=c;`);};m.customProgramCacheKey=()=>'sea3'+band;return m;};const seaM=mkSea(0);
    const ext=60,x1=TB.x1-ext,x2=Math.min(99.5,TB.x2+ext),z1=TB.z1-ext,z2=TB.z2+ext;
    // it lies under every ground mesh (the settlement lawns are separate meshes over the grid's water) and over the old pixel water layers
    const sea=flat(x2-x1,z2-z1,seaM,(x1+x2)/2,-.09,(z1+z2)/2);sea.receiveShadow=true;sea.renderOrder=-1;sea.name='sea3';
    // wet sand is painted into the ground itself (part 016, beach rule, ?toon): an overlay would also darken the settlement lawns
    // the shore band: the same water drawn just over the ground from the true waterline out to 1.6, so the coast is a smooth line
    // instead of the ground's pixel steps; it stays under the settlement lawns (they sit higher)
    const band=flat(TB.x2-TB.x1,TB.z2-TB.z1,mkSea(1),(TB.x1+TB.x2)/2,.009,(TB.z1+TB.z2)/2);band.receiveShadow=true;band.name='sea3band';
    sea.onBeforeRender=()=>{U.uT.value=performance.now()/1000;U.uMir.value=scene.scale.x<0?-1:1;};
    SEA3.sea=sea;if(typeof waves!=='undefined')waves.visible=false;// the old crest lines are too hard next to this sea
  }
  const wait=()=>{if(typeof ISL!=='undefined'&&ISL.done&&typeof Dg!=='undefined'){try{build();}catch(e){console.error('sea3',e);}return;}setTimeout(wait,400);};wait();
})();
