const express=require('express');

const {userValidator,validate, validatePassword, signInValidator}=require("../middlewares/validator");
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordStatus, resetPassword, signIn } = require("../controllers/user");
const { isValidPassResetToken } = require('../middlewares/user');

const { isAuth } = require('../middlewares/auth');
//endpoints

const router=express.Router();

router.post("/create",userValidator,validate,create);
router.post("/sign-in",signInValidator,validate,signIn);  
router.post("/verify-email",verifyEmail);
router.post("/resend-email-verification-token",resendEmailVerificationToken);
router.post("/forget-password",forgetPassword);
router.post("/verify-pass-reset-token",isValidPassResetToken,sendResetPasswordStatus);
router.post('/reset-password',validatePassword,validate,isValidPassResetToken,resetPassword);

router.get("/is-auth",isAuth,(req,res)=>{
    const {user}=req;
    res.json({
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            isVerified:user.isVerified,
            role:user.role
        }});
    });

module.exports=router;