/**
 * Dharma Granth: Muse Spark 1.3 Browser Chat Agent
 * 
 * Direct client-side streaming & reasoning agent powered by Meta's Muse Spark 1.3.
 * Works seamlessly in static export builds with zero-latency CORS calls.
 */

export interface MuseChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface MuseAgentResponse {
  answerHi: string;
  answerEn?: string;
  sanskritVerse?: string;
  scriptureCitation?: string;
  modernApplication?: string;
  reflectionQuestion?: string;
  rawText: string;
}

const DEFAULT_BASE_URL = 'https://api.meta.ai/v1';
const DEFAULT_MODEL = 'muse-spark-1.3-contributor';
const STORAGE_KEY = 'dharma_muse_spark_key';

export function getMuseApiKey(): string {
  if (typeof window !== 'undefined') {
    const userKey = window.localStorage.getItem(STORAGE_KEY);
    if (userKey) return userKey.trim();
  }
  return process.env.NEXT_PUBLIC_MUSE_SPARK_API_KEY || '';
}

export function setMuseApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      window.localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }
}

export function hasMuseApiKey(): boolean {
  return Boolean(getMuseApiKey() && getMuseApiKey().length > 5);
}

const SYSTEM_PROMPT = `आप 'धर्म सारथी' (Dharma Granth AI Guide) हैं — सनातन धर्म, उपनिषद्, भगवद्गीता और वेदान्त के प्रामाणिक, संवेदनशील एवं प्रज्ञावान मार्गदर्शक।
संचालित मॉडल: Meta Muse Spark 1.3 Contributor (विस्तृत चिंतन एवं दार्शनिक विवेक)।

नियम एवं मानक:
1. भाषा शैली:
   - गरिमामयी तत्सम हिन्दी (गीता प्रेस का मानक)।
   - कोई उर्दू/फारसी या अनौपचारिक शब्द नहीं (तनाव के स्थान पर 'उद्वेग', शुरू के स्थान पर 'आरम्भ', पैदा के स्थान पर 'उत्पन्न', थकान के स्थान पर 'श्रान्ति', नकल के स्थान पर 'अनुकरण', याद के स्थान पर 'स्मरण')।
   - पाठक को आदरपूर्वक 'आप' सम्बोधित करें।
2. संख्याएँ:
   - देवनागरी अंकों (०-९) का प्रयोग सर्वथा न करें। केवल ASCII 0-9 (1, 2, 3) या हिन्दी शब्द (प्रथम, द्वितीय) लिखें।
3. उत्तर संरचना:
   - संक्षिप्त, करुणामय एवं गहन दार्शनिक समाधान।
   - कम से कम 1 प्रासंगिक मूल संस्कृत श्लोक/मन्त्र तथा उसका संदर्भ (जैसे: भगवद्गीता 2.47)।
   - दैनिक व्यावहारिक जीवन में प्रयोग (1-2 व्यावहारिक सूत्र)।
   - 1 आत्म-निरीक्षण हेतु चिंतन प्रश्न।`;

/**
 * Sends a query to Muse Spark 1.3 and returns structured guidance.
 */
export async function askMuseSparkAgent(
  userQuery: string,
  history: MuseChatMessage[] = [],
  options: {
    baseUrl?: string;
    model?: string;
  } = {}
): Promise<string> {
  const apiKey = getMuseApiKey();
  if (!apiKey) {
    throw new Error('MUSE_KEY_MISSING');
  }

  const baseUrl = (
    options.baseUrl ||
    process.env.NEXT_PUBLIC_MUSE_SPARK_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/+$/, '');

  const model =
    options.model ||
    process.env.NEXT_PUBLIC_MUSE_SPARK_MODEL ||
    DEFAULT_MODEL;

  const messages: MuseChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-4),
    { role: 'user', content: userQuery.trim() },
  ];

  const payload = {
    model,
    messages,
    temperature: 0.2,
    max_tokens: 3000,
    reasoning_effort: 'low',
  };

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 402) {
      throw new Error('BILLING_REQUIRED');
    }
    if (response.status === 401) {
      throw new Error('INVALID_API_KEY');
    }
    throw new Error(`Muse Spark Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error('Empty response from Muse Spark');
  }

  return answer.trim();
}
