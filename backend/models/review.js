const mongoose=require("mongoose");//for mongodb

const reviewSchema=mongoose.Schema({
    //owner parentmovie rating content
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    parentMovie:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"movie",
        required:true,
    },
    content:{
        type:String,
        trim:true,
    },
    rating:{
        type:Number,
        required:true,
    }

});


module.exports=mongoose.model("Review",reviewSchema)
