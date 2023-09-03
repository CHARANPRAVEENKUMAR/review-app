const { isValidObjectId } = require('mongoose');
const Actor=require('../models/actor');
const { uploadImageToCloud, formatActor } = require('../utils/helper');
const cloudinary=require("../cloud");

exports.createActor=async(req,res)=>{
   const {name,about,gender}=req.body;
   const {file}=req; //to make it optional 

   const newActor=new Actor({name,about,gender});
  // console.log(file);
  if(file){
    const { url, public_id } = await uploadImageToCloud(file.path); //cloud/index.js
  newActor.avatar={url,public_id};
}
  await newActor.save(); //to save in mongodb
  res.status(201).json({actor:formatActor(newActor)}); //?to make file optoional
  //res.status(201).json({id:newActor._id,name,about,gender,avatar:newActor.avatar?.url}); //?to make file optoional
  //earlier it is 

}
exports.updateActor=async(req,res)=>{
   const {name,about,gender}=req.body;
   const {file}=req; 
   const{actorId}=req.params;
   console.log(actorId);
  if(!isValidObjectId(actorId)) return res.json({error:"Invalid request!"}); //get this from mongoose
   const actor=await Actor.findById(actorId);
   if(!actor) return res.json({error:"Invalid request,record not found!"})

   const public_id=actor.avatar?.public_id;
   console.log(public_id)
   //remove old image if he want to upload new one file is our new image
   if(file&&public_id){
    const {result}=await cloudinary.uploader.destroy(public_id);
    //console.log(result);
   if(result!=="ok") return res.json({error:"could not remove image from cloud"});
   }
   //upload new avatar
   if(file){
    const { url, public_id } = await uploadImageToCloud(file.path); //cloud/index.js
    actor.avatar={url,public_id};
   }
    actor.name=name;
    actor.about=about;
    actor.gender=gender;
    await actor.save();
  res.status(201).json({actor:formatActor(actor)}); //?to make file optoional
  //earlier it is res.status(201).json({id:actor._id,name,about,gender,avatar:actor.avatar?.url}); //?to make file optoional
}

exports.removeActor=async(req,res)=>{
   const{actorId}=req.params;
   console.log(actorId);
  if(!isValidObjectId(actorId)) return res.json({error:"Invalid request!"}); //get this from mongoose
   const actor=await Actor.findById(actorId);
   if(!actor) return res.json({error:"Invalid request,record not found!"});
   const {public_id}=actor.avatar?.public_id;
   if(public_id){
    const {result}=await cloudinary.uploader.destroy(public_id);
    //console.log(result);
   if(result!=="ok") return res.json({error:"could not remove image from cloud"});
   }
   await Actor.findByIdAndDelete(actorId);
   res.json({message:"record removed successfully"});

   
};

exports.searchActor=async (req,res)=>{
    const {name}=req.query;
   // query.name
   //const result= await Actor.find({$text:{$search:`"${query.name}"`}}); //inside mongoose find method by index `of name //to get the exact match use in douvle quote for normal use normal without quotes
   
   //we need to send text thats whyits 
   if(!name.trim()) return res.json({message:'invalid request'})
   const result= await Actor.find({name:{$regex:name,$options:'i'}}); //this will help even if you give some part of the name
  const actors=result.map((actor)=>formatActor(actor))

   res.json({results: actors});
}

exports.getLatestActors=async(req,res)=>{
 const result=await Actor.find().sort({createdAt:'-1'}).limit(12); //-1 descewnding and 1 for ascending
 const actors=result.map((actor)=>formatActor(actor))  

 res.json(actors);

}
exports.getSingleActor=async(req,res)=>{
   const {id}=req.params;
   if(!isValidObjectId(id)) return res.json({error:"Invalid request!"}); //get this from mongoose
   const actor=await Actor.findById(id);
   if(!actor){return res.status(404).json({error:"invalid request,actor not found"})}
   res.json({actor:formatActor(actor)});

}

exports.getActors=async(req,res)=>{  //pagination
    const {pageNo,limit}=req.query;
    const actors=await Actor.find({})
      .sort({createdAt:-1})//this is used to select the latest actors
      .skip(parseInt(pageNo)*parseInt(limit))
      .limit(parseInt(limit))   //plo page,limit,skip

      const profiles = actors.map((actor) => formatActor(actor));
      res.json({
        profiles,
      });
} 