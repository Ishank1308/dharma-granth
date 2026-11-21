const { withAndroidManifest } = require('expo/config-plugins');

/**
 * `"orientation": "portrait"` makes Android infer a *required*
 * android.hardware.screen.portrait feature, so Google Play hides the app from
 * devices that lack it (some tablets, Chromebooks, Android XR) and flags it
 * before review. The activity still asks for portrait; this only declares the
 * feature optional so Play stops filtering on it.
 */
module.exports = function withOptionalPortrait(config) {
  return withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest['uses-feature'] = manifest['uses-feature'] ?? [];
    const name = 'android.hardware.screen.portrait';
    const existing = manifest['uses-feature'].find((f) => f.$?.['android:name'] === name);
    if (existing) existing.$['android:required'] = 'false';
    else manifest['uses-feature'].push({ $: { 'android:name': name, 'android:required': 'false' } });
    return cfg;
  });
};
