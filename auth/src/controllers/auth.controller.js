const userModel = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../db/redis");

async function registerController(req, res) {
  try {
    const {
      username,
      fullName: { firstName, lastName },
      role,
      email,
      password,
    } = req.body;

    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      username,
      fullName: { firstName, lastName },
      role: role || "user",
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role || "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role || "user",
    };

    res
      .status(201)
      .json({ message: "User registered successfully", user: userResponse });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function loginController(req, res) {
  try {
    const { username, email, password } = req.body;
    // find by username or email
    const user = await userModel
      .findOne({
        $or: [{ email }, { password }],
      })
      .select(" +password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getCurrentUser(req, res) {
  const user = req.user;
  res.status(201).json({
    message: "Current user fetched success",
    user: user,
  });
}

async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await redis.set(`blacklist: ${token}`, "true", "EX", 24 * 60 * 60);
  }
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({ message: "Logged out success" });
}

async function getUserAddress(req, res) {
  const id = req.user.id;

  const user = await userModel.findById(id).select("addresses");

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    message: " User addresses fetched success ",
    addresses: user.addresses,
  });
}

async function addUserAddress(req, res) {
  const id = req.user.id;
  const { street, city, state, pincode, country, isDefault } = req.body;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        addresses: {
          street,
          city,
          state,
          pincode,
          country,
          isDefault,
        },
      },
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  return res.status(201).json({
    message: "Address added success",
    address: user.addresses[user.addresses.length - 1],
  });
}

async function deleteUserAddress(req, res) {
  const id = req.user.id;
  const addressId = req.params.addressId;
  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        addresses: { _id: addressId },
      },
    },
    { new: true }
  );
}

module.exports = {
  registerController,
  loginController,
  getCurrentUser,
  logoutUserController,
  getUserAddress,
  addUserAddress,  
  deleteUserAddress,
};
