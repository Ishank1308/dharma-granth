/**
 * Dharma Granth: Test Muse Spark 1.3 Connection & Response
 * 
 * Usage:
 *   npx tsx scripts/test-muse-spark.ts
 *   npx tsx scripts/test-muse-spark.ts --key "YOUR_KEY"
 */

import { MuseSparkClient } from '../lib/muse-spark';

// Simple .env.local reader for standalone script execution
import fs from 'node:fs';
import path from 'node:path';

function loadEnvLocal() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        const v = trimmed.slice(idx + 1).trim();
        if (!process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

loadEnvLocal();

// Check command line arguments for --key or --base-url
const args = process.argv.slice(2);
let customKey = '';
let customBase = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--key' && args[i + 1]) customKey = args[i + 1];
  if (args[i] === '--base-url' && args[i + 1]) customBase = args[i + 1];
}

const client = new MuseSparkClient({
  apiKey: customKey || process.env.MUSE_SPARK_API_KEY || process.env.LLM_API_KEY,
  baseUrl: customBase || process.env.MUSE_SPARK_BASE_URL,
});

async function run() {
  console.log('=== Dharma Granth: Testing Muse Spark 1.3 ===\n');

  if (!client.isConfigured) {
    console.error('❌ Muse Spark API key is not detected.');
    console.log('Please add your key to .env.local:');
    console.log('   MUSE_SPARK_API_KEY=YOUR_KEY\n');
    console.log('Or run with:');
    console.log('   npx tsx scripts/test-muse-spark.ts --key "YOUR_KEY"\n');
    process.exit(1);
  }

  console.log('✓ API Key detected (prefix: ' + (process.env.MUSE_SPARK_API_KEY || customKey).slice(0, 8) + '...)');
  console.log('✓ Base URL:', process.env.MUSE_SPARK_BASE_URL || 'https://api.meta.ai/v1');
  console.log('✓ Target Model: muse-spark-1.3\n');
  console.log('Sending test prompt to Muse Spark 1.3...');

  const startTime = Date.now();
  try {
    const testReply = await client.chat([
      {
        role: 'system',
        content: 'You are an assistant for Dharma Granth. Answer in one crisp sentence of dignified Hindi.',
      },
      {
        role: 'user',
        content: 'भगवद्गीता का मुख्य संदेश क्या है?',
      },
    ]);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Muse Spark 1.3 connected successfully in ${duration}s!`);
    console.log('--------------------------------------------------');
    console.log(testReply);
    console.log('--------------------------------------------------\n');
  } catch (err: any) {
    console.error('\n❌ Connection test failed:', err?.message || err);
    console.log('\nTroubleshooting tips:');
    console.log('1. Verify your API key has no trailing whitespace.');
    console.log('2. If you are using a proxy or gateway, specify --base-url:');
    console.log('   npx tsx scripts/test-muse-spark.ts --base-url "https://your-gateway.com/v1"');
    process.exit(1);
  }
}

run();
