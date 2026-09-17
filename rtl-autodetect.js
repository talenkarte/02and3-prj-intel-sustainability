/**
 * Auto-detect language direction changes triggered by an in-browser
 * translation tool (e.g. Chrome's built-in "Translate this page", which is
 * powered by Google Translate) and flip the page's `dir` attribute to match.
 *
 * When Chrome translates a page, it adds a "translated-ltr" or
 * "translated-rtl" class to the <html> element depending on the target
 * language's natural direction. We watch for that class change and update
 * `dir` accordingly, then restore this page's own native direction once the
 * translation is turned back off (the translate classes are removed).
 *
 * This does not require embedding a Google Translate widget on the page —
 * it works with the browser's native "Translate this page" feature.
 */
(function () {
  var docEl = document.documentElement;

  // Remember the direction this page was actually authored in (ltr for
  // index.html, rtl for index-ar.html) so we can restore it later.
  var nativeDir = docEl.getAttribute('dir') || 'ltr';
  docEl.setAttribute('data-native-dir', nativeDir);

  function syncDirFromTranslation() {
    var classList = docEl.classList;
    if (classList.contains('translated-rtl')) {
      docEl.setAttribute('dir', 'rtl');
    } else if (classList.contains('translated-ltr')) {
      docEl.setAttribute('dir', 'ltr');
    } else {
      // Translation was turned off (or never happened) — go back to normal.
      docEl.setAttribute('dir', docEl.getAttribute('data-native-dir'));
    }
  }

  var observer = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === 'class') {
        syncDirFromTranslation();
        return;
      }
    }
  });

  observer.observe(docEl, { attributes: true, attributeFilter: ['class'] });
})();