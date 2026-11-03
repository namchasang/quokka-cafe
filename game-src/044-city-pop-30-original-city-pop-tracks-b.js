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
