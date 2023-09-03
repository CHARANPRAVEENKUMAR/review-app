import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchPublicMovies } from '../../api/movie';
import { useNotification } from '../../hooks';
import NotFoundText from '../NotFoundText';
import MovieList from './MovieList';
import Container from '../Container';

export default function SearchMovies() {
    const [searchParams]=useSearchParams();
    const [resultNotFound,setResultNotFound]=useState(false);
    const {updateNotification}=useNotification();

    const query=searchParams.get("title"); //get title from url 
    const [movies,setMovies]=useState([]);

    const searchMovies=async(val)=>{
        console.log(`${val} is svalue`);
    const  {error,results} = await searchPublicMovies(val);
    if(error) updateNotification("error",error);
    if(!results.length) {
        setResultNotFound(true);
        return  setMovies([]);
    }
    setResultNotFound(false);
        return  setMovies([...results]);

    // setMovies([...results]);
    }

    useEffect(()=>{
        if(query.trim()) searchMovies(query); 
        },[query]) //triggered whenever query updated

  return (
    <div className='dark:bg-primary bg-white min-h-screen dark:text-white py-8'>
    <Container className="px-2 xl:p-0">
        <NotFoundText text="Record not found !" visible={resultNotFound} />
        <MovieList movies={movies} />
    </Container>
    </div>
  )
}
