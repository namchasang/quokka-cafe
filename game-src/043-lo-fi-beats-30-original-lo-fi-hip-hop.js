// ---------- Lo-fi Beats: 30 original lo-fi hip hop tracks for work and study ----------
// Jazzy chord loops chopped into stabs, swung 16th hats, a boom-bap kick and snare with ghost notes,
// a round bass with approach notes, and a melody on e-piano, guitar, vibes, flute or a reedy lead.
const HP_P={
 iiVI:[[2,'m9'],[7,'13'],[0,'maj9'],[0,'69']],
 viiiV:[[9,'m9'],[2,'m9'],[7,'13'],[0,'maj9']],
 four:[[5,'maj9'],[4,'m7'],[9,'m9'],[2,'m9']],
 dor:[[0,'m9'],[5,'7'],[0,'m9'],[5,'7']],
 desc:[[0,'m11'],[10,'69'],[8,'maj7'],[7,'7']],
 turn:[[4,'m7'],[9,'7'],[2,'m9'],[7,'13']],
 lift:[[5,'maj7'],[7,'9sus'],[0,'maj9'],[9,'m9']],
 night:[[0,'m9'],[3,'maj7'],[8,'maj7'],[7,'7']]};
const HP_MINOR=['dor','desc','night'];
const HOP=[
 {t:'Espresso Shot Beats',key:62,bpm:88,A:'iiVI',B:'four',lead:'ep',sw:.2,r:0,len:214,seed:301},
 {t:'Notebook Margins',key:65,bpm:84,A:'viiiV',B:'lift',lead:'vib',sw:.22,r:1,len:222,seed:307},
 {t:'Highlighter Yellow',key:60,bpm:90,A:'four',B:'turn',lead:'pluck',sw:.18,r:2,len:210,seed:311},
 {t:'Deadline in Daylight',key:57,bpm:86,A:'dor',B:'desc',lead:'flute',sw:.21,r:3,len:218,seed:313},
 {t:'Laptop by the Jetty',key:63,bpm:82,A:'lift',B:'viiiV',lead:'ep',sw:.23,r:4,len:226,seed:317},
 {t:'Inbox Zero',key:64,bpm:92,A:'turn',B:'iiVI',lead:'vib',sw:.19,r:5,len:208,seed:331},
 {t:'Coffee Ring Notes',key:61,bpm:85,A:'iiVI',B:'lift',lead:'reed',sw:.22,r:6,len:220,seed:337},
 {t:'Cold Brew Focus',key:59,bpm:80,A:'night',B:'dor',lead:'ep',sw:.24,r:7,len:230,seed:347},
 {t:'Sticky Note Wall',key:65,bpm:88,A:'four',B:'iiVI',lead:'pluck',sw:.2,r:8,len:214,seed:349},
 {t:'Ferry Wi-Fi Study',key:62,bpm:84,A:'viiiV',B:'turn',lead:'flute',sw:.21,r:0,len:222,seed:353},
 {t:'Café Corner Booth',key:60,bpm:86,A:'lift',B:'four',lead:'vib',sw:.22,r:1,len:218,seed:359},
 {t:'Late Lecture Rewind',key:58,bpm:82,A:'desc',B:'night',lead:'reed',sw:.23,r:2,len:226,seed:367},
 {t:'Bike Lane Commute',key:67,bpm:92,A:'iiVI',B:'viiiV',lead:'pluck',sw:.18,r:3,len:208,seed:373},
 {t:'Overtime at the Counter',key:63,bpm:84,A:'dor',B:'night',lead:'ep',sw:.22,r:4,len:222,seed:379},
 {t:'Pomodoro Twenty-Five',key:64,bpm:90,A:'turn',B:'lift',lead:'vib',sw:.2,r:5,len:210,seed:383},
 {t:'Thesis Draft Three',key:61,bpm:80,A:'viiiV',B:'four',lead:'flute',sw:.24,r:6,len:230,seed:389},
 {t:'Quokka on a Coffee Break',key:65,bpm:88,A:'lift',B:'iiVI',lead:'pluck',sw:.2,r:7,len:214,seed:397},
 {t:'Reading Room by the Sea',key:59,bpm:82,A:'night',B:'desc',lead:'ep',sw:.23,r:8,len:226,seed:401},
 {t:'Steam Wand Swing',key:62,bpm:94,A:'iiVI',B:'turn',lead:'reed',sw:.19,r:0,len:206,seed:409},
 {t:'Spreadsheet Sunset',key:57,bpm:84,A:'desc',B:'dor',lead:'vib',sw:.22,r:1,len:222,seed:419},
 {t:'Library Card',key:64,bpm:86,A:'four',B:'viiiV',lead:'flute',sw:.21,r:2,len:218,seed:421},
 {t:'Golden Hour Homework',key:60,bpm:82,A:'lift',B:'turn',lead:'ep',sw:.23,r:3,len:226,seed:431},
 {t:'Index Card Shuffle',key:66,bpm:90,A:'turn',B:'iiVI',lead:'pluck',sw:.19,r:4,len:210,seed:433},
 {t:'Quiet Desk, Loud Ideas',key:63,bpm:86,A:'night',B:'dor',lead:'reed',sw:.22,r:5,len:218,seed:439},
 {t:'Second Flat White',key:65,bpm:88,A:'iiVI',B:'four',lead:'vib',sw:.2,r:6,len:214,seed:443},
 {t:'Saltwater Study Hall',key:61,bpm:84,A:'viiiV',B:'lift',lead:'flute',sw:.22,r:7,len:222,seed:449},
 {t:'Coastline Commute',key:62,bpm:92,A:'four',B:'turn',lead:'pluck',sw:.18,r:8,len:208,seed:457},
 {t:'Midnight Revision',key:58,bpm:80,A:'dor',B:'desc',lead:'ep',sw:.24,r:0,len:230,seed:461},
 {t:'Clocking Off',key:60,bpm:84,A:'lift',B:'viiiV',lead:'vib',sw:.22,r:1,len:222,seed:463},
 {t:'Tomorrow’s To-Do List',key:63,bpm:82,A:'iiVI',B:'night',lead:'reed',sw:.23,r:2,len:226,seed:467}];
