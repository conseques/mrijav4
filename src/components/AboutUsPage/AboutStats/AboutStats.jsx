import React from 'react';
import { useTranslation } from "react-i18next";
import { Users, Calendar, Heart } from 'lucide-react';
import styles from './AboutStats.module.css';
import { motion } from 'framer-motion';

const AboutStats = () => {
    const { t } = useTranslation("hero");

    return (
        <div className={styles.statsContainer}>
            <motion.div 
                className={styles.statsGrid}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.statItem}>
                    <div className={styles.iconCircle}>
                        <Users className={styles.icon} size={24} />
                    </div>
                    <div className={styles.statNumber}>500+</div>
                    <div className={styles.statLabel}>{t("statsMembers")}</div>
                </div>
                
                <div className={styles.statItem}>
                    <div className={styles.iconCircle}>
                        <Calendar className={styles.icon} size={24} />
                    </div>
                    <div className={styles.statNumber}>50+</div>
                    <div className={styles.statLabel}>{t("statsEvents")}</div>
                </div>

                <div className={styles.statItem}>
                    <div className={styles.iconCircle}>
                        <Heart className={styles.icon} size={24} />
                    </div>
                    <div className={styles.statNumber}>3 Years</div>
                    <div className={styles.statLabel}>{t("statsSupport")}</div>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutStats;
