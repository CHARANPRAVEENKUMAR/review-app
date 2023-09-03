const crypto=require("crypto");
const cloudinary=require("../cloud");
const Review = require("../models/review");
const { match } = require("assert");

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

exports.averageRatingPipeline=(movieId)=>{
    return [
    {
        $lookup:
          {
            from: "Review",
            localField: "rating",
            foreignField: '_id',
            as: 'avgRat',
          },
    },
    {
      $match:{parentMovie:movieId}
    },
    {
      $group:{
        _id:null,
        ratingAvg:{
          $avg:'$rating'
        },
        reviewCount:{
          $sum:1,
        },
      },
    },
  ]};
exports.relatedMovieAggregation=(movieId,tags)=>{
   return  [
        {
          $lookup:{
            from:"Movie",
            localField:'tags',
            foreignField:'_id',
            as:'relatedMovies',
          }
        },
          {
              $match:{
                tags:{$in:[...tags]}, //similar movies with tags
                _id:{$ne:movieId}, //ne-notequalto presentmovie
              },
          },
          {
            $project:{
              title:1,
              poster:'$poster.url',
              responsivePosters: "$poster.responsive",
            }
          },
          {
            $limit:5
          }
      ]
}

exports.getAverageRatings=async(movieId)=>{
    const [aggregatedResponse]=await Review.aggregate(this.averageRatingPipeline(movieId));
  const reviews={};
  if(aggregatedResponse){
    const {ratingAvg,reviewCount}=aggregatedResponse;
    reviews.ratingAvg= parseFloat(ratingAvg).toFixed(1); //to convert 7.75 to 7.7
    reviews.reviewCount=reviewCount;
  }
  return reviews;
}

exports.topRatedMoviesPipeline=(type)=>{   //aggregation pipeline
  const matchOptions={     //check this 
    reviews:{$exists:true}, //present
    status:{$eq:"public"}, //equalto
    } 
    if(type)matchOptions.type={$eq:type}

    return [
        {
            $lookup:{
              from:"Movie",   //in movidb havngi most reviews  mondodb aggregation pipelines
              localField:"reviews",
              foreignField:"_id",
              as:"topRated"
            }
      },
      {
        $match:matchOptions,
      },
      {
        $project:{
          title:1,
          poster:'$poster.url',
          responsivePosters:'$poster.responsive',
          reviewCount:{$size:"$reviews"},
        }
      },
      {
        $sort:{
          reviewCount:-1 //desecnding which means having high reviews
        }
      },
      {
        $limit:5
      },
      ]
}