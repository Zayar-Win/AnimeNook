import SectionContainer from '@/Components/SectionContainer';
import UserLayout from '@/Layouts/UserLayout'
import React from 'react'
import Star from '../../../assets/Star';
import { formateDate } from '@/app';
import Button from '@/Components/Button';
import Heart from '@/../assets/Heart';
import Comment from '@/../assets/Comment';

const VideoDetailPage = ({anime}) => {
    console.log(anime);
    return (
        <SectionContainer>
            <div className='flex items-start my-10'>
                <div className='basis-[30%] flex items-center justify-center'>
                    <div className='w-[70%] '>
                        <img src={anime.thumbnail} className='w-full rounded-lg min-h-[400px] object-cover' alt="" />
                    </div>
                </div>
                <div className='basis-[70%]'>
                    <div className='flex items-center gap-6'>
                        <h1 className={'text-2xl font-extrabold'}>{anime.name}</h1>
                        <div className={'bg-primary px-3 py-1 text-sm font-semibold rounded-3xl text-white'}>
                            <span>{anime.status.name}</span>
                        </div>
                    </div>
                    <div className='mt-3 flex items-center '>
                        {
                            anime?.tags.length > 0 && anime?.tags?.map((tag,i) =>  {
                                return(
                                    <div key={i} className='text-sm pl-1 flex items-center font-medium text-gray-500'>
                                        {tag?.name}
                                        {
                                            i + 1 !== anime?.tags.length && 
                                        <div className='pl-1'>&#47;</div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='flex items-center gap-4 mt-3'>
                        <div className='flex items-center gap-2'>
                            <svg className='text-primary' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"/></svg>
                            <span className='font-extrabold'>{anime?.views_count}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <svg className='text-primary' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"/></svg>
                            <span className='font-extrabold'>{anime?.love_count}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center'>
                                <Star className={'text-primary w-6 h-6'} />
                                <Star className={'text-primary w-6 h-6'}/>
                                <Star className={'text-primary w-6 h-6'}/>
                                <Star  className={'text-primary w-6 h-6'}/>
                                <Star className={'text-primary w-6 h-6' } />
                            </div>
                            <p className='font-2xl font-bold'>{anime?.rating}</p>
                        </div>
                    </div>
                    <p className='text-gray-600'>{anime?.description}</p>
                    <div className='my-3'>
                        <p className='text-sm font-bold text-gray-600'>Uploaded at : {formateDate(anime?.created_at)}</p>
                    </div>
                </div>
            </div>
            <div className='flex items-center gap-5 my-4'>
                <Button className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} text={anime?.latestWatchedChapter ? `Continue Watching Ep${anime?.latestWatchedChapter.chapter_number}` : 'Start Watching S1 Ep1'} type={'button'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z"/></svg>} />
                <Button text={'Save To Collection'} className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V5q0-.825.588-1.412T7 3h6v2H7v12.95l5-2.15l5 2.15V11h2v10l-7-3zM7 5h6zm10 4V7h-2V5h2V3h2v2h2v2h-2v2z"/></svg>} />
                <Button text={'Share'} className={'!bg-[#F47521] !px-8 rounded-none !gap-1'} Icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M18 22q-1.25 0-2.125-.875T15 19q0-.175.025-.363t.075-.337l-7.05-4.1q-.425.375-.95.588T6 15q-1.25 0-2.125-.875T3 12q0-1.25.875-2.125T6 9q.575 0 1.1.213t.95.587l7.05-4.1q-.05-.15-.075-.337T15 5q0-1.25.875-2.125T18 2q1.25 0 2.125.875T21 5q0 1.25-.875 2.125T18 8q-.575 0-1.1-.212t-.95-.588L8.9 11.3q.05.15.075.338T9 12q0 .175-.025.363T8.9 12.7l7.05 4.1q.425-.375.95-.587T18 16q1.25 0 2.125.875T21 19q0 1.25-.875 2.125T18 22"/></svg>} />
            </div>
            <div className='w-full h-[1px] bg-gray-300 my-10'></div>
            <h1 className='text-2xl font-bold'>Eposides</h1>
            {
                anime?.chapters.length > 0 ?  <div className='grid grid-cols-4 mt-4 gap-5 mb-5'>
                    {
                        anime?.chapters.map((chapter,i) => (
                            <div key={i} className='bg-gray-100 cursor-pointer px-5 py-4 rounded-lg'>
                                <h3 className='text-md font-semibold'>{chapter?.name}</h3>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <span>{formateDate(chapter?.created_at,{year:'numeric',month:'2-digit',day:'2-digit'},'-')}</span>
                                    <div className='flex items-center gap-1'>
                                        <Heart className={'w-5 h-5'} />
                                        <span>{chapter?.like_count}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Comment className={'w-5 h-5'} />
                                        <span>{chapter?.comments_count}</span>
                                    </div>
                                </div>
                            </div>

                        ))
                    }
                </div> : 
                    <div className='text-center h-[400px] flex items-center justify-center text-xl font-semibold text-gray-400'>
                        <p>Currently No Eposides Are Uploaded.</p>
                    </div>
            }
           
        </SectionContainer>
    )
}

export default VideoDetailPage
VideoDetailPage.layout = page => <UserLayout>{page}</UserLayout>