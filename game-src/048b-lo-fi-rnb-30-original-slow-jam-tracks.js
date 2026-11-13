// ---------- Lo-fi R&B: 30 original slow-jam tracks for late nights ----------
// Neo-soul chords on a warm tine keyboard that drifts left and right, chords pushed ahead of the bar,
// a sliding round bass, lazy swung drums with laid-back snares or finger snaps, a soft humming
// voice for the melody, "ooh" backing voices in the hook, and vinyl crackle or rain underneath.
const RB_P={
 neo:[[5,'maj9'],[4,'m7'],[2,'m9'],[0,'maj9']],
 soul:[[2,'m9'],[7,'13'],[0,'maj9'],[9,'m9']],
 slow:[[0,'maj9'],[9,'m9'],[2,'m9'],[7,'9sus']],
 dream:[[5,'maj9'],[7,'13'],[4,'m7'],[9,'m9']],
 moody:[[0,'m11'],[5,'m9'],[10,'13'],[3,'maj9']],
 smoke:[[0,'m9'],[8,'maj9'],[3,'maj9'],[10,'13']],
 groove:[[0,'m11'],[0,'m11'],[5,'m9'],[7,'7']]};
const RB_MINOR=['moody','smoke','groove'];
const RNB=[
 {t:'Slow Jam at the Jetty',key:62,bpm:74,A:'neo',B:'soul',lead:'vox',drum:'snare',bed:'crackle',sw:.28,r:0,len:224,seed:901},
 {t:'Velvet Night Shift',key:60,bpm:70,A:'moody',B:'smoke',lead:'vox',drum:'snap',bed:'crackle',sw:.3,r:1,len:230,seed:907},
 {t:'Candlelight Counter',key:65,bpm:76,A:'slow',B:'neo',lead:'keys',drum:'snare',bed:'crackle',sw:.27,r:2,len:220,seed:911},
 {t:'Honey in the Latte',key:63,bpm:72,A:'dream',B:'slow',lead:'gtr',drum:'snap',bed:'crackle',sw:.29,r:3,len:226,seed:919},
 {t:'Late Bus Home',key:57,bpm:68,A:'smoke',B:'moody',lead:'vox',drum:'snare',bed:'rain',sw:.3,r:4,len:232,seed:929},
 {t:'Neon over Thomson Bay',key:64,bpm:78,A:'soul',B:'dream',lead:'sax',drum:'snare',bed:'crackle',sw:.26,r:5,len:218,seed:937},
 {t:'Soft Spot for You',key:61,bpm:72,A:'neo',B:'slow',lead:'vox',drum:'snap',bed:'crackle',sw:.29,r:6,len:226,seed:941},
 {t:'Midnight Mocha',key:59,bpm:70,A:'groove',B:'moody',lead:'keys',drum:'snare',bed:'crackle',sw:.3,r:7,len:230,seed:947},
 {t:'Moonlit Boardwalk',key:66,bpm:74,A:'dream',B:'neo',lead:'vox',drum:'snare',bed:'crackle',sw:.28,r:8,len:224,seed:953},
 {t:'Silk and Sea Salt',key:62,bpm:68,A:'slow',B:'soul',lead:'gtr',drum:'snap',bed:'rain',sw:.3,r:0,len:232,seed:967},
 {t:'Last Call, Stay a While',key:58,bpm:72,A:'moody',B:'groove',lead:'vox',drum:'snare',bed:'crackle',sw:.29,r:1,len:226,seed:971},
 {t:'Pillow Talk by the Pier',key:63,bpm:70,A:'neo',B:'dream',lead:'vox',drum:'snap',bed:'crackle',sw:.3,r:2,len:230,seed:977},
 {t:'Cinnamon Kiss',key:65,bpm:76,A:'soul',B:'slow',lead:'sax',drum:'snare',bed:'crackle',sw:.27,r:3,len:220,seed:983},
 {t:'Slow Dance in the Kitchen',key:60,bpm:72,A:'slow',B:'dream',lead:'vox',drum:'snare',bed:'crackle',sw:.28,r:4,len:226,seed:991},
 {t:'Warm Hands, Cold Brew',key:57,bpm:74,A:'smoke',B:'groove',lead:'keys',drum:'snap',bed:'crackle',sw:.28,r:5,len:224,seed:997},
 {t:'Lazy Sunday Groove',key:64,bpm:78,A:'neo',B:'soul',lead:'gtr',drum:'snare',bed:'crackle',sw:.26,r:6,len:218,seed:1009},
 {t:'Fairy Lights and Feelings',key:61,bpm:70,A:'dream',B:'slow',lead:'vox',drum:'snap',bed:'crackle',sw:.3,r:7,len:230,seed:1013},
 {t:'After Hours Harmony',key:59,bpm:72,A:'moody',B:'smoke',lead:'vox',drum:'snare',bed:'rain',sw:.29,r:8,len:226,seed:1019},
 {t:'Dusk on the Deck',key:62,bpm:76,A:'soul',B:'neo',lead:'sax',drum:'snare',bed:'crackle',sw:.27,r:0,len:220,seed:1021},
 {t:'Smooth like Crema',key:66,bpm:74,A:'slow',B:'dream',lead:'keys',drum:'snap',bed:'crackle',sw:.28,r:1,len:224,seed:1031},
 {t:'Window Seat Serenade',key:63,bpm:68,A:'neo',B:'slow',lead:'vox',drum:'snare',bed:'rain',sw:.3,r:2,len:232,seed:1033},
 {t:'Two Cups, One Table',key:60,bpm:72,A:'dream',B:'soul',lead:'gtr',drum:'snap',bed:'crackle',sw:.29,r:3,len:226,seed:1039},
 {t:'Tender Tide',key:58,bpm:70,A:'groove',B:'smoke',lead:'vox',drum:'snare',bed:'crackle',sw:.3,r:4,len:230,seed:1049},
 {t:'Purple Sky over the Swan',key:64,bpm:76,A:'soul',B:'dream',lead:'vox',drum:'snare',bed:'crackle',sw:.27,r:5,len:220,seed:1051},
 {t:'Butter Croissant Blues',key:61,bpm:74,A:'moody',B:'groove',lead:'sax',drum:'snap',bed:'crackle',sw:.28,r:6,len:224,seed:1061},
 {t:'Caramel Moon',key:65,bpm:70,A:'slow',B:'neo',lead:'vox',drum:'snap',bed:'crackle',sw:.3,r:7,len:230,seed:1063},
 {t:'Love Notes on Napkins',key:62,bpm:72,A:'neo',B:'dream',lead:'keys',drum:'snare',bed:'crackle',sw:.29,r:8,len:226,seed:1069},
 {t:'Hum Along, Kip',key:60,bpm:76,A:'dream',B:'soul',lead:'vox',drum:'snare',bed:'crackle',sw:.27,r:0,len:220,seed:1087},
 {t:'Sway with the Sea Breeze',key:57,bpm:72,A:'smoke',B:'moody',lead:'gtr',drum:'snap',bed:'rain',sw:.29,r:1,len:226,seed:1091},
 {t:'Goodnight, Sweet Island',key:63,bpm:68,A:'slow',B:'neo',lead:'vox',drum:'snap',bed:'crackle',sw:.3,r:2,len:232,seed:1093}];
