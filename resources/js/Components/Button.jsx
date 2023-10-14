import { Link } from '@inertiajs/react'
import React from 'react'

const Button = ({link,text,className,outline,Icon,type}) => {
  return (
    <>
      {
        type === 'button' ? 
        <div className='inline-block cursor-pointer'>
        <div className={`flex items-center flex-grow-0 gap-3 ${outline ? 'border-2 border-black bg-transparent' : 'bg-white'} text-white px-4 py-2 rounded-lg font-semibold ${className}`}>
          {
            Icon && <span>{Icon}</span>
          }
          <span>{text}</span>
        </div>
        </div>
        :
      <div className={` cursor-pointer flex items-center gap-3  flex-grow-0 text-white px-4 py-2 rounded-lg font-semibold ${className} ${outline ? 'border-2 border-black bg-transparent' : ''}`}>
          {Icon && <span>{Icon}</span>}
          <Link href={link}>
            {text}
          </Link>
          </div>
      }
      </>
  )
}

export default Button