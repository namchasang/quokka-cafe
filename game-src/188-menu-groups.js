// ---------- Menu in six groups (Paul, 15 Nov 2026: the ☰ column grew too long on a phone) ----------
// ☰ opens one sheet with six headings instead of a long column of buttons. The buttons are the same elements, moved into the
// sheet, so every handler keeps working; buttons added later (Graphics, GM tools...) land in their group or in Settings.
(()=>{const right=document.querySelector('.right'),mb=document.getElementById('menuBtn');if(!right||!mb)return;
  const GROUPS=[['play','🗺️ Play',['questBtn2','guideBtn','calBtn','wishBtn']],['bag','🎒 Bag & album',['albumBtn']],['cafe','☕ Café & shop',['cafeBtn','passBtn','acctBtn']],
    ['friends','🏝️ Friends',['visitBtn']],['music','🎵 Music',['radioBtn']],['set','⚙️ Settings',['saveBtn','unstuckBtn','gmBtn']]];
  const css=document.createElement('style');css.textContent=`#menuSheet{position:fixed;right:10px;top:64px;z-index:58;width:min(330px,calc(100vw - 20px));max-height:calc(100vh - 90px);overflow:auto;padding:10px 10px 6px;border-radius:14px;background:rgba(22,30,48,.96);border:2px solid #e8c37a;box-shadow:0 8px 24px rgba(0,0,0,.4);display:none}
#menuSheet.on{display:block}#menuSheet h4{margin:6px 2px 5px;font:800 12px "M PLUS Rounded 1c",system-ui,sans-serif;color:#ffd78a;letter-spacing:.04em}
#menuSheet .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}#menuSheet .grid:empty,#menuSheet section:has(.grid:empty){display:none}
#menuSheet .hudBtn{display:block!important;width:100%;margin:0;font-size:12px;padding:9px 6px;min-height:0;line-height:1.15;white-space:normal}#menuSheet .hudBtn[hidden]{display:none!important}`;document.head.appendChild(css);
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
