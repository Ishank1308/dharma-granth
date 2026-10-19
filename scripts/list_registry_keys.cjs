const fs = require('fs');
const content = fs.readFileSync('data/sources-registry.ts', 'utf8');
const keys = [...content.matchAll(/([a-z0-9_]+):\s*\{/g)].map(m => m[1]);
console.log('Sources registry keys:', keys.join(', '));
