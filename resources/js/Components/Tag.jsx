import { Link } from '@inertiajs/react'
import React from 'react'

const Tag = ({text,className,href='#'}) => {
    return (
        <Link href={href} className={` rounded-lg text-white px-3 py-1 font-semibold text-sm ${className}`}>{text}</Link>
    )
}

export default Tag