const mongoose = require("mongoose");

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
   
  module.exports = Comment