import React, { useEffect, useState } from 'react'
import {  useNavigate, useSearchParams } from 'react-router-dom'
import Container from '../Container'
import FormInput from '../form/FormInput'
import Title from '../form/Title'
import Submit from '../form/Submit'
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { ImSpinner } from 'react-icons/im'
import { resetPassword, verifyPasswordResetToken } from '../../api/auth'
import { useNotification } from '../../hooks'

export default function ConfirmPassword() {
  const [password,setPassword]=useState({
    one:"",
    two:""
  }

  )
  const [isVerifying,setIsVerifying]=useState(true);
  const [isValid,setIsValid]=useState(true);
  const [searchParams]=useSearchParams() //to get the data from link we use this hook
  const token=searchParams.get('token')
  const id=searchParams.get('id')
  console.log(token)
  console.log(id)
  const navigate=useNavigate();
  const {updateNotification}=useNotification();

  useEffect(()=>{isvalidToken()},[]);

  const isvalidToken=async ()=>{
    const {error,valid} =await verifyPasswordResetToken(token,id);
    

    if(error){  navigate('/auth/reset-password',{replace:true})
       return updateNotification('error',error);}
    setIsVerifying(false);
    if(!valid) {
      setIsValid(false);
      return navigate('/auth/reset-password',{replace:true});
    }
      //pass everything
      setIsValid(true);

  }
  const handleChange=({target})=>{
    const {value,name}=target;
    setPassword({...password,[name]:value})

  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!password.one.trim()) return updateNotification("error","password is missing")
    if(!password.two.trim()) return updateNotification("error","password is missing")
    if(password.one.trim().length <8 ) return updateNotification("error","password length must be 8 characters long")
    if(password.one!==password.two) return updateNotification("error","passwords do not match");
    const {error,message}=await resetPassword({newPassword:password.one,userId:id,token});
    if(error) return updateNotification("error",error)
    updateNotification("success",message);
   navigate('auth/signin',{replace:true})

  }

  if(isVerifying){
    return (
      <FormContainer>
        <Container>
          <div classname="flex space-x-2 items-center">
          <h1 className='dark:text-white text-primary text-4xl font-semibold'>Please wait we are verifying your token!</h1>
          <ImSpinner className="animate-spin text-4xl"/>
          </div>
        </Container>
      </FormContainer>
    )
  }
  if(!isValid){
    return (
      <FormContainer>
        <Container>
          <div classname="flex space-x-2 items-center">
          <h1 className='dark:text-white text-primary text-4xl font-semibold'>Token is not valid</h1>
          <ImSpinner className="animate-spin text-4xl"/>
          </div>
        </Container>
      </FormContainer>
    )
  }
  return (
    <FormContainer>
    <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
                <Title>Enter New Password</Title>
                <FormInput name="one" value={password.one}  onChange={handleChange} placeholder="********" label="New Password"  type="password"/>
                <FormInput name="two" value={password.two} onChange={handleChange} placeholder="********" label="Confirm Password" type="password"/>
                <Submit value="Confirm Password"/>
            </form>
        </Container>
        </FormContainer>
  )
}
