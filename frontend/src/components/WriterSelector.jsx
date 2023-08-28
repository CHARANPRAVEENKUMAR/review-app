import React, { useState } from 'react'
import { renderItem } from '../utils/helper'
import LiveSearch from './LiveSearch';
import { useSearch } from '../hooks';
import { searchActor } from '../api/actor';

export default function WriterSelector({onSelect}) {
    const [value,setValue]=useState("");
    const [profiles,setProfiles]=useState([]);

    const {handleSearch,resetSearch}=useSearch();

    const handleOnChange=({target})=>{
        const {value}=target;
        setValue(value);
        handleSearch(searchActor,value,setProfiles);
    }

    const handleOnSelect=(profile)=>{
        setValue('');
        onSelect(profile);
        setProfiles([]);
        resetSearch();
    }

  return (
    <LiveSearch
                name="writers" //with this we set id to director inside input
                results={profiles}
                placeholder="search Profile"
                renderItem={renderItem}
                onSelect={handleOnSelect}
                onChange={handleOnChange}
                value={value}
        />
  )
}