function hpCompile(tr){const R=lfRng(tr.seed),ev=[],bar4=4,sw=tr.sw;
  const S16=b=>{const f=b%.5;return b+(Math.abs(f-.25)<1e-6?sw*.5:0);};// swing the off 16ths
  const minor=HP_MINOR.includes(tr.A);const pent=minor?[0,3,5,7,10]:[0,2,4,7,9];
  const scale=[];for(let o=-12;o<=36;o+=12)pent.forEach(p=>scale.push(tr.key+p+o));
  const lo=tr.key+9,hi=tr.key+24;
  // form: intro, groove, theme, answer, break, theme, answer..., outro (sized to tr.len)
  const target=Math.round(tr.len*tr.bpm/60/bar4);const form=[['I',4],['A',8]];let used=12;
  while(used+16+4<=target){form.push(['M',8],['N',8]);used+=16;if(used+4+16+4<=target&&form.filter(f=>f[0]==='M').length%2===1){form.push(['K',4]);used+=4;}}
  while(used+8+4<=target){form.push(['A',8]);used+=8;}
  form.push(['O',4]);used+=4;
  const motifs=[0,1].map(()=>{const r=LF_R[(tr.r+Math.floor(R()*4))%LF_R.length];let s=0;return r.map(()=>{s+=R()<.55?(R()<.5?-1:1):(R()<.5?-2:2);if(s>4)s-=3;if(s<-4)s+=3;return s;}).map((s,i)=>[r[i][0],r[i][1],s]);});
  const near=(m,arr)=>arr.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
  const kickPat=[[0,1],[.75,R()<.5?.55:0],[2.5,.9],[2.75,R()<.4?.5:0]].filter(k=>k[1]>0);
  let bar=0,prevV=64;
  form.forEach(([sec,n])=>{const prog=HP_P[sec==='N'?tr.B:tr.A];
    const drums=sec==='A'||sec==='M'||sec==='N';
    for(let k=0;k<n;k++){const B=(bar+k)*bar4,ch=prog[(bar+k)%4],root=tr.key+ch[0];
      const fade=sec==='O'?1-k/n*.6:sec==='I'?.65+k/n*.35:1;const last=sec==='O'&&k===n-1;
      const v=lfVoice(tr.key,ch,prevV);prevV=v.reduce((a,b)=>a+b,0)/v.length;
      // chopped chord stabs
      if(last)ev.push({b:B,k:'ep',ns:v,d:6,v:.5*fade});
      else{ev.push({b:B,k:'ep',ns:v,d:1.2,v:.52*fade});ev.push({b:S16(1.75)+B,k:'ep',ns:v.slice(1),d:.45,v:.34*fade});ev.push({b:B+2.5,k:'ep',ns:v,d:.9,v:.42*fade});if(R()<.45)ev.push({b:S16(3.25)+B,k:'ep',ns:v.slice(2),d:.4,v:.26*fade});}
      // bass: root, push, root, approach note into the next chord
      if(sec!=='I'||k>=2){let bn=root;while(bn>45)bn-=12;while(bn<33)bn+=12;const nx=tr.key+prog[(bar+k+1)%4][0];let an=nx-1;while(an>bn+7)an-=12;while(an<bn-7)an+=12;
        if(last)ev.push({b:B,k:'bass',n:bn,d:4,v:.2*fade});
        else{ev.push({b:B,k:'bass',n:bn,d:.8,v:.22*fade});ev.push({b:S16(1.75)+B,k:'bass',n:bn+12,d:.25,v:.12*fade});ev.push({b:B+2.5,k:'bass',n:bn+(R()<.5?7:0),d:.9,v:.18*fade});ev.push({b:S16(3.75)+B,k:'bass',n:an,d:.25,v:.13*fade});}}
      // boom-bap drums
      if(drums&&!last){kickPat.forEach(([b,vv])=>ev.push({b:B+b,k:'kick',v:vv}));
        ev.push({b:B+1,k:'snare',v:1});ev.push({b:B+3,k:'snare',v:1});if(R()<.35)ev.push({b:S16(1.75)+B,k:'snare',v:.22});if(R()<.3)ev.push({b:S16(3.75)+B,k:'snare',v:.28});
        for(let h=0;h<16;h++){const hb=h*.25;if(h%2===1&&R()<.35)continue;ev.push({b:S16(hb)+B,k:'hat',v:h%4===0?.9:h%2===0?.6:.32});}
        if((bar+k)%2===1)ev.push({b:B+3.5,k:'ohat',v:.5});}
      else if(sec==='K'&&!last){ev.push({b:B,k:'kick',v:.5});for(let h=0;h<8;h++)ev.push({b:B+h*.5+(h%2?sw:0),k:'hat',v:h%2?.25:.4});}}
    // melody: theme and answer over two-bar motifs, held note to end each phrase
    if(sec==='M'||sec==='N'||sec==='K'){const mo=motifs[sec==='N'?1:0];
      for(let g=0;g<n/2;g++){const b0=(bar+g*2)*bar4,ch=prog[(bar+g*2)%4];const ct=LF_V[ch[1]].map(x=>tr.key+ch[0]+x);
        const base=near(tr.key+17+(g%2?2:0),scale.filter(m=>m>=lo&&m<=hi));const cad=g===n/2-1;
        mo.forEach(([st,du,s],ni)=>{if(sec==='K'&&ni%2)return;if(cad&&st>=4)return;
          let idx=scale.indexOf(base)+s+(g===2&&ni===mo.length-1?1:0);idx=Math.max(0,Math.min(scale.length-1,idx));let m=scale[idx];while(m>hi)m-=12;while(m<lo)m+=12;
          if(du>=1&&Number.isInteger(st)){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});const cn=near(m,c);if(Math.abs(cn-m)<=2)m=cn;}
          ev.push({b:b0+st+(st%1?sw*.5:0),k:'lead',n:m,d:du,v:.58});});
        if(cad){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});ev.push({b:b0+4,k:'lead',n:near(base,c),d:3.2,v:.52});}}}
    bar+=n;});
  const beats=used*bar4+1;ev.push({b:0,k:'bed',kind:'crackle',d:beats});
  ev.sort((a,b)=>a.b-b.b);return{ev,beats};}
