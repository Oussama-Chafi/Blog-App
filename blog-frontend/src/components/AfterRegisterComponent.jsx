import { useSelector } from "react-redux";

const AfterRegisterComponent = () => {
  const userInfor = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col h-screen w-full mt-40 items-center gap-18 px-3 md:px-7 lg:px-15">
      <h1 className="font-bold space-x-1.5 capitalize text-2xl sm:text-3xl md:text-4xl ">
        Hello {userInfor?.first_name} {userInfor?.last_name}
      </h1>
      <p className="font-bold text-gray-900">Welcome to our Community</p>
      <div className="flex flex-col gap-10">
        <p className=" mx-auto max-w-[90%] text-center space-x-1">
          we send to your email a link , so you can verify your account{" "}
        </p>
        <p className=" mx-auto max-w-[90%] text-center space-x-1">
          Type the Link and then you can Log in with your Email and Password
        </p>
      </div>
    </div>
  );
};

export default AfterRegisterComponent;
