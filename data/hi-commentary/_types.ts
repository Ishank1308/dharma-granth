export interface HiCommentaryEntry {
  /**
   * भावार्थ: Direct, authentic Hindi meaning of the verse (Gita Press standard).
   * Supplies the primary Hindi sense when not already present on the verse.
   */
  bhavartha?: string;
  /**
   * व्याख्या: In-depth spiritual, philosophical, and context-rich exposition
   * grounded in Lokasamgraha and saintly perspectives.
   */
  explanation?: string;
  /**
   * Optional/legacy field; modern context is primarily structured in lifeLesson.
   */
  science?: string;
  /**
   * आधुनिक संदर्भ: Structured modern relevance with:
   * ### आधुनिक संदर्भ (Contemporary Relevance)
   * ### आज के जीवन में प्रयोग (3 Actionable Protocols)
   * ### चिंतन प्रश्न (1 Contemplation Question)
   */
  lifeLesson?: string;
  /**
   * Drafted by AI (scripts/generate-verse-commentary.ts) and approved by a
   * reviewer; the site labels these. Absent for hand-written commentary.
   */
  ai?: true;
  /**
   * Only the explanation is an approved AI draft (it replaced hand-written
   * व्याख्या); science and lifeLesson on this entry are still hand-written.
   */
  explanationAi?: true;
  /**
   * Only the research note (शोध व आधुनिक संदर्भ) is an approved AI rewrite
   * (data/ai-commentary/<id>-research.json); the site labels that note alone.
   */
  scienceAi?: true;
  /**
   * Set on entries from the editorial pilot (data/pilot/records). The site labels these as drafts that still
   * need a person to review them.
   */
  editorial?: {
    reviewStatus: "review-required";
    confidence: "high" | "medium" | "low";
    vijnanaCategory: string;
    evidenceLevel: "editorial-observation" | "none";
    arthaDecision: string;
  };
}

/**
 * Keys are `${chapterId}:${verseId}` within a single scripture.
 * Each fragment file (e.g. aitareya.ts) exports one of these,
 * and verse-explanations-hi.ts merges them into the global tables
 * by prefixing keys with the scripture id.
 */
export type HiCommentaryFragment = Record<string, HiCommentaryEntry>;
