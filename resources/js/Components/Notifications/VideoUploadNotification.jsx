import React from 'react'
import { format } from 'timeago.js'

const VideoUploadNotification = ({notification}) => {
    return (
        <a href={notification.data.link}>
            <div  className={'flex items-center gap-3 cursor-pointer px-2 py-2 hover:bg-gray-200'}>
                <div className="">
                    <img className="w-[70px] h-[70px] rounded-md object-cover" src={notification.data.thumbnail}  alt="" />
                </div>
                <div className="w-full">
                    <h1 className="font-semibold">New Episode Uploaded</h1>
                    <p className=" text-sm font-semibold">{notification.data.name}</p>
                    <div className='flex w-full items-center justify-between'>
                        <p className="text-sm font-bold">{notification.data.title} 
                        </p>
                        <p className="text-sm font-bold">{format(notification.created_at)}</p>
                    </div>
                </div>
            </div>
        </a>
    )
}

export default VideoUploadNotification