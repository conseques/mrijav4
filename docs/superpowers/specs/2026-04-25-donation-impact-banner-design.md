# Donation Impact Banner Design

## Goal

Replace the outdated featured concert sales section with a post-event impact hero that thanks visitors, shows real event photos, and clearly states that 6500 NOK was raised for Khrystyna's battalion.

## Approved Direction

Use an editorial "thank you + photo" hero. The section should feel alive and trustworthy, not like a placeholder. It should remove ticket purchase and registration CTAs for the April 24 concert because the event has passed.

## Content

- Show the amount as `6500 kr`.
- State that the full amount goes to support Khrystyna's battalion.
- Thank people who attended, donated, cooked, volunteered, or helped make the evening happen.
- Link to the gallery, membership section, and all events/future announcements.
- Localize the content for Norwegian, English, and Ukrainian.

## Visual

- Use the real concert photos downloaded from Stitch as the hero visual collage.
- Keep the existing green/blue/yellow Mrija palette.
- Make the amount highly visible.
- Keep the section responsive on desktop and mobile.

## Technical Scope

- Add a small, testable content module for impact copy and metrics.
- Update `FeaturedEvent` to render the impact hero instead of the old concert sales content.
- Remove the ticket URL CTA from this section.
- Preserve existing filtering that keeps the old featured concert out of generic event lists.
- Verify unit tests, production build, and browser rendering.
