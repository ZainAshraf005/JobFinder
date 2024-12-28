import { apiHandler } from "@/handlers/apiErrorHandler";
import { setApplications } from "@/redux/features/appliedJobsSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { GoXCircle } from "react-icons/go";

interface Job {
  id: string;
  userId: string;
  coverLetter: string;
  salary: number;
  job: {
    id: string;
    title: string;
    description: string;
    salary: string;
    type: string;
  };
}

const AppliedJobs = () => {
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  const getJobs = useCallback(async (id: string) => {
    try {
      const response = await axios.post(`/api/application/read`, { id });
      console.log(response);
      if (response.data.success) {
        setAllJobs(response.data.applications);
        dispatch(setApplications(response.data.applications));
        setFilteredJobs(response.data.applications);
        setLoading(false);
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  }, [dispatch]);

  const handleSearch = (elem: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = elem.target.value.toLowerCase();
    setFilteredJobs(
      allJobs.filter((e) => e.job.title.toLowerCase().includes(searchValue))
    );
  };
  const handleClick = (id: string) => {
    setLoading(true);
    router.push(`/job/${id}`);
    setLoading(false);
  };

  const handleDelete = async (
    elem: React.MouseEvent<HTMLDivElement, MouseEvent>,
    id: string
  ) => {
    elem.stopPropagation();
    try {
      const response = await axios.post("/api/application/delete", { id });
      if (response.data.success) {
        toast.success(response.data.message);
        setAllJobs((prev) => prev.filter((e) => e.id !== id));
        setFilteredJobs((prev) => prev.filter((e) => e.id !== id));
        dispatch(setApplications(allJobs.filter((e) => e.id !== id)));
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };

  useEffect(() => {
    if (user?.id) getJobs(user.id);
  }, [getJobs, user]);

  return (
    <div className="w-full h-full overflow-y-hidden sm:p-4">
      <div className="flex md:flex-row flex-col justify-between items-center  px-8 md:pr-12">
        <h1 className="md:text-3xl text-lg hidden md:block capitalize text-center">Applied Jobs</h1>
        <div>
          <input
            onChange={(e) => handleSearch(e)}
            className="input border-gray-600 bg-transparent mt-4 outline-none focus:outline-none"
            autoComplete="off"
            placeholder="Search jobs"
            type="search"
            name="search"
            id="search"
            aria-label="Search jobs"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-[90%]">
          <div className="loading loading-spinner text-neutral loading-lg"></div>
        </div>
      ) : filteredJobs?.length === 0 ? (
        <div className="text-center w-full flex justify-center items-center h-full text-gray-500">
          You have not applied to any job yet
        </div>
      ) : (
        <div className="md:px-4 grid md:h-[35rem] h-[47rem] content-start overflow-auto gap-3 md:gap-4 py-7 md:grid-cols-2 mt-5">
          {filteredJobs?.map((e) => (
            <div
              onClick={() => handleClick(e.job.id)}
              key={e.id}
              className="border relative cursor-pointer h-28 border-gray-600 p-4 rounded-xl m-3"
            >
              {e === allJobs[0] && (
                <div className="absolute left-2 -top-3 text-sm bg-primary text-gray-950 rounded-full px-1">
                  recently added
                </div>
              )}
              <div
                onClick={(elem) => handleDelete(elem, e.id)}
                className="absolute right-2 top-2 text-lg text-red-700"
              >
                <GoXCircle />
              </div>
              <h1 className="capitalize">{e.job.title}</h1>
              <p className="whitespace-nowrap w-56 lg:w-full text-zinc-400 overflow-hidden text-ellipsis">
                {e.job.description}
              </p>
              <div className="flex justify-between mt-3 pr-4">
                <div>{e.job.salary} usd/m</div>
                <div>{e.job.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
