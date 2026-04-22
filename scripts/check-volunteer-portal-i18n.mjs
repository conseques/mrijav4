import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const locales = ['en', 'no', 'ua'];
const namespace = 'volunteerPortal.json';
const root = process.cwd();

const flattenKeys = (value, prefix = '') => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, child]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(child, nextPrefix);
  });
};

const readLocale = (locale) => {
  const filePath = join(root, 'src', 'components', 'Locales', locale, namespace);
  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const resources = Object.fromEntries(locales.map((locale) => [locale, readLocale(locale)]));
const referenceKeys = flattenKeys(resources.en).sort();
const requiredKeys = [
  'language.label',
  'language.current',
  'language.options.en',
  'language.options.no',
  'language.options.ua',
  'auth.login.title',
  'auth.register.title',
  'dashboard.title',
  'dashboard.navigation.title',
  'tasks.title',
];

let hasError = false;

for (const key of requiredKeys) {
  if (!referenceKeys.includes(key)) {
    console.error(`Missing required key in en: ${key}`);
    hasError = true;
  }
}

for (const locale of locales.slice(1)) {
  const localeKeys = flattenKeys(resources[locale]).sort();
  const localeKeySet = new Set(localeKeys);
  const referenceKeySet = new Set(referenceKeys);

  for (const key of referenceKeys) {
    if (!localeKeySet.has(key)) {
      console.error(`Missing key in ${locale}: ${key}`);
      hasError = true;
    }
  }

  for (const key of localeKeys) {
    if (!referenceKeySet.has(key)) {
      console.error(`Extra key in ${locale}: ${key}`);
      hasError = true;
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Volunteer portal i18n keys are aligned across ${locales.join(', ')}.`);
