// Writes the Victoria Park start map (lib/engines/editor/vp-start.json) from the code in game-src/188-vpmap-look-lab.js,
// for the Victoria Park Master Builder: node tools/vp-export.js
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../game-src/188-vpmap-look-lab.js','utf8');
const a=s.indexOf('  // ---- the map'),b=s.indexOf('  // ---- build ----');
const body=s.slice(a,b);const CX=525,CZ=8,N=121;
const doc=new Function('CX','CZ','N',body+';return doc;')(CX,CZ,N);
fs.writeFileSync(__dirname+'/../lib/engines/editor/vp-start.json',JSON.stringify(doc));
console.log('vp-start.json',doc.bld.length,'buildings',doc.roads.length,'roads',doc.paths.length,'paths',doc.veh.length,'vehicles',doc.rail.length,'rail points',doc.h.length,'heights');
