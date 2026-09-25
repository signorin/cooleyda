export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-sticky-${cols.length}-cols`);

  // Tag the columns so the first (heading) column can be made sticky and the
  // remaining column(s) hold the body copy. Authors may omit or add cells, so
  // decorate defensively off whatever rows/cols are present.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col, index) => {
      if (index === 0) {
        col.classList.add('columns-sticky-heading');
      } else {
        col.classList.add('columns-sticky-body');
      }

      // Handle any image cells gracefully (this variant is text-first, but
      // guard so an author-added picture still lays out sensibly).
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-sticky-img-col');
        }
      }
    });
  });
}
