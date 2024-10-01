const express =require("express");
const router =express.Router();
const registerRoutes =require("./registerRoutes");
const loginRoutes =require("./loginRoutes");
const resetPasswordRoutes = require("./resetPasswordRoutes");
const logoutRoutes = require('./logoutRoutes');

router.use('/register',registerRoutes);
router.use('/login',loginRoutes);
router.use('/resetPassword',resetPasswordRoutes);
router.use('/logout',logoutRoutes);

module.exports=router;