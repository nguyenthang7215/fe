const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Photo = require("../db/photoModel");

// unique filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },

  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/new", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const photo = new Photo({
      file_name: req.file.filename,
      date_time: new Date(),
      user_id: req.session.user._id,
      comments: [],
    });

    await photo.save();

    res.json(photo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
