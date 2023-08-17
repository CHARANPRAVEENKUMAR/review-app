import React, { useState } from 'react'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import { CustomLink } from '../CustomLink'
import Container from '../Container'
import Submit from '../form/Submit'
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { forgetPassword } from '../../api/auth'
import { isValidEmail } from '../../utils/helper'
import { useNotification } from '../../hooks'



export default function ForgetPassword() {
  const [email,setEmail]=useState('');
  const {updateNotification}=useNotification();

  let handleChange=({target})=>{
    //here argument e.target destructed into {target}=e
    const {value}=target;
    setEmail(value)
  }
  
  let handleSubmit=async (e)=> {
    e.preventDefault(); //to prevent irregular issues preventing default behaviour
    if(! isValidEmail(email)) return updateNotification("error",'invalid email!')
    const {error,message}=await forgetPassword(email);
    if(error) return updateNotification('error',error)
    updateNotification('success',message);
    };
  return (
    <FormContainer>
    <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
                <Title>Please Enter Your Email</Title>
                <FormInput name="email" placeholder="john@email.com" label="Email" value={email} onChange={handleChange}/>
                <Submit value="Send Link"/>
                <div className="flex justify-between">
                    <CustomLink to="/auth/Signin">Sign In</CustomLink>
                    <CustomLink to="/auth/Signup">Sign Up</CustomLink>
                </div>
            </form>
        </Container>
        </FormContainer>
  )
}
