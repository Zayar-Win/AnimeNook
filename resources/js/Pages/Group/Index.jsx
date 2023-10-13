import Button from '@/Components/Button'
import Navbar from '@/Components/Navbar'
import SectionContainer from '@/Components/SectionContainer'
import Tag from '@/Components/Tag'
import { Link } from '@inertiajs/react'
import React from 'react'

function Index() {
  return (
    <div>
      <Navbar />
      <SectionContainer>
        <div className='flex mt-[30px]'>
          <div className='basis-[70%]'>
            <div className='flex items-center text-yellow-400 gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><g fill="none"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M6.999 7.57L9 1l2.002 6.571L17 9.764l-5.952 2.364L9 19l-2.048-6.872L1 9.764L6.999 7.57Z"/><path fill="currentColor" stroke="currentColor" d="M17.085 13.574A.084.084 0 0 0 17 13.5a.084.084 0 0 0-.085.074c-.199 1.994-.345 2.577-2.338 2.765a.083.083 0 0 0-.077.082c0 .043.033.078.077.082c1.965.185 2.136.896 2.338 2.923A.085.085 0 0 0 17 19.5c.044 0 .08-.032.085-.074c.202-2.027.372-2.738 2.338-2.923a.083.083 0 0 0 .077-.082a.083.083 0 0 0-.077-.082c-1.993-.188-2.14-.77-2.338-2.765Z"/><path fill="currentColor" d="M9 20c-.44 0-.83-.29-.96-.71l-1.91-6.41l-5.5-2.19c-.38-.15-.63-.52-.63-.94c0-.42.27-.78.66-.93L6.19 6.8L8.04.71C8.17.29 8.56 0 9 0c.44 0 .83.29.96.71l1.86 6.09l5.53 2.02c.39.14.65.51.66.93c.01.42-.25.79-.63.94l-5.5 2.18l-1.91 6.41c-.13.42-.52.71-.96.71L9 20ZM3.81 9.8l3.51 1.4c.28.11.5.35.59.64L9 15.5l1.09-3.66c.09-.29.3-.53.59-.64l3.51-1.4l-3.54-1.29c-.29-.11-.52-.35-.61-.65L9 4.43L7.96 7.86c-.09.3-.32.54-.61.65L3.81 9.8ZM17 20c-.3 0-.55-.23-.58-.53c-.2-1.95-.28-2.32-1.89-2.47a.585.585 0 0 1-.53-.58c0-.3.23-.55.53-.58c1.61-.15 1.7-.4 1.89-2.32a.585.585 0 0 1 1.16 0c.19 1.92.28 2.17 1.89 2.32c.3.03.53.28.53.58c0 .3-.22.55-.52.58c-1.61.15-1.7.52-1.9 2.47c-.03.3-.28.52-.58.52V20Z"/></g></svg>
              <p className='font-semibold'>News</p>
            </div>
            <div className='relative rounded-md mt-4 overflow-hidden text-white'>
              <img className='absolute z-10 top-0 left-0 right-0 bottom-0 w-full h-full object-cover' src="https://1.bp.blogspot.com/-x9pSUkrvOo8/YTEZrYf4f_I/AAAAAAAAKVE/q4S1kjbvATMQyuGBzuTx-QQxIYfBZRDkgCPcBGAsYHg/w919/my-hero-academia-battle-4k-uhdpaper.com-1001.0_b-thumbnail.jpg" alt="" />
              <div className='relative z-20 pt-40 pl-10 pb-12'>
                <p className='font-semibold flex items-center'>Home <span className='inline-block h-4 mx-1 border-l-2 border-white'></span>TV</p>
                <h1 className='text-4xl font-extrabold mt-4'>My Hero Academia</h1>
                <p className='flex items-center mt-3 mb-3'>Ep 24 <span className='block w-1 h-1 rounded-full bg-white mx-1'></span>24m</p>
                <div className='flex items-center gap-2'>
                  <Tag text={'SUB'} className="bg-[#47BE71]" />
                  <Tag text={'HD'} className="bg-[#47BE71]" />
                  <Tag text={'DUB'} className="bg-[#47BE71]" />
                </div>
                  <p className='w-[40%] mt-3 font-semibold'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur, repudiandae quas nam pariatur ullam optio provident, esse at quam sunt eum voluptates nisi quis autem velit harum, voluptate hic voluptatem.</p>
              </div>
            </div>
          </div>
          <div className='basis-[30%] ml-4'>
            <div className='flex items-center text-yellow-400 gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><g fill="none"><path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M6.999 7.57L9 1l2.002 6.571L17 9.764l-5.952 2.364L9 19l-2.048-6.872L1 9.764L6.999 7.57Z"/><path fill="currentColor" stroke="currentColor" d="M17.085 13.574A.084.084 0 0 0 17 13.5a.084.084 0 0 0-.085.074c-.199 1.994-.345 2.577-2.338 2.765a.083.083 0 0 0-.077.082c0 .043.033.078.077.082c1.965.185 2.136.896 2.338 2.923A.085.085 0 0 0 17 19.5c.044 0 .08-.032.085-.074c.202-2.027.372-2.738 2.338-2.923a.083.083 0 0 0 .077-.082a.083.083 0 0 0-.077-.082c-1.993-.188-2.14-.77-2.338-2.765Z"/><path fill="currentColor" d="M9 20c-.44 0-.83-.29-.96-.71l-1.91-6.41l-5.5-2.19c-.38-.15-.63-.52-.63-.94c0-.42.27-.78.66-.93L6.19 6.8L8.04.71C8.17.29 8.56 0 9 0c.44 0 .83.29.96.71l1.86 6.09l5.53 2.02c.39.14.65.51.66.93c.01.42-.25.79-.63.94l-5.5 2.18l-1.91 6.41c-.13.42-.52.71-.96.71L9 20ZM3.81 9.8l3.51 1.4c.28.11.5.35.59.64L9 15.5l1.09-3.66c.09-.29.3-.53.59-.64l3.51-1.4l-3.54-1.29c-.29-.11-.52-.35-.61-.65L9 4.43L7.96 7.86c-.09.3-.32.54-.61.65L3.81 9.8ZM17 20c-.3 0-.55-.23-.58-.53c-.2-1.95-.28-2.32-1.89-2.47a.585.585 0 0 1-.53-.58c0-.3.23-.55.53-.58c1.61-.15 1.7-.4 1.89-2.32a.585.585 0 0 1 1.16 0c.19 1.92.28 2.17 1.89 2.32c.3.03.53.28.53.58c0 .3-.22.55-.52.58c-1.61.15-1.7.52-1.9 2.47c-.03.3-.28.52-.58.52V20Z"/></g></svg>
              <p>News</p>
            </div>
            <div className='bg-[#0D0D0D] mt-4 rounded-md px-6 py-10 text-white'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>01</p>
                  <img className='w-10 h-16 object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSSeRS7UkR_b385Gx0ulGgeST-BA_K1hLmA&usqp=CAU" alt="" />
                </div>
                <div className='flex flex-col flex-grow ml-3'>
                  <h1 className='pb-2 font-semibold'>ChainSaw Man</h1>
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
              <div className='flex items-center gap-3 mt-6'>
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>01</p>
                  <img className='w-10 h-16 object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSSeRS7UkR_b385Gx0ulGgeST-BA_K1hLmA&usqp=CAU" alt="" />
                </div>
                <div className='flex flex-col flex-grow ml-3'>
                  <h1 className='pb-2 font-semibold'>ChainSaw Man</h1>
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
              <div className='flex items-center gap-3 mt-6'>
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>01</p>
                  <img className='w-10 h-16 object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSSeRS7UkR_b385Gx0ulGgeST-BA_K1hLmA&usqp=CAU" alt="" />
                </div>
                <div className='flex flex-col flex-grow ml-3'>
                  <h1 className='pb-2 font-semibold'>ChainSaw Man</h1>
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
              <div className='flex items-center gap-3 mt-6'>
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>01</p>
                  <img className='w-10 h-16 object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSSeRS7UkR_b385Gx0ulGgeST-BA_K1hLmA&usqp=CAU" alt="" />
                </div>
                <div className='flex flex-col flex-grow ml-3'>
                  <h1 className='pb-2 font-semibold'>ChainSaw Man</h1>
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
              <div className='flex items-center gap-3 mt-6'>
                <div className='flex items-center gap-4'>
                  <p className='font-bold text-lg'>01</p>
                  <img className='w-10 h-16 object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjSSeRS7UkR_b385Gx0ulGgeST-BA_K1hLmA&usqp=CAU" alt="" />
                </div>
                <div className='flex flex-col flex-grow ml-3'>
                  <h1 className='pb-2 font-semibold'>ChainSaw Man</h1>
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
              
            </div>
          </div>
        </div>
      </SectionContainer>
      <SectionContainer>
        <div className='rounded-lg mb-20 relative overflow-hidden  mt-10 px-5 py-8' style={{ background:'linear-gradient(90deg, rgba(203,177,48,0.6285364487591911) 0%, rgba(249,181,45,1) 42%)' }}>
          <div className='w-[400px] h-[400px] z-10 right-28 bottom-0 translate-y-[30%] rounded-full bg-[rgba(230,216,142,0.63)] absolute'></div>
          <div className='w-[340px] h-[340px] z-20 right-36 bottom-0 translate-y-[27%] rounded-full bg-[#caab79] absolute'></div>
          <div className='w-[280px] h-[280px] z-30 right-44 bottom-0 translate-y-[22%] rounded-full bg-[#FFF2DE] absolute'></div>
          <img className='absolute w-[280px] z-40 object-contain bottom-0 right-40 h-[210px]' src="https://www.pngkey.com/png/full/610-6103328_my-hero-academia-image-my-hero-academia-group.png" alt="" />
          <h1 className='text-3xl font-extrabold uppercase'>Read My HERO ACADEMIA MANGA ONLINE</h1>
          <div className='flex items-center my-5 mb-7 font-semibold'>
            <span>Hightest Quality</span>
            <div className='border-l-[3px] mx-1 border-black h-5'></div>
            <span>No Signups</span>
            <div className='border-l-[3px] mx-1 border-black h-5'></div>
            <span>No Ads</span>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M0 7.5a7.5 7.5 0 1 1 6.965 7.481l.053-.998l.49.017a6.5 6.5 0 1 0-4.65-1.951l.006.007l.136.15V10h1v4H0v-1h2.37l-.234-.258A7.477 7.477 0 0 1 0 7.5Zm7 0V3h1v4.293l2.854 2.853l-.708.708l-3-3A.5.5 0 0 1 7 7.5Z" clip-rule="evenodd"/></svg>
            <span className='text-lg'>Continue Watching</span>
          </div>
          <div className='grid mt-4 lg:grid-cols-4 gap-4'>
              <div className='bg-[#0D0D0D] text-white rounded-md p-5'>
                <div className='w-full relative h-[280px] object-cover'>
                  <img className='rounded-md w-full h-full object-cover' src="https://www.gameinformer.com/sites/default/files/styles/thumbnail/public/2022/12/15/c5b2b37e/my_hero_fortnite.jpg" alt="" />
                  <div className='absolute rounded-md top-3 left-3 flex px-3 py-1 items-center bg-black'>
                    <span>18</span>
                    <div className='border-l-2 h-3 border-white rotate-[15deg] mx-2'></div>
                    <span>25</span>
                  </div>
                  <div className='absolute flex w-full px-3 items-center justify-between bottom-2'>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152c0 .888.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152c0-.888-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25ZM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292Z"/></g></svg>
                      <span className='text-[12px] font-semibold leading-none'>1000</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                      <span className='text-[12px] font-semibold leading-none'>78</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-1 mt-5'>
                  <Tag text="SUB" className="bg-[#47BE71]" />
                  <Tag text="HD" className="bg-[#47BE71]" />
                  <Tag text="ONGOING" className="bg-[#47BE71]" />
                </div>
                <h1 className='mt-3 text-xl font-extrabold'>My Hero Academia</h1>
                <p className='font-medium text-sm pt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero recusandae in autem sed dicta doloribus, deserunt error consequatur veritatis.</p>
                <Button text={'Watch Now'}  className={'inline-block text-black bg-white hover-effect mt-3'} textClassName={'z-10 text-black relative'} />
              </div>
              <div className='bg-[#0D0D0D] text-white rounded-md p-5'>
                <div className='w-full relative h-[280px] object-cover'>
                  <img className='rounded-md w-full h-full object-cover' src="https://www.gameinformer.com/sites/default/files/styles/thumbnail/public/2022/12/15/c5b2b37e/my_hero_fortnite.jpg" alt="" />
                  <div className='absolute rounded-md top-3 left-3 flex px-3 py-1 items-center bg-black'>
                    <span>18</span>
                    <div className='border-l-2 h-3 border-white rotate-[15deg] mx-2'></div>
                    <span>25</span>
                  </div>
                  <div className='absolute flex w-full px-3 items-center justify-between bottom-2'>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152c0 .888.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152c0-.888-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25ZM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292Z"/></g></svg>
                      <span className='text-[12px] font-semibold leading-none'>1000</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                      <span className='text-[12px] font-semibold leading-none'>78</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-1 mt-5'>
                  <Tag text="SUB" className="bg-[#47BE71]" />
                  <Tag text="HD" className="bg-[#47BE71]" />
                  <Tag text="ONGOING" className="bg-[#47BE71]" />
                </div>
                <h1 className='mt-3 text-xl font-extrabold'>My Hero Academia</h1>
                <p className='font-medium text-sm pt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero recusandae in autem sed dicta doloribus, deserunt error consequatur veritatis.</p>
                <Button text={'Watch Now'}  className={'inline-block text-black bg-white hover-effect mt-3'} textClassName={'z-10 text-black relative'} />
              </div>
              <div className='bg-[#0D0D0D] text-white rounded-md p-5'>
                <div className='w-full relative h-[280px] object-cover'>
                  <img className='rounded-md w-full h-full object-cover' src="https://www.gameinformer.com/sites/default/files/styles/thumbnail/public/2022/12/15/c5b2b37e/my_hero_fortnite.jpg" alt="" />
                  <div className='absolute rounded-md top-3 left-3 flex px-3 py-1 items-center bg-black'>
                    <span>18</span>
                    <div className='border-l-2 h-3 border-white rotate-[15deg] mx-2'></div>
                    <span>25</span>
                  </div>
                  <div className='absolute flex w-full px-3 items-center justify-between bottom-2'>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152c0 .888.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152c0-.888-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25ZM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292Z"/></g></svg>
                      <span className='text-[12px] font-semibold leading-none'>1000</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                      <span className='text-[12px] font-semibold leading-none'>78</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-1 mt-5'>
                  <Tag text="SUB" className="bg-[#47BE71]" />
                  <Tag text="HD" className="bg-[#47BE71]" />
                  <Tag text="ONGOING" className="bg-[#47BE71]" />
                </div>
                <h1 className='mt-3 text-xl font-extrabold'>My Hero Academia</h1>
                <p className='font-medium text-sm pt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero recusandae in autem sed dicta doloribus, deserunt error consequatur veritatis.</p>
                <Button text={'Watch Now'}  className={'inline-block text-black bg-white hover-effect mt-3'} textClassName={'z-10 text-black relative'} />
              </div>
              <div className='bg-[#0D0D0D] text-white rounded-md p-5'>
                <div className='w-full relative h-[280px] object-cover'>
                  <img className='rounded-md w-full h-full object-cover' src="https://www.gameinformer.com/sites/default/files/styles/thumbnail/public/2022/12/15/c5b2b37e/my_hero_fortnite.jpg" alt="" />
                  <div className='absolute rounded-md top-3 left-3 flex px-3 py-1 items-center bg-black'>
                    <span>18</span>
                    <div className='border-l-2 h-3 border-white rotate-[15deg] mx-2'></div>
                    <span>25</span>
                  </div>
                  <div className='absolute flex w-full px-3 items-center justify-between bottom-2'>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152c0 .888.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152c0-.888-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25ZM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292Z"/></g></svg>
                      <span className='text-[12px] font-semibold leading-none'>1000</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'> 
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                      <span className='text-[12px] font-semibold leading-none'>78</span>
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-1 mt-5'>
                  <Tag text="SUB" className="bg-[#47BE71]" />
                  <Tag text="HD" className="bg-[#47BE71]" />
                  <Tag text="ONGOING" className="bg-[#47BE71]" />
                </div>
                <h1 className='mt-3 text-xl font-extrabold'>My Hero Academia</h1>
                <p className='font-medium text-sm pt-1'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis vero recusandae in autem sed dicta doloribus, deserunt error consequatur veritatis.</p>
                <Button text={'Watch Now'}  className={'inline-block text-black bg-white hover-effect mt-3'} textClassName={'z-10 text-black relative'} />
              </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  )
}

export default Index