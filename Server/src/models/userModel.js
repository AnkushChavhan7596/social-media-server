
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String, 
        required : true
    }, 
    username :{
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    mobile : {
        type : String,
        required : false,
        default : 1234567890
    },
    password :{
        type : String,
        required : true
    },

    followings : [String],

    followers :  [String],

    profileImg : {
         type : String,
         default : "",
         required : false
    },
    timestamp: { type: Date, default: Date.now},
});

const User = mongoose.model("user", userSchema);

module.exports = User;