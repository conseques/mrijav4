import React, { useState, useEffect } from "react";
import styles from './Events.module.css';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { motion } from 'framer-motion';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const Events = () => {
    const { openModal } = useOutletContext();
    const { t, i18n } = useTranslation("events");
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentLang = i18n.language || 'no';

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Try to sort by createdAt if it exists, otherwise leave as is
                eventsList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);

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

                {loading ? (
                    <div className={styles.loading}>Loading events...</div>
                ) : (
                    <div className={styles.cardsList}>
                        {events.map((event, i) => {
                            const localeData = event.locales?.[currentLang] || event.locales?.['no'] || {};
                            return (
                                <motion.div
                                    key={event.id}
                                    className={`${styles.card} ${i % 2 !== 0 ? styles.cardReversed : ''}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.07 }}
                                >
                                    {/* Image Side */}
                                    <div className={styles.imageSection}>
                                        <img
                                            className={styles.image}
                                            src={event.imageUrl}
                                            alt={localeData.name}
                                            loading="lazy"
                                        />
                                        <div className={`${styles.tagBadge} ${event.tagType === 'annual' ? styles.tagAnnual : styles.tagRegular}`}>
                                            {t(`tags.${event.tagType}`)}
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
                                            <span className={styles.date}>{event.day}</span>
                                            <span className={styles.separator}>·</span>
                                            <span className={styles.time}>{event.time}</span>
                                        </div>

                                        <h3 className={styles.name}>{localeData.name}</h3>
                                        <p className={styles.description}>{localeData.description}</p>

                                        <div className={styles.footer}>
                                            <button
                                                onClick={() => openModal({ name: localeData.name })}
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
                            );
                        })}
                        {events.length === 0 && !loading && (
                            <p style={{ textAlign: "center", width: "100%", color: "#64748b" }}>
                                {t("comingSoon", "Nye arrangementer kommer snart. Følg med!")}
                            </p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Events;