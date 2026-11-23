import { EDITORIAL_DRAFT_LABEL } from '@/lib/editorial-terminology';
import {
  verseReference,
  type ReaderProvenance,
  type ReaderRef,
  type ReaderVerseText,
} from './reader-actions';

const clean = (s?: string): string => (s ?? '').replace(/\s+\n/g, '\n').trim();

/** Human-readable layer labels used in copied and downloaded text. */
export function layerNote(p: ReaderProvenance, layer: 'hindi' | 'english'): string {
  const ai = layer === 'hindi' ? p.hindiIsAi : p.englishIsAi;
  return ai ? ' (study translation, AI-assisted draft — not a scholarly edition)' : '';
}

/** Text for "Copy with reference": only the layers the reader currently shows. */
export function buildCopyText(
  ref: ReaderRef,
  verse: ReaderVerseText,
  p: ReaderProvenance,
  show: { transliteration: boolean; hindi: boolean; english: boolean },
): string {
  const parts = [
    verse.sanskrit && `॥ ${clean(verse.sanskrit)} ॥`,
    show.transliteration && verse.transliteration && clean(verse.transliteration),
    show.hindi && verse.hindi && `हिन्दी${layerNote(p, 'hindi')}:\n${clean(verse.hindi)}`,
    show.english && verse.translation && `English${layerNote(p, 'english')}:\n${clean(verse.translation)}`,
    `— ${verseReference(ref, verse)}`,
    ref.url && `Dharma Granth: ${ref.url}`,
  ];
  return parts.filter(Boolean).join('\n\n');
}

/**
 * The downloadable verse card (Markdown). Layers without data are left out
 * rather than filled with placeholders, and AI-drafted layers say so.
 */
export function buildDownloadMarkdown(ref: ReaderRef, verse: ReaderVerseText, p: ReaderProvenance): string {
  const section = (title: string, body?: string) => (body && clean(body) ? `## ${title}\n\n${clean(body)}\n` : '');
  const aiNote = p.commentaryIsAi ? `\n_Editorial draft: ${EDITORIAL_DRAFT_LABEL.detail} Not part of the scripture._` : '';
  const lines = [
    `# ${verseReference(ref, verse)}`,
    `${ref.scriptureTitle}${ref.scriptureTitleSanskrit ? ` (${ref.scriptureTitleSanskrit})` : ''} · ${ref.chapterTitle}\n`,
    section('Sanskrit (source text)', verse.sanskrit),
    section('Transliteration (IAST)', verse.transliteration),
    section('Word-by-word', verse.wordMeaning),
    section(`Hindi translation${layerNote(p, 'hindi')}`, verse.hindi),
    section(`English translation${layerNote(p, 'english')}`, verse.translation),
    verse.explanation ? `${section('व्याख्या (Vyakhya)', verse.explanation)}${aiNote}\n` : '',
    verse.commentary ? `${section('Commentary & Explanation', verse.commentary)}${aiNote}\n` : '',
    verse.reflection ? `${section('Modern reflection', verse.reflection)}${aiNote}\n` : '',
    verse.research ? `${section('Research context', verse.research)}${aiNote}\n` : '',
    '## Source',
    '',
    `- Sanskrit text: ${p.sourceHost ?? 'not recorded'}${p.sourceFetched ? ` (fetched ${p.sourceFetched.slice(0, 10)})` : ''}`,
    p.sourceLicense ? `- Licence note: ${p.sourceLicense}` : '',
    `- Page: ${ref.url}`,
  ];
  return `${lines.filter((l) => l !== '').join('\n')}\n`;
}
