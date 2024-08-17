const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json()); // this middleware now allow express to read the request boady
// this middleware actually decodes the req body into a javascript object
// after decoding now request.body is javascript object and after that req goes to route handler and than after req.body is send to the database
// express does not know how to read a json data comeing in the req.body and this express.json() knows how to read req.body json and convert into an object so we can send to to database from route handler.
const connectDb = function () {
  return mongoose.connect("mongodb://127.0.0.1:27017/testing");
};

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    gender: { type: String, required: true, default: "Male" },
    age: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const User = mongoose.model("user", userSchema);

const tagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Tag = mongoose.model("tag", tagSchema);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user_id: {
      // a user can have many post but one post created by one user it means here one to many relationsip shows and user is parent because user is indipendent because for creating a user we dont need a post but for createing a post we need the user so post is child
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tag_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "tag", required: true },
    ],
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

const Post = mongoose.model("post", postSchema);

const commentSchema = mongoose.Schema(
  {
    reply: { type: String, required: true },
    post_id: {
      type: mongoose.Schema.Types.ObjectId, //  we are telling mongoose that this post id going to be of type ObjectId
      ref: "post", // but which collection is this objectId pointing or refr to
      required: true,
    },
    // the relationship between post and comment is one to
    //many means one post have many comment and one commnet
    //bellong to only one post but one post have many commnet
    // means one comment shows relation with only one post not
    //other have same comment but one post have many comment
    // it means post is parent and comment is child and comment need post but does not need comment
    // so post is indipendent and comment is dependent
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
const Comment = mongoose.model("comment", commentSchema);

// REST API CRUD for user

// post/users => create a user
// get/users => get all users
// get/user/:id => get a single user
// patch/users/:id => update a single user
// delete/users/:id => delete a single user

app.post("/users", async (req, res) => {
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

app.get("/users", async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    return res.status(201).send(users);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
});

app.get("/users/:id", async (req, res) => {
  // id is taking as params value in url
  try {
    const user = await User.findById(req.params.id).lean().exec();
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.patch("/users/:id", async (req, res) => {
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

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

// REST API CRUD for tag

app.post("/tags", async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    return res.status(201).send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find().lean().exec();
    return res.status(201).send(tags);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id).lean().exec();
    return res.status(201).send(tag);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    return res.status(201).send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.delete("/tags/:id", async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(201).send(tag);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//// POST Crud

app.post("/posts", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    return res.status(201).send(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/posts", async (req, res) => {
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

app.get("/posts/:id", async (req, res) => {
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

app.patch("/posts/:id", async (req, res) => {
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

app.delete("/posts/:id", async (req, res) => {
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

//// Coment Crud

app.post("/coments", async (req, res) => {
  try {
    const comment = await Comment.create(req.body);
    return res.status(201).send(comment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/coments", async (req, res) => {
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

app.get("/coments/:id", async (req, res) => {
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

app.patch("/coments/:id", async (req, res) => {
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

app.delete("/coments/:id", async (req, res) => {
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

app.listen(2345, async () => {
  try {
    await connectDb();
    console.log("listening on port 2345");
  } catch (err) {
    console.log(err.message);
  }
});
