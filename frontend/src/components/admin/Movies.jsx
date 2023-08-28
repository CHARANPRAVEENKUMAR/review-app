import React, { useEffect, useState } from 'react'
import MovieListItem from '../MovieListItem'
import { deleteMovie, getMovieForUpdate, getMovies } from '../../api/movie';
import { useMovies, useNotification } from '../../hooks';
import NextAndPreviousButton from '../NextAndPreviousButton';
import UpdateMovie from './modals/UpdateMovie';
import ConfirmModal from './modals/ConfirmModal'

const limit=8;
let currentPageNo=0;

export default function Movies() {
  const [movies,setMovies]=useState([]);
  const [reachedToEnd,setReachedToEnd]=useState(false);
  const [busy,setBusy]=useState(false);
  const [showUpdateModal,setShowUpdateModal]=useState(false);
  const [showConfirmModal,setShowConfirmModal]=useState(false);
  const [selectedMovie,setSelectedMovie]=useState(null);

  const {updateNotification}=useNotification();
  
  const {fetchMovies,movies:newMovies,fetchPreviousPage,fetchNextPage}=useMovies(); 

  // const fetchMovies=async (pageNo)=>{
  //   const {error,movies}=await getMovies(pageNo,limit);
  //   if(error) updateNotification('error',error);

  //   if(!movies.length){
  //     currentPageNo=pageNo-1;
  //     return setReachedToEnd(true);
  //   }

  //   setMovies([...movies]);
  // }
 

  // const handleOnNextClick=()=>{
  //   if(reachedToEnd) return ;
  //   currentPageNo+=1;
  //   fetchMovies(currentPageNo);
  // }
  // const handleOnPreviousClick=()=>{
  //   if(currentPageNo<=0)return; //we are in first page
  //   if(reachedToEnd) setReachedToEnd(false);

  //   currentPageNo-=1;
  //   fetchMovies(currentPageNo);
  // }
  // const handleOnEditClick=async({id})=>{
  //   const {movie,error}= await getMovieForUpdate(id);//api call
  //   console.log(`the api return movie ${{movie}}`)
      
  //     if(error) updateNotification('error',error);
  //     setSelectedMovie(movie);
  
  //     setShowUpdateModal(true);

  // }
  // const handleOnDeleteClick=(movie)=>{
  //   setSelectedMovie(movie);
  //     setShowConfirmModal(true);

  // }
  // const handleOnDeleteConfirm=async()=>{
  //   setBusy(true);
  //   const {message,error}= await deleteMovie(selectedMovie.id);
  //   setBusy(false);
  //   if(error) updateNotification('error',error);
  //   updateNotification('success',message);
  //   hideConfirmModal();
  //   fetchMovies(currentPageNo);

  // }

  // const handleAfterUpdate=(movie)=>{
  //   console.log(movie)
  //   const updatedMovies= movies.map((m)=>{
  //       if(m.id === movie.id) return movie;
  //       return m
  //     });
  //     setMovies([...updatedMovies])
  // }
  // const hideUpdateForm=()=>{
  //   setShowUpdateModal(false);
  // }
  // const hideConfirmModal=()=>{
  //   setShowConfirmModal(false);
  // }

  const handleUIUpdate=()=>fetchMovies();

  useEffect(()=>{fetchMovies(currentPageNo)},[])

  return (
    <>
    <div className="space-y-3">
      {newMovies.map((movie)=>{
          return <MovieListItem 
                        key={movie.id} 
                        movie={movie} 
                        afterDelete={handleUIUpdate}
                        afterUpdate={handleUIUpdate}
                        // onEditClick={()=>handleOnEditClick(movie)} 
                        // onDeleteClick={()=>handleOnDeleteClick(movie)} 
                        /> //since we are using map we need to use keys to make them unique
      })}
      <NextAndPreviousButton onPrevClick={fetchPreviousPage} onNextClick={fetchNextPage} />

    </div>
    {/* <ConfirmModal visible={showConfirmModal} onConfirm={handleOnDeleteConfirm} onCancel={hideConfirmModal} title='Are You Sure?' subtitle='This action will remove this movie permanently' busy={busy} />
    <UpdateMovie visible={showUpdateModal} initialState={selectedMovie} onSuccess={handleOnUpdate} onClose={hideUpdateForm} /> */}
    </>
  )
}
