// ---------- Island Lo-fi: 30 original lo-fi tracks (composed for Quokka Cafe) ----------
// set 'study' = lofi to study & work (warm e-piano, boom-bap drums, vinyl crackle)
// set 'rain'  = soft rain + slow lofi (slow piano, half-time brushes, rain on the roof)
// Chords: [semitones above the key, quality]. Every track is built the same way each time it plays.
const LF_V={maj7:[4,7,11,14],maj9:[4,7,11,14],m7:[3,7,10,14],m9:[3,7,10,14],'7':[4,10,14,21],'9sus':[5,10,14,19],'13':[4,10,14,21],m6:[3,7,9,14],'69':[4,9,14,19],m11:[3,10,14,17],add9:[4,7,14,16]};
const LF_P={
 a:[[0,'maj9'],[9,'m9'],[2,'m9'],[7,'9sus']],
 b:[[5,'maj7'],[4,'m7'],[2,'m7'],[0,'maj9']],
 c:[[2,'m9'],[7,'13'],[0,'maj9'],[9,'m9']],
 d:[[9,'m9'],[5,'maj9'],[0,'maj7'],[7,'9sus']],
 e:[[0,'maj7'],[0,'7'],[5,'maj7'],[5,'m6']],
 f:[[4,'m7'],[9,'m9'],[2,'m9'],[7,'13']],
 g:[[5,'maj7'],[7,'9sus'],[4,'m7'],[9,'m9']],
 h:[[0,'m9'],[5,'m9'],[10,'9sus'],[3,'maj7']],
 i:[[0,'m9'],[8,'maj7'],[3,'maj7'],[10,'69']],
 j:[[0,'m11'],[3,'maj7'],[5,'m9'],[7,'9sus']],
 k:[[5,'maj9'],[5,'m6'],[0,'maj9'],[0,'69']],
 l:[[2,'m9'],[4,'m7'],[5,'maj9'],[7,'9sus']]};
const LOFI=[
 {t:'Flat White Focus',set:'study',key:62,bpm:82,A:'a',B:'c',lead:'ep',sw:.16,r:0,len:236,seed:11},
 {t:'Notes on the Ferry',set:'study',key:65,bpm:78,A:'b',B:'f',lead:'pluck',sw:.18,r:1,len:240,seed:23},
 {t:'Thomson Bay Homework',set:'study',key:60,bpm:86,A:'c',B:'g',lead:'ep',sw:.14,r:2,len:232,seed:37},
 {t:'Pencil Shavings',set:'study',key:63,bpm:80,A:'e',B:'b',lead:'bell',sw:.17,r:3,len:238,seed:41},
 {t:'Library at the Settlement',set:'study',key:57,bpm:76,A:'h',B:'j',lead:'piano',sw:.15,r:4,len:244,seed:53},
 {t:'Espresso & Index Cards',set:'study',key:64,bpm:88,A:'g',B:'a',lead:'pluck',sw:.16,r:0,len:230,seed:67},
 {t:'Kip’s Study Desk',set:'study',key:61,bpm:84,A:'d',B:'l',lead:'ep',sw:.18,r:2,len:236,seed:71},
 {t:'Lighthouse Wi-Fi',set:'study',key:59,bpm:80,A:'f',B:'c',lead:'bell',sw:.15,r:1,len:240,seed:83},
 {t:'Salt Air Deadlines',set:'study',key:58,bpm:90,A:'i',B:'h',lead:'pluck',sw:.13,r:3,len:228,seed:97},
 {t:'Bike Bell Break',set:'study',key:65,bpm:86,A:'k',B:'e',lead:'ep',sw:.17,r:4,len:234,seed:101},
 {t:'Afternoon Lamington',set:'study',key:62,bpm:78,A:'l',B:'d',lead:'piano',sw:.18,r:0,len:242,seed:113},
 {t:'Quiet Hours at the Café',set:'study',key:60,bpm:74,A:'b',B:'k',lead:'ep',sw:.16,r:1,len:238,seed:127},
 {t:'Postcard Draft',set:'study',key:64,bpm:82,A:'j',B:'i',lead:'bell',sw:.15,r:2,len:236,seed:131},
 {t:'Mango Smoothie Pomodoro',set:'study',key:67,bpm:88,A:'a',B:'g',lead:'pluck',sw:.14,r:3,len:230,seed:149},
 {t:'Last Ferry, Last Chapter',set:'study',key:63,bpm:76,A:'d',B:'b',lead:'ep',sw:.17,r:4,len:244,seed:151},
 {t:'Rain on the Awning',set:'rain',key:62,bpm:68,A:'b',B:'d',lead:'piano',sw:.12,r:5,len:236,seed:163},
 {t:'Wet Sand, Warm Mug',set:'rain',key:60,bpm:64,A:'k',B:'a',lead:'ep',sw:.1,r:6,len:240,seed:167},
 {t:'Grey Morning at Geordie Bay',set:'rain',key:57,bpm:66,A:'h',B:'i',lead:'piano',sw:.12,r:7,len:238,seed:173},
 {t:'Drizzle on the Jetty',set:'rain',key:64,bpm:70,A:'a',B:'f',lead:'bell',sw:.11,r:5,len:234,seed:179},
 {t:'Window Seat',set:'rain',key:65,bpm:62,A:'e',B:'k',lead:'piano',sw:.1,r:8,len:244,seed:181},
 {t:'Umbrella for Two',set:'rain',key:63,bpm:68,A:'g',B:'b',lead:'ep',sw:.12,r:6,len:236,seed:191},
 {t:'Storm over the Salt Lakes',set:'rain',key:59,bpm:64,A:'j',B:'h',lead:'piano',sw:.1,r:7,len:240,seed:193},
 {t:'Foggy Lighthouse',set:'rain',key:61,bpm:66,A:'i',B:'j',lead:'bell',sw:.11,r:8,len:238,seed:197},
 {t:'Kip Naps Through the Rain',set:'rain',key:60,bpm:60,A:'d',B:'e',lead:'piano',sw:.1,r:5,len:246,seed:199},
 {t:'Damp Postcards',set:'rain',key:62,bpm:70,A:'c',B:'l',lead:'ep',sw:.12,r:6,len:232,seed:211},
 {t:'Steam from the Teapot',set:'rain',key:65,bpm:64,A:'f',B:'a',lead:'piano',sw:.11,r:7,len:240,seed:223},
 {t:'Slow Ferry in the Rain',set:'rain',key:58,bpm:62,A:'h',B:'k',lead:'ep',sw:.1,r:8,len:244,seed:227},
 {t:'Rainy Day Reading',set:'rain',key:64,bpm:66,A:'l',B:'c',lead:'piano',sw:.12,r:5,len:238,seed:229},
 {t:'Puddles by the Bakery',set:'rain',key:67,bpm:68,A:'b',B:'g',lead:'bell',sw:.11,r:6,len:236,seed:233},
 {t:'After the Storm',set:'rain',key:60,bpm:62,A:'a',B:'d',lead:'piano',sw:.1,r:8,len:238,seed:239}];
