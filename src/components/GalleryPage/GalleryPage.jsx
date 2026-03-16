import React, { useEffect } from 'react';
import Gallery from "../AboutUsPage/Gallery/Gallery";
import GalleryCTA from "./GalleryCTA/GalleryCTA";
import styles from './GalleryPage.module.css';

const GalleryPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Gallery />
            <GalleryCTA />
        </div>
    );
};

export default GalleryPage;
