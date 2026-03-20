const User = require("../../models/user.model");

/*
 REGISTER USER
*/
exports.registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Validate required fields
    if (!fullname?.firstname || !email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (fullname.firstname, username, email, password)"
      });
    }

    // Check duplicate email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? "Email already registered"
          : "Username already taken"
      });
    }

    // Password hashing handled by model pre-save hook
    const user = await User.create({
      fullname,
      username,
      email,
      password
    });

    const token = user.generateAccessToken();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    // Handle mongoose validation errors clearly
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message
    });
  }
};


/*
 LOGIN USER
*/
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Must select +password since it's hidden by default in model
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = user.generateAccessToken();

    // Set cookie for browser clients
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in prod, false in dev
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day in ms
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};


/*
 GET USER PROFILE
*/
exports.getProfile = async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    return res.status(200).json({
      success: true,
      user: req.user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
      error: error.message
    });
  }
};