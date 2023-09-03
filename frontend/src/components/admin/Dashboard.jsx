import React, { useEffect, useState } from 'react'
import MovieUpload from './MovieUpload'
import AppInfoBox from '../AppInfoBox';
import LatestUploads from '../LatestUploads';
import { useNotification } from '../../hooks';
import { getAppInfo } from '../../api/admin';
import MostRatedMovies from '../MostRatedMovies';



export default function Dashboard() {
  const [appInfo,setAppInfo]=useState({
    movieCount:0,reviewCount:0,userCount:0,
  })
  const {updateNotification}=useNotification();
  const fetchAppInfo=async()=>{
   const {appInfo,error}= await getAppInfo();
   if(error) updateNotification('error',error);
   setAppInfo({...appInfo})

  }
  useEffect(()=>{
    fetchAppInfo();
  },[])
  return( 
  <div className="grid grid-cols-3 gap-5 p-5">
    <AppInfoBox title='Total Uploads' subTitle={appInfo.movieCount.toLocaleString()} /> 
    <AppInfoBox title='Total Reviews' subTitle={appInfo.reviewCount.toLocaleString()} />
    <AppInfoBox title='Total Users' subTitle={appInfo.userCount.toLocaleString()} />

    <LatestUploads  />
    <MostRatedMovies  />
  </div>
  );
}