// ---------- City Pop: 30 original city pop tracks (bright 80s pop with funk bass and synths) ----------
// Major 7th chords, a slap-style bass that walks in 16ths, funky drums with hand claps, cutting guitar,
// brass stabs into the chorus and a lead on synth, sax, e-piano bells or flute.
const CP_P={
 two:[[5,'maj7'],[4,'7'],[9,'m7'],[0,'7']],
 royal:[[5,'maj7'],[7,'9sus'],[4,'m7'],[9,'m7']],
 iiV:[[2,'m9'],[7,'13'],[0,'maj9'],[9,'m7']],
 circle:[[0,'maj9'],[9,'m9'],[2,'m7'],[7,'13']],
 step:[[5,'maj9'],[4,'m7'],[2,'m9'],[0,'maj7']],
 night:[[9,'m9'],[7,'9sus'],[5,'maj7'],[4,'7']],
 drive:[[0,'maj7'],[4,'7'],[5,'maj7'],[5,'m6']],
 lift:[[8,'maj7'],[10,'69'],[0,'maj9'],[0,'add9']]};
const CITY=[
 {t:'Mounts Bay Night Drive',key:62,bpm:108,A:'royal',B:'two',lead:'syn',r:0,len:216,seed:503},
 {t:'Neon on the Swan',key:65,bpm:112,A:'two',B:'circle',lead:'sax',r:1,len:210,seed:509},
 {t:'Sunset Coast Highway',key:60,bpm:104,A:'circle',B:'royal',lead:'bellp',r:2,len:222,seed:521},
 {t:'Ferry Lights at Eight',key:63,bpm:110,A:'step',B:'lift',lead:'syn',r:3,len:212,seed:523},
 {t:'City Lights from the Hill',key:57,bpm:100,A:'night',B:'royal',lead:'flute',r:4,len:226,seed:541},
 {t:'Midnight at the Jetty',key:64,bpm:106,A:'drive',B:'two',lead:'sax',r:5,len:218,seed:547},
 {t:'Pink Lake Postcard',key:61,bpm:114,A:'iiV',B:'step',lead:'syn',r:6,len:206,seed:557},
 {t:'Cassette from Fremantle',key:62,bpm:102,A:'two',B:'night',lead:'bellp',r:7,len:224,seed:563},
 {t:'Summer Rain on the Terrace',key:59,bpm:98,A:'royal',B:'drive',lead:'flute',r:8,len:230,seed:569},
 {t:'Cruising Mill Point Road',key:65,bpm:116,A:'circle',B:'lift',lead:'syn',r:0,len:204,seed:571},
 {t:'Moonlight Marina',key:60,bpm:104,A:'night',B:'two',lead:'sax',r:1,len:220,seed:577},
 {t:'Weekend Window Seat',key:63,bpm:108,A:'step',B:'royal',lead:'bellp',r:2,len:214,seed:587},
 {t:'Glitter on the River',key:66,bpm:112,A:'lift',B:'circle',lead:'syn',r:3,len:208,seed:593},
 {t:'Last Train to the Coast',key:58,bpm:102,A:'two',B:'night',lead:'sax',r:4,len:224,seed:599},
 {t:'Rooftop Sunset Party',key:64,bpm:118,A:'royal',B:'iiV',lead:'syn',r:5,len:202,seed:601},
 {t:'Sea Breeze Convertible',key:62,bpm:110,A:'drive',B:'step',lead:'flute',r:6,len:212,seed:607},
 {t:'Lighthouse Rendezvous',key:61,bpm:104,A:'circle',B:'two',lead:'bellp',r:7,len:220,seed:613},
 {t:'Saturday Night Quokka',key:65,bpm:114,A:'two',B:'lift',lead:'syn',r:8,len:206,seed:617},
 {t:'Polaroid Summer',key:60,bpm:106,A:'step',B:'royal',lead:'sax',r:0,len:218,seed:619},
 {t:'Two Coffees, One Sunset',key:63,bpm:100,A:'night',B:'circle',lead:'bellp',r:1,len:226,seed:631},
 {t:'Disco Ball over Thomson Bay',key:67,bpm:118,A:'iiV',B:'two',lead:'syn',r:2,len:202,seed:641},
 {t:'Radio Love 101.7',key:62,bpm:108,A:'royal',B:'step',lead:'sax',r:3,len:214,seed:643},
 {t:'Night Market Neon',key:59,bpm:112,A:'two',B:'night',lead:'syn',r:4,len:208,seed:647},
 {t:'Coast Road at Two A.M.',key:57,bpm:98,A:'night',B:'drive',lead:'flute',r:5,len:230,seed:653},
 {t:'Velvet Evening',key:64,bpm:102,A:'lift',B:'royal',lead:'bellp',r:6,len:224,seed:659},
 {t:'Starlight Boulevard',key:61,bpm:110,A:'circle',B:'two',lead:'syn',r:7,len:212,seed:661},
 {t:'Hello from the Island',key:65,bpm:106,A:'drive',B:'iiV',lead:'sax',r:8,len:218,seed:673},
 {t:'Palm Trees and Pay Phones',key:60,bpm:114,A:'step',B:'lift',lead:'syn',r:0,len:206,seed:677},
 {t:'Golden Hour Groove',key:63,bpm:104,A:'two',B:'royal',lead:'bellp',r:1,len:220,seed:683},
 {t:'See You at Sunrise',key:62,bpm:100,A:'royal',B:'circle',lead:'sax',r:2,len:226,seed:691}];
