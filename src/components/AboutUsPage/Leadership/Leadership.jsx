import React from 'react';
import styles from './Leadership.module.css';
import oksana from '../../../images/leadership/Oksana.jpg'
import roman from '../../../images/leadership/Roman.jpg'
import sviatoslav from '../../../images/leadership/Sviatoslav.jpg'
import tetiana from '../../../images/leadership/Tetiana.jpg'
import valentina from '../../../images/leadership/Valentina.jpg'
import vladimir from '../../../images/leadership/Vladimir.jpg'
import {useTranslation} from "react-i18next";


const Leadership = () => {
    const { t } = useTranslation("leadership");
    return (
        <div className={styles.container}>
            <p className='main-p'>{t("meetTheTeam")}</p>
            <h2 className={styles.title}>{t("title")}</h2>
            <p className={styles.subtitle}>{t("subtitle")}</p>
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={oksana} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("oksana")}</p>
                        <p className={styles.position}>{t("oksanaP")}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={roman} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("roman")}</p>
                        <p className={styles.position}>{t("romanP")}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={sviatoslav} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("sviatoslav")}</p>
                        <p className={styles.position}>{t("sviatoslavP")}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={tetiana} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("tetiana")}</p>
                        <p className={styles.position}>{t("tetianaP")}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={valentina} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("valentina")}</p>
                        <p className={styles.position}>{t("valentinaP")}</p>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.image_wrapper}>
                        <img src={vladimir} alt="image"/>
                    </div>
                    <div className={styles.card_info}>
                        <p className={styles.name}>{t("vladimir")}</p>
                        <p className={styles.position}>{t("vladimirP")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leadership;