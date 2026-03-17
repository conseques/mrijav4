import React from 'react';
import styles from './Mission.module.css';
import {useTranslation} from "react-i18next";
import { motion } from 'framer-motion';

const Mission = () => {
    const { t } = useTranslation("missions");
    return (
        <div className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <p className='main-p'>{t("whatDrivesUs")}</p>
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
            </motion.div>
        </div>
    );
};

export default Mission;