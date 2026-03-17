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
            <motion.div 
                className={styles.hero_content}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className={styles.banner}>
                    <img src={flower} alt="flower"/>
                    <span className={styles.title}>{t("welcome")}<span style={{color: '#FECE00'}} >{t("brand")}</span></span>
                </div>
                <h2 className={styles.subtitle}>
                    {t("subtitle")}
                </h2>
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
                <div className={styles.image_wrapper}>
                    <img className={styles.image} src={image} alt=""/>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;