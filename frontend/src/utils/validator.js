
export const validateMovie=(movieInfo)=>{
    const {title,storyLine,language,releaseDate,status,type,genres,tags,cast}=movieInfo;
    if(!title.trim())return {error:'title is missing!'}
    if(!storyLine.trim())return {error:'storyLine is missing!'}
    if(!language.trim())return {error:'Language is missing!'}
    if(!releaseDate.trim())return {error:'releaseDate is missing!'}
    if(!status.trim())return {error:'status is missing!'}
    if(!type.trim())return {error:'Type is missing!'}
    //validation for genres
    if(!genres.length)return {error:'Genres are missing!'}
    for(let gen of genres){
      if(!gen.trim())  return {error:"Invalid genres!"} //checking for string 
    }
    //validation for tags
    if(!tags.length)return {error:'Tags are missing!'}
    for(let tag of tags){
      if(!tag.trim())  return {error:"Invalid genres!"}
    }
  
    if(!cast.length)return {error:'Cast and Crew are missing!'}
    for(let c of cast){
      if(typeof c!=='object') return {error:"Invalid cast "}
      //if(!c.tim())  return {error:"Invalid genres!"}
    }
     return {error:null}
  }

