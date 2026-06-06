const express = require("express");
const router = express.Router();
const User = require("../db/userModel");

router.post("/user", async (req, res) => {
  try {
    const {
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    } = req.body;

    if (!login_name || !password || !first_name || !last_name) {
      return res.status(400).send("Required fields are missing");
    }

    const existing = await User.findOne({
      login_name,
    });

    if (existing) {
      return res.status(400).send("Login name already exists");
    }

    const user = new User({
      login_name,
      password,
      first_name,
      last_name,
      location,
      description,
      occupation,
    });

    await user.save();

    res.json({
      login_name: user.login_name,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
