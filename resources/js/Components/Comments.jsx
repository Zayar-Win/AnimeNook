import React from 'react'
import { usePage} from '@inertiajs/react';
import Comment from './Comment';

const Comments = ({comments,anime,manga}) => {
    const {auth} = usePage().props;
    return (
        <div>
            {
                comments?.length > 0 ? 
                    comments.map((comment,i) => (
                        <Comment key={i} comment={comment} manga={manga} anime={anime} auth={auth} />
                    ))
                    : <div className='w-full h-[300px] flex items-center justify-center'>
                        <p className='font-2xl font-bold text-white'>No comments are created yet.</p>
                    </div>
            }
        </div>
    )
}

export default Comments