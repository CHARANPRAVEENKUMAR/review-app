import React, { useEffect, useState } from 'react'
import { getSingleMovie } from '../../api/movie';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth, useNotification } from '../../hooks';
import Container from '../Container';
import RatingStar from '../RatingStar';
import RelatedMovies from '../RelatedMovies';
import AddRatingModal from '../admin/modals/AddRatingModal';
import CustomButtonLink from '../CustomButtonLink';
import ProfileModal from '../admin/modals/ProfileModal';
import { convertReviewCount } from '../../utils/helper';


const convertDate=(date="")=>{
    return date.split("T")[0];
}


export default function SingleMovie() {
    const [ready,setReady]=useState({});
    const [showRatingModal,setShowRatingModal]=useState(false);
    const [showProfileModal,setShowProfileModal]=useState(false);
    const [movie,setMovie]=useState({});
    const [selectedProfile,setSelectedProfile]=useState({});
    const {updateNotification}=useNotification();
    const {authInfo}=useAuth();
    const {isLoggedIn}=authInfo;
    const navigate=useNavigate();

    const {movieId}=useParams(); //get id from url 

    const fetchMovie=async()=>{
       const {error,movie} =await getSingleMovie(movieId);
       if(error) return updateNotification("error",error);

       setReady(true);
       setMovie(movie);

    }
    const handleOnRateMovie=()=>{
        if(!isLoggedIn) return navigate('auth/signin');
        console.log("clicked rating button");
        setShowRatingModal(true);
    }
    const hideRatingModal=()=>{
        setShowRatingModal(false);
    }
    const handleOnRatingSuccess=(reviews)=>{
        console.log(`mission success ${reviews}`)
        setMovie({...movie,reviews: {...reviews}});
    }
    const handleProfileClick=(profile)=>{
        setSelectedProfile(profile);
        console.log(`${profile} this is slected profile`)
        setShowProfileModal(true);

    }
    const hideProfileModal=()=>{
        setShowProfileModal(false);
    }

    useEffect(()=>{
       if(movieId) fetchMovie();
    },[movieId]);

    if(!ready) return <div className=" h-screen flex justify-center items-center">
        <p className="text-light-subtle dark:text-dark-subtle animate-pulse">Please Wait</p>
    </div>
    console.log(movie);
    
    const {trailer,title,poster,id,reviews={},storyLine,director={},writers=[],cast=[],language,releaseDate,genres=[],type}=movie;//destructure according to backend api send data
    console.log(cast);
    console.log(`genres are ${genres}`);
  return (
    
    <div className="dark:bg-primary bg-white pb-10 min-h-screen">
        <Container className='xl:px-0 px-2 '>
            <video poster={poster} src={trailer} controls></video>
            <div className="flex justify-between">
            <h1 className='xl:text-4xl lg:text-3xl text-2xl  text-highlight dark:text-highlight-dark'>{title}</h1>
            <div className="flex flex-col items-end">
                <RatingStar rating={reviews.ratingAvg} />
                <CustomButtonLink label= {convertReviewCount(reviews.reviewCount) + " Reviews"} 
                    onClick={()=> navigate("/movie/reviews/"+id)} 
                    />
                <CustomButtonLink label="Rate This Movie"
                   onClick={handleOnRateMovie} 
                    />
                {/* <Link to={'/movie/reviews'+id} className='text-highlight dark:text-highlight-dark hover:underline'>
                    {convertReviewCount(reviews.reviewCount)} Reviews
                </Link> */}
                {/* <button 
                    type="button" 
                    className='text-highlight dark:text-highlight-dark hover:underline'
                    onClick={handleOnRateMovie}>Rate This Movie</button> */}
            </div>
            </div>
            <div className="space-y-3">
            <p className='text-light-subtle dark:text-dark-subtle'>{storyLine}</p>
            
            <ListWithLabel label="Director:"><CustomButtonLink label={director.name} onClick={()=>{handleProfileClick(director)}} />  </ListWithLabel>   
        
            
            
            <ListWithLabel label="Writers:">{writers.map(w=>{
                    return <CustomButtonLink key={w.id} label={w.name} />
                })} </ListWithLabel> 

            <ListWithLabel label="Cast:">{cast.map(({id,profile,leadActor})=>{
                    return (
                        leadActor?(
                            <CustomButtonLink label={profile.name} key={id} />
                        )
                        :null)
                })} </ListWithLabel> 

            <ListWithLabel label="Language:"><CustomButtonLink label={language}  clickable={false}/>  </ListWithLabel>   
            <ListWithLabel label="ReleaseDate :"><CustomButtonLink label={convertDate(releaseDate)}  clickable={false}/>  </ListWithLabel>   

            <ListWithLabel label="Genres:">
                {genres.map((g)=>{
                        <CustomButtonLink label={g} key={g} clickable={false} />    
                        console.log(g);  
                    })} </ListWithLabel>

            <ListWithLabel label="Type:"><CustomButtonLink label={type}  clickable={false}/>  </ListWithLabel> 
            <CastProfiles cast={cast} />
            <RelatedMovies movieId={movieId}/>
            </div>

        </Container>
        <ProfileModal  
        visible={showProfileModal}
        onClose={hideProfileModal}
        profileId={selectedProfile.id}
        />
        <AddRatingModal visible={showRatingModal} onClose={hideRatingModal} onSuccess={handleOnRatingSuccess} />
    </div>
    
  )
}

const ListWithLabel=({children,label})=>{
    return (
        <div className="flex space-x-2">
                <p className='text-light-subtle dark:text-dark-subtle font-semibold'>{label}</p>
            {children}
            </div>
    )
}

const CastProfiles=({cast})=>{
    return <div className=''>
    <h1 className='text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2 '>Cast:</h1>
    <div className="flex flex-wrap space-x-4">
        {
            cast.map(({profile,id,roleAs})=>{
                return <div className="flex flex-col items-center basis-28 text-center mb-4 " key={id} >
                    <img className='w-20 h-20 aspect-square object-cover rounded-full' src={profile.avatar} alt=""  />
                    <CustomButtonLink label={profile.name} />
            
                <span className='text-light-subtle dark:text-dark-subtle text-sm'>as</span>
                <p className='text-light-subtle dark:text-dark-subtle'>{roleAs}</p>
                </div>
            })
        }
    </div>
    </div>
}