/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: cooley.com section breaks + Section Metadata.
 *
 * Inserts an <hr> before every non-first section and a Section Metadata block
 * after every section that declares a `style`. Section boundaries come from
 * payload.template.sections[].selector (from page-templates.json / page analysis).
 *
 * Section selectors verified in migration-work/cleaned.html:
 *   - .hero.hero-secondary .... L213  (first section — no leading break)
 *   - .secondary-nav .......... L224
 *   - .intro-text-panel ....... L264
 *   - .sticky-text-list ....... L273
 *   - .card-up ................ L291
 *   - .related-services ....... L326
 *   - .rich-text.-disclaimer .. L493  (style: grey — gets Section Metadata)
 *   - .alerts-signup .......... NOT PRESENT in DOM. This "section" is the global
 *       footer signup (footer.site-footer > .site-footer-top, L500-507), which is
 *       non-authorable and stripped by cooley-cleanup.js. No element matches, so
 *       per the reference we skip it rather than guess a replacement. As a result
 *       the actual <hr> count is one fewer than sections.length - 1.
 *
 * Uses both hooks: breaks are inserted in beforeTransform (while every section
 * element still exists, before block parsers replace them) with a marker <hr>
 * anchoring styled-section metadata inserted in afterTransform.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// section.selector is an array of candidate selectors — try each in order, first match wins.
function querySection(root, selectors) {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = payload.template.sections || [];

  if (hookName === 'beforeTransform') {
    // Insert breaks now, before parsers can replace any section element.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (i === 0 && !section.style) continue; // first section: no break, no metadata needed
      const sectionEl = querySection(element, section.selector);
      if (!sectionEl) continue; // no selector matched on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // Parsers have now run and may have replaced section elements. Anchor each
    // styled section's Section Metadata block to whichever still exists: the
    // marker <hr> placed above, or (first section, no marker inserted) the
    // original element itself.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || querySection(element, section.selector);
      if (!anchor) continue; // neither survived — no selector matched post-parse; skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // section 0 never gets a real leading break
      }
    }
  }
}
