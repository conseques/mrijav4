import React from 'react';
import styles from './FeaturedEvent.module.css';
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CalendarDays,
    Clock3,
    HeartHandshake,
    MapPin,
    Music4,
    Sparkles,
    Ticket
} from 'lucide-react';
import { FEATURED_CONCERT_EVENT, getFeaturedConcertContent } from "../../../content/featuredConcert";

const highlightIcons = [Music4, Sparkles, HeartHandshake];

const FeaturedEvent = () => {
    const { i18n } = useTranslation();
    const { openModal } = useOutletContext();
    const content = getFeaturedConcertContent(i18n.language);
    const localizedName =
        FEATURED_CONCERT_EVENT.locales?.[i18n.language]?.name ||
        FEATURED_CONCERT_EVENT.locales?.[String(i18n.language || '').split('-')[0]]?.name ||
        FEATURED_CONCERT_EVENT.locales?.no?.name;

    const detailItems = [
        { Icon: CalendarDays, label: content.detailLabels.date, value: content.dateLabel },
        { Icon: Clock3, label: content.detailLabels.time, value: content.timeLabel },
        { Icon: Ticket, label: content.detailLabels.ticket, value: content.priceLabel },
    ];

    return (
        <section id="featured-event" className={styles.wrapper}>
            <motion.div
                className={styles.surface}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <div className={styles.posterColumn}>
                    <div className={styles.posterFrame}>
                        <div className={styles.posterGlow} />
                        <img
                            className={styles.poster}
                            src={FEATURED_CONCERT_EVENT.imageUrl}
                            alt={localizedName}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className={styles.contentColumn}>
                    <div className={styles.badges}>
                        <span className={styles.eyebrow}>{content.eyebrow}</span>
                        <span className={styles.impactBadge}>{content.impactLabel}</span>
                    </div>

                    <h2 className={styles.title}>{content.headline}</h2>
                    <p className={styles.lead}>{content.lead}</p>

                    <div className={styles.venueCard}>
                        <div className={styles.venueIcon}>
                            <MapPin size={18} />
                        </div>
                        <div className={styles.venueContent}>
                            <span className={styles.venueLabel}>{content.venueLabel}</span>
                            <strong className={styles.venueName}>{content.venueName}</strong>
                            <p className={styles.venueAddress}>{content.venueAddress}</p>
                        </div>
                    </div>

                    <div className={styles.detailGrid}>
                        {detailItems.map(({ Icon, label, value }) => (
                            <div key={label} className={styles.detailCard}>
                                <div className={styles.detailIcon}>
                                    <Icon size={18} />
                                </div>
                                <span className={styles.detailLabel}>{label}</span>
                                <strong className={styles.detailValue}>{value}</strong>
                            </div>
                        ))}
                    </div>

                    <div className={styles.highlights}>
                        {content.highlights.map((item, index) => {
                            const Icon = highlightIcons[index] || Sparkles;
                            return (
                                <div key={item} className={styles.highlightCard}>
                                    <div className={styles.highlightIcon}>
                                        <Icon size={18} />
                                    </div>
                                    <p>{item}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.primaryAction}
                            onClick={() => openModal({ name: localizedName, type: 'event' })}
                        >
                            {content.primaryCta}
                            <ArrowRight size={18} />
                        </button>
                        <Link className={styles.secondaryAction} to="/events">
                            {content.secondaryCta}
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedEvent;
