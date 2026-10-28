// ---------- Sleep Lo-fi: 30 original slow tracks for sleep and rest ----------
// Very slow and soft: long warm chords, a felt piano drifting through the chord, a deep round bass,
// a few far-away notes on music box or flute, and the sea, rain or a quiet room underneath. Drums are rare and brushed.
const SL_P={
 drift:[[0,'maj9'],[5,'maj9'],[0,'maj9'],[5,'maj9']],
 harbour:[[9,'m9'],[5,'maj9'],[0,'add9'],[7,'9sus']],
 cove:[[0,'maj7'],[4,'m7'],[5,'maj9'],[5,'m6']],
 dune:[[2,'m9'],[0,'maj9'],[5,'maj7'],[0,'69']],
 moon:[[0,'m9'],[8,'maj7'],[3,'maj7'],[10,'69']],
 cloud:[[5,'maj9'],[9,'m9'],[4,'m7'],[0,'add9']]};
const SLEEP=[
 {t:'Tide Comes In Slowly',key:60,bpm:58,P:'drift',lead:'felt',bed:'sea',drums:0,len:236,seed:701},
 {t:'Lantern Off, Stars On',key:62,bpm:54,P:'harbour',lead:'box',bed:'none',drums:0,len:240,seed:709},
 {t:'Hammock at Midnight',key:57,bpm:60,P:'cove',lead:'felt',bed:'sea',drums:1,len:232,seed:719},
 {t:'Sleepy Ferry Home',key:63,bpm:56,P:'dune',lead:'flute',bed:'sea',drums:0,len:238,seed:727},
 {t:'Moonlight on the Salt Lake',key:58,bpm:52,P:'moon',lead:'box',bed:'none',drums:0,len:240,seed:733},
 {t:'Waves Counting Sheep',key:60,bpm:58,P:'cloud',lead:'felt',bed:'sea',drums:0,len:236,seed:739},
 {t:'Quiet Bay, Quiet Mind',key:65,bpm:54,P:'drift',lead:'flute',bed:'sea',drums:0,len:240,seed:743},
 {t:'Kip Dreams of Coffee',key:62,bpm:60,P:'cove',lead:'box',bed:'none',drums:1,len:232,seed:751},
 {t:'Blanket of Fog',key:57,bpm:52,P:'moon',lead:'felt',bed:'rain',drums:0,len:240,seed:757},
 {t:'Starlight over Thomson Bay',key:64,bpm:56,P:'harbour',lead:'box',bed:'sea',drums:0,len:238,seed:761},
 {t:'Night Swim in a Dream',key:59,bpm:54,P:'cloud',lead:'flute',bed:'sea',drums:0,len:240,seed:769},
 {t:'Seashell Lullaby',key:65,bpm:58,P:'dune',lead:'box',bed:'sea',drums:0,len:236,seed:773},
 {t:'Warm Milk and Honey',key:60,bpm:56,P:'cove',lead:'felt',bed:'none',drums:1,len:238,seed:787},
 {t:'Sound of the Sea Wall',key:62,bpm:52,P:'drift',lead:'felt',bed:'sea',drums:0,len:240,seed:797},
 {t:'Gentle Rain, Gentle Night',key:58,bpm:56,P:'moon',lead:'box',bed:'rain',drums:0,len:238,seed:809},
 {t:'Drifting Dinghy',key:63,bpm:58,P:'harbour',lead:'flute',bed:'sea',drums:0,len:236,seed:811},
 {t:'Three A.M. Lighthouse',key:57,bpm:52,P:'moon',lead:'felt',bed:'none',drums:0,len:240,seed:821},
 {t:'Sleeping Gulls',key:64,bpm:56,P:'cloud',lead:'box',bed:'sea',drums:0,len:238,seed:823},
 {t:'Pillow of Clouds',key:60,bpm:54,P:'dune',lead:'felt',bed:'rain',drums:0,len:240,seed:827},
 {t:'Distant Ferry Horn',key:62,bpm:58,P:'harbour',lead:'flute',bed:'sea',drums:1,len:236,seed:829},
 {t:'Breathing with the Tide',key:59,bpm:52,P:'drift',lead:'felt',bed:'sea',drums:0,len:240,seed:839},
 {t:'Southern Cross Dreams',key:65,bpm:56,P:'cove',lead:'box',bed:'none',drums:0,len:238,seed:853},
 {t:'Soft Sand, Slow Breath',key:61,bpm:54,P:'cloud',lead:'flute',bed:'sea',drums:0,len:240,seed:857},
 {t:'After the Last Customer',key:63,bpm:58,P:'dune',lead:'felt',bed:'rain',drums:1,len:236,seed:859},
 {t:'Moon over the Jetty',key:58,bpm:52,P:'moon',lead:'box',bed:'sea',drums:0,len:240,seed:863},
 {t:'Dreaming in Blue',key:60,bpm:56,P:'harbour',lead:'felt',bed:'rain',drums:0,len:238,seed:877},
 {t:'Little Boat, Big Sky',key:64,bpm:58,P:'drift',lead:'flute',bed:'sea',drums:0,len:236,seed:881},
 {t:'Cocoa Before Bed',key:62,bpm:56,P:'cove',lead:'box',bed:'none',drums:1,len:238,seed:883},
 {t:'Nightlight',key:57,bpm:52,P:'moon',lead:'felt',bed:'rain',drums:0,len:240,seed:887},
 {t:'Until Morning',key:60,bpm:54,P:'cloud',lead:'felt',bed:'sea',drums:0,len:240,seed:907}];