function cpCompile(tr){const R=lfRng(tr.seed),ev=[],B4=4;
  const pent=[0,2,4,7,9];const scale=[];for(let o=-12;o<=36;o+=12)pent.forEach(p=>scale.push(tr.key+p+o));
  const lo=tr.key+12,hi=tr.key+26;
  // intro, verse, theme, chorus, (break), theme, chorus..., outro
  const target=Math.round(tr.len*tr.bpm/60/B4);const form=[['I',4],['A',8]];let used=12;
  while(used+16+4<=target){form.push(['M',8],['N',8]);used+=16;if(used+4+16+4<=target&&form.filter(f=>f[0]==='M').length%2===1){form.push(['K',4]);used+=4;}}
  while(used+8+4<=target){form.push(['N',8]);used+=8;}
  form.push(['O',4]);used+=4;
  const motifs=[0,1].map(()=>{const r=LF_R[(tr.r+Math.floor(R()*4))%LF_R.length];let s=0;return r.map(()=>{s+=R()<.5?(R()<.5?-1:1):(R()<.5?-2:2);if(s>4)s-=3;if(s<-4)s+=3;return s;}).map((s,i)=>[r[i][0],r[i][1],s]);});
  const near=(m,arr)=>arr.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
  const bassPat=[[0,.25,0,1],[.5,.2,12,.55],[.75,.25,0,.8],[1.5,.25,7,.75],[1.75,.2,12,.5],[2.25,.25,0,.8],[2.5,.2,12,.55],[3,.25,10,.65]];
  let bar=0,prevV=66;
  form.forEach(([sec,n])=>{const prog=CP_P[sec==='N'?tr.B:tr.A];const chorus=sec==='N';const drums=sec!=='I'&&sec!=='K'&&sec!=='O';
    for(let k=0;k<n;k++){const B=(bar+k)*B4,ch=prog[(bar+k)%4],root=tr.key+ch[0];const last=sec==='O'&&k===n-1;
      const fade=sec==='O'?1-k/n*.6:sec==='I'?.7+k/n*.3:1;
      const v=lfVoice(tr.key,ch,prevV);prevV=v.reduce((a,b)=>a+b,0)/v.length;
      // e-piano comping in 16ths
      if(last)ev.push({b:B,k:'ep',ns:v,d:6,v:.5*fade});
      else{[[0,.45,.5],[.75,.25,.34],[1.5,.45,.42],[2.5,.4,.44],[3.25,.25,.3]].forEach(([b,d,vv])=>{if(b===0||R()<.85)ev.push({b:B+b,k:'ep',ns:b===0?v:v.slice(1),d,v:vv*fade});});}
      // cutting guitar on the off 16ths
      if(drums&&!last)[.25,1.25,2.25,3.25].forEach(b=>ev.push({b:B+b,k:'gtr',n:v[v.length-1],v:.5}));
      // slap-style bass with an approach note into the next chord
      if(sec!=='I'||k>=2){let bn=root;while(bn>45)bn-=12;while(bn<33)bn+=12;
        if(last)ev.push({b:B,k:'cbass',n:bn,d:3,v:.9*fade});
        else{bassPat.forEach(([b,d,iv,vv])=>{if(b===0||R()<.9)ev.push({b:B+b,k:'cbass',n:bn+iv,d,v:vv*fade});});const nx=tr.key+prog[(bar+k+1)%4][0];let an=nx-1;while(an>bn+7)an-=12;while(an<bn-7)an+=12;ev.push({b:B+3.75,k:'cbass',n:an,d:.2,v:.6*fade});}}
      // drums: backbeat with claps, four on the floor in the chorus, 16th hats, open hats on the off beats
      if(drums&&!last){(chorus?[0,1,2,3]:[0,1.75,2,2.75].filter((b,i)=>i!==1||R()<.5)).forEach(b=>ev.push({b:B+b,k:'kick',v:b%1?.6:.95}));
        [1,3].forEach(b=>{ev.push({b:B+b,k:'snare',v:.85});ev.push({b:B+b,k:'clap',v:.8});});
        for(let h=0;h<16;h++){const hb=h*.25;if(chorus&&h%4===2){ev.push({b:B+hb,k:'ohat',v:.55});continue;}ev.push({b:B+hb,k:'hat',v:h%2?.35:.7});}
        if(chorus&&k===0)ev.push({b:B,k:'crash',v:.7});}
      // brass stab pickup into each chorus bar pair
      if(chorus&&k%2===1&&!last){const nv=lfVoice(tr.key,prog[(bar+k+1)%4],prevV);ev.push({b:B+3.5,k:'brass',ns:nv.slice(1),d:.2,v:.8});ev.push({b:B+3.75,k:'brass',ns:nv.slice(1),d:.35,v:.95});}}
    // melody
    if(sec==='M'||sec==='N'){const mo=motifs[sec==='N'?1:0];
      for(let g=0;g<n/2;g++){const b0=(bar+g*2)*B4,ch=prog[(bar+g*2)%4];const ct=LF_V[ch[1]].map(x=>tr.key+ch[0]+x);
        const base=near(tr.key+(sec==='N'?19:16)+(g%2?2:0),scale.filter(m=>m>=lo&&m<=hi));const cad=g===n/2-1;
        mo.forEach(([st,du,s])=>{if(cad&&st>=4)return;let idx=scale.indexOf(base)+s;idx=Math.max(0,Math.min(scale.length-1,idx));let m=scale[idx];while(m>hi)m-=12;while(m<lo)m+=12;
          if(du>=1&&Number.isInteger(st)){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});const cn=near(m,c);if(Math.abs(cn-m)<=2)m=cn;}
          ev.push({b:b0+st,k:'lead',n:m,d:du,v:.6});});
        if(cad){const c=ct.map(x=>{while(x<lo)x+=12;while(x>hi)x-=12;return x;});ev.push({b:b0+4,k:'lead',n:near(base,c),d:3,v:.55});}}}
    bar+=n;});
  const beats=used*B4+1;ev.sort((a,b)=>a.b-b.b);return{ev,beats};}
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
