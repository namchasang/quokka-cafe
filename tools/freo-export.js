// Writes the Fremantle start map (lib/engines/editor/freo-start.json) from the code in game-src/188-freomap-look-lab.js,
// for the Fremantle Master Builder: node tools/freo-export.js
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../game-src/188-freomap-look-lab.js','utf8');
const a=s.indexOf('  // ---- the map'),b=s.indexOf('  // ---- build ----');
const body=s.slice(a,b);const CX=312,CZ=8,N=121;
const doc=new Function('CX','CZ','N',body+';return doc;')(CX,CZ,N);
fs.writeFileSync(__dirname+'/../lib/engines/editor/freo-start.json',JSON.stringify(doc));
console.log('freo-start.json',doc.bld.length,'buildings',doc.roads.length,'roads',doc.paths.length,'paths',doc.h.length,'heights');
