import { useState } from "react";
import { apiHandler } from "@/handlers/apiErrorHandler";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "@/redux/features/userSlice";

export const useFileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();

  const uploadFile = async (file: File | undefined) => {
    if (!file || !user?.id) return;

    setIsLoading(true);

    try {
      const data = new FormData();
      data.set("file", file);
      data.set("id", user.id);

      const response = await axios.post("/api/upload", data);

      if (response.data.success) {
        toast.success(response.data.message);
        const { photo, resume } = response.data.user;
        const newUser = { ...user, photo, resume };
        localStorage.setItem("user", JSON.stringify(newUser));
        dispatch(setUser(newUser));
      }
    } catch (error: unknown) {
      apiHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, isLoading };
};
