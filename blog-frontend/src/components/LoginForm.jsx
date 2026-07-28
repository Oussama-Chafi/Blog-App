import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux-toolkit/features/auth/authApiSlice";
// import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux-toolkit/features/auth/authSlice";
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const [login, { isError, isLoading, error }] = useLoginMutation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        email: user.email,
        password: user.password,
      }).unwrap();
      // const accessToken = data?.accessToken;
      // if (accessToken) {
      //   Cookies.set("accessToken", accessToken);
      // }
      setUser({
        email: "",
        password: "",
      });
      dispatch(
        setCredentials({
          user: data?.user,
          token: data?.accessToken,
        }),
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  console.log("isError value", isError, "error", error);

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center  ">
      <div className=" shadow-lg px-3 md:px-10 py-8 rounded-lg max-sm:w-full sm:w-[80%] md:w-[50%] max-md:w-[50%] lg:w-130 ">
        <h2 className="font-bold text-center mb-5 text-2xl">
          Login to your Account
        </h2>
        <form onSubmit={handelSubmit}>
          <fieldset className="flex flex-col gap-2 ">
            <label htmlFor="email">Email</label>
            <input
              value={user.email}
              onChange={handelChange}
              name="email"
              id="email"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              type="email"
              placeholder="Example.@gmail.com"
            />
          </fieldset>
          <fieldset className="mt-3 flex flex-col gap-2">
            <label htmlFor="password">
              <div className="flex justify-between ">
                <p>Password</p>
                <a className="text-blue-600" href="/auth/forget-password">
                  Forget?
                </a>
              </div>
            </label>
            <input
              value={user.password}
              onChange={handelChange}
              name="password"
              id="password"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              type="password"
              placeholder="Enter your Password"
            />
          </fieldset>
          <button
            disabled={isLoading}
            className="text-center w-full bg-blue-500 rounded-lg mt-5 py-3 text-white cursor-pointer hover:bg-blue-600/90"
            type="submit"
          >
            {isLoading ? "Submiting..." : "Login now"}
          </button>
        </form>
        <div className="mt-5 ">
          {isError && error && (
            <p className="text-red-600 ">
              {error?.data?.message || "something went wrong"}
            </p>
          )}
        </div>
        <div className=" mt-5 flex gap-4 items-center justify-between px-4 flex-wrap ">
          <p className="text-gray-400 text-center max-sm:w-full">
            Don't have an Account ?{" "}
          </p>
          <a
            className="text-blue-500  hover:text-blue-500/90 cursor-pointer text-center max-sm:w-full"
            href="/auth/register"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
