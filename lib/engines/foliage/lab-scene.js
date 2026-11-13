const T=TerrainEngine.create({size:[90,70],center:[4,0],res:.4,heightAt:H,seaLevel:0,paths:PATHS});scene.add(T.mesh);
const sea=WaterSea.create({renderer:R,scene,camera:cam,heightAt:H,size:200,ground:null,level:0});sea.setSun(sun.position.clone(),sun.color.clone(),new THREE.Color(0x9fd3ea));
const F=FoliageEngine.create({scene,bounds:[-41,-35,49,35],heightAt:H,kindAt:kind,radius:45,chunk:10});
ui('<div>Wind: <input type="range" id="wnd" min="0" max="2.5" step=".05" value="1"></div><div>Quality: <select id="q"><option value="2">High</option><option value="1">Medium</option><option value="0">Low</option></select></div><div id="cnt" style="opacity:.75"></div>');
document.getElementById('wnd').oninput=e=>F.setWind(+e.target.value);document.getElementById('q').onchange=e=>F.setQuality(+e.target.value);
onFrame(t=>{F.update(t,ctl.target.x,ctl.target.z);T.update(t);document.getElementById('cnt').textContent=F.count()+' plants';});setRender(t=>sea.render(t));
