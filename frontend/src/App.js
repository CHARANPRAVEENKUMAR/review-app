import React from 'react';
import Navbar from "./components/user/Navbar";
import "./index.css";
import {Route,Routes} from 'react-router-dom';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import EmailVerification from './components/auth/EmailVerification';
import ForgetPassword from './components/auth/ForgetPassword';
import ConfirmPassword from './components/auth/ConfirmPassword';
import Home from './components/Home';

export default function App() {
  return (
  <>
  <Navbar />
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/auth/signin" element={<Signin/>}/>
    <Route path="/auth/signup" element={<Signup/>}/>
    <Route path="/auth/verification" element={<EmailVerification/>}/>
    <Route path="/auth/forget-password" element={<ForgetPassword/>}/>
    <Route path="/auth/confirm-password" element={<ConfirmPassword/>}/>
   </Routes>
  </>
  );
}

//export default App;
