import SectionContainer from '@/Components/SectionContainer'
import UserLayout from '@/Layouts/UserLayout'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Sort from '@/../assets/Sort';
import Filter from '@/../assets/Filter';
import Tags from '@/Components/Tags';
import {format} from 'timeago.js'
import {Link} from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import useFilter from '@/hooks/useFilter';
import axios from 'axios';

const Animes = ({data,filters,tags,paginateData}) => {
    const [search,setSearch] = useState(filters['search'] || '');
    const [filterTags,setFilterTags] = useState(filters['tags']?.split(',') || []);
    const [sort,setSort] = useState(filters['sort'] || 'newest');
    const [filter,setFilter] = useState(filters['filter'] || 'all');
    const debounceSearch = useDebounce(search,500);
    const observer = useRef();
    const [animesAndMangas,setAnimesAndMangas] = useState(data);
    const [isLoading,setIsLoading] = useState(false);
    const {setIsFilter,dynamicParams} = useFilter({search:debounceSearch,sort,filter,tags:filterTags},window.route('group.animes'));
    const [mangaCurrentPage,setMangaCurrentPage] = useState(paginateData?.manga?.currentPage || 1);
    const [animeCurrentPage,setAnimeCurrentPage] = useState(paginateData?.anime?.currentPage || 1);
    const [mangaLastPage] = useState(paginateData?.manga?.lastPage);
    const [animeLastPage] = useState(paginateData?.anime?.lastPage);
    const getAnimesAndMangas = async() => {
        const response = await axios.get(window.route('group.getAnimesAndMangas',{isApi:true,animepage:animeCurrentPage+1,mangapage:mangaCurrentPage+1,...dynamicParams}));
        setAnimesAndMangas(prev => [...prev,...response.data.data])
        setAnimeCurrentPage(response.data.paginateData.anime.currentPage)
        setMangaCurrentPage(response.data.paginateData.anime.currentPage);
    }
    const lastRef = useCallback((node) => {
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting){
                if((animeCurrentPage < animeLastPage || mangaCurrentPage < mangaLastPage) && !isLoading){
                    setIsLoading(true);
                    getAnimesAndMangas();
                    setIsLoading(false);
                }

            }
        })
        if(node) observer.current.observe(node)
    },[animeCurrentPage,mangaCurrentPage,isLoading])
    useEffect(() => {
        setAnimeCurrentPage(1)
        setMangaCurrentPage(1)
        setAnimesAndMangas(data)
    },[data])
    return (
        <SectionContainer className={'bg-black py-10'}>
            <div className='w-[80%] mx-auto'>
                <div className=' flex mb-10 items-center justify-between'>
                    <div className='sm:flex hidden items-center relative gap-3 p-4 xl:max-w-[500px] xl:min-w-[500px] lg:min-w-[380px] rounded-md border border-gray-300'>
                        <input type="text" value={search} onChange={e => {
                            setSearch(e.target.value)
                            setIsFilter(true)
                        }} autoComplete='off' id='search' placeholder='Search Anime' className='bg-transparent text-white p-0 w-full h-full border-0 focus:ring-0 outline-none' />
                    </div>
                    <div className='flex items-center gap-5 text-white'>
                        <div className='flex relative sort items-center gap-2 p-2 hover:bg-gray-700 transition-all cursor-pointer'>
                            <Sort />
                            <span className='uppercase font-semibold'>Newest</span>
                            <ul className='absolute w-[150px] sort-options z-10 hidden top-[100%] right-0 py-3 bg-gray-700 '>
                                <li onClick={()  => {
                                    setSort('popularity')
                                    setIsFilter(true)
                                }} className='p-3 hover:bg-black'>Popularity</li>
                                <li onClick={() => {
                                    setSort('newest')
                                    setIsFilter(true)
                                }} className='p-3 hover:bg-black'>Newest</li>
                            </ul>
                        </div>
                        <div className='flex relative filter items-center gap-2 p-2 hover:bg-gray-700 transition-all cursor-pointer'>
                            <Filter />
                            <span className='uppercase font-semibold'>Filter</span>
                            <ul className='absolute w-[150px] filter-options z-10 hidden top-[100%] right-0 py-3 bg-gray-700 '>
                                <li onClick={() => {
                                    setFilter('all')
                                    setIsFilter(true)
                                }} className='p-3 hover:bg-black'>All</li>
                                <li onClick={() => {setFilter('animes')
                                    setIsFilter(true)}} className='p-3 hover:bg-black'>Animes</li>
                                <li onClick={() => {
                                    setFilter('mangas')
                                    setIsFilter(true)
                                }} className='p-3 hover:bg-black'>Mangas</li>
                            </ul>
                        </div>
                    </div>
                    
                </div>
                {
                    tags.length > 0 &&
                <div className='flex text-white overflow-auto gap-4 tags'>
                    {
                        tags.map(tag => {
                            return (
                                <div key={tag.id} onClick={() => {
                                    setFilterTags(prev => {
                                        if(prev.includes(tag.name)){
                                            return prev.filter(prevTag => prevTag !== tag.name)
                                        }else{
                                            return [...prev,tag.name]
                                        }
                                    })
                                    setIsFilter(true)
                                }} className={`shrink-0 cursor-pointer border-[1px] border-primary px-5 py-1 rounded-3xl ${filterTags.includes(tag.name) ? 'bg-primary text-white' : ''}`}>
                                    {tag.name}
                                </div>
                            )
                        })
                    }
                </div>
                }
                <div>
                    {
                        animesAndMangas?.length > 0 &&
                            <div>
                                <h1 className='text-white text-2xl font-bold my-5'>Animes</h1>
                                <div className='grid grid-cols-6 gap-5'>
                                    {animesAndMangas?.map((data,i) => (
                                        data.type === 'anime' ? (
                                            <div key={i} className='text-white'>
                                                <Link href={window.route('group.anime.detail',{anime : data})}>
                                                    <img src={data?.thumbnail} className='w-full h-[270px] object-cover object-center' alt={data?.name} />
                                                    <h1 className='pt-3 font-semibold'>{data?.name}</h1>
                                                    <span className='text-sm text-gray-400 font-medium'>{format(data?.created_at)}</span>
                                                    <Tags tags={data?.tags} className={'flex-wrap'} />
                                                </Link>
                                            </div>
                                        )
                                            : (
                                                <div key={i} className='text-white'>
                                                    <Link href={window.route('group.manga.detail',{manga : data})}>
                                                        <img src={data?.thumbnail} className='w-full h-[270px] object-cover object-center' alt={data?.name} />
                                                        <h1 className='pt-3 font-semibold'>{data?.name}</h1>
                                                        <span className='text-sm text-gray-400 font-medium'>{format(data?.created_at)}</span>
                                                        <Tags tags={data?.tags} className={'flex-wrap'} />
                                                    </Link>
                                                </div>
                                            )
                                    ))}
                                </div>
                            </div> 
                    }

                    {
                        (animesAndMangas.length ===0) && <div>
                            <p>No result for search.</p>
                        </div>
                    }
                    
                </div>
                <div ref={lastRef}></div>
            </div>
        </SectionContainer>
    )
}

export default Animes
Animes.layout = (page)  => <UserLayout>{page}</UserLayout>