function rbCompile(tr){const R=lfRng(tr.seed),ev=[],bar4=4,sw=tr.sw;
  const S16=b=>{const f=b%.5;return b+(Math.abs(f-.25)<1e-6?sw*.5:0);};
  const S8=b=>{const f=b%1;return b+(Math.abs(f-.5)<1e-6?sw*.33:0);};
  const loose=b=>b+(R()-.5)*.03;// a hand that is never quite on the grid
  const minor=RB_MINOR.includes(tr.A);const pent=minor?[0,3,5,7,10]:[0,2,4,7,9];
  const scale=[];for(let o=-12;o<=36;o+=12)pent.forEach(p=>scale.push(tr.key+p+o));
  const lo=tr.key+7,hi=tr.key+21;
  const target=Math.round(tr.len*tr.bpm/60/bar4);const form=[['I',4],['A',8]];let used=12;
  while(used+16+4<=target){form.push(['M',8],['N',8]);used+=16;if(used+4+16+4<=target&&form.filter(f=>f[0]==='M').length%2===1){form.push(['K',4]);used+=4;}}
  while(used+8+4<=target){form.push(['A',8]);used+=8;}
  form.push(['O',4]);used+=4;
  const motifs=[0,1].map(()=>{const r=LF_R[(tr.r+Math.floor(R()*4))%LF_R.length];let s=0;return r.map(()=>{s+=R()<.55?(R()<.5?-1:1):(R()<.5?-2:2);if(s>4)s-=3;if(s<-4)s+=3;return s;}).map((s,i)=>[r[i][0],r[i][1],s]);});
  const near=(m,arr)=>arr.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
  const kickPat=[[0,1],[S16(1.75),R()<.6?.5:0],[R()<.5?2.5:S16(2.75),.85],[3.5,R()<.3?.4:0]].filter(k=>k[1]>0);
  let bar=0,prevV=64,prevB=null;
  form.forEach(([sec,n])=>{const prog=RB_P[sec==='N'?tr.B:tr.A];
    const drums=sec==='A'||sec==='M'||sec==='N';
    for(let k=0;k<n;k++){const B=(bar+k)*bar4,ch=prog[(bar+k)%4],nch=prog[(bar+k+1)%4],root=tr.key+ch[0];
      const fade=sec==='O'?1-k/n*.6:sec==='I'?.6+k/n*.4:1;const last=sec==='O'&&k===n-1;
      const v=lfVoice(tr.key,ch,prevV);prevV=v.reduce((a,b)=>a+b,0)/v.length;
      // keys: a long rolled chord, a soft re-strike, and either a push into the next chord or a chromatic slide into it
      if(last)ev.push({b:B,k:'keys',ns:v,d:7,v:.5*fade});
      else{ev.push({b:loose(B),k:'keys',ns:v,d:2.4,v:.5*fade});
        if(R()<.6)ev.push({b:S8(2.5)+B,k:'keys',ns:v.slice(1),d:.7,v:.28*fade});
        const nv=lfVoice(tr.key,nch,prevV);
        if(nch!==ch&&R()<.45)ev.push({b:S16(3.75)+B,k:'keys',ns:nv,d:.5,v:.3*fade});
        else if(R()<.35)ev.push({b:S8(3.5)+B,k:'keys',ns:lfVoice(tr.key,[nch[0]+1,'7'],prevV).slice(0,3),d:.4,v:.26*fade});}
      // a quiet pad under the verse and hook
      if(sec==='M'&&k%2===0)ev.push({b:B,k:'pad',ns:v,d:8,v:.9});
      // "ooh" backing voices in the hook
      if(sec==='N'&&k%2===0)ev.push({b:B+.1,k:'ooh',ns:v.slice(-3),d:7.4,v:.5});
      // bass: a long root with a slide in, a high answer, and a slide into the next chord
      if(sec!=='I'||k>=2){let bn=root;while(bn>45)bn-=12;while(bn<33)bn+=12;let an=tr.key+nch[0];while(an>bn+7)an-=12;while(an<bn-7)an+=12;
        if(last)ev.push({b:B,k:'rbass',n:bn,d:4,v:.22*fade,sl:prevB});
        else{ev.push({b:B,k:'rbass',n:bn,d:1.6,v:.24*fade,sl:R()<.45?prevB:null});
          ev.push({b:S16(2.75)+B,k:'rbass',n:bn+(R()<.5?12:7),d:.35,v:.12*fade,sl:R()<.4?bn:null});
          if(R()<.65)ev.push({b:S8(3.5)+B,k:'rbass',n:an+(an>bn?-1:1),d:.45,v:.14*fade,sl:null});}
        prevB=bn;}
      // lazy drums: snare or snaps laid back behind the beat, heavy-swung hats
      if(drums&&!last){kickPat.forEach(([b,vv])=>ev.push({b:B+b,k:'kick',v:vv*(sec==='A'?.85:1)}));
        const bk=tr.drum==='snap'?'snap':'snare';[1,3].forEach(b=>ev.push({b:B+b+.04,k:bk,v:tr.drum==='snap'?1:.8}));
        if(tr.drum==='snare'&&R()<.4)ev.push({b:S16(2.75)+B,k:'snare',v:.18});
        if(tr.drum==='snap'&&R()<.5)ev.push({b:B+3.06,k:'rim',v:.35});
        for(let h=0;h<8;h++){const hb=S8(h*.5);ev.push({b:loose(B+hb),k:'hat',v:h%2===0?.75:.38});if(h%2===1&&R()<.2)ev.push({b:B+S16(h*.5+.25),k:'hat',v:.22});}
        if((bar+k)%4===3)ev.push({b:B+S8(3.5),k:'ohat',v:.45});}
      else if(sec==='K'&&!last){ev.push({b:B,k:'kick',v:.45});[1,3].forEach(b=>ev.push({b:B+b+.04,k:'snap',v:.8}));}}
    // melody: a hummed theme and answer, scooped into long notes, with a little run into the end of each phrase
    if(sec==='M'||sec==='N'||sec==='K'){const mo=motifs[sec==='N'?1:0];
      for(let g=0;g<n/2;g++){const b0=(bar+g*2)*bar4,ch=prog[(bar+g*2)%4];const ct=LF_V[ch[1]].map(x=>tr.key+ch[0]+x);
        const base=near(tr.key+14+(g%2?2:0),scale.filter(m=>m>=lo&&m<=hi));const cad=g===n/2-1;
        mo.forEach(([st,du,s],ni)=>{if(sec==='K'&&ni%2)return;if(cad&&st>=3.5)return;
          let idx=scale.indexOf(base)+s+(g===2&&ni===mo.length-1?1:0);idx=Math.max(0,Math.min(scale.length-1,idx));let m=scale[idx];while(m>hi)m-=12;while(m<lo)m+=12;
          if(du>=1&&Number.isInteger(st)){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});const cn=near(m,c);if(Math.abs(cn-m)<=2)m=cn;}
          ev.push({b:b0+st+(st%1?sw*.5:0),k:'lead',n:m,d:du,v:.58});});
        if(cad){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});const end=near(base,c);
          if(R()<.6){let i=scale.indexOf(near(end+5,scale));[3.25,3.5,3.75].forEach((st,j)=>{const m=scale[Math.max(0,i-j)];ev.push({b:b0+S16(st),k:'lead',n:Math.max(lo,Math.min(hi,m)),d:.25,v:.4});});}
          ev.push({b:b0+4,k:'lead',n:end,d:3.2,v:.52});}}}
    bar+=n;});
  const beats=used*bar4+1;ev.push({b:0,k:'bed',kind:'crackle',d:beats});if(tr.bed==='rain')ev.push({b:0,k:'bed',kind:'rain',d:beats});
  ev.sort((a,b)=>a.b-b.b);return{ev,beats};}
