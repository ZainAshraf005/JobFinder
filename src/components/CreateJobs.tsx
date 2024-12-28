import { apiHandler } from "@/handlers/apiErrorHandler";
import { useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreateJobs: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "",
    employerId: user?.id,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/job/create",
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.message);
        setData({
          title: "",
          description: "",
          location: "",
          salary: "",
          type: "",
          employerId: "",
        });
      }
    } catch (error: unknown) {
      setLoading(false);
      apiHandler(error);
    }
  };

  return (
    <div className=" w-full h-full flex flex-col justify-center">
      <h1 className="md:text-3xl text-xl text-center">Add New Job Here</h1>
      <div className="">
        <form
          className="form w-[80%] py-4 mx-auto flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
          action=""
        >
          <label className=" w-full" htmlFor="">
            <input
              required
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="input w-full"
              placeholder="Title i.e. Front-end Developer"
              type="text"
              name="title"
              id="title"
            />
          </label>
          <label className=" w-full " htmlFor="">
            <textarea
              required
              value={data.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
              rows={10}
              className="text-base resize-none textarea w-full "
              placeholder="description here.."
              name="description"
              id="description"
            ></textarea>
          </label>
          <div className="flex w-full md:flex-row flex-col gap-5">
            <label className="w-full " htmlFor="">
              <input
                required
                value={data.location}
                onChange={(e) => setData({ ...data, location: e.target.value })}
                className="input w-full"
                type="text"
                placeholder="location"
                name="location"
                id="location"
              />
            </label>
            <label className=" w-full " htmlFor="">
              <div className="flex input appearance-none  justify-center items-center">
                <input
                  required
                  value={data.salary}
                  onChange={(e) => setData({ ...data, salary: e.target.value })}
                  className=" w-full appearance-none"
                  type="number"
                  placeholder="salary"
                  name="salary"
                  id="salary"
                />
                <span>USD</span>
              </div>
            </label>
            <label className=" w-full " htmlFor="">
              <select
                value={data.type}
                onChange={(e) => setData({ ...data, type: e.target.value })}
                className=" w-full select"
                name="type"
                id="type"
              >
                <option disabled value="">
                  Job Type
                </option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="REMOTE">Remote</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </label>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="btn btn-success w-full text-zinc-200"
          >
            {loading ? (
              <div className="loading loading-dots loading-lg"></div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobs;
