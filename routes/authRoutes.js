const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, masterPassword } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered ❌" });
    }

    // Hash login password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash master password
    const hashedMaster = await bcrypt.hash(masterPassword, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      masterPassword: hashedMaster,
    });

    await user.save();

    res.json({ message: "User registered successfully ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found ❌" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return res.status(400).json({ message: "Invalid password ❌" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,  // 🔐 better than hardcoding
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;