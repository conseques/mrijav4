import React from 'react';
import { useTranslation } from "react-i18next";
import { motion } from 'framer-motion';
import styles from './CourseLeads.module.css';

import valentinaImg from '../../../images/leadership/Valentina.jpg';
import vladimirImg from '../../../images/leadership/Vladimir.jpg';
import mariaImg from '../../../images/leadership/YogaTeacher.jpg';
import sviatoslavImg from '../../../images/leadership/Sviatoslav.jpg';

const CourseLeads = () => {
    const { t } = useTranslation("courseLeads");

    const leads = [
        {
            name: t("valentina"),
            role: t("valentinaRole"),
            desc: t("valentinaDesc"),
            level: t("valentinaLevel"),
            image: valentinaImg
        },
        {
            name: t("vladimir"),
            role: t("vladimirRole"),
            desc: t("vladimirDesc"),
            level: t("vladimirLevel"),
            image: vladimirImg
        },
        {
            name: t("maria"),
            role: t("mariaRole"),
            desc: t("mariaDesc"),
            level: t("mariaLevel"),
            image: mariaImg
        },
        {
            name: t("sviatoslav"),
            role: t("sviatoslavCourseRole"),
            desc: t("sviatoslavDesc"),
            level: t("sviatoslavLevel"),
            image: sviatoslavImg
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className={styles.teamLabel}>{t("teamLabel")}</span>
                    <h1 className={styles.title}>{t("title")}</h1>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </motion.div>

                <div className={styles.grid}>
                    {leads.map((lead, index) => (
                        <motion.div 
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className={styles.imageWrapper}>
                                <img src={lead.image} alt={lead.name} className={styles.image} />
                                <div className={styles.levelBadgeWrapper}>
                                    <span className={styles.levelBadge}>{lead.level}</span>
                                </div>
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.name}>{lead.name}</h3>
                                <p className={styles.role}>{lead.role}</p>
                                <p className={styles.desc}>{lead.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseLeads;
