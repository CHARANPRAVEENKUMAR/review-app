import React from 'react'

export default function CustomButtonLink({label,clickable=true,onClick}) {
    const className=clickable ?'text-highlight dark:text-highlight-dark hover:underline':'text-highlight dark:text-highlight-dark cursor-pointer'

  return (
    <button type="button" onClick={onClick}  className={className}>{label}</button>
  )
}
