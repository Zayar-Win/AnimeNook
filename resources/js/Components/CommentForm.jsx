import React, { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import {useForm} from '@inertiajs/react'
import Button from './Button'

const CommentForm = ({manga,anime,comment,focus,type='create',onSuccess = () => {}}) => {
    const {data,setData,post,errors,reset} = useForm({
        comment:comment ? comment.body :'',
        mangaId : manga?.id,
        animeId  : anime?.id,
        commentId : comment?.id
    })
    const quillRef = useRef();
    useEffect(() => {
        if(focus){
            let editor = quillRef.current.editor;
            let length = editor.getLength();
            editor.setSelection(length, length);
            editor.focus();
        }
    },[])
    return (
        <div className='grow h-[150px] text-black'>
            <ReactQuill ref={quillRef} value={data.comment} onChange={data => setData('comment',data)} theme='snow' className='text-black'  />
            {
                errors?.comment && <span>{errors?.comment}</span>
            }
            <div className='flex justify-end'>
                <Button type={'button'} className={'!bg-primary my-2 !px-10'} text={type === 'create' ? 'Comment' : 'Update'} onClick={() => post(type === 'create' ? window.route('group.comment.create') : window.route('group.comment.update'),{
                    preserveScroll:true,
                    onSuccess:() => {
                        reset();
                        onSuccess();
                    }
                })} />
            </div>
        </div>
    )
}

export default CommentForm