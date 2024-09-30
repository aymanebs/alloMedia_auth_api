const express = require("express");
const router = express.Router();
const { register, verifyEmail } = require("../controllers/AuthController"); 
const validateRegister = require("../middlewares/validateRegister");
const emailCheck = require("../middlewares/emailCheck");


// Verify email route
router.get("/verify-email/:id/:token", verifyEmail);

// Register route
router.post("/", validateRegister, emailCheck, register);



module.exports = router;
