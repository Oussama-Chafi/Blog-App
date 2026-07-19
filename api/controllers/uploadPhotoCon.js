const { uploadToCloudinary } = require("../middlewares/uploadPhoto");
const AppError = require("../utils/AppEroor");
const User = require("../models/userSchema");
const Post = require("../models/postSchema");

const uploadAvatarController = async (req, res, next) => {
  try {
    const photo = req.file;
    if (!photo) throw new AppError("Please add the Photo", 400);
    const result = await uploadToCloudinary(photo, "avatars");
    const url = result.secure_url;
    await User.findByIdAndUpdate(req.user.id, { avatar: url });
    res.status(200).json({ success: true, url });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const uploadPostPhoto = async (req, res, next) => {
  try {
    const photo = req.file;
    if (!photo) throw new AppError("please add the post photo", 401);
    const result = await uploadToCloudinary(photo, "Photos");
    const url = result.secure_url;
    res.status(200).json({ success: true, photoUrl: url });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  uploadAvatarController,
  uploadPostPhoto,
};
