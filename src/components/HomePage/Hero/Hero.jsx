import React, { useRef } from 'react';
import styles from './Hero.module.css';
import flower from '../../../images/hero/flower.png'
import image from '../../../images/hero/ukrainsk nasjonaldagen2 (1).jpg'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from "../../Magnetic/Magnetic";

const Hero = () => {
    const { t } = useTranslation("hero");
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

    return (
        <section ref={containerRef} className={styles.hero_container}>
            <motion.div style={{ y, opacity }} className={styles.bg_overlay}>
                <img src={image} className={styles.bg_image} alt="" />
                <div className={styles.dark_gradient} />
            </motion.div>

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
                    <Magnetic strength={0.3}>
                        <motion.button
                            onClick={() => {
                                const el = document.getElementById("membership");
                                el?.scrollIntoView({ behavior: "smooth" });
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.member_btn}>
                            {t("become")}
                        </motion.button>
                    </Magnetic>
                    <Magnetic strength={0.2}>
                        <Link to='about-us'>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={styles.learn_btn}>
                                {t("learn")}
                            </motion.button>
                        </Link>
                    </Magnetic>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;