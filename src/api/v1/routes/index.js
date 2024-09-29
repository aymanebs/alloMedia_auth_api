const express =require("express");
const router =express.Router();
const registerRoutes =require("./registerRoutes");
const loginRoutes =require("./loginRoutes");

router.use('/register',registerRoutes);
router.use('/login',loginRoutes);

module.exports=router;