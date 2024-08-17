const Post = require("../models/post.model");
const express = require("express");
const crudController = require("./crud.controller");
 const router = express.Router();


 router.post("/", async (req, res) => {
    try {
      const post = await Post.create(req.body);
      return res.status(201).send(post);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  

  router.get("/", async (req, res) => {
    try {
      // const posts = await Post.find().lean().exec();  // here we get the userId and tagIds but we do not want Id we want that id data like user_id actual user data and tag_id actual tags document
      const posts = await Post.find()
        .populate("user_id") // it will give the value of that id
        .populate({ path: "tag_ids", select: { name: 1 } }) // it will give only id selected filed here selected filed is name only , here 1 is true and 0 false
        .lean()
        .exec();
      return res.status(201).send(posts);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });


  router.get("/:id", async (req, res) => {
    // this id is post id which i get from time of creating the post
    try {
      const post = await Post.findById(req.params.id)
        .populate({ path: "user_id", select: { email: 1 } }) // this user_id is user_id that i get when user is created
        .populate({ path: "tag_ids", select: { name: 1 } }) //  this tag_ids is tag_id that i get when user is created
        .select({ title: 1, content: 1 }) // if you want to select field from the main model than use select and also hide some field from document to use select and put 0 or 1 for remove or select the field
        .lean()
        .exec();
      return res.status(201).send(post);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // router.get("/:id",crudController(Post,{ path: "user_id", select: { email: 1 } }).get) // using crudController for populate data
  
  router.patch("/:id", async (req, res) => {
    try {
      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .populate({ path: "user_id", select: { email: 1 } })
        .populate({ path: "tag_ids", select: { name: 1 } })
        .lean()
        .exec();
  
      return res.status(201).send(post);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.id)
        .populate({ path: "user_id", select: { email: 1 } })
        .populate({ path: "tag_ids", select: { name: 1 } })
        .lean()
        .exec();
      return res.status(201).send(post);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });

  module.exports = router