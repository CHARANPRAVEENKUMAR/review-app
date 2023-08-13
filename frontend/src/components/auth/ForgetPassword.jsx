import React from 'react'
import Title from '../form/Title'
import FormInput from '../form/FormInput'
import { CustomLink } from '../CustomLink'
import Container from '../Container'
import Submit from '../form/Submit'


export default function ForgetPassword() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
    <Container>
            <form className="bg-secondary rounded p-6 w-96 space-y-6">
                <Title>Please Enter Your Email</Title>
                <FormInput name="email" placeholder="john@email.com" label="Email"/>
                <Submit value="Send Link"/>
                <div className="flex justify-between">
                    <CustomLink to="/auth/Signin">Sign In</CustomLink>
                    <CustomLink to="/auth/Signup">Sign Up</CustomLink>
                </div>
            </form>
        </Container>
        </div>
  )
}
