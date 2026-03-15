import React, { useRef, useEffect } from "react";
import styles from './Events.module.css';
import eventsArray from './eventsArray';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {useTranslation} from "react-i18next";
import {useOutletContext} from "react-router-dom";

const Events = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);
    const { openModal } = useOutletContext();
    const { t } = useTranslation("events");

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.params.navigation.prevEl = prevRef.current;
            swiperRef.current.params.navigation.nextEl = nextRef.current;
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <p className="main-p">{t("community")}</p>
                <h2 className={styles.title}>{t("title")}</h2>
                <p className={styles.subtitle}>
                    {t("subtitle")}
                </p>
                <div className={styles.swiperWrapper}>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        slidesPerView={2}
                        loop={true}
                        spaceBetween={20}
                        autoplay={{
                            delay: 7000,
                            disableOnInteraction: false,
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            768: { slidesPerView: 1 },
                            1280: { slidesPerView: 2 },
                        }}
                    >
                        {eventsArray.map((event, i) => (
                            <SwiperSlide key={i}>
                                <div className={styles.card}>
                                    <div className={styles.image_wrapper}>
                                        <img
                                            className={styles.image}
                                            src={event.image}
                                            alt="event"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className={styles.card_content}>
                                        <div className={styles.duration}>
                                            <span className={styles.day}>{t(event.dayKey)}</span>
                                            <span className={styles.time}>{t(event.timeKey)}</span>
                                        </div>
                                        <h3 className={styles.name}>{t(event.nameKey)}</h3>
                                        <p className={styles.description}>{t(event.descriptionKey)}</p>
                                        <button onClick={() => openModal({ name: t(event.nameKey)})} className={styles.btn}>{t("button")}</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button ref={prevRef} className={styles.prevBtn}>
                        ❮
                    </button>
                    <button ref={nextRef} className={styles.nextBtn}>
                        ❯
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Events;