const { Router } = require("express");
const commentController = require("../Controllers/commentsController");

const router = Router();

// router.get("/comments/:id", commentController.get_comment);

router.post("/comment/post", commentController.comment_post);

router.get("/comments/get", commentController.get_comments);

router.post("/comment/delete/:id", commentController.delete_comment);

module.exports = router;