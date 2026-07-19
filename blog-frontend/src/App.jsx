import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import MainLayouts from "./layouts/MainLayouts";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import PerisistLogin from "./components/PeresistLogin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import UpdateComment from "./pages/UpdateComment";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import MyPosts from "./pages/MyPosts";
import AfterRegisterComponent from "./components/AfterRegisterComponent";
import "quill/dist/quill.snow.css" 
function App() {
  const token = useSelector((state) => state.auth.token);
  console.log(token);
  return (
    <Routes>
      <Route
        path="/auth/Rigester-success"
        element={<AfterRegisterComponent />}
      />
      <Route path="/auth/verify-email" element={<VerifyEmail />} />

      <Route element={<PerisistLogin />}>
        <Route
          path="/auth"
          element={!token ? <Outlet /> : <Navigate to={"/"} replace />}
        >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
        <Route
          element={
            token ? <MainLayouts /> : <Navigate to={"/auth/login"} replace />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/my-posts" element={<MyPosts />} />
          <Route path="/posts/get/:id" element={<PostDetails />} />
          <Route path="/posts/add" element={<CreatePost />} />

          <Route path="/posts/update-post/:id" element={<UpdatePost />} />
          <Route
            path="/posts/:id/update-comment/:commentId"
            element={<UpdateComment />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
