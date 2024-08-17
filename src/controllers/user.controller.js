const User = require("../models/user.model")
const express = require("express");
const router = express.Router();
  // now we are not importing very big object like app for doing a simple task 
  // we are importing a object which has only these routing related functionality.

// once the /users route find in index.js file in this file no need to use /users route. insted of using /users route use only "/"
router.post("/", async (req, res) => {
    console.log("req.body", req.body); // shows error validatorError : path first_name is required
    // here the think went wrong is if we look at the request in this
    // request we are using req.body but express by itself is not capable of
    // reading the json body that you sent.
    // for us to makesure that req.body is read from whatever we are sending we need to add a middleware app.use(express.json())
    try {
      const user = await User.create(req.body); // what ever fields we are define in schema and if you pass any addetional fileds mongoose just ignore it and only pass the defined filed.
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const users = await User.find().lean().exec();
      return res.status(201).send(users);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    // id is taking as params value in url
    try {
      const user = await User.findById(req.params.id).lean().exec();
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  router.patch("/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id, // first it find the document
        req.body, // than after update it
        { new: true }
      ) // and return the new updated document.
        .lean()
        .exec();
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id).lean().exec();
      return res.status(201).send(user);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  

  module.exports = router