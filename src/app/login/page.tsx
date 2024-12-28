"use client";
import { GoEye, GoEyeClosed, GoLock, GoMail } from "react-icons/go";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/redux/hooks/hooks";
import { setUser } from "@/redux/features/userSlice";
import { apiHandler } from "@/handlers/apiErrorHandler";
import { setSelected } from "@/redux/features/selectedSlice";

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/auth/login`, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        dispatch(setSelected("account"));
        setData({ email: "", password: "" });
        setLoading(false);
        router.push("/profile");
      }
    } catch (error: unknown) {
      setLoading(false);
      apiHandler(error);
    }
  };

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  return (
    <div className="w-full bg-primary-content flex justify-center items-center h-screen overflow-hidden">
      <div className="lg:w-[40%] w-[90%] overflow-y-hidden">
        <Link
          className="px-3 absolute top-4 left-5 py-1 border-zinc-600 rounded-xl border w-fit"
          href={"/"}
        >
          HomePage
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-zinc-400 gap-5 p-6 border border-zinc-700 rounded-xl w-full h-[90%] "
          action=""
        >
          <h1 className="text-center capitalize">login to your account</h1>
          <label className="input flex items-center gap-3 cursor-pointer">
            <GoMail className="text-lg" />

            <input
              autoComplete="off"
              minLength={6}
              placeholder="Email"
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </label>
          <div className="input flex items-center gap-3 cursor-pointer">
            <label htmlFor="password">
              <GoLock className="text-xl" />
            </label>
            <input
              placeholder="password"
              minLength={8}
              className="w-full"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <div onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <GoEye className="justify-self-end text-xl" />
              ) : (
                <GoEyeClosed className="justify-self-end text-xl" />
              )}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary text-zinc-200 font-medium text-lg"
          >
            {loading ? (
              <div className="loading loading-dots loading-lg"></div>
            ) : (
              "login"
            )}
          </button>
          <div className="flex gap-2">
            dont have an account?{" "}
            <Link className="hover:underline text-primary" href={"/signup"}>
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
