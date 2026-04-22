import React from 'react';
import { useTranslation } from 'react-i18next';
import BritishFlag from '../../images/header/English.png';
import UkrainianFlag from '../../images/header/Ukraine (UA).png';
import NorwegianFlag from '../../images/header/Norway (NO).png';
import styles from './VolunteerPortal.module.css';
import { LANGUAGE_OPTIONS, normalizeLanguage } from './portalText';

const languageFlags = {
    en: BritishFlag,
    ua: UkrainianFlag,
    no: NorwegianFlag
};

const LanguageSwitcher = () => {
    const { t, i18n } = useTranslation('volunteerPortal');
    const currentLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language);

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <div className={styles.languageSwitcher} aria-label={t('language.label')}>
            {LANGUAGE_OPTIONS.map(({ code }) => {
                const label = t(`language.options.${code}`);
                const isActive = currentLanguage === code;

                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageChange(code)}
                        className={isActive ? styles.languageButtonActive : styles.languageButton}
                        aria-label={t('language.current', { language: label })}
                        aria-pressed={isActive}
                    >
                        <img className={styles.languageFlag} src={languageFlags[code]} alt="" />
                        <span>{code.toUpperCase()}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default LanguageSwitcher;
