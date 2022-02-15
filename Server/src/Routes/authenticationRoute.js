
const { Router } = require("express");
const router = Router();
const authenticationController = require("../Controllers/authenticationRouteController");

router.get("/login", authenticationController.get_login);
router.post("/login", authenticationController.post_login);
router.get("/register", authenticationController.get_register);
router.post("/register", authenticationController.post_register);
router.post("/edit-profile", authenticationController.edit_profile);
router.post("/check_user", authenticationController.check_user);
router.post("/get_active_user_by_token", authenticationController.get_active_user_by_token);
router.post("/get_user_by_id/:id", authenticationController.get_user_by_id);
router.get("/users", authenticationController.all_users);

module.exports = router;