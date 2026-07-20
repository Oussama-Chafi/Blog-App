
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
} from "../redux-toolkit/features/userProfile/profileApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileComponent = () => {
  const [changeAvatar, setChangeAvatar] = useState();
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [uploadAvatar, { isLoading: isUploading, error: avatarError }] =
    useUploadAvatarMutation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    const file = changeAvatar;
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await uploadAvatar(formData).unwrap();
      alert("the avatar has uploaded successfully");
    } catch (error) {
      console.log(error);
      alert(
        avatarError?.data?.message ||
          "something went wrong! Please try again later.",
      );
    }
  };

  {
    isLoading && <p>Loading ...</p>;
  }
  {
    isError && error && <p>{error?.data?.message}</p>;
  }
  return (
    <div className="">
      <div className="my-10 px-1 md:px-20 w-full max-w-2xl md:mx-10 pb-10 rounded bg-gray-300 shadow-lg">
        <div>
          <img
            className={`border rounded-full w-27.5 h-27.5 border-blue-300 cursor-pointer ${isUploading ? "opacity-45" : ""} `}
            onClick={() => setIsOpen(true)}
            src={
              changeAvatar
                ? URL.createObjectURL(changeAvatar)
                : user?.data?.avatar
            }
            alt=""
          />
          <form
            onSubmit={handleChangeAvatar}
            className="mt-2 w-fit flex gap-4 flex-col"
          >
            <label
              htmlFor="choose photo"
              className=" cursor-pointer font-semibold"
            >
              Change Avatar
              <input
                type="file"
                onChange={(e) => setChangeAvatar(e.target.files[0])}
                hidden
                id="choose photo"
              />
            </label>
            <button
              type="submit"
              className={`${changeAvatar ? "bg-gray-400 text-gray-600 rounded-lg cursor-pointer" : "bg-gray-200 text-gray-500 rounded-lg cursor-pointer"} `}
              disabled={!changeAvatar || isUploading}
            >
              Change
            </button>
          </form>
        </div>
        <div className="mt-10 w-full  ">
          <ul>
            <li className="font-semibold text-gray-500">
              First Name:{" "}
              <p className="inline font-bold text-gray-700">{user?.data?.first_name}</p>
            </li>
            <li className="font-semibold text-gray-500">
              Last Name:{" "}
              <p className="font-bold inline text-gray-700">{user?.data?.last_name}</p>
            </li>
            <li className="font-semibold text-gray-500">
              Email: <p className="font-bold inline text-gray-700">{user?.data?.email}</p>
            </li>
          </ul>
        </div>
        <div className="mt-10 w-full flex flex-col max-sm:w-[60%]  max-sm:mx-auto sm:flex-row gap-9">
          <button
            className="bg-(--primary-color) px-4 py-2 rounded-xl text-white cursor-pointer hover:bg-blue-700 duration-200 transition-colors"
            onClick={() => navigate("/profile/change-password")}
          >
            Change Password
          </button>
          <button
            className="bg-(--secondry-color) text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-900 duration-200 transition-colors"
            onClick={() => navigate("/profile/my-posts")}
          >
            My Posts
          </button>
        </div>
      </div>
      {isOpen && (
        <div
          className="w-screen h-screen fixed top-0 right-0 bg-black/75 bg-cover z-50 flex justify-center items-center cursor-zoom-out "
          onClick={() => setIsOpen(false)}
        >
          <img
            src={user?.data?.avatar}
            className="max-w-[90%] max-h-[90%] my-auto shadow-lg rounded-xl"
            onClick={(e) => e.stopPropagation()}
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
