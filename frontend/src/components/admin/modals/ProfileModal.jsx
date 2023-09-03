import React, { useEffect, useState } from 'react'
import ModalContainer from './ModalContainer';
import { getActorProfile } from '../../../api/actor';
import { useNotification } from '../../../hooks';

export default function ProfileModal({visible,profileId,onClose}) {
    const [profile,setProfile]=useState({});
    const {updateNotification}=useNotification();
    console.log("clickec");
    const fecthActorProfile=async()=>{
        const {error,actor}=await getActorProfile(profileId);
        if(error) updateNotification("error",error);
        setProfile(actor);

    }
    useEffect(()=>{
        if(profileId) fecthActorProfile()
    },[profileId])
const {avatar,name,about}=profile;
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <div className="p-5 rounded bg-white dark:bg-primary w-72 flex flex-col items-center space-y-3">
            <img src={avatar} alt="" className='w-28 h-28 rounded-full' />
            <h1 className='dark:text-white text-primary font-semibold'>{name}</h1>
            <p className='dark:text-dark-subtle text-light-subtle '>{about}</p>
            
        </div>
    </ModalContainer>
  )
}
