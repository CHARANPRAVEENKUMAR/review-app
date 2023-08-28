import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

export default function TagsInput({name,onChange,value}) {
    const [tag,setTag]=useState('');
    const [tags,setTags]=useState([]);

    const input=useRef();
    const tagsInput=useRef();
    //useEffect(()=>{onChange(tags)},[tags])
    useEffect(()=>{
        if(value.target) setTags(value);
    },[value]);

    const handleOnChange=({target})=>{ //e.target
        const {value}=target;
        if(value!==',')setTag(value);
        onChange(tags);
    }
     
    const handleKeyDown=({key})=>{
        console.log(key);
        if(key===','||key==='Enter'){
            if(!tag) return //if no tag is created
            if(tags.includes(tag)) return setTag('');   //handlig duplicates
            setTags([...tags,tag]);
            console.log(tags);
            setTag('');  //remve after colletion
        }
        if(key==='Backspace' && tags.length && !tag){
        const newTags=tags.filter((_,index)=>index!==tags.length-1);
            setTags([...newTags]);

        }  
    };

    const removeTag=(tagToRemove)=>{
        const newTags=tags.filter((tag)=>tag!==tagToRemove);
            setTags([...newTags]);
    }

    const handleOnFocus=()=>{
        tagsInput.current.classList.remove("dark:border-dark-subtle","border-light-subtle");
        tagsInput.current.classList.add("dark:border-white","border-primary");

    }
    const handleOnBlur=()=>{
        tagsInput.current.classList.add("dark:border-dark-subtle","border-light-subtle");
        tagsInput.current.classList.remove("dark:border-white","border-primary");

    }

    useEffect(()=>{
        input.current.scrollIntoView(false); //to keep the user at the end of the scroll 
    },[tag])

  return (
    <div>
    <div ref={tagsInput} onKeyDown={handleKeyDown} className="border-2 bg-transparent dark:border-dark-subtle border-light-subtle flex items-center rounded w-full dark:text-white h-10 space-x-2 overflow-auto custom-scroll-bar transition">
           
           {tags.map(t=> <Tag onClick={()=>{removeTag(t)}} key={t}>{t}</Tag>)}
            <input ref={input} type="text" id={name} className=" flex-grow  bg-transparent dark:text-white outline-none" 
            placeholder="Tag One, Tag Two"
            value={tag}
            onChange={handleOnChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            />
    </div>
    </div>
  )
}

const Tag=({children,onClick})=>{
    return (
        <span className="dark:bg-white bg-primary dark:text-primary text-white text-sm flex items-center px-1 whitespace-nowrap">{children}
           <button onClick={onClick} type='button'>
                <AiOutlineClose size={12}/>
           </button>
           </span>

    );
}