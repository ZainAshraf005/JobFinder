import { apiHandler } from "@/handlers/apiErrorHandler";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  type: string;
}

const NewJobs = () => {
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const savedJobs: { jobId: string }[] =
    JSON.parse(localStorage.getItem("applications") as string) || [];
  const router = useRouter();

  const getJobs = useCallback(async () => {
    try {
      const response = await axios.get(`/api/job/all`);
      if (response.data.success) {
        setAllJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
        setLoading(false);
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  }, []);

  const handleSearch = (elem: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = elem.target.value.toLowerCase();
    setFilteredJobs(
      allJobs.filter((e) => e.title.toLowerCase().includes(searchValue))
    );
  };

  const handleClick = (id: string) => {
    setLoading(true);
    router.push(`/job/${id}`);
    setLoading(false);
  };

  useEffect(() => {
    getJobs();
  }, [getJobs]);

  return (
    <div className="w-full h-full overflow-y-hidden lg:p-4">
      <div className="flex md:flex-row flex-col justify-between items-center lg:px-8 lg:pr-12">
        <h1 className="lg:text-3xl w-full md:text-xl hidden md:block text-lg capitalize text-center">find your next job</h1>
        <div className="w-full flex justify-end mt-4 px-3">
          <input
            onChange={(e) => handleSearch(e)}
            className="input border-gray-600 bg-transparent outline-none focus:outline-none"
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
      ) : filteredJobs.length === 0 ? (
        <div className="text-center w-full flex justify-center items-center h-full text-gray-500">
          No jobs found
        </div>
      ) : (
        <div className="md:px-4 px-2 grid md:h-[35rem] h-[47rem] content-start overflow-auto gap-3 md:gap-4 py-7 md:grid-cols-2 mt-5">
          {filteredJobs.map((e) => (
            <div
              onClick={() => handleClick(e.id)}
              key={e.id}
              className="border relative text-sm md:text-base  cursor-pointer w-full h-28 border-gray-600 p-4 rounded-xl "
            >
              {e === allJobs[0] && (
                <div className="absolute left-2 -top-3 text-sm bg-primary text-gray-950 rounded-full px-1">
                  recently added
                </div>
              )}
              {savedJobs.some((job) => job.jobId === e.id) && (
                <div className="absolute right-2 -top-3 text-sm bg-orange-500 text-gray-950 rounded-full px-1">
                  applied
                </div>
              )}
              <h1 className="capitalize text-sm md:text-lg">{e.title}</h1>
              <p className="whitespace-nowrap text-zinc-400 text-sm w-56 lg:w-full overflow-hidden text-ellipsis">
                {e.description}
              </p>
              <div className="flex justify-between mt-3 pr-4">
                <div>{e.salary} usd/m</div>
                <div className="uppercase">{e.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewJobs;
