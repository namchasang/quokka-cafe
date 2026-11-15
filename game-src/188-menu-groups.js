// ---------- Menu in six groups (Paul, 15 Nov 2026: the ☰ column grew too long on a phone) ----------
// ☰ opens one sheet with six headings instead of a long column of buttons. The buttons are the same elements, moved into the
// sheet, so every handler keeps working; buttons added later (Graphics, GM tools...) land in their group or in Settings.
(()=>{const right=document.querySelector('.right'),mb=document.getElementById('menuBtn');if(!right||!mb)return;
  const GROUPS=[['play','🗺️ Play',['questBtn2','guideBtn','calBtn','wishBtn']],['bag','🎒 Bag & album',['albumBtn']],['cafe','☕ Café & shop',['cafeBtn','passBtn','acctBtn']],
    ['friends','🏝️ Friends',['visitBtn']],['music','🎵 Music',['radioBtn']],['set','⚙️ Settings',['saveBtn','unstuckBtn','gmBtn']]];
  const css=document.createElement('style');css.textContent=`#menuSheet{position:fixed;right:10px;top:64px;z-index:58;width:min(330px,calc(100vw - 20px));max-height:calc(100vh - 90px);overflow:auto;padding:10px 10px 6px;border-radius:14px;background:rgba(22,30,48,.96);border:2px solid #e8c37a;box-shadow:0 8px 24px rgba(0,0,0,.4);display:none}
#menuSheet.on{display:block}#menuSheet h4{margin:6px 2px 5px;font:800 12px "M PLUS Rounded 1c",system-ui,sans-serif;color:#ffd78a;letter-spacing:.04em}
#menuSheet .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}#menuSheet .grid:empty,#menuSheet section:has(.grid:empty){display:none}
#menuSheet .hudBtn{display:block!important;width:100%;margin:0;font-size:12px;padding:9px 6px;min-height:0;line-height:1.15;white-space:normal}#menuSheet .hudBtn[hidden]{display:none!important}
/* save slots: solid boxes so the text reads over the live island (Paul, 15 Nov 2026) */
#slotsOv .wi{background:rgba(20,28,46,.95);border:2px solid rgba(232,195,122,.75);border-radius:10px;padding:12px 14px;box-shadow:0 4px 14px rgba(0,0,0,.35)}#slotsOv .wi .n{color:#ffe6a8;font-size:16px}#slotsOv .wi .d{color:#d8deea;font-size:13px}#slotsOv .wi.empty .n{color:#f5ecd8}
#slotsOv h1,#slotsOv h2,#slotsOv .eyebrow,#slotsOv #slEyebrow,#slotsOv #slTitle{text-shadow:0 2px 0 rgba(10,16,32,.85),0 0 10px rgba(10,16,32,.7)}#slotsOv details,#slotsOv summary{background:rgba(20,28,46,.92);border-radius:10px;padding:6px 10px}`;document.head.appendChild(css);
  const sh=document.createElement('div');sh.id='menuSheet';sh.setAttribute('role','menu');const G={};
  GROUPS.forEach(([k,t])=>{const s=document.createElement('section');s.innerHTML='<h4>'+t+'</h4><div class="grid"></div>';sh.appendChild(s);G[k]=s.querySelector('.grid');});document.body.appendChild(sh);
  const where={};GROUPS.forEach(([k,,ids])=>ids.forEach(i=>where[i]=k));
  const place=b=>{if(!b||b.__mg||b.id==='menuBtn'||b.id==='pauseBtn'||b.id==='bagBtn'||b.id==='questBtn')return;if(!b.classList.contains('more'))return;b.__mg=1;let k=where[b.id];
    if(!k){const t=(b.textContent||'').toLowerCase();k=/graphic|builder|gm|lab|setting|save|stuck/.test(t)?'set':/radio|music|station/.test(t)?'music':/album|postcard|museum/.test(t)?'bag':/quest|guide|calendar|wish|map/.test(t)?'play':/café|cafe|shop|pass/.test(t)?'cafe':/code|friend|visit/.test(t)?'friends':'set';}
    G[k].appendChild(b);b.addEventListener('click',()=>setTimeout(close,0));};
  const sweep=()=>right.querySelectorAll('button.more').forEach(place);sweep();
  new MutationObserver(sweep).observe(right,{childList:true,subtree:true});
  const close=()=>{sh.classList.remove('on');mb.setAttribute('aria-expanded','false');};
  mb.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();sweep();right.classList.remove('open');const o=sh.classList.toggle('on');mb.setAttribute('aria-expanded',String(o));
    const r=mb.getBoundingClientRect();sh.style.top=Math.round(r.bottom+6)+'px';},true);
  document.addEventListener('pointerdown',e=>{if(sh.classList.contains('on')&&!sh.contains(e.target)&&e.target!==mb)close();},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
