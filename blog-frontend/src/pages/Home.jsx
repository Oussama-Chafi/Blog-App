import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetPostQuery } from "../redux-toolkit/features/posts/postsApiSlice";
import { useState } from "react";

const Home = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: allPosts,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetPostQuery({ page, limit, search: searchQuery });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <p className="text-3xl md:text-4xl text-(--content-color)">
          Loading ...
        </p>
      </div>
    );
  } else if (isError) {
    return (
      <div>
        <h3>Sorry something went wrong</h3>
        <p>{error?.data?.message || "Server is Error"}</p>
      </div>
    );
  }

  const handelSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchText);
  };

  return (
    <div className="mx-auto px-4 w-full">
      <div className="flex flex-col items-center gap-5 justify-center mt-20.75">
        <h1 className="max-w-125 font-bold sm:text-2xl md:text-3xl lg:text-5xl text-center w-full mx-auto ">
          Your own <span className="text-(--primary-color)">blogging</span>{" "}
          platform.
        </h1>
        <p className="max-w-155 text-center text-(--content-color) flex flex-wrap wrap-normal px-10 mx-auto ">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your story
          starts right here.
        </p>
      </div>
      <div className=" mt-15 flex justify-center ">
        <div className=" inline-flex items-center  p-2 rounded-sm justify-center border border-(--border-search)/30 w-full md:max-w-md mx-auto ">
          <form
            onSubmit={handelSearchSubmit}
            className=" flex items-center mx-auto gap-6  w-full md:gap-9"
          >
            <input
              value={searchText}
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              type="text"
              className="flex-1 px-1 md:px-5 outline-none border-gray-500"
            />
            <button
              type="submit"
              className="bg-(--primary-color) py-3 px-2  md:px-12 text-white rounded-2xl"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mx-auto px-5 md:px-15 py-10 ">
        {isSuccess &&
          allPosts.length &&
          allPosts.map((element) => (
            <div
              onClick={() => navigate(`/posts/get/${element._id}`)}
              key={element._id}
              className="w-full shadow-md rounded-lg cursor-pointer hover:-translate-y-3 duration-300 transition-transform ease-in-out  border-gray-400 "
            >
              <img
                src={element.postPhoto}
                alt="Post Photo "
                className="aspect-video rounded-md  "
              />
              <div className="my-10 ">
                <h1 className="font-bold  mb-5 max-w-[90%] md:max-w-[80%] text-center mx-auto">
                  {element.title}
                </h1>
                <p className=" w-full md:max-w-[80%] px-3 mb-15 text-center text-gray-600 font-medium mx-auto wrap-break-word">
                  {element.content.slice(0, 80)}...
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
