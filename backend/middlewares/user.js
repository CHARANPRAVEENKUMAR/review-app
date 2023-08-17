const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");

exports.isValidPassResetToken = async (req, res, next) => {
    const { token, userId } = req.body;
     console.log(`hi from backend ${token} ${userId}`)

    if (!token.trim() || !isValidObjectId(userId))
        return res.json({error:"invalid request"})

    const resetToken = await PasswordResetToken.findOne({ owner: userId });
    // console.log(`th reset token is ${resetToken}`)
    if (!resetToken)
        return res.json({error:"unauthorized access in valid request"})

    const matched = await resetToken.compaireToken(token);
    
    if (!matched) return res.json({error:"unauthorised access ivalid request"})

    req.resetToken = resetToken;
    next();
};