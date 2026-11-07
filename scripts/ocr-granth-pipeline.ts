/**
 * npm run ocr:scan -- --input "./pdfs/book.pdf" --slug "shiv-purana" --pages 1-5 --dpi 300
 * Delegates to the offline Python scanner. It does not rewrite a text layer in place.
 */
import { runGranthOcr } from './ocr-python';

const args = process.argv.slice(2);
const command = args[0] === 'scan' || args[0] === 'report' || args[0] === 'export' ? args : ['scan', ...args];
runGranthOcr(command);
