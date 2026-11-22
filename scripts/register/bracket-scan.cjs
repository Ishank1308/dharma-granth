const fs=require('fs');
// Published commentary is one folder of section files per scripture (docs/commentary-storage.md).
const { publishedCommentaryIds, readPublishedCommentary } = require('../lib/commentary-store.mjs');
for(const f of publishedCommentaryIds().map((id)=>id+'.json')){const d=readPublishedCommentary(f.replace('.json',''));
for(const [k,e] of Object.entries(d))for(const x of ['explanation','science','lifeLesson']){const t=e[x];if(!t)continue;
const o=(t.match(/\(/g)||[]).length,c=(t.match(/\)/g)||[]).length;
const m=t.match(/\(\s*[से के का की को में]\b|\(\s*\)|\(\s*[^)]{0,3}$/);
if(o!==c||m)console.log(f,k,x,o,c,(t.match(/.{0,25}\([^)]{0,12}.{0,10}/)||[''])[0]);}}
