const { isValidObjectId, default: mongoose } = require("mongoose");
const cloudinary=require("../cloud/index");
const Movie=require("../models/movie");
const Review=require("../models/review");
const { formatActor, sendError, averageRatingPipeline, getAverageRatings, relatedMovieAggregation, topRatedMoviesPipeline } = require("../utils/helper");

exports.uploadTrailer=async(req,res)=>{
       const {file}=req; //destructure the file
       if(!file) return res.json({error:"video file is missing"})
    const {secure_url:url,public_id}=await cloudinary.uploader.upload(file.path,{resource_type:'video'});
    res.status(201).json({url,public_id});
}
exports.createMovie=async(req,res)=>{
    const {file,body}=req;
    const {title,storyLine,director,releaseDate,status,type,genres,tags,cast,writers,trailer,language}=body;
    
    console.log(body);
    console.log(file);

    const newMovie = new Movie({
        title,
        storyLine,
        releaseDate,
        status,
        type,
        cast,
        genres,
        tags,
        trailer,
        language,
      });
      console.log(`new movie is ${newMovie}`)

      if (director) {
        if (!isValidObjectId(director))
          return res.status(403).json({error:"invalid director id!"});
        newMovie.director = director;
      }
    
      if (writers) {
        for (let writerId of writers) {
          if (!isValidObjectId(writerId)){
            console.log(writerId);
            console.log(isValidObjectId(writerId));
            return res.status(403).json({error:"invalid writer id!"});
        }
        }
        newMovie.writers = writers;
    }
        //uploading poster secure_url:url,public_id
        if(file){//making optional
        const {secure_url,public_id,responsive_breakpoints}=await cloudinary.uploader.upload(file.path,{
          transformation:{
            width:1280,
            height:720,
        },
        responsive_breakpoints:{    //uploaidng poster with multiple sizes
            create_derived:true,  
            max_width:640,
            max_images:3,
        }});
        const finalPoster={url:secure_url,public_id,responsive:[]};
        const {breakpoints}=responsive_breakpoints[0];
        if(breakpoints.length)
        {
        for(let imgObj of breakpoints){
            const {secure_url}=imgObj
            finalPoster.responsive.push(secure_url)
        }
      }
      newMovie.poster=finalPoster;
    }  
      await newMovie.save();
        // console.log(cloudres);
        // console.log(cloudres.responsive_breakpoints[0].breakpoints)
        res.status(201).json({
          movie:{
          id:newMovie._id,
          title,
      },});
    //  console.log(req.body);

}

exports.updateMovieWithOutPoster=async (req,res)=>{
    const {movieId}=req.params;
    const {body}=req;
    if(!isValidObjectId(movieId)) return res.status(403).json({error:"Invalid movie Id!"});
    const movie=await Movie.findById(movieId);
    if(!movie) return res.status(404).json({error:"Movie Not Found!"});
    const {title,storyLine,director,releaseDate,status,type,genres,tags,cast,writers,trailer,language}=req.body;
    movie.title=title;
    movie.storyLine=storyLine;
    movie.releaseDate=releaseDate;
    movie.status=status;
    movie.type=type;
    movie.language=language;
    movie.cast=cast;
    movie.trailer=trailer;
    movie.genres=genres;
    movie.tags=tags;

    //these are optional 
    if (director) {
      if (!isValidObjectId(director))
        return res.status(403).json({error:"invalid director id!"});
      movie.director = director;
    }
  
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId)){
          console.log(writerId);
          console.log(isValidObjectId(writerId));
          return res.status(403).json({error:"invalid writer id!"});
      }
      }
      movie.writers = writers;
  }
    await movie.save();
    res.json({message:"movie is updated",movie})

}