// Lo-fi R&B sounds
function rbKeys(t,ns,dur,vel,roll){// one filter, envelope and auto-pan per chord; each note only two sines
  const c=RADIO.ctx;const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12*vel,t+.012);g.gain.exponentialRampToValueAtTime(.05*vel,t+.6);g.gain.exponentialRampToValueAtTime(.0006,t+dur+1);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=Math.min(2400,mtof(ns[0])*5);lp.connect(g);const end=t+dur+1.1,os=[];
  ns.forEach((m,i)=>{const f=mtof(m),st=t+i*roll;const ng=c.createGain();ng.gain.setValueAtTime(0,st);ng.gain.linearRampToValueAtTime(1,st+.01);ng.connect(lp);
    const o=c.createOscillator();o.type='sine';o.frequency.value=f;o.connect(ng);const o2=c.createOscillator();o2.type='sine';o2.frequency.value=f*2.002;const g2=c.createGain();g2.gain.value=.14;o2.connect(g2);g2.connect(ng);
    o.start(st);o2.start(st);os.push(o,o2);});
  const top=mtof(ns[ns.length-1]);const tn=c.createOscillator();tn.type='sine';tn.frequency.value=top*7.1;const tg=c.createGain();tg.gain.setValueAtTime(.05,t);tg.gain.exponentialRampToValueAtTime(.0005,t+.12);tn.connect(tg);tg.connect(g);tn.start(t);tn.stop(t+.14);
  const pan=c.createStereoPanner();const lfo=c.createOscillator();lfo.frequency.value=3.2;const lg=c.createGain();lg.gain.value=.45;lfo.connect(lg);lg.connect(pan.pan);g.connect(pan);lfo.start(t);os.push(lfo);
  os.forEach(x=>x.stop(end));out(pan,.72,.35);}
