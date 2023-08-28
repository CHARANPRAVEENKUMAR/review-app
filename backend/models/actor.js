const mongoose=require("mongoose");//for mongodb
const bcrypt=require("bcrypt");//for hashing password

const actorSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    about:{
        type:String,
        trim:true,
        required:true,
    },
    gender:{
        type:String,
        trim:true,
        required:true,
    },
    avatar:{
        type:Object,
        url:String,
        public_id:String
    }
},{timestamps:true}); //timestamps to store time of the upload


// //for saving in database
// userSchema.pre("save",async function(next){
//     if(this.isModified("password")){
//         this.password= await bcrypt.hash(this.password,10);
//     }
//     next();
// });

// //verifying new password and old password are same or not
// userSchema.methods.compairePassword=async function(password){
//     const result=  await bcrypt.compare(password,this.password);
//     return result;
// }
actorSchema.index({name:'text'})

module.exports=mongoose.model("Actor",actorSchema)