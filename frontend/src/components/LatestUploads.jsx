import React, { useEffect, useState } from 'react'
import MovieListItem from './MovieListItem'
import { useMovies, useNotification } from '../hooks';
import { deleteMovie, getMovieForUpdate, getMovies } from '../api/movie';
import ConfirmModal from './admin/modals/ConfirmModal';
import UpdateMovie from './admin/modals/UpdateMovie';

const pageNo=0;
const limit=5;

export default function LatestUploads() {
    const [movies,setMovies]=useState([]);
    const [busy,setBusy]=useState(false);
    const [showConfirmModal,setShowConfirmModal]=useState(false);
    const [showUpdateModal,setShowUpdateModal]=useState(false);
    const [selectedMovie,setSelectedMovie]=useState(null);
    const {updateNotification}=useNotification();

    const {fetchLatestUploads,latestUploads}=useMovies();


  // const fetchLatestUploads=async()=>{
  //  const {error,movies}= await getMovies(pageNo,limit);
  //  if(error) return updateNotification("error",error);
  //   setMovies([...movies])
  // }

  // const handleOnEditClick=async({id})=>{ 
  //   const {error,movie}=await getMovieForUpdate(id);
  //   setShowUpdateModal(true);

  //   if(error) updateNotification('error',error);

  //   setSelectedMovie(movie);  
  // }
  // const handleOnDeleteClick=(movie)=>{
  //     setSelectedMovie(movie);
  //     setShowConfirmModal(true);
  // }
  // const handleOnDeleteConfirm=async(movie)=>{
  //   setBusy(true);
  //   const {error,message}=  await deleteMovie(selectedMovie.id);
  //   setBusy(false);
  //   if(error) return updateNotification("error",error);

  //   updateNotification("success",message);
  //   fetchLatestUploads();
  //   hideConfirmModal();

  // }
  // const handleOnUpdate=(movie)=>{
  //   const updatedMovies=  movies.map((m)=>{
  //       if(m.id===movie.id) return movie;
  //       return m;
  //     });
  //     setMovies([...updatedMovies])
  // }

  // const hideConfirmModal=()=>{
  //   setShowConfirmModal(false);
  // }
  // const hideUpdateModal=()=>{
  //   setShowUpdateModal(false);
  // }

  useEffect(()=>{fetchLatestUploads()},[])

  const handleUIUpdate=()=>{
    fetchLatestUploads();
  }

  return (
      <>
        <div className='bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2'>
            <h1 className='font-semibold text-2xl mb-2 text-primary dark:text-white'>Recent Uploads</h1>
            <div className='space-y-3'>
            {latestUploads.map((movie)=>{
                return <MovieListItem movie={movie} key={movie.id} afterDelete={handleUIUpdate} afterUpate={handleUIUpdate} />
            })}
            </div>
        </div>
    </>

  );
};
