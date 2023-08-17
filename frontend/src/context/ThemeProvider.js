import React,{createContext, useEffect} from 'react'

export const ThemeContext=createContext()
const defaultTheme='light';
const darkTheme='dark';
export default function ThemeProvider({children}) {

  const toggleTheme=()=>{
    const oldTheme=getTheme();
    console.log(`old theme is ${oldTheme}`);

    const newTheme=oldTheme==="light"?darkTheme:defaultTheme;
    console.log(`$ new theme is${newTheme}`);
    updateTheme(newTheme,oldTheme);
    // document.documentElement.classList.remove(oldTheme)
    // document.documentElement.classList.add(newTheme)
 
    //localStorage.setItem('theme',newTheme)
   // console.log(`updating theme to ${theme}`)
  }

  useEffect(()=>{
    const theme=getTheme();
    console.log(`useEffect working now present theme ${theme}`);
    if(!theme) updateTheme(defaultTheme);
    else updateTheme(theme);
  },[])
  return (
   <ThemeContext.Provider value={{toggleTheme}}> {children}  </ThemeContext.Provider>   
  )
}

const getTheme=()=>{

  return localStorage.getItem("theme");
  
}

const updateTheme=(theme,themeToRemove)=>{
  if(themeToRemove)
  document.documentElement.classList.remove(themeToRemove); 
  
  document.documentElement.classList.add(theme);
  console.log(`added theme is ${theme}`);  

  
  localStorage.setItem('theme',theme);
}
