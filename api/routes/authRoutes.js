const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyEmail = require("../controllers/verifyEmail");
const forgetPassword = require("../controllers/forgetPassController");
const resetPassword = require("../controllers/resetPassController");

router.route("/register").post(authController.register);
router.route("/verify-email").get(verifyEmail);
router.route("/login").post(authController.login);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);

module.exports = router;
