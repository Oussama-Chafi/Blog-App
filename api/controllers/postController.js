const AppError = require("../utils/AppEroor");
const Post = require("../models/postSchema");
const uploadPhoto = require("../middlewares/uploadPhoto");

const createPost = async (req, res) => {
  const { title, content, postPhoto, imagePublicId } = req.body;
  console.log(req.body);
  if (!title || !content || !postPhoto) {
    throw new AppError("Title and Content and Post Photo is required !", 400);
  }

  const blog = await Post.create({
    title,
    content,
    postPhoto,
    imagePublicId,
    author: req.user.id,
  });

  const populatedBlog = await blog.populate(
    "author",
    "first_name last_name _id",
  );

  res.status(200).json({
    success: true,
    message: "the post has been created ",
    data: populatedBlog,
  });
};

const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";
  const allPosts = await Post.find({
    title: {
      $regex: search,
      $options: "i",
    },
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "first_name avatar _id ")
    .exec();
  if (!allPosts.length) {
    res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json({ success: true, data: allPosts });
};
const getMyPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const myPosts = await Post.find({
    author: req.user.id,

    title: {
      $regex: search,
      $options: "i",
    },
  })
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "first_name last_name avatar _id")
    .exec();
  if (!myPosts.length) {
    res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json({ success: true, data: myPosts });
};

const getPost = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("id is required", 400);
  }
  const post = await Post.findById(id)
    .populate("author", "first_name last_name avatar _id")
    .select("title content createdAt postPhoto")
    .exec();
  if (!post) {
    throw new AppError("this id is not correct", 400);
  }
  res.status(200).json({ success: true, data: post });
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body || req.body.finalUpdateData;
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("this post is not exist", 404);
  }
  if (req.user.id !== post.author.toString()) {
    throw new AppError("you can not update this Post", 403);
  }
  const newUpdate = await Post.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
  });
  res.status(200).json({ success: true, data: newUpdate });
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new AppError("this post is not exist", 404);
  }
  if (req.user.id !== post.author.toString()) {
    throw new AppError("you can not remove this post ", 403);
  }
  await Post.findByIdAndDelete(id);

  res.status(204).json({ success: true });
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPost,
  updatePost,
  deletePost,
};