function rbVox(t,ns,dur,vel,soft){// a hummed voice: saw tones through two or three vowel filters; several notes share one bank
  const c=RADIO.ctx;const g=c.createGain();const at=soft?.35:.06,rl=soft?.6:.2;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+at);g.gain.setValueAtTime(vel*.9,t+Math.max(at,dur*.8));g.gain.linearRampToValueAtTime(0,t+dur+rl);
  const src=c.createGain();const vib=c.createOscillator();vib.frequency.value=5.1;const vg=c.createGain();vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(soft?8:24,t+Math.min(.5,dur*.6+.05));vib.connect(vg);
  const end=t+dur+rl+.05,os=[vib];
  ns.forEach(m=>{const f=mtof(m);const o=c.createOscillator();o.type='sawtooth';if(!soft){o.frequency.setValueAtTime(f*.944,t);o.frequency.exponentialRampToValueAtTime(f,t+.09);}else o.frequency.value=f;vg.connect(o.detune);o.connect(src);os.push(o);});
  (soft?[[320,6,1],[820,7,.45]]:[[430,6,1],[950,7,.45],[2600,9,.1]]).forEach(([fr,q,a])=>{const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=fr;bp.Q.value=q;const bg=c.createGain();bg.gain.value=a*(soft?1:1.4);src.connect(bp);bp.connect(bg);bg.connect(g);});
  if(!soft){const s=c.createBufferSource();s.buffer=RADIO.noise;const nb=c.createBiquadFilter();nb.type='bandpass';nb.frequency.value=2200;nb.Q.value=.8;const ng=c.createGain();ng.gain.setValueAtTime(.06*vel,t);ng.gain.exponentialRampToValueAtTime(.0005,t+.12);s.connect(nb);nb.connect(ng);ng.connect(g);s.start(t,Math.random());s.stop(t+.14);}
  os.forEach(x=>{x.start(t);x.stop(end);});out(g,.6,.55);}
