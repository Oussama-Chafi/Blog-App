import AddCommentComponent from "../components/AddCommentComponent";
import GetComment from "../components/CommentComponent";
import PostComponent from "../components/PostComponent";



const PostDetails = () => {

  return (
    <div className="mx-auto py-30 px-3 md:px-10">
      <PostComponent />
      <div className="w-full px-2 md:px-40">
        <GetComment />
        <AddCommentComponent />
      </div>
    </div>
  );
};

export default PostDetails;
