import React, { useEffect, useState } from 'react';
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import Container from '../Container'
import FormInput from '../form/FormInput'
import Title from '../form/Title'
import Submit from '../form/Submit';
import  {CustomLink}  from '../CustomLink';
import { useAuth, useNotification } from '../../hooks';
import { useNavigate } from 'react-router-dom';


const validateUserInfo=({email,password})=>{

    const isValidEmail=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //regex javascript validation 
    if(!email.trim()) return {ok:false,error:"email is missing"}
    if(!isValidEmail.test(email)) return {ok:false,error:"email is not valid"}
    if(!password.trim()) return {ok:false,error:"password is missing"}
    if(password.length<8) return {ok:false,error:"check the password length"}
    return {ok:true}
}


export default function Signin(){
    const[userInfo,setUserInfo]=useState({
        email:"",
        password:"",
    });
    const navigate=useNavigate();
    const {updateNotification}=useNotification();
    const {handleLogin,authInfo}=useAuth(); //importing hoook to use related functions
    const{isPending,isLoggedIn}=authInfo;
    console.log(authInfo);

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
       handleLogin(userInfo.email,userInfo.password); 
        };

    useEffect(()=>{if(isLoggedIn)navigate('/')},[isLoggedIn]);

    return (
    <FormContainer>
        <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
                <Title>Sign in</Title>
                <FormInput name="email"  placeholder="john@email.com" onChange={handleChange} label="Email"/>
                <FormInput name="password" value={userInfo.password} placeholder="********" type="password" onChange={handleChange} label="Password" />
                <Submit value="Sign in" busy={isPending}/>
                <div className="flex justify-between">
                    <CustomLink to="/auth/forget-password">Forgot Password</CustomLink>
                    <CustomLink to="/auth/Signup">Sign Up</CustomLink>
                </div>
            </form>
        </Container>
        </FormContainer>);
}