const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    console.log("Signup attempt:", email, password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found");
    return res.status(401).json({ message: "Invalid Creds" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) {
    console.log("Invalid password");
    return res.status(401).json({ message: "Invalid Creds" });
  }

  const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
