import React, { useState } from 'react';
import styles from './Mission.module.css';
import {useTranslation} from "react-i18next";
import { motion } from 'framer-motion';
import HistoryModal from './HistoryModal/HistoryModal';

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
                                <button className={styles.secondaryBtn}>{t("btnBylaws")}</button>
                            </div>
                        </div>
                        <div className={styles.narrativeImageWrapper}>
                            <img 
                                alt="Mission imagery"
                                className={styles.narrativeImage}
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9iM_-rJU3NUZdTq4ylC0sH7PaRqig2cBudeGVYnziE0KFNr9dVac0bzwLVkS1qRxEqquJIRCCn--qYsBzgYAVpfHrdeenwqScFrTKN4mT7rv_KMsbx1mByam3Y_8IVlHt-6Wjl0eC8EW-uf55_MgNRxHrNydVdHzVQAC1TqqPEl3NDnCVeOw3zEw48klAZ_aGoaPFCWvT8KICJW5G-2XNNIyJFwVgdHPqSuyxO3pmcVx8lJnIeoFndbR1gOgiP7KDpUxLh3XoVms" 
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