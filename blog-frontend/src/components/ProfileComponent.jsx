import { useRef } from "react";
import {
  useGetProfileQuery,
  useUploadAvatarMutation,
} from "../redux-toolkit/features/userProfile/profileApiSlice";
import { useState } from "react";

const ProfileComponent = () => {
  const { data: user, isLoading, isError, error } = useGetProfileQuery();
  const [uploadAvatar, { isLoading: isUploading, error: avatarError }] =
    useUploadAvatarMutation();
  const [isOpen, setIsOpen] = useState(false);
  const fileUploadRef = useRef(null);

  const handelFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await uploadAvatar(formData).unwrap();
      if (fileUploadRef.current) {
        return (fileUploadRef.current.value = "");
      }
      alert("the avatar has uploaded successfully");
    } catch (error) {
      console.log(error);
      alert(
        avatarError?.data?.message ||
          "something went wrong , please try again later",
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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "10px auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ position: "relative" }}>
          <img
            onClick={() => setIsOpen(true)}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #0D8ABC",
              opacity: isUploading ? 0.5 : 1,
              cursor: "pointer",
            }}
            src={user?.data?.avatar}
            alt="Profile Photo"
          />
          <div style={{ margin: "15px 0" }}>
            <input
              placeholder="change goto"
              type="file"
              accept="image/*"
              onChange={handelFileChange}
              id="avatarInput"
              ref={fileUploadRef}
            />
          </div>
          <p>{isUploading && <p>upload the photo please wait</p>}</p>
          <div>
            <p>First Name : {user?.data?.first_name}</p>
            <p>Last Name : {user?.data?.last_name}</p>
            <p>Email : {user?.data?.email}</p>
            <a href="/profile/change-password">Change the password</a>
            <a href="/profile/my-posts">All my Posts</a>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "5",
            cursor: "zoom-out",
          }}
        >
          <img
            onClick={(e) => e.stopPropagation()}
            src={user?.data?.avatar}
            alt="avatar"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
