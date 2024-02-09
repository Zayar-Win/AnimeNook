import React, { useEffect, useState } from 'react'
import Logo from '../../assets/logo.png';
import Profile from '../../assets/Profile.jpeg';
import SectionContainer from './SectionContainer';
import { Link, router, usePage } from '@inertiajs/react';
import Button from './Button';
import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { useDetectClickOutside } from 'react-detect-click-outside';
const Navbar = () => {
    const {component,props:{auth}} = usePage();
    const [search,setSearch] = useState('');
    const [animes,setAnimes] = useState([]);
    const decounceSearch = useDebounce(search,300);
    const [searchModalOpen,setSearchModalOpen] = useState(false);
    const [isProfileOpen,setIsProfileOpen] = useState(false);
    const closeSearchModal = () => {
        setSearch('');
        setSearchModalOpen(false);
    }
    const handleClickOutside = (e) => {
        if(e.target.parentNode.classList.contains('profile-container')) return;
        setIsProfileOpen(false);
    }
    const profileRef = useDetectClickOutside({onTriggered:handleClickOutside})
    const ref = useDetectClickOutside({onTriggered:closeSearchModal});
    const handleSearch = async() => {
        setSearchModalOpen(true);
        let response = await axios.get(window.route('group.search',{search}))
        setAnimes(response?.data?.animes?.data);
    }
    useEffect(() => {
        if(decounceSearch){
            handleSearch();
        }        
    },[decounceSearch])
    return (
        <SectionContainer className='h-30 bg-[#0D0D0D] flex items-center justify-between'>
            <div className='w-20 h-20 d-block shrink-0'>
                <img src={Logo} className='w-full h-full' alt="" />
            </div>
            <div 
                className='relative'
            >
                <label htmlFor="search" className='cursor-pointer absolute left-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill='white' x="0px" y="0px" width="23" height="23" viewBox="0 0 30 30">
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                    </svg>
                </label>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} autoComplete='off'  id='search' placeholder='Search Anime' className='bg-transparent text-white p-0 w-full h-full border-0 focus:ring-0 outline-none pl-8' />
                {
                    animes.length > 0 && searchModalOpen && 
                    <div ref={ref} className='absolute overflow-hidden left-0 z-40 right-0 w-full bg-white top-[110%] shadow-md rounded-md'>
                        <>
                            {
                                animes?.map(anime => <div key={anime?.id} className='flex gap-6 items-center cursor-pointer hover:bg-[#F47521] hover:text-white p-3 justify-between'>
                                    <div className='flex gap-2'>
                                        <div className='w-12 flex-shrink-0'>
                                            <img className='w-full h-full object-cover' src="https://image.api.playstation.com/vulcan/ap/rnd/202106/1704/JzL1NLQvok7Pghe9W5PP2XNV.png" alt="" />
                                        </div>
                                        <div>
                                            <h1 className='font-semibold text-sm leading-none'>{anime?.name}</h1>
                                            <p className='text-xs font-extralight line-clamp-1 leading-none pt-1'>{anime?.description}</p>
                                            <div className='flex mt-1 items-center gap-3'>
                                                <div className=' flex text-xs font-medium items-center gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0Z"/></svg>
                                                    <span>{anime?.views_count}</span>
                                                </div>
                                                <div className='flex text-xs font-medium items-center gap-1'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.388 2.25t-1.362 2.412q-.975 1.313-2.625 2.963T13.45 19.7L12 21Zm0-2.7q2.4-2.15 3.95-3.688t2.45-2.674q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.688T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3Zm0-6.825Z"/></svg>
                                                    <span>{anime?.views_count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className='text-xs font-semibold'>Ongoing</span>
                                        <div className='flex items-center gap-1 leading-none cursor-pointer text-[14px]'>
                                            <span className='text-xs font-semibold'>{anime?.rating}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.49 1.09L9.08 4.3a.51.51 0 0 0 .41.3l3.51.52a.54.54 0 0 1 .3.93l-2.53 2.51a.53.53 0 0 0-.16.48l.61 3.53a.55.55 0 0 1-.8.58l-3.16-1.67a.59.59 0 0 0-.52 0l-3.16 1.67a.55.55 0 0 1-.8-.58L3.39 9a.53.53 0 0 0-.16-.48L.67 6.05A.54.54 0 0 1 1 5.12l3.51-.52a.51.51 0 0 0 .41-.3l1.59-3.21a.54.54 0 0 1 .98 0Z"/></svg>
                                            <span className='text-xs font-semibold'>(22.k)</span>
                                        </div>
                                    </div>
                                </div>)
                            }
                            <div className='my-2 hover:text-[#F47521] text-center text-sm font-medium underline'>
                                <Link>Show More...</Link>
                            </div>
                        </>
                    </div>

                }
                
            </div>
            <nav className='sm:block hidden'>
                <ul className='flex items-center gap-10 font-semibold text-white'>
                    <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/Index' ? 'text-yellow-400' : null}`}>
                        <Link href={window.route('group.home')}>Home</Link>
                    </li>
                    <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/List' ? 'text-yellow-400' : null}`}>
                        <Link href={window.route('group.animes')}>Anime List</Link>
                    </li>
                    <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/NewSeason' ? 'text-yellow-400' : null}`}>
                        <Link href='/'>New Season</Link>
                    </li>
                    <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/Popular' ? 'text-yellow-400' : null}`}>
                        <Link href='/'>Popular</Link>
                    </li>
                    <li className={`hover:text-yellow-400 trasnition-all ${component === 'Group/SaveList' ? 'text-yellow-400' : null}`}>
                        <Link href={window.route('group.savelist')}>SaveList</Link>
                    </li>
                </ul>
            </nav>
            <div className="sm:hidden flex items-center gap-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill='white' x="0px" y="0px" width="26" height="26" viewBox="0 0 30 30">
                        <path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"></path>
                    </svg>
                </div>
                <div className='text-white'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12H40a12 12 0 0 1 0-24h176a12 12 0 0 1 12 12ZM40 76h176a12 12 0 0 0 0-24H40a12 12 0 0 0 0 24Zm176 104H40a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24Z"/></svg>
                </div>
            </div>
            <div className='xl:block hidden'>
                {
                    auth.user ?
                        <div className='flex items-center gap-5'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='cursor-pointer' fill='white' width="25" height="25" viewBox="0 0 24 24">
                                <path  d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path>
                            </svg>
                            <div onClick={() => {
                                setIsProfileOpen(prev => !prev)
                            }} className='w-[46px] profile-container relative cursor-pointer h-[46px] rounded-full border-2 border-white '>
                                <img src={Profile} className="w-full rounded-full h-full object-cover" />
                                {
                                    isProfileOpen &&
                            <div ref={profileRef} className='absolute  bg-white rounded-md z-30 w-[200px] border-2 top-[130%] right-0'>
                                <div className='w-3 h-3 -translate-y-1 absolute top-0 -z-10 right-5  bg-white rotate-45'></div>
                                <div className='flex hover:bg-gray-200 hover:text-[#F47521]  items-center px-3 py-3 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                                    <Link>Dashboard</Link>
                                </div>
                                <div className='flex hover:bg-gray-200 hover:text-[#F47521]  items-center px-3 py-3 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 11q.825 0 1.413-.588Q14 9.825 14 9t-.587-1.413Q12.825 7 12 7q-.825 0-1.412.587Q10 8.175 10 9q0 .825.588 1.412Q11.175 11 12 11Zm0 2q-1.65 0-2.825-1.175Q8 10.65 8 9q0-1.65 1.175-2.825Q10.35 5 12 5q1.65 0 2.825 1.175Q16 7.35 16 9q0 1.65-1.175 2.825Q13.65 13 12 13Zm0 11q-2.475 0-4.662-.938q-2.188-.937-3.825-2.574Q1.875 18.85.938 16.663Q0 14.475 0 12t.938-4.663q.937-2.187 2.575-3.825Q5.15 1.875 7.338.938Q9.525 0 12 0t4.663.938q2.187.937 3.825 2.574q1.637 1.638 2.574 3.825Q24 9.525 24 12t-.938 4.663q-.937 2.187-2.574 3.825q-1.638 1.637-3.825 2.574Q14.475 24 12 24Zm0-2q1.8 0 3.375-.575T18.25 19.8q-.825-.925-2.425-1.612q-1.6-.688-3.825-.688t-3.825.688q-1.6.687-2.425 1.612q1.3 1.05 2.875 1.625T12 22Zm-7.7-3.6q1.2-1.3 3.225-2.1q2.025-.8 4.475-.8q2.45 0 4.463.8q2.012.8 3.212 2.1q1.1-1.325 1.713-2.95Q22 13.825 22 12q0-2.075-.788-3.887q-.787-1.813-2.15-3.175q-1.362-1.363-3.175-2.151Q14.075 2 12 2q-2.05 0-3.875.787q-1.825.788-3.187 2.151Q3.575 6.3 2.788 8.113Q2 9.925 2 12q0 1.825.6 3.463q.6 1.637 1.7 2.937Z"/></svg>
                                    <Link>Profile</Link>
                                </div>
                                <div onClick={()=> router.post(window.route('group.logout'))} className='flex hover:bg-gray-200 hover:text-[#F47521]  items-center px-3 py-3 gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2h9a2 2 0 0 1 2 2v2h-2V4H6v16h9v-2h2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path fill="currentColor" d="M16.09 15.59L17.5 17l5-5l-5-5l-1.41 1.41L18.67 11H9v2h9.67z"/></svg>
                                    <span >Logout</span>
                                </div>
                            </div>
                                }
                            </div>
                        </div>
                        :
                        <div className=' flex items-center gap-3'>
                            <Button text={'Sign In'} className={'!bg-[#F47521] !px-12 !gap-1'} link={window.route('group.login')}  />
                            <Button text={'Sign Up'} className={'!border-[#F47521] !px-12 !gap-1 !text-[#F47521]'} outline link={window.route('group.register')} />
                        </div>
        
                }
            </div>
        </SectionContainer>
    )
}

export default Navbar

