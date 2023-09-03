import {BsTrash,BsPencilSquare,BsBoxArrowUpRight} from 'react-icons/bs'
import ConfirmModal from './admin/modals/ConfirmModal'
import { useState } from 'react';
import { deleteMovie } from '../api/movie';
import { useNotification } from '../hooks';
import UpdateMovie from './admin/modals/UpdateMovie';
import { getPoster } from '../utils/helper';

const MovieListItem=({movie,afterDelete,afterUpdate})=>
{
    const [showConfirmModal,setShowConfirmModal]=useState(false);
    const [showUpdateModal,setShowUpdateModal]=useState(false);
    const [busy,setBusy]=useState(false);
    const [selectedMovieId,setSelectedMovieId]=useState(null);
    const {updateNotification}=useNotification();

    const handleOnDeleteConfirm=async()=>{
        setBusy(true);
        const {message,error}= await deleteMovie(movie.id);
        setBusy(false);

        if(error) updateNotification('error',error);
        hideConfirmModal();
        updateNotification('success',message);
        afterDelete(movie);
      }
      const handleOnEditClick=()=>{
        setShowUpdateModal(true);
        setSelectedMovieId(movie.id);

      }
      const handleOnUpdate=(movie)=>{
        afterUpdate(movie);
        setShowUpdateModal(false);
        setSelectedMovieId(null);
      }

      const displayConfirmModal=()=>setShowConfirmModal(true);
      const hideConfirmModal=()=>setShowConfirmModal(false);


    return( <>
        <MovieCard movie={movie} onDeleteClick={displayConfirmModal} onEditClick={handleOnEditClick}  />
        <div className='p-0'>
        <ConfirmModal
            visible={showConfirmModal} 
            onConfirm={handleOnDeleteConfirm} 
            onCancel={hideConfirmModal} 
            title='Are You Sure?' 
            subtitle='This action will remove this movie permanently' 
            busy={busy} />
        <UpdateMovie
            visible={showUpdateModal} 
            movieId={selectedMovieId} 
            onSuccess={handleOnUpdate} 
             />
        </div>

    </>)
    
}
const MovieCard=({movie,onDeleteClick,onOpenClick,onEditClick})=>
{
    const {poster,genres=[],title,status,responsivePosters}=movie;
    return(
    <table className='w-full '>
        <tbody>
            <tr>
                <td>
                    <div className="w-24">
                        <img className="w-24 aspect-video object-cover" src={getPoster(responsivePosters)|| poster} alt={title} />
                    </div>
                </td>
                <td className='w-full pl-5'>
                    <div>
                        <h1 className='font-semibold text-primary dark:text-white '>{title}</h1>
                        <div className="space-x-1"> 
                            {genres.map((g,index)=>{return <span className='text-primary dark:text-white text-xs' key={index}>{g}</span>})} 
                        </div>
                    </div>
                </td>
                <td className='px-5'>
                    <p className='text-primary dark:text-white '>{status}</p>
                </td>
                <td>
                    <div className="flex items-center  space-x-3 text-primary dark:text-white">
                        <button type="button"   onClick={onDeleteClick} ><BsTrash/></button>
                        <button type="button"   onClick={onEditClick} ><BsPencilSquare/></button>
                        <button type="button"   onClick={onOpenClick} ><BsBoxArrowUpRight/></button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>)
}

export default MovieListItem;