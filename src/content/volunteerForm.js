export const VOLUNTEER_FORM_URL =
  'https://docs.google.com/forms/d/1Gs7Bs7cnpHLzofQ_uKdXvRSm7YzUpwC2fgdHZDoxnFs';

function normalizeLanguage(language) {
  const shortLanguage = String(language || 'no').split('-')[0];
  return ['en', 'ua', 'no'].includes(shortLanguage) ? shortLanguage : 'no';
}

const volunteerFormNotes = {
  no: 'I feltet "Forslag til foreningen" kan du skrive at du ønsker å bli frivillig.',
  en: 'In the "Suggestions for the association" field, mention that you want to become a volunteer.',
  ua: 'У рядку "Пропозиції для спілки" вкажіть, що хочете стати волонтером.',
};

export function getVolunteerFormNote(language) {
  return volunteerFormNotes[normalizeLanguage(language)];
}
