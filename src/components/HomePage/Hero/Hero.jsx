import React from 'react';
import styles from './Hero.module.css';
import flower from '../../../images/hero/flower.png'
import image from '../../../images/hero/ukrainsk nasjonaldagen2 (1).jpg'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

import { motion } from 'framer-motion';

const Hero = () => {
    const { t } = useTranslation("hero");

    return (
        <section className={styles.hero_container}>
            <div className={styles.bg_overlay}>
                <img src={image} className={styles.bg_image} alt="" />
                <div className={styles.dark_gradient} />
            </div>

            <motion.div 
                className={styles.hero_content}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className={styles.banner}>
                    <img src={flower} alt="flower"/>
                    <span className={styles.welcome_text}>{t("welcome")} <span style={{color: '#FECE00'}}>{t("brand")}</span></span>
                </div>
                
                <h1 className={styles.title}>
                    {t("subtitle")}
                </h1>

                <div className={styles.buttons}>
                    <button
                        onClick={() => {
                            const el = document.getElementById("membership");
                            el?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={styles.member_btn}>
                        {t("become")}
                    </button>
                    <Link to='about-us'>
                        <button className={styles.learn_btn}>
                            {t("learn")}
                        </button>
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;