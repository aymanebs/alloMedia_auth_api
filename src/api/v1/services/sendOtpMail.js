const { sendingMail } = require("./mailing");
require("dotenv").config();

const sendOtpMail = async (userEmail,otp)=>{
    try {
        await sendingMail({
            from: process.env.EMAIL,  
            to: userEmail,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
            html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
        });
        console.log("OTP mail sent successfully!");
    } catch (error) {
        console.error("Error sending OTP email:", error);
    }
}

module.exports = sendOtpMail ;