import React, { useRef, useState, useEffect } from 'react';
import styles from './Courses.module.css';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Modal from "../../Modal/Modal";
import CourseInfo from "./CourseInfo";
import { motion } from 'framer-motion';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const Courses = () => {
    const { t, i18n } = useTranslation("courses");
    const { openModal } = useOutletContext();
    const infoModalRef = useRef();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentLang = i18n.language || 'no';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "courses"));
                const coursesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                coursesData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setCourses(coursesData);
            } catch (err) {
                console.error("Failed to fetch courses", err);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const handleOpenInfo = (item) => {
        // Map dynamic data to the shape CourseInfo expects, roughly
        const mappedItem = {
            name: item.locales[currentLang]?.name || item.locales['en']?.name,
            description: item.locales[currentLang]?.desc || item.locales['en']?.desc,
            levels: item.locales[currentLang]?.levels || item.locales['en']?.levels,
            duration: item.locales[currentLang]?.duration || item.locales['en']?.duration,
            teacherPhoto: item.teacherPhotoUrl,
            teacherName: item.locales[currentLang]?.teacherName || item.locales['en']?.teacherName,
            teacherInfo: item.locales[currentLang]?.teacherInfo || item.locales['en']?.teacherInfo,
            phone: item.phone,
            location: item.locales[currentLang]?.location || item.locales['en']?.location,
            image: item.imageUrl
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
                
                {loading ? (
                    <p style={{ textAlign: 'center', margin: '40px 0' }}>Loading courses...</p>
                ) : (
                    <div className={styles.courses_content}>
                        {courses.map((item) => (
                            <div className={styles.card} key={item.id}>
                                <div className={styles.image_wrapper}>
                                    <img 
                                        className={styles.image} 
                                        src={item.imageUrl} 
                                        alt={item.locales[currentLang]?.name} 
                                        loading="lazy"
                                    />
                                </div>
                                <div className={styles.header}>
                                    <div className={styles.column}>
                                        <p>{item.locales[currentLang]?.levels}</p>
                                        <p>{item.locales[currentLang]?.duration}</p>
                                    </div>
                                </div>
                                <div className={styles.row}>
                                    <h2>{item.locales[currentLang]?.name}</h2>
                                    <p>{item.locales[currentLang]?.desc}</p>
                                </div>
                                <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button onClick={() => handleOpenInfo(item)} className={styles.btn} style={{ background: '#eee', color: '#333' }}>
                                        {t("moreInfo", "Детальніше")}
                                    </button>
                                    <button onClick={() => openModal({ name: item.locales[currentLang]?.name })} className={styles.btn}>
                                        {t("enroll")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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