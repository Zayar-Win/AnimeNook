import React from 'react'

const NewEpisodeCard = () => {
  return (
    <div className='flex items-center gap-4'>
      <div className='basis-[40%]'>
        <div className='w-[85%] translate-y-2 relative'>
          <img className='w-full z-50 relative' src="https://www.crunchyroll.com/imgsrv/display/thumbnail/320x180/catalog/crunchyroll/548c51dae7f89955eadaf9f9ce79359b.jpe" alt="" />
          <div className='absolute top-[-5px]  left-[5px] w-full h-full bg-[#4A4A4A] z-30'></div>
          <div className='absolute top-[-9px] left-[11px] w-full h-full bg-[#383838] z-20'></div>
          <div className='absolute top-[-12px] left-[16px] w-full h-full bg-[#2B2B2B] z-10'></div>
        </div>
      </div>
      <div className='basis-[60%] flex justify-between'>
        <div>
          <h1 className='font-semibold'>(Dubs) Dent a girlfriend</h1>
          <span className='text-gray-500 font-medium'>6 Episodes</span>
          <p className='font-semibold flex items-center text-gray-500'>Sub <span className='inline-block h-4 mx-1 border-l-2 border-gray-500'></span>Dub</p>
        </div>
        <p className='self-end text-[rgb(41,189,181)] text-sm font-semibold'>2:00am</p>
      </div>
    </div>
  )
}

export default NewEpisodeCard