const express = require("express");
const router =express.Router();
const { requestResetPassword,verifyOtpForReset, updatePassword } = require("../controllers/AuthController");

// Reset password routes

router.post("/",requestResetPassword);

router.post("/verifyOtp",verifyOtpForReset);

router.post("/updatePassword",updatePassword);

module.exports =router;