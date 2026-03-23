import React from 'react';
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpingHand, Sparkles, Heart } from 'lucide-react';
import styles from './HistoryModal.module.css';

const HistoryModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation("missions");

    if (!isOpen) return null;

    const milestones = [
        {
            year: t("history.m1.year"),
            title: t("history.m1.title"),
            desc: t("history.m1.desc"),
            icon: <HelpingHand size={24} />,
            active: false
        },
        {
            year: t("history.m2.year"),
            title: t("history.m2.title"),
            desc: t("history.m2.desc"),
            icon: <Sparkles size={24} />,
            active: false
        },
        {
            year: t("history.m3.year"),
            title: t("history.m3.title"),
            desc: t("history.m3.desc"),
            icon: <Heart size={24} />,
            active: true
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <motion.div 
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ 
                            type: "spring", 
                            damping: 25, 
                            stiffness: 300 
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>

                        <div className={styles.header}>
                            <span className={styles.logo}>MriJa</span>
                            <h2 className={styles.title}>{t("history.title")}</h2>
                        </div>

                        <div className={styles.description}>
                            <p className={styles.descText}>{t("history.p1")}</p>
                            <p className={styles.descText}>{t("history.p2")}</p>
                        </div>

                        <h3 className={styles.milestonesTitle}>{t("history.milestonesTitle")}</h3>

                        <div className={styles.timeline}>
                            {milestones.map((item, index) => (
                                <motion.div 
                                    key={index}
                                    className={`${styles.card} ${item.active ? styles.cardActive : ''}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                >
                                    <div className={styles.iconWrapper}>
                                        {item.icon}
                                    </div>
                                    <span className={styles.year}>{item.year}</span>
                                    <h4 className={styles.cardTitle}>{item.title}</h4>
                                    <p className={styles.cardDesc}>{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className={styles.footer}>
                            <p className={styles.quote}>"{t("history.quote")}"</p>
                            <div className={styles.buttons}>
                                <button className={styles.primaryBtn} onClick={() => { onClose(); window.location.href = '/#membership'; }}>
                                    {t("history.btnSupport")}
                                </button>
                                <button className={styles.secondaryBtn} onClick={onClose}>
                                    {t("history.btnClose")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
