/**
 * Unit tests for Release 1 logic that runs without a browser.
 * Run: npm run test:release1
 */
import assert from 'node:assert/strict';

// A minimal browser-like storage so the local-first modules can run in Node.
class MemoryStorage {
  private m = new Map<string, string>();
  get length() { return this.m.size; }
  key(i: number) { return Array.from(this.m.keys())[i] ?? null; }
  getItem(k: string) { return this.m.has(k) ? (this.m.get(k) as string) : null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}
const storage = new MemoryStorage();
(globalThis as unknown as { window: unknown }).window = { localStorage: storage, dispatchEvent: () => true };

async function main() {
  const history = await import('../lib/reading-history');

  /* ── Reading history ── */
  const visit = (id: string, chapter = 1) => ({ scriptureId: id, scriptureTitle: id, chapterId: chapter, chapterTitle: `Chapter ${chapter}`, totalChapters: 18 });

  history.recordChapterVisit(visit('bhagavadgita', 2));
  history.updateLastVerse('bhagavadgita', 2, '47');
  assert.equal(history.readRecentChapters()[0].verseId, '47', 'reading position is stored');

  history.setHistoryPaused(true);
  assert.equal(history.isHistoryPaused(), true);
  history.recordChapterVisit(visit('ishavasya'));
  history.updateLastVerse('bhagavadgita', 2, '48');
  assert.equal(history.readRecentChapters().length, 1, 'paused history records nothing new');
  assert.equal(history.readRecentChapters()[0].verseId, '47', 'paused history does not move the position');
  history.setHistoryPaused(false);
  assert.equal(history.isHistoryPaused(), false);

  history.recordChapterVisit(visit('ishavasya'));
  const exported = history.exportHistory();
  assert.ok(!/note/i.test(exported), 'export holds chapters and positions only');
  assert.equal(history.clearHistory(), 2);
  assert.equal(history.readRecentChapters().length, 0);
  assert.equal(history.importHistory(exported), 2, 'export then import round-trips');
  assert.equal(history.readRecentChapters().length, 2);

  assert.throws(() => history.importHistory('{"format":"something-else","version":1,"visits":[]}'), /Not a Dharma Granth/);
  assert.throws(() => history.importHistory('not json'));
  const before = history.readRecentChapters().length;
  const messy = JSON.stringify({ format: history.HISTORY_EXPORT_FORMAT, version: 1, visits: [{ scriptureId: '../x', scriptureTitle: 'x', chapterId: 1, chapterTitle: 'c', readAt: 'now' }, { nope: true }] });
  assert.equal(history.importHistory(messy), 0, 'malformed entries are dropped');
  assert.equal(history.readRecentChapters().length, before);

  /* ── Collections ── */
  const col = await import('../lib/verse-collections');
  let st = col.emptyState();
  assert.deepEqual(st.collections.map((c) => c.name), ['Read Later', 'Favourites', 'Study Carefully', 'Daily Reflection', 'Share Later']);
  const v1 = { scriptureId: 'bhagavadgita', chapterId: 2, verseId: 47 };
  const v2 = { scriptureId: 'ishavasya', chapterId: 1, verseId: 1 };
  assert.equal(col.collectionOf(st, v1), 'read-later', 'unassigned saved verses are in Read Later');

  const made = col.createCollection(st, '  Exam week  ');
  assert.ok(made.id && !made.error);
  st = made.state;
  assert.equal(st.collections.at(-1)?.name, 'Exam week');
  assert.ok(col.createCollection(st, 'exam WEEK').error, 'names are unique ignoring case');
  assert.ok(col.createCollection(st, '   ').error);
  assert.equal(col.createCollection(st, 'x'.repeat(80)).state.collections.at(-1)?.name.length, col.MAX_NAME);

  st = col.moveVerse(st, v1, made.id!);
  st = col.moveVerse(st, v2, 'favourites');
  assert.equal(col.collectionOf(st, v1), made.id);
  assert.equal(col.collectionOf(st, v2), 'favourites');
  assert.equal(col.moveVerse(st, v1, 'no-such-collection'), st, 'moving to an unknown collection changes nothing');

  assert.ok(col.renameCollection(st, 'read-later', 'Later').error, 'built-ins keep their names');
  const renamed = col.renameCollection(st, made.id!, 'Revision');
  assert.equal(renamed.state.collections.find((c) => c.id === made.id)?.name, 'Revision');
  assert.ok(col.renameCollection(st, made.id!, 'Favourites').error, 'rename cannot collide');

  assert.ok(col.deleteCollection(st, 'favourites').error, 'built-ins cannot be deleted');
  const removed = col.deleteCollection(renamed.state, made.id!);
  assert.equal(col.collectionOf(removed.state, v1), 'read-later', 'deleting a collection moves its verses to Read Later');
  assert.equal(removed.state.collections.length, 5);

  const saved = [
    { ...v1, scriptureTitle: 'Bhagavad Gita', chapterTitle: 'Sankhya Yoga', sanskrit: 'कर्मण्येवाधिकारस्ते', translation: 'You have the right to work alone' },
    { ...v2, scriptureTitle: 'Isha Upanishad', chapterTitle: 'Isha', sanskrit: 'ईशा वास्यमिदं', translation: 'All this is pervaded by the Lord' },
  ];
  const note = (v: { verseId: number | string }) => (String(v.verseId) === '1' ? 'my private reminder about Isha' : undefined);
  assert.equal(col.filterSaved(saved, st, { query: 'right to work' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { query: 'REMINDER' }, note).length, 1, 'search includes the private note');
  assert.equal(col.filterSaved(saved, st, { scriptureId: 'ishavasya' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { collectionId: 'favourites' }).length, 1);
  assert.equal(col.filterSaved(saved, st, { query: 'kharma-not-there' }).length, 0);

  // Export leaves private notes out unless they are explicitly passed.
  const plain = col.buildExport(saved, st);
  assert.ok(!plain.includes('private reminder') && !('notes' in JSON.parse(plain)));
  const withNotes = col.buildExport(saved, st, [{ scriptureId: 'ishavasya', chapterId: 1, verseId: 1, text: 'private', updatedAt: 'x' }]);
  assert.equal(col.parseExport(withNotes).notes.length, 1);
  assert.equal(col.parseExport(plain).saved.length, 2);
  assert.equal(col.parseExport(plain).state.assign[col.verseKey(v2)], 'favourites', 'export then import keeps assignments');
  assert.throws(() => col.parseExport('{"format":"other","version":1}'), /Not a Dharma Granth/);
  const sharePath = col.buildSharePath('Prarthana & courage', [v1, v2]);
  const shared = col.parseSharePath(sharePath.slice(sharePath.indexOf('?')));
  assert.equal(shared.name, 'Prarthana & courage', 'share names survive URL encoding');
  assert.deepEqual(shared.refs, [v1, v2], 'share links preserve only verse references');
  assert.equal(JSON.stringify(shared).includes('private'), false, 'share links never contain private notes');
  const boundedShare = col.parseSharePath(`?v=${Array.from({ length: col.SHARE_MAX + 5 }, (_, i) => `bhagavadgita:2:${i + 1}`).join(',')}`);
  assert.equal(boundedShare.refs.length, col.SHARE_MAX, 'share links are capped at the supported reference limit');
  const malformedShare = col.parseSharePath('?v=../secret,unknown,ishavasya:1:1,ishavasya:1:1');
  assert.deepEqual(malformedShare.refs, [{ scriptureId: 'ishavasya', chapterId: 1, verseId: 1 }], 'malformed and duplicate references are dropped');
  assert.equal(col.sanitize({ collections: [{ id: 'bad id!', name: 'x' }, { id: 'ok-1', name: 'Fine' }], assign: { 'bhagavadgita:2:47': 'missing' } }).collections.length, 6);
  assert.deepEqual(col.sanitize(null), col.emptyState());

  /* ── Analytics policy ── */
  const an = await import('../lib/analytics');
  assert.equal(an.cleanEvent('not_an_event', {}), null, 'unknown events are dropped');
  const saved1 = an.cleanEvent('verse_saved', { scriptureId: 'bhagavadgita', collectionId: 'read-later', note: 'my private thought', text: 'secret' });
  assert.deepEqual(saved1?.props, { scriptureId: 'bhagavadgita', collectionId: 'read-later' }, 'properties not on the allowlist are dropped');
  assert.deepEqual(an.cleanEvent('verse_saved', { scriptureId: 'I felt anxious today about my exam' })?.props, {}, 'sentences are dropped even in an allowed property');
  assert.deepEqual(an.cleanEvent('feedback_submitted', { rating: 'partly', reasons: ['Language was difficult'] })?.props, { rating: 'partly' });
  assert.deepEqual(an.cleanEvent('collection_created', { name: 'Grief and my mother' })?.props, {}, 'collection names are never sent');
  assert.deepEqual(an.cleanEvent('search_completed', { resultCount: 12, intent: 'about', query: 'verses about my anger' })?.props, { resultCount: 12, intent: 'about' }, 'search text is never sent');
  assert.deepEqual(an.cleanEvent('search_completed', { resultCount: Number.NaN })?.props, {});
  for (const [name, allowed] of Object.entries(an.EVENT_PROPERTIES)) {
    for (const p of allowed) assert.ok(!/note|text|reflection|journal|query|name|voice|recording|japa/i.test(p), `${name}.${p} could carry private text`);
  }
  // No sink and no tracking unless allowed.
  const seen: unknown[] = [];
  (globalThis as unknown as { window: Record<string, unknown> }).window.__dharmaAnalytics = (e: unknown) => seen.push(e);
  (globalThis as unknown as { window: Record<string, unknown> }).window.navigator = { doNotTrack: '1' };
  (globalThis as unknown as { window: Record<string, unknown> }).window.CustomEvent = class {} as unknown;
  an.track('verse_opened', { scriptureId: 'bhagavadgita', chapter: 2, verse: '47' });
  assert.equal(seen.length, 0, 'Do Not Track is respected');
  (globalThis as unknown as { window: Record<string, unknown> }).window.navigator = { doNotTrack: null };
  (globalThis as unknown as { CustomEvent: unknown }).CustomEvent = class { constructor(public type: string, public init: unknown) {} };
  an.track('verse_opened', { scriptureId: 'bhagavadgita', chapter: 2, verse: '47' });
  assert.equal(seen.length, 1);
  an.setAnalyticsEnabled(false);
  an.track('verse_opened', { scriptureId: 'bhagavadgita' });
  assert.equal(seen.length, 1, 'the reader can turn tracking off');

  /* ── Activity log and weekly summary ── */
  const act = await import('../lib/activity-log');
  const mem = new MemoryStorage();
  const wed = new Date(2026, 9, 7, 10); // 7 Oct 2026, local
  const log = (kind: 'verse' | 'saved' | 'journey' | 'lesson', ref: string, concepts?: string[], now = wed, paused = false) => act.logActivity({ kind, ref, concepts }, { store: mem, now, paused });
  assert.equal(log('verse', 'bhagavadgita:2:47', ['karma', 'yoga']), true);
  assert.equal(log('verse', 'bhagavadgita:2:47', ['karma']), false, 'the same verse on the same day is kept once');
  log('verse', 'bhagavadgita:2:48', ['karma', 'dharma']);
  log('saved', 'bhagavadgita:2:47');
  log('lesson', 'seven-days-of-focus:f1');
  log('journey', 'seven-days-of-focus');
  log('verse', 'ishavasya:1:1', ['atman'], new Date(2026, 9, 1)); // 6 days before: inside the window
  log('verse', 'old:1:1', ['maya'], new Date(2026, 8, 20)); // outside the window
  const sum = act.weeklySummary(act.readActivity(mem), wed);
  assert.equal(sum.teachingsExplored, 3);
  assert.equal(sum.versesSaved, 1);
  assert.equal(sum.journeysContinued, 1, 'lessons and journey starts of one journey count once');
  assert.deepEqual(sum.conceptsExplored, ['karma', 'atman', 'dharma'], 'top concepts by use, ties alphabetical');
  assert.equal(sum.activeDays, 2);
  assert.equal(log('verse', 'x:1:1', undefined, wed, true), false, 'paused history records nothing');
  assert.equal(act.logActivity({ kind: 'verse', ref: 'a note: I felt sad today about exams' }, { store: mem, now: wed }), false, 'free text is refused');
  mem.setItem(act.ACTIVITY_KEY, JSON.stringify([{ day: '2026-10-07', kind: 'verse', ref: 'a:1:1', text: 'secret' }, { nope: 1 }]));
  assert.equal(act.readActivity(mem).length, 1, 'malformed entries are ignored on read');
  act.setSummaryEnabled(false, mem);
  assert.equal(act.logActivity({ kind: 'verse', ref: 'a:1:2' }, { store: mem, now: wed }), false, 'switching the summary off stops recording');
  act.setSummaryEnabled(true, mem);
  assert.ok(act.clearActivity(mem) >= 1);
  assert.equal(act.readActivity(mem).length, 0);
  assert.equal(act.weeklySummary([], wed).teachingsExplored, 0);

  /* ── Reminders (.ics) ── */
  const rem = await import('../lib/reminders');
  const base = { type: 'daily-verse' as const, days: ['MO', 'WE'] as Array<'MO' | 'WE'>, time: '08:30', everyWeeks: 1 as const, language: 'en' as const };
  const when = new Date(2026, 9, 7, 9, 0); // Wednesday 7 Oct 2026, local
  const ics = rem.buildReminderIcs(base, 'https://example.org/', when, 'test-uid@dharmagranth');
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n') && ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(ics.includes('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE'));
  assert.ok(ics.includes('DTSTART:20261007T083000'), 'starts on the first chosen weekday, in floating local time');
  assert.ok(ics.includes('Your selected reading is ready whenever you are.'));
  assert.ok(ics.includes('URL:https://example.org/daily'));
  assert.ok(!rem.FORBIDDEN_WORDS.test(ics), 'no urgency, streak or guilt wording');
  for (const lang of ['en', 'hi'] as const) for (const type of Object.keys(rem.REMINDER_COPY) as Array<keyof typeof rem.REMINDER_COPY>) {
    const text = rem.buildReminderIcs({ ...base, type, language: lang }, 'https://example.org', when);
    assert.ok(!rem.FORBIDDEN_WORDS.test(text), type + ' ' + lang);
    for (const line of text.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, 'folded to 75 octets: ' + line.slice(0, 30));
  }
  assert.equal(rem.firstOccurrence(['TU'], when).getDate(), 13, 'next Tuesday after Wednesday 7 Oct');
  assert.throws(() => rem.buildReminderIcs({ ...base, days: [] }, 'https://example.org'), /at least one day/);
  assert.throws(() => rem.buildReminderIcs({ ...base, time: '25:00' }, 'https://example.org'), /Choose a time/);
  assert.ok(rem.inQuietHours('23:30', '22:00', '07:00') && rem.inQuietHours('06:59', '22:00', '07:00') && !rem.inQuietHours('07:00', '22:00', '07:00'), 'quiet hours may cross midnight');
  assert.throws(() => rem.buildReminderIcs({ ...base, time: '23:00', quietStart: '22:00', quietEnd: '07:00' }, 'https://example.org'), /quiet hours/);
  assert.ok(rem.buildReminderIcs({ ...base, language: 'hi', everyWeeks: 2 }, 'https://example.org', when).includes('INTERVAL=2'));

  /* ── Feedback collector ── */
  const server = await import('../lib/feedback-server');
  const proto = await import('../lib/feedback-protocol');
  const kvData = new Map<string, string>();
  const kv: import('../lib/feedback-server').KV = {
    async get(k) { return kvData.has(k) ? (kvData.get(k) as string) : null; },
    async put(k, v) { kvData.set(k, v); },
    async list({ prefix }) { return { keys: Array.from(kvData.keys()).filter((k) => k.startsWith(prefix ?? '')).map((name) => ({ name })), list_complete: true }; },
  };
  const env = { FEEDBACK: kv, EDITORIAL_TOKEN: 'editor-secret' };
  const post = (body: unknown, raw?: string) => server.handleFeedback(new Request('https://x.test/api/feedback', { method: 'POST', body: raw ?? JSON.stringify(body), headers: { 'user-agent': 'secret-agent', cookie: 'sid=1' } }), env);
  assert.equal((await post({ refKey: 'bhagavadgita:2:47', rating: 'partly', reasons: ['language', 'long', 'not-a-reason'], note: 'free text' })).status, 204);
  assert.equal((await post({ refKey: 'bhagavadgita:2:47', rating: 'yes', reasons: ['language'] })).status, 204);
  assert.equal((await post({ refKey: 'bhagavadgita:2:47', rating: 'no' })).status, 204);
  assert.equal((await post({ refKey: '../etc/passwd', rating: 'yes' })).status, 400, 'bad reference refused');
  assert.equal((await post({ refKey: 'bhagavadgita:2:47', rating: 'maybe' })).status, 400, 'bad rating refused');
  assert.equal((await post(null, 'not json')).status, 400);
  assert.equal((await post(null, 'x'.repeat(5000))).status, 413, 'oversized body refused');
  assert.equal((await server.handleFeedback(new Request('https://x.test/api/feedback', { method: 'POST', body: '{}' }), {})).status, 503, 'unconfigured collector says so');
  assert.deepEqual(Array.from(kvData.keys()).sort(), ['fb:bhagavadgita:2:47:r:no', 'fb:bhagavadgita:2:47:r:partly', 'fb:bhagavadgita:2:47:r:yes', 'fb:bhagavadgita:2:47:w:language', 'fb:bhagavadgita:2:47:w:long'], 'only counters are stored; reasons on a Yes are dropped');
  assert.ok(!Array.from(kvData.values()).some((v) => !/^\d+$/.test(v)), 'stored values are plain counts');
  const read = (token?: string, e = env) => server.handleFeedback(new Request('https://x.test/api/feedback', { method: 'GET', headers: token ? { 'x-editorial-token': token } : {} }), e);
  assert.equal((await read()).status, 401);
  assert.equal((await read('wrong')).status, 401);
  assert.equal((await read('editor-secret', { FEEDBACK: kv })).status, 404, 'no token configured means no read endpoint');
  const ok = await read('editor-secret');
  assert.equal(ok.status, 200);
  const data = (await ok.json()) as { verses: Array<{ refKey: string; yes: number; partly: number; no: number; reasons: Record<string, number> }> };
  assert.deepEqual(data.verses[0], { refKey: 'bhagavadgita:2:47', yes: 1, partly: 1, no: 1, reasons: { language: 1, long: 1 } });
  assert.equal(server.sameToken('abc', 'abc'), true);
  assert.equal(server.sameToken('abc', 'abd'), false);
  assert.equal(server.sameToken('abc', 'abcd'), false);
  assert.equal((await server.handleFeedback(new Request('https://x.test/api/feedback', { method: 'DELETE' }), env)).status, 405);
  assert.equal(proto.isLowClarity({ refKey: 'a:1:1', yes: 2, partly: 2, no: 1, reasons: {} }), true);
  assert.equal(proto.isLowClarity({ refKey: 'a:1:1', yes: 0, partly: 3, no: 0, reasons: {} }), false, 'too few answers to flag');
  assert.equal(proto.isLowClarity({ refKey: 'a:1:1', yes: 8, partly: 1, no: 1, reasons: {} }), false);

  /* ── Start Here ── */
  const sh = await import('../data/start-here');
  const { READING_JOURNEYS } = await import('../data/reading-journeys');
  const { CONCEPT_DETAILS } = await import('../data/concept-details');
  const { wisdomTopics } = await import('../data/wisdom-for-life');
  const { learningPaths } = await import('../data/learning-paths');
  const fsx = await import('node:fs');
  const answersList: Array<import('../data/start-here').StartAnswers> = [];
  for (const interest of ['gita', 'upanishads', 'karma', 'bhakti', 'daily', 'sanskrit', 'life', 'unsure'] as const)
    for (const familiarity of ['new', 'some', 'regular', 'serious'] as const)
      for (const time of ['5', '10', '20', 'deep'] as const) answersList.push({ interest, familiarity, language: 'both', time });
  for (const a of answersList) {
    const recs = sh.recommend(a);
    assert.ok(recs.length >= 1 && recs.length <= 3, 'one to three suggestions');
    assert.equal(new Set(recs.map((r) => r.path.id)).size, recs.length, 'no duplicates');
    for (const r of recs) {
      assert.ok(r.reason.length > 10, 'every suggestion says why');
      assert.ok(!/true spiritual path|your destiny|you must/i.test(r.reason + r.path.summary), 'no presumptuous wording');
    }
  }
  const routeOk = (href: string) => {
    let m = /^\/learn\/journeys\/([^/]+)\/?$/.exec(href);
    if (m) return READING_JOURNEYS.some((j) => j.id === m![1]);
    m = /^\/concepts\/([^/]+)$/.exec(href);
    if (m) return Boolean(CONCEPT_DETAILS[m[1]]);
    m = /^\/learn\/([^/]+)$/.exec(href);
    if (m) return learningPaths.some((p) => p.id === m![1]);
    m = /^\/wisdom-for-life\/([^/]+)$/.exec(href);
    if (m) return wisdomTopics.some((t) => t.slug === m![1]);
    m = /^\/scripture\/([^/]+)\/chapter\/(\d+)(?:\/verse\/(\d+))?$/.exec(href);
    if (m) return fsx.existsSync('public/data/scriptures-full/' + m[1] + '/ch-' + m[2] + '.json');
    return fsx.existsSync('app' + href);
  };
  for (const p of Object.values(sh.START_PATHS)) for (const href of [p.href, ...p.steps.map((x) => x.href)]) assert.ok(routeOk(href), 'start path link resolves: ' + href);

  /* ── Review badges ── */
  const rb = await import('../lib/review-badges');
  const badgeBase: import('../lib/review-badges').BadgeInput = { scriptureId: 'bhagavadgita', chapter: 2, verse: 47, hasEditorial: true, records: [] };
  assert.deepEqual(rb.badgesFor(badgeBase).map((b) => b.id), ['editorial-explanation', 'draft'], 'with no recorded review only Editorial explanation and Draft appear');
  assert.deepEqual(rb.badgesFor({ ...badgeBase, hasEditorial: false }).map((b) => b.id), [], 'nothing is claimed for a verse with no explanation and no review');
  const rec = (kind: 'source' | 'translation' | 'commentary' | 'editorial', over: Partial<import('../lib/review-badges').ReviewRecord> = {}): import('../lib/review-badges').ReviewRecord => ({ scope: { scriptureId: 'bhagavadgita', chapter: 2, verse: 47 }, kind, reviewer: 'A. Editor', date: '2026-10-08', ...over });
  const got = rb.badgesFor({ ...badgeBase, records: [rec('source'), rec('translation'), rec('commentary'), rec('editorial')] });
  assert.deepEqual(got.map((b) => b.id), ['source-verified', 'translation-reviewed', 'commentary-reviewed', 'editorial-explanation'], 'recorded reviews earn their badges and remove Draft');
  assert.ok(got[0].detail?.includes('A. Editor') && got[0].detail?.includes('2026-10-08'), 'a reviewed badge names reviewer and date');
  assert.deepEqual(rb.badgesFor({ ...badgeBase, records: [rec('source', { reviewer: ' ' }), rec('translation', { date: 'yesterday' })] }).map((b) => b.id), ['editorial-explanation', 'draft'], 'a record without a reviewer or a valid date earns nothing');
  assert.deepEqual(rb.badgesFor({ ...badgeBase, records: [rec('source', { scope: { scriptureId: 'bhagavadgita', chapter: 3 } })] }).map((b) => b.id), ['editorial-explanation', 'draft'], 'a review of another chapter does not apply');
  assert.ok(rb.badgesFor({ ...badgeBase, records: [rec('source', { scope: { scriptureId: 'bhagavadgita' } })] }).some((b) => b.id === 'source-verified'), 'a whole-scripture review covers each verse');
  assert.ok(rb.badgesFor({ ...badgeBase, corrections: [{ scope: { scriptureId: 'bhagavadgita', chapter: 2, verse: 47 } }] }).some((b) => b.id === 'correction-pending'));
  assert.ok(!rb.badgesFor({ ...badgeBase, corrections: [{ scope: { scriptureId: 'bhagavadgita', chapter: 2, verse: 48 } }] }).some((b) => b.id === 'correction-pending'));
  const recordsMod = await import('../data/review-records');
  assert.ok(recordsMod.REVIEW_RECORDS.every(rb.isValidRecord), 'every recorded review names a reviewer and a valid date');

  const sc = await import('../lib/saved-concepts');
  const cs = new MemoryStorage();
  assert.deepEqual(sc.readSavedConcepts(cs), []);
  assert.deepEqual(sc.toggleSavedConcept('karma', cs), ['karma']);
  assert.deepEqual(sc.toggleSavedConcept('jnana', cs), ['karma', 'jnana']);
  assert.deepEqual(sc.toggleSavedConcept('karma', cs), ['jnana'], 'saving again removes it');
  assert.deepEqual(sc.toggleSavedConcept('../bad id', cs), ['jnana'], 'an invalid id changes nothing');
  cs.setItem(sc.SAVED_CONCEPTS_KEY, JSON.stringify(['yoga', 'yoga', 7, 'bad id!', null]));
  assert.deepEqual(sc.readSavedConcepts(cs), ['yoga'], 'duplicates and malformed entries are dropped on read');
  assert.equal(rb.reviewStatusForHref('/scripture/bhagavadgita/chapter/2/verse/47/', []), 'Not yet reviewed');
  assert.equal(rb.reviewStatusForHref('/concepts/karma', []), 'Not yet reviewed');
  assert.equal(rb.reviewStatusForHref('/scripture/bhagavadgita/chapter/2/verse/47/', [rec('translation')]), 'Reviewed 2026-10-08', 'a recorded review shows its date in search results');

  console.log('release1: all assertions passed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
