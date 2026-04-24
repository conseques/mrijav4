import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FEATURED_CONCERT_IMPACT_AMOUNT,
  getFeaturedConcertImpactContent,
} from './featuredConcertImpact.mjs';

test('returns the approved 6500 kr impact amount', () => {
  assert.equal(FEATURED_CONCERT_IMPACT_AMOUNT, '6500 kr');
});

test('returns localized impact copy and CTA labels', () => {
  const norwegian = getFeaturedConcertImpactContent('no');
  const english = getFeaturedConcertImpactContent('en');
  const ukrainian = getFeaturedConcertImpactContent('ua');

  assert.match(norwegian.headline, /6500 kr/);
  assert.match(norwegian.destination, /bataljon/i);
  assert.equal(norwegian.primaryCta, 'Se galleri');
  assert.equal(norwegian.membershipCta, 'Bli medlem');
  assert.equal(norwegian.heroCta, 'Se resultatet');

  assert.match(english.destination, /Khrystyna's battalion/i);
  assert.equal(english.primaryCta, 'See gallery');
  assert.equal(english.membershipCta, 'Become a member');
  assert.equal(english.heroCta, 'See the impact');

  assert.match(ukrainian.destination, /батальйон/i);
  assert.equal(ukrainian.primaryCta, 'Галерея');
  assert.equal(ukrainian.membershipCta, 'Стати членом');
  assert.equal(ukrainian.heroCta, 'Побачити результат');
});

test('falls back to Norwegian content for unsupported locales', () => {
  assert.equal(
    getFeaturedConcertImpactContent('sv-SE').headline,
    getFeaturedConcertImpactContent('no').headline
  );
});
