const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

/**
 * Keeps the Android download and install size down. See mobile/README.md ("App size").
 *
 * 1. Scripture text ships as compressed APK assets instead of inside the Hermes JS bundle, which the APK
 *    stores uncompressed. scripts/build-content.mjs writes them to src/content/generated/assets/, and this
 *    adds that folder to the app's asset folders, so a fresh `npm run content` is picked up by the next
 *    Gradle build without another prebuild. src/content/bundled-assets.ts reads them.
 * 2. Only ARM builds. Phones and tablets are ARM; x86 builds only served emulators and a few Chromebooks,
 *    which run ARM apps too. Play serves each phone only its own ABI, so this mostly shrinks the .aab.
 * 3. Android resource shrinking on top of R8, which drops library resources nothing references.
 * 4. No Fresco GIF or WebP decoders. The app shows no GIFs, and Android decodes static WebP itself
 *    (minSdk 24), so those two native libraries were dead weight.
 */
const ASSET_DIR = '$rootDir/../src/content/generated/assets';
const MARKER = '// with-smaller-android: bundled scripture assets';

const PROPS = {
  reactNativeArchitectures: 'armeabi-v7a,arm64-v8a',
  'android.enableShrinkResourcesInReleaseBuilds': 'true',
  'expo.gif.enabled': 'false',
  'expo.webp.enabled': 'false',
  'expo.webp.animated': 'false',
};

module.exports = function withSmallerAndroid(config) {
  config = withGradleProperties(config, (cfg) => {
    for (const [key, value] of Object.entries(PROPS)) {
      const existing = cfg.modResults.find((p) => p.type === 'property' && p.key === key);
      if (existing) existing.value = value;
      else cfg.modResults.push({ type: 'property', key, value });
    }
    return cfg;
  });
  return withAppBuildGradle(config, (cfg) => {
    if (!cfg.modResults.contents.includes(MARKER)) {
      cfg.modResults.contents += `
${MARKER}
android {
    sourceSets {
        main {
            assets.srcDirs += ["${ASSET_DIR}"]
        }
    }
}
`;
    }
    return cfg;
  });
};
