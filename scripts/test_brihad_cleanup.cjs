const fs = require('fs');
const content = fs.readFileSync('data/scriptures/brihadaranyaka.ts', 'utf8');

// Parse chapters 1 to 6
let cleaned = content;

// In Ch 1: remove verse id 2
// In Ch 2: remove verses 1, 2, 3, 7
// In Ch 3: remove verses 1, 2, 3, 4, 5, 7, 9, 14, 15, 28 that have keywords: []
// In Ch 4: remove verses 4, 5, 7, 9, 14, 15 with keywords: []
// In Ch 5: remove verses 1, 4, 5, 7, 9, 14, 15 with keywords: []
// In Ch 6: remove verse 1 with keywords: []

console.log('Testing Brihadaranyaka cleanup...');
