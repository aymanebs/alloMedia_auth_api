const { findOne } = require("../models/User");
const sendOtpMail = require("../services/sendOtpMail");
const generateOtp = require("./generateOtp");


// Send the otp method
const requestOtp = async (req) =>{

    const { email } =req.body;

    try{
        // Otp generation
        
        const otp = generateOtp();

        // Send Otp mail
        await sendOtpMail(email,otp);

        // Storing the Otp in session
        req.session.otp = otp;
        req.session.otpExpires = Date.now()+300000;
        

        return { success: true, message: "OTP sent in mail" };
    }
    catch(error){
        console.error("Error requesting otp: ",error);
    }
}

module.exports= requestOtp;