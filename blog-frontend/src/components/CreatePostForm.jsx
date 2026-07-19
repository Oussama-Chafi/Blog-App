import { useState } from "react";
import { useCreatePostMutation, useUploadPostPhotoMutation } from "../redux-toolkit/features/posts/postsApiSlice";
import { useNavigate } from "react-router-dom";
const CreatePostForm = () => {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    photo : null,
  });
  const [uploadPostPhoto ] = useUploadPostPhotoMutation()
  const [createPost, { isLoading, isError, error }] = useCreatePostMutation();
  const handelSubmit = async (e) => {
    e.preventDefault();
    if(!newPost.photo){
      alert("please select an image first!")
      return
    }
    try {
      const formData = new FormData()
      formData.append("postPhoto" , newPost.photo)
      const photoResult = await uploadPostPhoto(formData).unwrap()
      // console.log(photoResult)
      const imageUrl = photoResult.photoUrl
      const res = await createPost({
        title: newPost.title,
        content: newPost.content,
        postPhoto : imageUrl,
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
    <div className="mx-auto">
      <form onSubmit={handelSubmit}>
        <fieldset>
          
          <input className="h-50 w-50 bg-gray-400"  placeholder="Upload Photo" type="file" name="photo" id="photo"  onChange={(e) => setNewPost({... newPost , photo : e.target.files[0]})} />
        </fieldset>
        <fieldset>
          <label htmlFor="title">title</label>
          <input
            type="text"
            name="titel"
            required
            id="title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
        </fieldset>
        <fieldset>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            required
            placeholder="Enter your post contnet"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          ></textarea>
        </fieldset>
        <button disabled={isLoading} type="submit">
          {isLoading ? "Adding the Post" : "Create Post"}
        </button>
      </form>
      {isError && <p>{error?.data?.message}</p>}
    </div>
  );
};

export default CreatePostForm;
