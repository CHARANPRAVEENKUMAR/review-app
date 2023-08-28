import React, {useEffect, useState } from 'react'
import { commonInputClasses } from '../../utils/theme';
import TagsInput from '../TagsInput';
import Submit from '../form/Submit';
import {useNotification} from '../../hooks';
// import ModalContainer from './modals/ModalContainer';
import WritersModal from './modals/WritersModal';
import CastForm from '../form/CastForm';
import CastModal from './modals/CastModal';
import PosterSelector from '../PosterSelector';
import GenresSelector from '../GenresSelector';
import GenresModal from './modals/GenresModal';
import Selector from '../Selector';
import { languageOptions, statusOptions, typeOptions } from '../../utils/options';
import Label from '../Label';
import DirectorSelector from '../DirectorSelector';
import WriterSelector from '../WriterSelector';
import ViewAllBtn from '../ViewAllButton';
import LabelWithBadge from '../LabelWithBadge';
import { validateMovie } from '../../utils/validator';



const defaultMovieInfo={
    title:"",
    storyLine:"",
    tags:[],
    cast:[],
    director:{},
    writers:[],
    releaseDate:"",
    poster:null,
    genres:[],
    type:'',
    language:"",
    status:""
}
//const commonInputClasses="w-full bg-transparent outline-none  transition dark:text-white text-primary dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary  outline-none";