exports.updateMovie=async (req,res)=>{
  const {movieId}=req.params;
  const {file}=req;
    // const {body}=req;
    if(!isValidObjectId(movieId)) return res.status(401).json({error:"Invalid movie Id!"});
    // if(!req.file) return res.json({error:"movie poster is missing"});
    const movie=await Movie.findById(movieId);
    if(!movie) return res.status(404).json({error:"Movie Not Found!"});
    const {title,storyLine,director,releaseDate,status,type,genres,tags,cast,writers,trailer,language}=req.body;
    movie.title=title;
    movie.storyLine=storyLine;
    movie.releaseDate=releaseDate;
    movie.status=status;
    movie.type=type;
    movie.language=language;
    movie.cast=cast;
    movie.genres=genres;
    movie.tags=tags;

    //these are optional 
    if (director) {
      if (!isValidObjectId(director))
        return res.status(403).json({error:"invalid director id!"});
      movie.director = director;
    }
  
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId)){
          console.log(writerId);
          console.log(isValidObjectId(writerId));
          return res.status(403).json({error:"invalid writer id!"});
      }
      }
      movie.writers = writers;
  }

  //update poster.
  if(file){
      const posterID=movie.poster?.public_id //remove update poster
      if(posterID){
      const {result} =await cloudinary.uploader.destroy(posterID);
      if(result!=='ok') return res.status(403).json({error:"couldnot update poster at moment!"})
      }
        //uploading poster secure_url:url,public_id
        const {secure_url,public_id,responsive_breakpoints}=await cloudinary.uploader.upload(req.file.path,{
          transformation:{
            width:1280,
            height:720,
        },
        responsive_breakpoints:{    //uploaidng poster with multiple sizes
            create_derived:true,  
            max_width:640,
            max_images:3,
        }});
        const finalPoster={url,public_id,responsive:[]};
        const {breakpoints}=responsive_breakpoints[0];
        if(breakpoints.length)
        {
        for(let imgObj of breakpoints){
            const {secure_url}=imgObj
            finalPoster.responsive.push(secure_url)
        }
        }
        movie.poster=finalPoster;
  }
    await movie.save();
  
    res.status(200).json({message:"Movie is updated",movie:{
      id:movie._id,
      title:movie.title,
      poster:movie.poster?.url,
      genres:movie.genres,
      status:movie.status,
      
    },})
}

exports.removeMovie=async (req,res)=>{
  //1.delete poster2.delete trailer 3.delete body 
  const {movieId}=req.params;
  if(!isValidObjectId(movieId)) return res.status(403).json({error:"Invalid movie Id!"});
    const movie=await Movie.findById(movieId);
    if(!movie) return res.status(404).json({error:"Movie Not Found!"});
  //check if poster is or not to remove
  const posterId=movie.poster?.public_id;
  if(posterId){
   const {result}= await cloudinary.uploader.destroy(posterId);
   if(result!=="ok") res.json({error:"cant remove poster from cloud"});
  }
   const trailerId=movie.trailer?.public_id;
   if(!trailerId){return res.json({error:"couldnt find trailer in cloud!"})}
   if(trailerId){
    const {result}= await cloudinary.uploader.destroy(trailerId,{resource_type:"video",});
    if(result!=="ok") res.json({error:"cant remove trailer from cloud"});
   await Movie.findByIdAndDelete(movieId);

    res.json({message:"movie removed successfully"})
   }

}

exports.getMovies=async(req,res)=>{
  const {pageNo=0,limit=10}=req.query;

  const movies= await Movie.find({}).sort({createdAt:-1}).skip(parseInt(pageNo)*parseInt(limit)).limit(parseInt(limit));
  const results= movies.map((movie)=>({
      id:movie._id,
      title:movie.title,
      poster:movie.poster?.url,
      responsivePosters:movie.poster?.responsive,
      genres:movie.genres,
      status:movie.status,
  }))
  // const results= movies.map((movie)=>{
  //  return(
  //     id:movie._id,
  //     title:movie.title,
  //     poster:movie.poster?.url,
  //     genres:movie.genres,
  //     status:movie.status,)
  // })
  res.json({movies:results});
}

exports.getMovieForUpdate=async(req,res)=>{
  const {movieId}=req.params;

  if(!isValidObjectId(movieId)) return sendError(res, "Id is invalid!");
  const movie=await Movie.findById(movieId).populate('director writers cast.actor');  //we get ids of directors and witers so we use populate the details of them by id because we store with objectid ,reference
  //destructure all
  res.json({movie:{
    id:movie._id,
    title:movie.title,
    storyLine:movie.storyLine,
    poster:movie.poster?.url,//optional
    releaseDate:movie.releaseDate,
    status:movie.status,
    type:movie.type,
    language:movie.language,
    genres:movie.genres,
    tags:movie.tags,
    director:formatActor(movie.director),
    writers:movie.writers.map(w=>formatActor(w)),
    cast:movie.cast.map((c)=>{
      return {
        id:c.id,
        profile:formatActor(c.actor),
        roleAs:c.roleAs,
        leadActor:c.leadActor,
      }
    }),
  },});
};
exports.searchMovies=async(req,res)=>{
  const {title}=req.query;
  if(!title.trim())  return sendError(res,'invalid request!');
  const movies=await Movie.find({title:{$regex:title,$options:"i"}});
  res.json({results:movies.map((m)=>{
      return {
        id:m._id,
        title:m.title,
        poster:m.poster?.url,
        genres:m.genres,
        status:m.status,
      }
  })})
}

