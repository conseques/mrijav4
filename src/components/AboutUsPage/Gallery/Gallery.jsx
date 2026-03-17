import React from 'react';
import styles from './Gallery.module.css';
import { useTranslation } from "react-i18next";
import pic1 from '../../../images/gallery/8ca31.jpg'
import pic2 from '../../../images/gallery/julebord3.jpg'
import pic3 from '../../../images/gallery/pinsedag.jpg'
import pic4 from '../../../images/gallery/pinsedag2.jpg'
import pic5 from '../../../images/gallery/ece8ef.jpg'
import pic6 from '../../../images/gallery/julebord.jpg'
import pic7 from '../../../images/gallery/poezikveld1.jpg'
import pic8 from '../../../images/gallery/6d126.jpg'
import { motion } from 'framer-motion';

const Gallery = () => {
    const { t } = useTranslation("gallery");

    const galleryItems = [
        { src: pic1, name: t("events.advokat"), class: styles.tall },
        { src: pic2, name: t("events.julebord3"), class: styles.wide },
        { src: pic3, name: t("events.pinsedag"), class: styles.square },
        { src: pic4, name: t("events.pinsedag2"), class: styles.tall },
        { src: pic5, name: t("events.ece8ef"), class: styles.square },
        { src: pic6, name: t("events.julebord"), class: styles.wide },
        { src: pic7, name: t("events.poezikveld1"), class: styles.tall },
        { src: pic8, name: t("events.demo"), class: styles.wide }
    ];

    return (
        <div className={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.header}>
                    <p className='main-p'>{t("moments")}</p>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.subtitle}>
                        {t("subtitle")}
                    </p>
                </div>
                
                <div className={styles.galleryGrid}>
                    {galleryItems.map((item, index) => (
                        <div key={index} className={`${styles.imageWrapper} ${item.class}`}>
                            <img src={item.src} alt={item.name} loading="lazy" />
                            <div className={styles.hoverOverlay}>
                                <span className={styles.eventName}>{item.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Gallery;