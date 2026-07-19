const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middlewares/verifyJWT");
const {
  getUser,
  updateUser,
  deleteAccount,
  changePassword,
} = require("../controllers/userController");

router.route("/get-profile").get(verifyJWT, getUser);

router.route("/change-password").patch(verifyJWT, changePassword);

router.route("/update-profile").patch(verifyJWT, updateUser);

router.route("/delete-account").delete(verifyJWT, deleteAccount);

module.exports = router;
