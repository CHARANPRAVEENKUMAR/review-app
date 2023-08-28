import React, { createContext, useState } from 'react'
import { useNotification } from '../hooks';

export const SearchContext=createContext();

let timeOutId;
const debounce=(func,delay)=>{
  return (...args)=>{
  if(timeOutId) clearTimeout(timeOutId);
  timeOutId=setTimeout(()=>{func.apply(null,args);},delay);  //func.apply is like normal function dont stress much 
  };
}

export default function SearchProvider({children}) {
    const [searching,setSearching]=useState(false);
    const [results,setResults]=useState([]);
    const [resultNotFound,setResultNotFound]=useState(false);

    const {updateNotification}=useNotification();

    const search=async(method,query,updaterFun)=>{  //calling backend api
            const {error,results}= await method(query);
            console.log("came to search");
            if(error) return  updateNotification("error",error);
 
            if(!results.length){
              setResults([])
              updaterFun&&updaterFun([])
               return setResultNotFound(true);
              }
            setResultNotFound(false);
            setResults(results);

            updaterFun&& updaterFun([...results]);
    };
    
    const debounceFunc=debounce(search,300);

    const handleSearch=(method,query,updaterFun)=> {
        setSearching(true);
        if(!query.trim()){
            updaterFun&&updaterFun([]);
           return  resetSearch();
        } //validation
        debounceFunc(method,query,updaterFun);
    };
    
    const resetSearch=()=>{
      setSearching(false);
      setResults([]);
      setResultNotFound(false);
    }

  return (
    <SearchContext.Provider 
        value={{handleSearch, searching, resultNotFound, resetSearch,results}}
        >

        {children}
    </SearchContext.Provider>
  )
}
