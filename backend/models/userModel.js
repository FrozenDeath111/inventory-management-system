const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, database: "inv-management-sys", collection: "user" }
);

// static register model
userSchema.statics.register = async function (username, name, password, role) {
  // validate
  if (!username || !name || !password || !role) {
    throw Error("One or more entry is missing. Please input all fields.");
  }

  if (username.length < 5) {
    throw Error("Username can not be less than 5 letters");
  }

  if (password.length < 8) {
    throw Error("Password can not be less than 8 letters");
  }

  const userExists = await this.findOne({ username });

  if (userExists) {
    throw Error("User exist. Username must be unique.");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  try {
    await this.create({ username, name, password: hash, role });
    return "Database Entry Successful";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

//static login model
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("One or more entry is missing. Please input all fields.");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Username does not exist");
  }

  const passwordValidation = await bcrypt.compare(password, user.password);

  if (!passwordValidation) {
    throw Error("Incorrect Password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
