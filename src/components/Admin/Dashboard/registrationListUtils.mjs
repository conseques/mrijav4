const ALL_FILTER_VALUE = 'all';
const CONFIRMED_PAYMENT_STATES = new Set(['authorized', 'captured', 'completed', 'paid']);

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function matchesFilter(value, filterValue) {
  const normalizedFilter = normalizeText(filterValue);
  return !normalizedFilter || normalizedFilter === ALL_FILTER_VALUE || normalizeText(value) === normalizedFilter;
}

function formatCsvDate(createdAt) {
  const seconds = Number(createdAt?.seconds || 0);
  if (!seconds) {
    return '';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(seconds * 1000));
}

function escapeCsvCell(value) {
  const cell = String(value ?? '');
  if (!/[",\n\r]/.test(cell)) {
    return cell;
  }

  return `"${cell.replace(/"/g, '""')}"`;
}

export function getRegistrationSummary(registrations = []) {
  return registrations.reduce(
    (summary, registration) => {
      const type = normalizeText(registration.type) || 'event';
      const paymentState = normalizeText(registration.paymentState);

      summary.total += 1;

      if (type === 'course') {
        summary.course += 1;
      } else if (type === 'membership') {
        summary.membership += 1;
      } else {
        summary.event += 1;
      }

      if (CONFIRMED_PAYMENT_STATES.has(paymentState)) {
        summary.confirmedPayment += 1;
      }

      return summary;
    },
    {
      total: 0,
      event: 0,
      course: 0,
      membership: 0,
      confirmedPayment: 0,
    }
  );
}

export function filterRegistrations(registrations = [], filters = {}) {
  const query = normalizeText(filters.query);

  return registrations.filter((registration) => {
    if (!matchesFilter(registration.type || 'event', filters.type)) {
      return false;
    }

    if (!matchesFilter(registration.paymentState || 'registered', filters.status)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchableText = [
      registration.name,
      registration.email,
      registration.phone,
      registration.eventName,
      registration.type,
      registration.source,
      registration.paymentState,
      registration.paymentReference,
    ]
      .map(normalizeText)
      .join(' ');

    return searchableText.includes(query);
  });
}

export function getUniqueRegistrationValues(registrations = [], field) {
  return Array.from(
    new Set(
      registrations
        .map((registration) => String(registration[field] || '').trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

export function registrationsToCsv(registrations = []) {
  const headers = [
    'Date',
    'Name',
    'Email',
    'Phone',
    'Type',
    'Source',
    'Status',
    'Registration',
    'Payment reference',
  ];

  const rows = registrations.map((registration) => [
    formatCsvDate(registration.createdAt),
    registration.name,
    registration.email,
    registration.phone,
    registration.type || 'event',
    registration.source || 'website',
    registration.paymentState || 'registered',
    registration.eventName,
    registration.paymentReference,
  ]);

  return [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
}
