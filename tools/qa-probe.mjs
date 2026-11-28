// Runs a JS snippet inside the game closure (__t.html from python3 tools/qa-hooks.py) and prints its result:
//   [VW=1920 VH=1080] [SHOT=out.png] node tools/qa-probe.mjs "<query>" <snippet.js> [waitSecs=50]
import { chromium } from 'playwright';import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const root='/home/claude/quokka-cafe';const [q,js,wait='50']=process.argv.slice(2);
const srv=http.createServer((rq,r)=>{let p=path.join(root,decodeURIComponent(rq.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':p.endsWith('.html')?'text/html':p.endsWith('.js')?'text/javascript':'application/octet-stream'});r.end(fs.readFileSync(p));}).listen(0);
const b=await chromium.launch({args:['--no-proxy-server','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const pg=await b.newPage({viewport:{width:+(process.env.VW||800),height:+(process.env.VH||450)}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200));});
await pg.route(u=>!u.hostname.endsWith('localhost')&&u.hostname!=='127.0.0.1',r=>r.abort());
await pg.goto(`http://127.0.0.1:${srv.address().port}/__t.html${q}`,{waitUntil:'commit',timeout:120000});await pg.waitForTimeout(+wait*1000);
const res=await pg.evaluate(s=>window.__t.ev(s),fs.readFileSync(js,'utf8'));console.log(JSON.stringify(res,null,0));if(process.env.SHOT){await pg.waitForTimeout(4000);const c=await pg.context().newCDPSession(pg);const {data}=await c.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(process.env.SHOT,Buffer.from(data,'base64'));}console.log('errors',errs.slice(0,8));await b.close();srv.close();
