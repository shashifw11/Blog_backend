const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
      const comment = await Comment.create(req.body);
      return res.status(201).send(comment);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      // const posts = await Post.find().lean().exec();  // here we get the userId and tagIds but we do not want Id we want that id data like user_id actual user data and tag_id actual tags document
      const comments = await Comment.find()
        .populate({ path: "post_id", select: { title: 1, content: 1 } })
        .lean()
        .exec();
      return res.status(201).send(comments);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id)
        .populate({ path: "post_id", select: { title: 1, content: 1 } })
        .lean()
        .exec();
      return res.status(201).send(comment);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  router.patch("/:id", async (req, res) => {
    try {
      const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .populate({ path: "post_id", select: { title: 1, content: 1 } })
        .lean()
        .exec();
  
      return res.status(201).send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.id)
        .populate({ path: "post_id", select: { title: 1, content: 1 } })
        .lean()
        .exec();
      return res.status(201).send(comment);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
   
 module.exports = router;



 