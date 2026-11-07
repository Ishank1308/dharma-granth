const fs = require('fs');

const itemJson = JSON.parse(fs.readFileSync('scripts/drive_item_json.json', 'utf8'));

console.log('--- NON-NULL ITEM JSON FIELDS ---');
itemJson.forEach((val, idx) => {
  if (val !== null) {
    const valStr = typeof val === 'object' ? JSON.stringify(val).slice(0, 100) : String(val).slice(0, 150);
    console.log(`[${idx}]: ${valStr}`);
  }
});
