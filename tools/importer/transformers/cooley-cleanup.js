/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: cooley.com site-wide cleanup.
 * Removes non-authorable site chrome (header, hamburger menu, footer, search
 * overlays, cookie consent, branded formation videos) so the import contains
 * only page-level authorable content.
 *
 * ALL selectors verified in migration-work/cleaned.html:
 *   - header.site-header ...................... L10  (global site header)
 *   - .site-header-search ..................... L23  (Coveo search overlay in header)
 *   - section.hamburger-menu .................. L92  (mobile/hamburger nav overlay)
 *   - .hamburger-menu-search .................. L153 (Coveo search in hamburger menu)
 *   - footer.site-footer ...................... L500 (global site footer + alerts signup)
 *   - a.skiplink .............................. L6   (a11y skip link)
 *   - .formations ............................. L18/217/511 (branded animated <video> decorations)
 *   - #onetrust-consent-sdk ................... L620 (cookie banner)
 *   - #onetrust-pc-sdk ........................ L652 (cookie preference center)
 *   - .js-blocker ............................. L602 (menu/search overlay blocker)
 *   - .CoveoForSitecoreContext ................ L612 (search resources placeholder)
 *
 * NOTE: bare `header`, `nav`, `article`, `section` are intentionally NOT used:
 * the authorable hero is <header class="hero hero-secondary"> and authorable
 * sections are <article> / <nav>, so only specific chrome classes are targeted.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / consent / search that could interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-pc-sdk',
      '.js-blocker',
      '.site-header-search',
      '.hamburger-menu-search',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome.
    WebImporter.DOMUtils.remove(element, [
      'header.site-header',
      'section.hamburger-menu',
      'footer.site-footer',
      'a.skiplink',
      '.formations',
      '.CoveoForSitecoreContext',
    ]);

    // Leftover non-content elements safe to strip site-wide.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'iframe',
      'input',
    ]);
  }
}
