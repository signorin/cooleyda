/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsStickyParser from './parsers/columns-sticky.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsLinksParser from './parsers/cards-links.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/cooley-cleanup.js';
import sectionsTransformer from './transformers/cooley-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'practice',
  description: 'Cooley practice-area detail page (Corporate).',
  urls: [
    'https://www.cooley.com/services/practice/corporate',
  ],
  urlPattern: '/services/practice/*',
  blocks: [
    {
      name: 'columns-sticky',
      instances: ['.sticky-text-list .inner'],
    },
    {
      name: 'cards-stats',
      instances: ['.card-up .items'],
    },
    {
      name: 'cards-links',
      instances: ['.related-services .main'],
    },
  ],
  sections: [
    { id: 'hero', name: 'hero', selector: ['.hero.hero-secondary'], style: null, blocks: [], defaultContent: ['.hero.hero-secondary'] },
    { id: 'secondary-nav', name: 'secondary-nav', selector: ['.secondary-nav'], style: null, blocks: [], defaultContent: ['.secondary-nav'] },
    { id: 'intro-text-panel', name: 'intro-text-panel', selector: ['.intro-text-panel'], style: null, blocks: [], defaultContent: ['.intro-text-panel'] },
    { id: 'sticky-text-list', name: 'sticky-text-list', selector: ['.sticky-text-list'], style: null, blocks: ['columns-sticky'], defaultContent: [] },
    { id: 'card-up', name: 'card-up', selector: ['.card-up'], style: null, blocks: ['cards-stats'], defaultContent: ['.card-up .intro'] },
    { id: 'related-services', name: 'related-services', selector: ['.related-services'], style: null, blocks: ['cards-links'], defaultContent: ['.related-services .intro'] },
    { id: 'disclaimer', name: 'disclaimer', selector: ['.rich-text.-disclaimer'], style: 'grey', blocks: [], defaultContent: ['.rich-text.-disclaimer'] },
    { id: 'alerts-signup', name: 'alerts-signup', selector: ['.alerts-signup'], style: null, blocks: [], defaultContent: ['.alerts-signup'] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'columns-sticky': columnsStickyParser,
  'cards-stats': cardsStatsParser,
  'cards-links': cardsLinksParser,
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (in afterTransform hook)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block, skipping any already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    // Equivalent to WebImporter.rules.createMetadata, plus rows that opt the page
    // into the cooley template (templates/cooley) and the Cooley nav/footer
    // documents on the DA site, leaving the site-wide /nav and /footer alone.
    const meta = WebImporter.Blocks.getMetadata(document);
    meta.Template = 'cooley';
    meta.Nav = '/cooley/nav';
    meta.Footer = '/cooley/footer';
    main.append(WebImporter.Blocks.getMetadataBlock(document, meta));
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
