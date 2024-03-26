import React from 'react'
import {Link} from '@inertiajs/react';

const Tags = ({tags,tagClassName,className}) => {
    return (
        <div className={`flex items-center ${className}`}> 
            {
                tags.length > 0 && tags?.map((tag,i) =>  {
                    return(
                        <Link key={i} href={window.route('group.animes',{tags : tag.name})}> 
                            <div className={`text-sm pl-1 flex items-center font-medium text-gray-500 ${tagClassName}`}>
                                {tag?.name}
                                {
                                    i + 1 !== tags.length && 
                                        <div className='pl-1'>&#47;</div>
                                }
                            </div>
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Tags