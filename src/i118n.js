import i18n from "i18next";
import { initReactI18next } from "react-i18next";


//en
import enHeader from './components/Locales/en/header.json'
import enHero from './components/Locales/en/hero.json'
import enEvents from './components/Locales/en/events.json'
import enCourses from './components/Locales/en/courses.json'
import enMembership from './components/Locales/en/membership.json'
import enSupport from './components/Locales/en/support.json'
import enNewsletter from './components/Locales/en/newsletter.json'
import enFooter from './components/Locales/en/footer.json'
import enGallery from './components/Locales/en/gallery.json'
import enMissions from './components/Locales/en/missions.json'
import enLeadership from './components/Locales/en/leadership.json'
import enReachOut from './components/Locales/en/reachOut.json'
import enEventsBanner from './components/Locales/en/eventsBanner.json'
import enFeaturedEvent from './components/Locales/en/featuredEvent.json'
import enRegister from './components/Locales/en/register.json'

//no
import noHeader from './components/Locales/no/header.json'
import noHero from './components/Locales/no/hero.json'
import noEvents from './components/Locales/no/events.json'
import noCourses from './components/Locales/no/courses.json'
import noMembership from './components/Locales/no/membership.json'
import noSupport from './components/Locales/no/support.json'
import noNewsletter from './components/Locales/no/newsletter.json'
import noFooter from './components/Locales/no/footer.json'
import noGallery from './components/Locales/no/gallery.json'
import noMissions from './components/Locales/no/missions.json'
import noLeadership from './components/Locales/no/leadership.json'
import noReachOut from './components/Locales/no/reachOut.json'
import noEventsBanner from './components/Locales/no/eventsBanner.json'
import noFeaturedEvent from './components/Locales/no/featuredEvent.json'
import noRegister from './components/Locales/no/register.json'

//ua
import uaHeader from './components/Locales/ua/header.json'
import uaHero from './components/Locales/ua/hero.json'
import uaEvents from './components/Locales/ua/events.json'
import uaCourses from './components/Locales/ua/courses.json'
import uaMembership from './components/Locales/ua/membership.json'
import uaSupport from './components/Locales/ua/support.json'
import uaNewsletter from './components/Locales/ua/newsletter.json'
import uaFooter from './components/Locales/ua/footer.json'
import uaGallery from './components/Locales/ua/gallery.json'
import uaMissions from './components/Locales/ua/missions.json'
import uaLeadership from './components/Locales/ua/leadership.json'
import uaReachOut from './components/Locales/ua/reachOut.json'
import uaEventsBanner from './components/Locales/ua/eventsBanner.json'
import uaFeaturedEvent from './components/Locales/ua/featuredEvent.json'
import uaRegister from './components/Locales/ua/register.json'


i18n.use(initReactI18next).init({
    resources: {
        en: {
            header: enHeader,
            hero: enHero,
            events: enEvents,
            courses: enCourses,
            membership: enMembership,
            support: enSupport,
            newsletter: enNewsletter,
            footer: enFooter,
            gallery: enGallery,
            missions: enMissions,
            leadership: enLeadership,
            reachOut: enReachOut,
            eventsBanner: enEventsBanner,
            featuredEvent: enFeaturedEvent,
            register: enRegister,
        },
        ua: {
            header: uaHeader,
            hero: uaHero,
            events: uaEvents,
            courses: uaCourses,
            membership: uaMembership,
            support: uaSupport,
            newsletter: uaNewsletter,
            footer: uaFooter,
            gallery: uaGallery,
            missions: uaMissions,
            leadership: uaLeadership,
            reachOut: uaReachOut,
            eventsBanner: uaEventsBanner,
            featuredEvent: uaFeaturedEvent,
            register: uaRegister,
        },
        no: {
            header: noHeader,
            hero: noHero,
            events: noEvents,
            courses: noCourses,
            membership: noMembership,
            support: noSupport,
            newsletter: noNewsletter,
            footer: noFooter,
            gallery: noGallery,
            missions: noMissions,
            leadership: noLeadership,
            reachOut: noReachOut,
            eventsBanner: noEventsBanner,
            featuredEvent: noFeaturedEvent,
            register: noRegister,
        },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;