// two-bar melody rhythms: [start beat, length in beats]
const LF_R=[
 [[0,1.5],[1.5,.5],[2,1],[3.5,.5],[4,2],[6.5,1.5]],
 [[.5,.5],[1,1],[2,.5],[2.5,1.5],[4.5,.5],[5,2]],
 [[0,.75],[.75,.75],[1.5,1],[3,1],[4,3]],
 [[1,.5],[1.5,.5],[2,1.5],[4,.5],[4.5,.5],[5,1],[6,1.5]],
 [[0,2],[2.5,.5],[3,1],[4,1.5],[6,1]],
 [[0,1],[2,2],[4.5,.5],[5,2.5]],
 [[0,3],[3.5,.5],[4,1],[5,2.5]],
 [[1,1],[2,2],[5,1],[6,2]],
 [[0,2.5],[3,1],[4.5,3]]];
function lfRng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function lfVoice(key,ch,prev){const iv=LF_V[ch[1]],root=key+ch[0];let best=null,bd=1e9;
  for(let o=-24;o<=24;o+=12){const ns=iv.map(x=>root+x+o).sort((a,b)=>a-b);const c=ns.reduce((a,b)=>a+b,0)/ns.length;const d=Math.abs(c-(prev||66));if(ns[0]>=52&&ns[ns.length-1]<=79&&d<bd){bd=d;best=ns;}}
  return best||iv.map(x=>root+x);}
