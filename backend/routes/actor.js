const express=require("express");
const { createActor, updateActor, removeActor, searchActor, getLatestActors, getSingleActor, getActors } = require("../controllers/actor");
const actor = require("../models/actor");
const { actorInfoValidtor, validate } = require("../middlewares/validator");
const { uploadImage } = require("../middlewares/multer");
const { isAuth, isAdmin } = require("../middlewares/auth");
const router=express.Router();

router.post("/create",isAuth,isAdmin,uploadImage.single("avatar"),actorInfoValidtor,validate,createActor);
router.post("/update/:actorId",isAuth,isAdmin,uploadImage.single("avatar"),actorInfoValidtor,validate,updateActor); //dynamic endpoint : used for searcxh parmas
router.delete('/:actorId',isAuth,isAdmin,removeActor);
router.get('/search',isAuth,isAdmin,searchActor);//now
router.get('/latest-uploads',isAuth,isAdmin,getLatestActors);
router.get("/actors",isAuth,isAdmin,getActors);
router.get('/single/:id',getSingleActor);



module.exports=router;