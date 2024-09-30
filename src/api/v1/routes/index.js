const express =require("express");
const router =express.Router();
const registerRoutes =require("./registerRoutes");
const loginRoutes =require("./loginRoutes");
const resetPasswordRoutes = require("./resetPasswordRoutes");

router.use('/register',registerRoutes);
router.use('/login',loginRoutes);
router.use('/resetPassword',resetPasswordRoutes);

module.exports=router;