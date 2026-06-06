const express = require("express");
const router = express.Router();
const User = require("../db/userModel");

router.post("/login", async (req, res) => {
  try {
    const { login_name, password } = req.body;

    const user = await User.findOne({
      login_name,
    });

    if (!user) {
      return res.status(400).send("Login name does not exist");
    }

    if (user.password !== password) {
      return res.status(400).send("Incorrect password");
    }

    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
    };

    res.json({
      _id: user._id,
      first_name: user.first_name,
      login_name: user.login_name,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/logout", (req, res) => {
  if (!req.session.user) {
    return res.status(400).send("No user is logged in");
  }
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Logout failed");
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
