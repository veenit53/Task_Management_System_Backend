const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
      },
      lastname: {
        type: String,
        trim: true,
        minlength: 2,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔐 HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 CHECK PASSWORD
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔥 GENERATE ACCESS TOKEN
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// 🔄 REFRESH TOKEN
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;