const express = require("express");
const router = express.Router();
const Photo = require("../db/photoModel");

router.post("/commentsOfPhoto/:photo_id", async (req, res) => {
  try {
    const photoId = req.params.photo_id;
    const commentText = req.body.comment;

    if (!commentText || commentText.trim() === "") {
      return res.status(400).send("Comment cannot be empty");
    }

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(400).send("Photo not found");
    }

    const newComment = {
      comment: commentText,
      user_id: req.session.user._id,
      date_time: new Date(),
    };

    photo.comments.push(newComment);
    await photo.save();

    res.json(photo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
