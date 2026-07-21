import { useNavigate, useParams } from "react-router-dom";
import { formateRelativeTime } from "../utils/formatRelativeTime";
import {
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from "../redux-toolkit/features/commentApiSlice/commentsApiSlice";
import { useSelector } from "react-redux";

const GetComment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.auth?.user);
  const currentUserId = currentUser?.id;

  // console.log(currentUserId)
  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsIsError,
    isSuccess: commentsSuccess,
    error: commentsError,
  } = useGetCommentsQuery(id);

  const [
    deleteComment,
    { isLoading: deleteLoading, isError: deleteIsError, error: deleteError },
  ] = useDeleteCommentMutation();

  const updateCommentHandling = (commentId, comment) => {
    navigate(`/posts/${id}/update-comment/${commentId}`, {
      state: { commentCurrent: comment },
    });
  };

  const handelDelete = async (commentId) => {
    try {
      await deleteComment({ id, commentId }).unwrap();
      alert("the comment has deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className=" mt-10 flex flex-col w-full ">
        {commentsLoading && <p className="text-center mt-20">Loading...</p>}
        {commentsIsError && commentsError && (
          <p>
            {commentsError?.data?.message ||
              "cannot get comments. Please try again !"}
          </p>
        )}
        {commentsSuccess && comments && (
          <div className=" flex flex-col gap-2 w-full   ">
            <p>
              {comments.length
                ? `Comments:(${comments.length})`
                : "There is no Comments for this Post"}
            </p>
            {comments.map((element) => {
              const isOwner = currentUserId === element?.author?._id;
              // console.log(isOwner)
              return (
                <div
                  className=" bg-gray-300/90 py-3 px-3 w-full max-w-md "
                  key={element._id}
                >
                  <div className="flex justify-between items-center px-3 md:5">
                    <p className="font-bold w-fit space-x-0.5 capitalize text-shadow-2xs cursor-pointer">
                      {element.author.first_name} {element.author.last_name}
                    </p>
                    <p className="font-semibold text-(--primary-color) capitalize">
                      {formateRelativeTime(element.createdAt)}
                    </p>
                  </div>
                  <div className="flex justify-between my-3">
                    <p className=" mt-3 max-w-[90%] wrap-break-word">
                      {element.content}
                    </p>
                  </div>
                  <div></div>
                  {isOwner && (
                    <div className="mt-10  flex flex-col md:flex-row  items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          updateCommentHandling(element._id, element.content)
                        }
                        className="bg-green-500 text-black rounded-md py-2 px-3 cursor-pointer hover:bg-green-600/85 duration-200 transition-colors "
                      >
                        Update Comment
                      </button>
                      <button
                        onClick={() => handelDelete(element._id)}
                        className="bg-red-500 text-white rounded-md py-2 px-3 cursor-pointer hover:bg-red-600/85 duration-200 transition-colors "
                      >
                        {deleteLoading ? "Deleting..." : "Delete Comment"}
                      </button>
                      {deleteIsError && deleteError && (
                        <p>
                          {deleteComment?.data?.message ||
                            "Cannot delete this Comment. Please try again !"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetComment;
