import React from 'react'
import {Swiper} from 'swiper/react'
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
// import Tag from '../Tag';
const Index = ({children,slidesPerView=1,loop=true}) => {
    return (
        <div className='w-[100%] h-full'>
            <Swiper
                loop={loop}
                pagination={{ 
                    clickable:true
                }}
                modules={[Pagination]}
                slidesPerView={slidesPerView}
                className='my-swiper w-[100%] h-full rounded-md'
            >
                {children}
            </Swiper>
        </div>
    )
}

export default Index