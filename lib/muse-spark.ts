/**
 * Dharma Granth: Muse Spark 1.3 Integration Client
 * 
 * Provides an OpenAI-compatible interface to Meta's Muse Spark 1.3 model family:
 * - 1M token context window
 * - Deep multi-step philosophical and agentic reasoning
 * - Native Sanskrit & dignified Hindi register generation
 * - Zero external dependencies (uses standard Web Fetch API)
 */

export interface MuseSparkConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface MuseSparkCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class MuseSparkClient {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config: MuseSparkConfig = {}) {
    this.apiKey =
      config.apiKey ||
      process.env.MUSE_SPARK_API_KEY ||
      process.env.LLM_API_KEY ||
      '';
    this.baseUrl = (
      config.baseUrl ||
      process.env.MUSE_SPARK_BASE_URL ||
      'https://api.meta.ai/v1'
    ).replace(/\/+$/, '');
    this.model =
      config.model ||
      process.env.MUSE_SPARK_MODEL ||
      'muse-spark-1.3-contributor';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  /**
   * General-purpose chat completion with Muse Spark 1.3 Contributor
   */
  async chat(
    messages: ChatMessage[],
    options: {
      temperature?: number;
      maxTokens?: number;
      reasoningEffort?: 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max';
      responseFormat?: { type: 'json_object' | 'text' };
    } = {}
  ): Promise<string> {
    if (!this.isConfigured) {
      throw new Error(
        'Muse Spark API key is not configured. Set MUSE_SPARK_API_KEY in .env.local.'
      );
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const payload: Record<string, unknown> = {
      model: this.model,
      messages,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens ?? 32000,
      reasoning_effort: options.reasoningEffort ?? 'max',
    };

    if (options.responseFormat?.type === 'json_object') {
      payload.response_format = { type: 'json_object' };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(
        `Muse Spark API Error (${response.status} ${response.statusText}): ${errText}`
      );
    }

    const data = (await response.json()) as MuseSparkCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Received empty completion response from Muse Spark.');
    }

    return content.trim();
  }

  /**
   * Drafts commentary adhering strictly to Dharma Granth's 3-tier standard:
   * 1. भावार्थ (Bhavartha): Pure, accessible direct Hindi translation (Gita Press standard)
   * 2. व्याख्या (Vyakhya): Deep philosophical and spiritual exposition anchored in Lokasamgraha
   * 3. आधुनिक संदर्भ (Modern Context): Contemporary relevance, 3 actionable life applications, and 1 reflection question
   */
  async draftVerseCommentary(verse: {
    scriptureName: string;
    chapterNumber: number | string;
    verseNumber: number | string;
    sanskrit?: string;
    hindi?: string;
    translation?: string;
  }): Promise<{
    bhavartha?: string;
    explanation: string;
    lifeLesson: string;
    science?: string;
  }> {
    const systemPrompt = `You are an erudite Vedic scholar and philosopher writing for Dharma Granth (dharmagranth.dev).
You compose authentic, dignified, and insightful scriptural guidance structured around three canonical pillars:
1. भावार्थ (Direct Meaning / Essence)
2. व्याख्या (In-Depth Spiritual & Philosophical Exposition)
3. आधुनिक संदर्भ (Modern Context & Practical Application)

STRICT RULES:
1. Core Theological Ethos: Lokasamgraha (लोकसंग्रह):
   - Ground all interpretations in the foundational perspective of Lokasamgraha (विश्व-कल्याण, लोक-कल्याण, सर्वभूतहित).
   - Hindu saints (Shankara, Ramanuja, Tulsidas, Jnaneshwar, Tukaram, Vivekananda) were never escapists.
   - Spiritual realization, renunciation of ego, and equanimity (समत्व) lead directly to compassionate action, social harmony, and universal upliftment (आत्मवत् सर्वभूतेषु).
   - Never frame spirituality as cold apathy, fatalism, or selfish isolation.
2. Hindi Register:
   - Use simple, dignified Hindi (सरल और गरिमापूर्ण हिन्दी) that any regular reader can easily understand.
   - Common everyday Hindi words are perfectly fine: तनाव, शुरू, याद, थकान, पैदा, नकल, जल्दबाजी — use them naturally.
   - Do NOT use Urdu/Persian terms (replace खुदा with ईश्वर, दुआ with प्रार्थना, इंसाफ with न्याय, तसल्ली with सान्त्वना, बंदगी with उपासना, रहम with कृपा, फरमान with आदेश).
   - Address the reader respectfully as 'आप'.
   - Avoid forcing artificial pseudo-scientific or neuroscience jargon (like prefrontal cortex, dopamine, priming). Connect directly to human psychology, ethical responsibility, and purposeful living.
3. Numerals:
   - ZERO Devanagari numerals (०, १, २, ३, ४, ५, ६, ७, ८, ९).
   - Use standard ASCII digits 0-9 (1, 2, 3, 2026) or Hindi word forms (पहला, दूसरा, एक, दो).
4. The 3 Canonical Layers:
   - भावार्थ (bhavartha): 1-3 clear, faithful sentences giving the direct meaning of the original verse in standard Gita Press-style Hindi.
   - व्याख्या (explanation): 200-280 words of profound spiritual and philosophical contemplation. Explain the inner vision, the purpose of the teaching, tradition perspectives, and how it upholds Lokasamgraha.
   - आधुनिक संदर्भ (lifeLesson): Structured contemporary relevance with exactly these 3 headings:
     ### आधुनिक संदर्भ
     1-2 substantial paragraphs explaining how this timeless truth guides modern decisions, mental calm, relationships, and work.
     ### आज के जीवन में प्रयोग
     Exactly 3 bullet points in format: "- **शीर्षक (Descriptor)**: व्यावहारिक विवरण"
     ### चिंतन प्रश्न
     Exactly 1 thought-provoking contemplation question for inner self-inquiry.
5. Output JSON:
   {
     "bhavartha": "Direct Hindi meaning (भावार्थ) of the verse",
     "explanation": "Deep spiritual and philosophical exposition (व्याख्या) anchored in Lokasamgraha",
     "lifeLesson": "Structured modern context (आधुनिक संदर्भ) containing the 3 exact headings",
     "science": ""
   }`;

    const userPrompt = `Scripture: ${verse.scriptureName}
Chapter: ${verse.chapterNumber}, Verse: ${verse.verseNumber}
Sanskrit:
${verse.sanskrit || 'N/A'}

Existing Translation/Notes:
${verse.hindi || verse.translation || 'N/A'}

Please draft the commentary in JSON format adhering strictly to all requirements.`;

    const raw = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.2, responseFormat: { type: 'json_object' } }
    );

    // Extract JSON block if surrounded by markdown code fences
    const cleanJson = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleanJson);
  }
}

export const museSpark = new MuseSparkClient();
