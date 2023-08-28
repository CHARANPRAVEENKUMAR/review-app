import React, { useEffect, useRef, useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'
import Title from '../form/Title'
import Submit from '../form/Submit'
import Container from '../Container'
import { commonModalClasses } from "../../utils/theme";
import FormContainer from "../form/FormContainer";
import { resendEmailVerificationToken, verifyUserEmail } from '../../api/auth'
import { useNotification,useAuth } from '../../hooks'
let currentOTPIndex;
const OTP_LENGTH=6;
const isValidOTP=(otp)=>
  {    
      for(let val of otp){
          if(isNaN(parseInt(val))) return false;
      }
      //isNaN(parseInt("string")) =true
      return true;
  };


export default function EmailVerification() {
  const [otp,setOtp]=useState(new Array(OTP_LENGTH).fill(""))
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  

  const {isAuth,authInfo}=useAuth();
  const {isLoggedIn,profile}=authInfo;
  const isVerified=profile?.isVerified;
  const inputRef = useRef();
  const {updateNotification}=useNotification();
 
  const {state}=useLocation();
  console.log(`received state is ${state}`)
  const user = state?.user;//?optional chaining work only if state.user present otherwise ignore

  const navigate= useNavigate();

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

    if (!value) focusPrevInputField(currentOTPIndex);
    else focusNextInputField(currentOTPIndex);
    setOtp([...newOtp]);
  };
  
  const handleOTPResend=async()=>{
    const {error,message}=await resendEmailVerificationToken(user.id);
    if(error) return updateNotification('error',error);
    updateNotification('success',message)
  }

  const handleKeyDown=({key},index)=>{
    currentOTPIndex=index;
    console.log(`key is ${key}`)
    console.log(`index is ${index}`)
    if(key==='Backspace')
    focusPrevInputField(currentOTPIndex)
}

   const handleSubmit=async (e)=>{
    e.preventDefault();
    if(!isValidOTP(otp)) return updateNotification("error","invalid otp");
    
    console.log(otp);
    //submit otp


    const {error,message,user:userResponse}=await verifyUserEmail({OTP:otp.join(""),userId:user.id,}) //otp.join("") convert otp array into string
    if(error) return updateNotification("error",error);
      updateNotification("success",message);
    localStorage.setItem('auth-token',userResponse.token);
    isAuth();
    // console.log(message)

   }
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  

  useEffect(() => {
    console.log(`user is this ${user}`);
    if (!user) navigate("/not-found");   //if not user then he will redirected to notfound page last route in app.js run if unknown path choosen 
     if(isLoggedIn && isVerified) navigate('/');
  }, [user,isLoggedIn,isVerified]);

  // useEffect(() => {
  //   console.log("user",user);
  //   if (!user) navigate('/not-found');
  // }, [user]);

  return (
    <FormContainer >
    <Container>
            <form onSubmit={handleSubmit} className={commonModalClasses + " w-90"}>
                <div>
                <Title>Please Enter the otp to verify your account</Title>
                <p className="text-dark-subtle text-center">OTP has been sent to your email</p>
                   
                </div>

                <div className='flex justify-center items-center space-x-4'>
              {otp.map((_,index)=>{
                return (
                  <input 
                  ref={activeOtpIndex === index ? inputRef : null}
                  type="number"
                  key={index} 
                  value={otp[index]}
                  onChange={handleOtpChange}
                  onKeyDown={(e)=>handleKeyDown(e,index)}
                  className="w-12 h-12 bg-transparent outline-none rounded font-semibold  border-2 dark:border-dark-subtle border-light-subtle text-center dark:text-white text- text-xl focus:border-primary dark:focus:border-primary spin-button-none"
                  />
                );
              })}

            </div>
            <div>
                <Submit value="Verify Account"/>
                <button type="button" onClick={handleOTPResend} className='dark:text-white text-blue-500 font-semibold'>i don't have OTP</button>
                </div>
            </form>

            
        </Container>
        </FormContainer>
  )
}
