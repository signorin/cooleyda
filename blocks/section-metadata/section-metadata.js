/**
 * Section Metadata block.
 *
 * This project's vendored scripts/aem.js does not consume `.section-metadata`
 * natively in decorateSections, so this block reads the key/value rows, applies
 * recognised metadata to the enclosing section, and removes itself.
 *
 * Supported keys:
 *   - style: space-separated class tokens added to the parent section
 *     (e.g. "grey", "dark", "highlight").
 */
export default function decorate(block) {
  const section = block.closest('.section');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (!key || !value) return;

    if (key === 'style' && section) {
      value.split(',').forEach((part) => {
        part.trim().split(/\s+/).forEach((token) => {
          if (token) section.classList.add(token.toLowerCase());
        });
      });
    }
  });

  block.remove();
}
