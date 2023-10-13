import React from 'react'
import Logo from '../../assets/logo.png';
import Profile from '../../assets/Profile.jpeg';
import SectionContainer from './SectionContainer';
import { Link, usePage } from '@inertiajs/react';
const Navbar = () => {
  const {component} = usePage();
  return (
    <SectionContainer className='h-30 bg-[#0D0D0D] flex items-center justify-between'>
      <div className='w-20 h-20'>
        <img src={Logo} className='w-full h-full' alt="" />
      </div>
      <div className='flex items-center gap-3 p-2 max-w-[500px] min-w-[500px] rounded-md bg-[#212121]'>
        <label htmlFor="search" className='cursor-pointer'>
        <svg xmlns="http://www.w3.org/2000/svg" fill='white' x="0px" y="0px" width="23" height="23" viewBox="0 0 30 30">
          <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
        </svg>
        </label>
        <input type="text" id='search' placeholder='Search Anime' className='bg-transparent text-white p-0 w-full h-full border-0 focus:ring-0 outline-none' />
      </div>
      <nav>
        <ul className='flex items-center gap-10 font-semibold text-white'>
          <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/Index' ? 'text-yellow-400' : null}`}>
            <Link href='/'>Home</Link>
          </li>
          <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/List' ? 'text-yellow-400' : null}`}>
            <Link href='/'>Anime List</Link>
          </li>
          <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/NewSeason' ? 'text-yellow-400' : null}`}>
            <Link href='/'>New Season</Link>
          </li>
          <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/Popular' ? 'text-yellow-400' : null}`}>
            <Link href='/'>Popular</Link>
          </li>
        </ul>
      </nav>
      <div className='flex items-center gap-5'>
          <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' fill='white' width="25" height="25" viewBox="0 0 24 24">
            <path  d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
          </svg>
          <div className='w-[46px] cursor-pointer h-[46px] rounded-full border-2 border-white overflow-hidden'>
            <img src={Profile} className="w-full h-full object-cover" />
          </div>
      </div>
    </SectionContainer>
  )
}

export default Navbar

