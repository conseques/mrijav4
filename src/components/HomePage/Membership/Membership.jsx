import React, { useState } from 'react';
import styles from './Membership.module.css'
import individual from '../../../images/membership/individual.png';
import family from '../../../images/membership/family.png';
import organization from '../../../images/membership/organization.png';
import {useTranslation} from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion';
import MembershipForm from './MembershipForm';

const Membership = () => {
    const { t } = useTranslation("membership");
    const [showForm, setShowForm] = useState(false);

    const handlePaymentRedirect = () => {
        window.open("https://betal.vipps.no/j97dnt", "_blank");
        setShowForm(false);
    };

    return (
        <section id='membership' className={styles.membership_wrapper}>
            <motion.div 
                className={styles.membership_container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <p className='main-p'>{t("join")}</p>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>{t("subtitle")}</p>
                <div className={styles.membership_content}>
                    <div className={styles.card}>
                        <img src={individual} alt="individual"/>
                        <p className={styles.name}>
                            {t("Voksen")}
                        </p>
                        <p className={styles.price_container}><span className={styles.price}>100 NOK</span>/{t("year")}</p>
                        <div className={styles.cardBody}>
                            <AnimatePresence mode='wait'>
                                {!showForm ? (
                                    <motion.div
                                        key="benefits"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className={styles.description}>
                                            {t("individualDesc")}
                                        </p>
                                        <ul className={styles.list}>
                                            <li>{t("accessEvents")}</li>
                                            <li>{t("communitySupport")}</li>
                                            <li>{t("newsletter")}</li>
                                        </ul>
                                        <button 
                                            className={styles.btn} 
                                            onClick={() => setShowForm(true)}
                                        >
                                            {t("subscribe")}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <MembershipForm onComplete={handlePaymentRedirect} />
                                        <button 
                                            className={styles.backBtn}
                                            onClick={() => setShowForm(false)}
                                        >
                                            {t("back", "Back")}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <img src={organization} alt="organization"/>
                        <p className={styles.name}>
                            {t("organization")}
                        </p>
                        <p className={styles.contact}>{t("contact")}</p>
                        <div>
                            <p className={styles.description}>
                                {t("contactDesc")}
                            </p>
                            <ul className={styles.list}>
                                <li>{t("partnership")}</li>
                                <li>{t("sponsor")}</li>
                                <li>{t("volunteer")}</li>
                            </ul>
                            <button
                                onClick={() => {
                                    const el = document.getElementById("footer");
                                    el?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className={styles.btn}>{t("contactUs")}</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default Membership;