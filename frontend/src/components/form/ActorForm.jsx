import React, { useEffect, useState } from 'react'
import { commonInputClasses } from '../../utils/theme'
import PosterSelector from '../PosterSelector'
import Selector from '../Selector'
import { useNotification } from '../../hooks'
import {ImSpinner3} from 'react-icons/im'

const defaultActorInfo={
    name:"",
    about:"",
    avatar:null,
    gender:""
}


    const genderOptions=[ {title:"Male",value:"male"},
                {title:"Female",value:"female"},
                {title:"Other",value:"other"},     
        ]
    const validateActor=({avatar,name,about,gender})=>{ //destructure actorInfo
        if(!name.trim()) return {error:"actor name is missing!"}
        if(!about.trim()) return {error:"about section is empty!"}
        if(!gender.trim()) return {error:"actor gender is missing!"}
        if(avatar && !avatar.type?.startsWith('image')) return {error:"Invalid  image file!"} //if poster present and gave wrong file
        return {error:null};

    }

export default function ActorForm({title,btnTitle,busy,onSubmit,initialState}) {
    const [actorInfo,setActorInfo]=useState({...defaultActorInfo});
    const [selectedAvatarForUI,setSelectedAvatarForUI]=useState("");
    const {updateNotification}=useNotification(); //destructure notification

    const updateAvatarForUI=(file)=>{
        const url=URL.createObjectURL(file); //javscript provides us URL.createObjectURL to craete url 
        setSelectedAvatarForUI(url);
      }

    const handleChange=({target})=>
    {
        const {value,files,name}=target;
        if(name==="avatar"){
            const file=files[0];
            updateAvatarForUI(file);
            return setActorInfo({...actorInfo,avatar:file})
        }
        setActorInfo({...actorInfo,[name]:value})
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        const {error}=validateActor(actorInfo);
        if(error) return updateNotification('error',error);
        const formData=new FormData()
        for(let key in actorInfo){
            if(key)formData.append(key,actorInfo[key]);
        }
        onSubmit(formData);
    };
    useEffect(()=>{
        if(initialState){
            setActorInfo({...initialState,avatar:null});
            setSelectedAvatarForUI(initialState.avatar);

        }
    },[initialState])

    const {name,about,gender}=actorInfo; //these are used in input values 

  return (        
        <form 
            className="dark:bg-primary bg-white w-[35rem] p-3 rounded "
            onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-3">
                <h1 className='font-semibold text-xl dark:text-white text-primary'>{title}</h1>
                <button type="submit" className=' bg-primary text-white dark:bg-white dark:text-primary hover:opacity-80 h-8 w-24 rounded flex items-center justify-center'>{busy ? <ImSpinner3 className="animate-spin" />:btnTitle} </button>
            </div>
                <div className='flex space-x-2'>
                <PosterSelector 
                    className=" w-36 h-36 aspect-square object-cover"
                    accept="image/jpg, image/jpeg, image/png"
                    selectedPoster={selectedAvatarForUI} 
                    name="avatar" 
                    onChange={handleChange} 
                    label="select Avatar" 
                    />
            <div className="flex-grow flex flex-col space-y-2">
                <input type="text" name="name" className={commonInputClasses+" border-b-2"} placeholder="Enter name" onChange={handleChange} value={name} />
                <textarea className={commonInputClasses+" border-b-2 resize-none h-full"} name="about" value={about} placeholder="about" onChange={handleChange}> </textarea>
            </div>
            </div>
            <div className='mt-3'>
            <Selector options={genderOptions} label="Gender" value={gender} onChange={handleChange} name="gender"  />
            </div>
        </form>
  )
}
