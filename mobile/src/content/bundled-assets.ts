/**
 * Reads scripture JSON that ships inside the Android APK as compressed assets
 * (src/content/generated/assets/content/…, added to the APK by plugins/with-smaller-android.js).
 *
 * The text used to be require()d into the Hermes JS bundle. That bundle is stored uncompressed in the APK,
 * so every bundled verse cost its full size on the phone; as deflated assets the same text takes about a
 * third of the space. Only the generated *.android.ts loader maps import this file.
 */
import { File } from 'expo-file-system';

export function readBundledJson<T>(path: string): T {
  return JSON.parse(new File(`asset:///content/${path}`).textSync()) as T;
}
