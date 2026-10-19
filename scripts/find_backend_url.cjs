const fs = require('fs');

async function findBackendUrl() {
  const url = 'https://gitapress.org/_next/static/chunks/109-de9c2d237841afec.js';
  const res = await fetch(url);
  const text = await res.text();
  
  // Search for BACKEND_URL or api domain
  const matches = text.match(/https?:\/\/[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,}(?::[0-9]+)?(?:\/[a-zA-Z0-9_\-\.]+)*/g) || [];
  console.log('URLs in bundle:', [...new Set(matches)]);
  
  // Also check NEXT_PUBLIC_BACKEND_URL or env references
  const envIdx = text.indexOf('BACKEND_URL');
  if (envIdx !== -1) {
    console.log('Context around BACKEND_URL:');
    console.log(text.slice(Math.max(0, envIdx - 200), Math.min(text.length, envIdx + 200)));
  }
}

findBackendUrl();
