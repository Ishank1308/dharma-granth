const fs=require('fs');
for(const f of fs.readdirSync('public/data/hi-commentary')){const d=JSON.parse(fs.readFileSync('public/data/hi-commentary/'+f,'utf8'));
for(const [k,e] of Object.entries(d))for(const x of ['explanation','science','lifeLesson']){const t=e[x];if(!t)continue;
const o=(t.match(/\(/g)||[]).length,c=(t.match(/\)/g)||[]).length;
const m=t.match(/\(\s*[से के का की को में]\b|\(\s*\)|\(\s*[^)]{0,3}$/);
if(o!==c||m)console.log(f,k,x,o,c,(t.match(/.{0,25}\([^)]{0,12}.{0,10}/)||[''])[0]);}}
