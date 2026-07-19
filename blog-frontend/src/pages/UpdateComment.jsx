import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useUpdateCommentMutation } from "../redux-toolkit/features/commentApiSlice/commentsApiSlice";

const UpdateComment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { commentId } = useParams();
  const location = useLocation();
  const [updateComment, { isLoading, isError, error }] =
    useUpdateCommentMutation();
  const commentFromState = location.state?.commentCurrent;
  console.log(commentFromState);
  const [commentInput, setcommentInput] = useState({
    newUpdating: commentFromState || "",
  });
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateComment({
        content: commentInput.newUpdating,
        id,
        commentId,
      }).unwrap();
      alert(data?.message || "The Comment has Updating");
      navigate(`/posts/get/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-auto w-full px-4 md:px-40 my-30">
      <h1 className="font-bold text-2xl  text-shadow-2xs space-x-1">
        Update your post
      </h1>
      <form
        className="mt-20 flex flex-col gap-3 items-start "
        onSubmit={handelSubmit}
      >
        <fieldset className="w-full">
          <textarea
            className="border border-gray-500/55 w-full md:w-md  h-40 py-3 px-3"
            type="text"
            placeholder="Update Comment"
            required
            value={commentInput.newUpdating}
            onChange={(e) => setcommentInput({ newUpdating: e.target.value })}
          />
        </fieldset>
        <button
          className="border border-green-400 bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-700/90 cursor-pointer duration-150 transition-colors"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Updating" : "Update"}
        </button>
      </form>
      {isError && <p className="text-red-600 ">{error?.data?.message}</p>}
    </div>
  );
};

export default UpdateComment;
