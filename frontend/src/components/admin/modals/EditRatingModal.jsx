import React, { useState } from 'react'
import ModalContainer from './ModalContainer'
import RatingForm from '../../form/RatingForm'
import { useParams } from 'react-router-dom'
import {useNotification} from '../../../hooks'
import { addReview, updateReview } from '../../../api/review'

export default function EditRatingModal({visible,onClose,initialState,onSuccess}) {
  const {updateNotification}=useNotification();
  const [busy,setBusy]=useState(false);

  const handleSubmit=async(data)=>{
    setBusy(true)
    console.log(` this 9s very very${initialState}`)
    console.log(initialState.id)
  
   const {error,message}= await updateReview(initialState.id,data);
   setBusy(false)
   if(error) updateNotification("error",error);

   onSuccess({...data});

   updateNotification("success",message);
   onClose();

  }
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} initialState={initialState} />
    </ModalContainer>
  )
}