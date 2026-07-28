import { formateRelativeTime } from "../utils/formatRelativeTime";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeletePostMutation,
  useGetOnePostQuery,
} from "../redux-toolkit/features/posts/postsApiSlice";
import { useSelector } from "react-redux";

const PostComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deletePost, { isLoading: deletePostLoading }] =
    useDeletePostMutation();

  const deleting = async () => {
    try {
      await deletePost(id).unwrap();
      alert("The post has been Deleted");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const updatePost = () => {
    navigate(`/posts/update-post/${id}`);
  };

  const {
    data: getPost,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetOnePostQuery(id);

  const currentUserId = useSelector((state) => state?.auth?.user?.id);
  //   console.log("this is the id from the auth slice" , currentUserId)
  const postAuthor = getPost?.author?._id;
  //   console.log("this is the id of the post's author " , postAuthor)

  const isPostOwner = currentUserId === postAuthor;

  console.log(getPost);
  if (isLoading) {
    return <p>Loading...</p>;
  } else if (isError) {
    return (
      <div>
        <p>{error?.data?.message || "Server is down ! Please try again."}</p>
      </div>
    );
  }
  return (
    <div>
      {isSuccess && getPost && (
        <div className="flex flex-col items-center ">
          <div className="flex flex-col gap-5 items-center ">
            <p className="text-sm text-(--primary-color) font-bold">
              Published on {formateRelativeTime(getPost.createdAt)}
            </p>
            <h1 className=" font-bold sm:text-2xl md:text-3xl lg:text-5xl text-center  wrap-break-word mx-auto">
              {getPost.title}
            </h1>
            <p className="border rounded-2xl py-2 px-2 cursor-pointer text-(--primary-color) border-(--primary-color)  ">
              {getPost.author.first_name} {getPost.author.last_name}
            </p>
          </div>
          <div className="w-full md:w-[60%] rounded-lg">
            <img
              className="my-10 rounded-lg w-full object-cover mx-auto "
              src={getPost.postPhoto}
              alt="Post Photo"
            />
          </div>
          <div className="whitespace-pre-line wrap-break-word text-gray-800 leading-relaxed max-w-[80%] text-center">
            {getPost.content}
          </div>
          {isPostOwner && (
            <div className="flex flex-col md:flex-row gap-3 justify-center my-10">
              <button
                onClick={deleting}
                className="bg-red-500 text-white rounded-md py-2 px-3 cursor-pointer hover:bg-red-600/85 duration-200 transition-colors "
              >
                {deletePostLoading ? "Deleting the Post" : "Delete Post"}
              </button>
              <button
                onClick={updatePost}
                className="bg-green-500 text-black rounded-md py-2 px-3 cursor-pointer hover:bg-green-600/85 duration-200 transition-colors "
              >
                Update Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostComponent;
