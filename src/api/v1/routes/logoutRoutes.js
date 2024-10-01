const express = require('express');
const router = express.Router();
const { logout } = require('../controllers/AuthController');

// Logout routes
router.get("/",logout);

module.exports=router;