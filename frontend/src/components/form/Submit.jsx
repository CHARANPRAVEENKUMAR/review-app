import React from 'react'

export default function Submit({value}) {
  return (
    <input
    type="submit"
    className="bg-white text-secondary rounded w-full hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer p-1"
    value={value}
    />
  )
}
