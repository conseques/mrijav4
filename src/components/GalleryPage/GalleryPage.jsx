import React, { useEffect } from 'react';
import Gallery from "../AboutUsPage/Gallery/Gallery";
import GalleryCTA from "./GalleryCTA/GalleryCTA";
import styles from './GalleryPage.module.css';
import SEO from "../SEO/SEO";
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroImage from '../../images/gallery/julebord3.jpg';


const GalleryPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { t } = useTranslation("gallery");
    const { t: tHero } = useTranslation("hero");
    const totalMoments = 8;

    return (
        <div className={styles.pageContainer}>
            <SEO 
                title={t("title", "Gallery")} 
                description={t("subtitle", "Explore our community photos and moments from Mrija events.")}
            />
            <motion.section
                className={styles.hero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.heroCopy}>
                    <span className={styles.eyebrow}>{t("moments")}</span>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                    <div className={styles.actions}>
                        <Link to="/events" className={styles.primaryBtn}>{tHero("galleryCtaEventsBtn")}</Link>
                        <Link to="/#membership" className={styles.secondaryBtn}>{tHero("galleryCtaVolBtn")}</Link>
                    </div>
                </div>

                <div className={styles.heroMedia}>
                    <img src={heroImage} alt={t("title")} className={styles.heroImage} />
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroStat}>
                        <span className={styles.heroStatValue}>{String(totalMoments).padStart(2, "0")}</span>
                        <span className={styles.heroStatLabel}>{t("moments")}</span>
                    </div>
                </div>
            </motion.section>
            <Gallery />
            <GalleryCTA />
        </div>

    );
};

export default GalleryPage;
