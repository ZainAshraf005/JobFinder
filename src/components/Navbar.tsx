import { useAppSelector } from "@/redux/hooks/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Tooltip from "./Tooltip";

const Navbar = () => {
  const isLoggedInFromRedux = useAppSelector((state) => state.user.isLoggedIn);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  useEffect(() => {
    setIsLoggedIn(isLoggedInFromRedux);
  }, [isLoggedInFromRedux]);
  return (
    <>
      <div className="navbar bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 md:px-24 py-4 sticky top-0 z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href={'/'}>Home</Link>
              </li>
              <li>
                <Link href={`${isLoggedIn?'/profile':'/login'}`}>Find a Job</Link>
              </li>
              <li>
                <Link href={`${isLoggedIn?'/profile':'/login'}`}>Post a Job</Link>
              </li>

              <li>
                <Link href={''}>Contact Us</Link>
              </li>
            </ul>
          </div>
          <Link href={''} className="btn btn-ghost text-sm sm:text-lg md:text-xl">JobFinder</Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href={'/'}>Home</Link>
            </li>
            <li>
              <Link href={`${isLoggedIn?'/profile':'/login'}`}>Find a Job</Link>
            </li>
            <li>
              <Link href={`${isLoggedIn?'/profile':'/login'}`}>Post a Job</Link>
            </li>

            <li>
              <Link href={''}>Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex gap-2">
          {!isLoggedIn ? (
            <>
            <Tooltip text="it's free">
              <Link 
                href={"/signup"}
                className="btn btn-outline h-10 min-h-[2rem]"
              >
                register
              </Link>
              </Tooltip>
              <Link 
                href={"/login"}
                className="btn btn-primary px-5 min-h-[2rem] h-10 !py-2"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link 
                href={"/profile"}
                className="btn btn-outline h-10 min-h-[2rem]"
              >
                profile
              </Link>
              <Link 
                href={"/logout"}
                className="btn btn-primary px-5 min-h-[2rem] h-10 !py-2"
              >
                logout
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
