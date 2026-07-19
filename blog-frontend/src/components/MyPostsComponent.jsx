// import { useSelector } from "react-redux";
import {
  useDeletePostMutation,
  useGetMyPostsQuery,
} from "../redux-toolkit/features/posts/postsApiSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { formateRelativeTime } from "../utils/formatRelativeTime";

const MyPostsComponent = () => {
  // GET THE PAGE AND THE LIMIT FOR PAGINATION FROM QUERY
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  const [textSearchInput, setTextSearchInput] = useState("");
  const [searchIput, setSearchInput] = useState("");
  // const currentUser = useSelector((state) => state.auth.user);
  // const currentUserId = currentUser?.id;

  // CALL THE HOOK QUERY TO CALL API FOR THE FETSHING

  const handelSearchSubmit = (e) => {
    e.preventDefault();
    setSearchInput(textSearchInput);
  };

  const {
    data: myPosts,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetMyPostsQuery({
    // ADD THE PAGE AND LINIT TO SEND THEM TO THE URL
    page,
    limit,
    search: searchIput,
  });

  // LIKE THE FIST FOR CALLING THE API
  const [deletePost, { isLoading: Loading }] = useDeletePostMutation();

  // TO NAVIGATE TO ANOTHER PAGE
  const navigate = useNavigate();

  // GIVING THE ID TO KNOW WHAT WE WANT TO DELETE IT AND IT'S A PROMISE
  const deleting = async (id) => {
    try {
      await deletePost(id).unwrap();
      alert("The post has been Deleted");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <p className="flex mt-50 justify-center font-bold text-2xl">
        Geting your Posts , please wait
      </p>
    );
  }
  if (isError) {
    return <p>{error?.data?.message || "something went wrong"}</p>;
  }

  // console.log(myPosts);
  // console.log(currentUserId);

  if (!myPosts?.length) {
    return (
      <p className="my-10 text-2xl font-bold w-full text-center">
        There is no posts for you has benn Created.{" "}
      </p>
    );
  }

  return (
    <div className="container my-10 mx-auto sm:px-10">
      <div className="border-2 py-3 pl-3 pr-1 border-gray-300 rounded-lg w-full max-w-md mx-auto ">
        <form onSubmit={handelSearchSubmit}>
          <div className="flex gap-2 items-center  ">
            <input
              type="text"
              value={textSearchInput}
              onChange={(e) => setTextSearchInput(e.target.value)}
              className="py-3 px-3 border-none outline-none rounded-md flex-1 min-w-0"
              placeholder="Search Post"
            />
            <button
              className="bg-(--primary-color) rounded-md py-3 px-3 md:px-5 text-white text-sm sm:text-base cursor-pointer "
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {isSuccess && (
        <p className="font-semibold my-3 space-x-1 text-gray-950 px-2 flex items-start max-sm:mx-auto ">
          My Posts : {myPosts.length}
        </p>
      )}
      {isSuccess &&
        myPosts.map((element) => (
          <div
            onClick={() => navigate(`/posts/get/${element._id}`)}
            className=" bg-gray-200 rounded-lg mb-5 px-1 py-4 w-full  max-sm:mx-auto shadow flex flex-col  gap-4 "
            key={element._id}
          >
            <div>
              <div className="flex  items-center justify-between w-full gap-2 px-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/profile");
                  }}
                  className="flex  gap-2 cursor-pointer items-center"
                >
                  <img
                    src={element.author.avatar}
                    className="rounded-full h-10 w-10 object-cover "
                    alt=""
                  />
                  <p className="text-xs sm:text-sm font-bold capitalize">
                    {element.author.first_name} {element.author.last_name}
                  </p>
                </div>
                <p className="text-(--primary-color) text-xs sm:text-sm font-semibold capitalize">
                  {formateRelativeTime(element.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row">
              <div className="flex flex-col md:flex-row gap-3 justify-between mt-3  max-sm:w-full  ">
              <img
                className=" rounded-lg  max-sm:w-full h-40 w-[70%] mx-auto md:h-48 object-cover shadow-sm "
                src={element.postPhoto}
                alt="Post Photo"
              />
            </div>
              <div className="flex-1 px-4 mt-7 mb-5">
                <div>
                  <p className="text-center font-bold space-x-1.5 pb-4 ">
                    {element.title}
                  </p>
                  {element.content}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row   items-center gap-3 ">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`/posts/update-post/${element._id}`);
                  }}
                  className="bg-green-500 text-black rounded-md py-2 px-8 cursor-pointer hover:bg-green-600/85 duration-200 transition-colors "
                >
                  Update Post
                </button>
                <button
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleting(element._id);
                  }}
                  className={`bg-red-500 text-white rounded-md py-2 px-8 cursor-pointer hover:bg-red-600/85 duration-200 transition-colors ${Loading ? "opacity-70" : "opacity-100"}  `}
                >
                  {Loading ? "Deleting" : "Delete Post"}
                </button>
              </div>
            </div>
            
            
          </div>
        ))}
    </div>
  );
};

export default MyPostsComponent;
