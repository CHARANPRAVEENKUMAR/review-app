import React from 'react';
import {Link,useNavigate} from "react-router-dom";
import {BsFillSunFill} from 'react-icons/bs';
import { useAuth, useTheme } from '../../hooks';
import Container from '../Container';
import AppSearchForm from '../form/AppSearchForm'

export default function Navbar(){
  const {toggleTheme}=useTheme();
  const {authInfo,handleLogout}=useAuth();
  const {isLoggedIn}=authInfo;
  const navigate=useNavigate();

  const handleSearchSubmit=(query)=>{
    navigate('/movie/search?title='+query);
  }

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
            {/* <li>
              <input
                type="text"
                className="border-2 border-dark-subtle p-1 rounded bg-transparent text-xl outline-none focus:border-white transition text-white"
                placeholder="search..."
              />
            </li> */}
            <li>
              <AppSearchForm placeholder='Search' inputClassName="text-dark-subtle text-white focus:border-white " onSubmit={handleSearchSubmit}  />
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