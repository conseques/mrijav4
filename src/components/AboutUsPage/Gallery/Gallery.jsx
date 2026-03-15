import React from 'react';
import styles from './Gallery.module.css';
import pic1 from '../../../images/gallery/8ca31.jpg'
import pic2 from '../../../images/gallery/julebord3.jpg'
import pic3 from '../../../images/gallery/pinsedag.jpg'
import pic4 from '../../../images/gallery/pinsedag2.jpg'
import pic5 from '../../../images/gallery/ece8ef.jpg'
import pic6 from '../../../images/gallery/julebord.jpg'
import pic7 from '../../../images/gallery/poezikveld1.jpg'
import pic8 from '../../../images/gallery/6d126.jpg'
import {useTranslation} from "react-i18next";

const Gallery = () => {
    const { t } = useTranslation("gallery");
    return (
        <div className={styles.container}>
            <p className='main-p'>{t("moments")}</p>
            <h2 className={styles.title}>{t("title")}</h2>
            <p className={styles.subtitle}>
                {t("subtitle")}
            </p>
            <div className={styles.gallery_content}>
                <div className={styles.image_wrapper}>
                    <img src={pic1} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic2} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic3} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic4} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic5} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic6} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic7} alt="image"/>
                </div>
                <div className={styles.image_wrapper}>
                    <img src={pic8} alt="image"/>
                </div>
            </div>
        </div>
    );
};

export default Gallery;