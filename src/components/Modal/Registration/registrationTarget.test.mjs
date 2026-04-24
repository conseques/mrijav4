import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createRegistrationTarget,
  getRegistrationTicketAction,
} from './registrationTarget.mjs';
import { FEATURED_CONCERT_TICKET_URL } from '../../../content/concertTicketing.mjs';

test('creates a safe registration target while preserving optional ticket metadata', () => {
  const target = createRegistrationTarget({
    name: '  Charity Concert  ',
    type: 'event',
    ticketUrl: ` ${FEATURED_CONCERT_TICKET_URL} `,
  });

  assert.deepEqual(target, {
    name: 'Charity Concert',
    type: 'event',
    ticketUrl: FEATURED_CONCERT_TICKET_URL,
  });
});

test('does not return a ticket action for regular event registrations', () => {
  const target = createRegistrationTarget({
    name: 'Community lunch',
    type: 'event',
  });

  assert.equal(getRegistrationTicketAction(target, 'en'), null);
});

test('returns translated ticket action only when the target carries a ticket URL', () => {
  const target = createRegistrationTarget({
    name: 'Charity Concert',
    type: 'event',
    ticketUrl: FEATURED_CONCERT_TICKET_URL,
  });

  assert.deepEqual(getRegistrationTicketAction(target, 'ua'), {
    url: FEATURED_CONCERT_TICKET_URL,
    label: 'Купити квиток',
    note: 'Квиток також можна буде купити прямо на концерті, на вході.',
  });
});

test('does not expose ticket actions for course registrations', () => {
  const target = createRegistrationTarget({
    name: 'Norwegian course',
    type: 'course',
    ticketUrl: FEATURED_CONCERT_TICKET_URL,
  });

  assert.equal(getRegistrationTicketAction(target, 'no'), null);
});
