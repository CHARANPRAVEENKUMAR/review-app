import React from 'react'
import ModalContainer from './ModalContainer'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'

export default function CastModal({casts=[],visible,onClose,onRemoveClick}) {

  if(!visible) return null;

  return (<ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar ">
            {casts.map(({profile,leadActor,roleAs})=>{
                console.log(profile);
                console.log(casts);
                const {name,avatar,id}=profile;
                console.log(name);
                console.log(id);
              return( <div className='flex space-x-3 dark:bg-secondary bg-white drop-sahdow-md rounded' key={id}>
                  <img 
                      className="w-16 h-16 rounded aspect-square object-cover" //object-cover will help you when you reduce dimensions but pic remains same
                      src={avatar} 
                      alt={name} />
                      <div className="flex flex-col w-full justify-between py-1">
                        <div>
                            <p className='dark:text-white text-primary font-semibold'>{name}</p>
                            <p className='text-sm dark:text-dark-subtle text-light-subtle'>{roleAs}</p>
                        </div>
                        {leadActor && (
                        <AiOutlineCheck className="text-light-subtle dark:text-dark-subtle" />)}
                      </div>
                  
                  <button 
                      onClick={()=>onRemoveClick(id)}
                      className="dark:text-white text-primary hover:opacity-80"><AiOutlineClose /></button>
              </div>);
            })}
        </div>
        
    </ModalContainer>);
}