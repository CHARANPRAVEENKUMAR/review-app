import React, { useEffect, useState } from 'react'
import MovieListItem from '../MovieListItem'
import { getMovieForUpdate, getMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import NextAndPreviousButton from '../NextAndPreviousButton';
import UpdateMovie from './modals/UpdateMovie';

const limit=8;
let currentPageNo=0;

export default function Movies() {
  const [movies,setMovies]=useState([]);
  const [reachedToEnd,setReachedToEnd]=useState(false);
  const [showUpdateModal,setShowUpdateModal]=useState(false);
  const [selectedMovie,setSelectedMovie]=useState(null);

  const {updateNotification}=useNotification();

  const fetchMovies=async (pageNo)=>{
    const {error,movies}=await getMovies(pageNo,limit);
    if(error) updateNotification('error',error);

    if(!movies.length){
      currentPageNo=pageNo-1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  }
 

  const handleOnNextClick=()=>{
    if(reachedToEnd) return ;
    currentPageNo+=1;
    fetchMovies(currentPageNo);
  }
  const handleOnPreviousClick=()=>{
    if(currentPageNo<=0)return; //we are in first page
    if(reachedToEnd) setReachedToEnd(false);

    currentPageNo-=1;
    fetchMovies(currentPageNo);
  }
  const handleOnEditClick=async({id})=>{
    const {movie,error}= await getMovieForUpdate(id);//api call
    console.log(`the api return movie ${{movie}}`)
      
      if(error) updateNotification('error',error);
      setSelectedMovie(movie);
      setShowUpdateModal(true);

  }

  const handleOnUpdate=(movie)=>{
    console.log(movie)
    const updatedMovies= movies.map((m)=>{
        if(m.id === movie.id) return movie;
        return m
      });
      setMovies([...updatedMovies])
  }
  const hideUpdateForm=()=>{
    setShowUpdateModal(false);
  }

  useEffect(()=>{fetchMovies(currentPageNo)},[])

  return (
    <>
    <div className="space-y-3">
      {movies.map((movie)=>{
          return <MovieListItem key={movie.id} movie={movie} onEditClick={()=>handleOnEditClick(movie)} /> //since we are using map we need to use keys to make them unique
      })}
      <NextAndPreviousButton onPrevClick={handleOnPreviousClick} onNextClick={handleOnNextClick} />

    </div>
    <UpdateMovie visible={showUpdateModal} initialState={selectedMovie} onSuccess={handleOnUpdate} onClose={hideUpdateForm} />
    </>
  )
}
