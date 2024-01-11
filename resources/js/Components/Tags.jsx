import React from 'react'

const Tags = ({tags,tagClassName}) => {
    return (
        <div className='flex items-center'> 
            {
                tags.length > 0 && tags?.map((tag,i) =>  {
                    return(
                        <div key={i} className={`text-sm pl-1 flex items-center font-medium text-gray-500 ${tagClassName}`}>
                            {tag?.name}
                            {
                                i + 1 !== tags.length && 
                                        <div className='pl-1'>&#47;</div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Tags