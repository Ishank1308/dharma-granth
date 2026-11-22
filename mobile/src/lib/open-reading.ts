import { router } from 'expo-router';
import { Linking } from 'react-native';

import { getEntry, webUrl } from '@/content/catalog';
import { isDownloaded } from '@/content/downloads';

/** Opens a chapter (optionally at a verse) in the reader, or on the website when the book is not on the phone. */
export function openReading(id: string, chapter: number, verse?: string): void {
  const entry = getEntry(id);
  if (entry && (entry.bundled || isDownloaded(id))) {
    router.push({ pathname: '/scripture/[id]/[chapter]', params: { id, chapter: String(chapter), ...(verse ? { verse } : {}) } });
  } else {
    Linking.openURL(webUrl(id, chapter)).catch(() => {});
  }
}
