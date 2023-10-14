import React from 'react'

const MangaCard = () => {
  return (
    <div className='text-white relative rounded-md overflow-hidden cursor-pointer pb-4'>
      <div className='h-[320px]'>
        <img className='w-full h-full object-cover' src="https://i0.wp.com/chatte-georgiana.com/wp-content/uploads/2014/10/naruto-volume-71-cover-release-databook-4-included-1859197.png?resize=800%2C1263&ssl=1" alt="" />
      </div>
      <h1 className='text-xl font-semibold pt-3 hover:underline'>Space Brothers</h1>
      <span className='block font-semibold py-2 hover:underline'>Chapters 278</span>
      <span className='block text-sm py-2'>Last Update: 14.10.2023</span>
      <div className='absolute opacity-0 rounded-md hover:opacity-100 p-2 transition-all top-0 bottom-0 left-0 bg-[#1b1f1ee7] w-full h-fll'>
        <h1 className='text-xl font-semibold  hover:underline'>Space Brothers</h1>
        <div className='flex items-center gap-1 mt-3 leading-none cursor-pointer text-[14px] hover:text-yellow-400 transition-all'>
          <span>4.6</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M7.49 1.09L9.08 4.3a.51.51 0 0 0 .41.3l3.51.52a.54.54 0 0 1 .3.93l-2.53 2.51a.53.53 0 0 0-.16.48l.61 3.53a.55.55 0 0 1-.8.58l-3.16-1.67a.59.59 0 0 0-.52 0l-3.16 1.67a.55.55 0 0 1-.8-.58L3.39 9a.53.53 0 0 0-.16-.48L.67 6.05A.54.54 0 0 1 1 5.12l3.51-.52a.51.51 0 0 0 .41-.3l1.59-3.21a.54.54 0 0 1 .98 0Z"/></svg>
          <span>(22.k)</span>
        </div>
        <span className='block font-semibold text-sm py-2 hover:underline'>Chapters 278</span>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit, nam! Dicta eaque ipsa quasi, est neque animi praesentium quaerat fuga optio delectus maiores dolorum facilis ad nisi aperiam corporis nemo?</p>
        <div className='flex items-center left-5 gap-3 mt-16 absolute text-yellow-400 bottom-4'>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M2 8v11.529S6.621 19.357 12 22c5.379-2.643 10-2.471 10-2.471V8s-5.454 0-10 2.471C7.454 8 2 8 2 8z" fill="currentColor"/><circle cx="12" cy="5" r="3" fill="currentColor"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"/></svg>
        </div>
      </div>
    </div>
  )
}

export default MangaCard