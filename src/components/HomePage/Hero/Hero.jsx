import React, { useRef } from 'react';
import styles from './Hero.module.css';
import flower from '../../../images/hero/flower.png'
import image from '../../../images/hero/ukrainsk nasjonaldagen2 (1).jpg'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from "../../Magnetic/Magnetic";
import { ArrowUpRight, CalendarDays, HeartHandshake, Users } from 'lucide-react';
import { getFeaturedConcertContent } from "../../../content/featuredConcert";

const Hero = () => {
    const { t, i18n } = useTranslation("hero");
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });
    const featuredConcert = getFeaturedConcertContent(i18n.language);

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
    const panelY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
    const heroStats = [
        { Icon: Users, value: "400+", label: t("statsMembers") },
        { Icon: CalendarDays, value: "50+", label: t("statsEvents") },
        { Icon: HeartHandshake, value: "3+", label: t("statsSupport") },
    ];

    return (
        <section ref={containerRef} className={styles.hero_container}>
            <motion.div style={{ y, opacity }} className={styles.bg_overlay}>
                <img src={image} className={styles.bg_image} alt="" />
                <div className={styles.dark_gradient} />
            </motion.div>
            <div className={styles.noise} />
            <div className={styles.glow} />

            <div className={styles.hero_shell}>
                <motion.div
                    className={styles.hero_content}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className={styles.banner}>
                        <img src={flower} alt="" />
                        <span className={styles.welcome_text}>{t("eyebrow")}</span>
                    </div>

                    <p className={styles.intro}>
                        {t("welcome")}
                        <span>{t("brand")}</span>
                    </p>

                    <h1 className={styles.title}>{t("brand")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>

                    <div className={styles.buttons}>
                        <Magnetic strength={0.3}>
                            <motion.button
                                onClick={() => {
                                    const el = document.getElementById("featured-event");
                                    el?.scrollIntoView({ behavior: "smooth" });
                                }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={styles.member_btn}
                            >
                                {featuredConcert.heroCta}
                            </motion.button>
                        </Magnetic>
                        <Magnetic strength={0.2}>
                            <Link to='about-us'>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={styles.learn_btn}
                                >
                                    {t("learn")}
                                </motion.button>
                            </Link>
                        </Magnetic>
                    </div>
                </motion.div>

                <motion.div
                    className={styles.info_panel}
                    style={{ y: panelY }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
                >
                    <div className={styles.panel_header}>
                        <span className={styles.panel_label}>{t("location")}</span>
                        <Link to="/events" className={styles.panel_link}>
                            {t("galleryCtaEventsBtn")}
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div className={styles.stats_grid}>
                        {heroStats.map(({ Icon, value, label }) => (
                            <div key={label} className={styles.stat_card}>
                                <div className={styles.stat_icon}>
                                    <Icon size={18} />
                                </div>
                                <div className={styles.stat_value}>{value}</div>
                                <div className={styles.stat_label}>{label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
