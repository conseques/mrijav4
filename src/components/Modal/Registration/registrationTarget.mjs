import { getConcertTicketingContent } from '../../../content/concertTicketing.mjs';

const SUPPORTED_REGISTRATION_TYPES = new Set(['event', 'course', 'membership']);

function normalizeRegistrationType(type) {
  const normalizedType = String(type || 'event').trim();
  return SUPPORTED_REGISTRATION_TYPES.has(normalizedType) ? normalizedType : 'event';
}

export function createRegistrationTarget({ name = '', type = 'event', ticketUrl = '' } = {}) {
  return {
    name: String(name || '').trim(),
    type: normalizeRegistrationType(type),
    ticketUrl: String(ticketUrl || '').trim(),
  };
}

export function getRegistrationTicketAction(selectedTarget, language) {
  const target = createRegistrationTarget(selectedTarget);

  if (target.type !== 'event' || !target.ticketUrl) {
    return null;
  }

  const ticketingContent = getConcertTicketingContent(language);

  return {
    url: target.ticketUrl,
    label: ticketingContent.buyTicketCta,
    note: ticketingContent.onsitePurchaseNote,
  };
}
