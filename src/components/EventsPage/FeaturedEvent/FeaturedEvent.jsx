import React from 'react';
import styles from './FeaturedEvent.module.css'
import event from './event.jpg'
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import { motion } from 'framer-motion';

const FeaturedEvent = () => {
    const { t } = useTranslation("featuredEvent");
    const { openModal } = useOutletContext();
    return (
        <div className={styles.container}>
            <p className='main-p'>{t("dontMiss")}</p>
            <h1 className={styles.title}>{t("title")}</h1>
            {/*<h2 className={styles.h2}>{t("h2")}</h2>*/}
            <motion.div 
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.image_wrapper}>
                    <img src={event} alt="image" loading="lazy"/>
                </div>
                <div className={styles.card_content}>
                    <div className={styles.properties}>
                        <span className={styles.students}>{t("students")}</span>
                        <span className={styles.free}>{t("price")}</span>
                    </div>
                    <div className={styles.duration}>
                        <span className={styles.date}>{t("day")}</span>
                        <span className={styles.time}>{t("time")}</span>
                    </div>
                    <h3 className={styles.name}>{t("name")}</h3>
                    <p className={styles.description}>{t("description")}</p>
                    <button onClick={() => openModal({ name: t("name")})}>{t("button")}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default FeaturedEvent;