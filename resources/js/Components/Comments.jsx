import React from 'react'
import {format } from 'timeago.js'
import Reply from '@/../assets/Reply';
import Like from '@/../assets/Like';
import Edit from '@/../assets/Edit';
import Delete from '@/../assets/Delete';

const Comments = ({comments}) => {
    return (
        <div>
            {
                comments?.length > 0 ? 
                    comments.map((comment,i) => (
                        <div key={i} className='flex gap-4 mt-8 text-white'>
                            <div className='w-[60px] shrink-0'>
                                <img className='w-full h-[60px] rounded-full object-cover ' src={comment?.user?.profile_picture} alt="" />
                            </div>
                            <div>
                                <div className='flex gap-2 items-center'>
                                    <h1 className='uppercase  font-bold'>{comment?.user?.name}</h1>
                                    <span className='text-gray-400 font-medium'>{format(comment?.created_at)}</span>
                                </div>
                                <p className='py-2 font-semibold' dangerouslySetInnerHTML={{__html: comment.body}}></p>
                                <div className='flex items-center gap-4 mt-2'> 
                                    <div className='flex cursor-pointer items-center gap-1'>
                                        <Reply className={'w-5 h-5'} />
                                        <span className='uppercase text-sm font-semibold'>Reply</span>
                                    </div>
                                    <div className='flex cursor-pointer items-center gap-1'>
                                        <Like className={'w-5 h-5'} />
                                        <span className='uppercase text-sm font-semibold'>Likes</span>
                                    </div>
                                    <div className='flex cursor-pointer items-center gap-1'>
                                        <Edit className={'w-5 h-5'} />
                                        <span className='uppercase text-sm font-semibold'>Edit</span>
                                    </div>
                                    <div className='flex cursor-pointer items-center gap-1'>
                                        <Delete className={'w-5 h-5'} />
                                        <span className='uppercase text-sm font-semibold'>Delete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                    : <div className='w-full h-[300px] flex items-center justify-center'>
                        <p className='font-2xl font-bold text-white'>No comments are created yet.</p>
                    </div>
            }
        </div>
    )
}

export default Comments