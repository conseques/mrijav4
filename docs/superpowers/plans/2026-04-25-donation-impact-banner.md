# Donation Impact Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the outdated featured concert sales hero with a localized post-event impact banner using real photos and the 6500 NOK impact fact.

**Architecture:** Add a pure content module for localized impact copy, keep image assets in `src/images/events`, and update the existing `FeaturedEvent` component/CSS in place. Existing event-list filtering remains in `featuredConcert.js`.

**Tech Stack:** React 19, Vite, CSS modules, `react-i18next`, `react-router-dom`, `node:test`.

---

### Task 1: Content Module

**Files:**
- Create: `src/content/featuredConcertImpact.mjs`
- Create: `src/content/featuredConcertImpact.test.mjs`

- [ ] Write tests that assert supported locales return `6500 kr`, donation destination copy, and gallery/membership/event CTA labels.
- [ ] Run `node --test src/content/featuredConcertImpact.test.mjs` and confirm it fails because the module does not exist.
- [ ] Implement `getFeaturedConcertImpactContent(language)` with `no`, `en`, and `ua` copy plus fallback to Norwegian.
- [ ] Re-run the content test and confirm it passes.

### Task 2: Assets

**Files:**
- Copy into: `src/images/events/impact-concert-performance.webp`
- Copy into: `src/images/events/impact-concert-food.webp`
- Copy into: `src/images/events/impact-concert-audience.webp`

- [ ] Convert the three downloaded Stitch screenshots from `stitch/donation-impact-banner/` to WebP for site usage.
- [ ] Confirm the files are valid images with `file src/images/events/impact-concert-*.webp`.

### Task 3: Featured Section UI

**Files:**
- Modify: `src/components/EventsPage/FeaturedEvent/FeaturedEvent.jsx`
- Modify: `src/components/EventsPage/FeaturedEvent/FeaturedEvent.module.css`

- [ ] Replace old concert sales content with the impact content module.
- [ ] Remove registration and ticket purchase actions from this component.
- [ ] Add gallery, membership, and all-events links.
- [ ] Render a responsive photo collage with accessible alt text.
- [ ] Keep the amount, destination, and thank-you message visible on desktop and mobile.

### Task 4: Verification

**Files:**
- Existing tests and build output only.

- [ ] Run all existing node tests touched by this work.
- [ ] Run `npm run build`.
- [ ] Open the site in the browser and inspect `/` and `/events`.
- [ ] Check a mobile viewport or screenshot for text overlap and image framing.
