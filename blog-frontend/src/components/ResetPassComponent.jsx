import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../redux-toolkit/features/auth/authApiSlice";
const ResetPassComponent = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const resetToken = queryParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  console.log(resetToken);
  const [resetPassword, { isLoading, isError, isSuccess, error }] =
    useResetPasswordMutation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    await resetPassword({ newPassword, resetToken });
    setNewPassword("");
  };
  //   console.log(window.location.href)
  //   console.log(resetToken)
  return (
    <div className="h-screen bg-white flex flex-col justify-center items-center">
      <div className="shadow-lg py-5 px-8 min-w-100 ">
        <h2 className="text-center font-bold mb-5 ">Reset your Password </h2>
        <form onSubmit={handelSubmit}>
          <fieldset className="flex flex-row gap-4 items-center">
            <label htmlFor="password">Reset </label>
            <input
              className="border border-gray-300 rounded-lg py-2  px-3 w-full focus:outline-none focus:border-blue-500 focus:shadow-lg focus:border-2"
              required
              placeholder="Reset Password"
              type="password"
              value={newPassword}
              id="password"
              name="password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </fieldset>
          <div className="flex justify-end ">
            <button
              className="mt-4 w-[84%] bg-blue-500 cursor-pointer hover:bg-blue-600/90 rounded-lg py-4 px-8 text-white"
              type="submit"
            >
              {isLoading ? "changig ..." : "change the password"}
            </button>
          </div>
        </form>
        {isLoading && (
          <p className="text-gray-400 text-center my-5">
            we are changing the Password , Please wait
          </p>
        )}
        {isError && (
          <p className="text-red-600 text-center my-5">
            {error?.data?.message}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-center my-5">
            the password has chnged. GO now and check{" "}
          </p>
        )}
        <div className="flex justify-end my-5">
          <a
            className="w-full text-center hover:text-blue-500/90 cursor-pointer "
            onClick={() => navigate("/auth/login")}
          >
            To Login Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassComponent;
