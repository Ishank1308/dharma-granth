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
      'muse-spark-1.3';
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  /**
   * General-purpose chat completion with Muse Spark 1.3
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
      max_tokens: options.maxTokens ?? 4096,
      reasoning_effort: options.reasoningEffort ?? 'low',
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
   * Drafts commentary adhering strictly to Dharma Granth's 4-layer standard:
   * 1. Dignified tatsam Hindi explanation (no Urdu/colloquialisms, no Devanagari numerals)
   * 2. Modern Context with:
   *    - ### आधुनिक संदर्भ
   *    - ### आज के जीवन में प्रयोग (exactly 3 bullets: - **शीर्षक**: विवरण)
   *    - ### चिंतन प्रश्न (exactly 1 question)
   */
  async draftVerseCommentary(verse: {
    scriptureName: string;
    chapterNumber: number | string;
    verseNumber: number | string;
    sanskrit?: string;
    hindi?: string;
    translation?: string;
  }): Promise<{
    explanation: string;
    lifeLesson: string;
    science: string;
  }> {
    const systemPrompt = `You are an erudite Vedic scholar and philosopher writing for Dharma Granth (dharmagranth.dev).
You compose insightful, dignified commentary in high-register tatsam Hindi (Gita Press standard).

STRICT RULES:
1. Hindi Register:
   - Use dignified tatsam vocabulary.
   - Do NOT use colloquial, Urdu-Persian terms (replace तनाव with उद्वेग, शुरू with आरम्भ, पैदा with उत्पन्न, थकान with श्रान्ति, नकल with अनुकरण, याद with स्मरण, जल्दबाजी with शीघ्रता).
   - Address the reader respectfully as 'आप'.
2. Numerals:
   - ZERO Devanagari numerals (०, १, २, ३, ४, ५, ६, ७, ८, ९).
   - Use standard ASCII digits 0-9 (1, 2, 3, 2026) or Hindi word forms (प्रथम, द्वितीय, एक, दो).
3. 4-Layer Modern Context Framework for 'lifeLesson':
   - Layer 1: Exactly heading "### आधुनिक संदर्भ" followed by 1-2 substantial paragraphs connecting Vedic wisdom to modern cognitive science, psychology, physics, ethics, or existential challenges.
   - Layer 2: Exactly heading "### आज के जीवन में प्रयोग" followed by exactly 3 bullet points in format: "- **शीर्षक (Descriptor)**: विवरण"
   - Layer 3: Exactly heading "### चिंतन प्रश्न" followed by exactly 1 thought-provoking contemplation question.
4. Output JSON:
   {
     "explanation": "Deep philosophical exposition in pure tatsam Hindi (200-280 words)",
     "lifeLesson": "Structured modern context with the 3 exact headings",
     "science": "Underlying universal cosmic/natural principle (100-150 words)"
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
