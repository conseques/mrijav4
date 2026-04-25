import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DONATION_TOTAL_BEFORE_CONCERT_IMPACT,
  CONCERT_IMPACT_DONATION_AMOUNT,
  DONATION_TOTAL_AFTER_CONCERT_IMPACT,
  applyConcertImpactDonation,
} from './donationImpactTotals.mjs';

test('adds the concert donation to the current displayed fundraising total', () => {
  assert.equal(DONATION_TOTAL_BEFORE_CONCERT_IMPACT, 35450);
  assert.equal(CONCERT_IMPACT_DONATION_AMOUNT, 6500);
  assert.equal(DONATION_TOTAL_AFTER_CONCERT_IMPACT, 41950);

  assert.deepEqual(
    applyConcertImpactDonation({
      totalAmountRaised: 35450,
      goalAmount: 150000,
    }),
    {
      totalAmountRaised: 41950,
      goalAmount: 150000,
    }
  );
});

test('adds the concert donation to military aid in the detailed report breakdown', () => {
  assert.deepEqual(
    applyConcertImpactDonation({
      totalAmountRaised: 35450,
      goalAmount: 150000,
      distribution: {
        militaryAid: 0,
        humanitarianAid: 7000,
        otherOrgsSupport: 23100,
        other: 4900,
      },
    }),
    {
      totalAmountRaised: 41950,
      goalAmount: 150000,
      distribution: {
        militaryAid: 6500,
        humanitarianAid: 7000,
        otherOrgsSupport: 23100,
        other: 4900,
      },
    }
  );
});

test('does not double-count the concert donation once the source total already includes it', () => {
  assert.deepEqual(
    applyConcertImpactDonation({
      totalAmountRaised: 41950,
      goalAmount: 150000,
      distribution: {
        militaryAid: 6500,
        humanitarianAid: 7000,
        otherOrgsSupport: 23100,
        other: 4900,
      },
    }),
    {
      totalAmountRaised: 41950,
      goalAmount: 150000,
      distribution: {
        militaryAid: 6500,
        humanitarianAid: 7000,
        otherOrgsSupport: 23100,
        other: 4900,
      },
    }
  );

  assert.deepEqual(
    applyConcertImpactDonation({
      totalAmountRaised: 43000,
      goalAmount: 150000,
    }),
    {
      totalAmountRaised: 43000,
      goalAmount: 150000,
    }
  );
});
