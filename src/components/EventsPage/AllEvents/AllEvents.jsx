import React from 'react';
import styles from './AllEvents.module.css'
import eventsArray from "../../HomePage/Events/eventsArray";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";

const AllEvents = () => {
    const { t } = useTranslation("events");
    const { openModal } = useOutletContext();
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h2 className={styles.title}>{t("allEventsTitle")}</h2>
                <p className={styles.subtitle}>{t("allEventsSubtitle")}</p>
                <div className={styles.content}>
                    {eventsArray.map((event, index) => <div className={styles.card} key={index}>
                        <div className={styles.image_wrapper}>
                            <img src={event.image} alt="image" loading="lazy"/>
                        </div>
                        <div className={styles.card_content}>
                            <div className={styles.duration}>
                                <span className={styles.date}>{t(event.dayKey)}</span>
                                <span className={styles.time}>{t(event.timeKey)}</span>
                            </div>
                            <h3 className={styles.name}>{t(event.nameKey)}</h3>
                            <p className={styles.description}>
                                {t(event.descriptionKey)}
                            </p>
                            <button onClick={() => openModal({ name: t(event.nameKey)})}>{t("button")}</button>
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default AllEvents;