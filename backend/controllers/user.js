const nodemailer=require("nodemailer");
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const EmailVerificationToken=require("../models/emailVerificationToken");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const passwordResetToken = require("../models/passwordResetToken");
const { generateRandomByte } = require("../utils/helper");

exports.create=async (req,res)=>{
    const {name,email,password}=req.body;
    const oldUser=await User.findOne({email});
    if(oldUser) return res.status(401).json({error:"this email is already registered"});
    const newUser=new User({name,email,password});//creatring object
    await newUser.save();

    //generate 6 digit otp 
    let OTP= generateOTP();
    // let OTP ='';
    // for(let i=0;i<=5;i++){
    //     OTP+=Math.round(Math.random()*9);
    // }
    //store otp in our database
    const newEmailVerificationToken=new EmailVerificationToken({
        owner:newUser._id,
        token:OTP,
    })
    await newEmailVerificationToken.save()
    //send otp to our user
    var transport=generateMailTransporter();
    // var transport = nodemailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "54967c5874d618",
    //       pass: "42787df265cda5"
    //     }
    //   });
  
    transport.sendMail({
        from: 'kaiko@reviewapp.com',
        to: newUser.email,
        subject: 'email verification ',
        html:`
        <h1>${OTP}</h1>
        <p> your verifiaction OTP</p>
        `,
    });

    res.status(201).json({ 
      user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email,
      },
    });
};


exports.verifyEmail=async (req,res)=>{
      const {userId,OTP}=req.body;

      if(!isValidObjectId(userId)) return res.json({error: "not a valid id" });

      const user= await User.findById(userId); //to get the email of associated id 
      if(!user) return res.json({error: "user not found"});
        
      if(user.isVerified) return res.json({error: "user already verified"});

    const token=await EmailVerificationToken.findOne({owner:userId});
      console.log(token);
      console.log(EmailVerificationToken);
    
      if(!token) return res.json({error: "token not found"});

      const isMatched=await token.compaireToken(OTP);
      if(!isMatched) return res.status(401).json({error :"enter valid otp"});

      user.isVerified=true;
      await user.save();
      await EmailVerificationToken.findByIdAndDelete(token._id); //after verify deleet from our database 

      var transport = generateMailTransporter();
  
    transport.sendMail({
        from: 'kaiko@reviewapp.com',
        to: user.email,
        subject: 'email verified ',
        html:`
        <h1>welcome to our app review </h1>
       
        `,
    });
    const jwtToken=jwt.sign(
      {userId:user._id},process.env.JWT_SECRET
     );
      res.json({user:{
        id:user._id,
        name:user.name,
        email:user.email,
        token:jwtToken,
        isVerified:user.isVerified ,
        role:user.role,
      },message:"your email is verified"});

}

exports.resendEmailVerificationToken= async (req,res)=>{
    const {userId}=req.body;

    const user=await User.findById(userId);
    if(!user) return res.status(404).json({error: "user not found"});
    if(user.isVerified) return res.json({error: "user is already verified"});
    const alreadyHasToken= await EmailVerificationToken.findOne({owner:user._id});

    if(alreadyHasToken) return res.json({error:"sorry we cant generate another otp in one hour"});
    //generate 6 digit otp 
    let OTP =generateOTP();

    //store otp in our database
    const newEmailVerificationToken=new EmailVerificationToken({
        owner:user._id,
        token:OTP,
    })
    await newEmailVerificationToken.save()
    
    //send otp to our user

    var transport = generateMailTransporter();

    transport.sendMail({
        from: 'kaiko@reviewapp.com',
        to: user.email,
        subject: 'resend email verification ',
        html:`
        <h1>${OTP}</h1>
        <p> your verifiaction OTP</p>
        `,
    });

    res.status(201).json({ message:" otp resendemailverification "});
}


exports.forgetPassword=async (req,res)=>{
    const {email}=req.body;
    if(!email) return res.status(401).json({error:"email is missing"});
    
    const user=await User.findOne({email})
    if(!user) return res.status(401).json({error:"user not found"});

    const alreadyHasToken=await passwordResetToken.findOne({owner:user._id});

    if(alreadyHasToken) return res.json({error:"wait for 60 minutes"});
    
    const token = await generateRandomByte();
  const newPasswordResetToken = await passwordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;

  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password Link",
    html: `
      <p>Click here to reset password</p>
      <a href='${resetPasswordUrl}'>Change Password</a>
    `,
  });

  res.json({ message: "Link sent to your email!" });
}

exports.sendResetPasswordStatus= (req,res)=>{
    res.json({valid:true});
}

exports.resetPassword=async(req,res)=>{

     const {newPassword,userId}=req.body;
     const user=await User.findById(userId)
    const matched=await user.compairePassword(newPassword)
    if(matched) return res.json({error:"the new password must be differnet from the last password"});
    user.password=newPassword;
    await user.save();
    await passwordResetToken.findByIdAndDelete(req.resetToken._id);
    const transport=generateMailTransporter();
    transport.sendMail({
        from: 'kaiko@reviewapp.com',
        to: user.email,
        subject: 'password reset successfully',
        html:`
        <h1>password Reset successfully</h1>
        <p> now you can use your new password</p>
        `,
    })
    res.json({message:"password reset successfully"});
}

exports.signIn=async (req,res)=>{
   const  {email,password}=req.body;

   const user=await User.findOne({email});
   if(!user) return res.status(400).json({error:"email/password are mismatched"});

   const matched=await user.compairePassword(password);
   if(!matched) return res.status(400).json({error:"email/password are mismatched"});

   const {_id,name,isVerified,role}=user;

   const jwtToken=jwt.sign(
    {userId:_id},process.env.JWT_SECRET
   );

   res.json({user:{id:_id,name,email,role,token:jwtToken,isVerified,role}});

}




