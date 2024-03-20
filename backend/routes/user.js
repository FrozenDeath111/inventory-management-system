const express = require("express");
const { registerUser, loginUser, getUserInfo, verifyToken, getWarehouseStaff } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

// register
router.post('/register', requireAuth, registerUser);

// login
router.post("/login", loginUser);

// get all userInfo
router.get("/all-user-info", requireAuth, getUserInfo);

//get warehouse staff
router.get("/all-warehouse-staff", requireAuth, getWarehouseStaff);

module.exports = router;