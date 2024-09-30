    const  User  = require("../models/User");
    const bcrypt = require("bcryptjs");
    const jwt = require("jsonwebtoken");
    const joi = require("joi");
    const { sendingMail } = require("../services/mailing");

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
  
      // JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      // Send token  to the client
      res.status(200).json({ token, message: 'Login successful' });
  
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = { register, verifyEmail, login };