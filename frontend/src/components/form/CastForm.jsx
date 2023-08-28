import React, { useState } from 'react'
import LiveSearch from '../LiveSearch';
import { commonInputClasses } from '../../utils/theme';
import { useNotification, useSearch } from '../../hooks';
import { renderItem } from '../../utils/helper';
import { searchActor } from '../../api/actor';

//const cast=[{actor:id,roleAs:"",leadActor:true}];
const defaultCastInfo={
    profile:{},
    roleAs:"",
    leadActor:false,
}


export default function CastForm({onSubmit}) {
    const [castInfo,setCastInfo]=useState({...defaultCastInfo});//taking refernce not directly assigning the defaultCastInfo
    const [profiles,setProfiles]=useState([]);

    const {updateNotification}=useNotification();
    const {handleSearch,resetSearch}=useSearch();


    const handleOnChange=({target})=>{
        const {value,name,checked}=target;
        console.log(target.name);
        console.log(value);
        if(name==="leadActor") return setCastInfo({...castInfo,leadActor:checked}) //since we dont have a value we assign like this
        setCastInfo({...castInfo,[name]:value})
    }

    const handleProfileSelect=(profile)=>
    {
        setCastInfo({...castInfo,profile});
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const {profile,roleAs}=castInfo;
        if(!profile) return updateNotification("warning","cast profile is missing!");
        if(!roleAs) return updateNotification("warning","cast role is missing!");
        console.log(castInfo) 

        onSubmit(castInfo);
        setCastInfo({...defaultCastInfo });//this is used to reset all fields after submit of cast form
    };
    const handleProfileChange=({target})=>{
        const {value}=target;
        const {profile}=castInfo;
        profile.name=value;
        setCastInfo({...castInfo,...profile});
        handleSearch(searchActor,value,setProfiles);
        resetSearch();
        setProfiles([]);
        setCastInfo({...defaultCastInfo,profile:{name:""}});

    }
    
    const {profile,leadActor,roleAs}=castInfo;
  return (
        <div className="flex items-center space-x-2">
            <input type="checkbox" name="leadActor" className='w-4 h-4' checked={leadActor} onChange={handleOnChange} title="set as lead actor"/>  {/* make sure name and property in the returning thing should same it would make easy */}
            <LiveSearch placeholder="Search Profile" value={profile.name} results={profiles} onSelect={handleProfileSelect} renderItem={renderItem} onChange={handleProfileChange} />
            <span className="dark:text-dark-subtle text-light-subtle font-semibold">as</span>
            <div className='flex-grow'>
                <input 
                    type="text" 
                    className={commonInputClasses+' rounded p-1 text-lg border-2'} 
                    placeholder="Role as" 
                    name="roleAs"
                    onChange={handleOnChange}
                     value={roleAs}
                    />
            </div>
            <button  onClick={handleSubmit} className='bg-secondary dark:bg-white dark:text-primary rounded px-1' type="button">Add</button> {/* type button neded for not submitintg main form i may trigger */}

        </div>
  )
}