function slCompile(tr){const R=lfRng(tr.seed),ev=[],B4=4,prog=SL_P[tr.P];
  const minor=tr.P==='moon';const pent=minor?[0,3,5,7,10]:[0,2,4,7,9];const scale=[];for(let o=-12;o<=36;o+=12)pent.forEach(p=>scale.push(tr.key+p+o));
  const lo=tr.key+12,hi=tr.key+28;const near=(m,arr)=>arr.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
  const bars=Math.max(16,Math.round(tr.len*tr.bpm/60/B4/2)*2);let prevV=60;
  for(let k=0;k<bars;k+=2){const B=k*B4,ch=prog[(k/2)%4],root=tr.key+ch[0];const env=Math.min(1,(k+2)/6,(bars-k)/6);
    const v=lfVoice(tr.key,ch,prevV).map(x=>x-(x>66?12:0));prevV=v.reduce((a,b)=>a+b,0)/v.length;
    // long soft chord across two bars
    ev.push({b:B,k:'pad',ns:v,d:8.6,v:.9*env});ev.push({b:B,k:'ep',ns:v,d:7.5,v:.22*env});
    // felt piano drifting up the chord
    const arp=[0,1,2,3,2,1];for(let i=0;i<6;i++){if(i>0&&R()<.25)continue;ev.push({b:B+i*1.25+(R()<.5?.0:.12),k:'felt',n:v[arp[i]%v.length]+12,d:2.4,v:(.32+R()*.1)*env});}
    // deep bass
    let bn=root;while(bn>45)bn-=12;while(bn<33)bn+=12;ev.push({b:B,k:'sbass',n:bn,d:7.6,v:.8*env});
    // a few far-away notes
    if(k>=4&&k<bars-4&&R()<.75){const ct=LF_V[ch[1]].map(x=>{x+=root;while(x<lo)x+=12;while(x>hi)x-=12;return x;});let m=near(tr.key+19+Math.floor(R()*5),scale.filter(x=>x>=lo&&x<=hi));
      [[0,2],[2.5,1.5],[4,3]].forEach(([st,du],i)=>{if(i===1&&R()<.4)return;const cand=i===2?near(m,ct):m+(i===1?(R()<.5?2:-3):0);ev.push({b:B+st+1,k:'lead',n:Math.max(lo,Math.min(hi,cand)),d:du,v:.42*env});m=cand;});}
    // rare brushed drums
    if(tr.drums&&k>=4&&k<bars-4)for(let j=0;j<2;j++){const b=B+j*4;ev.push({b,k:'kick',v:.35});ev.push({b:b+2,k:'brush',v:.5});for(let h=0;h<4;h++)ev.push({b:b+h+.5,k:'brush',v:.22});}}
  const beats=bars*B4+4;if(tr.bed!=='none')ev.push({b:0,k:'bed',kind:tr.bed,d:beats});ev.push({b:0,k:'bed',kind:'room',d:beats});
  ev.sort((a,b)=>a.b-b.b);return{ev,beats};}
