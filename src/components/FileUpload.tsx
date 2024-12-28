"use client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { GoUpload } from "react-icons/go";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks/hooks";

interface uploadProps {
  cImage: string;
}

const FileUpload: React.FC<uploadProps> = ({ cImage }) => {
  const [imgBg, setImgBg] = useState(cImage);
  const { isLoading, uploadFile } = useFileUpload();
  const user = useAppSelector((state) => state.user.user);
  const defaultImage = "/default-profile.png";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    // Upload file
    uploadFile(selectedFile);

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgBg(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };
  return (
    <div>
      <div
        style={{ backgroundImage: `url(${defaultImage})` }}
        className={`bg-cover  bg-center flex relative justify-center items-center w-44 m-5 h-44 mx-auto rounded-full  `}
      >
        <div
          style={{ backgroundImage: `url(${imgBg})` }}
          className={`bg-cover border-4 border-sky-700 bg-center flex justify-center items-center w-44 m-5 h-44 mx-auto rounded-full overflow-hidden `}
        >
          <label
            className={`bg-black ${
              isLoading ? "opacity-100" : "opacity-0"
            } cursor-pointer hover:opacity-100 transition-all delay-100 text-4xl bg-opacity-85 w-full h-full text-center flex justify-center items-center`}
            htmlFor="file"
          >
            <div>
              {isLoading ? (
                <div className="loading loading-spinner"></div>
              ) : (
                <GoUpload />
              )}
            </div>
          </label>
          <div className="absolute bottom-0  rounded-xl capitalize bg-sky-700 px-2 ">
            {user?.role}
          </div>
        </div>
      </div>

      <input
        className="hidden"
        type="file"
        name="file"
        id="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
