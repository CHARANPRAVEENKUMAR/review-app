import React, { useEffect, useState } from 'react'
import Container from '../Container'
import CustomButtonLink from '../CustomButtonLink'
import RatingStar from '../RatingStar';
import { deleteReview, getReviewByMovie } from '../../api/review';
import { useAuth, useNotification } from '../../hooks';
import { useParams } from 'react-router-dom';
import {BsTrash,BsPencilSquare} from 'react-icons/bs';
import ConfirmModal from '../admin/modals/ConfirmModal';
import NotFoundText from '../NotFoundText';
import EditRatingModal from '../admin/modals/EditRatingModal';

const getNameInitial=(name="")=>{
    return name[0].toUpperCase();
}

export default function MovieReviews() {
    const [reviews,setReviews]=useState([]);
    const [movieTitle,setMovieTitle]=useState("");
    const [profileOwnersReview,setProfileOwnersReview]=useState(null);
    const [showConfirmModal,setShowconfirmModal]=useState(false);
    const [selectedReview,setSelectedReview]=useState(null);
    const [showEditModal,setShowEditModal]=useState(false);
    const [busy,setBusy]=useState(false);

    const {movieId}=useParams();
    const {authInfo}=useAuth();
    const profileId=authInfo.profile?.id;

    const {updateNotification}=useNotification();

    const fetchReviews=async()=>{
        const {error,movie}= await getReviewByMovie(movieId);
        if(error) return updateNotification("error",error);

        setReviews([...movie.reviews]);
        setMovieTitle(movie.title)
    }
    const findProfileOwnersReview=()=>{
        if(profileOwnersReview) return setProfileOwnersReview(null);

       const matched= reviews.find((review)=>review.owner.id===profileId)
       if(!matched) return updateNotification("error","You dont have any review!");

       setProfileOwnersReview(matched);
       
    }
    const handleDeleteConfirm=async()=>{
        setBusy(true);
        console.log(`very very id ${profileOwnersReview.id}`);
        const {error,message}=await deleteReview(profileOwnersReview.id);
        setBusy(false);
        if(error) updateNotification("error",error);
        

        updateNotification("success",message);
       const updatedReviews = reviews.filter((r)=> r.id!==profileOwnersReview.id);
       setReviews([...updatedReviews]);
       setProfileOwnersReview(null);
       hideConfirmModal();

    }
const handleOnReviewUpdate=(review)=>{
    console.log({...profileOwnersReview})
    const updatedReview={
        ...profileOwnersReview,
        rating:review.rating,
        content:review.content,
    }
    console.log({...updatedReview})
    setProfileOwnersReview({...updatedReview});
    const newReviews=reviews.map((r)=>{if(r.id===updatedReview.id){return updatedReview} 
        return r
    });
    setReviews([...newReviews]);
    console.log(reviews)
}

    const displayConfirmModal=()=>{
        setShowconfirmModal(true);
    }
    const hideConfirmModal=()=>{
        setShowconfirmModal(false);
    }
    const hideEditModal=()=>{
        setShowEditModal(false);
        setSelectedReview(null);
    }
    const handleOnEditClick=()=>{
        const {id,content,rating}=profileOwnersReview;
        setSelectedReview({
            id,
            content,
            rating,
        });
        setShowEditModal(true);
    }

    useEffect(()=>{
        if(movieId) fetchReviews();
    },[movieId]);

  return (
    <div className="dark:bg-primary bg-white pb-10 min-h-screen">
        <Container className='xl:px-0 px-2 py-8'>
            <div className="flex justify-between items-center ">
           <h1 className='text-2xl font-semibold dark:text-white text-secondary '>
            <span className='text-light-subtle dark:text-dark-subtle font-normal'>Reviews for:</span>{" "}{movieTitle} </h1>
           
          {profileId?  < CustomButtonLink label={profileOwnersReview?'viewAll': "Find My Review"} onClick={()=>{findProfileOwnersReview()}} />:null}
            </div>
            <NotFoundText text='No Reviews!' visible={!reviews.length} />

            {profileOwnersReview? ( 
            <div className="">
                <ReviewCard review={profileOwnersReview} /> 
                <div className="flex space-x-3 text-xl p-3 dark:text-white text-primary ">
                    <button type="button" onClick={displayConfirmModal} ><BsTrash/></button>
                    <button type="button" onClick={handleOnEditClick}  ><BsPencilSquare/></button>

                </div>
            </div>):(<div className="space-y-3 mt-3">
                {reviews.map((review)=> (<ReviewCard review={review} key={review.id}  />))}
            </div>)}
           
        </Container>
        <ConfirmModal visible={showConfirmModal} 
            title='Are you sure?' 
            subtitle='this action will delete the review permanently '
            onConfirm={handleDeleteConfirm}
            busy={busy}
            onCancel={hideConfirmModal} />
            <EditRatingModal visible={showEditModal} initialState={selectedReview} onSuccess={handleOnReviewUpdate} onClose={hideEditModal} />
        </div>
  )
}
const ReviewCard=({review})=>{
    if(!review)return null;

    const {owner,rating,content}=review;
    
    return  <div className="flex space-x-3">
    <div className="flex justify-center items-center w-14 h-14 rounded-full dark:bg-dark-subtle bg-light-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
    </div>
    <div className="">
    <h1 className='dark:text-white text-secondary font-semibold text-lg'>{owner.name}</h1>
    <RatingStar rating={rating} />
    <p className='text-light-subtle dark:text-dark-subtle'>{content}</p>
    </div>
    </div>
}