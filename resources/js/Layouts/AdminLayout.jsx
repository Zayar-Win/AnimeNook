import React from 'react'
import ToastLayout from './ToastLayout'
import {sidebarLinks} from '@/Components/AdminLinks';
import Sidebar from '@/Components/Sidebar'
const AdminLayout = ({children}) => {
    return (
        <ToastLayout>
            <Sidebar sidebarLinks={sidebarLinks} />
            <div className="pl-[22%]">{children}</div>
        </ToastLayout>
    )
}

export default AdminLayout