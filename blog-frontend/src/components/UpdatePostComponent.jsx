import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetOnePostQuery,
  useUpdatePostMutation,
  useUpdatePostPhotoMutation,
} from "../redux-toolkit/features/posts/postsApiSlice";
import { useEffect } from "react";
import { assets } from "../assets/assets";

const UpdatePostComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isError, isLoading, error } = useGetOnePostQuery(id);

  const [photo, setPhoto] = useState("");
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (post) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewUpdate({
        title: post.title,
        content: post.content,
      });
      setPhoto(post.postPhoto);
    }
  }, [post]);
  {
    isError && error && (
      <p className="font-semibold ">
        {error?.data?.message || "Somthing went wrong! Please try again."}
      </p>
    );
  }
  const [updatePostPhoto, { isLoading: photoUploading, error: photoError }] =
    useUpdatePostPhotoMutation();
  const [updatePost, { isError: iserror, isLoading: isloading, error: Error }] =
    useUpdatePostMutation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      let url = photo;
      let publicId = undefined;

      if (photo instanceof File) {
        const formData = new FormData();
        formData.append("updatePostPhoto", photo);
        const updateResult = await updatePostPhoto({ id, formData }).unwrap();

        url = updateResult.imageUrl;
        publicId = updateResult.imageId;
      }
      const finalUpdateData = {
        ...newUpdate,
        postPhoto: url,
        ...(publicId && { imagePublicId: publicId }),
      };

      await updatePost({ finalUpdateData, id });
      alert("the post has updated");
      navigate(`/posts/get/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const getImagePreview = () => {
    if (!photo) {
      return assets.upload_area;
    }
    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }
    return photo;
  };

  return (
    <form
      onSubmit={handelSubmit}
      className="bg-blue-50/50 text-gray-700 h-screen overflow-scroll"
    >
      <div className="bg-white w-full max-w-2xl p-4 md:p-10  sm:my-10 md:mx-15  shadow rounded">
        <p className="font-semibold capitalize">update thumbnail</p>
        <label htmlFor="img">
          <img
            src={getImagePreview()}
            alt=""
            className={`mt-2 h-16 rounded cursor-pointer ${photoUploading ? "opacity-60" : ""}`}
          />
          <input
            type="file"
            hidden
            id="img"
            onChange={(e) => setPhoto(e.target.files[0])}
          />
        </label>
        {photoError && (
          <p className="my-4 font-sans px-2">
            {photoError?.data?.message ||
              "Something went wrong! Please try again later."}
          </p>
        )}
        <p className="font-semibold capitalize mt-4">title</p>
        <input
          type="text"
          required
          value={newUpdate.title}
          onChange={(e) =>
            setNewUpdate({ ...newUpdate, title: e.target.value })
          }
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
        />
        <p className="font-semibold mt-4 capitalize">blog desctription</p>
        <div className="max-w-lg h-75 pt-3 pb-16 sm:pb-10 ">
          <textarea
            required
            className="h-full outline-none w-full border border-gray-300 rounded p-3"
            value={newUpdate.content}
            onChange={(e) =>
              setNewUpdate({ ...newUpdate, content: e.target.value })
            }
            placeholder="You can type here"
          />
        </div>
        <button
          className={` w-40 h-10 bg-green-500 text-white rounded text-sm cursor-pointer  hover:space-x-1.5 hover:bg-green-600 duration-200 transition-all  ${isLoading || photoUploading ? "opacity-75" : ""}`}
          disabled={isLoading || photoUploading}
          type="submit"
        >
          {isloading ? "Updating" : "Update"}
        </button>
        {iserror && Error && (
          <p>
            {Error?.data?.message || "something went wrong! Please try again."}
          </p>
        )}
      </div>
    </form>
  );
};

export default UpdatePostComponent;
