const User = require("../models/userSchema");
const AppError = require("../utils/AppEroor");
const bcrypt = require("bcrypt");
const { updatePasswordSchema } = require("../validations/authValidation");

const getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password").lean();
  if (!user) throw new AppError("no user found !", 401);
  res.status(200).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const newUpdate = await User.findByIdAndUpdate(
    req.user.id, 
    req.body, {
    new: true,
  })
    .select("-password")
    .lean();
  res.status(200).json({ success: true, data: newUpdate });
};

const deleteAccount = async (req, res) => {
  
  findAccount = await User.findByIdAndDelete(req.user.id);
  res.status(204).json({ success: true });
};

const changePassword = async (req, res) => {
  const { error } = updatePasswordSchema.validate(req.body);
  if (error) throw new AppError(error.details[0].message, 400);
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new AppError("all failds are require !", 400);
  const findUser = await User.findById(req.user.id);
  const checkOldPassword = await bcrypt.compare(oldPassword, findUser.password);
  if (!checkOldPassword)
    throw new AppError("the old password is not correct !", 400);
  const hashNewPassword = await bcrypt.hash(newPassword, 10);
  const newUpdate = await User.findByIdAndUpdate(
    req.user.id,
    { password: hashNewPassword },
    { new: true },
  )
    .select("-password")
    .lean();

  res.status(200).json({
    success: true,
    message: "the password is changed",
  });
};

module.exports = {
  getUser,
  updateUser,
  deleteAccount,
  changePassword,
};
