import { Link } from '@inertiajs/react'
import React from 'react'

const Button = ({link,text,className,textClassName}) => {
  return (
    <div className={`bg-white text-white px-4 py-2 rounded-lg font-semibold ${className}`}>
      <Link className={textClassName} href={link}>
      {text}
      </Link>
    </div>
  )
}

export default Button