
const mongoose = require("mongoose") ;

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

  module.exports = Post