"use client";
import { apiHandler } from "@/handlers/apiErrorHandler";
import { useFileUpload } from "@/hooks/useFileUpload";
import { setApplications } from "@/redux/features/appliedJobsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoX } from "react-icons/go";

interface ApplyFormProps {
  slider: boolean;
  setSlider: (value: boolean) => void;
  title?: string;
  id?: string;
}

const ApplyForm: React.FC<ApplyFormProps> = ({
  slider,
  setSlider,
  id,
  title,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [isResume, setIsResume] = useState(false);
  const { isLoading, uploadFile } = useFileUpload();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    jobId: id,
    userId: user?.id,
    resumeUrl: `/uploads/${user?.email}/resume/resume.pdf`,
    coverLetter: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      toast.error("Please select a file.");
      return;
    }

    // Upload file
    uploadFile(selectedFile);
    setSlider(false);
    setIsResume(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!user?.resume) {
      toast.error("add resume first");
      return;
    }

    try {
      const response = await axios.post("/api/application/create", data);
      if (response.data.success) {
        toast.success(response.data.message);
        setLoading(false);
        setSlider(false);
        const arr = JSON.parse(localStorage.getItem("applications") as string);
        dispatch(setApplications([...arr, data]));
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };

  useEffect(() => {
    if (user?.resume && id) {
      setIsResume(true);
    }
  }, [user, id]);

  return (
    <div
      className={`w-full ${
        slider ? "" : "translate-y-[100%]"
      } transition-all delay-75 duration-300 z-10 ease-in-out bg-primary-content p-4 rounded-t-3xl max-w-4xl right-[50%] translate-x-[50%] bottom-0 h-[90vh] border shadow-lg border-gray-700 absolute `}
    >
      <div
        onClick={() => setSlider(!slider)}
        className="absolute cursor-pointer right-5 text-4xl"
      >
        <GoX />
      </div>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">
          {title ? `Apply for ${title}` : "Upload Resume"}{" "}
        </h1>

        {!isResume && (
          <div className="flex flex-col">
            <label htmlFor="resume">upload resume</label>
            <input
              onChange={handleFileChange}
              className="input"
              type="file"
              name="resume"
              id="resume"
            />
          </div>
        )}

        {isLoading && (
          <div className=" w-full text-center">
            <div className="loading loading-spinner"></div>
          </div>
        )}
        {id && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cover Letter </span>
              </label>
              <textarea
                value={data.coverLetter}
                onChange={(e) =>
                  setData({ ...data, coverLetter: e.target.value })
                }
                placeholder="Write your cover letter here..."
                className="textarea textarea-bordered w-full"
              />
            </div>

            <div className="form-control">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary w-full"
              >
                {loading ? (
                  <div className="loading loading-dots"></div>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyForm;

{/* <div className="w-full ">
  <form className="flex gap-3 justify-between" action="">
    <input
      autoComplete="off"
      className="input w-full"
      type="text"
      placeholder="update your name "
      name="name"
      id="name"
    />
    <button className="btn btn-success btn-wide">update</button>
  </form>
</div>; */}
