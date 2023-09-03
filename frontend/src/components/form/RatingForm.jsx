import React, { useEffect, useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Submit from './Submit';

const createArray=(count)=>{
  return new Array(count).fill("") 
}

const ratings=createArray(10);
export default function RatingForm({busy,onSubmit,initialState}) {
  const [selectedRatings,setSelectedRatings]=useState([]);
  const [content,setContent]=useState("");

  const handleMouseEnter=(index)=>{
    const ratings=createArray(index+1);
    //  console.log(ratings);
    setSelectedRatings([...ratings])//aioutline replace with aifill icons
  }
  const handleOnChange=({target})=>{
    setContent(target.value)
  }
  const handleSubmit=()=>{
    if(!selectedRatings.length) return ;
    const data={
      rating:selectedRatings.length,
      content,
    }
    // console.log(data)
    onSubmit(data); //sendingup
  }
  useEffect(()=>{
    if(initialState)  {
      setContent(initialState.content);
      setSelectedRatings(createArray(initialState.rating));
    }
  },[initialState])

  return (
    <div visible ignoreContainer>
        <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
            <div className="text-highlight dark:text-highlight-dark flex items-center relative">
                <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
            <div className="flex items-center absolute top-1/2 -translate-y-1/2">
                <StarsFilled 
                    ratings={selectedRatings} 
                     onMouseEnter={handleMouseEnter} 
                    />
            </div>
            </div>
            <textarea value={content} onChange={handleOnChange} className='h-24 w-full border-2 p-2 dark:text-white text-primary rounded bg-transparent outline-none resize-none'></textarea>
            <Submit value='Rate This Movie' onClick={handleSubmit} busy={busy} />
        </div>
    </div>
  )
}

const StarsOutlined=({ratings,onMouseEnter})=>{
    return  ratings.map((_,index)=>{
        return  (<AiOutlineStar 
                     onMouseEnter={()=>onMouseEnter(index)}
                    className='cursor-pointer' 
                    size={24} 
                    key={index}/>)
    })
    
}
const StarsFilled=({ratings,onMouseEnter})=>{
    return ratings.map((_,index)=>{
        return  (<AiFillStar
                    onMouseEnter={()=>onMouseEnter(index)}
                    className='cursor-pointer' 
                    size={24} 
                    key={index}/>)
    })
    }

