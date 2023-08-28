import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {AiOutlineHome} from 'react-icons/ai'
import {BiMoviePlay} from 'react-icons/bi'
import {FaUserNinja} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi';
import {useAuth} from '../../hooks'

export default function Navbar() {
  const {handleLogOut}=useAuth();
  return (
  <nav className='w-48 min-h-screen bg-secondary border-r border-gray-300 '> 
       <div className='flex flex-col justify-between sticky top-0 pl-5 h-screen '>
       <ul>
        <li className="mb-8"> 
          <Link to="/">
              <img src="./logo.png" alt="logo" classname="h-14 p-2" />
          </Link>
        </li>
        <li>
         <NavItem to="/"> <AiOutlineHome/><span>Home</span>  </NavItem>
        </li>
        <li>
         {/*<NavLink className={"flex items-center text-lg text-white space-x-2 p-2 hover:opacity-80"} to="/movies"> <BiMoviePlay/>movies</NavLink>*/}
         <NavItem to="/movies"><BiMoviePlay/><span>Movies</span></NavItem>
        </li>
        <li>
         <NavItem to="/actors"><FaUserNinja/><span>Actors</span></NavItem>
        </li>
       </ul>
       <div className="flex flex-col items-start  pb-5">
        <span className='font-semibold text-white'>Admin </span>
        <button className="flex items-center text-dark-subtle text-small hover:text-white" onClick={handleLogOut}><FiLogOut/> <span>Log Out </span></button>
       </div>
       </div>
  </nav>
    
  )
}

const NavItem=({children,to})=>{
  const commonClasses='flex items-center text-lg space-x-2 p-2 hover:opacity-80';
  return (
    <NavLink className={({isActive})=>
    (isActive ? 'text-white ' :'text-gray-400 ')+commonClasses}
   to={to} 
  >
    {children}
    </NavLink>
  )
}

/* (sticky top-0) helps you to stick at top,
   hanle logout not working some problrmsignin,authprovider fx later
*/ 