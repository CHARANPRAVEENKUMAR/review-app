import React from 'react'

export default function FormInput({name,placeholder,label,...rest}) {
  return (
    <div className='flex flex-col-reverse'>
        <input 
            id={name}
            name={name}
            className="bg-transparent rounded border-2 border-dark-subtle focus:border-white w-full text-lg outline-none p-1 text-white peer transition"
            placeholder={placeholder}
            {...rest}
        />
        <label htmlFor={name} className='text-dark-subtle font-semibold peer-focus:text-white transition self-start'>{label}</label>
    </div>
  );
}
