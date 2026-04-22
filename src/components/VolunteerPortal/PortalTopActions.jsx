import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import styles from './VolunteerPortal.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const PortalTopActions = () => {
    const { t } = useTranslation('volunteerPortal');
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <div className={styles.topActions}>
            <LanguageSwitcher />
            <button
                type="button"
                onClick={toggleTheme}
                className={styles.themeToggle}
                aria-label={t('topActions.toggleTheme')}
            >
                {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
        </div>
    );
};

export default PortalTopActions;
