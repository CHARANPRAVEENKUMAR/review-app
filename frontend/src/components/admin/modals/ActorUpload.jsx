import React, { useState } from 'react'
import ModalContainer from './ModalContainer'
import ActorForm from '../../form/ActorForm'
import { createActor } from '../../../api/actor';
import { useNotification } from '../../../hooks';

export default function ActorUpload({visible,onClose}) {
    const {updateNotification}=useNotification();
    const [busy,setBusy]=useState(false);

    const handleSubmit=async (data)=>{   
      setBusy(true);
        const {error,actor}=await createActor(data);
        setBusy(false);
        if(error) return updateNotification("error",error) 
        
        updateNotification("success","Actor created successfully")
        onClose(); //after submission close
    }

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <ActorForm onSubmit={handleSubmit} title="Create NewActor" btnTitle="create" busy={busy} />
    </ModalContainer>
  )
}
