import poster from '../images/events/khrystyna-panasiuk-concert-poster.png';

export const FEATURED_CONCERT_ID = 'featured-khrystyna-panasiuk-charity-concert';

export const FEATURED_CONCERT_EVENT = {
  id: FEATURED_CONCERT_ID,
  imageUrl: poster,
  day: '24.04',
  time: '18:00',
  tagType: 'annual',
  locales: {
    no: {
      name: 'Veldedighetskonsert med Khrystyna Panasiuk',
      description:
        'En varm kveld med levende ukrainsk musikk, gode smaker og fellesskap der hver billett styrker viktige initiativer.',
    },
    en: {
      name: 'Charity Concert with Khrystyna Panasiuk',
      description:
        'A warm evening of live Ukrainian music, good food, and community where every ticket helps fund meaningful support initiatives.',
    },
    ua: {
      name: 'Благодійний концерт з Христиною Панасюк',
      description:
        'Теплий вечір живої української музики, смаколиків і спільності, де кожен квиток підтримує важливі ініціативи.',
    },
  },
};

const featuredConcertContent = {
  no: {
    eyebrow: 'Hovedarrangement denne våren',
    headline: 'Bli med på en veldedighetskveld med Khrystyna Panasiuk',
    lead:
      'Vi setter april-kvelden i Drammen i sentrum med levende musikk, ukrainske smaker og en tydelig invitasjon til å møtes rundt noe meningsfullt.',
    heroCta: 'Reserver plass',
    primaryCta: 'Registrer deg nå',
    secondaryCta: 'Se alle arrangementer',
    venueLabel: 'Sted',
    venueName: 'Армія спасіння в центрі (Frelsesarmeen)',
    venueAddress: 'Thornegata 2, 3015 Drammen',
    detailLabels: {
      date: 'Dato',
      time: 'Tid',
      ticket: 'Billett',
    },
    dateLabel: '24. april',
    timeLabel: '18:00',
    priceLabel: '150 kr',
    impactLabel: 'Hver billett støtter fellesskap og hjelpearbeid',
    highlights: [
      'Live konsert med Khrystyna Panasiuk',
      'Ukrainske smaker og varm atmosfære',
      'Et arrangement som samler støtte og mennesker',
    ],
  },
  en: {
    eyebrow: 'Main event this season',
    headline: 'Join an uplifting charity night with Khrystyna Panasiuk',
    lead:
      'We are putting one special April night at the heart of the homepage with live music, Ukrainian flavors, and a clear reason to gather around something meaningful.',
    heroCta: 'Reserve a seat',
    primaryCta: 'Register now',
    secondaryCta: 'See all events',
    venueLabel: 'Location',
    venueName: 'Армія спасіння в центрі (Frelsesarmeen)',
    venueAddress: 'Thornegata 2, 3015 Drammen',
    detailLabels: {
      date: 'Date',
      time: 'Time',
      ticket: 'Ticket',
    },
    dateLabel: '24 April',
    timeLabel: '18:00',
    priceLabel: '150 kr',
    impactLabel: 'Every ticket helps power community and support work',
    highlights: [
      'Live concert with Khrystyna Panasiuk',
      'Ukrainian food and a warm atmosphere',
      'An evening that gathers both people and support',
    ],
  },
  ua: {
    eyebrow: 'Головна подія цієї весни',
    headline: 'Приходьте на благодійний вечір з Христиною Панасюк',
    lead:
      'Ми винесли одну сильну квітневу подію в центр сайту: жива музика, українські смаки та зрозумілий привід зібратися навколо важливої справи.',
    heroCta: 'Забронювати місце',
    primaryCta: 'Зареєструватися',
    secondaryCta: 'Усі події',
    venueLabel: 'Локація',
    venueName: 'Армія спасіння в центрі (Frelsesarmeen)',
    venueAddress: 'Thornegata 2, 3015 Drammen',
    detailLabels: {
      date: 'Дата',
      time: 'Час',
      ticket: 'Квиток',
    },
    dateLabel: '24 квітня',
    timeLabel: '18:00',
    priceLabel: '150 kr',
    impactLabel: 'Кожен квиток підтримує спільноту та важливі ініціативи',
    highlights: [
      'Живий концерт Христини Панасюк',
      'Українські смаколики та тепла атмосфера',
      'Вечір, що об’єднує людей і підтримку',
    ],
  },
};

function normalizeLanguage(language) {
  const shortLanguage = String(language || 'no').split('-')[0];
  return ['en', 'ua', 'no'].includes(shortLanguage) ? shortLanguage : 'no';
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const featuredNames = new Set(
  Object.values(FEATURED_CONCERT_EVENT.locales)
    .map((locale) => normalizeText(locale?.name))
    .filter(Boolean)
);

export function getFeaturedConcertContent(language) {
  const normalizedLanguage = normalizeLanguage(language);
  return featuredConcertContent[normalizedLanguage] || featuredConcertContent.no;
}

export function isFeaturedConcertEvent(event) {
  if (!event) {
    return false;
  }

  if (String(event.id || '').trim() === FEATURED_CONCERT_ID) {
    return true;
  }

  const eventNames = Object.values(event.locales || {})
    .map((locale) => normalizeText(locale?.name))
    .filter(Boolean);

  return eventNames.some((name) => featuredNames.has(name));
}

export function filterOutFeaturedConcert(events = []) {
  return events.filter((event) => !isFeaturedConcertEvent(event));
}
