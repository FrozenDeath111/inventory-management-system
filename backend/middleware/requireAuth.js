const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const requireAuth = async (req, res, next) => {
  // verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // split from Bearer
  const token = authorization.split(" ")[1];

  try {
    // verify token
    const { username } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ username }).select("username");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized Request" });
  }
};

module.exports = requireAuth;
