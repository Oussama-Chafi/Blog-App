import { useNavigate, useParams } from "react-router-dom";
import { useAddCommentMutation } from "../redux-toolkit/features/commentApiSlice/commentsApiSlice";
import { useState } from "react";

const AddCommentComponent = () => {
  const [comment, setComment] = useState({
    content: "",
  });
  const [addComment, { isLoading, isError, error }] = useAddCommentMutation();
  const navigate = useNavigate();
  const { id } = useParams();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({
        content: comment.content,
        id,
      }).unwrap();
      setComment({
        content: "",
      });
      alert("the comment has added");
      navigate(`/posts/get/${id}`);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-10 ">
      <h3 className="font-bold text-2xl mb-5">Add your Comment</h3>
      <form onSubmit={handelSubmit}>
        <fieldset>
          <textarea
            className="border border-gray-500/65 h-40 w-full md:w-100 rounded-md py-3 px-5 "
            type="text"
            placeholder="Add Comment"
            value={comment.content}
            onChange={(e) => setComment({ content: e.target.value })}
          />
        </fieldset>
        <button
          className={`bg-(--primary-color) py-3 px-6 text-white cursor-pointer hover:bg-(--primary-color)/90 rounded-md`}
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? " Submiting... " : "Submit"}
        </button>
      </form>
      {isError && <p>{error?.data?.message}</p>}
    </div>
  )
}

export default AddCommentComponent



