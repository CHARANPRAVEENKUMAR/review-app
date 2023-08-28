import React from 'react'

export default function Selector({name,value,onChange,label,options}) {
  return (
    <select className="border-2 dark:bg-primary bg-white dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary dark:text-dark-subtle text-light-subtle dark:focus:text-white focus:text-primary transition rounded bg-transparent p-1 pr-10 outline-none" id={name} name={name} value={value} onChange={onChange}>
        <option value="">{label}</option>
        {options.map(({title,value})=>{return <option key={title} value={value}>{title}</option>})}
    </select>
  )
}
