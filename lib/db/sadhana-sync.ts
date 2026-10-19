/**
 * Compressed Zero-Server Sadhana Sync & Portability Engine
 * 
 * Uses native Web CompressionStream('gzip') + Base64URL encoding to pack
 * the reader's entire sadhana practice state into a compact, copy-pasteable
 * string ("Sadhana Sync String") or offline .dharma backup file.
 *
 * Preserves zero-account identity and zero-server privacy.
 */

import { getAllMananaItems, saveMananaItem, type StoredMananaItem } from './granth-indexeddb';

export interface SadhanaSyncPayload {
  version: 1;
  exportedAt: string;
  source: 'dharmagranth.in';
  localStorageState: Record<string, string>;
  mananaState: StoredMananaItem[];
}

const SYNC_PREFIX = 'DG-SYNC-v1-';

// Known localStorage keys tracking sadhana, reading, contemplation, and settings
const DHARMA_LOCALSTORAGE_KEYS = [
  'dharma.bookmarkedVerses',
  'dharma.readingHistory',
  'dharma-bookmarks-v1',
  'dharma-history-v1',
  'dharma-theme',
  'dharma_study_notes',
  'dharma_study_highlights',
  'dharma_study_progress',
  'dharma_japa_count',
  'dharma_japa_history',
  'dharma_japa_mantra',
  'dharma_meditation_history',
  'dharma_meditation_last_minutes',
  'dharma_sadhana_streak',
  'dharma_verse_collections',
  'dharma_reading_plans',
  'dharma_reader_layers',
  'dharma_reader_fontsize',
  'dharma-search-recent-v2',
  'dharma_ashtavakra_progress',
];

/**
 * ArrayBuffer / Uint8Array to Base64URL conversion (URL and QR friendly).
 */
function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof btoa !== 'undefined' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64URL string to Uint8Array conversion.
 */
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = typeof atob !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Gzip compress string payload using Web CompressionStream or fallback.
 */
async function compressData(jsonString: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(jsonString);

  if (typeof CompressionStream !== 'undefined') {
    try {
      const cs = new CompressionStream('gzip');
      const writer = cs.writable.getWriter();
      writer.write(rawBytes);
      writer.close();
      const compressedResponse = new Response(cs.readable);
      const arrayBuffer = await compressedResponse.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch {
      // Fallback to uncompressed if stream fails
    }
  }

  return rawBytes;
}

/**
 * Gzip decompress bytes payload using Web DecompressionStream or fallback.
 */
async function decompressData(bytes: Uint8Array): Promise<string> {
  // Check if starts with gzip magic number (0x1F, 0x8B)
  const isGzip = bytes[0] === 0x1f && bytes[1] === 0x8b;

  if (isGzip && typeof DecompressionStream !== 'undefined') {
    try {
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      writer.write(bytes as unknown as BufferSource);
      writer.close();
      const decompressedResponse = new Response(ds.readable);
      return await decompressedResponse.text();
    } catch {
      // Fallback to direct decoding
    }
  }

  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Collect all relevant localStorage items and user_manana items into a SadhanaSyncPayload.
 */
export async function collectSadhanaPayload(): Promise<SadhanaSyncPayload> {
  const localStorageState: Record<string, string> = {};

  if (typeof window !== 'undefined' && window.localStorage) {
    // Collect known keys plus any custom dharma_ keys
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && (key.startsWith('dharma') || DHARMA_LOCALSTORAGE_KEYS.includes(key))) {
        const val = window.localStorage.getItem(key);
        if (val !== null) {
          localStorageState[key] = val;
        }
      }
    }
  }

  let mananaState: StoredMananaItem[] = [];
  try {
    mananaState = await getAllMananaItems();
  } catch {
    mananaState = [];
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: 'dharmagranth.in',
    localStorageState,
    mananaState,
  };
}

/**
 * Generate a compressed, Base64URL-encoded Sadhana Sync String.
 * Format: DG-SYNC-v1-<base64url>
 */
