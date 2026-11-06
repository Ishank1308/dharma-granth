/**
 * Test: ElevenLabs Sacred Verse Audio & Recitation Integration
 *
 * Verifies:
 * 1. Verse audio path resolution & registry lookup
 * 2. Timing track JSON integrity (VerseTimingTrack & TimedWord)
 * 3. Text sanitization for sacred chanting (stripping numbering artifacts)
 * 4. Word-level timing track reconstruction from character alignments
 * 5. Sacred soundscape context synchronization
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  VERSE_AUDIO_REGISTRY,
  DHARMA_AUDIO_CACHE_NAME,
  getVerseAudioUrl,
  getVerseTimingUrl,
  hasRecordedVerseAudio,
  getAudioCache,
  isVerseAudioCached,
  prefetchVerseAudio,
} from '../lib/verse-audio';
import {
  sanitizeRecitationText,
  buildWordTimingTrack,
} from './generate-verse-audio-elevenlabs';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ${message}`);
}

console.log('\n=== Testing ElevenLabs Verse Audio Integration ===\n');

// 1. Registry & URL Resolution
assert(
  Boolean(VERSE_AUDIO_REGISTRY['bhagavadgita/2/47']),
  'Bhagavad Gita 2.47 is registered in VERSE_AUDIO_REGISTRY'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 2, 47) === true,
  'hasRecordedVerseAudio returns true for Gita 2.47'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 4, 7) === true,
  'hasRecordedVerseAudio returns true for Gita 4.7 (Yada yada hi dharmasya)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 18, 66) === true,
  'hasRecordedVerseAudio returns true for Gita 18.66 (Sarva-dharman parityajya)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 9, 22) === true,
  'hasRecordedVerseAudio returns true for Gita 9.22 (Ananyas cintayanto mam)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 12, 15) === true,
  'hasRecordedVerseAudio returns true for Gita 12.15 (Yasman nodvijate loko)'
);

assert(
  hasRecordedVerseAudio('ishavasya', 1, 1) === true,
  'hasRecordedVerseAudio returns true for Isha Upanishad 1.1 (Isha vasyam idam sarvam)'
);

assert(
  hasRecordedVerseAudio('yogasutra', 1, 1) === true,
  'hasRecordedVerseAudio returns true for Yoga Sutra 1.1 (Atha yoganushasanam)'
);

assert(
  hasRecordedVerseAudio('yogasutra', 1, 2) === true,
  'hasRecordedVerseAudio returns true for Yoga Sutra 1.2 (Yogash chitta-vritti-nirodhah)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 2, 20) === true,
  'hasRecordedVerseAudio returns true for Gita 2.20 (Na jayate mriyate va)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 11, 32) === true,
  'hasRecordedVerseAudio returns true for Gita 11.32 (Kalo smi lokaksayakrt)'
);

assert(
  hasRecordedVerseAudio('katha', 2, 1) === true,
  'hasRecordedVerseAudio returns true for Katha Upanishad 2.1 (Shreyas vs Preyas)'
);

assert(
  hasRecordedVerseAudio('mandukya', 1, 1) === true,
  'hasRecordedVerseAudio returns true for Mandukya Upanishad 1 (Om ityetad aksharam)'
);

assert(
  hasRecordedVerseAudio('naradabhaktisutra', 1, 1) === true,
  'hasRecordedVerseAudio returns true for Narada Bhakti Sutra 1 (Athato bhaktim)'
);

assert(
  hasRecordedVerseAudio('rigveda', 10, '129.1') === true,
  'hasRecordedVerseAudio returns true for Rigveda 10.129.1 (Nasadiya Sukta)'
);

assert(
  hasRecordedVerseAudio('bhagavadgita', 2, 999) === false,
  'hasRecordedVerseAudio returns false for unregistered verse'
);

const audioUrl = getVerseAudioUrl('bhagavadgita', 2, 47);
assert(
  audioUrl.includes('bhagavadgita/2/47'),
  `Audio URL correctly resolved: ${audioUrl}`
);

const timingUrl = getVerseTimingUrl('bhagavadgita', 2, 47);
assert(
  timingUrl.endsWith('/audio/verses/bhagavadgita/2/47.json'),
  `Timing URL correctly resolved: ${timingUrl}`
);

// 2. Timing Track Files on Disk
const timingFile47 = path.resolve('public/audio/verses/bhagavadgita/2/47.json');
assert(fs.existsSync(timingFile47), `Timing file exists at ${timingFile47}`);

const track47 = JSON.parse(fs.readFileSync(timingFile47, 'utf8'));
assert(track47.verseNumber === 47, 'Verse number matches 47');
assert(track47.durationMs > 0, `Valid durationMs: ${track47.durationMs}ms`);
assert(Array.isArray(track47.words) && track47.words.length > 0, 'Timing track has words array');
assert(
  track47.words[0].word.includes('कर्म'),
  `First word in track starts with karma: "${track47.words[0].word}"`
);

// 3. Text Sanitization
const rawSanskrit = 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\n\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि।।2.47।।\n';
const clean = sanitizeRecitationText(rawSanskrit);
assert(
  !clean.includes('2.47') && !clean.includes('।।2.47।।'),
  'Sanitize strips verse numbering artifact (।।2.47।।)'
);
assert(
  clean.startsWith('कर्मण्येवाधिकारस्ते') && clean.includes('सङ्गोऽस्त्वकर्मणि'),
  `Clean shloka preserved correctly: "${clean}"`
);

// 4. Alignment to Word Timing Reconstruction
const mockAlignment = {
  characters: ['क', 'र', '्', 'म', ' ', 'प', 'ा', 'ठ'],
  character_start_times_seconds: [0.0, 0.1, 0.15, 0.2, 0.4, 0.5, 0.6, 0.7],
  character_end_times_seconds: [0.1, 0.15, 0.2, 0.35, 0.5, 0.6, 0.7, 0.85],
};
const reconstructed = buildWordTimingTrack(1, mockAlignment);
assert(reconstructed.words.length === 2, `Expected 2 words reconstructed, got ${reconstructed.words.length}`);
assert(reconstructed.words[0].word === 'कर्म', `First word is 'कर्म', got '${reconstructed.words[0].word}'`);
assert(reconstructed.words[0].startTimeMs === 0, `First word starts at 0ms`);
assert(reconstructed.words[0].endTimeMs === 350, `First word ends at 350ms`);
assert(reconstructed.words[1].word === 'पाठ', `Second word is 'पाठ'`);
assert(reconstructed.durationMs === 850, `Duration is 850ms, got ${reconstructed.durationMs}`);

// 5. Offline Cache Infrastructure
assert(
  DHARMA_AUDIO_CACHE_NAME === 'dharma-audio-cache-v1',
  'CacheStorage identifier is dharma-audio-cache-v1'
);

assert(
  typeof getAudioCache === 'function',
  'getAudioCache helper is defined'
);

assert(
  typeof isVerseAudioCached === 'function',
  'isVerseAudioCached helper is defined'
);

assert(
  typeof prefetchVerseAudio === 'function',
  'prefetchVerseAudio gapless pre-buffer helper is defined'
);

console.log('\n🎉 All ElevenLabs Verse Audio & Offline Cache tests passed successfully!\n');
