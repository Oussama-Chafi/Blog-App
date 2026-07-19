import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../redux-toolkit/features/auth/authApiSlice";
import { useEffect } from "react";
import { useRef } from "react";

const VerifyEmailComponent = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [verifyEmail, { isLoading, isError, error, isSuccess }] =
    useVerifyEmailMutation();

  const isCalled = useRef(false);

  useEffect(() => {
    if (token && !isCalled.current) {
      isCalled.current = true;
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <div className="flex  justify-center  mt-30 w-full">
      <div className=" mx-3">
        <h1 className="font-bold mt-20 space-x-1 text-2xl md:text-3xl lg:text-4xl text-center">
          Verify Email Page
        </h1>
        {isLoading && <p className="text-gray-100 text-center ">Loading...</p>}
        {isError && error && (
          <div className=" mx-auto mt-20 w-full md:w-[50%] ">
            <p className="text-red-700 text-center mx-auto mt-10 sm:text-2xl md:text-3xl ">
              Verification is not validate !
            </p>
            <p className="text-gray-600 text-center mt-20 capitalize text-2xl">
              {error?.data?.message || "something went wrong. Try again later!"}
            </p>
          </div>
        )}
        {isSuccess && (
          <div className="mt-20 mx-auto w-full ">
            <p className="text-green-600 sm:text-2xl md:text-3xl text-shadow-md  max-w-[80%]  mx-auto text-center">
              Your account is verified now! Log in with your email and password
            </p>
            <Link
              className="text-blue-500 hover:text-blue-500/90 cursor-pointer text-center max-sm:w-full mx-auto block mt-10"
              to={"/auth/login"}
            >
              Login Page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailComponent;
