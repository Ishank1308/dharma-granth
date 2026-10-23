import assert from 'node:assert/strict';
import fs from 'node:fs';
import { READING_JOURNEYS, isJourneyIndexable } from '../data/reading-journeys';

const journeyIndexPage = fs.readFileSync('app/learn/journeys/page.tsx', 'utf8');
const journeyDetailPage = fs.readFileSync('app/learn/journeys/[id]/page.tsx', 'utf8');
const journeyListingClient = fs.readFileSync('app/learn/journeys/JourneysClient.tsx', 'utf8');
const journeyReader = fs.readFileSync('app/learn/journeys/[id]/JourneyClient.tsx', 'utf8');
const sitemap = fs.readFileSync('lib/sitemap-sections.ts', 'utf8');
const portability = fs.readFileSync('app/components/SadhanaPortability.tsx', 'utf8');
const generalBackup = fs.readFileSync('app/components/BackupRestore.tsx', 'utf8');
const privacyBanner = fs.readFileSync('app/components/practice/PrivacyLockBanner.tsx', 'utf8');
const siteFooter = fs.readFileSync('app/components/SiteFooter.tsx', 'utf8');
const dailyStudyHub = fs.readFileSync('app/components/daily/DailyDharmaDashboard.tsx', 'utf8');

assert.ok(READING_JOURNEYS.length > 0);
for (const journey of READING_JOURNEYS) {
  assert.equal(isJourneyIndexable(journey), journey.review === 'approved', journey.id);
}

const stressStudy = READING_JOURNEYS.find((journey) => journey.id === 'stress-and-anxiety-relief');
assert.ok(stressStudy);
assert.equal(stressStudy.review, 'draft');
assert.match(stressStudy.title, /Gita Study/);
assert.doesNotMatch(`${stressStudy.title} ${stressStudy.objective} ${stressStudy.audience}`, /relief|overcoming panic|emotional healing/i);
assert.ok(stressStudy.lessons.every((lesson) => lesson.scriptureId === 'bhagavadgita'));
assert.equal(stressStudy.related.some((item) => item.href === '/wisdom-for-life/fear-and-courage'), true);
assert.equal(stressStudy.related.some((item) => item.href === '/wisdom-for-life/fear-and-anxiety'), false);

assert.match(journeyDetailPage, /robots:\s*\{\s*index:\s*isJourneyIndexable\(j\),\s*follow:\s*true\s*\}/);
assert.match(journeyIndexPage, /robots:\s*\{\s*index:\s*READING_JOURNEYS\.some\(isJourneyIndexable\),\s*follow:\s*true\s*\}/);
assert.match(sitemap, /\.filter\(isJourneyIndexable\)/);
assert.match(journeyListingClient, /REVIEW_LABEL\[j\.review\]/);
assert.match(journeyReader, /REVIEW_LABEL\[journey\.review\]/);
assert.match(journeyReader, /Pause or leave this reading/);
assert.match(journeyReader, /Clear read markers/);
assert.doesNotMatch(journeyListingClient, /useSadhanaStreak|currentStreak|Personalized Next Step|Trophy|percent%/);
assert.doesNotMatch(journeyReader, /useSadhanaStreak|currentStreak|percentComplete|Pathway Completed|Trophy/);
assert.match(portability, /not encrypted/i);
assert.doesNotMatch(portability, /fully encrypted|completely encrypted|पूर्णतः एन्क्रिप्टेड/i);
assert.match(generalBackup, /readable and not encrypted/i);
assert.match(privacyBanner, /does not encrypt browser storage or backup files/i);
assert.doesNotMatch(`${privacyBanner} ${siteFooter} ${dailyStudyHub}`, /zero tracking|100% private|completely private/i);
assert.doesNotMatch(dailyStudyHub, /Recommended Next Teaching|Calm progress|reviewed verse|reviewed topics/i);

console.log(`journey-wellbeing: ${READING_JOURNEYS.length} journeys, review indexing, privacy copy, private markers, and non-prescriptive navigation validated.`);
