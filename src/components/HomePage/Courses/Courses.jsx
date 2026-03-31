import React, { useRef, useState } from 'react';
import styles from './Courses.module.css';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Modal from "../../Modal/Modal";
import CourseInfo from "./CourseInfo";
import { motion } from 'framer-motion';
import courseData from './course'; // Using local static data

const Courses = () => {
    const { t, i18n } = useTranslation("courses");
    const { openModal } = useOutletContext();
    const infoModalRef = useRef();
    const [selectedCourse, setSelectedCourse] = useState(null);

    const currentLang = i18n.language || 'no';

    const handleOpenInfo = (item) => {
        // Map static data to the shape CourseInfo expects
        const mappedItem = {
            name: item.name,
            description: item.description,
            levels: item.levels,
            duration: item.duration,
            teacherPhoto: item.teacherPhoto,
            teacherNameKey: item.teacherNameKey,
            teacherInfoKey: item.teacherInfoKey,
            phone: item.phone,
            locationKey: item.locationKey,
            image: item.image
        };
        setSelectedCourse(mappedItem);
        infoModalRef.current.open();
    };

    const handleEnroll = () => {
        infoModalRef.current.close();
        openModal({ name: selectedCourse.name });
    };

    return (
        <div id="courses" className={styles.wrapper}>
            <motion.div 
                className={styles.courses_container}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <p className='main-p'>{t("education")}</p>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>{t("subtitle")}</p>
                
                <div className={styles.courses_content}>
                    {courseData.map((item, index) => (
                        <div className={styles.card} key={index}>
                            <div className={styles.image_wrapper}>
                                <img 
                                    className={styles.image} 
                                    src={item.image} 
                                    alt={t(item.name)} 
                                    loading="lazy"
                                />
                            </div>
                            <div className={styles.header}>
                                <div className={styles.column}>
                                    <p>{t(item.levels)}</p>
                                    <p>{t(item.duration)}</p>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <h2>{t(item.name)}</h2>
                                <p>{t(item.description)}</p>
                            </div>
                            <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button onClick={() => handleOpenInfo(item)} className={styles.btn} style={{ background: '#eee', color: '#333' }}>
                                    {t("moreInfo")}
                                </button>
                                <button onClick={() => openModal({ name: t(item.name) })} className={styles.btn}>
                                    {t("enroll")}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
            <Modal ref={infoModalRef}>
                {selectedCourse && (
                    <CourseInfo 
                        courseData={selectedCourse} 
                        onClose={() => infoModalRef.current.close()} 
                        onEnroll={handleEnroll} 
                    />
                )}
            </Modal>
        </div>
    );
};

export default Courses;