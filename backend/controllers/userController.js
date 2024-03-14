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
  // get user entry
  const { username, name, password, role } = req.body;

  console.log(req.body);

  try {
    // send data to Database
    const msg = await User.register(username, name, password, role);

    res.status(200).json({ msg: msg });
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
      const allInfo = await User.find();
      res.status(200).json(allInfo);
    } else {
      res.status(401).json({ error: "Authorization Level Not High Enough" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
};
