import React, { useState } from 'react'
import {FileUploader} from 'react-drag-drop-files'; //3rd party package
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNotification } from '../../hooks';
import { uploadMovie, uploadTrailer } from '../../api/movie';
import MovieForm from './MovieForm';
import ModalContainer from './modals/ModalContainer';

export default function MovieUpload({visible,onClose}) {
    const [videoSelected,setVideoSelected]=useState(false);
    const [videoUploaded,setVideoUploaded]=useState(false);
    const [uploadProgress,setUploadProgress]=useState(0);
    const [videoInfo,setVideoInfo]=useState({
    title: "",
    storyLine: "",
    tags: [],
    cast: [],
    director: {},
    writers: [],
    releseDate: "",
    poster: null,
    genres: [],
    type: "",
    language: "",
    status: "",
    trailer: {
      url: "",
      public_id: "",
    },
        
    });
    const [busy,setBusy]=useState(false);
    
    const {updateNotification}=useNotification();
    const handleTypeError=(error)=>{
        updateNotification("error",error)
    }
    const handleUploadTrailer=async (data)=>{
        const {error,url,public_id}=await uploadTrailer(data,setUploadProgress);  //callback function
        if(error) return updateNotification('error',error);

        setVideoUploaded(true);
        setVideoInfo({url,public_id});
    };

    const handleChange=(file)=>{
      const formData=new FormData(); //an api in javascript formdata
      formData.append('video',file);
      setVideoSelected(true); 
      handleUploadTrailer(formData);  
  }
  //here handle upload trailer need to be created for a purpose of not overlapping 

    const getUploadProgressValue=()=>{
        if(!videoUploaded && uploadProgress>=100) {
            return 'Processing'
        }
        return `upload Progress ${uploadProgress}%`;

    }
    const handleSubmit=async(data)=>{
        if(!videoInfo.url || !videoInfo.public_id) return updateNotification("error","trailer is missing!");
        setBusy(true);

        data.append("trailer",JSON.stringify(videoInfo)); //send to backend api
        const res=await uploadMovie(data);
        setBusy(false);
        console.log(res);

        onClose(); //required

    }

    return(
        <ModalContainer visible={visible} >
            <div className="mb-4">
            <UploadProgress
            visible ={!videoUploaded && videoSelected}
            message={getUploadProgressValue()} 
            width={uploadProgress}
             />
             </div>
        {!videoSelected?(
        <TrailerSelector
            visible={!videoSelected}
            onTypeError={handleTypeError} 
            handleChange={handleChange} 
        />):(
        <MovieForm busy={busy} onSubmit={!busy?handleSubmit:null} btnTitle="Upload" /> 
        )}
        </ModalContainer>
        );
  
}
const TrailerSelector=({visible,handleChange,onTypeError})=>{
    
  if(!visible) return null;

  return (
        <div className="h-full flex justify-center items-center">
        <FileUploader types={['mp4','avi']} handleChange={handleChange} onTypeError={onTypeError}> 
          <div className=' w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full
          flex flex-col items-center justify-center dark:text-dark-subtle text-secondary cursor-pointer'>
              <AiOutlineCloudUpload size={80} />
              <p>Drop Your File here!</p>
          </div>
        </FileUploader>
        
    </div>
    )
  
}

const UploadProgress=({width,message,visible})=>{
    if(!visible) return null;
    return (
        <div className="dark:bg-secondary bg-white shadow-lg rounded p-3">
        <div className='h-3 relative dark:bg-dark-subtle bg-light-subtle overflow-hidden'>
                <div style={{width:width+"%"}} className="h-full absolute left-0 dark:bg-white bg-secondary">
                </div>
            </div>
            <p className="font-semibold dark:text-dark-subtle text-light-subtle animate-pulse mt-1 "> {message}</p>
        </div>

    )
}


// dark mode dark: ,use absolute inside relative component inside react return use [] for declaring the normal css
