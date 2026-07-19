const AppError = require("../utils/AppEroor");
const User = require("../models/userSchema");

const verifyEmail = async (req, res) => {
  const verificationToken = req.query.token;
  if (!verificationToken) throw new AppError("token required", 400);
  const user = await User.findOne({ verificationToken });
  if (!user) throw new AppError("invalid token !", 400);
  if (user.verificationTokenExpiry < new Date())
    throw new AppError("token expired", 400);

  // Modify the document directly
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpiry = null;
  
  await user.save();
  res
    .status(200)
    .json({ success: true, message: "email verfied successfully" });
};

module.exports = verifyEmail;
