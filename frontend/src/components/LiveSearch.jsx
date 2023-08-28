import React, { forwardRef, useEffect, useRef, useState } from 'react'
const commonInputClasses="w-full bg-transparent outline-none transition dark:text-white text-primary dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary  outline-none";

export default function LiveSearch({
    value = "",
    placeholder = "",
    results = [],
    name,
    resultContainerStyle,
    selectedResultStyle,
    inputStyle,
    renderItem = null,
    onChange = null,
    onSelect = null,
}) {
    const [displaySearch,setDisplaySearch]=useState(false);
    const [focusedIndex,setFocusedIndex]=useState(-1);
    const [defaultValue,setDefaultValue]=useState('');

    const handleOnFocus=()=>{
        if(results.length) setDisplaySearch(true);
    }
    const closeSearch = () => {
        setDisplaySearch(false);
        setFocusedIndex(-1);
      };
    const handleOnBlur=()=>{
        closeSearch();
    }

    const handleSelection=(selectedItem)=>{
      if(selectedItem) onSelect(selectedItem);
      closeSearch(); 
       //console.log(selectedItem);
    }

    const handleKeyDown=({key})=>{
        let nextCount; //we use let because we cahnge its value
        console.log(key);
        const keys=['ArrowDown','ArrowUp','Enter','Escape']
        if(!keys.includes(key)) return ;
        console.log(focusedIndex);
        //move selection up and down
        if(key==='ArrowDown'){
            nextCount=(focusedIndex+1)%results.length;
            console.log(nextCount);
        }
        if(key==='ArrowUp'){
            nextCount=(focusedIndex+results.length-1)%results.length;
            console.log(nextCount);
        }
        if(key==='Enter'){
            return handleSelection(results[focusedIndex])
        }
        if(key==='Escape'){
          return closeSearch();
            
        }
        setFocusedIndex(nextCount);
    }

    const getInputStyle = () => {
        return inputStyle
          ? inputStyle
          : commonInputClasses + " border-2 rounded p-1 text-lg";
      };
      useEffect(()=>{
          if(results.length) return setDisplaySearch(true);
          setDisplaySearch(false);
      },[results.length]);

     const  handleChange=(e)=>{
            setDefaultValue(e.target.value);
            onChange&& onChange(e)  //if onchange present it executes
      }
      //to cahnge the livesearch value
    useEffect(()=>{
     setDefaultValue(value);
    },[value])

  return (
    <div 
        tabIndex={1}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        className="relative outline-none"
        
        >
        <input 
            type="text" 
            id={name}
            className={getInputStyle()}
            placeholder={placeholder}
            onChange={handleChange}
            value={defaultValue}
            name={name}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDown}
            />
        <SearchResults 
            results={results}
            visible={displaySearch}
            focusedIndex={focusedIndex}
            onSelect={handleSelection}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={selectedResultStyle}
            />
    </div>
  )
}
// const renderItem=({id,name,avatar})=>{
//     return (<div className="flex">
//         <img src={avatar} alt="" />
//         <p>{name}</p>
//     </div>)

// }

const SearchResults=({visible,results,focusedIndex,onSelect,renderItem,resultContainerStyle,selectedResultStyle,})=>{
    const resultContainer=useRef();
    useEffect(()=>{
        resultContainer.current?.scrollIntoView({
            behavior:'smooth',
            block:"center",  
        })
    },[focusedIndex]);

    if(!visible) return null;
    return (
        <div className="absolute z-50 right-0 left-0 bg-white top-10 dark:bg-secondary shadow-md p-2 max-h-64 overflow-auto custom-scroll-bar">
        {results.map((result,index)=>{
            const getSelectedClass=()=>{
                return selectedResultStyle? selectedResultStyle:'dark:bg-dark-subtle bg-light-subtle'
            };
            return <ResultCard 
                        ref={index===focusedIndex?resultContainer:null}
                        key={index.toString()} 
                        item={result} 
                        renderItem={renderItem} 
                        resultContainerStyle={resultContainerStyle} 
                        selectedResultStyle={index===focusedIndex?getSelectedClass():""} onClick={()=> onSelect(result)} 
                        onMouseDown={() => onSelect(result)}
                        />
        })}
        </div>
    )
}

const ResultCard=forwardRef((props,ref)=>{  //learn forwardref
   const {item,renderItem,resultContainerStyle,selectedResultStyle,onMouseDown,}=props;

        const getClasses=()=>{
            if(resultContainerStyle) return resultContainerStyle+" "+selectedResultStyle;
            return (
            selectedResultStyle+"cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition flex space-x-2 ")
        }
        return (
            <div onMouseDown={onMouseDown} ref={ref} className={getClasses()}>
              {renderItem(item)}
            </div>
          );
})




// on focus-active input,on blur inactive input,onkeydown returns the key with call back function learn about forwardref
/*
import React, { useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../utils/theme";

export const results = [
  {
    id: "1",
    avatar:
      "https://images.unsplash.com/photo-1643713303351-01f540054fd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "John Doe",
  },
  {
    id: "2",
    avatar:
      "https://images.unsplash.com/photo-1643883135036-98ec2d9e50a1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Chandri Anggara",
  },
  {
    id: "3",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "4",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
  {
    id: "5",
    avatar:
      "https://images.unsplash.com/photo-1578342976795-062a1b744f37?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Amin RK",
  },
  {
    id: "6",
    avatar:
      "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    name: "Edward Howell",
  },
];

export default function LiveSearch() {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };

  const handleOnBlur = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };

  const handleSelection = (selectedItem) => {
    console.log(selectedItem);
  };

  const handleKeyDown = ({ key }) => {
    let nextCount;
    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
    if (!keys.includes(key)) return;

    // move selection up and down
    if (key === "ArrowDown") {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === "ArrowUp") {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }

    if (key === "Enter") return handleSelection(results[focusedIndex]);

    setFocusedIndex(nextCount);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={commonInputClasses + " border-2 rounded p-1 text-lg"}
        placeholder="Search profile"
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
      />
      <SearchResults
        results={results}
        visible={displaySearch}
        focusedIndex={focusedIndex}
        onSelect={handleSelection}
      />
    </div>
  );
}

const SearchResults = ({ visible, results = [], focusedIndex, onSelect }) => {
  const resultContainer = useRef();

  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  if (!visible) return null;

  return (
    <div className="absolute right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
      {results.map((result, index) => {
        const { id, name, avatar } = result;
        return (
          <div
            onClick={() => onSelect(result)}
            ref={index === focusedIndex ? resultContainer : null}
            key={id}
            className={
              (index === focusedIndex
                ? "dark:bg-dark-subtle bg-light-subtle"
                : "") +
              " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition flex space-x-2"
            }
          >
            <img
              src={avatar}
              alt={name}
              className="w-16 h-16 rounded object-cover"
            />
            <p className="dark:text-white font-semibold ">{name}</p>
          </div>
        );
      })}
    </div>
  );
};

except click all are working basic logic it is just refracting make it more complex

*/
