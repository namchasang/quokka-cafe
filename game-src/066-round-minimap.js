// ---------- Round minimap (Look Lab ?roundmap, Paul 23 Nov 2026: "mini-map ให้เปลี่ยนเป็นวงกลม") ----------
// Runs before the minimap code (part 067) reads the canvas size: the canvas becomes square, so the map window is square, and CSS
// clips it to a circle with a grey rim; the island is drawn flat and simple like Paul's example (pale sea, light land, white roads,
// grey buildings, soft green trees, an orange arrow for Kip). The legend, hint and zoom buttons stay as they are.
var ROUNDMM_LIVE=false;
const ROUNDMM={on:ROUNDMM_LIVE||/[?&#]roundmap\b/.test(location.search+location.hash)};
if(ROUNDMM.on)(()=>{const c=document.getElementById('mm');if(!c)return;c.width=c.height=220;const box=c.parentElement;box.classList.add('mmRound');
  const st=document.createElement('style');st.textContent='.mm.mmRound #mm{width:150px;height:150px;margin:2px auto 4px;border-radius:50%;box-shadow:0 0 0 4px #6b6f74,0 3px 10px rgba(0,0,0,.35)}'+
    '@media (max-width:700px),(max-height:520px){.mm.mmRound #mm{width:108px;height:108px}}';document.head.appendChild(st);})();
