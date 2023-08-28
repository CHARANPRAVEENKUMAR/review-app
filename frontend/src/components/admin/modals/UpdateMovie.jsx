import React, { useState } from 'react'
import ModalContainer from './ModalContainer'
import MovieForm from '../MovieForm';
import { updateMovie } from '../../../api/movie';
import { useNotification } from '../../../hooks';

export default function UpdateMovie({visible,initialState,onSuccess,onClose}) {
    const [busy,setBusy]=useState(false);
    const {updateNotification}=useNotification();

    const handleSubmit=async(data)=>{
        setBusy(true);
    const {error,message,movie} = await updateMovie(initialState.id,data);
        setBusy(false);
        if(error) return updateNotification("error",error);

        updateNotification("success",message);
        console.log(`after success ${movie}`);
        console.log(`after success ${movie}`);
        onSuccess(movie);
        console.log(`after success ${movie}`)
        onClose();
    }
  return (
    <ModalContainer visible={visible} >
        <MovieForm initialState={initialState} btnTitle="Update" onSubmit={!busy?handleSubmit:null} busy={busy} />
    </ModalContainer>
  )
}
