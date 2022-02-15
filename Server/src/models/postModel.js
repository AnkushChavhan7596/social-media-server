
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title : {
        type :String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    postImage : {
        type : String,
        required : false
    },
    authorName : {
        type : String,
        required : true
    },
    authorID : {
        type : String,
        requried : true
    },
    
    likes : [String],

    timestamp: { type: Date, default: Date.now},
});

const Post = mongoose.model("post", postSchema);

module.exports = Post;