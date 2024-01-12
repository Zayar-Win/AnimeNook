import SectionContainer from '@/Components/SectionContainer'
import UserLayout from '@/Layouts/UserLayout'
import React, { useState } from 'react'
import Sort from '@/../assets/Sort';
import Filter from '@/../assets/Filter';
import Tags from '@/Components/Tags';
import {format} from 'timeago.js'
import {Link} from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import useFilter from '@/hooks/useFilter';

const Animes = ({data,filters}) => {
    const [search,setSearch] = useState(filters['search'] || '');
    const [sort,setSort] = useState(filters['sort'] || 'newest');
    const [filter,setFilter] = useState(filters['filter'] || 'all');
    const debounceSearch = useDebounce(search,500);
    const {setIsFilter} = useFilter({search:debounceSearch,sort,filter},window.route('group.animes'));
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
                <div>
                    {
                        data?.animes?.length > 0 &&
                            <div>
                                <h1 className='text-white text-2xl font-bold my-5'>Animes</h1>
                                <div className='grid grid-cols-6 gap-5'>
                                    {data?.animes?.map((anime,i) => (
                                        <div key={i} className='text-white'>
                                            <Link href={window.route('group.anime.detail',{anime})}>
                                                <img src={anime?.thumbnail} className='w-full h-[270px] object-cover object-center' alt={anime?.name} />
                                                <h1 className='pt-3 font-semibold'>{anime?.name}</h1>
                                                <span className='text-sm text-gray-400 font-medium'>{format(anime?.created_at)}</span>
                                                <Tags tags={anime?.tags} className={'flex-wrap'} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div> 
                    }
                    {
                        data?.mangas?.length > 0 &&
                            <div>
                                <h1 className='text-white text-2xl font-bold my-5'>Mangas</h1>
                                <div className='grid grid-cols-6 gap-5'>
                                    {data?.mangas?.map((manga,i) => (
                                        <div key={i} className='text-white'>
                                            <Link href={window.route('group.manga.detail',{manga})}>
                                                <img src={manga?.thumbnail} className='w-full h-[270px] object-cover object-center' alt={manga?.name} />
                                                <h1 className='pt-3 font-semibold'>{manga?.name}</h1>
                                                <span className='text-sm text-gray-400 font-medium'>{format(manga?.created_at)}</span>
                                                <Tags tags={manga?.tags} className={'flex-wrap'} />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div> 
                    }

                    {
                        (data?.animes?.length === 0 && data?.mangas?.length ===0) && <div>
                            <p>No result for search.</p>
                        </div>
                    }
                    
                </div>
            </div>
        </SectionContainer>
    )
}

export default Animes
Animes.layout = (page)  => <UserLayout>{page}</UserLayout>