import { useState } from "react";
import {
  useCreatePostMutation,
  useUploadPostPhotoMutation,
} from "../redux-toolkit/features/posts/postsApiSlice";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
const CreatePostForm = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    photo: null,
  });

  const [uploadPostPhoto, { isLoading: photoLoading }] =
    useUploadPostPhotoMutation();
  const [createPost, { isLoading, isError, error }] = useCreatePostMutation();
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.photo) {
      alert("please select an image first!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("postPhoto", newPost.photo);
      const photoResult = await uploadPostPhoto(formData).unwrap();

      const postPhoto = photoResult.photoUrl;
      const imagePublicId = photoResult.publicId;

      const res = await createPost({
        title: newPost.title,
        content: newPost.content,
        postPhoto,
        imagePublicId,
      }).unwrap();
      setNewPost({
        title: "",
        content: "",
      });
      alert(res?.message || "The Post has created Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex-1 bg-blue-50/50 text-gray-600 h-screen overflow-scroll "
      onSubmit={handelSubmit}
    >
      <div className="bg-white w-full max-w-2xl p-4 md:p-10  sm:my-10 md:mx-15  shadow rounded">
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={
              !newPost.photo
                ? assets.upload_area
                : URL.createObjectURL(newPost.photo)
            }
            alt=""
            className={`mt-2 h-16 rounded cursor-pointer ${isLoading || photoLoading ? "opacity-70" : ""}`}
          />
          <input
            type="file"
            hidden
            required
            id="image"
            onChange={(e) =>
              setNewPost({ ...newPost, photo: e.target.files[0] })
            }
          />
        </label>
        {photoLoading && (
          <p className="my-4 text-black  ">
            We uploading the Image, please wait.
          </p>
        )}
        <p className="mt-4">Blog title</p>
        <input
          type="text"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          required
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-75 pt-3 pb-16 sm:pb-10 ">
          <textarea
            className="h-full outline-none w-full border border-gray-300 rounded p-3"
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            placeholder="You can type here"
          />
        </div>
        <button
          className={`mt-8 w-40 h-10 bg-(--primary-color) text-white rounded text-sm cursor-pointer hover:scale-y-110 hover:space-x-1.5 duration-200 transition-all ${isLoading || photoLoading ? "opacity-75" : ""}`}
          disabled={photoLoading || photoLoading}
          type="submit"
        >
          {isLoading || photoLoading ? "Submiting..." : "Add Blog"}
        </button>
        {isError && (
          <p className="text-red-500 font-bold mt-10 first-letter:capitalize ">
            {error?.data?.message || "something went wrong! Try again later."}
          </p>
        )}
      </div>
    </form>
  );
};

export default CreatePostForm;
