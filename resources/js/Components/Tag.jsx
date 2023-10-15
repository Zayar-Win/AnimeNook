import React from 'react'

const Tag = ({text,className}) => {
    return (
        <div className={`${className} rounded-lg text-white px-3 py-1 font-semibold text-sm`}>{text}</div>
    )
}

export default Tag