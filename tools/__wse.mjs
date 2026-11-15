import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd();
const srv=http.createServer((q,r)=>{let p=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':p.endsWith('.html')?'text/html':'text/javascript'});r.end(fs.readFileSync(p));}).listen(0);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--no-proxy-server','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const list=JSON.parse(process.argv[2]);const ERR=[];
for(const [name,url,w,h,wait,ev] of list){const pg=await b.newPage({viewport:{width:w,height:h}});pg.on('pageerror',e=>ERR.push(e.message));pg.on('console',m=>{if(m.type()==='error')ERR.push('c:'+m.text().slice(0,200));});
 await pg.route(u=>!u.hostname.endsWith('localhost')&&u.hostname!=='127.0.0.1',r=>{const u=r.request().url();if(/r128\/three/.test(u))return r.fulfill({path:'/tmp/npmthree/package/build/three.min.js',contentType:'text/javascript'});if(/OrbitControls\.js$/.test(u))return r.fulfill({path:'/tmp/npmthree/package/examples/js/controls/OrbitControls.js',contentType:'text/javascript'});return r.abort();});
 await pg.goto(`http://127.0.0.1:${srv.address().port}/${url}`,{waitUntil:'commit'});await pg.waitForTimeout(wait);
 if(ev){const R=await pg.evaluate(ev).catch(e=>'ev '+e.message);console.log('R',R);console.log('ERR',ERR.slice(0,8));await pg.waitForTimeout(4000);}
 const cdp=await pg.context().newCDPSession(pg);const {data}=await cdp.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('/tmp/w-'+name+'.png',Buffer.from(data,'base64'));await pg.close();console.log('done',name);}
await b.close();srv.close();
