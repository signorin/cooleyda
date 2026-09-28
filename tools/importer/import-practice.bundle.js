/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-practice.js
  var import_practice_exports = {};
  __export(import_practice_exports, {
    default: () => import_practice_default
  });

  // tools/importer/parsers/columns-sticky.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector(
      '.intro .title, .intro h1, .intro h2, header h2, h2.title, [class*="title"]'
    );
    const bodyContent = [];
    const wysiwyg = element.querySelectorAll(".items .wysiwyg-content, .items .item .wysiwyg-content");
    if (wysiwyg.length) {
      wysiwyg.forEach((w) => {
        Array.from(w.children).forEach((child) => bodyContent.push(child));
      });
    }
    if (!bodyContent.length) {
      const items = element.querySelectorAll(".items .item");
      if (items.length) {
        items.forEach((li) => bodyContent.push(li));
      } else {
        element.querySelectorAll("p").forEach((p) => {
          if (!heading || !heading.contains(p)) bodyContent.push(p);
        });
      }
    }
    if (!heading && !bodyContent.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([heading || "", bodyContent.length ? bodyContent : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-sticky", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const items = element.querySelectorAll(":scope > .item, :scope > li");
    const cards = items.length ? Array.from(items) : [element];
    cards.forEach((item) => {
      const content = item.querySelector(".wysiwyg-content") || item;
      const cardCell = [];
      Array.from(content.children).forEach((child) => cardCell.push(child));
      if (cardCell.length) cells.push([cardCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-links.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    let items = element.querySelectorAll(":scope > .item, :scope > li");
    if (!items.length) {
      items = element.querySelectorAll(".item");
    }
    if (!items.length) {
      items = element.querySelectorAll(".item-title");
    }
    items.forEach((item) => {
      const title = item.querySelector(".item-title, h1, h2, h3, h4, h5, h6") || item.querySelector("a") || item;
      if (title) cells.push([title]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-links", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/cooley-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-pc-sdk",
        ".js-blocker",
        ".site-header-search",
        ".hamburger-menu-search"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.site-header",
        "section.hamburger-menu",
        "footer.site-footer",
        "a.skiplink",
        ".formations",
        ".CoveoForSitecoreContext"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "iframe",
        "input"
      ]);
    }
  }

  // tools/importer/transformers/cooley-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-practice.js
  var PAGE_TEMPLATE = {
    name: "practice",
    description: "Cooley practice-area detail page (Corporate).",
    urls: [
      "https://www.cooley.com/services/practice/corporate"
    ],
    urlPattern: "/services/practice/*",
    blocks: [
      {
        name: "columns-sticky",
        instances: [".sticky-text-list .inner"]
      },
      {
        name: "cards-stats",
        instances: [".card-up .items"]
      },
      {
        name: "cards-links",
        instances: [".related-services .main"]
      }
    ],
    sections: [
      { id: "hero", name: "hero", selector: [".hero.hero-secondary"], style: null, blocks: [], defaultContent: [".hero.hero-secondary"] },
      { id: "secondary-nav", name: "secondary-nav", selector: [".secondary-nav"], style: null, blocks: [], defaultContent: [".secondary-nav"] },
      { id: "intro-text-panel", name: "intro-text-panel", selector: [".intro-text-panel"], style: null, blocks: [], defaultContent: [".intro-text-panel"] },
      { id: "sticky-text-list", name: "sticky-text-list", selector: [".sticky-text-list"], style: null, blocks: ["columns-sticky"], defaultContent: [] },
      { id: "card-up", name: "card-up", selector: [".card-up"], style: null, blocks: ["cards-stats"], defaultContent: [".card-up .intro"] },
      { id: "related-services", name: "related-services", selector: [".related-services"], style: null, blocks: ["cards-links"], defaultContent: [".related-services .intro"] },
      { id: "disclaimer", name: "disclaimer", selector: [".rich-text.-disclaimer"], style: "grey", blocks: [], defaultContent: [".rich-text.-disclaimer"] },
      { id: "alerts-signup", name: "alerts-signup", selector: [".alerts-signup"], style: null, blocks: [], defaultContent: [".alerts-signup"] }
    ]
  };
  var parsers = {
    "columns-sticky": parse,
    "cards-stats": parse2,
    "cards-links": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_practice_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      const meta = WebImporter.Blocks.getMetadata(document2);
      meta.Template = "cooley";
      meta.Nav = "/cooley/nav";
      meta.Footer = "/cooley/footer";
      main.append(WebImporter.Blocks.getMetadataBlock(document2, meta));
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_practice_exports);
})();
