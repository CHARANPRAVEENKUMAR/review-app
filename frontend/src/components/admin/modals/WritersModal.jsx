import React from 'react'
import ModalContainer from './ModalContainer'
import { AiOutlineClose } from 'react-icons/ai'

export default function WritersModal({profiles=[],visible,onClose,onRemoveClick}) {

  if(!visible) return null;

  return( <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar ">
            {profiles.map(({id,name,avatar})=>{
              return (<div className='flex space-x-3' key={id}>
                  <img 
                      className="w-16 h-16 rounded aspect-square object-cover" //object-cover will help you when you reduce dimensions but pic remains same
                      src={avatar} 
                      alt={name} />
                  <p className='dark:text-white text-primary font-semibold w-full'>{name}</p>
                  <button 
                      onClick={()=>onRemoveClick(id)}
                      className="dark:text-white text-primary hover:opacity-80"><AiOutlineClose /></button>
              </div>)
            })}
        </div>
        
    </ModalContainer>)
}
