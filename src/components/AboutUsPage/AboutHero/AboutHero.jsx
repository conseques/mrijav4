import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './AboutHero.module.css';
import orgPhoto from '../../../images/hero/mriya_about.jpg';
import { motion } from 'framer-motion';

const AboutHero = () => {
    const { t } = useTranslation('hero');
    return (
        <div className={styles.container}>
            <motion.div 
                className={styles.imageWrapper}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <img src={orgPhoto} alt="Mriya Organization" className={styles.image} loading="lazy" />
                <div className={styles.hoverOverlay}>
                    <span className={styles.hoverText}>{t('aboutHeroHover')}</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutHero;
