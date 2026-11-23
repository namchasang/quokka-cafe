// Serpentine Falls camp check (23 Nov 2026): python3 tools/qa-hooks.py && node tools/qa-camppark.mjs <out.png> ["js run in the game after Kip arrives"]
import { chromium } from 'playwright'; import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root='/home/claude/quokka-cafe', out=process.argv[2], js=process.argv[3]||'';
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':p.endsWith('.html')?'text/html':'text/javascript'});r.end(fs.readFileSync(p));}).listen(0);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-proxy-server','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg=await b.newPage({viewport:{width:960,height:540}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(u=>!u.hostname.endsWith('localhost')&&u.hostname!=='127.0.0.1',r=>r.abort());
await pg.goto(`http://127.0.0.1:${srv.address().port}/__t.html?camppark`,{waitUntil:'commit',timeout:120000});
await pg.waitForFunction(()=>window.__t&&window.__t.ev("typeof IBMAP!=='undefined'&&IBMAP.done"),null,{timeout:300000,polling:2000});
await pg.evaluate(()=>{const T=window.__t;T.ev("try{localStorage.clear();}catch(e){}");T.startGame({});T.ev("dlgQ=[];dlgDone=null;ui.dlg.hidden=true;");});
await pg.waitForTimeout(3000);await pg.evaluate(()=>window.__t.ev("CAMPPARK.went=1;CAMPPARK.enter()"));await pg.waitForTimeout(6000);
if(js)await pg.evaluate(j=>window.__t.ev(j),js);await pg.waitForTimeout(8000);
const s=await pg.context().newCDPSession(pg);const {data}=await s.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(out,Buffer.from(data,'base64'));
console.log('errs',errs.slice(0,5));await b.close();srv.close();
