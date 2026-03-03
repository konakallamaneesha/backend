const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, masterPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered ❌" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedMaster = await bcrypt.hash(masterPassword, 10);

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
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ IMPORTANT CHANGE HERE
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ================= VERIFY MASTER =================
router.post("/verify-master", auth, async (req, res) => {
  try {
    const { masterPassword } = req.body;

    const user = await User.findById(req.user.id);

    const valid = await bcrypt.compare(
      masterPassword,
      user.masterPassword
    );

    if (!valid) {
      return res.status(400).json({ message: "Invalid master password ❌" });
    }

    res.json({ message: "Master verified ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

module.exports = router;