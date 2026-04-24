import test from 'node:test';
import assert from 'node:assert/strict';

import {
  filterRegistrations,
  getRegistrationSummary,
  registrationsToCsv,
} from './registrationListUtils.mjs';

const registrations = [
  {
    id: 'reg_1',
    name: 'Olena Ivanenko',
    email: 'olena@example.com',
    phone: '+47 111 22 333',
    eventName: 'Charity Concert',
    type: 'event',
    source: 'website_event_form',
    paymentState: 'registered',
    paymentReference: '',
    createdAt: { seconds: 1713895200 },
  },
  {
    id: 'reg_2',
    name: 'Andrii',
    email: 'andrii@example.com',
    phone: '',
    eventName: 'Norwegian B1',
    type: 'course',
    source: 'website_course_form',
    paymentState: 'registered',
    paymentReference: '',
    createdAt: { seconds: 1713981600 },
  },
  {
    id: 'reg_3',
    name: 'Marta',
    email: 'marta@example.com',
    phone: '',
    eventName: 'Membership (Vipps)',
    type: 'membership',
    source: 'vipps_epayment',
    paymentState: 'captured',
    paymentReference: 'vipps-ref-123',
    createdAt: { seconds: 1714068000 },
  },
];

test('summarizes registrations by type and confirmed payment state', () => {
  assert.deepEqual(getRegistrationSummary(registrations), {
    total: 3,
    event: 1,
    course: 1,
    membership: 1,
    confirmedPayment: 1,
  });
});

test('filters registrations by text query, type, and payment state', () => {
  assert.deepEqual(
    filterRegistrations(registrations, {
      query: 'ivan',
      type: 'event',
      status: 'registered',
    }).map((item) => item.id),
    ['reg_1']
  );

  assert.deepEqual(
    filterRegistrations(registrations, {
      query: 'vipps-ref',
      type: 'membership',
      status: 'captured',
    }).map((item) => item.id),
    ['reg_3']
  );
});

test('exports registrations to csv with escaped cell values', () => {
  const csv = registrationsToCsv([
    {
      ...registrations[0],
      name: 'Olena "Lena" Ivanenko',
      eventName: 'Concert, community night',
    },
  ]);

  assert.equal(
    csv,
    [
      'Date,Name,Email,Phone,Type,Source,Status,Registration,Payment reference',
      '23 Apr 2024,"Olena ""Lena"" Ivanenko",olena@example.com,+47 111 22 333,event,website_event_form,registered,"Concert, community night",',
    ].join('\n')
  );
});
