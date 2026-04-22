export const LANGUAGE_OPTIONS = [
    { code: 'no', flagKey: 'no' },
    { code: 'en', flagKey: 'en' },
    { code: 'ua', flagKey: 'ua' }
];

export const AVAILABLE_SKILL_OPTIONS = [
    { value: 'Driver (Has car)', labelKey: 'skills.driver' },
    { value: 'Translator (EN/UA)', labelKey: 'skills.translatorEnUa' },
    { value: 'Translator (NO/UA)', labelKey: 'skills.translatorNoUa' },
    { value: 'Event Helper', labelKey: 'skills.eventHelper' },
    { value: 'Logistics', labelKey: 'skills.logistics' },
    { value: 'IT Support', labelKey: 'skills.itSupport' },
    { value: 'First Aid', labelKey: 'skills.firstAid' },
    { value: 'Photography', labelKey: 'skills.photography' }
];

const languageToDateLocale = {
    en: 'en-GB',
    no: 'nb-NO',
    ua: 'uk-UA'
};

export const normalizeLanguage = (language) => {
    const normalized = String(language || '').split('-')[0];
    return ['en', 'no', 'ua'].includes(normalized) ? normalized : 'no';
};

export const getDateLocale = (language) => languageToDateLocale[normalizeLanguage(language)] || 'nb-NO';

export const getSkillLabel = (t, skill) => {
    const option = AVAILABLE_SKILL_OPTIONS.find((item) => item.value === skill);
    return option ? t(option.labelKey) : skill;
};

export const getRoleLabel = (t, role = 'volunteer') =>
    t(`roles.${role}`, { defaultValue: role });

export const getUrgencyLabel = (t, urgency = 'Medium') =>
    t(`urgency.${urgency}`, { defaultValue: urgency });
