const AppError = require("../utils/AppEroor");
const Comment = require("../models/commentSchema");

const createComment = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new AppError("enter the comment first", 400);
  }
  const addComment = await Comment.create({
    content,
    author: req.user.id,
    post: req.params.id,
  });

  const populatedComment = await addComment.populate([
    {
      path: "author",
      select: "first_name last_name _id",
    },
    {
      path: "post",
      select: "title -_id",
    },
  ]);

  res.status(200).json({ success: true, comment: populatedComment });
};

const getComment = async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ post: id })
    // .select("-_id")
    .populate("author", "first_name last_name -_id ")
    .populate("post", "title _id");
  if (!comments.length) {
    return res.status(200).json({success : true , data : []})
  }
  res.status(200).json({ success: true, data: comments });
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new AppError("this comment not found ", 400);
  }
  if (req.user.id !== comment.author._id.toString() && req.user.role !== "admin") {
    throw new AppError("not authorized", 403);
  }
  await Comment.findByIdAndDelete(commentId);
  res.status(204).json({ success: true });
};

const getAllComments = async (req, res) => {
  // pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const getComments = await Comment.find({post : req.params.id})
    .sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    .populate("author", "first_name last_name _id");
  if (!getComments) {
    return res.status(200).json({success : true , data : []})
  }
  res.status(200).json({ success: true, data: getComments });
};

const updateComment = async (req, res) => {
  const { commentId } = req.params;
  if(!req.body) throw new AppError("enter first the new Updating !" , 400)
  const newComment = await Comment.findByIdAndUpdate(commentId, req.body, {
    returnDocument: "after",
  });
  res.status(200).json({ success: true, comment: newComment });
};

module.exports = {
  createComment,
  getComment,
  deleteComment,
  getAllComments,
  updateComment,
};