exports.getLatestUploads=async(req,res)=>{
  const {limit=5}=req.query; //by defult 5 
 const results=await Movie.find({status:"public"}).sort('-createdAt').limit(parseInt(limit));
 const movies=results.map((m)=>{
  return {
    id:m._id,
    title:m.title,
    storyline:m.storyline,
    poster:m.poster?.url,
    responsivePosters:m.poster.responsive,
    trailer:m.trailer.url,
  }
 })
  res.json({movies});
}

exports.getSingleMovie=async(req,res)=>{
    const {movieId}=req.params;
    // mongoose.Types.ObjectId(movieId) //we need to convert id like this while passing object to aggregation
    if(!isValidObjectId(movieId)) sendError(res,'Movie is not valid');

  const movie=await Movie.findById(movieId).populate('director writers cast.actor'); //populate is used to explore the refered part to instead of their id
  //study about aggregation operations in mongoDB passing data from one stage to another stage using 
  //aggregation pipeline stages in mongodb documenattion
  // const [aggregatedResponse]=await Review.aggregate(averageRatingPipeline(movie._id));
  // const reviews={};
  // if(aggregatedResponse){
  //   const {ratingAvg,reviewCount}=aggregatedResponse;
  //   reviews.ratingAvg= parseFloat(ratingAvg).toFixed(1); //to convert 7.75 to 7.7
  //   reviews.reviewCount=reviewCount;
  // }
  const reviews=await getAverageRatings(movie._id);

  const {_id:id,title,storyLine,cast,writers,director,releaseDate,genres,tags,poster,trailer,language,type}=movie;  //destructure according t our requirement
  //we need to return only required data instead of all data inside movie 
  //refactoring data according to our need for frontend
  // res.json({movie}) //see this you can understand
  res.json({movie:{
      id,
      title,
      storyLine,
      releaseDate,
      genres,
      tags,
      language,
      type,
      poster:poster?.url,
      trailer:trailer?.url,
      cast:cast.map((c)=>({
        id:c._id,
        profile:{
          id:c.actor._id,
          name:c.actor.name,
          avatar:c.actor?.avatar?.url,
        },
        leadActor:c.leadActor,
        roleAs:c.roleAs,
      })),
      writers:writers.map(w=>({
        id:w._id,
        name:w.name,
      })),
      director:{
        id:director._id,
        name:director.name,
      },
      reviews:{...reviews},
      
  },
})

}
exports.getRelatedMovies=async(req,res)=>{
  const {movieId}=req.params;
  if(!isValidObjectId(movieId)) return sendError(res,"Invalid Movie ID!");
  const movie=await Movie.findById(movieId);
  const movies=await Movie.aggregate(relatedMovieAggregation(movie._id,movie.tags));
  // const relatedMovies=await Promise.all(movies.map(async(m)=>{
  //   const reviews=await getAverageRatings(m._id);
  //   return {
  //     id:m._id,
  //     title:m.title,
  //     poster:m.poster,
  //     reviews:{...reviews}
  //   }

  // }))
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      reviews: { ...reviews },
    };
  };
  const relatedMovies = await Promise.all(movies.map(mapMovies));
    res.json({movies:relatedMovies});
}
exports.getTopRatedMovies=async(req,res)=>{
  const {type="Film"}=req.query;  //by default film -- making it optional 
  const movies=await Movie.aggregate(topRatedMoviesPipeline(type));  //mongodb aggregation pipelines it is a framework 
  const mapMovies=async (m)=>{
    const reviews=await getAverageRatings(m._id);
    return {
      id:m._id,
      title:m.title,
      poster:m.poster,
      responsivePosters:m.responsivePosters,
      reviews:{...reviews},
    }
  }
  const topRatedMovies=await Promise.all(movies.map(mapMovies))
  res.json({movies:topRatedMovies});
}

exports.searchPublicMovies=async(req,res)=>{
  const {title}=req.query;
  if(!title.trim())  return sendError(res,'invalid request!');
  const movies=await Movie.find({title:{$regex:title,$options:"i"},status:'public',});
  const mapMovies=async (m)=>{
    const reviews=await getAverageRatings(m._id);
    return {
      id:m._id,
      title:m.title,
      poster:m.poster?.url,
      responsivePosters:m.poster?.responsive,
      reviews:{...reviews},
    }
  }
  const results=await Promise.all(movies.map(mapMovies))
  res.json({results});
}