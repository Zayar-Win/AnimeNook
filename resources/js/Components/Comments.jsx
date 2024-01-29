import React from 'react'
import {router, usePage} from '@inertiajs/react';
import Comment from './Comment';

const Comments = ({comments,anime,manga}) => {
    const {auth} = usePage().props;

    const likeOrUnlike = (comment) => {
        router.post(window.route('group.comment.like',{comment}),{},{
            preserveScroll:true,
            preserveState:true
        })
    }
    return (
        <div>
            {
                comments?.length > 0 ? 
                    comments.map((comment,i) => (
                        <Comment key={i} comment={comment} manga={manga} anime={anime} auth={auth} likeOrUnlike={likeOrUnlike} />
                    ))
                    : <div className='w-full h-[300px] flex items-center justify-center'>
                        <p className='font-2xl font-bold text-white'>No comments are created yet.</p>
                    </div>
            }
        </div>
    )
}

export default Comments