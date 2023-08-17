const jwt=require("jsonwebtoken");
const User = require("../models/user");


exports.isAuth=async (req,res,next)=>{
    
        const token=req.headers?.authorization;
        const jwtToken=token.split('Bearer ')[1]
    
        if(!jwtToken) return res.json({error:"invalid token!"})
       const decode= jwt.verify(jwtToken,process.env.JWT_SECRET);
       const {userId}=decode;
       const user=await User.findById(userId);
       if(!user) return res.status(404).json({error:"invaild token user not found"})
       res.json({user:{id:user._id,name:user.name,email:user.email}}); //remove this

       req.user=user;
       next();

}