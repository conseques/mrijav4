import React, { useState, useEffect } from 'react';
import styles from './AllEvents.module.css'
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";
import { motion } from 'framer-motion';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const AllEvents = () => {
    const { t, i18n } = useTranslation("events");
    const { openModal } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentLang = i18n.language || 'no';

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "events"));
                const eventsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by creation date
                eventsList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching all events:", error);
            }
            setLoading(false);
        };

        fetchEvents();
    }, []);

    return (
        <div className={styles.wrapper}>
            <motion.div 
                className={styles.container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <h2 className={styles.title}>{t("allEventsTitle")}</h2>
                <p className={styles.subtitle}>{t("allEventsSubtitle")}</p>
                <div className={styles.content}>
                    {loading ? (
                        <p>Loading events...</p>
                    ) : (
                        events.map((event) => {
                            const localeData = event.locales?.[currentLang] || event.locales?.['no'] || {};
                            return (
                                <div className={styles.card} key={event.id}>
                                    <div className={styles.image_wrapper}>
                                        <img src={event.imageUrl} alt={localeData.name} loading="lazy" />
                                    </div>
                                    <div className={styles.card_content}>
                                        <div className={styles.duration}>
                                            <span className={styles.date}>{event.day}</span>
                                            <span className={styles.time}>{event.time}</span>
                                        </div>
                                        <h3 className={styles.name}>{localeData.name}</h3>
                                        <p className={styles.description}>
                                            {localeData.description}
                                        </p>
                                        <button onClick={() => openModal({ name: localeData.name })}>{t("button")}</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    {events.length === 0 && !loading && (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b' }}>
                            {t("comingSoon", "There are no upcoming events at the moment.")}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AllEvents;