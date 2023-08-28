import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsFillSunFill } from 'react-icons/bs';
import { useTheme } from '../../hooks';
import AppSearchForm from '../form/AppSearchForm';

export default function Header({onAddMovieClick,onAddActorClick}) {
  const [showOptions,setShowOptions]=useState(false);
  const {toggleTheme}=useTheme();

  const options=[{title:'Add Movie',onClick:onAddMovieClick},
                {title:"Add Actor",onClick:onAddActorClick},];

  return (
    <div className=" flex items-center justify-between relative p-5">
        <AppSearchForm placeholder="Search Movies..." />
      <div className="flex items-center space-x-3 ">
        <button className='dark:text-white text-light-subtle' onClick={toggleTheme}> <BsFillSunFill size={24} /></button>
        
        <button onClick={()=>{setShowOptions(true)
        console.log(`create clicked so setting visibility to true`)}
        } 
        className='flex items-center space-x-2 border-secondary hover:border-primary text-light-subtle hover:opacity-80 transition font-semibold border-2 rounded text-lg px-3 py-1 dark:text-dark-subtle dark:border-dark-subtle '>
            <span> Create</span>
            <AiOutlinePlus/>
        </button>

        <CreateOptions 
        visible={showOptions}  
        onClose={()=>{setShowOptions(false)}}
        options={options}
        />
      </div>
    </div>
  )
}


const CreateOptions=({visible,onClose,options})=>{
  const container=useRef(); //hook react
  const containerID='option-container';

  useEffect(()=>{
    const handleClose=(e)=>{
        console.log(e.target);
        if(!visible) return ;
        const {parentElement,id}=e.target;
       
        if(parentElement.id===containerID || id===containerID) return //this line prevents you not closing options when you click on the movies or action options
       if(container.current){
        if(!container.current.classList.contains('animate-scale')){
         container.current.classList.add('animate-scale-reverse'); }      
      }}
      document.addEventListener('click',handleClose);
        return ()=>{
            document.removeEventListener("click",handleClose);
          }
      },[visible])

      const handleClick=(fn)=>{
          fn();
          onClose();
      }  //after displaying the movieModal we are closing movie button backside 

  if(!visible) return null;
  return( 
    <div 
      id={containerID}
      ref={container} 
      className="absolute right-0 top-12 z-50 flex flex-col space-y-3 p-5 dark:bg-secondary bg-white drop-shadow-lg rounded animate-scale"
      onAnimationEnd={(e)=>{
        console.log("animation ends it can be any  ");
        if(e.target.classList.contains('animate-scale-reverse')) { 
          //console.log(`contains animate-scale-reverse so setting visible to false by onclose`)
          onClose();}
          e.target.classList.remove('animate-scale');
          //console.log("removing animate-scale");
      }}
      >
      {options.map(({title,onClick})=>{
            return <Option key={title} onClick={()=>handleClick(onClick)}>{title}</Option>
      })}
    </div>
 
  );
}

const Option=({children,onClick})=>{
   return (
    <button className="dark:text-white text-secondary hover:opacity-80 " onClick={onClick}> {children} </button>
   )
}



