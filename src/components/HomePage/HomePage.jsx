import React, {useEffect} from 'react';
import Hero from "./Hero/Hero";
import Events from "./Events/Events";
import Courses from "./Courses/Courses";
import Membership from "./Membership/Membership";
import Support from "./Support/Support";
import Newsletter from "./Newsletter/Newsletter";
import {useLocation} from "react-router-dom";
import DonationImpact from "./DonationImpact/DonationImpact";

import SEO from "../SEO/SEO";
import { useTranslation } from "react-i18next";

const HomePage = () => {
    const { hash } = useLocation();
    const { t } = useTranslation("hero");

    useEffect(() => {
        if (hash) {
            const scroll = () => {
                const el = document.querySelector(hash);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            };
            scroll();
            // Fire again to handle async layout shifts from network fetching
            setTimeout(scroll, 300);
            setTimeout(scroll, 800);
        }
    }, [hash]);
    return (
        <>
            <SEO 
                title={t("seoTitle", "Home")} 
                description={t("seoDescription", "Empowering the Ukrainian community in Norway.")}
                keywords="Mrija, Mrija Drammen, Ukrainian Association Norway, Мрія Драммен"
            />
            <h1 className="visually-hidden">Mrija - Ukrainian Association in Drammen, Norway</h1>
            <Hero />
            <DonationImpact />
            <Events />
            <Courses />
            <Membership />
            <Support />
            <Newsletter />
        </>
    );
};

export default HomePage;
