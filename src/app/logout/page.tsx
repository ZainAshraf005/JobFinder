"use client";
import { clearUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Page: React.FC = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const getLogout = async () => {
    try {
      const response = await axios.get("/api/auth/logout");
      if (response.data.success) {
        dispatch(clearUser());
        router.push("/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getLogout();
    } else {
      toast.error("un authorized attempt");
      router.push("/");
    }
  });
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="loading loading-lg loading-spinner"></div>
    </div>
  );
};

export default Page;
