import { Link } from '@inertiajs/react'
import React from 'react'

const Tag = ({className,href,tag}) => {
    return (
        <Link href={href || window.route('group.animes',{tags : tag.name})} className={` rounded-lg text-white px-3 py-1 font-semibold text-sm ${className}`}>{tag.name}</Link>
    )
}

export default Tag