function lfCompile(tr){const R=lfRng(tr.seed),ev=[],rain=tr.set==='rain',spbar=4;
  const minor=['h','i','j'].includes(tr.A);const pent=minor?[0,3,5,7,10]:[0,2,4,7,9];
  const scale=[];for(let o=-12;o<=36;o+=12)pent.forEach(p=>scale.push(tr.key+p+o));
  const lo=tr.key+9,hi=tr.key+24;
  // song form, sized to tr.len seconds
  const target=Math.round(tr.len*tr.bpm/60/spbar);const form=[['I',4],['A',8]];let used=12;
  while(used+16+8<=target){form.push(['M',8],['N',8]);used+=16;if(used+4+16+8<=target&&form.filter(f=>f[0]==='M').length%2===1){form.push(['K',4]);used+=4;}}
  while(used+8+4<=target){form.push(['A',8]);used+=8;}
  while(used+4+4<=target){form.push(['K',4]);used+=4;}
  form.push(['O',4]);used+=4;
  const motifs=[0,1].map(()=>{const r=LF_R[(tr.r+Math.floor(R()*3))%LF_R.length];let s=0;return r.map(()=>{s+=R()<.5?(R()<.5?-1:1):(R()<.5?-2:2);if(s>4)s-=3;if(s<-4)s+=3;return s;}).map((s,i)=>[r[i][0],r[i][1],s]);});
  let bar=0,prevV=66;
  const near=(m,arr)=>arr.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
  form.forEach(([sec,n],si)=>{const prog=LF_P[sec==='N'?tr.B:tr.A];
    const drums=sec==='A'||sec==='M'||sec==='N'||(sec==='O'&&!rain);
    for(let k=0;k<n;k++){const B=(bar+k)*spbar,ch=prog[(bar+k)%4],root=tr.key+ch[0];
      const fade=sec==='O'?1-k/n*.55:sec==='I'?.7+k/n*.3:1;
      const v=lfVoice(tr.key,ch,prevV);prevV=v.reduce((a,b)=>a+b,0)/v.length;
      const last=sec==='O'&&k===n-1;
      // chords
      if(rain){ev.push({b:B,k:'ep',ns:v,d:last?6:3.8,v:.42*fade});
        [0,2,1,3].forEach((j,q)=>{if(q<3||R()<.6)ev.push({b:B+q*1+(q%2?tr.sw*.5:0)+.02,k:'pn',n:v[j]+12>84?v[j]:v[j]+12,d:1.6,v:.32*fade});});}
      else{ev.push({b:B,k:'ep',ns:v,d:last?6:1.6,v:.55*fade});if(!last){ev.push({b:B+2.5+tr.sw*.5,k:'ep',ns:v.slice(1),d:1,v:.38*fade});if(R()<.35)ev.push({b:B+3.5+tr.sw*.5,k:'ep',ns:v.slice(2),d:.5,v:.28*fade});}}
      // bass
      if(sec!=='I'||k>=2){let bn=root;while(bn>45)bn-=12;while(bn<33)bn+=12;
        if(rain){ev.push({b:B,k:'bass',n:bn,d:last?5:3.4,v:.19*fade});if(R()<.4&&!last)ev.push({b:B+3,k:'bass',n:bn+7,d:.9,v:.11*fade});}
        else{ev.push({b:B,k:'bass',n:bn,d:1.4,v:.21*fade});if(!last){ev.push({b:B+2.5+tr.sw*.5,k:'bass',n:R()<.5?bn+7:bn+12,d:.8,v:.15*fade});if(R()<.3)ev.push({b:B+3.5+tr.sw*.5,k:'bass',n:bn+10,d:.4,v:.1*fade});}}}
      // drums
      if(drums&&!last){
        if(rain){ev.push({b:B,k:'kick',v:.75});if(R()<.5)ev.push({b:B+2.5+tr.sw*.5,k:'kick',v:.5});ev.push({b:B+2,k:'rim',v:.8});
          for(let h=0;h<8;h++){if(h%2===0||R()<.35)ev.push({b:B+h*.5+(h%2?tr.sw:0),k:'hat',v:h%2?.35:.55});}}
        else{ev.push({b:B,k:'kick',v:1});if(R()<.6)ev.push({b:B+1.5+tr.sw*.5,k:'kick',v:.6});ev.push({b:B+2.5+tr.sw*.5,k:'kick',v:.85});
          ev.push({b:B+1,k:'snare',v:1});ev.push({b:B+3,k:'snare',v:1});if(R()<.25)ev.push({b:B+3.75,k:'snare',v:.3});
          for(let h=0;h<8;h++){ev.push({b:B+h*.5+(h%2?tr.sw:0),k:'hat',v:h%2?.55:(h%4===0?1:.75)});}}}
    }
    // melody: two-bar motif, answered, repeated, then a held cadence
    if(sec==='M'||sec==='N'||(sec==='K'&&!rain)||(sec==='O'&&rain)){const mo=motifs[sec==='N'?1:0];
      for(let g=0;g<n/2;g++){const b0=(bar+g*2)*spbar,ch=prog[(bar+g*2)%4];const ct=LF_V[ch[1]].map(x=>tr.key+ch[0]+x);
        let base=near(tr.key+17+(g%2?2:0),scale.filter(m=>m>=lo&&m<=hi));
        const cad=g===n/2-1;
        mo.forEach(([st,du,s],ni)=>{if(sec==='K'&&ni%2)return;if(cad&&st>=4)return;
          let idx=scale.indexOf(base)+s+(g===2&&ni===mo.length-1?1:0);idx=Math.max(0,Math.min(scale.length-1,idx));let m=scale[idx];
          while(m>hi)m-=12;while(m<lo)m+=12;
          if(du>=1&&Number.isInteger(st)){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});const cn=near(m,c);if(Math.abs(cn-m)<=2)m=cn;}
          ev.push({b:b0+st+(st%1?tr.sw*.5:0),k:'lead',n:m,d:du,v:(rain?.55:.6)});});
        if(cad){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});ev.push({b:b0+4,k:'lead',n:near(base,c),d:3.5,v:rain?.5:.55});}}}
    bar+=n;});
  const beats=used*spbar+(rain?2:1);
  ev.push({b:0,k:'bed',kind:rain?'rain':'crackle',d:beats});
  ev.sort((a,b)=>a.b-b.b);return{ev,beats};}
