import React, { useEffect } from 'react';
import Gallery from "../AboutUsPage/Gallery/Gallery";
import GalleryCTA from "./GalleryCTA/GalleryCTA";
import styles from './GalleryPage.module.css';
import SEO from "../SEO/SEO";
import { useTranslation } from "react-i18next";


const GalleryPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { t } = useTranslation("gallery");

    return (
        <div className={styles.pageContainer}>
            <SEO 
                title={t("title", "Gallery")} 
                description={t("subtitle", "Explore our community photos and moments from Mrija events.")}
            />
            <Gallery />
            <GalleryCTA />
        </div>

    );
};

export default GalleryPage;
