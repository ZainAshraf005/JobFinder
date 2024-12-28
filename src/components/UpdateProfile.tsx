"use client";

import { apiHandler } from "@/handlers/apiErrorHandler";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import React, { FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GoX } from "react-icons/go";

interface UpdateProfileProps {
  slider: boolean;
  setSlider: (value: boolean) => void;
}

const UpdateProfile: React.FC<UpdateProfileProps> = ({ slider, setSlider }) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/update", {
        id: user?.id,
        name: name.trim(),
      });

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser({ ...user, name: response.data.name })); // Ensure correct field
        setLoading(false);
        setSlider(false);
      }
    } catch (error: unknown) {
      setLoading(false);
      apiHandler(error);
    }
  };

  

  return (
    <div
      className={`w-full ${
        slider ? "" : "translate-y-[100%]"
      } transition-all delay-75 duration-300 z-10 ease-in-out bg-primary-content p-4 rounded-t-3xl max-w-4xl right-[50%] translate-x-[50%] bottom-0 h-[90vh] border shadow-lg border-gray-700 absolute`}
    >
      <div
        onClick={() => setSlider(!slider)}
        className="absolute cursor-pointer right-5 text-4xl"
      >
        <GoX />
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Update Profile</h1>
        <div className="w-full">
          <form className="flex gap-3 md:flex-row flex-col justify-between" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              required
              autoComplete="off"
              className="input w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Update your name"
              name="name"
              id="name"
            />
            <button type="submit" className="btn btn-success btn-block md:btn-wide">
              {loading ? (
                <div className="loading loading-dots loading-lg"></div>
              ) : (
                "Update"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
