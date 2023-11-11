import Button from '@/Components/Button'
import MangaCard from '@/Components/MangaCard'
import MovieCard from '@/Components/MovieCard'
import Navbar from '@/Components/Navbar'
import NewEpisodeCard from '@/Components/NewEpisodeCard'
import SectionContainer from '@/Components/SectionContainer'
// import Tag from '@/Components/Tag'
import { Link } from '@inertiajs/react'
import Logo from '../../../assets/logo.png'
import React from 'react'
import UserLayout from '@/Layouts/UserLayout'
import Carousel from '@/Components/Carousel/Index'
import { SwiperSlide } from 'swiper/react'
import Tag from '@/Components/Tag'
// import { SwiperSlide } from 'swiper/react'

function Index({trendAnimes,newAnimes,recommendedAnime,continueWatchingAnimes,popularAnimes,popularMangas}) {
    return (
        <div>
            <Navbar />
            <SectionContainer>
                <div className='flex h-[75vh] mt-[30px]'>
                    <div className='w-[70%] h-full'>
                        <div className='flex items-center mb-4 text-yellow-400 gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><g fill="none"><path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M6.999 7.57L9 1l2.002 6.571L17 9.764l-5.952 2.364L9 19l-2.048-6.872L1 9.764L6.999 7.57Z"/><path fill="currentColor" stroke="currentColor" d="M17.085 13.574A.084.084 0 0 0 17 13.5a.084.084 0 0 0-.085.074c-.199 1.994-.345 2.577-2.338 2.765a.083.083 0 0 0-.077.082c0 .043.033.078.077.082c1.965.185 2.136.896 2.338 2.923A.085.085 0 0 0 17 19.5c.044 0 .08-.032.085-.074c.202-2.027.372-2.738 2.338-2.923a.083.083 0 0 0 .077-.082a.083.083 0 0 0-.077-.082c-1.993-.188-2.14-.77-2.338-2.765Z"/><path fill="currentColor" d="M9 20c-.44 0-.83-.29-.96-.71l-1.91-6.41l-5.5-2.19c-.38-.15-.63-.52-.63-.94c0-.42.27-.78.66-.93L6.19 6.8L8.04.71C8.17.29 8.56 0 9 0c.44 0 .83.29.96.71l1.86 6.09l5.53 2.02c.39.14.65.51.66.93c.01.42-.25.79-.63.94l-5.5 2.18l-1.91 6.41c-.13.42-.52.71-.96.71L9 20ZM3.81 9.8l3.51 1.4c.28.11.5.35.59.64L9 15.5l1.09-3.66c.09-.29.3-.53.59-.64l3.51-1.4l-3.54-1.29c-.29-.11-.52-.35-.61-.65L9 4.43L7.96 7.86c-.09.3-.32.54-.61.65L3.81 9.8ZM17 20c-.3 0-.55-.23-.58-.53c-.2-1.95-.28-2.32-1.89-2.47a.585.585 0 0 1-.53-.58c0-.3.23-.55.53-.58c1.61-.15 1.7-.4 1.89-2.32a.585.585 0 0 1 1.16 0c.19 1.92.28 2.17 1.89 2.32c.3.03.53.28.53.58c0 .3-.22.55-.52.58c-1.61.15-1.7.52-1.9 2.47c-.03.3-.28.52-.58.52V20Z"/></g></svg>
                            <p className='font-semibold'>News</p>
                        </div>
                        <Carousel>
                            {
                                trendAnimes?.map((anime,i) => (
                                    <SwiperSlide key={i}  className='w-full h-full'>
                                        <div className='relative w-full h-full  overflow-hidden text-white'>
                                            <img className='absolute z-10 top-0 left-0  right-0 bottom-0 w-full h-full object-cover' src={anime?.background_image} alt="" />
                                            <div className='relative z-20 pt-40 pl-10 pb-12'>
                                                <p className='font-semibold flex items-center'>Home <span className='inline-block h-4 mx-1 border-l-2 border-white'></span>TV</p>
                                                <h1 className='text-4xl font-extrabold mt-4'>{anime.name}</h1>
                                                <p className='flex items-center mt-3 mb-3'>Ep 24 <span className='block w-1 h-1 rounded-full bg-white mx-1'></span>24m</p>
                                                <div className='flex items-center gap-2'>
                                                    {
                                                        anime?.tags.map((tag,i) => (
                                                            <Tag key={i} text={tag?.name} className="bg-[#47BE71]" />
                                                        ))
                                                    }
                                                </div>
                                                <p className='w-[40%] mt-3 font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur, repudiandae quas nam pariatur ullam optio provident, esse at quam sunt eum voluptates nisi quis autem velit harum, voluptate hic voluptatem.</p>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            }
                            
                        </Carousel>
                    </div>
                    <div className='w-[30%] ml-4'>
                        <div className='flex items-center mb-4 text-yellow-400 gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><g fill="none"><path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M6.999 7.57L9 1l2.002 6.571L17 9.764l-5.952 2.364L9 19l-2.048-6.872L1 9.764L6.999 7.57Z"/><path fill="currentColor" stroke="currentColor" d="M17.085 13.574A.084.084 0 0 0 17 13.5a.084.084 0 0 0-.085.074c-.199 1.994-.345 2.577-2.338 2.765a.083.083 0 0 0-.077.082c0 .043.033.078.077.082c1.965.185 2.136.896 2.338 2.923A.085.085 0 0 0 17 19.5c.044 0 .08-.032.085-.074c.202-2.027.372-2.738 2.338-2.923a.083.083 0 0 0 .077-.082a.083.083 0 0 0-.077-.082c-1.993-.188-2.14-.77-2.338-2.765Z"/><path fill="currentColor" d="M9 20c-.44 0-.83-.29-.96-.71l-1.91-6.41l-5.5-2.19c-.38-.15-.63-.52-.63-.94c0-.42.27-.78.66-.93L6.19 6.8L8.04.71C8.17.29 8.56 0 9 0c.44 0 .83.29.96.71l1.86 6.09l5.53 2.02c.39.14.65.51.66.93c.01.42-.25.79-.63.94l-5.5 2.18l-1.91 6.41c-.13.42-.52.71-.96.71L9 20ZM3.81 9.8l3.51 1.4c.28.11.5.35.59.64L9 15.5l1.09-3.66c.09-.29.3-.53.59-.64l3.51-1.4l-3.54-1.29c-.29-.11-.52-.35-.61-.65L9 4.43L7.96 7.86c-.09.3-.32.54-.61.65L3.81 9.8ZM17 20c-.3 0-.55-.23-.58-.53c-.2-1.95-.28-2.32-1.89-2.47a.585.585 0 0 1-.53-.58c0-.3.23-.55.53-.58c1.61-.15 1.7-.4 1.89-2.32a.585.585 0 0 1 1.16 0c.19 1.92.28 2.17 1.89 2.32c.3.03.53.28.53.58c0 .3-.22.55-.52.58c-1.61.15-1.7.52-1.9 2.47c-.03.3-.28.52-.58.52V20Z"/></g></svg>
                            <p>News</p>
                        </div>
                        <div className='bg-[#0D0D0D] rounded-md flex h-full flex-col  gap-5 px-6 py-10 text-white'>
                            {
                                newAnimes?.map((anime,i) => (
                                    <div key={i} className='flex items-center gap-3'>
                                        <div className='flex items-center gap-4'>
                                            <p className='font-bold text-lg'>0{i+1}</p>
                                            <img className='w-10 h-16 object-cover' src={anime?.thumbnail} alt="" />
                                        </div>
                                        <div className='flex flex-col flex-grow ml-3'>
                                            <h1 className='pb-2 font-semibold'>{anime?.name}</h1>
                                            <div className='flex items-center gap-4'>
                                                <div className=' flex items-center gap-3'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"/></svg>
                                                    <span>2000</span>
                                                </div>
                                                <div className='flex items-center gap-3'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"/></svg>
                                                    <span>1000</span>
                                                </div>
                                            </div>
                  
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                <div className='rounded-lg mb-20 mt-20 relative overflow-hidden px-5 py-8' style={{ background:'linear-gradient(90deg, rgba(203,177,48,0.6285364487591911) 0%, rgba(249,181,45,1) 42%)' }}>
                    <div className='w-[400px] h-[400px] z-10 right-28 bottom-0 translate-y-[30%] rounded-full bg-[rgba(230,216,142,0.63)] absolute'></div>
                    <div className='w-[340px] h-[340px] z-20 right-36 bottom-0 translate-y-[27%] rounded-full bg-[#caab79] absolute'></div>
                    <div className='w-[280px] h-[280px] z-30 right-44 bottom-0 translate-y-[22%] rounded-full bg-[#FFF2DE] absolute'></div>
                    <img className='absolute w-[280px] z-40 object-contain bottom-0 right-40 h-[210px]' src={recommendedAnime?.transparent_background} alt="" />
                    <h1 className='text-3xl font-extrabold uppercase'>Watch {recommendedAnime?.name}</h1>
                    <div className='flex items-center my-5 mb-7 font-semibold'>
                        {
                            recommendedAnime?.tags.map((tag,i) => (
                                <>
                                    <span>{tag.name}</span>
                                    {
                                        i+ 1 !== recommendedAnime?.tags.length  &&
                                    <div className='border-l-[3px] mx-1 border-black h-5'></div>
                                    }
                                </>
                            ))
                        }
                        
                    </div>
                    <div className='flex items-center gap-9'>
                        <Button text={'Read Now'} className={'!bg-black'} link="https://www.google.com" />
                        <Link href='https://www.google.com' className='underline'>Go to Website</Link>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                <div className='mt-5'>
                    <div className='flex items-center gap-4 text-yellow-400 font-semibold'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z" clipRule="evenodd"/></svg>
                        <span className='text-lg'>Continue Watching</span>
                    </div>
                    <div className='grid mt-4 lg:grid-cols-4 gap-4'>
                        {
                            continueWatchingAnimes?.map(anime => <MovieCard key={anime.id} anime={anime} />)
                        }
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                <div className='flex items-center gap-8 bg-[#0D0D0D] rounded-md mt-8'>
                    <div className='basis-[40%] flex items-center'>
                        <img className='w-[60%] object-cover h-full' src={recommendedAnime?.transparent_background} alt="" />
                        <div className='w-[40%] h-full'>
                            <img className='w-full h-full object-cover' src={recommendedAnime?.thumbnail} alt="" />
                        </div>
                    </div>
                    <div className='basis-[60%] text-white'>
                        <Link href="#" className='hover:underline'>
                            <h1 className='text-2xl font-bold'>{recommendedAnime?.name}</h1>
                        </Link>
                        <div className='flex items-center gap-1 my-3'>
                            <span className='text-[#40ecf8]'>Series</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"/></svg>
                            <span>Subtitled</span>
                        </div>
                        <p className='w-[95%]'>{recommendedAnime?.description}</p>
                        <div className='mt-4 flex items-center gap-8'>
                            <Button className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} text={'Start Watching S1 Ep1'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"/></svg>} />
                            <Button outline text={'Add To WatchList'} className={'!px-8 rounded-none !gap-1 border-[#F47521] text-[#F47521]'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"/></svg>} />
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer  className={'bg-black mt-8'} padding={false}>
                <div className='px-10 text-white py-20'>
                    <div className='flex items-center gap-3'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24"><path fill="currentColor" d="m10 14l6-4l-6-4v8Zm-8 8V2h20v16H6l-4 4Zm2-6h16V4H4v12Zm0 0V4v12Z"/></svg>
                        <span className='text-xl font-bold'>New Episodes</span>
                    </div>
                    <div>
                        <div>
                            <h1 className='text-lg font-bold border-b-2 broder-white py-3 mb-5'>Today</h1>
                            <div className='grid grid-cols-3 gap-10'>
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                            </div>
                        </div>
                        <div>
                            <h1 className='text-lg font-bold border-b-2 broder-white py-3 mt-5 mb-5'>Yesterday</h1>
                            <div className='grid grid-cols-3 gap-10'>
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                                <NewEpisodeCard />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer>
                <div className='mt-5'>
                    <div className='flex items-center gap-4 text-yellow-400 font-semibold'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z" clipRule="evenodd"/></svg>
                        <span className='text-lg'>Popular Series</span>
                    </div>
                    <div className='grid mt-4 lg:grid-cols-4 gap-4'>
                        {
                            popularAnimes?.map(anime => <MovieCard key={anime?.id} anime={anime} />)
                        }
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer className={'bg-black mt-8'} padding={false}>
                <div className='mt-5 px-10 py-10'>
                    <div className='flex items-center gap-4 text-yellow-400 font-semibold'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fillRule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z" clipRule="evenodd"/></svg>
                        <span className='text-lg'>Popular Manga</span>
                    </div>
                    <div className='grid mt-4 lg:grid-cols-5 gap-4'>
                        {
                            popularMangas?.map(manga => <MangaCard key={manga?.id} manga={manga} />)
                        }
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer  padding={false} style={{ backgroundImage:'linear-gradient(55deg, rgba(223,136,28,1) 13%, rgba(249,198,45,1) 42%, rgba(216,119,23,1) 91%)' }}>
                <div className='px-10 py-10'>
                    <div className='flex items-center gap-8 bg-[#0D0D0D] rounded-md'>
                        <div className='basis-[40%] flex items-center'>
                            <img className='w-[60%] object-cover h-full' src="https://www.crunchyroll.com/imgsrv/display/thumbnail/260x288/catalog/crunchyroll/03e1ca22f70607da7a54313b48971b8b.png" alt="" />
                            <div className='w-[40%] h-full'>
                                <img className='w-full h-full object-cover' src="https://www.crunchyroll.com/imgsrv/display/thumbnail/480x720/catalog/crunchyroll/c73bc7c503920b61c100eab128e70d5e.jpe" alt="" />
                            </div>
                        </div>
                        <div className='basis-[60%] text-white'>
                            <Link href="#" className='hover:underline'>
                                <h1 className='text-2xl font-bold'>The Rising of the Shield Hero</h1>
                            </Link>
                            <div className='flex items-center gap-1 my-3'>
                                <span className='text-[#40ecf8]'>Series</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"/></svg>
                                <span>Subtitled</span>
                            </div>
                            <p className='w-[95%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui amet, voluptatem culpa officiis eligendi odio sequi, voluptates, magni soluta quaerat tempore quia! Vero quam nulla beatae reiciendis aliquam, sequi laboriosam, magnam ex fuga similique, consectetur laborum eligendi. Non, hic id? Aliquam dolore voluptatem quo, reiciendis laboriosam quos omnis optio consequatur.</p>
                            <div className='mt-4 flex items-center gap-8'>
                                <Button className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} text={'Start Reading S1 Ep1'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"/></svg>} />
                                <Button outline text={'Add To WatchList'} className={'!px-8 rounded-none !gap-1 !border-[#F47521] text-[#F47521]'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"/></svg>} />
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center gap-8 bg-[#0D0D0D] rounded-md mt-8'>
                        <div className='basis-[40%] flex items-center'>
                            <img className='w-[60%] object-cover h-full' src="https://www.crunchyroll.com/imgsrv/display/thumbnail/260x288/catalog/crunchyroll/03e1ca22f70607da7a54313b48971b8b.png" alt="" />
                            <div className='w-[40%] h-full'>
                                <img className='w-full h-full object-cover' src="https://www.crunchyroll.com/imgsrv/display/thumbnail/480x720/catalog/crunchyroll/c73bc7c503920b61c100eab128e70d5e.jpe" alt="" />
                            </div>
                        </div>
                        <div className='basis-[60%] text-white'>
                            <Link href="#" className='hover:underline'>
                                <h1 className='text-2xl font-bold'>The Rising of the Shield Hero</h1>
                            </Link>
                            <div className='flex items-center gap-1 my-3'>
                                <span className='text-[#40ecf8]'>Series</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5L16 8l7.5 4l-7.5 4l-4 7.5L8 16L.5 12L8 8l4-7.5Z"/></svg>
                                <span>Subtitled</span>
                            </div>
                            <p className='w-[95%]'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui amet, voluptatem culpa officiis eligendi odio sequi, voluptates, magni soluta quaerat tempore quia! Vero quam nulla beatae reiciendis aliquam, sequi laboriosam, magnam ex fuga similique, consectetur laborum eligendi. Non, hic id? Aliquam dolore voluptatem quo, reiciendis laboriosam quos omnis optio consequatur.</p>
                            <div className='mt-4 flex items-center gap-8'>
                                <Button className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} text={'Start Reading S1 Ep1'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"/></svg>} />
                                <Button outline text={'Add To WatchList'} className={'!px-8 rounded-none !gap-1 !border-[#F47521] text-[#F47521]'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"/></svg>} />
                            </div>
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer padding={false}>
                <div className='min-h-[50vh] relative mt-8 bg-fixed bg-no-repeat bg-cover bg-top' style={{ backgroundImage:'url(\'https://4kwallpapers.com/images/wallpapers/demon-slayer-1024x768-10716.jpg\')' }}>
                    <div className='absolute text-white flex items-center flex-col justify-center top-0 left-0 bottom-0 w-full h-full bg-[rgba(0,0,0,0.6)]'>
                        <h1 className='text-4xl font-bold'>Signin Or Register Here</h1>
                        <p className='text-center pt-4 w-[50%] font-semibold text-lg'>
            Signin Or Register to get better experience and to get more permission.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam, optio.
                        </p>
                        <div className='mt-6 flex items-center gap-8'>
                            <Button text={'Sign In'} className={'!bg-[#F47521] !px-12 !gap-1'} link={'/login'}  />
                            <Button text={'Sign Up'} className={'!border-[#F47521] !px-12 !gap-1 !text-[#F47521]'} outline link={'/register'} />
                        </div>
                    </div>
                </div>
            </SectionContainer>
            <SectionContainer className='bg-[#0D0D0D]'>
                <div className='pt-20 px-20 text-white'>
                    <div className='text-white grid grid-cols-3 gap-10 '>
                        <div className='justify-self-center'> 
                            <h1 className='text-lg font-bold'>Navigation</h1>
                            <ul className='mt-3'>
                                <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                    <Link>Browse Popular</Link>
                                </li>
                                <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                    <Link>Browse Anime</Link>
                                </li>
                                <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                    <Link>Browse Manga</Link>
                                </li>
                                <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                    <Link>Browse Popular</Link>
                                </li>
                                <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                    <Link>New</Link>
                                </li>
                            </ul>
                        </div>
                        <div className='justify-self-center'>
                            <h1 className='text-lg font-bold'>Connect With Us</h1>
                            <ul className='mt-3'>
                                <li className='flex group mb-2 items-center gap-2 text-gray-400 hover:text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M0 0h24v24H0z"/><path fill="currentColor" d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zM9 9v6a1 1 0 0 0 1.514.857l5-3a1 1 0 0 0 0-1.714l-5-3A1 1 0 0 0 9 9z"/></g></svg>
                                    <span className='text-[15px] font-medium group-hover:underline '>Youtube</span>
                                </li>
                                <li className='flex group mb-2 items-center gap-2 text-gray-400 hover:text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" fill="currentColor"/></svg>
                                    <span className='text-[15px] font-medium  group-hover:underline text-gray-400'>Facebook</span>
                                </li>
                                <li className='flex group mb-2 items-center gap-2 text-gray-400 hover:text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="currentColor" d="M412.19 118.66a109.27 109.27 0 0 1-9.45-5.5a132.87 132.87 0 0 1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14 23.9 350 16 350.13 16h-82.44v318.78c0 4.28 0 8.51-.18 12.69c0 .52-.05 1-.08 1.56c0 .23 0 .47-.05.71v.18a70 70 0 0 1-35.22 55.56a68.8 68.8 0 0 1-34.11 9c-38.41 0-69.54-31.32-69.54-70s31.13-70 69.54-70a68.9 68.9 0 0 1 21.41 3.39l.1-83.94a153.14 153.14 0 0 0-118 34.52a161.79 161.79 0 0 0-35.3 43.53c-3.48 6-16.61 30.11-18.2 69.24c-1 22.21 5.67 45.22 8.85 54.73v.2c2 5.6 9.75 24.71 22.38 40.82A167.53 167.53 0 0 0 115 470.66v-.2l.2.2c39.91 27.12 84.16 25.34 84.16 25.34c7.66-.31 33.32 0 62.46-13.81c32.32-15.31 50.72-38.12 50.72-38.12a158.46 158.46 0 0 0 27.64-45.93c7.46-19.61 9.95-43.13 9.95-52.53V176.49c1 .6 14.32 9.41 14.32 9.41s19.19 12.3 49.13 20.31c21.48 5.7 50.42 6.9 50.42 6.9v-81.84c-10.14 1.1-30.73-2.1-51.81-12.61Z"/></svg>
                                    <span className='text-[15px] font-medium   group-hover:underline text-gray-400'>Tiktok</span>
                                </li>
                                <li className='flex group mb-2 items-center gap-2 text-gray-400 hover:text-white'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><g clipPath="url(#akarIconsTelegramFill0)"><path fill="currentColor" fillRule="evenodd" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12S5.373 0 12 0s12 5.373 12 12ZM12.43 8.859c-1.167.485-3.5 1.49-6.998 3.014c-.568.226-.866.447-.893.663c-.046.366.412.51 1.034.705c.085.027.173.054.263.084c.613.199 1.437.432 1.865.441c.389.008.823-.152 1.302-.48c3.268-2.207 4.955-3.322 5.061-3.346c.075-.017.179-.039.249.024c.07.062.063.18.056.212c-.046.193-1.84 1.862-2.77 2.726c-.29.269-.495.46-.537.504c-.094.097-.19.19-.282.279c-.57.548-.996.96.024 1.632c.49.323.882.59 1.273.856c.427.291.853.581 1.405.943c.14.092.274.187.405.28c.497.355.944.673 1.496.623c.32-.03.652-.331.82-1.23c.397-2.126 1.179-6.73 1.36-8.628a2.111 2.111 0 0 0-.02-.472a.506.506 0 0 0-.172-.325c-.143-.117-.365-.142-.465-.14c-.451.008-1.143.249-4.476 1.635Z" clipRule="evenodd"/></g><defs><clipPath id="akarIconsTelegramFill0"><path fill="#fff" d="M0 0h24v24H0z"/></clipPath></defs></g></svg>
                                    <span className='text-[15px] font-medium  group-hover:underline text-gray-400'>Telegram</span>
                                </li>
                            </ul>
                        </div>
                        <div className='justify-self-center'>
                            <h1 className='text-lg font-bold'>Account</h1>
                            <ul className='mt-3'>
                                <li>
                                    <Link className='text-[15px] font-medium hover:text-white hover:underline text-gray-400'>Create Account</Link>
                                </li>
                                <li >
                                    <Link className='text-[15px] font-medium hover:text-white hover:underline text-gray-400'>Login</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='w-full h-[0.6px] my-5 bg-white'></div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <img className='w-32' src={Logo} alt="" />
                            <span className='text-lg cursor-pointer hover:text-yellow-400 font-bold'>AnimeNook</span>
                        </div>
                        <div className='cursor-pointer hover:text-yellow-400'>
                            <span>All right serverd © Developed By Zayarwin</span>
                        </div>
                    </div>
                </div>
            </SectionContainer>
        </div>
    )
}

export default Index
Index.layout = page => <UserLayout>{page}</UserLayout>