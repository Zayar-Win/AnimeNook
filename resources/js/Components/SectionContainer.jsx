import React from 'react'

const SectionContainer = ({children,className,padding=true,...props}) => {
    return (
        <div {...props} className={` ${className}  ${padding ? 'px-10' : 'px-0'}`}>{children}</div>
    )
}

export default SectionContainer