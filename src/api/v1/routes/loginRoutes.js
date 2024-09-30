const express = require("express");
const router = express.Router();
const { login, verifyOtp } = require("../controllers/AuthController"); 
const validateLogin = require("../middlewares/validateLogin");

// Login routes

router.post("/",validateLogin,login);

// Verify Otp route
router.post("/verify-otp",verifyOtp);


module.exports=router;