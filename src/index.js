const express = require("express");
const connect = require("./configs/db")

const userController = require("./controllers/user.controller") 
const tagController = require("./controllers/tag.controller");
const commentController = require("./controllers/comment.controller");
const postController = require("./controllers/post.controller");

const app = express();

app.use(express.json()); // this middleware now allow express to read the request boady
// this middleware actually decodes the req body into a javascript object
// after decoding now request.body is javascript object and after that req goes to route handler and than after req.body is send to the database
// express does not know how to read a json data comeing in the req.body and this express.json() knows how to read req.body json and convert into an object so we can send to to database from route handler.
// const connect = function () {
//   return mongoose.connect("mongodb://127.0.0.1:27017/testing");
// };




// here we import all the user route handlers
// but how i know to use this route handler when request first comes on index.js file how it find that request should go to user controller file or another file
app.use("/users" , userController)
app.use("/tags", tagController)
app.use("/comments",commentController)
app.use("/posts",postController)
// when i import that route handler inside.js so we have to tell express explicetly wheneever the routs start with /user than you need to go inside the userController file and find the correct route handler


module.exports = app ;



