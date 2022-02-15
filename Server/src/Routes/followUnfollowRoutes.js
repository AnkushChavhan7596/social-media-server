
const { Router } = require("express");
const followUnfollowController = require("../Controllers/followUnfollowController");

const router = Router();

router.post("/follow-unfollow", followUnfollowController.follow_unfollow);

module.exports = router;