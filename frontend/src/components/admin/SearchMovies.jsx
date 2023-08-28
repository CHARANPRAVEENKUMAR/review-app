import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMovieForAdmin } from '../../api/movie';
import { useNotification } from '../../hooks';
import MovieListItem from '../MovieListItem';
import NotFoundText from '../NotFoundText';

export default function SearchMovies() {
    const [searchParams]=useSearchParams();
    const [resultNotFound,setResultNotFound]=useState(false);
    const {updateNotification}=useNotification();

    const query=searchParams.get("title"); //get title from url 
    const [movies,setMovies]=useState([]);

    const searchMovies=async(val)=>{
        console.log(`${val} is svalue`);
    const  {error,results} = await searchMovieForAdmin(val);
    if(error) updateNotification("error",error);
    if(!results.length) {
        setResultNotFound(true);
        return  setMovies([]);
    }
    setResultNotFound(false);
        return  setMovies([...results]);

    // setMovies([...results]);
    }
    const handleAfterDelete=(movie)=>{
    const updatedMovies= movies.filter((m)=>m.id!==movie.id);
    setMovies([...updatedMovies])
    }
    const handleAfterUpdate=(movie)=>{
        const updatedMovies= movies.map((m)=>{
            if(m.id===movie.id) return movie;
            return m;
        });
    setMovies([...updatedMovies])
        
    }

    useEffect(()=>{
        if(query.trim()) searchMovies(query); 
        },[query]) //triggered whenever query updated

  return (
    <div className="p-5 space-y-3">
        <NotFoundText text="Record not found !" visible={resultNotFound} />
        {!resultNotFound && movies.map((movie)=>{
            return <MovieListItem movie={movie} key={movie.id} afterDelete={handleAfterDelete} afterUpdate={handleAfterUpdate}/>
        })}
    </div>
  )
}
