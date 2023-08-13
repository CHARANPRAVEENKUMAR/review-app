const {check,validationResult}=require("express-validator");

exports.userValidator=[ 
    check("name").trim().not().isEmpty().withMessage("name is empty"),
    check("email").normalizeEmail().isEmail().withMessage("please enter a valid email"),
    check("password").trim().not().isEmpty().withMessage("password is empty bro check").isLength({min:8, max:20}).withMessage("password must be 8 to 20 characters long")
];

exports.signInValidator=[ 
    check("email").normalizeEmail().isEmail().withMessage("please enter a valid email"),
    check("password").trim().not().isEmpty().withMessage("password is empty bro check")
];

exports.validatePassword=[
    check("newPassword").trim().not().isEmpty().withMessage("password is Missing").isLength({min:6,max:20}).withMessage("check password length should between 8 and 20")
];

exports.validate=(req,res,next)=>{
    const error=validationResult(req).array();
    if(error.length){
        return res.json(error[0].msg);
    }

    next(); //since this is a middle ware function to move next we use this function 
}