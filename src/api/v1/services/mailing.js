const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports.sendingMail = async({from, to, subject, text,html})=>{
    
    try{
        let mailOptions = ({from, to, subject, text,html});
        const Transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.EMAILPASSWORD,
            }

        });

        return await Transporter.sendMail(mailOptions);
    }

    catch(error){
        console.error("send mail error: ",error)
    }
}