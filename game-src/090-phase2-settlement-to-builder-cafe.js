// ---------- Phase 2 (Look Lab ?phase2, Paul 15 Nov 2026): Kip's café goes to the café spot of the Island Builder map ----------
// The old Settlement (café, its deck and tables, the jetty, the counter, the menu, the Settlement story spots) is one rigid
// "platform" that islandWarp() moves onto the island. Moving that platform by P2D moves all of it together, with every
// collider, path, story point and IW() lookup, before the first frame. Target: the builder's QUOKKA CAFE at game (-122.9,-35.0);
// the café used to stand at (-115.5,-31.3). The builder jetty is set to where the game jetty then lands.
var PHASE2_LIVE=false;
const PHASE2={on:PHASE2_LIVE||/[?&#]phase2\b/.test(location.search+location.hash),d:[-7.4,-3.7]};
if(PHASE2.on){const _ipd=islPlatD;islPlatD=function(p){const D=_ipd(p);if(p===ISL.plat[0]&&!p.__p2){p.__p2=1;D[0]+=PHASE2.d[0];D[1]+=PHASE2.d[1];}return D;};}
