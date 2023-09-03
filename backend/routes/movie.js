const express= require('express');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { uploadVideo, uploadImage } = require('../middlewares/multer');
const { uploadTrailer, createMovie, updateMovieWithOutPoster, updateMovieWithPoster, removeMovie, getMovies, getMovieForUpdate, updateMovie, searchMovies, getLatestUploads, getSingleMovie, getRelatedMovies, getTopRatedMovies,searchPublicMovies } = require('../controllers/movie');
const { validateMovie, validate, validateTrailer } = require('../middlewares/validator');
const { parseData, getAverageRatings } = require('../utils/helper');
const router=express.Router();

//apis,endpoints,controllers,middlewares
router.post('/upload-trailer',isAuth,isAdmin,uploadVideo.single('video'),uploadTrailer);   
router.post('/create',isAuth,
isAdmin,
uploadImage.single('poster'),
parseData,
validateMovie,
validateTrailer,
validate,
createMovie);  

// router.patch('/update-movie-without-poster/:movieId',isAuth,
//     isAdmin,
//     //parseData, //while running in json postman api remove this to get rid of error  json 0 
//     validateMovie,
//     validate,
//     updateMovieWithOutPoster);  //difference put and patch patch is used to change some no need of multer because no files
router.patch('/update/:movieId',
    isAuth,
    isAdmin,
    uploadImage.single("poster"),
    parseData, //beacuse of api 
    validateMovie,
    validate,
    updateMovie);  //difference put and patch patch is used to change some
router.delete('/:movieId',isAuth,isAdmin,removeMovie);
router.get('/movies',isAuth,isAdmin,getMovies);
router.get("/for-update/:movieId",isAuth,isAdmin,getMovieForUpdate);
router.get("/search",isAuth,isAdmin,searchMovies);

//for normal users
router.get('/latest-uploads',getLatestUploads);
router.get('/single/:movieId',getSingleMovie);
router.get('/related/:movieId',getRelatedMovies);
router.get('/top-rated',getTopRatedMovies);
router.get("/search-public",searchPublicMovies);


module.exports=router;
