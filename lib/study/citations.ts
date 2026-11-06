/**
 * Scholarly & Social Citation Engine for Dharma Granth (dharmagranth.dev)
 * 
 * Supports standard academic styles (APA 7th, Chicago 17th, MLA 9th)
 * alongside Markdown and formatted Social / WhatsApp sharing.
 */

export interface CitationParams {
  scriptureId: string;
  scriptureTitle: string;
  scriptureSanskrit?: string;
  chapterId: number;
  verseNum: string | number;
  sanskrit: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  verseUrl: string;
}

export type CitationFormat = 'apa' | 'chicago' | 'mla' | 'markdown' | 'whatsapp';

export function formatCitation(params: CitationParams, format: CitationFormat): string {
  const {
    scriptureTitle,
    chapterId,
    verseNum,
    sanskrit,
    translation,
    hindi,
    verseUrl,
  } = params;

  const todayYear = new Date().getFullYear();
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  switch (format) {
    case 'apa':
      return `${scriptureTitle}. (${chapterId}.${verseNum}). In Dharma Granth Sacred Canon Archive. Retrieved ${todayFormatted}, from ${verseUrl}`;

    case 'chicago':
      return `${scriptureTitle}, chap. ${chapterId}, v. ${verseNum}. Dharma Granth. Accessed ${todayFormatted}. ${verseUrl}.`;

    case 'mla':
      return `"${scriptureTitle} ${chapterId}.${verseNum}." Dharma Granth: The Complete Digital Library of Sanatana Dharma, ${todayYear}, ${verseUrl}.`;

    case 'markdown':
      return `> ${sanskrit.replace(/\n+/g, ' ')}\n>\n> *"${(hindi || translation || '').trim()}"*\n>\n> — **${scriptureTitle} ${chapterId}.${verseNum}** · [dharmagranth.dev](${verseUrl})`;

    case 'whatsapp':
      return `📜 *${scriptureTitle} ${chapterId}.${verseNum}*\n\n॥ ${sanskrit.trim()} ॥\n\n${
        hindi ? `*भावार्थ:* ${hindi.trim()}\n\n` : ''
      }${
        translation ? `*Meaning:* ${translation.trim()}\n\n` : ''
      }🔗 *पवित्र शास्त्र पढ़ें:* ${verseUrl}\n_Dharma Granth · शून्य विज्ञापन, विशुद्ध स्वाध्याय_`;

    default:
      return `${scriptureTitle} ${chapterId}.${verseNum} - ${verseUrl}`;
  }
}
