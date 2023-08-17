import React from 'react'

export default function FormInput({name,placeholder,label,...rest}) {
  return (
    <div className='flex flex-col-reverse'>
        <input 
            id={name}
            name={name}
            className="bg-transparent rounded border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white w-full text-lg outline-none focus:border-primary p-1 dark:text-white peer transition"
            placeholder={placeholder}
            {...rest}
        />
        <label htmlFor={name} className="dark:text-dark-subtle font-semibold dark:peer-focus:text-white text-light-subtle peer-focus:text-primary transition self-start" >{label}</label>
    </div>
  );
}
