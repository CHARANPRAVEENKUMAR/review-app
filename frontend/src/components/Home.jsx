import React from 'react'
import NotVerified from './user/NotVerified';
import TopRatedMovies from './user/TopRatedMovies';
import Container from './Container';
import TopRatedWebSeries from './user/TopRatedWebSeries';
import TopRatedTVSeries from './user/TopRatedTVSeries';
import HeroSlideShow from './user/HeroSlideShow';



export default function Home() {
  return <div className='dark:bg-primary bg-white min-h-screen dark:text-white'>
    <Container className="px-2 xl:p-0">
    <NotVerified/>
     {/* slider */}
      <HeroSlideShow />
    {/* most reated movies */} 
    <div className="space-y-3 py-8"></div>
    <TopRatedMovies />
    <TopRatedWebSeries/>
    <TopRatedTVSeries/>
    </Container>
    

  </div>
}
