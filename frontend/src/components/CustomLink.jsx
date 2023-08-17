import React from 'react'
import {Link} from 'react-router-dom'


export const CustomLink = ({to,children}) => {
  return (
    <Link to={to} className="dark:text-dark-subtle text-light-subtle hover:text-primary transition">{children}</Link>
  )
}
