// ---------- Home screen 2 (Look Lab ?home2, Paul Nov 2026): only the title, the place and New / Load game; everything else sits behind a settings icon so the game scene behind is clear ----------
var HOME2_LIVE=true;
(function(){if(!(HOME2_LIVE||/[?&#]home2\b/.test(location.search+location.hash)))return;document.documentElement.classList.add('home2');
  const st=document.createElement('style');st.textContent=`
.home2 .ovTitle{background:linear-gradient(180deg,rgba(10,14,28,.55) 0%,rgba(10,14,28,0) 34%,rgba(10,14,28,0) 72%,rgba(10,14,28,.45) 100%);place-items:start center;padding:calc(28px + env(safe-area-inset-top,0px)) 16px 0}
.home2 .ovTitle .card{background:none;backdrop-filter:none;border:0;box-shadow:none;text-align:center;max-width:none;width:auto;padding:0}
.home2 .ovTitle .card>p,.home2 .ovTitle .langRow,.home2 .ovTitle .keys{display:none}
.home2 .ovTitle .eyebrow,.home2 .ovTitle .title,.home2 .ovTitle .subtitle{text-shadow:0 2px 0 #0f1426,0 0 12px rgba(10,14,28,.7)}
.home2 .ovTitle .btns{position:fixed;left:0;right:0;bottom:calc(28px + env(safe-area-inset-bottom,0px));justify-content:center;flex-wrap:wrap;gap:10px;padding:0 16px}
.home2 .ovTitle .btns .btn{box-shadow:0 4px 14px rgba(0,0,0,.35);font-size:18px;padding:14px 22px;min-width:150px;opacity:1}
.home2 .ovTitle .btns .btn.ghost{background:rgba(20,26,46,.85);color:#f5ecd8;border-color:#f5ecd8}
.home2 .ovTitle .title{font-size:clamp(40px,11vw,72px)}.home2 .ovTitle .eyebrow{font-size:13px;color:#cfe6f7}
#homeGear{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:max(12px,env(safe-area-inset-right,0px));z-index:3;width:46px;height:46px;border-radius:12px;border:2px solid #3a4670;background:rgba(20,26,46,.82);color:#f5ecd8;font-size:22px;cursor:pointer}
#homeGear:focus-visible{outline:2px solid #ffd34d}
#homeSet{position:fixed;inset:auto 12px calc(12px + env(safe-area-inset-bottom,0px)) 12px;top:calc(68px + env(safe-area-inset-top,0px));z-index:3;overflow:auto;background:rgba(15,20,38,.94);border:2px solid #3a4670;border-radius:10px;padding:16px;max-width:560px;margin:0 auto;text-align:left}
#homeSet .langRow{display:flex;gap:8px;justify-content:center;margin:10px 0}#homeSet>p{display:block}#homeSet .keys{display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin-top:10px}
#homeSet h3{margin:0 0 10px;font-family:"Pixelify Sans",monospace;color:#ffd34d}`;
  document.head.appendChild(st);
  const ov=document.getElementById('titleOv'),card=ov.querySelector('.card');
  const g=document.createElement('button');g.id='homeGear';g.type='button';g.setAttribute('aria-label','Settings, language and controls');g.textContent='⚙';ov.appendChild(g);
  const p=document.createElement('div');p.id='homeSet';p.hidden=true;p.innerHTML='<h3>Settings</h3>';ov.appendChild(p);
  // move the story blurb, language buttons and the controls list into the settings panel (same elements, so their handlers keep working)
  ['p','.langRow','.keys'].forEach(q=>{const e=card.querySelector(q);if(e)p.appendChild(e);});
  const close=document.createElement('button');close.className='btn';close.type='button';close.textContent='Close';close.style.marginTop='12px';close.onclick=()=>{p.hidden=true;};p.appendChild(close);
  g.onclick=()=>{p.hidden=!p.hidden;};})();
</script>
  <div class="overlay" id="wishOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Kip's notebook</div>
      <h2>Wishlist</h2>
      <div class="wish" id="wishList"></div>
      <div class="journal" id="journal"></div>
      <div class="btns"><button class="btn ghost" id="wishClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="mapOv" hidden>
    <div class="card panel mapcard">
      <button class="btn mapBack" id="mapBack" type="button" aria-label="Back to the game">← Back</button>
      <div class="eyebrow">Rottnest Island · Western Australia</div>
      <h2>Island map</h2>
      <div id="mapFit"><canvas id="bigMap" width="1400" height="557" aria-label="Full island map"></canvas></div>
      <p class="mapq" id="mapQuest"></p>
      <div class="legend big"><span><i class="lg-you"></i>You (cone = camera view)</span><span><i class="lg-quest"></i>Quest goal</span><span><i class="lg-npc"></i>Gus · Nana Wren</span><span><i class="lg-wild"></i>Wild quokka</span><span><i class="lg-tourist"></i>Tourist</span><span><i class="lg-lore"></i>Lore stone</span><span><i class="lg-cafe"></i>Quokka Cafe</span><span><i class="lg-cottage"></i>Settlement cottage</span><span class="lg-sp" hidden><i class="lg-home"></i>Home for sale</span><span class="lg-sp" hidden><i class="lg-myhome"></i>Your home</span><span><i class="lg-light"></i>Lighthouse</span><span><i class="lg-shell"></i>Lost shell</span><span><i class="lg-lake"></i>Pink salt lake</span><span><i class="lg-trail"></i>Limestone trail</span><span><i class="lg-beach"></i>Beach</span><span><i class="lg-tree"></i>Pine / tea tree</span><span><i class="lg-reef"></i>Reef</span></div>
      <p class="mapq" id="ftHint" hidden></p>
      <div class="btns"><button class="btn" id="ftGo" type="button" hidden>Fast travel</button><button class="btn" id="mapOW" type="button" hidden>Outer world</button><button class="btn" id="mapPerth" type="button">Perth map</button><button class="btn ghost" id="mapClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="plantOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Kip's garden · <span id="plantCoins">0</span> coins</div>
      <h2>Plant seeds</h2>
      <div class="wish" id="plantList"></div>
      <div class="btns"><button class="btn ghost" id="plantClose" type="button">Cancel</button></div>
    </div>
  </div>

  <div class="overlay" id="questOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="qEyebrow">Quest log</div>
      <div class="qtabs" id="qTabs"></div>
      <h2 id="qTitle"></h2>
      <div class="qgiver" id="qGiver"></div>
      <p id="qDesc"></p>
      <ol class="qsteps" id="qSteps"></ol>
      <div class="qreward" id="qReward"></div>
      <div class="btns"><button class="btn" id="qTrack" type="button">Track on map</button><button class="btn ghost" id="qClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="bizOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="bzEyebrow">Business</div>
      <h2 id="bzTitle"></h2>
      <p id="bzDesc"></p>
      <div class="stats" id="bzStats"></div>
      <div class="btns" id="bzBtns"></div>
    </div>
  </div>

  <div class="overlay" id="shopOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="shEyebrow">Shop</div>
      <h2 id="shTitle"></h2>
      <p id="shDesc"></p>
      <div class="wish" id="shList"></div>
      <div class="btns"><button class="btn ghost" id="shClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay ovTitle" id="slotsOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="slEyebrow">Load game</div>
      <h2 id="slTitle">Choose a save</h2>
      <div class="wish" id="slList"></div>
      <details class="slMove"><summary>Move saves to another device or app</summary>
        <p class="bgE">Saves live in this browser only. The Claude link, the home-screen web app and each phone or computer keep their own saves. Copy a save code here, then paste it on the other one.</p>
        <div class="btns"><button class="btn" id="slExport" type="button">Copy save code (all slots)</button></div>
        <textarea id="slCode" rows="3" placeholder="Paste a save code here" aria-label="Save code"></textarea>
        <div class="btns"><button class="btn ghost" id="slImport" type="button">Import save code</button></div>
        <p class="bgE" id="slMsg" role="status"></p>
      </details>
      <div class="btns"><button class="btn ghost" id="slBack" type="button">Back</button></div>
    </div>
  </div>

  <div class="overlay" id="albumOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Kip's postcard album</div>
      <h2 id="alCount">0 postcards</h2>
      <p>Walk up to places, animals, people and shops, then press the Photo button (or P) when it glows. Every new postcard pays 5 coins, with a bonus at 25, 50, 75 and 100.</p>
      <div class="qtabs" id="alFilters"></div>
      <div class="pcgrid" id="alGrid"></div>
      <div class="btns"><button class="btn ghost" id="alClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="bagOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Kip's bag</div>
      <h2>Inventory</h2>
      <div class="qtabs" id="bgTabs"></div>
      <div id="bgBody" class="bgBody"></div>
      <div class="btns"><button class="btn ghost" id="bgClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="guideOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Quokka Cafe and Friends</div>
      <h2>Guide</h2>
      <div class="qtabs" id="gdTabs"></div>
      <div id="gdBody" class="gdBody"></div>
      <div class="btns"><button class="btn ghost" id="gdClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="calOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Island calendar</div>
      <h2 id="calTitle">Summer</h2>
      <div class="qtabs" id="calTabs"></div>
      <div class="calGrid" id="calGrid"></div>
      <div class="calList" id="calList"></div>
      <div class="btns"><button class="btn ghost" id="calClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="friendOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="frRole">Friend</div>
      <h2 id="frName">Friend</h2>
      <div class="frHearts" id="frHearts" aria-label="Hearts"></div>
      <p class="frLine" id="frLine"></p>
      <p class="bgE" id="frGiftNote"></p>
      <div class="qtabs" id="frGifts"></div>
      <div class="btns"><button class="btn ghost" id="frClose" type="button">Bye for now</button></div>
    </div>
  </div>

  <div class="overlay" id="spotOv" hidden>
    <div class="card panel" style="max-width:680px;width:96vw">
      <div class="eyebrow" id="spEye">Snorkelling</div>
      <h2 id="spName">Spot 3 sea creatures</h2>
      <canvas id="spCanvas" width="640" height="400" style="display:block;width:100%;margin:8px auto;border-radius:10px;touch-action:none;cursor:crosshair" aria-label="Find the hidden things"></canvas>
      <p class="bgE"><b id="spCount">0 / 3</b> · <span id="spHint"></span></p>
      <div class="btns"><button class="btn ghost" id="spClose" type="button">Done</button></div>
    </div>
  </div>
  <div class="overlay" id="fishOv" hidden>
    <div class="card panel" style="max-width:380px">
      <div class="eyebrow">Fishing</div>
      <h2 id="fsName">Something is biting…</h2>
      <canvas id="fsCanvas" width="110" height="260" style="display:block;margin:8px auto;border-radius:6px;image-rendering:pixelated" aria-label="Fishing meter"></canvas>
      <p class="bgE" id="fsHint"></p>
      <div class="btns"><button class="btn" id="fsReel" type="button">Hold to reel</button><button class="btn ghost" id="fsClose" type="button">Done</button></div>
    </div>
  </div>

  <div class="overlay" id="museumOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Island Museum</div>
      <h2>Donations</h2>
      <p class="bgE" id="msNote"></p>
      <div class="qtabs" id="msTabs"></div>
      <div class="bgGrid" id="msGrid" style="max-height:48vh;overflow-y:auto"></div>
      <div class="btns"><button class="btn ghost" id="msClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="boardOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Restoration Board</div>
      <h2 id="bdCount">Bundles</h2>
      <p class="bgE">Help restore Rottnest. Complete a bundle to unlock a reward for the whole island.</p>
      <div class="gdBody" id="bdGrid"></div>
      <div class="btns"><button class="btn ghost" id="bdClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="mailOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Mailbox</div>
      <h2>Letters</h2>
      <div class="gdBody" id="mlList"></div>
      <div class="btns"><button class="btn ghost" id="mlClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="cafeOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Café HQ · <span id="cfCoins"></span></div>
      <h2 id="cfLevel">Level 1</h2>
      <div class="qtabs" id="cfTabs"></div>
      <div class="btns" style="margin:4px 0"><button class="btn" id="cfCollectAll" type="button" hidden>Collect all</button><button class="btn" id="cfTp" type="button" hidden>Teleport here · free</button></div>
      <div class="gdBody" id="cfWish" style="max-height:60vh" hidden></div>
      <div class="gdBody" id="cfBranch" style="max-height:60vh" hidden></div>
      <div class="gdBody" id="cfMain" style="max-height:60vh">
        <h3 class="bgH">Upgrade level</h3>
        <div class="cfLv" id="cfLv"></div>
        <h3 class="bgH">Style</h3>
        <div class="cfGrid" id="cfStyles"></div>
        <h3 class="bgH" id="cfWishH">Kip’s Journey · Wishlist</h3>
        <div id="cfWishBox"></div>
      </div>
      <div class="btns"><button class="btn ghost" id="cfClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="radioOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Café radio</div>
      <h2>Rottnest FM</h2>
      <p class="bgE" id="rdNow"></p>
      <div id="rdQuick"><button class="btn" id="rdToggle" type="button">Turn radio off</button></div>
      <div class="rdList" id="rdList"></div>
      <label class="rdVol">Volume <input type="range" id="rdVol" min="0" max="100" value="50"></label>
      <div class="btns"><button class="btn ghost" id="rdClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="passOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Perth Pass</div>
      <h2 id="psTitle">Unlock Fremantle &amp; Victoria Park</h2>
      <p class="bgE" id="psSub">Rottnest Island, South Perth and Heirisson Island are free to play. The Perth Pass opens Fremantle, Victoria Park and Perth CBD for good.</p>
      <ul class="psList">
        <li><b>Fremantle</b> · the Cappuccino Strip, markets, the round house and a harbour-side café branch</li>
        <li><b>Victoria Park</b> · Albany Hwy shops, new friends, seeds and furniture you can’t get elsewhere</li>
        <li>Their festivals, postcards, celebrity guests and café branches</li>
      </ul>
      <div class="psBuy" id="psBuy"></div>
      <label class="psCode">Have a code? <input id="psInput" type="text" placeholder="QCP-XXXX-XXXX-XX" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="20"></label>
      <p class="psMsg" id="psMsg"></p>
      <div class="btns"><button class="btn" id="psRedeem" type="button">Redeem</button><button class="btn ghost" id="psClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="coachOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="chSub">Island Loop bus · island bus</div>
      <h2 id="chTitle">Where to?</h2>
      <p class="bgE">Ride along and watch the island go by for 3 coins, or teleport straight there for 30.</p>
      <div class="rdList" id="chList"></div>
      <div class="btns"><button class="btn ghost" id="chClose" type="button">Stay here</button></div>
    </div>
  </div>

  <div class="overlay" id="visitOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Island Code</div>
      <h2>Visit friends</h2>
      <div class="qtabs" id="icTabs"></div>
      <div id="icDyn"></div>
      <div id="icDream" hidden>
      <h3 class="bgH">Share my island</h3>
      <p class="bgE">Make a code of your island as it is right now, then send it to a friend on LINE or Messenger.</p>
      <div class="vsRow"><input id="vsOwner" maxlength="24" placeholder="Your name" aria-label="Your name"><input id="vsIsland" maxlength="24" placeholder="Island name" aria-label="Island name"></div>
      <div class="btns"><button class="btn" id="vsMake" type="button">Make & copy my Dream Code</button></div>
      <h3 class="bgH">Visit a friend</h3>
      <textarea id="vsCode" rows="3" placeholder="Paste your friend's Dream Code (starts with QV1:)" aria-label="Friend's Dream Code"></textarea>
      <p class="bgE" id="vsMsg" role="status"></p>
      <div class="btns"><button class="btn" id="vsGo" type="button">Visit island</button></div>
      </div>
      <p class="bgE" id="icMsg" role="status"></p>
      <div class="btns"><button class="btn ghost" id="vsClose" type="button">Close</button></div>
    </div>
  </div>

  <div id="rotateOv" hidden><div class="rotBox"><div class="rotPhone"><i></i></div><b>Turn your phone sideways</b><span>Quokka Cafe plays in landscape only. Rotate your phone to keep playing. The game is paused.</span></div></div>
  <div class="overlay" id="gmOv" hidden>
    <div class="card panel">
      <div class="eyebrow">★ Game Master</div>
      <h2>GM tools</h2>
      <p class="bgE" id="gmInfo"></p>
      <div class="gmBody" id="gmBody"></div>
      <div class="btns"><button class="btn ghost" id="gmClose" type="button">Close</button></div>
    </div>
  </div>
  <div class="overlay" id="pauseOv" hidden>
    <div class="card panel" style="text-align:center;max-width:360px">
      <div class="eyebrow">Game paused</div>
      <h2>Paused</h2>
      <p class="bgE" id="pzInfo">Time is stopped. Kip, customers and the clock wait for you.</p>
      <div class="btns" style="justify-content:center;flex-wrap:wrap"><button class="btn" id="pzResume" type="button">▶ Resume</button><button class="btn ghost" id="pzSave" type="button">Save</button><button class="btn ghost" id="pzGuide" type="button">Guide</button></div>
      <div class="langRow" data-notr><button class="btn ghost langBtn" data-l="en" type="button">English</button><button class="btn ghost langBtn" data-l="th" type="button">ภาษาไทย</button></div>
    </div>
  </div>

  <div class="overlay" id="vactOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="vaEyebrow">Visiting</div>
      <h2 id="vaTitle">Guestbook</h2>
      <div id="vaBody"></div>
      <p class="bgE" id="vaMsg" role="status"></p>
      <div class="btns"><button class="btn ghost" id="vaClose" type="button">Close</button></div>
    </div>
  </div>

  <div class="overlay" id="homeOv" hidden>
    <div class="card panel mapcard">
      <div class="eyebrow">Decorate your home</div>
      <h2 id="hmTitle">Home</h2>
      <p class="mapq" id="hmBonus"></p>
      <canvas id="hmCanvas" width="640" height="360" aria-label="Your room. Tap to place furniture." style="width:100%;max-width:640px;aspect-ratio:16/9;image-rendering:pixelated;border:1px solid rgba(226,194,124,.35);border-radius:4px;cursor:pointer;display:block;margin:0 auto"></canvas>
      <p id="hmHint" style="font-size:12.5px;color:var(--muted);margin:6px 0 4px"></p>
      <div class="qtabs" id="hmInv"></div>
      <div class="btns"><button class="btn" id="hmSleep" type="button">Sleep here</button><button class="btn ghost" id="hmClose" type="button">Done</button></div>
    </div>
  </div>

  <div class="overlay" id="dayOv" hidden>
    <div class="card panel">
      <div class="eyebrow" id="dayEyebrow">Sunset</div>
      <h2 id="dayTitle">Day 1 done</h2>
      <div class="stats" id="dayStats"></div>
      <p id="dayNext"></p>
      <div class="btns"><button class="btn" id="sleepBtn" type="button">Sleep until morning</button></div>
    </div>
  </div>

  <div class="overlay" id="hospOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Rottnest Island Nursing Post</div>
      <h2>Kip fainted from hunger</h2>
      <canvas id="hpCanvas" width="520" height="320" aria-label="Kip resting in a hospital bed"></canvas>
      <p id="hpNote"></p>
      <div class="stats"><span>Hospital bill</span><span id="hpFee">200 coins</span><span>Stamina now</span><span>60%</span></div>
      <p class="bgE">Nurse: “Eat something every day or two, little one! The General Store sells pies and sandwiches.”</p>
      <div class="btns"><button class="btn" id="hpOk" type="button">Back to the island</button></div>
    </div>
  </div>

  <div class="overlay" id="endOv" hidden>
    <div class="card panel">
      <div class="eyebrow">Chapter 1 · The morning ferry</div>
      <h2>Home is Rottnest</h2>
      <p>Mum and Dad step off the ferry, blinking in the island sun. Kip pours three flat whites, and for the first time the café has a family table.</p>
      <p>Chapter 1 complete. Mum and Dad now live in the spare room and help serve tourists every day. Keep growing the café, the garden and your island life.</p>
      <div class="btns"><button class="btn" id="againBtn" type="button">Keep playing</button></div>
    </div>
  </div>
</div>

