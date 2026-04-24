export const FEATURED_CONCERT_IMPACT_AMOUNT = '6500 kr';

const featuredConcertImpactContent = {
  no: {
    eyebrow: 'Takk for kvelden',
    impactLabel: 'Alt går til hjelp',
    amountLabel: FEATURED_CONCERT_IMPACT_AMOUNT,
    headline: '6500 kr samlet inn for Khrystynas bataljon',
    lead:
      'Tusen takk til alle som kom, donerte, laget mat, rigget og fylte rommet med varme. Konserten er over, men støtten fortsetter i praktisk hjelp.',
    destination: 'Hele beløpet går til hjelp for Khrystynas bataljon.',
    primaryCta: 'Se galleri',
    heroCta: 'Se resultatet',
    membershipCta: 'Bli medlem',
    eventsCta: 'Se kommende arrangementer',
    metrics: [
      { value: FEATURED_CONCERT_IMPACT_AMOUNT, label: 'samlet inn' },
      { value: '100%', label: 'går videre til hjelp' },
      { value: 'Neste', label: 'arrangement annonseres snart' },
    ],
    photoAlts: [
      'Khrystyna spiller gitar under veldedighetskonserten i Drammen',
      'Gjestene deler ukrainsk mat etter konserten',
      'Publikum samlet i salen under konserten',
    ],
  },
  en: {
    eyebrow: 'Thank you for the evening',
    impactLabel: 'All funds go to aid',
    amountLabel: FEATURED_CONCERT_IMPACT_AMOUNT,
    headline: "6500 kr raised for Khrystyna's battalion",
    lead:
      'Thank you to everyone who joined, donated, cooked, set up, and filled the room with warmth. The concert has passed, but the support now becomes practical help.',
    destination: "The full amount goes to support Khrystyna's battalion.",
    primaryCta: 'See gallery',
    heroCta: 'See the impact',
    membershipCta: 'Become a member',
    eventsCta: 'See upcoming events',
    metrics: [
      { value: FEATURED_CONCERT_IMPACT_AMOUNT, label: 'raised' },
      { value: '100%', label: 'goes onward to aid' },
      { value: 'Next', label: 'event announced soon' },
    ],
    photoAlts: [
      'Khrystyna playing guitar during the charity concert in Drammen',
      'Guests sharing Ukrainian food after the concert',
      'Audience gathered in the hall during the concert',
    ],
  },
  ua: {
    eyebrow: 'Дякуємо за вечір',
    impactLabel: 'Уся сума йде на допомогу',
    amountLabel: FEATURED_CONCERT_IMPACT_AMOUNT,
    headline: '6500 kr зібрано для батальйону Христини',
    lead:
      'Дякуємо всім, хто прийшов, донатив, готував, допомагав з організацією і наповнив вечір теплом. Концерт уже відбувся, а підтримка переходить у практичну допомогу.',
    destination: 'Уся сума піде на допомогу батальйону Христини.',
    primaryCta: 'Галерея',
    heroCta: 'Побачити результат',
    membershipCta: 'Стати членом',
    eventsCta: 'Майбутні події',
    metrics: [
      { value: FEATURED_CONCERT_IMPACT_AMOUNT, label: 'зібрано' },
      { value: '100%', label: 'йде на допомогу' },
      { value: 'Далі', label: 'нову подію оголосимо скоро' },
    ],
    photoAlts: [
      'Христина грає на гітарі під час благодійного концерту в Драммені',
      'Гості куштують українські страви після концерту',
      'Глядачі зібралися в залі під час концерту',
    ],
  },
};

function normalizeLanguage(language) {
  const shortLanguage = String(language || 'no').split('-')[0];
  return ['en', 'ua', 'no'].includes(shortLanguage) ? shortLanguage : 'no';
}

export function getFeaturedConcertImpactContent(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return featuredConcertImpactContent[normalizedLanguage] || featuredConcertImpactContent.no;
}
