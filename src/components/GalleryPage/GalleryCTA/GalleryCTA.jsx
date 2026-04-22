import React from 'react';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import styles from './GalleryCTA.module.css';
import { motion } from 'framer-motion';
import VolunteerFormNote from '../../VolunteerFormNote/VolunteerFormNote';
import { VOLUNTEER_FORM_URL } from '../../../content/volunteerForm';

const GalleryCTA = () => {
    const { t } = useTranslation("hero");

    return (
        <div className={styles.ctaContainer}>
            <motion.div 
                className={styles.ctaBox}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className={styles.ctaTitle}>{t("galleryCtaTitle")}</h2>
                <p className={styles.ctaDesc}>
                    {t("galleryCtaDesc")}
                </p>
                <div className={styles.btnGroup}>
                    <a
                        href={VOLUNTEER_FORM_URL}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.primaryBtn}
                    >
                        {t("galleryCtaVolBtn")}
                    </a>
                    <Link to="/events" className={styles.secondaryBtn}>{t("galleryCtaEventsBtn")}</Link>
                </div>
                <VolunteerFormNote className={styles.volunteerNote} />
                
                {/* Decorative Paper Airplane icon resembling the one in Figma bottom right */}
                <div className={styles.decorativeSend}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="#0088CC"/>
                        <path d="M5.5 11.5L20 5L12 20L10 14L5.5 11.5Z" fill="white"/>
                    </svg>
                </div>
            </motion.div>
        </div>
    );
};

export default GalleryCTA;
