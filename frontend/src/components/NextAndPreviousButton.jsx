import React from 'react'

export default function NextAndPreviousButton({onNextClick,onPrevClick,className=''}) {
    const getClasses=()=>{
        return "flex justify-end items-center space-x-3"
    }
  return (
    <div className={getClasses()+className}>
        <Button title='Previous' onClick={onPrevClick} />
        <Button title='Next' onClick={onNextClick} />
  </div>
  )
}

const Button=({title,onClick})=>{
return (
    <button className='text-primary dark:text-white hover:underline' type="button" onClick={onClick}>{title}</button>
)    
}