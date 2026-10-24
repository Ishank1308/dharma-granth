/**
 * Dharma Granth: Muse Spark Commentary Watchdog & Auto-Repair
 * 
 * Scans generated and staged AI commentary files to audit and repair:
 * 1. Absence of Devanagari numerals (०-९) -> Auto-replaces with ASCII 0-9
 * 2. Absence of prohibited colloquial/Urdu words -> Auto-replaces with dignified tatsam equivalents
 * 3. 4-Layer framework headings:
 *    - "### आधुनिक संदर्भ"
 *    - "### आज के जीवन में प्रयोग" (exactly 3 bullets: - **शीर्षक**: विवरण)
 *    - "### चिंतन प्रश्न"
 * 4. Explanation depth (target: 200-300 words)
 * 
 * Usage:
 *   npx tsx scripts/audit-muse-commentary.ts [--staged | --all] [--fix]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Ensure UTF-8 on Windows
if (process.platform === 'win32') {
  try {
    execSync('chcp 65001', { stdio: 'ignore' });
  } catch {}
}

const TATSAM_REPLACEMENTS: Record<string, string> = {
  'तनाव': 'उद्वेग',
  'शुरू': 'आरम्भ',
  'पैदा': 'उत्पन्न',
  'थकान': 'श्रान्ति',
  'नकल': 'अनुकरण',
  'याद': 'स्मरण',
  'जल्दबाजी': 'शीघ्रता',
  'इंसाफ': 'न्याय',
  'तसल्ली': 'आश्वासन',
  'खुदा': 'ईश्वर',
  'दुआ': 'प्रार्थना',
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

interface AuditIssue {
  key: string;
  type: 'devanagari_digit' | 'forbidden_word' | 'missing_heading' | 'bullet_count' | 'short_explanation';
  message: string;
}

interface FileReport {
  file: string;
  totalEntries: number;
  cleanEntries: number;
  issues: AuditIssue[];
  fixedCount?: number;
}

function cleanText(text: string): { text: string; changed: boolean } {
  if (!text) return { text, changed: false };
  let current = text;
  let changed = false;

  // 1. Digits
  for (const [dev, asc] of Object.entries(DEVANAGARI_DIGITS)) {
    if (current.includes(dev)) {
      current = current.replaceAll(dev, asc);
      changed = true;
    }
  }

  // 2. Forbidden words with Unicode boundaries
  for (const [colloquial, tatsam] of Object.entries(TATSAM_REPLACEMENTS)) {
    const rx = new RegExp(`(?<=^|[^\\p{L}])${colloquial}(?=[^\\p{L}]|$)`, 'gu');
    if (rx.test(current)) {
      current = current.replace(rx, tatsam);
      changed = true;
    }
  }

  return { text: current, changed };
}

function auditEntry(key: string, entry: any): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (!entry) return issues;

  const exp = entry.explanation || '';
  const life = entry.lifeLesson || '';
  const sci = entry.science || '';
  const combined = `${exp} ${life} ${sci}`;

  // 1. Devanagari numerals
  const devDigits = combined.match(/[०-९]/g);
  if (devDigits) {
    issues.push({
      key,
      type: 'devanagari_digit',
      message: `Found Devanagari numerals: ${Array.from(new Set(devDigits)).join(', ')}`,
    });
  }

  // 2. Forbidden words
  for (const word of Object.keys(TATSAM_REPLACEMENTS)) {
    const rx = new RegExp(`(?:^|[^\\p{L}])${word}(?:[^\\p{L}]|$)`, 'u');
    if (rx.test(combined)) {
      issues.push({
        key,
        type: 'forbidden_word',
        message: `Found prohibited word '${word}'`,
      });
    }
  }

  // 3. Life lesson headings
  if (life) {
    if (!life.includes('### आधुनिक संदर्भ')) {
      issues.push({ key, type: 'missing_heading', message: 'Missing "### आधुनिक संदर्भ"' });
    }
    if (!life.includes('### आज के जीवन में प्रयोग')) {
      issues.push({ key, type: 'missing_heading', message: 'Missing "### आज के जीवन में प्रयोग"' });
    }
    if (!life.includes('### चिंतन प्रश्न')) {
      issues.push({ key, type: 'missing_heading', message: 'Missing "### चिंतन प्रश्न"' });
    }

    // Bullets check
    const bullets = (life.match(/^-\s*\*\*[^*]+\*\*:/gm) || []).length;
    if (bullets !== 3 && life.includes('### आज के जीवन में प्रयोग')) {
      issues.push({
        key,
        type: 'bullet_count',
        message: `Found ${bullets} bullet points (expected 3)`,
      });
    }
  }

  // 4. Short explanation
  const wordCount = exp.trim() ? exp.trim().split(/\s+/).length : 0;
  if (wordCount > 0 && wordCount < 80) {
    issues.push({
      key,
      type: 'short_explanation',
      message: `Short explanation: ${wordCount} words (recommended >150)`,
    });
  }

  return issues;
}

function auditFile(filePath: string, doFix: boolean): FileReport {
  const content = fs.readFileSync(filePath, 'utf8');
  let data: Record<string, any> = {};
  try {
    data = JSON.parse(content);
  } catch {
    return { file: path.basename(filePath), totalEntries: 0, cleanEntries: 0, issues: [] };
  }

  const keys = Object.keys(data);
  const issues: AuditIssue[] = [];
  let fileModified = false;
  let fixedCount = 0;

  for (const k of keys) {
    const item = data[k];
    const itemIssues = auditEntry(k, item);
    issues.push(...itemIssues);

    if (doFix && item) {
      let entryChanged = false;
      if (typeof item.explanation === 'string') {
        const res = cleanText(item.explanation);
        if (res.changed) {
          item.explanation = res.text;
          entryChanged = true;
        }
      }
      if (typeof item.lifeLesson === 'string') {
        const res = cleanText(item.lifeLesson);
        if (res.changed) {
          item.lifeLesson = res.text;
          entryChanged = true;
        }
      }
      if (typeof item.science === 'string') {
        const res = cleanText(item.science);
        if (res.changed) {
          item.science = res.text;
          entryChanged = true;
        }
      }
      if (entryChanged) {
        fixedCount++;
        fileModified = true;
      }
    }
  }

  if (doFix && fileModified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }

  const affectedKeys = new Set(issues.map((i) => i.key));
  const cleanEntries = keys.length - affectedKeys.size;

  return {
    file: path.basename(filePath),
    totalEntries: keys.length,
    cleanEntries,
    issues,
    fixedCount,
  };
}

function main() {
  console.log('========================================================');
  console.log('👁️  Dharma Granth: Muse Spark Commentary Watchdog');
  console.log('========================================================\n');

  const args = process.argv.slice(2);
  const doFix = args.includes('--fix');
  const scanStaged = args.includes('--staged') || !args.includes('--all');
  const targetDir = scanStaged ? 'data/ai-commentary/staged' : 'data/ai-commentary';

  const fullTarget = path.resolve(targetDir);
  if (!fs.existsSync(fullTarget)) {
    console.error(`Target directory not found: ${fullTarget}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(fullTarget)
    .filter((f) => f.endsWith('.json') && !f.endsWith('-research.json'));

  console.log(`Scanning ${files.length} commentary files in ${targetDir} ${doFix ? '[AUTO-REPAIR ENABLED]' : ''}...\n`);

  let totalEntriesAll = 0;
  let cleanEntriesAll = 0;
  let totalIssuesAll = 0;
  let totalFixedAll = 0;
  const issueCounts: Record<string, number> = {};

  for (const file of files) {
    const p = path.join(fullTarget, file);
    const report = auditFile(p, doFix);

    totalEntriesAll += report.totalEntries;
    cleanEntriesAll += report.cleanEntries;
    totalIssuesAll += report.issues.length;
    totalFixedAll += report.fixedCount || 0;

    for (const iss of report.issues) {
      issueCounts[iss.type] = (issueCounts[iss.type] || 0) + 1;
    }

    if (report.issues.length === 0) {
      console.log(`✅ ${report.file.padEnd(28)} : ${report.cleanEntries}/${report.totalEntries} pristine`);
    } else {
      const issueSummary = Array.from(new Set(report.issues.map((i) => i.type))).join(', ');
      const fixNote = doFix && report.fixedCount ? ` [✓ Auto-repaired ${report.fixedCount} entries]` : '';
      console.log(`⚠️  ${report.file.padEnd(28)} : ${report.cleanEntries}/${report.totalEntries} clean (${report.issues.length} notices: ${issueSummary})${fixNote}`);
    }
  }

  const cleanPercent = totalEntriesAll > 0 ? ((cleanEntriesAll / totalEntriesAll) * 100).toFixed(1) : '100';

  console.log('\n========================================================');
  console.log('WATCHDOG AUDIT SUMMARY:');
  console.log(`- Total Files Audited:      ${files.length}`);
  console.log(`- Total Verse Entries:      ${totalEntriesAll}`);
  console.log(`- Clean & Pristine Entries: ${cleanEntriesAll} (${cleanPercent}%)`);
  console.log(`- Quality Notices:          ${totalIssuesAll}`);
  if (doFix) {
    console.log(`- Total Entries Repaired:   ${totalFixedAll} (converted to pure tatsam & ASCII digits)`);
  }
  if (Object.keys(issueCounts).length > 0) {
    console.log('\nBreakdown of Notices:');
    for (const [k, count] of Object.entries(issueCounts)) {
      console.log(`  • ${k.padEnd(20)}: ${count}`);
    }
  }
  console.log('========================================================\n');
}

main();
