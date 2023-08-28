import React, { useState } from 'react'
import { useNotification } from '../../../hooks';
import ActorForm from '../../form/ActorForm';
import ModalContainer from './ModalContainer';
import { updateActor } from '../../../api/actor';

export default function UpdateActor({visible,onClose,initialState,onSuccess}) {
  
    const {updateNotification}=useNotification();
    const [busy,setBusy]=useState(false);

    const handleSubmit=async (data)=>{   
         setBusy(true);
        const {error,actor}=await updateActor(initialState.id,data);
        setBusy(false);
        if(error) return updateNotification("error",error);
        console.log(`profile is ${actor}`)
        onSuccess(actor);
        updateNotification("success","Actor updated successfully")
        onClose(); //after submission close
    }

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
        <ActorForm onSubmit={!busy?handleSubmit:null} title="Update Actor" btnTitle="Update" busy={busy} initialState={initialState} />
    </ModalContainer>
  )
}
