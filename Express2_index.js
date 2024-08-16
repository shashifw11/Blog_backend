const express = require("express");
const mongoose = require("mongoose");
const app = express();

// 3 steps

// 1 connect express to mongoDB

const connectDb = function () {
  // this connect function connect your express to mongoDB database
  return mongoose.connect("mongodb://127.0.0.1:27017/testing");
};

// 2 build schema

const userSchema = new mongoose.Schema({
  // according to this mongoose will create thsi collection by self and if already collection is there than match the filed or update the fileds
  first_name: { type: String, required: true }, // if the collection is there than make sure that filed name sould match
  last_name: { type: String, required: false },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true, default: "Male" },
});

// 3 build modal  // modal is nothing but db.users and we directly say User and it is mongoose class

const User = mongoose.model("user", userSchema); // the first argument is name of your collection and user => users

app.get("/users", async (req, res) => {
  // if we are doing any operation with mongod db it will reaturn promise so use async and await
  try {
    const users = await User.find().lean().exec(); // .lean() convert mongoose object into json object and exec() is help mongoose to return proper promise or complete promise
    // if you dont write this .lean().exec() it will not fail // User.find() does not return a proper promise because mongose is not sure after find() you not put anything means you are going to end with find only and nout put any thing after find mongoose not return complete promise
    return res.status(201).send(users);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(2345, async () => {
  try {
    await connectDb(); // this mongoDb return promise so we use async await
    console.log("listening on port 2345");
  } catch (err) {
    console.log(err.message);
  }
});
