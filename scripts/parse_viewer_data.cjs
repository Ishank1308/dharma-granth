const fs = require('fs');

const code = fs.readFileSync('scripts/drive_viewer_data.js', 'utf8');

// Run safely in VM or eval
const sandbox = { window: {} };
const vm = require('vm');
vm.runInNewContext(code, sandbox);

const vd = sandbox.window.viewerData;
console.log('Config keys:', Object.keys(vd.config));
console.log('ItemData keys:', vd.itemData ? Object.keys(vd.itemData) : 'none');
if (vd.itemData) {
  console.log('ItemData sample:');
  const str = JSON.stringify(vd.itemData, null, 2);
  fs.writeFileSync('scripts/drive_item_data.json', str);
  console.log('Saved to scripts/drive_item_data.json');
  console.log(str.slice(0, 1500));
}
