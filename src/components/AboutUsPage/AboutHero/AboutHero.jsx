import React from 'react';
import { useTranslation } from "react-i18next";
import styles from './AboutHero.module.css';
import orgPhoto from '../../../images/hero/mriya_about.jpg';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutHero = () => {
    const { t: tHero } = useTranslation('hero');
    const { t: tHeader } = useTranslation('header');
    const { t: tMission } = useTranslation('missions');
    const { t: tReachOut } = useTranslation('reachOut');

    const handleContactScroll = () => {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className={styles.section}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.copy}>
                    <span className={styles.eyebrow}>{tHeader('communityLabel')}</span>
                    <p className={styles.brandLine}>
                        {tHero('welcome')} <span>{tHero('brand')}</span>
                    </p>
                    <h1 className={styles.title}>{tMission('title')}</h1>
                    <p className={styles.subtitle}>{tMission('subtitle')}</p>

                    <div className={styles.actions}>
                        <button className={styles.primaryBtn} onClick={handleContactScroll}>
                            {tReachOut('title')}
                        </button>
                        <Link to="/events" className={styles.secondaryBtn}>
                            {tHero('galleryCtaEventsBtn')}
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                <div className={styles.imageWrapper}>
                    <img src={orgPhoto} alt="Mriya Organization" className={styles.image} loading="lazy" />
                    <div className={styles.overlay} />
                    <div className={styles.floatingLabel}>{tHero('aboutHeroHover')}</div>
                </div>
            </motion.div>
        </section>
    );
};

export default AboutHero;
