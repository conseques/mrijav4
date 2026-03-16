import React, { useEffect } from 'react';
import Gallery from "../AboutUsPage/Gallery/Gallery";
import styles from './GalleryPage.module.css';

const GalleryPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Gallery />
        </div>
    );
};

export default GalleryPage;
