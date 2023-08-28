import React, { useEffect, useState } from 'react'
import ModalContainer from './ModalContainer'
import { genres } from '../../../utils/genres'
import Submit from '../../form/Submit';

export default function GenresModal({visible,onClose,onSubmit,previousSelection}) {
    const [selectedGenres,setSelectedGenres]=useState([]);

  const handleGenresSelector=(gen)=>{
      let newGenres=[];
      if(selectedGenres.includes(gen)) {
        newGenres=selectedGenres.filter(genre=>genre!==gen)//removing genre
      }
      else newGenres=[...selectedGenres,gen]
      setSelectedGenres([...newGenres])
  }

  const handleSubmit=()=>{
    onSubmit(selectedGenres);
    onClose()
  }
  const handleClose=()=>{
      setSelectedGenres(previousSelection);  //to ensure our selected genres wouldnot disaapear after come out
      onClose();
  }
  useEffect(()=>{
    setSelectedGenres(previousSelection)
  },[])

  return (
    <ModalContainer visible={visible} onClose={handleClose}>
      <div className="flex flex-col justify-between h-full ">
        <div>
        <h1 className='dark:text-white text-primary text-2xl text-center '> Select Genres</h1>
        <div className='space-y-3'>
        {genres.map((gen,index)=>{
          return <Genre selected={selectedGenres.includes(gen)} key={gen} onClick={()=>{handleGenresSelector(gen)}}>{gen}</Genre>
        })}
        </div>
        </div>
        </div>
          <div className="w-56 ml-auto">
        <Submit onClick={handleSubmit} value='select' type="button" />
        </div>

    </ModalContainer>
  )
}

const Genre=({children,selected,onClick})=>{
  const getSelectedStyle=()=>{
    return selected?" dark:bg-white dark:text-primary bg-light-subtle text-white" :"dark:text-white text-primary";
  }
  return( 
    <button 
        onClick={onClick}
        className={(getSelectedStyle())+' border-2 dark:border-dark-subtle border-light-subtle mr-3  p-1 rounded '} 
        >
          {children} 
    </button>
  )
}
