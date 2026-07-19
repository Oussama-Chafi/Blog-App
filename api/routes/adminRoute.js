const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyJWT, authorize } = require("../middlewares/verifyJWT");

router.get("/", verifyJWT, authorize("admin"), adminController);

module.exports = router;
