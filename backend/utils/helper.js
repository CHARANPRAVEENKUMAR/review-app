const crypto=require("crypto");
const cloudinary=require("../cloud")

exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString("hex");

            resolve(buffString);
        });
    });
};

exports.sendError = (res, error, statusCode = 401) =>
  res.status(statusCode).json({ error });

exports.handleNotFound=(req,res)=>{
    res.json({error:"not found"})
}

exports.uploadImageToCloud=async(file)=>{
   const {secure_url:url,public_id}=await cloudinary.uploader.upload(file,{width: 500, height: 500, gravity: "face", crop: "thumb"}); //cropping images using cloudinary along with upload
   //secure_url:url here we are referring url with secure_url 
   return {url,public_id};
}

exports.formatActor=(actor)=>{
    const {name,gender,about,_id,avatar}=actor;
    return {
        id:_id,
        name,
        about,
        gender,
        avatar:avatar?.url,
    }
}

exports.parseData=(req,res,next)=>{
    const {trailer,cast,genres,tags,writers}=req.body;
    
    if(trailer) req.body.trailer=JSON.parse(trailer);
    if(cast) req.body.cast=JSON.parse(cast);
    if(genres) req.body.genres=JSON.parse(genres);
    if(tags) req.body.tags=JSON.parse(tags);
    if(writers) req.body.writers=JSON.parse(writers);
    next();
}




