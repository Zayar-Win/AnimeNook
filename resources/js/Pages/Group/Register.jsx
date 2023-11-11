import React from 'react'
import Logo from '../../../assets/logo.png'
import Button from '@/Components/Button'
import { Link, useForm } from '@inertiajs/react'
const Register = () => {
    const {data,setData,errors,post,clearErrors} = useForm({
        name:'',
        email:'',
        password:''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        post(window.route('group.register'));
    }
    return (
        <div className='w-full h-[100vh] flex items-center justify-center bg-[#0D0D0D]'>
            <div className='w-[80%] flex rounded-lg p-10 gap-8 bg-white'>
                <div className='basis-[60%]'>
                    <div className='w-32 h-32'>
                        <img src={Logo} alt="" className='w-full h-full object-cover' />
                    </div>
                    <div className='border-l-4 border-l-yellow-400 rounded-md py-3 pl-4'>
                        <div className='flex items-baseline gap-3'>
                            <h1 className='text-3xl font-medium text-[#F47521]'>Konnichiwa!</h1>
                            <span className='text-sm font-medium'>My fellow Otaku!</span>
                        </div>
                        <p className='text-gray-700 font-medium w-[60%] pt-2'>Heard you would like watching anime.Dive into the world of all animes and series.</p>
                    </div>
                    <form onSubmit={handleSubmit} className='mt-10 w-[70%]'>
                        <div className={`relative ${errors.name ? 'shake' : ''}`}>
                            <input id='name' value={data.name} onChange={e => {
                                setData('name',e.target.value)
                                clearErrors();
                            }} className={'w-full pl-0  animate-input outline-none  focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400'} type="text" name='name' />
                            <label className={`absolute transition-all ${data.name !== '' ? 'active' : ''} animate-label block bottom-3 left-0 text-sm  font-medium text-gray-600`}  htmlFor="name">Name</label>
                            {
                                errors.name && 
                <span className='absolute left-0 text-sm font-medium bottom-[-22px] text-red-500'>{errors.name}</span>
                            }
                        </div>
                        <div className={`relative mt-8 ${errors.email ? 'shake' : ''}`}>
                            <input id='email' value={data.email} onChange={e => {
                                setData('email',e.target.value)
                                clearErrors();
                            }} className='w-full pl-0 animate-input outline-none  focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400' type="text" name='name' />
                            <label className={`absolute transition-all ${data.email !== '' ? 'active' : ''} animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}  htmlFor="name">Email</label>
                            {
                                errors.email && 
                <span className='absolute left-0 text-sm font-medium bottom-[-22px] text-red-500'>{errors.email}</span>
                            }
                        </div>
                        <div className={`relative mt-8 ${errors.password ? 'shake' : ''}`}>
                            <input id='password' value={data.password} onChange={e => {
                                setData('password',e.target.value)
                                clearErrors();
                            }} className='w-full pl-0 animate-input outline-none  focus:ring-0 focus:border-yellow-400 focus:outline-none border-b-2 border-0 border-b-yellow-400' type="password" name='password' />
                            <label className={`absolute transition-all ${data.password !== '' ? 'active' : ''} animate-label block bottom-3 left-0 text-sm font-medium text-gray-600`}  htmlFor="password">Password</label>
                            {
                                errors.password && 
                <span className='absolute transition-all left-0 text-sm font-medium bottom-[-22px] text-red-500'>{errors.password}</span>
                            }
                        </div>
                        <Button text={'Register'} type={'submit'} className={'bg-yellow-400 my-8 !px-20 inline-block'} />
                        <span className='block  text-sm text-gray-700'>You already have an account? <Link href={window.route('group.login')} className='text-blue-500 hover:underline font-semibold'>Login</Link> here.</span>
                    </form>
                </div>
                <div className='basis-[40%]'>
                    <img className='w-full h-full object-cover' src="https://cdn.oneesports.gg/cdn-data/2023/06/Anime_OnePiece_Wallpaper_StrawHatPirates_Complete.jpg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default Register