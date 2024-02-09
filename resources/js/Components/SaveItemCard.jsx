import React from 'react'
import Tags from './Tags'
import Delete from '@/../assets/Delete'
import { router} from '@inertiajs/react'

const SaveItemCard = ({item,type,itemId,collectionId}) => {
    const removeCollectionItem = () => {
        router.post(window.route('group.remove.save.item',{collection:collectionId,item:itemId}),{
        },{
            preserveScroll:true
        })
    }
    return (
        <div className='cursor-pointer' onClick={() => {
            type === 'anime' ? router.get(window.route('group.anime.detail',{anime:item})) : router.get(window.route('group.manga.detail',{manga:item}))
        }}>
            <div className='text-white'>
                <div>
                    <img src={item.thumbnail} className='w-full h-[200px] object-cover' alt="" />
                </div>
                <h1 className='mt-2 text-lg font-medium'>{item.name}</h1>
                <p className='text-gray-300 text-sm leading-snug line-clamp-2'>{item.description}</p>
                <p className='text-gray-400 font-medium pt-2'>Start Watching Ep1</p>
                <div className='mt-3 flex items-center py-4 px-2 justify-between'>
                    <div>
                        <Tags tags={item.tags} />
                    </div>
                    <div>
                        <div onClick={(e) => {e.stopPropagation();removeCollectionItem()}}>
                            <Delete  className={'w-7 h-7'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SaveItemCard