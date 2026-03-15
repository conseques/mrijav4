import React from 'react';
import styles from './Support.module.css'
import mentor from '../../../images/support/mentor.png'
import house from '../../../images/support/house.png'
import job from '../../../images/support/job.png'
import help from '../../../images/support/help.png'
import image from "../../../images/support/image.jpg";
import {useTranslation} from "react-i18next";

const Support = () => {
    const { t } = useTranslation("support");
    return (
        <section className={styles.support_wrapper}>
            <div className={styles.support_container}>
                <p className='main-p'>{t("hereForYou")}</p>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>{t("subtitle")}</p>
                <div className={styles.support_content}>
                    <div className={styles.card}>
                        <img src={mentor} alt="mentor"/>
                        <h2 className={styles.card_title}>{t("mentorship")}</h2>
                        <p className={styles.card_desc}>
                            {t("mentorshipDesc")}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <img src={house} alt="house"/>
                        <h2 className={styles.card_title}>{t("housing")}</h2>
                        <p className={styles.card_desc}>
                            {t("housingDesc")}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <img src={job} alt="job"/>
                        <h2 className={styles.card_title}>{t("jobMarket")}</h2>
                        <p className={styles.card_desc}>
                            {t("jobMarketDesc")}
                        </p>
                    </div>
                    <div className={styles.card}>
                        <img src={help} alt="help"/>
                        <h2 className={styles.card_title}>{t("legal")}</h2>
                        <p className={styles.card_desc}>
                            {t("legalDesc")}
                        </p>
                    </div>
                </div>
                <div className={styles.image_wrapper}>
                    <img className={styles.image} src={image} alt="image"/>
                </div>
            </div>
        </section>
    );
};

export default Support;