import React, { useState } from 'react'
import {format } from 'timeago.js'
import Reply from '@/../assets/Reply';
import Edit from '@/../assets/Edit';
import Delete from '@/../assets/Delete';
import Liked from '@/../assets/Liked';
import CommentForm from './CommentForm';
import DeleteModal from './DeleteModal';
import { router } from '@inertiajs/react';
const Comment = ({comment,auth,anime,manga}) => {
    const [isEditFormOpen,setIsEditFormOpen] = useState(false);
    const [isDeleteModelOpen,setIsDeleteModelOpen] = useState(false);
    const [isReplyFormOpen,setIsReplyFormOpen] = useState(false);
    const commentDelete = () => {
        router.post(window.route('group.comment.delete',{comment}),comment,{
            preserveScroll:true,
            onSuccess:() => {
                setIsDeleteModelOpen(false);
            }
        })
    }
    const likeOrUnlike = () => {
        router.post(window.route('group.comment.like',{comment}),{},{
            preserveScroll:true,
            preserveState:true
        })
    }
    return (
        <>
            <div  className='flex gap-4 mt-8 text-white'>
                <div className='xs:w-[60px] w-[40px] shrink-0'>
                    <img className='w-full xs:h-[60px] h-[40px] rounded-full object-cover ' src={comment?.user?.profile_picture} alt="" />
                </div>
                <div className={'flex flex-col grow'}>
                    <div className='flex gap-2 items-center'>
                        <h1 className='uppercase xs:text-base text-sm font-bold'>{comment?.user?.name}</h1>
                        <span className='text-gray-400 xs:text-base text-xs font-medium'>{format(comment?.created_at)}</span>
                    </div>
                    {
                        isEditFormOpen ? <div className='pl-6 mt-5'><CommentForm anime={anime} manga={manga} onSuccess={() => setIsEditFormOpen(false)} comment={comment} focus type='update'  /></div> : 
                            <>
                                <p className='py-2 font-semibold' dangerouslySetInnerHTML={{__html: comment.body}}></p>
                                <div className='flex items-center gap-4 mt-2'> 
                                    {
                                        !comment?.comment_id &&
                                    <div onClick={() => setIsReplyFormOpen(prev => !prev)} className='flex cursor-pointer items-center gap-1'>
                                        <Reply className={'w-5 h-5'} />
                                        <span className='uppercase text-sm font-semibold'>Reply</span>
                                    </div>
                                    }
                                    <div onClick={likeOrUnlike} className='flex cursor-pointer items-center gap-1'>
                                        <Liked  className={`w-5 h-5 ${comment?.isLikeByCurrentUser ? 'text-primary' : '' }`} />
                                        <span className='uppercase text-sm font-semibold'>{comment?.likes_count} Likes</span>
                                    </div>
                                    {
                                        auth?.user?.id === comment?.user_id &&
                                        <>
                                            <div onClick={() => setIsEditFormOpen(prev => !prev)} className='flex cursor-pointer items-center gap-1'>
                                                <Edit className={'w-5 h-5'} />
                                                <span className='uppercase text-sm font-semibold'>Edit</span>
                                            </div>
                                            <div onClick={() => setIsDeleteModelOpen(prev => !prev) } className='flex cursor-pointer items-center gap-1'>
                                                <Delete className={'w-5 h-5'} />
                                                <span className='uppercase text-sm font-semibold'>Delete</span>
                                            </div>
                                        </>
                                    }
                                </div>
                                {
                                    isDeleteModelOpen && <DeleteModal title={'Delete Comment'} deleteHandler={commentDelete} setIsDeleteModelOpen={setIsDeleteModelOpen} />
                                }
                            </>
                    }
                    {
                        isReplyFormOpen &&  <div className='mt-4'><CommentForm anime={anime} manga={manga} onSuccess={() => setIsReplyFormOpen(false)} comment={comment} focus type='reply'  /></div>
                    }
                </div>
            </div>
            <div className='ml-[60px]'>
                {
                    comment?.comments?.length ? comment.comments.map(comment => (
                        <Comment comment={comment} key={comment.id} manga={manga} anime={anime} auth={auth} />
                    ))
                        : null
                }
            </div>
        </>
    )
}

export default Comment