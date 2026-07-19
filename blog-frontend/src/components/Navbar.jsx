import { Link, useNavigate } from "react-router-dom";
import { useSendLougoutMutation } from "../redux-toolkit/features/auth/authApiSlice";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { RiCloseFill, RiMenuFill } from "@remixicon/react";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const [sendLogout, { isLoading }] = useSendLougoutMutation();
  const navigate = useNavigate();
  const [mod, setMod] = useState(false);
  const handelLogout = async () => {
    try {
      await sendLogout().unwrap();
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [navItems, setNavItems] = useState([
    { link: "Home", path: "/" },
    { link: "My Posts", path: "/profile/my-posts" },
    { link: "Create Post", path: "/posts/add" },
    { link: "contact", path: "/contact" },
  ]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className=" shadow-sm relative bg-white z-50">
      <div className="container px-5 flex justify-between bg-white border-b border-gray-100 items-center py-4 mx-auto  ">
        <div className="flex items-center gap-2 max-w-fit cursor-pointer">
          <img
            onClick={() => navigate("/profile")}
            className="rounded-full w-12.5 h-12.5  border-2 border-blue-500 object-cover  "
            src={user?.avatar}
            alt="profile"
          />
          <a className="font-bold capitalize " href="/">
            {user?.first_name} {user?.last_name}
          </a>
        </div>
        {/* MObile menu */}
        <nav
          className={`flex flex-col h-screen w-full fixed top-0 left-0 bg-white z-50 p-8 transition-transform duration-300 md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          {navItems.map((element) => (
            <ul
              key={element.link}
              className="flex flex-col gap-6 mt-16 text-lg font-medium justify-center items-center "
            >
              <RiCloseFill
                className="absolute top-8  right-6 font-semibold text-gray-700 hover:text-black cursor-pointer"
                size={30}
                onClick={() => setIsOpen((prev) => !prev)}
              />
              <li onClick={() => setIsOpen(false)} className=" hover:text-gray-600/95 py-2 px-3 block rounded-lg duration-100 transition-all">
                <Link  to={element.path}>{element.link}</Link>
              </li>
            </ul>
          ))}
          <div className=" mt-auto flex flex-col gap-4 border-t pt-6">
            <div className="flex items-center justify-between px-10">
              <span className="text-sm text-gray-500">Theme</span>
              <button
                onClick={() => setMod((prev) => !prev)}
                className="p-2 px-4 rounded-full dark:bg-slate-500 bg-slate-100 text-sm font-medium capitalize"
              >
                {mod ? "dark" : "light"}
              </button>
            </div>

            <div className="flex items-center mt-2 text-center gap-4 mx-auto ">
              <button
                className="rounded-lg px-4 py-2 bg-rose-50  text-rose-600 hover:bg-rose-100 transition-colors duration-200 text-sm font-semibold cursor-pointer"
                disabled={isLoading}
                onClick={handelLogout}
              >
                {isLoading ? "See you " : "Log Out"}
              </button>
            </div>
          </div>
        </nav>
        <RiMenuFill
          className="md:hidden cursor-pointer text-gray-700 "
          onClick={() => setIsOpen(true)}
        />
        {/* DeskTop menu */}
        <div className="flex items-center min-w-[70%] justify-between max-md:hidden">
          {navItems.map((element) => (
            <ul key={element.link}>
              <li>
                <Link
                  className="text-gray-900 hover:text-black hover:bg-gray-200 py-2 px-2 rounded-lg duration-100 transition-all"
                  to={element.path}
                >
                  {element.link}
                </Link>
              </li>
            </ul>
          ))}

          <div className="w-[40%] flex items-center justify-end gap-20">
            <button
              onClick={() => setMod((prev) => !prev)}
              className="rounded-full w-12.5 h-12.5 cursor-pointer border-2 bg-gray-500 px-2 py-2"
            >
              {mod ? "dark" : "light"}
            </button>

            <button
              className="rounded-lg px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors duration-200 cursor-pointer"
              disabled={isLoading}
              onClick={handelLogout}
            >
              {isLoading ? "See you " : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
