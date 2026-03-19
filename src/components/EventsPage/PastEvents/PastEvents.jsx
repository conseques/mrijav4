import React from "react";
import styles from './PastEvents.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { pastEventsArray } from "./pastEventsArray";
import { Users, CalendarCheck, HelpCircle } from "lucide-react";
import { motion } from 'framer-motion';

const PastEvents = () => {
    const { t } = useTranslation("events");

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

                {/* Grid Layout (Top Row + Bottom Row) */}
                <div className={styles.gridContainer}>
                    {/* TOP ROW: 1 Large Feature, 1 Medium Side */}
                    <div className={styles.topRow}>
                        {/* Featured (Julebord [3]) */}
                        <div className={`${styles.card} ${styles.featureCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[3].image} alt="Winter Gathering" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>
                                        {t("past.tags.annual")}
                                    </span>
                                    <span className={styles.date}>Dec 15, 2023</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.julebord.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.julebord.desc")}</p>
                            </div>
                        </div>

                        {/* Side (Lærerforum [4]) */}
                        <div className={`${styles.card} ${styles.sideCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[4].image} alt="Teachers Forum" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#ffedd5", color: "#c2410c" }}>
                                        {t("past.tags.education")}
                                    </span>
                                    <span className={styles.date}>Nov 08, 2023</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.teachers.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.teachers.desc")}</p>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM ROW: 3 Equal Small Cards */}
                    <div className={styles.bottomRow}>
                        {/* Ivana Kupala [2] */}
                        <div className={`${styles.card} ${styles.smallCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[2].image} alt="Ivana Kupala" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
                                        {t("past.tags.culture")}
                                    </span>
                                    <span className={styles.date}>Jul 06, 2023</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.kupala.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.kupala.desc")}</p>
                            </div>
                        </div>

                        {/* Poezikveld [6] */}
                        <div className={`${styles.card} ${styles.smallCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[6].image} alt="Poetry Evening" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#fce7f3", color: "#be185d" }}>
                                        {t("past.tags.literature")}
                                    </span>
                                    <span className={styles.date}>Sep 14, 2023</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.poetry.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.poetry.desc")}</p>
                            </div>
                        </div>

                        {/* General Meeting [New Entry] */}
                        <div className={`${styles.card} ${styles.smallCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[7].image} alt="Annual General Meeting" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#fef3c7", color: "#b45309" }}>
                                        {t("past.tags.meeting")}
                                    </span>
                                    <span className={styles.date}>Mar 15, 2024</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.annualReport.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.annualReport.desc")}</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                        <h4 className={styles.statValue}>500+</h4>
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
                        <a href="/#membership" className={styles.btnSolid}>{t("past.cta.volunteer")}</a>
                        <Link to="/events" className={styles.btnOutline}>{t("past.cta.upcoming")}</Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default PastEvents;
