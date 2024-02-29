import Sidebar from '@/Components/Sidebar'
import React from 'react'

const AdminLayout = ({children}) => {
    return (
        <div>
            <Sidebar />
            <div className='pl-[22%]'>{children}</div>
        </div>
    )
}

export default AdminLayout