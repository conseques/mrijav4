import React, { useState, useEffect } from "react";
import styles from './Events.module.css';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';

import Skeleton from "../../Skeleton/Skeleton";
import { useTilt } from "../../../hooks/useTilt";
import { cacheService } from "../../../services/cacheService";
import { filterOutFeaturedConcert } from "../../../content/featuredConcert";
import { fetchPublicEvents } from "../../../services/publicApi";


const EventCard = ({ event, i, currentLang, t, openModal }) => {
    const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
    const localeData = event.locales?.[currentLang] || event.locales?.['no'] || {};
    
    return (
        <motion.div
            key={event.id}
            className={`${styles.card} ${i % 2 !== 0 ? styles.cardReversed : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                delay: i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}

        >
            {/* Image Side */}
            <div className={styles.imageSection} style={{ transform: "translateZ(20px)" }}>
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
            <div className={styles.content} style={{ transform: "translateZ(10px)" }}>
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
                        onClick={() => openModal({ name: localeData.name, type: 'event' })}
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
};

const Events = () => {
    const { openModal } = useOutletContext();
    const { t, i18n } = useTranslation("events");
    const [events, setEvents] = useState(() => filterOutFeaturedConcert(cacheService.get('events') || []));
    const [loading, setLoading] = useState(!cacheService.get('events'));

    const currentLang = i18n.language || 'no';

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { items = [] } = await fetchPublicEvents();
                const eventsList = filterOutFeaturedConcert(items);
                eventsList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                
                setEvents(eventsList);
                cacheService.set('events', eventsList);
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
                    <div className={styles.headerTop}>
                        <span className={styles.headerBadge}>{t("community")}</span>
                    </div>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="skeletons"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={styles.cardsList}
                        >
                            {Array(2).fill(0).map((_, i) => (
                                <div key={i} className={`${styles.card} ${i % 2 !== 0 ? styles.cardReversed : ''}`} style={{ padding: 0 }}>
                                    <div className={styles.imageSection}>
                                        <Skeleton height="100%" width="100%" borderRadius="0" />
                                    </div>
                                    <div className={styles.content} style={{ padding: '40px' }}>
                                        <Skeleton height="20px" width="40%" />
                                        <Skeleton height="32px" width="70%" className="mt-4" />
                                        <Skeleton height="16px" width="100%" className="mt-4" />
                                        <Skeleton height="16px" width="90%" />
                                        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                                            <Skeleton height="44px" width="140px" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.cardsList}
                        >
                            {events.map((event, i) => (
                                <EventCard 
                                    key={event.id}
                                    event={event}
                                    i={i}
                                    currentLang={currentLang}
                                    t={t}
                                    openModal={openModal}
                                />
                            ))}
                            {events.length === 0 && !loading && (
                                <p className={styles.emptyState}>
                                    {t("comingSoon", "Nye arrangementer kommer snart. Følg med!")}
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};

export default Events;
