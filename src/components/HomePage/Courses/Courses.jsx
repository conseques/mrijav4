import React, { useRef, useState, useEffect } from 'react';
import styles from './Courses.module.css';
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Modal from "../../Modal/Modal";
import CourseInfo from "./CourseInfo";
import { AnimatePresence, motion } from 'framer-motion';
import courseData from './course';
import Skeleton from "../../Skeleton/Skeleton";
import { useTilt } from "../../../hooks/useTilt";

const CourseCard = ({ item, t, onOpenInfo, onEnroll, index }) => {
    const { rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
    
    return (
        <motion.div 
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d"
            }}
            transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 30,
            }}
        >

            <div className={styles.image_wrapper} style={{ transform: "translateZ(20px)" }}>
                <img 
                    className={styles.image} 
                    src={item.image} 
                    alt={t(item.name)} 
                    loading="lazy"
                />
            </div>
            <div className={styles.header} style={{ transform: "translateZ(10px)" }}>
                <div className={styles.column}>
                    <p>{t(item.levels)}</p>
                    <p>{t(item.duration)}</p>
                </div>
            </div>
            <div className={styles.row} style={{ transform: "translateZ(15px)" }}>
                <h2>{t(item.name)}</h2>
                <p>{t(item.description)}</p>
            </div>
            <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '15px', transform: "translateZ(20px)" }}>
                <button onClick={() => onOpenInfo(item)} className={styles.btn} style={{ background: 'rgba(0,0,0,0.05)', color: 'inherit' }}>
                    {t("moreInfo")}
                </button>
                <button onClick={() => onEnroll({ name: t(item.name), type: 'course' })} className={styles.btn}>
                    {t("enroll")}
                </button>
            </div>
        </motion.div>
    );
};

const Courses = () => {
    const { t, i18n } = useTranslation("courses");
    const { openModal } = useOutletContext();
    const infoModalRef = useRef();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // No more artificial delay
        setIsLoading(false);
    }, []);


    const handleOpenInfo = (item) => {
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
        openModal({ name: t(selectedCourse.name), type: 'course' });
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
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div 
                                key="skeletons"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{ display: 'contents' }}
                            >
                                {Array(3).fill(0).map((_, i) => (
                                    <div key={i} className={styles.card} style={{ padding: '0', overflow: 'hidden' }}>
                                        <Skeleton height="200px" width="100%" borderRadius="0" />
                                        <div style={{ padding: '24px' }}>
                                            <Skeleton height="24px" width="60%" />
                                            <Skeleton height="16px" width="90%" className="mt-4" />
                                            <Skeleton height="16px" width="80%" />
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                                <Skeleton height="40px" width="45%" />
                                                <Skeleton height="40px" width="45%" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ display: 'contents' }}
                            >
                                {courseData.map((item, index) => (
                                    <CourseCard 
                                        key={index}
                                        index={index}
                                        item={item}
                                        t={t}
                                        onOpenInfo={handleOpenInfo}
                                        onEnroll={(data) => openModal(data)}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
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
