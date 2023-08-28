const {check,validationResult}=require("express-validator");
const genres = require("../utils/genres");
const { isValidObjectId } = require("mongoose");

//withMessage executes when previous state is false
//we should return true; after custom validation to  check antoher validation in array otherwise it break there
exports.userValidator=[ 
    check("name").trim().not().isEmpty().withMessage("name is empty"),
    check("email").normalizeEmail().isEmail().withMessage("please enter a valid email"),
    check("password").trim().not().isEmpty().withMessage("password is empty bro check").isLength({min:8, max:20}).withMessage("password must be 8 to 20 characters long")
];

exports.signInValidator=[ 
    check("email").normalizeEmail().isEmail().withMessage("please enter a valid email"),
    check("password").trim().not().isEmpty().withMessage("password is empty bro check")
];

exports.actorInfoValidtor=[
    check("name").trim().not().isEmpty().withMessage("Actor name is missing"),
    check("about").trim().not().isEmpty().withMessage("About is a required filed!"),
    check("gender").trim().not().isEmpty().withMessage("gnddr is a required field1"),
    

]

exports.validatePassword=[
    check("newPassword").trim().not().isEmpty().withMessage("password is Missing").isLength({min:6,max:20}).withMessage("check password length should between 8 and 20")
];

exports.validateMovie=[
    check("title").trim().not().isEmpty().withMessage("title is missing"),
    check("storyLine").trim().not().isEmpty().withMessage("storyline is missing"),
    check("language").trim().not().isEmpty().withMessage("language is missing"),
    check("releaseDate").isDate().withMessage("release date is missing"),
    check("status").isIn(["public","private"]).withMessage("title is missing"),
    check("type").trim().not().isEmpty().withMessage("movie type is missing"),
     check("genres").isArray().withMessage('genres must be an array of strings').custom((value)=>{ //custom validator
          for(let g of value){
            if(!genres.includes(g) ) throw Error('Invalid genres');
          }
          return true;
    }),
    check('tags').isArray({min:1}).withMessage("tags must be an array of strings").custom((tags)=>{
        for(let t of tags){
            if(typeof t !=="string"){
                throw Error('tags shoould be strings');
            }
        }
        return true;
    }),
    // check("cast").isArray().withMessage("cast should be array of objects").custom((cast)=>{
    //     for(let c of cast){
    //          if(!isValidObjectId(c.actor)){
    //             console.log(`${c.actor} ${isValidObjectId(c.actor)}`);
    //             throw Error("invalid cast id inside!")} //using mongoose to check Objectid
    //          if(!c.roleAs?.trim()) throw Error("role is mising in cast")
    //          if(typeof c.leadActor !=='boolean')throw Error ("only accepted boolean value insidde leadactor!")
    //     }
    //     return true;
    // }),
    check("trailer").isObject().withMessage("trialer Info must be an object with public_id and url")
    .custom(({url,public_id})=>{
         try{
            const result=new URL(url); //if not a url raises an error by catch block
            if(!result.protocol.includes('http')) throw Error("trailer url is invalid") //we accept only https 
            const arr=url.split('/')
            const publicId=arr[arr.length-1].split('.')[0]  //public id is in cloudinary url
            if(publicId!==public_id) throw Error("Trailer public_id is invalid!")
            return true;
         } //url verifycation
         catch(error){ throw Error("trailer url is invalid!") }
    }),
    // check('poster').custom((_,{req})=>{
    //         if(!req.file) throw Error("poster file is missing !")
    //         return true;
    // })
];

exports.validateTrailer=check("trailer").isObject().withMessage("trialer Info must be an object with public_id and url")
.custom(({url,public_id})=>{
     try{
        const result=new URL(url); //if not a url raises an error by catch block
        if(!result.protocol.includes('http')) throw Error("trailer url is invalid") //we accept only https 
        const arr=url.split('/')
        const publicId=arr[arr.length-1].split('.')[0]  //public id is in cloudinary url
        if(publicId!==public_id) throw Error("Trailer public_id is invalid!")
        return true;
     } //url verifycation
     catch(error){ throw Error("trailer url is invalid!") }
})


exports.validate=(req,res,next)=>{
    const error=validationResult(req).array();
    if(error.length){
        return res.json(error[0].msg);
    }

    next(); //since this is a middle ware function to move next we use this function 
}