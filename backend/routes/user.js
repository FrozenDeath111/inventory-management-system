const express = require("express");
const { registerUser, loginUser, getUserInfo, verifyToken, getWarehouseStaff } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth.js");

const router = express.Router();

// register
router.post('/register', registerUser);

// login
router.post("/login", loginUser);

// verify
router.post("/verify", verifyToken);

// get all userInfo
router.get("/all-user-info", requireAuth, getUserInfo);

//get warehouse staff
router.get("/all-warehouse-staff", requireAuth, getWarehouseStaff);

module.exports = router;