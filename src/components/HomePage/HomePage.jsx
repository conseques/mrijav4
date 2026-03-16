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
            const el = document.querySelector(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
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
