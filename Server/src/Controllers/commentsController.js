const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const jwt = require("jsonwebtoken");

// get comment
// module.exports.get_comment = async (req, res) => {
//     try{
//         console.log(req.params.id);
//         console.log("Hello world from comments");

//     }catch(error){
//         res.json({msg : error});
//     }
// }


////////////////////////////////////
/////////// comment post
module.exports.comment_post = async (req, res) =>{
    try{
        const comment = req.body.comment;
        const postID = req.body.postID;

        if(req.body.token){
            const verifyToken = jwt.verify(req.body.token, process.env.SECRET_KEY);

            if(verifyToken){
                const postComment = new commentModel({
                    comment : comment,
                    authorID : verifyToken._id,
                    postID : postID
                });

                if(postComment){
                    const saveComment = await postComment.save();
                    res.status(200).json({msg : "Comment Posted"})
                }
                else{
                    console.log("Something wents wrong");
                    res.json({msg : "Something wents wrong"});
                }
            }
        }

        else{
            console.log("User is not genuine , token not found");
        }
        

    }catch(error){
        console.log(error.message);
    }
}




/////////////////////////////////////////////////////
////////////////// get comments
module.exports.get_comments = async (req, res) =>{
    try{
        const comments = await commentModel.find();
        if(comments){
            res.status(200).json(comments);
        }
        else{
            console.log("Comments not found");
            res.json({msg : "Comments not found"});
        }

    }catch(error){
        console.log(error.message);
    }
}


//////////////////////////////////////////
/////////// delete comment
module.exports.delete_comment = async (req, res) =>{
    try{
        const deleteComment = await commentModel.findByIdAndDelete(req.params.id);

        if(deleteComment){
            res.status(200).json({msg : "comment deleted"});
        }
        else{
            res.json({msg : "Comment not deleted , something wents wrong"});
        }
    }catch(error){
        console.log(error.message);
    }
}