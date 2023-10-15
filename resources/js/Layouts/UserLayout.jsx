import { usePage } from '@inertiajs/react';
import React, { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const UserLayout = ({children}) => {
    const {toastMessage}  = usePage().props;
    useEffect(() => {
        if(toastMessage.success || toastMessage.warning || toastMessage.error){
            let type = 'success';
            let message = '';
            if(toastMessage.success){
                type = 'success';
                message = toastMessage.success;
            }
            if(toastMessage.warning){
                type = 'waring';
                message = toastMessage.warning
            }
            if(toastMessage.error){
                type = 'error';
                message = toastMessage.error
            }
            // toast.dismiss();
            toast(message,{
                type
            })
        }
    },[toastMessage])
    return (
        <div>
            {children}
            <ToastContainer position='bottom-right' />
        </div>
    )
}

export default UserLayout