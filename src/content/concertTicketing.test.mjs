import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FEATURED_CONCERT_TICKET_URL,
  getConcertTicketingContent,
} from './concertTicketing.mjs';

test('returns the shared Vipps ticket URL for the featured concert', () => {
  assert.equal(FEATURED_CONCERT_TICKET_URL, 'https://betal.vipps.no/sljc7z');
});

test('returns translated ticket CTA and onsite note for supported languages', () => {
  const norwegian = getConcertTicketingContent('no');
  const english = getConcertTicketingContent('en');
  const ukrainian = getConcertTicketingContent('ua');

  assert.equal(norwegian.buyTicketCta, 'Kjøp billett');
  assert.match(norwegian.onsitePurchaseNote, /inngangen/i);

  assert.equal(english.buyTicketCta, 'Buy ticket');
  assert.match(english.onsitePurchaseNote, /at the door/i);

  assert.equal(ukrainian.buyTicketCta, 'Купити квиток');
  assert.match(ukrainian.onsitePurchaseNote, /на вході/i);
});
