const AppError = require("../utils/AppEroor");
const crypto = require("crypto");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const token = req.query.token;
  const { newPassword } = req.body;

  if (!token) {
    throw new AppError("the token is required !", 400);
  }
  const hashCrypto = crypto.createHash("sha256").update(token).digest("hex");

  const findUser = await User.findOne({ resetToken: hashCrypto });
  if (!findUser) {
    throw new AppError("this account is not exist anymore or the token is not true", 400);
  }
  if (findUser.resetTokenExpiry < Date.now()) {
    throw new AppError("this token has expired !", 403);
  }
  if (!newPassword) {
    throw new AppError("the new password is required !", 400);
  }
  const hashNewPasswrod = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(findUser._id, {
    password: hashNewPasswrod,
    resetToken: null,
    resetTokenExpiry: null,
  });
  res.json({ success: true, message: "the password has changed " });
};

module.exports = resetPassword;
