export const DONATION_TOTAL_BEFORE_CONCERT_IMPACT = 35450;
export const CONCERT_IMPACT_DONATION_AMOUNT = 6500;
export const DONATION_TOTAL_AFTER_CONCERT_IMPACT =
  DONATION_TOTAL_BEFORE_CONCERT_IMPACT + CONCERT_IMPACT_DONATION_AMOUNT;

function toFiniteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function applyConcertImpactDonation(reportData = {}) {
  const currentTotal = toFiniteNumber(reportData.totalAmountRaised);
  const totalAmountRaised =
    currentTotal >= DONATION_TOTAL_AFTER_CONCERT_IMPACT
      ? currentTotal
      : currentTotal + CONCERT_IMPACT_DONATION_AMOUNT;

  return {
    ...reportData,
    totalAmountRaised,
  };
}
