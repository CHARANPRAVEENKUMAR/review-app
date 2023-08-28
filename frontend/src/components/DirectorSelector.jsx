import React, { useState } from 'react'
import LiveSearch from './LiveSearch'
import { renderItem } from '../utils/helper';
import { searchActor } from '../api/actor';
import Label from './Label';
import { useSearch } from '../hooks';

export default function DirectorSelector({onSelect}) {
    const [value,setValue]=useState("");
    const [profiles,setProfiles]=useState([]);

    const {handleSearch,resetSearch}=useSearch();

    const handleOnChange=({target})=>{
        const {value}=target;
        setValue(value);
        handleSearch(searchActor,value,setProfiles);
    }

    const handleOnSelect=(profile)=>{
        setValue(profile.name);
        onSelect(profile);
        setProfiles([])
        resetSearch()
    }

  return (
    <div>
    <Label htmlFor="director">Director:</Label>
    <LiveSearch
        name="director" //with this we set id to director inside input
        results={profiles}
        value={value}
        placeholder="Search profile"
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
    />
    </div>
    
  )
}
