import React from 'react';
import ReachOut from "../AboutUsPage/ReactOut/ReachOut";
import FeaturedEvent from "./FeaturedEvent/FeaturedEvent";
import AllEvents from "./AllEvents/AllEvents";
import PastEvents from "./PastEvents/PastEvents";


const EventsPage = () => {
    return (
        <>
            <FeaturedEvent topOffset />
            <AllEvents />
            <PastEvents />
            <ReachOut/>
        </>
    );
};

export default EventsPage;
