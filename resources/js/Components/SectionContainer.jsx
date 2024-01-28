import React from 'react'

const SectionContainer = ({children,className,padding=true,...props}) => {
    return (
        <div {...props} className={` ${className}  ${padding ? 'lg:px-10 px-3' : 'px-0'}`}>{children}</div>
    )
}

export default SectionContainer