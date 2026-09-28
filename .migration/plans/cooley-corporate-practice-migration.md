# Cooley Corporate Practice Page Migration Plan

## Objective
Migrate the single page **https://www.cooley.com/services/practice/corporate** into AEM Edge Delivery Services and publish it to Document Authoring at **scdemos/demo/drafts/csignorin**, inside a new folder named **Cooley**. Migrated blocks should **match the original Cooley site's styling** (colors, fonts, layout).

## Status
⛔ **Cannot execute yet — the session is still in Plan mode at the UI level.** I've tried to start twice; every file write and import-script command is rejected with "Plan mode is active," and I cannot turn Plan mode off programmatically (it's controlled by your interface). The plan is fully approved and ready to run the moment the mode changes.

**To start:** press **Shift+Tab** (or use the plan-mode control in your interface) to switch **out of** Plan mode into Execute/normal mode, then send a short message like "go". I'll immediately begin at Step 1.

## Source & Destination
- **Source page:** `https://www.cooley.com/services/practice/corporate`
- **DA destination:** `scdemos/demo/drafts/csignorin/Cooley/`
- **Target document path:** `scdemos/demo/drafts/csignorin/Cooley/corporate`
- **Scope:** Single page only (confirmed — no child/linked pages).
- **Design fidelity:** Match the original site's design (confirmed).

## Approach
Standard single-page content migration to EDS with design matching, run through the migration pipeline: scrape → analyze structure → model content into blocks → generate import HTML → apply original styling → preview/verify locally → upload to Document Authoring. No block catalog exists in the project, so block code is generated per-page after page analysis.

## Checklist

### 1. Project setup & scrape source
- [ ] Initialize migration plan and task tracking
- [ ] Confirm project config (`.migration/project.json`)
- [ ] Fetch the source page and download images/assets
- [ ] Extract page metadata (title, description, etc.)
- [ ] Produce cleaned HTML and analysis JSON

### 2. Identify template & analyze page structure
- [ ] Run the classify pipeline to seed the single-page template
- [ ] Identify section boundaries and content sequences
- [ ] Determine authoring approach per section (default content vs. blocks)
- [ ] Name and map block variants

### 3. Generate block library & import content
- [ ] Generate block code per identified variant (one at a time)
- [ ] Map DOM selectors onto the page template
- [ ] Generate parsers and transformers (import infrastructure)
- [ ] Generate the import HTML via the project's bundled import script (never hand-written)

### 4. Match original styling
- [ ] Extract design tokens (colors, fonts, spacing) from the source page
- [ ] Apply CSS to migrated blocks so they visually match the original
- [ ] Visually critique migrated blocks against the original and iterate

### 5. Preview & verify
- [ ] Run the local dev server against imported HTML
- [ ] Verify block rendering and DOM structure in preview
- [ ] Compare against the original page and fix broken references / 404s

### 6. Upload to Document Authoring
- [ ] Confirm the `Cooley` folder is created under `scdemos/demo/drafts/csignorin`
- [ ] Upload `corporate.html` to `scdemos/demo/drafts/csignorin/Cooley/corporate.html` via the DA source API (credentials injected automatically)
- [ ] Verify the uploaded page renders correctly in DA

## Notes
- **Execution requires Execute mode** — this plan is read-only and no work can proceed until Plan mode is turned off via the UI toggle. Saying "execute"/"go" in chat is not enough on its own; the mode switch has to happen in the interface.
- If the DA upload returns a 401/403, the Adobe credentials opt-in needs enabling in Settings → LLM Permissions (no token should be pasted into chat).
