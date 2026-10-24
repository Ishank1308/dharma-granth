#!/usr/bin/env node
/**
 * Dharma Granth: Meta Muse Spark 1.3 Model Context Protocol (MCP) Server
 * 
 * Exposes Meta Muse Spark 1.3 as an active tool directly to Antigravity IDE and agents.
 * Communicates via standard JSON-RPC 2.0 over stdin/stdout.
 */

import readline from 'node:readline';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
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

loadEnv();

const API_KEY =
  process.env.MUSE_SPARK_API_KEY ||
  process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY ||
  '';

const BASE_URL = (
  process.env.MUSE_SPARK_BASE_URL ||
  'https://api.meta.ai/v1'
).replace(/\/+$/, '');

const MODEL = process.env.MUSE_SPARK_MODEL || 'muse-spark-1.3-contributor';

const TOKEN_BUDGET = {
  minimal: 4096,
  low: 4096,
  medium: 8192,
  high: 16000,
  xhigh: 24000,
  max: 32000,
};

const SYSTEM_PROMPT = `आप 'धर्म सारथी' (Dharma Granth AI Guide) हैं — सनातन धर्म, उपनिषद्, भगवद्गीता और वेदान्त के प्रामाणिक, संवेदनशील एवं प्रज्ञावान मार्गदर्शक।
संचालित मॉडल: Meta Muse Spark 1.3 Contributor (विस्तृत चिंतन एवं गहनतम दार्शनिक विवेक)।

नियम एवं मानक:
1. भाषा शैली:
   - गरिमामयी तत्सम हिन्दी (गीता प्रेस का मानक)।
   - कोई उर्दू/फारसी या अनौपचारिक शब्द नहीं (तनाव -> उद्वेग, शुरू -> आरम्भ, पैदा -> उत्पन्न, थकान -> श्रान्ति)।
   - पाठक को आदरपूर्वक 'आप' सम्बोधित करें।
2. संख्याएँ:
   - केवल ASCII 0-9 (1, 2, 3) या हिन्दी शब्द (प्रथम, द्वितीय) लिखें। देवनागरी अंकों का प्रयोग न करें।
3. उत्तर संरचना:
   - संक्षिप्त करुणामय समाधान।
   - कम से कम 1 प्रासंगिक मूल संस्कृत श्लोक/मन्त्र तथा संदर्भ (जैसे: भगवद्गीता 2.47)।
   - दैनिक व्यावहारिक जीवन में 1-2 सूत्र।
   - 1 आत्म-निरीक्षण हेतु चिंतन प्रश्न।`;

async function callMuseSpark(query, options = {}) {
  if (!API_KEY) {
    throw new Error('MUSE_SPARK_API_KEY is not set in environment or .env.local');
  }

  const modelToUse = options.model || MODEL;
  const effortToUse = options.effort || 'max';
  const maxTokens = TOKEN_BUDGET[effortToUse] || 32000;

  const endpoint = `${BASE_URL}/chat/completions`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: modelToUse,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: query },
      ],
      temperature: 0.2,
      max_tokens: maxTokens,
      reasoning_effort: effortToUse,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Muse Spark API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Received empty response from Muse Spark');
  }
  return text.trim();
}

function send(jsonObj) {
  process.stdout.write(JSON.stringify(jsonObj) + '\n');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch (err) {
    return;
  }

  const { id, method, params } = msg;

  if (method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'muse-spark-mcp',
          version: '1.0.0',
        },
      },
    });
    return;
  }

  if (method === 'notifications/initialized' || method === 'initialized') {
    // Client acknowledgment, no response required
    return;
  }

  if (method === 'ping') {
    send({
      jsonrpc: '2.0',
      id,
      result: {},
    });
    return;
  }

  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'ask_muse_spark',
            description:
              'Consult Meta Muse Spark 1.3 for in-depth philosophical reasoning, theological analysis, and dignified Hindi guidance on scripture, karma, dharma, and life dilemmas.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description:
                    'The philosophical, theological, or life inquiry to submit to Meta Muse Spark 1.3',
                },
              },
              required: ['query'],
            },
          },
        ],
      },
    });
    return;
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    const args = params?.arguments || {};

    if (toolName === 'ask_muse_spark') {
      try {
        const answer = await callMuseSpark(args.query || '', {
          model: args.model,
          effort: args.effort,
        });
        send({
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: answer,
              },
            ],
          },
        });
      } catch (err) {
        send({
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Error calling Muse Spark 1.3: ${err.message}`,
              },
            ],
          },
        });
      }
      return;
    }

    send({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Unknown tool: ${toolName}`,
      },
    });
    return;
  }

  if (id !== undefined) {
    send({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32601,
        message: `Method not found: ${method}`,
      },
    });
  }
});
