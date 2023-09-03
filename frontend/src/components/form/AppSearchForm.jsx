import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';

const defaultInputStyle=' dark:border-dark-subtle border-dark-subtle dark:focus:border-white focus:border-primary text-white dark:text-white text-secondary'

export default function AppSearchForm({placeholder,onSubmit,showResetIcon,onReset}) {
    const [value,setValue]=useState('');
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        onSubmit(value);
    }
    const handleReset=()=>{
        setValue(''); //remove name
        onReset(); //setting results 

    }

  return (
    <form onSubmit={handleOnSubmit} className='relative'>
        <input 
            type="text" 
            className={"border-2 transition  bg-transparent rounded text-lg p-1 outline-none "+defaultInputStyle} 
            placeholder={placeholder} 
            value={value} 
            onChange={({target})=>{setValue(target.value) 
            console.log(value);}}/>

        {showResetIcon?(<button onClick={handleReset} type="button" className='absolute top-1/2 -translate-y-1/2  right-2 text-secondary dark:text-white'>
            <AiOutlineClose />
            </button>):null
        }
    </form>
  )
}