export default function MovieForm({onSubmit,btnTitle,busy,initialState}) {
    const [movieInfo,setMovieInfo]=useState({...defaultMovieInfo});
    //const [showModal,setShowModal]=useState(false);
    const [showWritersModal,setShowWritersModal]=useState(false);
    const [showCastModal,setShowCastModal]=useState(false);
    const [showGenresModal,setShowGenresModal]=useState(false);
    const [selectedPosterForUI,setSelectedPostedForUI]=useState("");

     const {updateNotification} =useNotification(); 

    const handleSubmit=(e)=>{
      e.preventDefault();   //very very important during submit it prevents abnormal behaviour 
      const {error}=  validateMovie(movieInfo);
      if(error) updateNotification('error',error);

      //cast,tags,genres,writers
      const {tags,genres,cast,writers,director,poster}=movieInfo;
      const formData=new FormData();

      const finalMovieInfo={
        ...movieInfo,
      }

      finalMovieInfo.tags=JSON.stringify(tags);
      finalMovieInfo.genres=JSON.stringify(genres);

    //   cast:[
    //     {
    //         actor:{type:mongoose.Schema.Types.ObjectId,ref:"Actor"},
    //         roleAs:String,
    //         leadActor:Boolean,
    //     }
    //  ],

      const finalCast=cast.map((c)=>{
        return {
          actor:c.profile.id,
          roleAs:c.roleAs,
          leadActor:c.leadActor
        }
      });
      finalMovieInfo.cast=JSON.stringify(finalCast);

      if(writers.length){
      const finalWriters=writers.map((w)=>w.id);
      finalMovieInfo.writers=JSON.stringify(finalWriters);
      }

      if(director.id) finalMovieInfo.director=director.id;
      if(poster) finalMovieInfo.poster=poster;

      for(let key in finalMovieInfo){
        formData.append(key,finalMovieInfo[key]);
      }

      onSubmit(formData);
    }
    const updatePosterForUI=(file)=>{
      const url=URL.createObjectURL(file); //javscript provides us URL.createObjectURL to craete url 
      setSelectedPostedForUI(url);
    }

    const handleChange=({target})=>{
        const {value,name,files}=target;
        if(name=== "poster") {
          // const file=files[0];
          // setMovieInfo({...movieInfo,[poster]:file})

          const poster=files[0];  //poster input type file 
          updatePosterForUI(poster);
          return setMovieInfo({...movieInfo,poster});
        }

        setMovieInfo({...movieInfo,[name]:value});
    }

    const updateTags=(tags)=>{ 
        // console.log(tags);  
        setMovieInfo({...movieInfo,tags});
    }
    const updateDirector=(profile)=>{
      setMovieInfo({ ...movieInfo, director: profile });
    }
    const updateCast=(castInfo)=>{
            const {cast}=movieInfo; 
            setMovieInfo({...movieInfo,cast:[...cast,castInfo]})
    }
    const updateGenres=(genres)=>{ 
            setMovieInfo({...movieInfo,genres})
    }
    const updateWriters=(profile)=>{
        const {writers}=movieInfo;
        for(let writer of writers){  //if already presented 
            if(writer.id===profile.id){
                 return updateNotification('warning','this profile is already selected')
            }
        }
            setMovieInfo({...movieInfo,writers:[...writers,profile]});
      
    }

    const displayWritersModal=()=>{
        setShowWritersModal(true);
    }

    const hideWritersModal=()=>{
      setShowWritersModal(false);
    }
    const displayCastModal=()=>{
      setShowCastModal(true);
    }
    const hideCastModal=()=>{
      setShowCastModal(false);
    }
    const displayGenresModal=()=>{
      setShowGenresModal(true);
    }
    const hideGenresModal=()=>{
      setShowGenresModal(false);
    }

    const handleWritersRemove=(profileId)=>{
        const {writers}=movieInfo;
        const newWriters=writers.filter(({id})=>id!==profileId);//removing writer from movieInfo writers when click on x mark in writermodal
        if(! newWriters.length) hideWritersModal();
        setMovieInfo({...movieInfo,writers:[...newWriters]})//spreadoperator
    }
    const handleCastRemove=(profileId)=>{
      const {cast}=movieInfo;
      const newCast=cast.filter(({profile})=>profile.id!==profileId);//removing writer from movieInfo writers when click on x mark in writermodal
      if(! newCast.length) hideCastModal();
      setMovieInfo({...movieInfo,cast:[...newCast]})//spreadoperator
  }
  useEffect(()=>{
      if(initialState){
        setMovieInfo({...initialState,poster:null,releaseDate:initialState.releaseDate.split("T")[0]})
        setSelectedPostedForUI(initialState.poster)
      }
  },[initialState])

    const {title,storyLine,writers,cast,tags,genres,type,status,language,releaseDate}=movieInfo;//destructure after completion of all details enter 
  return (
    <>
    <div className="flex space-x-3">  {/* instead of form we are using div because in form enter leads to submit before submission to prevent that user can submit only by clicking */}
        <div className="w-[70%] space-y-5"> {/* use normal css in that square block */}
            <div>
                <Label htmlFor={'title'}>Title</Label> 
                <input id="title"
                        value={title} 
                        type="text"
                        onChange={handleChange}
                        name="title"
                        className={ commonInputClasses+" border-b-2 transition font-semibold text-xl"}
                        placeholder="Titanic" />
             </div>
             <div>
                <Label htmlFor={'storyLine'}>StoryLine</Label> 
                <textarea 
                className={commonInputClasses+"h-24 border-b-2 resize-none"} 
                value={storyLine}
                name="storyLine"
                onChange={handleChange}
                id="storyLine"
                placeholder="Movie Story line..."
                >
                </textarea>
            </div>
            <div>
            <Label htmlFor="tags">Tags</Label>
            <TagsInput name="tags" onChange={updateTags} value={tags}/>
            </div>
            <DirectorSelector onSelect={updateDirector} />
           
            <div>
              <div className='flex justify-between'>
            <LabelWithBadge htmlFor="writers" badge={writers.length}>Writers:</LabelWithBadge>
            <ViewAllBtn visible={writers.length} onClick={displayWritersModal}>View All</ViewAllBtn>
            </div>
              <WriterSelector onSelect={updateWriters} />
            </div>

            <div>
            <div className='flex justify-between'>
            <LabelWithBadge badge={cast.length}>Add cast & Crew</LabelWithBadge>
            <ViewAllBtn visible={cast.length} onClick={displayCastModal}>View All</ViewAllBtn>
            </div>
              <CastForm onSubmit={updateCast} />
            </div>
            <input type="date" className={commonInputClasses+" border-2 p-1 w-auto rounded"} onChange={handleChange} name="releaseDate" value={releaseDate} />

            <Submit value={btnTitle} busy={busy} onClick={handleSubmit} type="button"  />
        </div>
        <div className="w-[30%] space-y-5">
          <PosterSelector onChange={handleChange} name='poster' selectedPoster={selectedPosterForUI} accept="image/jpg, image/jpeg, image/png" label="select poster" />
          <GenresSelector onClick={displayGenresModal} badge={genres.length} />
          <Selector onChange={handleChange} name='type'  value={type} label="Type" options={typeOptions}/>
          <Selector onChange={handleChange} name="language"  value={language} label="Language" options={languageOptions} />
          <Selector onChange={handleChange} name="status" value={status} label="Status" options={statusOptions}/>
        </div>
    </div>

    <WritersModal 
          visible={showWritersModal} 
          profiles={writers} 
          onRemoveClick={handleWritersRemove}
          onClose={hideWritersModal}> <div className="p-20 bg-red-200"></div></WritersModal>
    <CastModal
          visible={showCastModal} 
          casts={cast} 
          onRemoveClick={handleCastRemove}
          onClose={hideCastModal}> <div className="p-20 bg-red-200"></div></CastModal>
    <GenresModal visible={showGenresModal} onClose={hideGenresModal} onSubmit={updateGenres} previousSelection={genres} /> 
    </>
  )
}




