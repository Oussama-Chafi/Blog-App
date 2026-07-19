const AppError = require("../utils/AppEroor");
const User = require("../models/userSchema");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("email is required !", 400);
  }
  const getUser = await User.findOne({ email });
  if (!getUser) {
    throw new AppError("this account is not Exist" , 400);
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashCrypto = crypto.createHash("sha256").update(resetToken).digest("hex");


  const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

  await User.findByIdAndUpdate(getUser._id, {
    resetToken : hashCrypto,
    resetTokenExpiry: Date.now() + 5 * 60 * 1000,
  });
  await sendEmail(
    email,
    "RESET THE PASSWORD",
    `
        <a href = "${resetUrl}">Click here to reset the password</a>
    `,
  );
  res.json({success : true , message : "we have send to your email a link to change your password ! "})
};

module.exports = forgetPassword;
