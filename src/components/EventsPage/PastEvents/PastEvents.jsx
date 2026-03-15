import React, { useRef, useEffect } from "react";
import styles from './PastEvents.module.css';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {pastEventsArray} from "./pastEventsArray";
import {useTranslation} from "react-i18next";


const PastEvents = () => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);
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
                <p className="main-p">{t("memories")}</p>
                <h2 className={styles.title}>{t("pastEventsTitle")}</h2>
                <p className={styles.subtitle}>{t("pastEventsSubtitle")}</p>
                <div className={styles.sliderWrapper}>
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        loop={true}
                        spaceBetween={20}
                        slidesPerView={4}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            550: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {pastEventsArray.map((src, i) => (
                            <SwiperSlide key={i}>
                                <div className={styles.photoWrapper}>
                                    <img className={styles.photo} src={src.image} alt={`past-${i}`} loading="lazy" />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button ref={prevRef} className={styles.prevBtn}>❮</button>
                    <button ref={nextRef} className={styles.nextBtn}>❯</button>
                </div>
                <div className={styles.images}>
                    {pastEventsArray.map((src, i) => (
                        <div className={styles.photoWrapper} key={i}>
                            <img className={styles.photo} src={src.image} alt={`past-${i}`} loading="lazy" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default PastEvents;
