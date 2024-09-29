const express = require("express");
const router = express.Router();
const { login } = require("../controllers/AuthController"); 
const validateLogin = require("../middlewares/validateLogin");

// Login routes

router.post("/",validateLogin,login);

module.exports=router;