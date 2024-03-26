import React from 'react'
import {Link} from '@inertiajs/react';
const Logo = ({logo,className}) => {
    return (
        <Link href={window.route("group.home")}>
            <img src={logo} className={`w-full h-full ${className}`} alt="" />
        </Link>
    )
}

export default Logo