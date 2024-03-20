const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// create token functionality
const createToken = (username) => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

// register controller
const registerUser = async (req, res) => {
  const {username} = req.user;
  // get user entry
  const registerInfo = req.body;

  try {
    // check role
    const { role } = await User.findOne({ username }).select("role");

    if(role === 1){
      
      let msg = await User.register(registerInfo.username, registerInfo.name,
        registerInfo.password, registerInfo.role);

      res.status(200).json({ msg: msg });
    } else {
      res.status(401).json({error: "Unauthorized Access"});
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login controller
const loginUser = async (req, res) => {
  // get user entry
  const { username, password } = req.body;

  try {
    // send data to Database
    const user = await User.login(username, password);

    // create token
    const token = createToken(user.username);

    // data sent to client
    const userInfo = {
      _id: user._id,
      username: username,
      name: user.name,
      role: user.role,
      token: token,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all user info
const getUserInfo = async (req, res) => {
  const { username } = req.user;

  try {
    // check role
    const { role } = await User.findOne({ username }).select("role");

    if (role === 1) {
      // send all user info
      const userInfo = await User.find();

      delete userInfo['password'];

      res.status(200).json(userInfo);
    } else {
      res.status(401).json({ error: "Authorization Level Not High Enough" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get warehouse staff
const getWarehouseStaff = async (req, res) => {
  const {username} = req.user;

  try {
    const { role } = await User.findOne({ username }).select("role");

    if(role === 1) {
      // send warehouse staff names
      const names = await User.find({ role: 2}).select("username");
      
      res.status(200).json(names);
    } else {
      res.status(401).json({ msg: "Authorization Level Not High Enough" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  getWarehouseStaff,
};
