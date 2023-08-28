import {BsTrash,BsPencilSquare,BsBoxArrowUpRight} from 'react-icons/bs'

const MovieListItem=({movie,onDeleteClick,onOpenClick,onEditClick})=>
{
    const {poster,genres=[],title,status}=movie
    return(
    <table className='w-full '>
        <tbody>
            <tr>
                <td>
                    <div className="w-24">
                        <img className="w-24 aspect-video object-cover" src={poster} alt={title} />
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