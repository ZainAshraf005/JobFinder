"use client";
import { GoEye, GoEyeClosed, GoLock, GoMail, GoPerson } from "react-icons/go";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiHandler } from "@/handlers/apiErrorHandler";

const Page = () => {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });
  // const inputClass = "input ";
  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`/api/auth/signup`, data, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", email: "", role: "", password: "" });
        setLoading(false);
        router.push("/login");
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
      <div className="md:w-[40%] w-[90%]">
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
          <h1 className="text-center">Signup for free</h1>
          <label className="input flex items-center gap-3 cursor-pointer">
            <GoPerson className="text-lg" />

            <input
              autoComplete="off"
              ref={emailRef}
              placeholder="name"
              minLength={3}
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </label>
          <label className="input flex items-center gap-3 cursor-pointer">
            <GoMail className="text-lg" />

            <input
              autoComplete="off"
              placeholder="email"
              minLength={6}
              type="email"
              name="email"
              id="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </label>
          <select
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
            className="select  w-full "
          >
            <option value={"user"}>Job Seeker</option>
            <option value={"employer"}>Employer</option>
          </select>
          <label htmlFor="password">
            <div className="input flex items-center gap-3 cursor-pointer">
              <GoLock className="text-xl" />

              <input
                placeholder="password"
                className="w-full"
                minLength={8}
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
          </label>
          <button
            disabled={loading}
            type="submit"
            className="btn btn-primary text-zinc-200 font-medium text-lg"
          >
            {loading ? (
              <div className="loading loading-dots loading-lg"></div>
            ) : (
              "signup"
            )}
          </button>
          <div className="flex gap-2">
            already have an account?{" "}
            <Link className="hover:underline text-primary" href={"/login"}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
