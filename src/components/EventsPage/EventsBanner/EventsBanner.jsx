import React from 'react';
import styles from './EventsBanner.module.css';
import {useTranslation} from "react-i18next";


const EventsBanner = () => {
    const { t } = useTranslation("eventsBanner");
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.splineContainer}>
                    <iframe 
                        className={styles.splineIframe}
                        src='https://my.spline.design/particleshand-KJUEqyJ3hWU227HrmFu9nYdV/' 
                        frameBorder='0' 
                        width='100%' 
                        height='100%'
                        title="Spline Hand Mockup"
                    ></iframe>
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