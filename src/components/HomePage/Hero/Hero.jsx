import React from 'react';
import styles from './Hero.module.css';
import flower from '../../../images/hero/flower.png'
import image from '../../../images/hero/ukrainsk nasjonaldagen2 (1).jpg'
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

const Hero = () => {
    const { t } = useTranslation("hero");

    return (
        <section className={styles.hero_container}>
            <div className={styles.hero_content}>
                <div className={styles.banner}>
                    <img src={flower} alt="flower"/>
                    <span className={styles.title}>{t("welcome")}<span style={{color: '#FECE00'}} > MriJa </span> {t("norway")}</span>
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
            </div>
        </section>
    );
};

export default Hero;