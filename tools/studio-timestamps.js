// Prints YouTube timestamps for the studio playlists (Studio mode, key L).
// Usage: node tools/studio-timestamps.js   (run from the repo root)
// 0:00 = the first note of the first track. Trim the start of the recording to that note.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/../index.html', 'utf8');
const a = src.indexOf('const CR_SCALES='), b = src.indexOf('const LF_V=');
const c = src.indexOf('const PL_GAP='), d = src.indexOf('let PL_SEL=');
const e = src.indexOf('const LF_V='), f = src.indexOf('function rim(');
const h1 = src.indexOf('const HP_P='), h2 = src.indexOf('function lohat(');
const code = src.slice(a, b) + src.slice(e, f) + src.slice(h1, h2) + src.slice(c, d);
const { CRYSTAL, crCompile, LOFI, lfCompile, HOP, hpCompile, STUDIO_PL, PL_GAP } = new Function(
  'const RADIO={};function mtof(m){return 440*Math.pow(2,(m-69)/12);}' + code +
  ';return {CRYSTAL,crCompile,LOFI,lfCompile,HOP,hpCompile,STUDIO_PL,PL_GAP};')();
const TS = { crystal: [CRYSTAL, crCompile], lofi: [LOFI, lfCompile], beats: [HOP, hpCompile] };
const clock = s => { s = Math.floor(s); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); };
for (const P of STUDIO_PL) {
  let t = 0; const lines = [];
  for (const title of P.titles) {
    const [L, comp] = TS[P.st];
    const tr = L.find(x => x.t === title);
    if (!tr) { console.error('Missing track: ' + title); continue; }
    lines.push(clock(t) + ' ' + title);
    t += comp(tr).beats * 60 / tr.bpm + PL_GAP;
  }
  console.log(`\n== ${P.name} · ${lines.length} tracks · ${clock(t)} ==`);
  console.log(lines.join('\n'));
}
