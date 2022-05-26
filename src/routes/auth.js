const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../functions/generateToken");
const { validateSignup } = require("../middleware/validate");
const authorize = require("../middleware/authorize");

router.post("/signup", validateSignup, async (req, res) => {
  const existingEmail = await User.findOne({ email: req.body.email });
  const existingUsername = await User.findOne({ username: req.body.username });

  if (existingEmail)
    return res.status(409).send({ error: "Email already in use." });
  if (existingUsername)
    return res.status(409).send({ error: "Username already in use." });

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let newUser;
    const dobTimestamp = new Date(`${req.body.birthdate}`);

    newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      birthdate: dobTimestamp / 1000,
    });

    const newAccessToken = generateAccessToken(newUser._id);
    const newRefreshToken = generateRefreshToken(newUser._id);

    newUser.rftkn.token = newRefreshToken;
    newUser.rftkn.iat = Math.floor(Date.now() / 1000);

    await newUser.save();

    res.set("actkn", newAccessToken);
    res.set("rftkn", newRefreshToken);
    res.status(201).send({ user: newUser });
  } catch (error) {
    res.status(400).send({ error: error.message, stack: error.stack });
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(401).send({ error: "Email not found." });

  const validPassword = bcrypt.compareSync(req.body.password, user.password);

  if (!validPassword)
    return res.status(401).send({ error: "Invalid password." });

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.rftkn.token = newRefreshToken;

  await user.save();

  res.set("actkn", newAccessToken);
  res.set("rftkn", newRefreshToken);
  res.status(200).send({ user: user });
});

router.post("/logout", authorize, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) return res.status(401).send({ error: "User not found." });

  user.rftkn.token = null;
  user.rftkn.iat = null;

  await user.save();

  res.removeHeader("actkn");
  res.removeHeader("rftkn");
  res.status(200).send({ message: "Logged out." });
});

router.get("/test", authorize, async (req, res) => {
  const test = await User.findById(req.user.id);
  res.send({ test: test });
});

module.exports = router;
