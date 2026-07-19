const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { verifyJWT } = require("../middlewares/verifyJWT");
const commentController = require("../controllers/commentController")

router.route("/add").post(verifyJWT, postController.createPost);
router.route("/all-posts").get(verifyJWT , postController.getAllPosts);
router.route("/my-posts").get(verifyJWT , postController.getMyPosts);
router.route("/get/:id").get(verifyJWT , postController.getPost);
router.route("/update/:id").post(verifyJWT , postController.updatePost);
router.route("/delete/:id").post(verifyJWT , postController.deletePost);
// comment routes 
router.route("/:id/add-comment").post(verifyJWT ,commentController.createComment );
router.route("/:id/get-comment").get(verifyJWT , commentController.getComment);
router.route("/:id/all-comments").get(verifyJWT , commentController.getAllComments);
router.route("/:id/delete-comment/:commentId").post(verifyJWT , commentController.deleteComment);
router.route("/:id/update-comment/:commentId").post(verifyJWT , commentController.updateComment);


module.exports = router;
