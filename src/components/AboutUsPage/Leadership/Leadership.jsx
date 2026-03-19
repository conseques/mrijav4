import React from 'react';
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import styles from './Leadership.module.css';
import oksana from '../../../images/leadership/Oksana.jpg';
import roman from '../../../images/leadership/Roman.jpg';
import sviatoslav from '../../../images/leadership/Sviatoslav.jpg';
import tetiana from '../../../images/leadership/Tetiana.jpg';
import { motion } from 'framer-motion';

const Leadership = () => {
    const { t } = useTranslation("leadership");

    const leaders = [
        { name: t("roman"), position: t("romanP"), image: roman },
        { 
            name: t("sviatoslav"), 
            position: t("sviatoslavP"), 
            image: sviatoslav
        },
        { name: t("tetiana"), position: t("tetianaP"), image: tetiana },
    ];

    return (
        <section className={styles.section}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.header}>
                    <div className={styles.teamLabelWrapper}>
                        <div className={styles.teamLabelBar}></div>
                        <span className={styles.teamLabelText}>{t("meetTheTeam", "Vårt team")}</span>
                    </div>
                    <h1 className={styles.title}>{t("title", "Vårt lederskap")}</h1>
                    <p className={styles.subtitle}>{t("subtitle", "Møt de dedikerte menneskene som driver vårt oppdrag fremover. Vi jobber sammen for å skape varig positiv endring.")}</p>
                </div>
                <div className={styles.grid}>
                    {leaders.map((leader, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.cardImageWrapper}>
                                <div className={styles.cardImageOverlay}></div>
                                <img 
                                    className={styles.cardImage} 
                                    src={leader.image} 
                                    alt={leader.name} 
                                />
                                <div className={styles.cardMailWrapper}>
                                    <div className={styles.cardMailIcon}>
                                        <Mail size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardInfo}>
                                <p className={styles.cardName}>{leader.name}</p>
                                <p className={styles.cardPosition}>{leader.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Leadership;