function lohat(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=6000;const g=c.createGain();g.gain.setValueAtTime(.03*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.28);s.connect(hp);hp.connect(g);s.start(t,Math.random());s.stop(t+.3);out(g,.7,.1);}
function hpPlay(tr,e,t,spb){
  if(e.k==='lead'){const d=e.d*spb;if(tr.lead==='ep')epiano(t,e.n,d*.95,e.v);else if(tr.lead==='pluck')pluck(t,e.n-12,e.v*.85);else if(tr.lead==='vib')bell(t,e.n,d,e.v*.75);else if(tr.lead==='flute')flute(t,e.n,d*.9,e.v*1.3);else oboe(t,e.n,d*.9,e.v*1.15);}
  else if(e.k==='ohat')lohat(t,e.v);
  else lfPlay(tr,e,t,spb);}
// City Pop and Sleep Lo-fi instruments
function cpLead(t,m,dur,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.075*vel,t+.02);g.gain.setValueAtTime(.06*vel,t+Math.max(.03,dur*.7));g.gain.linearRampToValueAtTime(0,t+dur+.12);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(900,t);lp.frequency.linearRampToValueAtTime(3200,t+.05);lp.frequency.exponentialRampToValueAtTime(1600,t+.4);
  const vib=c.createOscillator();vib.frequency.value=5.4;const vg=c.createGain();vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(7,t+.25);vib.connect(vg);
  [[-6,'sawtooth',.5],[6,'sawtooth',.5],[0,'square',.25]].forEach(([dt,ty,a])=>{const o=c.createOscillator();o.type=ty;o.frequency.value=f*(ty==='square'?.5:1);o.detune.value=dt;vg.connect(o.detune);const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.2);});
  vib.start(t);vib.stop(t+dur+.2);lp.connect(g);out(g,.55,.45);}
function cpBrass(t,ns,dur,vel){const c=RADIO.ctx;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*vel,t+.015);g.gain.exponentialRampToValueAtTime(.02*vel,t+dur*.8);g.gain.linearRampToValueAtTime(0,t+dur+.08);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(3400,t+.04);lp.frequency.exponentialRampToValueAtTime(1300,t+dur);
  ns.forEach(m=>[-8,8].forEach(d=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.12);}));lp.connect(g);out(g,.6,.35);}
function cpClap(t,v){const c=RADIO.ctx;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1500;bp.Q.value=.8;const g=c.createGain();g.gain.value=0;
  [0,.011,.023].forEach((o,i)=>{g.gain.setValueAtTime(.06*v,t+o);g.gain.exponentialRampToValueAtTime(.006*v,t+o+.01);});g.gain.setValueAtTime(.05*v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.18);
  const s=c.createBufferSource();s.buffer=RADIO.noise;s.connect(bp);bp.connect(g);s.start(t,Math.random());s.stop(t+.2);out(g,.7,.4);}
function cpBass(t,m,dur,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.24*vel,t+.006);g.gain.exponentialRampToValueAtTime(.09*vel,t+.09);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(2200,t);lp.frequency.exponentialRampToValueAtTime(420,t+.12);
  [['triangle',1,1],['sine',.5,.6],['square',1,.12]].forEach(([ty,h,a])=>{const o=c.createOscillator();o.type=ty;o.frequency.value=f*h;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.1);});lp.connect(g);out(g,.9,0);}
