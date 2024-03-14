const express = require("express");
const { registerUser, loginUser, getUserInfo } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

// register
router.post('/register', registerUser);

// login
router.post("/login", loginUser);

// get all userInfo
router.get("/all-user-info", requireAuth, getUserInfo);

module.exports = router;