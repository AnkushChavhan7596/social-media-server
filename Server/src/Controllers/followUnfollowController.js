const jwt = require("jsonwebtoken");
const userModel = require("../../src/models/userModel");

module.exports.follow_unfollow = async (req, res) => {
  if (req.body.token) {

    try {

      const id = req.body.id; // user to follow-unfollow
      console.log(id);

      // get the current active user
      const verifyUser = jwt.verify(req.body.token, process.env.SECRET_KEY);
      console.log(verifyUser)

      if (verifyUser && id) {

        const userToFollowUnfollow = await userModel.findById(id);

        const currentUser = await userModel.findById(verifyUser._id);

        if (userToFollowUnfollow && currentUser) {
          if (userToFollowUnfollow._id !== currentUser._id) {
            if (!userToFollowUnfollow.followers.includes(currentUser._id)) { // follow

              console.log("user followed")
              await userModel.updateOne({ _id: userToFollowUnfollow._id }, { $push: { followers: currentUser._id } });
              await userModel.updateOne({ _id: currentUser._id }, { $push: { followings: userToFollowUnfollow._id } });
              res.status(200).json({ msg: "User followed Successfully", followedYourSelf: false, follow : true, unfollow: false });

            }
            else { // unfollow
              console.log("User unfollowed")

              await userModel.updateOne({ _id: userToFollowUnfollow._id }, { $pull: { followers: currentUser._id } });
              await userModel.updateOne({ _id: currentUser._id }, { $pull: { followings: userToFollowUnfollow._id } });
              res.status(200).json({ msg: "User unFollowed Successfully", followedYourSelf: false, follow : false, unfollow : true });
            }

          }
          else {
            res.json({ msg: "You can't follow yourself", followedYourSelf: true });
          }

        } else {
          res.json({ msg: "Users not found, something wents wrong" });
        }

      }


    } catch (error) {
      console.log(error.message);
      res.json({ msg: error.message, followedYourSelf: false });
    }

  }
  else{
    res.json({msg : "Token not found"});
  }

}