const {
  uploadToCloudinary,
  removeFromCloudinary,
} = require("../middlewares/uploadPhoto");
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
    const publicId = result.public_id;
    res.status(200).json({ success: true, photoUrl: url, publicId });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePostPhoto = async (req, res, next) => {
  const { id } = req.params;
  const newPhoto = req.file;
  if (!id) throw new AppError("The ID is required to get this Post!", 400);

  if (!newPhoto) throw new AppError("Please Add the new Photo", 400);

  const getPost = await Post.findById(id);
  if (!getPost) throw new AppError("There is no Post with this ID", 404);

  if (req.user.id !== getPost.author.toString()) {
    throw new AppError("you cannot update this photo", 403);
  }

  const publicId = getPost.imagePublicId;
  if (!publicId) {
    throw new AppError("this Photo has no ID in our Data Base !", 400);
  }

  await removeFromCloudinary(publicId);

  const result = await uploadToCloudinary(newPhoto, "Photos");
  const imageUrl = result.secure_url;
  const imageId = result.public_id;

  res.status(200).json({
    success: true,
    message: "The Photo has been Updating!",
    imageUrl,
    imageId,
  });
};

module.exports = {
  uploadAvatarController,
  uploadPostPhoto,
  updatePostPhoto,
};
