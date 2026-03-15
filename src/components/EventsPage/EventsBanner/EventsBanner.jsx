import React from 'react';
import styles from './EventsBanner.module.css';
import img1 from '../../../images/eventsBanner/1img.jpg'
import img2 from '../../../images/eventsBanner/3img.jpg'
import img3 from '../../../images/eventsBanner/2img.jpg'
import {useTranslation} from "react-i18next";


const EventsBanner = () => {
    const { t } = useTranslation("eventsBanner");
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.images}>
                    <div className={styles.row1}>
                        <div className={styles.image1_wrapper}>
                            <img src={img1} alt="image"/>
                        </div>
                        <div className={styles.image2_wrapper}>
                            <img src={img2} alt="image"/>
                        </div>
                    </div>
                    <div className={styles.row2}>
                        <div className={styles.image3_wrapper}>
                            <img src={img3} alt="image"/>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <span className={styles.span}>{t("communityEvents")}</span>
                    <h2 className={styles.title}>{t("title")}</h2>
                    <p className={styles.subtitle}>{t("subtitle")}</p>
                </div>
            </div>
        </div>
    );
};

export default EventsBanner;