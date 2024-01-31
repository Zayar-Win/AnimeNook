import React from 'react'
import DeleteWarn from '@/../assets/DeleteWarn'
import Button from './Button'

const DeleteModal = () => {
    return (
        <div className='fixed flex items-center justify-center top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.4)]'>
            <div className='w-[40%] rounded-lg gap-3 py-8 flex flex-col items-center text-black bg-white'>
                <DeleteWarn className={'text-red-500 w-10 h-10'} />
                <h1 className='text-[20px] font-bold'>Are you Sure?</h1>
                <p className='text-gray-600 text-[18px]'>This action cannot be undo.</p>
                <div className='w-[60%]'>
                    <Button type={'button'} className={'!text-black w-full'} outline text={'Cancel'} />
                </div>
                <div className='w-[60%]'>
                    <Button type={'button'} className={'!bg-red-500 w-full'} text={'Delete'} />
                </div>
            </div>
        </div>
    )
}

export default DeleteModal