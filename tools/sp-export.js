// Writes the South Perth start map (lib/engines/editor/sp-start.json) from the code in game-src/188-spmap-look-lab.js,
// for the South Perth Master Builder: node tools/sp-export.js  (then tools/town-pages.sh builds sp-master.html)
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../game-src/188-spmap-look-lab.js','utf8');
const a=s.indexOf('  // ---- the map'),b=s.indexOf('  // ---- build ----');
const body=s.slice(a,b);const CX=150,CZ=8,N=121,SH=-3.9;
const doc=new Function('CX','CZ','N','SH',body+';return doc;')(CX,CZ,N,SH);
fs.writeFileSync(__dirname+'/../lib/engines/editor/sp-start.json',JSON.stringify(doc));
console.log('sp-start.json',doc.bld.length,'buildings',doc.roads.length,'roads',doc.paths.length,'paths',doc.props.length,'props',doc.trees.length,'trees',doc.veh.length,'vehicles',doc.h.length,'heights');
