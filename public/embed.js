/**
 * Dharma Granth — Sacred Verse of the Day Embed Widget
 * https://dharmagranth.dev
 *
 * Usage:
 *   <div id="dharma-verse-widget"></div>
 *   <script src="https://dharmagranth.dev/embed.js" async></script>
 */
(function () {
  'use strict';
  function init() {
    var targets = document.querySelectorAll('#dharma-verse-widget, [data-dharma-verse-widget]');
    if (!targets || targets.length === 0) return;
    for (var i = 0; i < targets.length; i++) {
      var container = targets[i];
      if (container.getAttribute('data-dharma-initialized') === 'true') continue;
      container.setAttribute('data-dharma-initialized', 'true');

      var iframe = document.createElement('iframe');
      iframe.src = 'https://dharmagranth.dev/embed/verse-of-the-day/';
      iframe.title = 'Dharma Granth — Sacred Verse of the Day';
      iframe.loading = 'lazy';
      iframe.style.width = '100%';
      iframe.style.minHeight = '320px';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.style.borderRadius = '16px';
      iframe.style.boxShadow = '0 4px 20px -2px rgba(0, 0, 0, 0.06)';

      container.innerHTML = '';
      container.appendChild(iframe);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

