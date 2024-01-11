import SectionContainer from '@/Components/SectionContainer';
import UserLayout from '@/Layouts/UserLayout'
import React from 'react'
import Share from '@/../assets/Share';
import Tags from '@/Components/Tags';
import Star from '@/../assets/Star';
import Button from '@/Components/Button';
import BookMark from '@/../assets/BookMark';
import Pause from '@/../assets/Pause';

const VideoDetail = ({anime}) => {
    console.log(anime);
    return (
        <>
            <div className='h-[350px] relative ' >
                <div className='absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.7)]'></div>
                <div className='blur-sm h-full w-full bg-cover bg-no-repeat opacity-50' style={{backgroundPosition:'center', backgroundImage:`url(${anime.thumbnail})`}}></div>
                <div className='left-[50%] top-0 z-10 translate-x-[-50%] absolute h-full w-[30%] '>
                    <img src={anime?.thumbnail} className='w-full h-full object-cover' alt="" />
                </div>
            </div>
            <SectionContainer className={'bg-black text-white'}>
                <div className=' w-[80%] py-10 mx-auto'>
                    <div className='flex items-start gap-4'>
                        <div className='basis-[70%]'>
                            <div className='flex items-center justify-between'> 
                                <h1 className='text-3xl font-bold'>{anime?.name}</h1>
                                <Share />
                            </div>
                            <div className='w-full mt-3'>
                                <Tags tags={anime?.tags} />
                            </div>
                            <div className='flex items-center gap-2 mt-6'>
                                <div className='flex items-center'>
                                    <Star className={'w-6 h-6'} />
                                    <Star className={'w-6 h-6'}/>
                                    <Star className={'w-6 h-6'}/>
                                    <Star className={'w-6 h-6'}/>
                                    <Star className={'w-6 h-6'}/>
                                </div>
                                <span className='inline-block h-6 mx-1 border-l-2 border-gray-500'></span>
                                <div>
                                    <div className='font-medium text-gray-400'>Average Rating: <span className='text-white font-bold'>{anime?.rating}({anime?.ratings_count})</span></div>
                                </div>
                                <span className='inline-block h-6 mx-1 border-l-2 border-gray-500'></span>
                                <div className='text-gray-400 font-medium'>
                                    {anime?.views_count} Views
                                </div>
                            </div>
                            <div className='flex'>
                                <Button text={'Add to WatchList'} outline className={'border-primary rounded-none !text-primary uppercase my-5'} Icon={<BookMark />} />
                            </div>
                            <p className='my-5'>{anime?.description}</p>
                        </div>
                        <div className='basis-[30%]'>
                            <div>
                                <div className='relative'>
                                    <div className='w-12 cursor-pointer absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-12 rounded-full flex items-center justify-center bg-[#0006]'>
                                        <Pause />
                                    </div>
                                    <img src={anime?.chapters[0]?.thumbnail ?? anime?.thumbnail} className='w-full h-[180px] object-cover' alt="Epsodie 1 Thumbnail" />
                                </div>
                                <Button text={'Start Watching S1 EP1'}  className={'bg-primary rounded-none mt-3 justify-center'} Icon={<Pause />}  />
                            </div>
                        </div>
                    </div>
                    <h1 className='text-2xl font-bold mt-6'>{anime?.name}</h1>
                    <div>
                        {
                            anime?.chapters.length > 0 ? <div className='grid grid-cols-4 gap-5'>
                                {
                                    anime?.chapters?.map((chapter,i) => (
                                        <div key={i}>
                                            <div className='h-[150px] object-cover relative'>
                                                <img src={chapter?.thumbnail ?? anime?.thumbnail} className='w-full h-full object-cover' alt="" />
                                                <div className='absolute top-[50%] left-[50%] w-12 h-12 flex items-center justify-center bg-[#0006] rounded-full translate-x-[-50%]  translate-y-[-50%]'>
                                                    <Pause />
                                                </div>
                                                <div className='px-1 py-[2px] bg-[#0006] font-bold text-sm absolute bottom-1 right-1'>24m</div>
                                            </div>
                                            <h1 className='text-xs font-semibold text-gray-400 uppercase pt-3'>{anime?.name}</h1>
                                            <h1 className='my-2 text-lg font-medium'>{chapter?.name}</h1>
                                            <div>
                                                <Tags tags={anime?.tags} />
                                            </div>
                                        </div>

                                    ))
                                }
                            </div> : <div className='h-[400px] flex items-center justify-center'><h1 className='font-bold text-2xl'>No Eposides are current uploaded.</h1></div>
                        }
                        
                    </div>
                </div>
            </SectionContainer>
        </>
    )
}

export default VideoDetail

VideoDetail.layout = (page) => <UserLayout>{page}</UserLayout>