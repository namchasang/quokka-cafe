// ---------- radio: generative background music (WebAudio, no files) ----------
const RADIO={ctx:null,master:null,rev:null,st:'off',vol:.5,timer:null,next:0,step:0,bar:0,nodes:[],wave:null,crackle:null};
const RSTATIONS={
 seaside:{name:'Seaside Piano',desc:'Gentle piano and soft waves, like a slow morning on the jetty.',bpm:72},
 citypop:{name:'City Pop',desc:'30 original city pop tracks: bright 80s pop with funky bass, claps, synths and brass for night drives and good moods.',bpm:108},
 sleep:{name:'Sleep Lo-fi',desc:'30 slow, soft tracks for sleep and rest, with the sea, rain or a quiet room underneath.',bpm:56},
 beats:{name:'Lo-fi Beats',desc:'30 original lo-fi hip hop tracks for work and study: jazzy chords, boom-bap drums, vinyl crackle.',bpm:86},
 lofi:{name:'Island Lo-fi',desc:'30 original lo-fi tracks: 15 to study and work to, 15 slow ones with soft rain on the roof.',bpm:78},
 breeze:{name:'Asian Breeze',desc:'Pentatonic plucks like a koto or guzheng over a calm pad.',bpm:66},
 crystal:{name:'Crystal Harbour',desc:'33 original orchestral tracks in the style of classic 90s RPGs: harp, flute, strings and music box.',bpm:80},
 off:{name:'Radio off',desc:'Just the island.'}};
try{const v=JSON.parse(localStorage.getItem('quokka-radio')||'null');if(v){RADIO.st=v.st||'seaside';RADIO.vol=v.vol!=null?v.vol:.5;}else RADIO.st='seaside';}catch(e){RADIO.st='seaside';}try{if(!localStorage.getItem('quokka-radio-v2')){localStorage.setItem('quokka-radio-v2','1');if(RADIO.st==='off')RADIO.st='seaside';}}catch(e){}
function radioSave(){try{localStorage.setItem('quokka-radio',JSON.stringify({st:RADIO.st,vol:RADIO.vol}));}catch(e){}}
function radioInit(){if(RADIO.ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;try{const c=new AC();RADIO.ctx=c;RADIO.master=c.createGain();RADIO.master.gain.value=0;
  const comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;RADIO.master.connect(comp);comp.connect(c.destination);
  const len=c.sampleRate*2.6,ir=c.createBuffer(2,len,c.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  RADIO.rev=c.createConvolver();RADIO.rev.buffer=ir;const rg=c.createGain();rg.gain.value=.35;RADIO.rev.connect(rg);rg.connect(RADIO.master);
  const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;RADIO.noise=nb;return true;}catch(e){return false;}}
function out(node,dry,wet){const c=RADIO.ctx;const g=c.createGain();g.gain.value=dry;node.connect(g);g.connect(RADIO.master);if(wet){const w=c.createGain();w.gain.value=wet;node.connect(w);w.connect(RADIO.rev);}}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function piano(t,m,dur,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.22*vel,t+.008);g.gain.exponentialRampToValueAtTime(.06*vel,t+.35);g.gain.exponentialRampToValueAtTime(.0008,t+dur+1.2);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(9000,f*7),t);lp.frequency.exponentialRampToValueAtTime(Math.max(400,f*2),t+1.2);
  [[1,'triangle',1],[2,'sine',.35],[3.01,'sine',.12]].forEach(([h,type,a])=>{const o=c.createOscillator();o.type=type;o.frequency.value=f*h;o.detune.value=(Math.random()-.5)*6;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+1.3);});
  lp.connect(g);out(g,.8,.45);}
function epiano(t,m,dur,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.16*vel,t+.01);g.gain.exponentialRampToValueAtTime(.0008,t+dur+.6);
  const o=c.createOscillator();o.type='sine';o.frequency.value=f;const o2=c.createOscillator();o2.type='sine';o2.frequency.value=f*2.001;const g2=c.createGain();g2.gain.value=.18;o2.connect(g2);g2.connect(g);o.connect(g);
  const trem=c.createOscillator();trem.frequency.value=4.5;const tg=c.createGain();tg.gain.value=.04*vel;trem.connect(tg);tg.connect(g.gain);[o,o2,trem].forEach(x=>{x.start(t);x.stop(t+dur+.7);});
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;g.connect(lp);out(lp,.75,.3);}
function pluck(t,m,vel){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2*vel,t+.004);g.gain.exponentialRampToValueAtTime(.0008,t+1.8);
  const o=c.createOscillator();o.type='triangle';o.frequency.setValueAtTime(f*1.012,t);o.frequency.exponentialRampToValueAtTime(f,t+.08);const o2=c.createOscillator();o2.type='sawtooth';o2.frequency.value=f;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(f*6,t);lp.frequency.exponentialRampToValueAtTime(f*1.2,t+.5);
  const g2=c.createGain();g2.gain.value=.25;o2.connect(g2);g2.connect(lp);o.connect(lp);lp.connect(g);[o,o2].forEach(x=>{x.start(t);x.stop(t+1.9);});out(g,.7,.55);}
function pad(t,ms,dur,vol){const c=RADIO.ctx;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;
  ms.forEach(m=>[-7,7].forEach(d=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=mtof(m);o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.1);}));lp.connect(g);out(g,.5,.6);}
function bass(t,m,dur,vol){const c=RADIO.ctx;const o=c.createOscillator();o.type='sine';o.frequency.value=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);o.start(t);o.stop(t+dur+.05);out(g,.9,0);}
function kick(t){const c=RADIO.ctx;const o=c.createOscillator();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);const g=c.createGain();g.gain.setValueAtTime(.32,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);o.start(t);o.stop(t+.32);out(g,.9,0);}
function hat(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;const g=c.createGain();g.gain.setValueAtTime(.05*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.06);s.connect(hp);hp.connect(g);s.start(t,Math.random());s.stop(t+.08);out(g,.8,0);}
function snare(t){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1800;const g=c.createGain();g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);s.connect(bp);bp.connect(g);s.start(t,Math.random());s.stop(t+.2);out(g,.7,.3);}
function loopNoise(kind){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;s.loop=true;const g=c.createGain();
  if(kind==='wave'){const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;g.gain.value=.05;const l=c.createOscillator();l.frequency.value=.11;const lg=c.createGain();lg.gain.value=.04;l.connect(lg);lg.connect(g.gain);l.start();s.connect(lp);lp.connect(g);RADIO.nodes.push(l);}
  else{const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=2500;g.gain.value=.012;s.connect(hp);hp.connect(g);}
  g.connect(RADIO.master);s.start();RADIO.nodes.push(s);}

