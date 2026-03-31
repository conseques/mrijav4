import React, {useEffect} from 'react';
import Hero from "./Hero/Hero";
import Events from "./Events/Events";
import Courses from "./Courses/Courses";
import Membership from "./Membership/Membership";
import Support from "./Support/Support";
import Newsletter from "./Newsletter/Newsletter";
import {useLocation} from "react-router-dom";
import DonationImpact from "./DonationImpact/DonationImpact";

const HomePage = () => {
    const { hash } = useLocation();

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
