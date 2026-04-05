import React, { useState } from 'react';
import styles from './Mission.module.css';
import {useTranslation} from "react-i18next";
import { motion } from 'framer-motion';
import HistoryModal from './HistoryModal/HistoryModal';
import narrativeImage from '../../../images/hero/mriya_community.jpg';

const Mission = () => {
    const { t } = useTranslation("missions");
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <span className={styles.tag}>{t("whatDrivesUs")}</span>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>{t("subtitle")}</p>
                <div className={styles.mission_content}>
                    <div className={styles.card}>
                        <h2>01</h2>
                        <h3>{t("inspire")}</h3>
                        <p>{t("inspireDesc")}</p>
                    </div>
                    <div className={styles.card}>
                        <h2>02</h2>
                        <h3>{t("support")}</h3>
                        <p>{t("supportDesc")}</p>
                    </div>
                    <div className={styles.card}>
                        <h2>03</h2>
                        <h3>{t("connect")}</h3>
                        <p>{t("connectDesc")}</p>
                    </div>
                    <div className={styles.card}>
                        <h2>04</h2>
                        <h3>{t("shape")}</h3>
                        <p>{t("shapeDesc")}</p>
                    </div>
                </div>

                <div className={styles.narrativeSection}>
                    <div className={styles.narrativeContainer}>
                        <div className={styles.narrativeText}>
                            <h2 className={styles.narrativeTitle}>{t("narrativeTitle")}</h2>
                            <p className={styles.narrativeDesc}>{t("narrativeDesc")}</p>
                            <div className={styles.narrativeButtons}>
                                <button 
                                    className={styles.primaryBtn}
                                    onClick={() => setIsHistoryOpen(true)}
                                >
                                    {t("btnHistory")}
                                </button>
                                <a href="/terms.html" target="_blank" rel="noreferrer" className={styles.secondaryBtn}>{t("btnBylaws")}</a>
                            </div>
                        </div>
                        <div className={styles.narrativeImageWrapper}>
                            <img 
                                alt="Mission imagery"
                                className={styles.narrativeImage}
                                src={narrativeImage}
                            />
                            <div className={styles.imageOverlay}></div>
                        </div>
                    </div>
                </div>
            </motion.div>
            <HistoryModal 
                isOpen={isHistoryOpen} 
                onClose={() => setIsHistoryOpen(false)} 
            />
        </div>
    );
};

export default Mission;
