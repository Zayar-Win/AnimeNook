import React from 'react'
import ReactQuill from 'react-quill'
import {useForm} from '@inertiajs/react'
import Button from './Button'

const CommentForm = ({manga,anime}) => {
    const {data,setData,post,errors,reset} = useForm({
        comment:'',
        mangaId : manga?.id,
        animeId  : anime?.id
    })
    return (
        <div className='flex items-start gap-5 mb-16'>
            <div className='w-[60px]'>
                <img className='object-cover w-full h-[60px] rounded-full' src={manga?.thumbnail} alt="" />
            </div>
            <div className='grow h-[150px] text-black'>
                <ReactQuill value={data.comment} onChange={data => setData('comment',data)} theme='snow' className='text-black'  />
                {
                    errors?.comment && <span>{errors?.comment}</span>
                }
                <div className='flex justify-end'>
                    <Button type={'button'} className={'!bg-primary my-2 !px-10'} text={'Comment'} onClick={() => post(window.route('group.comment.create'),{
                        preserveScroll:true,
                        onSuccess:() => reset()
                    })} />
                </div>
            </div>
        </div>
    )
}

export default CommentForm