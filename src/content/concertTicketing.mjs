export const FEATURED_CONCERT_TICKET_URL = 'https://betal.vipps.no/sljc7z';

const ticketingContent = {
  no: {
    buyTicketCta: 'Kjøp billett',
    onsitePurchaseNote: 'Billetten kan også kjøpes direkte på konserten, ved inngangen.',
  },
  en: {
    buyTicketCta: 'Buy ticket',
    onsitePurchaseNote: 'Tickets can also be bought directly at the concert, at the door.',
  },
  ua: {
    buyTicketCta: 'Купити квиток',
    onsitePurchaseNote: 'Квиток також можна буде купити прямо на концерті, на вході.',
  },
};

export function getConcertTicketingContent(language) {
  const normalizedLanguage = String(language || 'no').split('-')[0];
  return ticketingContent[normalizedLanguage] || ticketingContent.no;
}
