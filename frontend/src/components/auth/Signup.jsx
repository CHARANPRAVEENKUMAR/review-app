import React, { useEffect, useState } from 'react'
import Container from '../Container'
import FormInput from '../form/FormInput'
import Title from '../form/Title'
import Submit from '../form/Submit';
import { CustomLink } from '../CustomLink';
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { createUser } from '../../api/auth';
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from '../../hooks';
import { isValidEmail } from '../../utils/helper';



const validateUserInfo=({name,email,password})=>{
    const isValidName=/^[a-z A-Z]+$/;
    
    //regex javascript validation 

    if(!name.trim()) return {ok:false,error:"name is missing"}
    if(!isValidName.test(name)) return {ok:false,error:"Please Enter a valid name"}
    if(!email.trim()) return {ok:false,error:"email is missing"}
    if(!isValidEmail(email)) return {ok:false,error:"email is not valid"}
    if(!password.trim()) return {ok:false,error:"password is missing"}
    if(password.length<8) return {ok:false,error:"check the password length"}
    return {ok:true}
}

export default function Signup() {
    const[userInfo,setUserInfo]=useState({
        "name":"",
        "email":"",
        "password":"",
    });
    const  {authInfo}=useAuth();
    const navigate=useNavigate();
    const {updateNotification}=useNotification();

    let handleChange=({target})=>{
        //here argument e.target destructed into {target}=e
        const {name,value}=target;
        setUserInfo({...userInfo,[name]:value})
    }

    let handleSubmit=async (e)=> {
    e.preventDefault(); //to prevent irregular issues
   const {ok,error}=validateUserInfo(userInfo); //checking errors
   if(!ok) return updateNotification("error",error)
   //if(!ok) return console.log(error)

   //passing user data to backend
   const response=await createUser(userInfo);
   if(response.error) return console.log(response.error);
    console.log(userInfo);

    navigate("/auth/verification", {   //useNavigate() hook
        state: { user: response.user },
        replace: true, //wont allow to the previous page(sinup) once come to verification
      });
      
}
useEffect(()=>{if(authInfo.isLoggedIn)navigate('/')},[authInfo.isLoggedIn]);
console.log(authInfo);

    const {name,email,password}=userInfo;

 return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
                <Title>Sign Up</Title>
                <FormInput name="name" value={name} placeholder="john" label="Name" onChange={handleChange} />
                <FormInput name="email" value={email} placeholder="john@email.com" label="Email" onChange={handleChange}/>
                <FormInput name="password" value={password} placeholder="********" label="Password" onChange={handleChange} type="password" />
                <Submit value="Sign up"/>
                <div className="flex justify-between">
                <CustomLink to="/auth/forget-password">Forgot Password</CustomLink>
                    <CustomLink to="/auth/Signin">Sign In</CustomLink>
                </div>
            </form>
        </Container>
        </FormContainer>
  );
}



/*

*/