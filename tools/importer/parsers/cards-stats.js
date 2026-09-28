/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats. Base: cards (no images variant).
 * Source: https://www.cooley.com/services/practice/corporate
 * Generated: 2026-09-18
 *
 * Structure (from metadata + library "Cards (no images)" convention):
 *   1 column, multiple rows. Each row = one card.
 *   Each card cell holds: oversized ranking heading (e.g. "#1"),
 *   an intro line, and a source citation. No images.
 *
 * The block element is the `ul.items`; each `li.item` is one card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each list item is one card. Fall back to the element itself if no items.
  const items = element.querySelectorAll(':scope > .item, :scope > li');
  const cards = items.length ? Array.from(items) : [element];

  cards.forEach((item) => {
    // Prefer the wysiwyg content wrapper; otherwise use the item's own children.
    const content = item.querySelector('.wysiwyg-content') || item;
    const cardCell = [];
    Array.from(content.children).forEach((child) => cardCell.push(child));
    if (cardCell.length) cells.push([cardCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
