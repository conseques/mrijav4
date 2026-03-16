import React from "react";
import styles from './PastEvents.module.css';
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// We import the exact same photos from the existing array but cherry-pick the ones we want
import { pastEventsArray } from "./pastEventsArray";

import { Users, Building2, CalendarCheck, HelpCircle } from "lucide-react";

/**
 * Image Mapping based on `pastEventsArray.js`:
 * [0] - advokatmøte1.jpg
 * [1] - globusfest3.jpg
 * [2] - ivana_kupala.jpg
 * [3] - julebord2.jpg
 * [4] - lærerforum.jpg
 * [5] - pinsedag1.jpg
 * [6] - poezikveld.jpg
 * [7] - ukrainsk_nasjonaldagen2.jpg
 */

const PastEvents = () => {
    const { t } = useTranslation("events");

    return (
        <section className={styles.wrapper}>
            <div className={styles.container}>
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

                        {/* Nasjonaldagen [7] */}
                        <div className={`${styles.card} ${styles.smallCard}`}>
                            <div className={styles.imageWrapper}>
                                <img src={pastEventsArray[7].image} alt="Independence Day" loading="lazy" />
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.tag} style={{ backgroundColor: "#e0e7ff", color: "#4338ca" }}>
                                        {t("past.tags.community")}
                                    </span>
                                    <span className={styles.date}>Aug 24, 2023</span>
                                </div>
                                <h3 className={styles.cardTitle}>{t("past.events.independence.title")}</h3>
                                <p className={styles.cardDesc}>{t("past.events.independence.desc")}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Impact Stats Row */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <CalendarCheck className={styles.statIcon} color="#2563eb" size={28} />
                        <span className={styles.statLabel}>{t("past.stats.events")}</span>
                        <h4 className={styles.statValue}>30+</h4>
                    </div>
                    <div className={styles.statCard}>
                        <Users className={styles.statIcon} color="#2563eb" size={28} />
                        <span className={styles.statLabel}>{t("past.stats.volunteers")}</span>
                        <h4 className={styles.statValue}>300+</h4>
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
            </div>
        </section>
    );
};

export default PastEvents;
