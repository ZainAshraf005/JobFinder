"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Applications from "./Applications";
import { useAppSelector } from "@/redux/hooks/hooks";
import ApplyForm from "./ApplyForm";
import { useDeleteJob } from "@/hooks/useDeleteJob";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  postedAt: string;
  employer: { name: string };
}

interface JobDetailsProps {
  id: string;
}

const JobDetails: React.FC<JobDetailsProps> = ({ id }) => {
  const [job, setJob] = useState<Job | null>(null);
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const [slider, setSlider] = useState(false);
  const [applied, setApplied] = useState(false);
  const [currApplication, setCurrApplication] = useState<{
    coverLetter: string;
    appliedAt: string;
  } | null>(null);
  const deleteJob = useDeleteJob();

  const handleDelete = async () => {
    await deleteJob(id);
    router.back();
  };

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/job/one/${id}`);
        if (response.data.success) {
          setJob(response.data.job);
        }
      } catch (error) {
        console.error("Error fetching job details", error);
      }
    };

    const storedApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const currentApplication = storedApplications.find(
      (app: { jobId: string; id: string }) => app.jobId === id
    );

    if (currentApplication) {
      setApplied(true);
      setCurrApplication(currentApplication);
    }

    fetchJobDetails();
  }, [id, slider]);

  if (!job) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="loading loading-spinner text-primary loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative bg-primary-content text-white p-6">
      {/* Job Details */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-transparent border-gray-600 p-6 rounded-lg shadow-lg">
          <div className="flex md:flex-row flex-col-reverse justify-between">
            <h1 className="md:text-4xl text-xl w-[33rem] capitalize font-semibold mb-4">
              {job.title}
            </h1>
            <div className="flex justify-end mb-4">
              {user?.role === "employer" && (
                <button
                  onClick={handleDelete}
                  className="btn btn-error btn-sm md:btn-md  md:btn-wide capitalize btn-outline"
                >
                  delete job
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between mb-4 text-sm text-gray-400">
            <span>{job.location}</span>
            <span>{job.type}</span>
          </div>
          <p className="md:text-lg text-base text-gray-300 mb-6 whitespace-pre-line ">
            {job.description}
          </p>

          <div className="flex justify-between mt-8 border-t border-gray-700 pt-4">
            <div>
              <h2 className="md:text-xl text-lg font-semibold">Salary</h2>
              <p className="md:text-lg text-sm text-gray-400">
                {job.salary} USD/month
              </p>
            </div>
            <div>
              <h2 className="md:text-xl text-lg font-semibold">Posted At</h2>
              <p className="md:text-lg text-sm text-gray-400">
                {new Date(job.postedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {user?.role !== "employer" && (
            <div className="mt-6 flex justify-between">
              <div>posted by: <span className="capitalize">{job.employer.name}</span></div>
              <button
                disabled={applied}
                onClick={() => setSlider(!slider)}
                className="btn btn-primary disabled:text-zinc-400"
              >
                {applied ? "Applied" : "Apply Now"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Employer View */}
      {user?.role === "employer" && <Applications id={job.id} />}

      {/* Job Seeker Apply Form */}
      {user?.role.toLowerCase() === "job seeker" && (
        <ApplyForm
          slider={slider}
          setSlider={setSlider}
          id={id}
          title={job.title}
        />
      )}

      {/* Applied Cover Letter */}
      {applied && user?.role !== "employer" && (
        <div className="max-w-4xl mx-auto p-6 ">
          <h1 className="text-4xl font-semibold">Cover Letter:</h1>
          <p className="text-lg text-gray-300 my-6 whitespace-pre-line ">
            {currApplication?.coverLetter || "No cover letter available."}
          </p>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
