/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-sticky. Base: columns.
 * Source: https://www.cooley.com/services/practice/corporate
 * Generated: 2026-09-18
 *
 * Structure (from metadata + library description):
 *   Row 1 = 2 columns: [ sticky heading | body paragraphs ]
 *   - Left column: the .intro header heading (h2.title, e.g. "Why Cooley")
 *   - Right column: the .items body copy (wysiwyg paragraphs)
 */
export default function parse(element, { document }) {
  // LEFT COLUMN: sticky heading from the .intro header
  const heading = element.querySelector(
    '.intro .title, .intro h1, .intro h2, header h2, h2.title, [class*="title"]',
  );

  // RIGHT COLUMN: body copy. Prefer the wysiwyg content wrapper(s); fall back to
  // the list items or any paragraphs inside the block.
  const bodyContent = [];
  const wysiwyg = element.querySelectorAll('.items .wysiwyg-content, .items .item .wysiwyg-content');
  if (wysiwyg.length) {
    wysiwyg.forEach((w) => {
      Array.from(w.children).forEach((child) => bodyContent.push(child));
    });
  }
  if (!bodyContent.length) {
    // Fallbacks: list items, then any paragraphs not inside the heading.
    const items = element.querySelectorAll('.items .item');
    if (items.length) {
      items.forEach((li) => bodyContent.push(li));
    } else {
      element.querySelectorAll('p').forEach((p) => {
        if (!heading || !heading.contains(p)) bodyContent.push(p);
      });
    }
  }

  // Empty-block guard: nothing meaningful to place.
  if (!heading && !bodyContent.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([heading || '', bodyContent.length ? bodyContent : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-sticky', cells });
  element.replaceWith(block);
}
