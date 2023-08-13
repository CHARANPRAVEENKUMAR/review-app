const mongoose=require("mongoose");//for mongodb
const bcrypt=require("bcrypt");//for hashing password

const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false
    }
});

//for saving in database
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10);
    }
    next();
});

//verifying new password and old password are same or not
userSchema.methods.compairePassword=async function(password){
    const result=  await bcrypt.compare(password,this.password);
    return result;
}

module.exports=mongoose.model("user",userSchema)





