const multer=require('multer');  //it is a middleware used to store the images,videos in backend until it reaches to our cloudinary 
const storage=multer.diskStorage({});


const imageFileFilter=(req,file,cb)=>{
    console.log(file)
    if(!file.mimetype.startsWith('image')){
    cb("supported only image files!",false)  }//callback (error,,nextmove) input 
    cb(null,true) 

}
const videoFileFilter=(req,file,cb)=>{
    console.log(file)
    if(!file.mimetype.startsWith('video')){
    cb("supported only video files!",false)  }//callback (error,,nextmove) input 
    cb(null,true) 

}

exports.uploadImage=multer({storage,fileFilter:imageFileFilter});
exports.uploadVideo=multer({storage,fileFilter:videoFileFilter});