function rbBass(t,m,dur,vel,sl){const c=RADIO.ctx,f=mtof(m);const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.26*vel/.24,t+.012);g.gain.exponentialRampToValueAtTime(.15*vel/.24,t+.3);g.gain.exponentialRampToValueAtTime(.001,t+dur+.12);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;
  [['sine',1],['triangle',.35]].forEach(([ty,a])=>{const o=c.createOscillator();o.type=ty;if(sl&&sl!==m){o.frequency.setValueAtTime(mtof(sl),t);o.frequency.exponentialRampToValueAtTime(f,t+.11);}else o.frequency.value=f;const og=c.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.15);});
  lp.connect(g);out(g,.9,0);}
function rbSnap(t,v){const c=RADIO.ctx;const s=c.createBufferSource();s.buffer=RADIO.noise;const bp=c.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2300;bp.Q.value=3.5;const g=c.createGain();g.gain.setValueAtTime(.16*v,t);g.gain.exponentialRampToValueAtTime(.001,t+.08);
  s.connect(bp);bp.connect(g);s.start(t,Math.random());s.stop(t+.1);out(g,.6,.5);}
function rbPlay(tr,e,t,spb){
  if(e.k==='keys')rbKeys(t,e.ns,e.d*spb,e.v,.022);
  else if(e.k==='lead'){const d=e.d*spb;if(tr.lead==='vox')rbVox(t,[e.n],d*.92,e.v*.11,0);else if(tr.lead==='keys')rbKeys(t,[e.n+12],d,e.v*1.1,0);else if(tr.lead==='gtr')pluck(t,e.n,e.v*.75);else oboe(t,e.n,d*.9,e.v*1.1);}
  else if(e.k==='ooh')rbVox(t,e.ns,e.d*spb,e.v*.05,1);
  else if(e.k==='rbass')rbBass(t,e.n,e.d*spb,e.v,e.sl);
  else if(e.k==='snap')rbSnap(t,e.v);
  else if(e.k==='pad')slPad(t,e.ns,e.d*spb,e.v);
  else if(e.k==='ohat')lohat(t,e.v);
  else lfPlay(tr,e,t,spb);}
