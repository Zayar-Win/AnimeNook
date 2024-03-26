import React from 'react'
import SectionContainer from './SectionContainer'
import {Link} from '@inertiajs/react';
import LogoImg from '../../assets/logo.png';
import Logo from './Logo';


const Footer = () => {
    return (
        <SectionContainer className='bg-[#0D0D0D]'>
            <div className='pt-20 sm:px-20 px-3 text-white'>
                <div className='text-white grid sm:grid-cols-3 xxs:grid-cols-2 grid-cols-1 gap-10 '>
                    <div className='xxs:justify-self-center'> 
                        <h1 className='text-lg font-bold'>Navigation</h1>
                        <ul className='mt-3'>
                            <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                <Link href={window.route('group.animes',{sort:'popularity'})}>Browse Popular</Link>
                            </li>
                            <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                <Link href={window.route('group.animes',{filter:'animes'})}>Browse Anime</Link>
                            </li>
                            <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                <Link href={window.route('group.animes',{filter : 'mangas'})}>Browse Manga</Link>
                            </li>
                            <li className='text-[15px] font-medium pb-2 hover:text-white hover:underline text-gray-400'>
                                <Link href={window.route('group.animes',{sort : 'newest'})}>New</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='xxs:justify-self-center'>
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
                    <div className='xxs:justify-self-center'>
                        <h1 className='text-lg font-bold'>Account</h1>
                        <ul className='mt-3'>
                            <li>
                                <Link href={window.route('group.register')} className='text-[15px] font-medium hover:text-white hover:underline text-gray-400'>Create Account</Link>
                            </li>
                            <li >
                                <Link href={window.route('group.login')} className='text-[15px] font-medium hover:text-white hover:underline text-gray-400'>Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='w-full h-[0.6px] my-5 bg-white'></div>
                <div className='flex items-center sm:flex-row flex-col justify-between'>
                    <div className='flex items-center gap-3'>
                        <Logo logo={LogoImg} className="!w-32" />
                        <span className='text-lg cursor-pointer hover:text-yellow-400 font-bold'>AnimeNook</span>
                    </div>
                    <div className='cursor-pointer hover:text-yellow-400 sm:pb-0 pb-10'>
                        <span>All right serverd © Developed By Zayarwin</span>
                    </div>
                </div>
            </div>
        </SectionContainer>
    )
}

export default Footer