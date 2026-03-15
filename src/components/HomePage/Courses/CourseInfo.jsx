import React from 'react';
import styles from './CourseInfo.module.css';
import {useTranslation} from "react-i18next";
import closeIcon from '../../Modal/Registration/Close_MD.png';

const CourseInfo = ({ courseData, onClose, onEnroll }) => {
    const { t } = useTranslation("courses");

    if (!courseData) return null;

    return (
        <div className={styles.container}>
            <button onClick={onClose} className={styles.close}>
                <img src={closeIcon} alt="close" />
            </button>
            <h3 className={styles.title}>{t(courseData.name)}</h3>
            <div className={styles.content}>
                <div className={styles.teacherInfo}>
                    <img src={courseData.teacherPhoto} alt="teacher" className={styles.teacherImage} />
                    <div className={styles.teacherDetails}>
                        <h4>{t(courseData.teacherNameKey)}</h4>
                        <p>{t(courseData.teacherInfoKey)}</p>
                    </div>
                </div>
                <div className={styles.courseDetails}>
                    <p><strong>{t('level', 'Рівень/Level')}:</strong> {t(courseData.levels)}</p>
                    <p><strong>{t('duration', 'Тривалість/Duration')}:</strong> {t(courseData.duration)}</p>
                    <p className={styles.desc}>{t(courseData.description)}</p>
                </div>
            </div>
            <div className={styles.btn_container}>
                <button className={styles.enrollBtn} onClick={onEnroll}>{t("enroll")}</button>
            </div>
        </div>
    );
};

export default CourseInfo;