function cpGtr(t,m,v){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+.003);g.gain.exponentialRampToValueAtTime(.001,t+.09);
  const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f*2;bp.Q.value=1.2;[0,7].forEach(iv=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m+iv);o.connect(bp);o.start(t);o.stop(t+.1);});bp.connect(g);out(g,.6,.3);}
function cpCrash(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=5000;const g=c.createGain();g.gain.setValueAtTime(.04*v,t);g.gain.exponentialRampToValueAtTime(.001,t+1.6);s.connect(hp);hp.connect(g);s.start(t,Math.random());s.stop(t+1.7);out(g,.6,.4);}
function cpPlay(tr,e,t,spb){
  if(e.k==='lead'){const d=e.d*spb;if(tr.lead==='syn')cpLead(t,e.n,d*.9,e.v);else if(tr.lead==='sax')oboe(t,e.n,d*.9,e.v*1.2);else if(tr.lead==='flute')flute(t,e.n,d*.9,e.v*1.25);else{epiano(t,e.n,d,e.v*.8);bell(t,e.n+12,d,e.v*.35);}}
  else if(e.k==='cbass')cpBass(t,e.n,e.d*spb,e.v);else if(e.k==='gtr')cpGtr(t,e.n,e.v);else if(e.k==='brass')cpBrass(t,e.ns,e.d*spb,e.v);
  else if(e.k==='clap')cpClap(t,e.v);else if(e.k==='crash')cpCrash(t,e.v);else if(e.k==='ohat')lohat(t,e.v);
  else lfPlay(tr,e,t,spb);}
// Sleep Lo-fi sounds: a warm pad, a soft felt piano, a deep round bass, brushes, the sea and a quiet room
function slPad(t,ns,dur,vel){const c=RADIO.ctx;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.014*vel,t+dur*.3);g.gain.setValueAtTime(.014*vel,t+dur*.7);g.gain.linearRampToValueAtTime(0,t+dur);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=760;ns.forEach(m=>[-5,5].forEach(d=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=mtof(m);o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.1);}));lp.connect(g);out(g,.55,.7);}
function slFelt(t,m,dur,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*vel,t+.02);g.gain.exponentialRampToValueAtTime(.0006,t+dur+1.6);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=Math.min(1800,f*2.2);[[1,'sine',1],[2,'sine',.18],[3,'triangle',.05]].forEach(([h,ty,a])=>{const o=c.createOscillator();o.type=ty;o.frequency.value=f*h;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+1.7);});lp.connect(g);out(g,.6,.65);}
function slBass(t,m,dur,vel){const c=RADIO.ctx;const o=c.createOscillator();o.type='sine';o.frequency.value=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13*vel,t+.6);g.gain.setValueAtTime(.12*vel,t+dur*.7);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(g);o.start(t);o.stop(t+dur+.05);out(g,.9,0);}
function slBrush(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=3200;bp.Q.value=.6;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.025*v,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+.32);s.connect(bp);bp.connect(g);s.start(t,Math.random());s.stop(t+.35);out(g,.6,.5);}
function slBed(t,dur,kind){const c=RADIO.ctx;if(kind==='rain')return lbed(t,dur,'rain');const s=c.createBufferSource();s.buffer=lbedBuf(c);s.loop=true;const g=c.createGain();
  if(kind==='sea'){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=650;const lvl=.07;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(lvl,t+4);g.gain.setValueAtTime(lvl,t+Math.max(4,dur-4));g.gain.linearRampToValueAtTime(0,t+dur+1);
    const l=c.createOscillator();l.frequency.value=.09;const lg=c.createGain();lg.gain.value=lvl*.85;l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+dur+1.2);s.playbackRate.value=.7;s.connect(lp);lp.connect(g);}
  else{const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=3000;const lvl=.006;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(lvl,t+3);g.gain.setValueAtTime(lvl,t+Math.max(3,dur-3));g.gain.linearRampToValueAtTime(0,t+dur+1);s.connect(hp);hp.connect(g);}
  s.start(t,Math.random());s.stop(t+dur+1.2);g.connect(RADIO.master);}
