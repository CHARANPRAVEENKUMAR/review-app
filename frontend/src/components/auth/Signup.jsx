import React from 'react'
import Container from '../Container'
import FormInput from '../form/FormInput'
import Title from '../form/Title'
import Submit from '../form/Submit';
import { CustomLink } from '../CustomLink';

export default function Signup() {
 return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center"> 
        <Container>
            <form className="bg-secondary rounded p-6 w-72 space-y-6">
                <Title>Sign Up</Title>
                <FormInput name="name" placeholder="john" label="Name" />
                <FormInput name="email" placeholder="john@email.com" label="Email"/>
                <FormInput name="password" placeholder="********" label="Password" />
                <Submit value="Sign up"/>
                <div className="flex justify-between">
                <CustomLink to="/auth/forget-password">Forgot Password</CustomLink>
                    <CustomLink to="/auth/Signin">Sign In</CustomLink>
                </div>
            </form>
        </Container>
    </div>
  );
}



/*

*/