/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-links. Base: cards (no images variant).
 * Source: https://www.cooley.com/services/practice/corporate
 * Generated: 2026-09-18
 *
 * Structure (from metadata + library "Cards (no images)" convention):
 *   1 column, multiple rows. Each row = one card.
 *   Each card cell holds a single title link (h3.item-title > a). No images.
 *
 * The source renders links in chunked `ul.items` lists; the block element is a
 * `ul.items` and each `li.item` is one card. The parser also tolerates being
 * handed a wrapper containing the items.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Collect the link items. Prefer direct list children; fall back to any
  // `.item` descendants (the element may be a wrapper around one or more
  // chunked `ul.items` lists). Only fall back to `.item-title` when no `.item`
  // exists, so a wrapper never double-counts an item and its inner title.
  let items = element.querySelectorAll(':scope > .item, :scope > li');
  if (!items.length) {
    items = element.querySelectorAll('.item');
  }
  if (!items.length) {
    items = element.querySelectorAll('.item-title');
  }

  items.forEach((item) => {
    // Preserve the heading + link semantics. Use the title heading if present,
    // otherwise fall back to the link itself.
    const title = item.querySelector('.item-title, h1, h2, h3, h4, h5, h6') || item.querySelector('a') || item;
    if (title) cells.push([title]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-links', cells });
  element.replaceWith(block);
}
