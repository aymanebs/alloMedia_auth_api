    const  User  = require("../models/User");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const joi = require("joi");
    const { sendingMail } = require("../services/mailing");
    const requestOtp = require("../helpers/requestOtp");

    

    //////////////// Register method

    const register = async (req, res) => {
        const { name, email, password, phone, address } = req.body;

        try {
            // Saving the user
            const user = await new User({
                name,
                email,
                password: await bcrypt.hash(password, 10),
                phone,
                address,
            }).save();

            if (user) {
                const payload = { userId: user._id };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

                // Send mail to user
                sendingMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Account Verification Link",
                    text: `Hello, ${name}. Please verify your email.`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f0f0f0;">
                        <div style="background-color: #FFC300; color: white; padding: 20px; text-align: center;">
                            <h1 style="margin: 0;">Welcome to Our Community!</h1>
                        </div>
                        <div style="background-color: #f6eaf2; padding: 20px; border-bottom: 2px solid #e0e0e0;">
                            <p style="font-size: 16px; line-height: 1.5; color: #333;">Hello ${name},</p>
                            <p style="font-size: 16px; line-height: 1.5; color: #333;">We're excited to have you on board! To get started, please verify your email address:</p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/register/verify-email/${user._id}/${token}" style="display: inline-block; padding: 14px 30px; background-color: #581845; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px; transition: background-color 0.3s ease;">Verify My Email</a>
                            </div>
                            <p style="font-size: 14px; color: #666; text-align: center;">This link will expire in 24 hours for security reasons.</p>
                        </div>
                        <div style="background-color: #f9f9f9; padding: 20px; border-bottom: 2px solid #e0e0e0;">
                            <h2 style="color: #333; margin-top: 0;">What's Next?</h2>
                            <ul style="color: #555; line-height: 1.6;">
                                <li>Complete your profile</li>
                                <li>Explore our features</li>
                                <li>Connect with other members</li>
                            </ul>
                        </div>
                        <div style="background-color: #FFC300; color: white; padding: 20px; text-align: center;">
                            <p style="margin: 0; font-size: 14px;">If you didn't create an account, you can safely ignore this email.</p>
                        </div>
                        <div style="background-color: #581845; color: #fff; padding: 10px; text-align: center; font-size: 12px;">
                            <p style="margin: 5px 0;">This is an automated message, please do not reply.</p>
                            <p style="margin: 5px 0;">&copy; 2024 Your Company Name. All rights reserved.</p>
                        </div>
                    </div>
                    `,
                });


                return res.status(201).send(user);
            }
        } catch (error) {
            console.error("Error in register", error);
            return res.status(500).json({ error: "Registration failed" });
        }
    };

    //////////////// Verify the email of user

    const verifyEmail = async (req, res) => {


        const { id, token } = req.params; 

        try {
            // Verifying the JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if the decoded user ID matches the ID in the route parameter
            if (decoded.userId !== id) {
                return res.status(400).json({ message: "Token does not match user ID" });
            }

            // Find the user
            const user = await User.findById(decoded.userId);

            if (!user) {
                return res.status(400).json({ message: "Invalid token" });
            }

            // Update email is verified
            user.emailIsVerified = true;
            await user.save();

            res.status(200).json({ message: "Email is verified successfully" });
        } catch (error) {
            
            res.status(400).json({ message: "Error verifying email" });
        }
    };


 /////////////// Login method

const login = async (req, res) => {

    const { email, password } = req.body;
  
    try {

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if the email is verified 
      if (!user.emailIsVerified) {
        return res.status(403).json({ message: 'Please verify your email before logging in' });
      }
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      

      //Request otp 
      const otp = await requestOtp(req);

      
      // Respond with a message prompting user to enter OTP
      res.status(200).json({ message: 'OTP has been sent to your email. Please verify to complete login.',userId:user._id });
      

  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };


  ////////////////// Verify Otp method

  const verifyOtp = (req,res) =>{

    const { userId,otp } = req.body;
    try{
        // Checking Otp and it's expiration
        if(! req.session.otp || Date.now() > req.session.otpExpires){
            req.status(400).json({message:"otp not valid"});
        }

        // Checking if entered otp matches the stored one
        if(otp != req.session.otp){
            res.status(400).json({message:"entered otp invalid"});
        }

        // JWT token
        const token = jwt.sign({ userId}, process.env.JWT_SECRET, { expiresIn: '1d' });

        // dleteing session if entred otp matches
        delete req.session.otp;
        delete req.session.otpExpires;

        // Send token  to the client
        res.status(200).json({ token, message: 'Login successful' });
    }
    catch(error){
        console.error("Error while verifying otp");
        res.status(500).json({message:"Failed to verify otp"});
    }
}

//////////////// Request reset password method

const requestResetPassword =async (req,res)=>{

    const {email}= req.body;
    try{
        const user = await User.findOne({email});
        // verify user
        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
          }
        // Generate and send otp
        const otp = await requestOtp(req);
        
        res.status(200).json({message:"Otp sent to your email. Please check to continue password renitialisation"});
    }
    catch(error){
        console.error("error requesting password reset",error)
    }
};

///////////////// Verify otp for password
const  verifyOtpForReset = async(req,res)=>{

    const {otp} =req.body;
    try{
    // Check if OTP is valid and not expired
    if (!req.session.otp || Date.now() > req.session.otpExpires) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if entered OTP matches the stored one
    if (otp != req.session.otp) {
        return res.status(400).json({ message: 'Entered OTP is invalid' });
    }
    // Flag for verified otp
    req.session.otpVerified = true; 
    res.status(200).json({message:"You can now reset your password"});
    }
    catch(error){
        console.error("error verifying otp for password reset",error)
    }
}
/////////////////////// Update password
const updatePassword = async(req,res) => {

    // Updating the password
    const { newPassword } = req.body;
    const {userId} = req.body;

    // Check if OTP is verified 
    if (!req.session.otpVerified) {
        return res.status(403).json({ message: 'You must verify the OTP before updating your password.' });
    }

    try{
    const Schema = joi.object({
        newPassword:joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9@]")).required(),
    });
    const result = await Schema.validate({newPassword});
    if (result.error) {
        return res.status(400).send({error: result.error.message});
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
        { _id: userId }, 
        { $set: { password: hashedPassword } } 
    );


    // Clear the OTP session
    delete req.session.otp;
    delete req.session.otpExpires;
    delete req.session.otpVerified;

    res.status(200).json({ message: 'Password has been updated successfully.' });
    }

    catch(error){
        console.error("error updating password",error);
    }
}

///////////////////// Logout

const logout = (req, res) => {
    try {

        req.session = null;
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout", error);
        res.status(500).json({ message: 'Server error during logout' });
    }
};


  module.exports = { register, verifyEmail, login, verifyOtp, requestResetPassword,verifyOtpForReset, updatePassword,logout  };




