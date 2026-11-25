const { chromium } = require('playwright'); const fs=require('fs');
(async()=>{ const b=await chromium.launch({args:['--allow-file-access-from-files']}); const p=await b.newPage({viewport:{width:1080,height:1920}});
 p.on('console',m=>console.log('LOG',m.text())); p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/index.html'); await p.evaluate(()=>window.ready);
 const ts=process.argv.slice(2).map(Number); fs.mkdirSync('prev',{recursive:true});
 for(const t of ts){ const t0=Date.now(); const d=await p.evaluate(t=>window.renderFrame(t),t); fs.writeFileSync(`prev/f${t}.jpg`,Buffer.from(d.split(',')[1],'base64')); console.log(t,Date.now()-t0,'ms'); }
 await b.close(); })();