export async function generateSadhanaSyncString(): Promise<string> {
  const payload = await collectSadhanaPayload();
  const jsonStr = JSON.stringify(payload);
  const compressed = await compressData(jsonStr);
  const b64Url = uint8ArrayToBase64Url(compressed);
  return `${SYNC_PREFIX}${b64Url}`;
}

/**
 * Restore user state from a Sadhana Sync String.
 */
export async function restoreSadhanaFromSyncString(
  syncString: string
): Promise<{ success: boolean; itemCount: number; message: string }> {
  try {
    const trimmed = syncString.trim();
    if (!trimmed.startsWith(SYNC_PREFIX)) {
      throw new Error('Invalid format: Sync string must start with DG-SYNC-v1-');
    }

    const b64Url = trimmed.slice(SYNC_PREFIX.length);
    const bytes = base64UrlToUint8Array(b64Url);
    const jsonStr = await decompressData(bytes);
    const payload = JSON.parse(jsonStr) as SadhanaSyncPayload;

    if (payload.version !== 1 || !payload.localStorageState) {
      throw new Error('Incompatible backup payload version');
    }

    let restoredCount = 0;

    // 1. Restore localStorage items
    if (typeof window !== 'undefined' && window.localStorage) {
      for (const [key, value] of Object.entries(payload.localStorageState)) {
        window.localStorage.setItem(key, value);
        restoredCount++;
      }
    }

    // 2. Restore user_manana items into IndexedDB
    if (Array.isArray(payload.mananaState)) {
      for (const item of payload.mananaState) {
        await saveMananaItem(item);
        restoredCount++;
      }
    }

    // Dispatch reload events
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dharma-bookmark-updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return {
      success: true,
      itemCount: restoredCount,
      message: `सफलतापूर्वक ${restoredCount} साधना रिकॉर्ड पुनर्स्थापित किए गए।`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      itemCount: 0,
      message: `सिंक कोड पढ़ने में त्रुटि: ${msg}`,
    };
  }
}

/**
 * Export sadhana backup as a downloadable `.dharma` file (gzipped binary).
 */
export async function exportDharmaBackupFile(): Promise<{ blob: Blob; filename: string }> {
  const payload = await collectSadhanaPayload();
  const jsonStr = JSON.stringify(payload, null, 2);
  const compressed = await compressData(jsonStr);
  const blob = new Blob([compressed as unknown as BlobPart], { type: 'application/octet-stream' });
  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `dharmagranth-sadhana-${dateStr}.dharma`;
  return { blob, filename };
}

/**
 * Import a `.dharma` file (either raw JSON or compressed binary).
 */
export async function importDharmaBackupFile(
  fileData: ArrayBuffer | string
): Promise<{ success: boolean; itemCount: number; message: string }> {
  try {
    let jsonStr: string;

    if (typeof fileData === 'string') {
      // Check if it's already a JSON string or a sync string
      if (fileData.trim().startsWith(SYNC_PREFIX)) {
        return restoreSadhanaFromSyncString(fileData);
      }
      jsonStr = fileData;
    } else {
      const bytes = new Uint8Array(fileData);
      jsonStr = await decompressData(bytes);
    }

    const payload = JSON.parse(jsonStr) as SadhanaSyncPayload;
    if (payload.version !== 1 || !payload.localStorageState) {
      throw new Error('Invalid .dharma backup file');
    }

    let restoredCount = 0;
    if (typeof window !== 'undefined' && window.localStorage) {
      for (const [key, value] of Object.entries(payload.localStorageState)) {
        window.localStorage.setItem(key, value);
        restoredCount++;
      }
    }

    if (Array.isArray(payload.mananaState)) {
      for (const item of payload.mananaState) {
        await saveMananaItem(item);
        restoredCount++;
      }
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dharma-bookmark-updated'));
      window.dispatchEvent(new Event('storage'));
    }

    return {
      success: true,
      itemCount: restoredCount,
      message: `सफलतापूर्वक .dharma फ़ाइल से ${restoredCount} रिकॉर्ड आयात किए गए।`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      success: false,
      itemCount: 0,
      message: `फ़ाइल आयात करने में त्रुटि: ${msg}`,
    };
  }
}
