import React from 'react';
import styles from './AboutHero.module.css';
import orgPhoto from '../../../images/hero/mriya_community.jpg';

const AboutHero = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src={orgPhoto} alt="Mriya Organization" className={styles.image} loading="lazy" />
                <div className={styles.hoverOverlay}>
                    <span className={styles.hoverText}>Mriya</span>
                </div>
            </div>
        </div>
    );
};

export default AboutHero;
