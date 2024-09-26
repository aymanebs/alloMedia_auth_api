const express =require("express");
const router =express.Router();
const registerRoutes =require("./registerRoutes");

router.use('/register',registerRoutes);

module.exports=router;