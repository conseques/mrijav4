import React from 'react';
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";

import styles from './Leadership.module.css';

import oksana from '../../../images/leadership/Oksana.jpg';
import roman from '../../../images/leadership/Roman.jpg';
import sviatoslav from '../../../images/leadership/Sviatoslav.jpg';
import tetiana from '../../../images/leadership/Tetiana.jpg';
import valentina from '../../../images/leadership/Valentina.jpg';
import vladimir from '../../../images/leadership/Vladimir.jpg';

const Leadership = () => {
    const { t } = useTranslation("leadership");

    const leaders = [
        { name: t("oksana"), position: t("oksanaP"), image: oksana },
        { name: t("roman"), position: t("romanP"), image: roman },
        { name: t("sviatoslav"), position: t("sviatoslavP"), image: sviatoslav },
        { name: t("tetiana"), position: t("tetianaP"), image: tetiana },
        { name: t("valentina"), position: t("valentinaP"), image: valentina },
        { name: t("vladimir"), position: t("vladimirP"), image: vladimir },
    ];

    return (
        <section className={styles.section}>
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
                            <img className={styles.cardImage} src={leader.image} alt={leader.name} />
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
            
            {/* Keeping the CTA block at the bottom since it was part of the leadership Stitch component but maybe adapting it slightly or we just leave only the leadership cards.
                The Stitch block had:
                <section class="mt-24 p-12 rounded-3xl bg-dark-blue text-white... ">
                Since the legacy section didn't have this, I will add it using styled modules to completely fulfill the new layout design.
            */}
        </section>
    );
};

export default Leadership;