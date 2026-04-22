import React, { useState, useEffect } from "react";
import styles from './PastEvents.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Users, CalendarCheck, HelpCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { cacheService } from "../../../services/cacheService";
import { fetchPublicPastEvents } from "../../../services/publicApi";
import VolunteerFormNote from "../../VolunteerFormNote/VolunteerFormNote";
import { VOLUNTEER_FORM_URL } from "../../../content/volunteerForm";

// Helper function to assign colors based on tags
const getTagStyle = (tag) => {
    switch(tag?.toLowerCase()) {
        case 'annual': return { backgroundColor: "#e0f2fe", color: "#0369a1" };
        case 'education': return { backgroundColor: "#ffedd5", color: "#c2410c" };
        case 'culture': return { backgroundColor: "#dcfce7", color: "#15803d" };
        case 'literature': return { backgroundColor: "#fce7f3", color: "#be185d" };
        case 'meeting': return { backgroundColor: "#fef3c7", color: "#b45309" };
        case 'community': 
        default: return { backgroundColor: "#f3f4f6", color: "#4b5563" };
    }
};

const PastEvents = () => {
    const { t, i18n } = useTranslation("events");
    const [events, setEvents] = useState(() => cacheService.get('past_events') || []);
    const [loading, setLoading] = useState(!cacheService.get('past_events'));

    const currentLang = i18n.language || 'no';

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const { items = [] } = await fetchPublicPastEvents();
                const eventsData = [...items];
                eventsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setEvents(eventsData);
                cacheService.set('past_events', eventsData);
            } catch (err) {
                console.error("Failed to fetch past events", err);
            }
            setLoading(false);
        };
        fetchPastEvents();
    }, []);

    // Split events into Top and Bottom rows
    const topRowEvents = events.slice(0, 2);
    const bottomRowEvents = events.slice(2);

    return (
        <section className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        <h2 className={styles.title}>{t("past.title")}</h2>
                        <p className={styles.subtitle}>{t("past.subtitle")}</p>
                    </div>
                    <Link to="/gallery" className={styles.galleryLink}>
                        {t("past.viewGallery")} &rarr;
                    </Link>
                </div>

                {loading ? (
                    <p style={{textAlign: 'center', margin: '40px 0'}}>Loading past events...</p>
                ) : (
                    <div className={styles.gridContainer}>
                        {/* TOP ROW: Up to 2 events */}
                        {topRowEvents.length > 0 && (
                            <div className={styles.topRow}>
                                {topRowEvents.map((ev, idx) => (
                                    <div key={ev.id} className={`${styles.card} ${idx === 0 ? styles.featureCard : styles.sideCard}`}>
                                        <div className={styles.imageWrapper}>
                                            <img src={ev.imageUrl} alt={ev.locales[currentLang]?.title} loading="lazy" />
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardHeader}>
                                                <span className={styles.tag} style={getTagStyle(ev.tag)}>
                                                    {t(`past.tags.${ev.tag?.toLowerCase()}`, ev.tag)}
                                                </span>
                                                <span className={styles.date}>{ev.date}</span>
                                            </div>
                                            <h3 className={styles.cardTitle}>{ev.locales[currentLang]?.title || ev.locales['en']?.title}</h3>
                                            <p className={styles.cardDesc}>{ev.locales[currentLang]?.desc || ev.locales['en']?.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* BOTTOM ROW: Remaining events */}
                        {bottomRowEvents.length > 0 && (
                            <div className={styles.bottomRow}>
                                {bottomRowEvents.map((ev) => (
                                    <div key={ev.id} className={`${styles.card} ${styles.smallCard}`}>
                                        <div className={styles.imageWrapper}>
                                            <img src={ev.imageUrl} alt={ev.locales[currentLang]?.title} loading="lazy" />
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardHeader}>
                                                <span className={styles.tag} style={getTagStyle(ev.tag)}>
                                                    {t(`past.tags.${ev.tag?.toLowerCase()}`, ev.tag)}
                                                </span>
                                                <span className={styles.date}>{ev.date}</span>
                                            </div>
                                            <h3 className={styles.cardTitle}>{ev.locales[currentLang]?.title || ev.locales['en']?.title}</h3>
                                            <p className={styles.cardDesc}>{ev.locales[currentLang]?.desc || ev.locales['en']?.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Impact Stats Row */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <CalendarCheck className={styles.statIcon} color="#2563eb" size={28} />
                        <span className={styles.statLabel}>{t("past.stats.events")}</span>
                        <h4 className={styles.statValue}>50+</h4>
                    </div>
                    <div className={styles.statCard}>
                        <Users className={styles.statIcon} color="#2563eb" size={28} />
                        <span className={styles.statLabel}>{t("past.stats.volunteers")}</span>
                        <h4 className={styles.statValue}>400+</h4>
                    </div>
                    <div className={styles.statCard}>
                        <HelpCircle className={styles.statIcon} color="#2563eb" size={28} />
                        <span className={styles.statLabel}>{t("past.stats.impacted")}</span>
                        <h4 className={styles.statValue}>2000+</h4>
                    </div>
                </div>

                {/* Blue CTA Block */}
                <div className={styles.ctaBlock}>
                    <div className={styles.ctaContent}>
                        <h3 className={styles.ctaTitle}>{t("past.cta.title")}</h3>
                        <p className={styles.ctaDesc}>{t("past.cta.desc")}</p>
                    </div>
                    <div className={styles.ctaButtons}>
                        <a
                            href={VOLUNTEER_FORM_URL}
                            target="_blank"
                            rel="noreferrer"
                            className={styles.btnSolid}
                        >
                            {t("past.cta.volunteer")}
                        </a>
                        <Link to="/events" className={styles.btnOutline}>{t("past.cta.upcoming")}</Link>
                        <VolunteerFormNote className={styles.ctaNote} />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default PastEvents;
