import UserLayout from '@/Layouts/UserLayout'
import React, { useEffect, useState } from 'react'
import SaveListIcon from '@/../assets/SaveList'
import SectionContainer from '@/Components/SectionContainer'
import SaveItemCard from '@/Components/SaveItemCard'
import {Link} from '@inertiajs/react'
import { getQueryParam } from '@/helpers/getQueryParams'
import {usePage} from '@inertiajs/react';

const SaveList = ({collections}) => {
    const [activeTab,setActiveTab] = useState('');
    const [collectionItems,setCollectionItems]  = useState([]);
    const [collection,setCollection]  = useState(null);
    const {url}  = usePage();
    useEffect(() => {
        const tab = getQueryParam(url,'tab') || collections[0].name ;
        setActiveTab(tab);
        const collection = collections?.find(collection => collection.name === tab);
        setCollection(collection)
        setCollectionItems(collection?.collection_items || []);
    },[collections])
    return (
        <SectionContainer className={'bg-[#0D0D0D] flex flex-col items-center'}>
            <div className='flex py-10 items-center text-white justify-center gap-2'>
                <SaveListIcon className={'w-8 h-8 text-white'} />
                <h1 className='text-3xl font-medium'>My Lists</h1>
            </div>
            <div className='xl:w-[70%] w-[95%]'>
                <div className='border-b-2 text-white border-b-gray-500'> 
                    <div className='flex items-center xs:gap-0 gap-3 justify-center'>
                        {
                            collections.map(collection => (
                                <Link href={window.route('group.savelist',{tab:collection.name})} key={collection.id}>
                                    <div className={`sm:px-12 xs:px-8 px-2 py-4 hover:bg-gray-900 border-b-[3px] ${activeTab === collection.name ? 'border-b-primary' : 'border-b-transparent'}  cursor-pointer uppercase font-bold`}>{collection.name}</div>
                                </Link>
                            ))
                        }
                        <Link href={window.route('group.savelist',{tab:'history'})}>
                            <div  className={`sm:px-12 xs:px-8 px-4 py-4 hover:bg-gray-900 border-b-[3px] ${activeTab === 'history' ? 'border-b-primary' : 'border-b-transparent'} cursor-pointer uppercase font-bold`}>History</div>
                        </Link>
                    </div>
                </div>
                <div>
                    {
                        collectionItems.length > 0 ?
                            <div className='grid md:grid-cols-3 sms:grid-cols-2 gap-5 mt-10'>
                                {
                                    collectionItems.map(item => (
                                        <SaveItemCard itemId={item.id} collectionId={collection.id} type={item?.item_type === 'App\\Models\\Anime' ? 'anime' : 'manga'} key={item.id} item={item.item} />
                                    ))
                                }
                            </div>
                            :
                            <div className='h-[400px] flex items-center text-gray-400 text-3xl font-bold w-full justify-center'>
                                <p>No Items</p>
                            </div>
                    }
                </div>
            </div>
        </SectionContainer>
    )
}

export default SaveList
SaveList.layout = page => <UserLayout>{page}</UserLayout>