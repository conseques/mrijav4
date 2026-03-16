import React, {useEffect} from 'react';
import AboutHero from "./AboutHero/AboutHero";
import AboutStats from "./AboutStats/AboutStats";
import Mission from "./Mission/Mission";
import Leadership from "./Leadership/Leadership";
import ReachOut from "./ReactOut/ReachOut";
import {useLocation} from "react-router-dom";

const AboutUsPage = () => {
    const { state } = useLocation();

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
            <ReachOut/>
        </>
    );
};

export default AboutUsPage;