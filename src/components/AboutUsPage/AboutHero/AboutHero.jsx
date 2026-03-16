import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './AboutHero.module.css';
import orgPhoto from '../../../images/hero/mriya_about.jpg';

const AboutHero = () => {
    const { t } = useTranslation('hero');
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src={orgPhoto} alt="Mriya Organization" className={styles.image} loading="lazy" />
                <div className={styles.hoverOverlay}>
                    <span className={styles.hoverText}>{t('aboutHeroHover')}</span>
                </div>
            </div>
        </div>
    );
};

export default AboutHero;
