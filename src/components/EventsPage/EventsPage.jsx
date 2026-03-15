import React from 'react';
import ReachOut from "../AboutUsPage/ReactOut/ReachOut";
import EventsBanner from "./EventsBanner/EventsBanner";
import FeaturedEvent from "./FeaturedEvent/FeaturedEvent";
import AllEvents from "./AllEvents/AllEvents";
import PastEvents from "./PastEvents/PastEvents";


const EventsPage = () => {
    return (
        <>
            <EventsBanner />
            {/*<FeaturedEvent/>*/}
            <AllEvents />
            <PastEvents />
            <ReachOut/>
        </>
    );
};

export default EventsPage;