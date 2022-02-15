const express = require("express");
const app = express();
require('dotenv').config()
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const port = process.env.PORT || 8000;
const jwt = require("jsonwebtoken")



//////////////////////////// database ///////////////////////////
require("./src/db/database");



/////////////////////////// models //////////////////////////////
const userModel = require("./src/models/userModel");
const postModel = require("./src/models/postModel");
const commentModel = require("./src/models/commentModel");

/////////////////////////// middlewares /////////////////////////
const image_destination = path.join(__dirname, "./Frontend/social_media/public");

app.use(cors());
app.use(express.urlencoded({ extended : false }));
app.use(express.json());
app.use("/public", express.static("public"));

//================ post image part ====================

const storage = multer.diskStorage({
    destination : (req, file, callback) => {
        callback(null, "./public/Images");
    },
    filename : (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage : storage });


/////////////////////////// routes /////////////////////////////
app.use(require("./src/Routes/authenticationRoute"));
app.use(require("./src/Routes/postsRoutes"));
app.use(require("./src/Routes/commentsRoutes"));
app.use(require("./src/Routes/followUnfollowRoutes"));



app.post("/post/upload", upload.single("postImage") , async (req, res)=>{
    // get user
    const verifToken = jwt.verify(req.body.token, process.env.SECRET_KEY);

    const getUser = await userModel.findById(verifToken._id);

    if(getUser){

        const newPost = new postModel({
            title : req.body.title,
            description : req.body.description,
            authorName : getUser.name,
            authorID : getUser.id,
            postImage : req.file.originalname
        });
    
        const savePost = await newPost.save();
    
        if(savePost){
          
            res.status(200).json({msg : "Post created Successfully"});
        }
        else{
            res.json({msg : "Post not created , Something wents wrong"});
        }
    }
})

// ====================== profile pic update =======================

app.post("/post/update/profile-pic", upload.single("profileImg"), async (req, res)=>{
    try{
    // token
    const token = req.body.token;

    // verifyToken
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    if(verifyToken){
        
        const updateUser = await userModel.findByIdAndUpdate(verifyToken._id, {
            profileImg : req.file.originalname
        })  

        const saveUser = await updateUser.save();

        if(saveUser){
            res.status(200).json({msg : "Profile updated successfully"});
            console.log("Profile updated successfully");
        }
        else{
            res.json({msg : "Profile not updated, Something wents wrong"});
        }
        
    }
    else{
        res.json({msg : "User is not Genuine"});
    }


    }catch(error){
        res.json({msg : error});
        console.log(error);
    }
})



// =========================== update post =======================
app.post("/post/update/:id", upload.single("postImage") , async (req, res)=>{
    // get user
       
        const updatePost = await postModel.findByIdAndUpdate(req.params.id, {
            title : req.body.title,
            description : req.body.description,
            postImage : req.file.originalname
        });
    
        const savePost = await updatePost.save();
    
        if(savePost){
          
            res.status(200).json({msg : "Post created Successfully"});
        }
        else{
            res.json({msg : "Post not created , Something wents wrong"});
        }
})



app.listen(port, ()=>{
    console.log("Server is listening on the port http://localhost:8000");
})