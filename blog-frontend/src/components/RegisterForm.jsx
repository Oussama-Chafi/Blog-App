import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux-toolkit/features/auth/authApiSlice";
// import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux-toolkit/features/auth/authSlice";
function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const [register, { isError, isLoading, error }] = useRegisterMutation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password,
      }).unwrap();

      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      dispatch(
        setCredentials({
          user: data?.user
        
        }),
      );
      navigate("/auth/Rigester-success");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center  ">
      <div className=" shadow-lg px-10 py-8 rounded-lg  max-sm:w-full sm:w-[80%] md:w-[50%] max-md:w-[50%]  lg:w-[50%] ">
        <h2 className="font-bold text-center mb-5 text-2xl">
          Login to your Account
        </h2>
        <form onSubmit={handelSubmit}>
          <fieldset className="my-3 ">
            <label htmlFor="first_name">First Name</label>
            <input
              value={newUser.first_name}
              onChange={handelChange}
              name="first_name"
              id="first_name"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              type="text"
              placeholder="Example.@gmail.com"
            />
          </fieldset>
          <fieldset className="mt-3 flex flex-col gap-2">
            <label htmlFor="last_name">Last Name</label>
            <input
              value={newUser.last_name}
              onChange={handelChange}
              name="last_name"
              id="last_name"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              type="text"
              placeholder="Example.@gmail.com"
            />
          </fieldset>
          <fieldset className="mt-3 flex flex-col gap-2 ">
            <label htmlFor="email">Email</label>
            <input
              value={newUser.email}
              onChange={handelChange}
              name="email"
              id="email"
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              type="email"
              placeholder="Example.@gmail.com"
            />
          </fieldset>
          <fieldset className="mt-3 flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              value={newUser.password}
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
            {isLoading ? "Submiting..." : "Register"}
          </button>
        </form>
        <div className="mt-5 ">
          {isError && error && (
            <p className="text-red-600 ">
              {error?.data?.message || "something went wrong"}
            </p>
          )}
        </div>
        <div className=" mt-5 flex gap-4 items-center justify-between  flex-wrap ">
          <p className="text-gray-400 text-center max-sm:w-full ">You have an Account already ? </p>
          <a className="text-blue-500 hover:text-blue-500/90 cursor-pointer text-center max-sm:w-full " href="/auth/login">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
