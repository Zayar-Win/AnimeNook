import React from 'react'
import Tag from './Tag'
import Button from './Button'

const MovieCard = ({anime}) => {
    console.log(anime);
    return (
        <div className='bg-[#0D0D0D] movie-card transition-all text-white rounded-md cursor-pointer p-5'>
            <div className='w-full relative h-[280px] overflow-hidden object-cover'>
                <img className='rounded-md  transition-all w-full h-full object-cover' src={anime?.thumbnail} alt="" />
                <div className='absolute rounded-md top-3 left-3 flex px-3 py-1 items-center bg-black'>
                    <span>{anime?.latestWatchedChapter?.chapter_number || 1}</span>
                    <div className='border-l-2 h-3 border-white rotate-[15deg] mx-2'></div>
                    <span>{anime?.chapters_count}</span>
                </div>
                <div className='absolute flex w-full px-3 items-center justify-between bottom-2'>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5ZM9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0Z"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152c0 .888.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75c4.514 0 7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152c0-.888-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25ZM3.87 9.162C5.498 7.045 8.15 4.75 12 4.75c3.85 0 6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25c-3.85 0-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292Z"/></g></svg>
                        <span className='text-[12px] font-semibold leading-none'>{anime?.views_count}</span>
                    </div>
                    <div className='flex items-center gap-1 px-3 py-2 bg-black rounded-md'> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.188c1 0 1.812.811 1.812 1.812c0 .808.976 1.212 1.547.641l1.867-1.867A2 2 0 0 1 14.828 18H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/></svg>
                        <span className='text-[12px] font-semibold leading-none'>{anime?.comments_count}</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap items-center gap-1 mt-5'>
                {
                    anime?.tags.map(tag => <Tag key={tag.id} text={tag.name} className="bg-[#47BE71]" />)
                }
            </div>
            <div className='flex items-center mt-4 justify-between'>
                <div className='flex items-center gap-2 cursor-pointer hover:text-yellow-400 transition-all'>
                    <span>{parseInt(anime?.rating).toFixed(1)}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.49 1.09L9.08 4.3a.51.51 0 0 0 .41.3l3.51.52a.54.54 0 0 1 .3.93l-2.53 2.51a.53.53 0 0 0-.16.48l.61 3.53a.55.55 0 0 1-.8.58l-3.16-1.67a.59.59 0 0 0-.52 0l-3.16 1.67a.55.55 0 0 1-.8-.58L3.39 9a.53.53 0 0 0-.16-.48L.67 6.05A.54.54 0 0 1 1 5.12l3.51-.52a.51.51 0 0 0 .41-.3l1.59-3.21a.54.54 0 0 1 .98 0Z"/></svg>
                    <span>({anime?.ratings_count})</span>
                </div>
                <div className='cursor-pointer hover:text-yellow-400 transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21V3h14v18l-7-3l-7 3Zm2-3.05l5-2.15l5 2.15V5H7v12.95ZM7 5h10H7Z"/></svg>
                </div>
            </div>
            <h1 className='mt-3 text-xl font-extrabold'>{anime?.name}</h1>
            <p className='font-medium text-sm pt-1'>{anime?.description}</p>
            <Button text={'Watch Now'} className={'inline-block z-10 relative !text-black bg-white hover-effect mt-3'} type='button' />
        </div>
    )
}

export default MovieCard