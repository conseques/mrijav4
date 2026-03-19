import React from "react";
import styles from './Events.module.css';
import eventsArray from './eventsArray';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { motion } from 'framer-motion';

const Events = () => {
    const { openModal } = useOutletContext();
    const { t } = useTranslation("events");

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.header}>
                    <span className={styles.headerBadge}>{t("community")}</span>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <div className={styles.cardsList}>
                    {eventsArray.map((event, i) => (
                        <motion.div
                            key={i}
                            className={`${styles.card} ${event.reversed ? styles.cardReversed : ''}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.07 }}
                        >
                            {/* Image Side */}
                            <div className={styles.imageSection}>
                                <img
                                    className={styles.image}
                                    src={event.image}
                                    alt={t(event.nameKey)}
                                    loading="lazy"
                                />
                                <div className={`${styles.tagBadge} ${event.tagType === 'annual' ? styles.tagAnnual : styles.tagRegular}`}>
                                    {t(event.tagKey)}
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className={styles.content}>
                                <div className={styles.dateRow}>
                                    <svg className={styles.calIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/>
                                        <line x1="8" y1="2" x2="8" y2="6"/>
                                        <line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span className={styles.date}>{t(event.dayKey)}</span>
                                    <span className={styles.separator}>·</span>
                                    <span className={styles.time}>{event.timeKey}</span>
                                </div>

                                <h3 className={styles.name}>{t(event.nameKey)}</h3>
                                <p className={styles.description}>{t(event.descriptionKey)}</p>

                                <div className={styles.footer}>
                                    <button
                                        onClick={() => openModal({ name: t(event.nameKey) })}
                                        className={styles.btn}
                                    >
                                        {t("button")}
                                        <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                            <polyline points="12 5 19 12 12 19"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Events;