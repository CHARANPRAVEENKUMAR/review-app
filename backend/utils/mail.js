const nodemailer=require("nodemailer");

exports.generateOTP=(otplength=6)=>{
    OTP="";
    for(i=1;i<=otplength;i++){
       OTP+=Math.round(Math.random()*9); 
    }
    return OTP;
}
exports.generateMailTransporter=()=>nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "54967c5874d618",
      pass: "42787df265cda5"
    }
  });