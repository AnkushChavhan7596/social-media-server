const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment : {
        type : String,
        required : true
    },
    authorID : {
        type : String,
        required : true
    },
    postID : {
        type : String,
        required : true
    }
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;