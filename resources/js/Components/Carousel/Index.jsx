import React, { useMemo } from "react";
import { Swiper } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// import Tag from '../Tag';
const Index = ({
    children,
    slidesPerView = 1,
    loop = true,
    id,
    pagination = true,
    breakpoints = {},
    className = "",
    navigation = false,
    autoPlay = {
        delay: 2000,
        disableOnInteraction: false,
    },
}) => {
    const config = useMemo(() => {
        const config = {
            modules: [Autoplay],
        };
        if (pagination) {
            config.modules = [...config.modules, Pagination];
            config.pagination = { clickable: true };
        }
        if (navigation) {
            config.modules = [...config.modules, Navigation];
        }
        return config;
    }, []);
    return (
        <div className="w-[100%] h-full">
            <Swiper
                loop={loop}
                {...config}
                autoplay={autoPlay}
                breakpoints={breakpoints}
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                }}
                slidesPerView={slidesPerView}
                navigation={navigation}
                className={`${
                    id ? id : "my-swiper"
                } w-[100%] h-full rounded-md ${className}`}
            >
                {children}
            </Swiper>
        </div>
    );
};

export default Index;
