
const { Router } = require("express");
const router = Router();
const postsController = require("../Controllers/postsController");

router.get("/all-posts", postsController.all_posts);

router.post("/get_post_by_id", postsController.get_post_by_id);

router.post("/post/delete/:id", postsController.post_delete);

router.post("/post-like/:id", postsController.post_like);



module.exports = router;