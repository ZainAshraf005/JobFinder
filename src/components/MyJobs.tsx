import { apiHandler } from "@/handlers/apiErrorHandler";
import { useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";

interface Job {
  id: string;
  title: string;
  description: string;
  salary: number;
  type: string;
  Application:[]
}

const MyJobs = () => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  const getJobs = useCallback(async (id: string) => {
    try {
      const response = await axios.get(`/api/job/get/${id}`);
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

  useEffect(() => {
    if (user?.id) {
      getJobs(user.id);
    }
  }, [user, getJobs]);

  return (
    <div className="w-full h-full overflow-y-hidden md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-center px-3  md:px-8 md:pr-12">
        <h1 className="md:text-3xl text-lg text-center">Your Jobs Here</h1>
        <div className="w-full flex justify-end">
          <input
            onChange={(e) => handleSearch(e)}
            className="input border-gray-600 bg-transparent outline-none focus:outline-none"
            autoComplete="off"
            placeholder="Search jobs"
            type="text"
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
        <div className="md:px-4 grid md:h-[35rem] h-[47rem] pb-5 content-start overflow-auto md:grid-cols-2 mt-5">
          {filteredJobs.map((e) => (
            <Link
              href={`/job/${e.id}`}
              key={e.id}
              className="border relative cursor-pointer h-28 border-gray-600 p-4 rounded-xl m-3"
            >
              {e === allJobs[0] && (
                <div className="absolute left-2 -top-3 text-sm bg-primary text-gray-950 rounded-full px-1">
                  recently added
                </div>
              )}
              {e.Application.length>0 && (
                <div className="absolute right-2 -top-3 text-sm bg-primary text-gray-950 rounded-full px-1">
                  applications: {e.Application?.length}
                </div>
              )}
              
              
              <h1 className="capitalize">{e.title}</h1>
              <p className="whitespace-nowrap text-zinc-400 w-56 lg:w-full overflow-hidden text-ellipsis">
                {e.description}
              </p>
              <div className="flex justify-between mt-3 pr-4">
                <div>{e.salary} usd/m</div>
                <div>{e.type}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
