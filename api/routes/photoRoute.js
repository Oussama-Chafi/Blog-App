const express = require("express");
const { verifyJWT } = require("../middlewares/verifyJWT");
const { uploader } = require("../middlewares/uploadPhoto");
const uploadPhotoController = require("../controllers/uploadPhotoCon");

const router = express.Router();

router
  .route("/upload-avatar")
  .patch(
    verifyJWT,
    uploader.single("avatar"),
    uploadPhotoController.uploadAvatarController,
  );
router
  .route("/upload-post-photo")
  .post(
    verifyJWT,
    uploader.single("postPhoto"),
    uploadPhotoController.uploadPostPhoto,
  );

router
  .route("/:id/update-post-photo")
  .patch(
    verifyJWT,
    uploader.single("updatePostPhoto"),
    uploadPhotoController.updatePostPhoto,
  );

module.exports = router;