function slPlay(tr,e,t,spb){
  if(e.k==='pad')slPad(t,e.ns,e.d*spb,e.v);else if(e.k==='felt')slFelt(t,e.n,e.d*spb,e.v);else if(e.k==='sbass')slBass(t,e.n,e.d*spb,e.v);else if(e.k==='brush')slBrush(t,e.v);
  else if(e.k==='lead'){const d=e.d*spb;if(tr.lead==='felt')slFelt(t,e.n,d,e.v*1.1);else if(tr.lead==='box')bell(t,e.n,d,e.v*.6);else flute(t,e.n,d*.9,e.v*.9);}
  else if(e.k==='bed')slBed(t,e.d*spb,e.kind);
  else lfPlay(tr,e,t,spb);}
// Track stations: Crystal Harbour and Island Lo-fi play composed tracks in order.
function crPlay(tr,e,t,spb){if(e.k==='lead'){(tr.lead==='flute'?flute:tr.lead==='oboe'?oboe:bell)(t,e.n,e.d*spb*.95,e.v*1.6);}else if(e.k==='bell')bell(t,e.n,e.d*spb,e.v*1.4);else if(e.k==='harp')harp(t,e.n,e.v);else if(e.k==='piano')piano(t,e.n,e.d*spb,e.v*1.4);else if(e.k==='bass')bass(t,e.n,e.d*spb,e.v*.65);else if(e.k==='strings')strings(t,e.ns,e.d*spb,e.v*.8);else if(e.k==='hat')hat(t,e.v*.6);}
const TSTN={crystal:{list:CRYSTAL,compile:crCompile,play:crPlay},lofi:{list:LOFI,compile:lfCompile,play:lfPlay},beats:{list:HOP,compile:hpCompile,play:hpPlay},citypop:{list:CITY,compile:cpCompile,play:cpPlay},sleep:{list:SLEEP,compile:slCompile,play:slPlay}};
function tsOf(){return TSTN[RADIO.st]||TSTN.crystal;}
function crStart(i,t0){const T=tsOf(),L=T.list;const tr=L[((i%L.length)+L.length)%L.length];RADIO.trk=L.indexOf(tr);RADIO.trkSt=RADIO.st;RADIO.cr=T.compile(tr);RADIO.crI=0;RADIO.crT0=t0!=null?t0:RADIO.ctx.currentTime+.15;RADIO.crSpb=60/tr.bpm;RADIO.crLoops=0;
  try{const n=$('#rdNow');if(n&&overlay==='radio')renderRadio();}catch(e){}if(running&&TSTN[RADIO.st]&&!RADIO.pl)toast('♫ Now playing: '+tr.t,2.6);}
function crTick(){const c=RADIO.ctx;if(RADIO.pl&&(RADIO.pl.done||!RADIO.cr))return;if(!RADIO.cr||RADIO.trkSt!==RADIO.st)crStart(RADIO.trkSt===RADIO.st?(RADIO.trk||0):0);const C=RADIO.cr,spb=RADIO.crSpb,T=tsOf();const win=c.currentTime+.6;
  while(RADIO.crI<C.ev.length){const e=C.ev[RADIO.crI];const t=RADIO.crT0+e.b*spb;if(t>win)break;RADIO.crI++;if(t<c.currentTime-.05&&e.k!=='bed')continue;
    T.play(T.list[RADIO.trk],e,Math.max(t,c.currentTime),spb);}
  if(RADIO.pl){const end=RADIO.crT0+C.beats*spb+PL_GAP;if(RADIO.crI>=C.ev.length&&c.currentTime>end-.5)plNext(end);return;}
  if(RADIO.crI>=C.ev.length&&c.currentTime>RADIO.crT0+C.beats*spb+1.2){crStart((RADIO.trk||0)+1);}}
