import React, {useEffect} from 'react';
import AboutHero from "./AboutHero/AboutHero";
import AboutStats from "./AboutStats/AboutStats";
import Mission from "./Mission/Mission";
import Leadership from "./Leadership/Leadership";
import ReachOut from "./ReactOut/ReachOut";
import {useLocation} from "react-router-dom";
import SEO from "../SEO/SEO";
import { useTranslation } from "react-i18next";

import CourseLeads from "./CourseLeads/CourseLeads";
import Gallery from "./Gallery/Gallery";

const AboutUsPage = () => {
    const { state } = useLocation();
    const { t } = useTranslation("about");

    useEffect(() => {
        if (state?.scrollTo === "contact") {
            const el = document.getElementById("contact");

            setTimeout(() => {
                el?.scrollIntoView({ behavior: "smooth" });
            }, 0);
        }
    }, [state]);

    return (
        <>
            <AboutHero/>
            <AboutStats/>
            <Mission/>
            <Leadership/>
            <CourseLeads/>
            <ReachOut/>
        </>
    );
};

export default AboutUsPage;