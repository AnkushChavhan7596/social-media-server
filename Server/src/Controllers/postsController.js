const { findByIdAndUpdate } = require("../models/postModel");
const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

module.exports.all_posts = async (req, res) => {

   const posts = await postModel.find();

   if(posts)
   {
       res.status(200).json(posts)
   }
   else{
       res.json({msg : "Posts not found"});
   }

}



// get post by id
// module.exports.get_post_by_id = async (req, res) =>{
//     const id = req.body.id;
//     const post = await postModel.find();
//     try{
//         console.log(req.params.id);
//         console.log("Hello aditya");
//         // mongoose.Types.ObjectId(req.params.id)

//         console.log(post);

//         if(post){
//             res.status(200).json(post);

//             console.log(`This is the comment post : ${post}`);
//         }
//         else{
//             res.json({msg : "Post not found"});
//         }

//     }catch(error){
//         res.json({msg : "post not found"});
//     }
// }

module.exports.get_post_by_id = async (req, res) =>{
    const id = req.body.id;

    try{
        const post = await postModel.findById(id);
        
        if(post){

            const postUser = await userModel.findById(post.authorID);

            if(postUser){
                res.status(200).json({post : post, user : postUser});
            }
           else{
               console.log("User not found");
           }
           
        }
        else{
            res.status(400).json({error : "post not found"});
        }
       
       
    }catch(error){
        res.status(400).json({error : error.message});
        console.log(error.message);
    }
    
}




////////////////////////////////////////////////
/////////////////// delete the post

module.exports.post_delete = async (req, res) =>{
    try{
          const id = req.params.id;
  
          const deltePost = await postModel.findByIdAndDelete(id);

          if(deltePost){
              res.status(200).json({msg : "Post delted Successfully"});
              console.log("Post deleted successfully");
          }
          else{
              res.json({msg : "Post not deleted"});
          }

    }catch(error){
        res.json({msg : "Post not deleted, Something wents wrong"});
    }
}


///////////////////////////////////////////////////////
/////////// post like

module.exports.post_like = async (req, res) =>{
    try{
        const id = req.params.id; // post liked user id
        const postID = req.body.postID; // post id

        const post = await postModel.findById(postID);
        
        if(!post.likes.includes(id)){
            await postModel.updateOne({ _id : postID },{ $push: { likes : id }});
            res.status(200).json({msg : "The post has been liked ", liked : true});
            console.log("The post has been liked")
        }
        else{
            await postModel.updateOne({ _id : postID },{ $pull: { likes : id }});
            res.status(200).json({msg : "The post has been disliked", liked : false});
            console.log("Post has been disliked")
        }

    }catch(error){
        console.log(error.message);
        res.json({msg : error.message});
    }
}