import React from 'react'

export default function NotFoundText({text,visible}) {
    if(!visible) return null;
  return (
    <h1 className='font-semibold dark:text-white text-secondary text-center py-5 text-3xl opacity-40'>
    Record Not Found
  </h1>
  )
}
