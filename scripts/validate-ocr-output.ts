/**
 * npm run ocr:validate -- --slug "shiv-purana"
 * Scores completed OCR. It does not re-read the page or change the text.
 */
import { runGranthOcr } from './ocr-python';

const args = process.argv.slice(2);
const known = args[0] === 'report' || args[0] === 'export' || args[0] === 'audit';
const command = known ? args : ['audit', ...args];
runGranthOcr(command);
