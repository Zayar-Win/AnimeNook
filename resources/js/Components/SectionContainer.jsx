import React from 'react'

const SectionContainer = ({children,className}) => {
  return (
    <div className={`px-10 ${className}`}>{children}</div>
  )
}

export default SectionContainer