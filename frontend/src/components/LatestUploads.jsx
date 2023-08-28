import React from 'react'
import MovieListItem from './MovieListItem'


export default function LatestUploads() {
  return (
    <div className='bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2'>
        <h1 className='font-semibold text-2xl mb-2 text-primary dark:text-white'>Recent Uploads</h1>
        <MovieListItem
        movie={{
            poster:"https://plus.unsplash.com/premium_photo-1690574169344-48f431816db6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=400&q=60",
            title:"lorem",
            status:"public",
            genres:["Action","Drama","comedy"],
        }}

        />
    </div>
  )
};
