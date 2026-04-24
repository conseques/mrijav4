import React from 'react';
import styles from './FeaturedEvent.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import {
    ArrowRight,
    HeartHandshake,
    Images,
    Megaphone,
} from 'lucide-react';
import { getFeaturedConcertImpactContent } from "../../../content/featuredConcertImpact.mjs";
import performancePhoto from "../../../images/events/impact-concert-performance.webp";
import foodPhoto from "../../../images/events/impact-concert-food.webp";
import audiencePhoto from "../../../images/events/impact-concert-audience.webp";

const metricIcons = [HeartHandshake, Images, Megaphone];

const FeaturedEvent = ({ topOffset = false }) => {
    const { i18n } = useTranslation();
    const content = getFeaturedConcertImpactContent(i18n.language);
    const headlineText = content.headline.replace(content.amountLabel, '').trim();
    const photos = [
        { src: performancePhoto, alt: content.photoAlts[0], className: styles.photoPrimary },
        { src: foodPhoto, alt: content.photoAlts[1], className: styles.photoSecondary },
        { src: audiencePhoto, alt: content.photoAlts[2], className: styles.photoTertiary },
    ];

    return (
        <section id="featured-event" className={`${styles.wrapper} ${topOffset ? styles.topOffset : ''}`}>
            <motion.div
                className={styles.surface}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className={styles.contentColumn}>
                    <div className={styles.badges}>
                        <span className={styles.eyebrow}>{content.eyebrow}</span>
                        <span className={styles.impactBadge}>{content.impactLabel}</span>
                    </div>

                    <h2 className={styles.title}>
                        <span className={styles.amount}>{content.amountLabel}</span>
                        <span>{headlineText}</span>
                    </h2>
                    <p className={styles.lead}>{content.lead}</p>

                    <div className={styles.destinationCard}>
                        <HeartHandshake size={22} aria-hidden="true" />
                        <p>{content.destination}</p>
                    </div>

                    <div className={styles.metricGrid}>
                        {content.metrics.map((item, index) => {
                            const Icon = metricIcons[index] || HeartHandshake;
                            return (
                                <div key={`${item.value}-${item.label}`} className={styles.metricCard}>
                                    <div className={styles.metricIcon}>
                                        <Icon size={18} aria-hidden="true" />
                                    </div>
                                    <strong>{item.value}</strong>
                                    <span>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.actions}>
                        <Link className={styles.primaryAction} to="/gallery">
                            {content.primaryCta}
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <Link className={styles.secondaryAction} to="/#membership">
                            {content.membershipCta}
                        </Link>
                        <Link className={styles.textAction} to="/events">
                            {content.eventsCta}
                        </Link>
                    </div>
                </div>

                <div className={styles.photoColumn} aria-label={content.eyebrow}>
                    {photos.map((photo, index) => (
                        <figure key={photo.src} className={`${styles.photoFrame} ${photo.className}`}>
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                            />
                        </figure>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedEvent;
