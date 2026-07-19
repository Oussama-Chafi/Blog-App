import { useState } from "react";
import { useForgetPasswordMutation } from "../redux-toolkit/features/auth/authApiSlice";

const ForgetPassComponent = () => {
  const [forgetPassword, { isLoading, isError, isSuccess, error }] =
    useForgetPasswordMutation();
  const [email, setEmail] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgetPassword({ email }).unwrap();
      setEmail("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white ">
      <div className="px-10 py-4 shadow-lg min-w-100">
      <h2 className="font-bold text-center my-5 ">Enter your Email here</h2>
      <form onSubmit={handelSubmit}>
        <fieldset className="flex flex-col gap-2 ">
          <label htmlFor="email">Email</label>
          <input
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            id="email"
          />
        </fieldset>
        <button className="w-full text-white cursor-pointer bg-blue-500 hover:bg-blue-600/90 rounded-lg my-4 py-2" type="submit">{isLoading ? "submiting" : "continue"}</button>
      </form>
      {isLoading && <p className="text-gray-400 font-medium my-5">please wait !</p>}
      {isError && <p className="text-red-600 font-bold my-5">{error?.data?.message}</p>}
      {isSuccess && (
        <p className="text-green-600 font-bold my-5 ">check your email and click the link to reset your password</p>
      )}
      <div className="w-full flex justify-end ">
        <a className="text-center font-medium w-full hover:text-blue-500/90 cursor-pointer" href="/auth/login">Login Page</a>
      </div>
    </div>
    </div>
  );
};

export default ForgetPassComponent;
