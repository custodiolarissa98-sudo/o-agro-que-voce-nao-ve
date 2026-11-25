const { chromium } = require('playwright'); const { spawn } = require('child_process');
const [a,b,out]=[+process.argv[2],+process.argv[3],process.argv[4]];
(async()=>{ const br=await chromium.launch({args:['--allow-file-access-from-files']}); const p=await br.newPage({viewport:{width:1080,height:1920}});
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('file://'+__dirname+'/index.html'); await p.evaluate(()=>window.ready);
 const ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-c:v','mjpeg','-framerate','30','-i','-','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r','30',out],{stdio:['pipe','inherit','inherit']});
 for(let f=a;f<b;f++){ const d=await p.evaluate(t=>window.renderFrame(t),f/30); const buf=Buffer.from(d.split(',')[1],'base64'); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); await br.close(); console.log('done',out); })();
