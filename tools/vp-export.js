// Writes the Victoria Park start map (lib/engines/editor/vp-start.json) from the code in game-src/188-vpmap-look-lab.js,
// for the Victoria Park Master Builder: node tools/vp-export.js
const fs=require('fs');const s=fs.readFileSync(__dirname+'/../game-src/188-vpmap-look-lab.js','utf8');
const a=s.indexOf('  // ---- the map'),b=s.indexOf('  // ---- build ----');
const body=s.slice(a,b);const CX=525,CZ=8,N=121;
const doc=new Function('CX','CZ','N',body+';return doc;')(CX,CZ,N);
/* the Swan River on the Perth side (Paul, 20 Nov 2026: 'victoria park มีแค่แม่น้ำฝั่งที่เข้า perth ไม่มีทะเลและคลื่น'): the east edge of the
   map (towards the city) drops into the river with a grassy bank, the Causeway carries Albany Highway over it; calm water, no surf.
   Builder map only: in the game this side is the CBD and Perth Water (protected). */
for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i-60)*2;if(x<76)continue;const t=Math.min(1,(x-76)/10),k=j*N+i;doc.h[k]=+(doc.h[k]*(1-t)+(-1.8)*t).toFixed(2);}
doc.keepPools=1;doc.calm=1;doc.roads.push({pts:[[57,-7.4],[74,-7.4],[118,-7.4]],type:'bridge'});
fs.writeFileSync(__dirname+'/../lib/engines/editor/vp-start.json',JSON.stringify(doc));
console.log('vp-start.json',doc.bld.length,'buildings',doc.roads.length,'roads',doc.paths.length,'paths',doc.veh.length,'vehicles',doc.rail.length,'rail points',doc.h.length,'heights');