function rim(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2200;bp.Q.value=4;const g=c.createGain();g.gain.setValueAtTime(.11*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.07);s.connect(bp);bp.connect(g);s.start(t,Math.random());s.stop(t+.09);out(g,.6,.35);
  const o=c.createOscillator();o.type='triangle';o.frequency.value=820;const og=c.createGain();og.gain.setValueAtTime(.05*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.04);o.connect(og);o.start(t);o.stop(t+.05);out(og,.6,.2);}
function lkick(t,v){const c=RADIO.ctx;const o=c.createOscillator();o.frequency.setValueAtTime(100,t);o.frequency.exponentialRampToValueAtTime(40,t+.2);const g=c.createGain();g.gain.setValueAtTime(.3*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.34);o.connect(g);o.start(t);o.stop(t+.36);const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;g.connect(lp);out(lp,1,0);}
function lsnare(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1600;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4200;const g=c.createGain();g.gain.setValueAtTime(.085*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.2);s.connect(bp);bp.connect(lp);lp.connect(g);s.start(t,Math.random());s.stop(t+.22);out(g,.65,.3);
  const o=c.createOscillator();o.type='triangle';o.frequency.setValueAtTime(190,t);o.frequency.exponentialRampToValueAtTime(140,t+.08);const og=c.createGain();og.gain.setValueAtTime(.06*v,t);og.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(og);o.start(t);o.stop(t+.12);out(og,.7,.1);}
function lhat(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=6500;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=10000;const g=c.createGain();g.gain.setValueAtTime(.035*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.05);s.connect(hp);hp.connect(lp);lp.connect(g);s.start(t,Math.random());s.stop(t+.07);out(g,.7,0);}
// rain on the roof, or vinyl crackle, under a whole track
function lbedBuf(c){if(RADIO.bedCtx!==c){const n=c.sampleRate*9,b=c.createBuffer(2,n,c.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}RADIO.bedBuf=b;RADIO.bedCtx=c;}return RADIO.bedBuf;}
function lbed(t,dur,kind){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=lbedBuf(c);s.loop=true;const g=c.createGain();const lvl=kind==='rain'?.06:.016;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(lvl,t+3);g.gain.setValueAtTime(lvl,t+Math.max(3,dur-3));g.gain.linearRampToValueAtTime(0,t+dur+1);
  if(kind==='rain'){const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=500;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3800;const pk=c.createBiquadFilter();pk.type='peaking';pk.frequency.value=1400;pk.gain.value=-6;s.connect(hp);hp.connect(lp);lp.connect(pk);pk.connect(g);
    const s2=c.createBufferSource();s2.buffer=lbedBuf(c);s2.loop=true;s2.playbackRate.value=.5;const lp2=c.createBiquadFilter();lp2.type='lowpass';lp2.frequency.value=420;const g2=c.createGain();g2.gain.value=.7;s2.connect(lp2);lp2.connect(g2);g2.connect(g);s2.start(t,Math.random());s2.stop(t+dur+1.2);
    const l=c.createOscillator();l.frequency.value=.07;const lg=c.createGain();lg.gain.value=lvl*.25;l.connect(lg);lg.connect(g.gain);l.start(t);l.stop(t+dur+1.2);}
  else{const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=2500;s.connect(hp);hp.connect(g);}
  s.start(t,Math.random());s.stop(t+dur+1.2);g.connect(RADIO.master);}
function lfPlay(tr,e,t,spb){
  if(e.k==='ep')e.ns.forEach((m,i)=>epiano(t+i*.018,m,e.d*spb,e.v));
  else if(e.k==='pn')piano(t,e.n,e.d*spb,e.v);
  else if(e.k==='lead'){if(tr.lead==='ep')epiano(t,e.n,e.d*spb*.95,e.v);else if(tr.lead==='piano')piano(t,e.n,e.d*spb,e.v*.9);else if(tr.lead==='pluck')pluck(t,e.n,e.v*.8);else bell(t,e.n,e.d*spb,e.v*.8);}
  else if(e.k==='bass')bass(t,e.n,e.d*spb,e.v);
  else if(e.k==='kick')lkick(t,e.v);else if(e.k==='snare')lsnare(t,e.v);else if(e.k==='rim')rim(t,e.v);else if(e.k==='hat')lhat(t,e.v);
  else if(e.k==='bed')lbed(t,e.d*spb,e.kind);}
