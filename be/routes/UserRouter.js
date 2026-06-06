const express = require("express");
const User = require("../db/userModel");
const Photo = require("../db/photoModel");
const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}).select("_id first_name last_name").lean();
    for (let user of users) {
      user.photo_count = await Photo.countDocuments({ user_id: user._id });
      
      const photosWithComments = await Photo.find({ "comments.user_id": user._id }, { comments: 1 }).lean();
      let comment_count = 0;
      photosWithComments.forEach(p => {
        p.comments.forEach(c => {
          if (c.user_id && c.user_id.toString() === user._id.toString()) {
            comment_count++;
          }
        });
      });
      user.comment_count = comment_count;
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/comments/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) return res.status(400).send({ message: "User not found" });
    
    const photosWithComments = await Photo.find({ "comments.user_id": userId }).lean();
    let result = [];
    photosWithComments.forEach(photo => {
      photo.comments.forEach(c => {
        if (c.user_id && c.user_id.toString() === userId.toString()) {
          result.push({
            _id: c._id,
            comment: c.comment,
            date_time: c.date_time,
            photo: {
              _id: photo._id,
              file_name: photo.file_name,
              user_id: photo.user_id
            }
          });
        }
      });
    });
    
    result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
    
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
