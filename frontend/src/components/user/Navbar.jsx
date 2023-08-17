import React from 'react';
import {Link} from "react-router-dom";
import {BsFillSunFill} from 'react-icons/bs';
import { useAuth, useTheme } from '../../hooks';
import Container from '../Container';

export default function Navbar(){
  const {toggleTheme}=useTheme();
  const {authInfo,handleLogout}=useAuth();
  const {isLoggedIn}=authInfo;

 return (
    <div className="bg-secondary shadow-sm shadow-gray-500">
      <Container className="p-2">
      <div className="max-w-screen-xl mx-auto p-2">
        <div className="flex justify-between items-center">
        <Link to="/">
          <img src="./logo.png" alt="" className="h-10" />
        </Link>
          <ul className="flex items-center space-x-4">
            <li>
              <button className="bg-dark-subtle p-1 rounded" onClick={toggleTheme}>
                <BsFillSunFill className="text-secondary" size={24} />
              </button>
            </li>
            <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
                placeholder="search..."
              />
            </li>
            <li>
              {isLoggedIn? (<button onClick={handleLogout} className="text-white font-semibold text-lg">Log out</button>):
            (<Link to="/auth/Signin" className="text-white font-semibold text-lg">
            Login
          </Link>)}
          </li>

          </ul>
        </div>
      </div>
      </Container>
    </div>
 );
} 