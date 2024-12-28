import { apiHandler } from "@/handlers/apiErrorHandler";
import { setApplications } from "@/redux/features/appliedJobsSlice";
import { useAppDispatch } from "@/redux/hooks/hooks";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ApplicationsProps {
  id: string;
}

interface Application {
  coverLetter: string;
  id: string;
  user: {
    name: string;
    email: string;
  };
}

type AppArray = Application[];

const Applications: React.FC<ApplicationsProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const [application, setApplication] = useState<AppArray>();
  const [loading, setLoading] = useState<boolean>(false);
  const getApplications = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/application/jobid`, {
        id: jobId,
      });
      if (response.data.success) {
        setLoading(false);
        setApplication(response.data.applications);
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };
  const handleDelete = async (
    elem: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    elem.stopPropagation();
    try {
      const response = await axios.post("/api/application/delete", { id });
      if (response.data.success) {
        toast.success(response.data.message);
        setApplication((prev) => prev?.filter((e) => e.id !== id));
        dispatch(setApplications(application?.filter((e) => e.id !== id)));
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };
  useEffect(() => {
    getApplications(id);
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="border-gray-600 bg-transparent rounded-lg shadow-lg">
        <h1 className="text-center p-3 md:text-lg text-sm ">Applications</h1>
        <hr className="border-gray-700" />
        <div className=" w-full grid gap-4 mt-4 grid-cols-2 ">
          {application && application.length === 0 ? (
            <div className="col-span-2 text-gray-600 md:text-lg text-sm text-center">
              no applications
            </div>
          ) : (
            application?.map((app, ind) => (
              <div
                key={ind}
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
                className="border cursor-pointer border-gray-700 overflow-hidden flex items-center justify-between gap-5 rounded-2xl p-4"
              >
                {/* Open the modal using document.getElementById('ID').showModal() method */}

                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box  bg-primary-content">
                    <div className="flex gap-5 items-center">
                      <div className="w-14 h-14 rounded-full ">
                        <div
                          style={{
                            backgroundImage: `url(/uploads/${app.user.email}/profile/profile.png)`,
                          }}
                          className="bg-cover bg-center bg-no-repeat w-full h-full rounded-full"
                        ></div>
                      </div>
                      <h3 className=" text-lg">{app.user.name}</h3>
                    </div>
                    <p className="py-4 text-lg whitespace-pre-line">
                      {app.coverLetter}
                    </p>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-error outline-none">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
                <div className="w-14 h-14 rounded-full ">
                  <div
                    style={{
                      backgroundImage: `url(/uploads/${app.user.email}/profile/profile.png)`,
                    }}
                    className="bg-cover bg-center bg-no-repeat w-full h-full rounded-full"
                  ></div>
                </div>
                <div className="w-56">
                  <div>
                    <h1 className="capitalize">{app.user.name}</h1>
                  </div>
                  <div>
                    <p className="whitespace-nowrap first-letter:uppercase text-zinc-400 overflow-hidden text-ellipsis">
                      {app.coverLetter}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 justify-center ">
                  <Link
                    href={`/uploads/${app.user.email}/resume/resume.pdf`}
                    target="_blank"
                    className="btn btn-primary btn-sm"
                  >
                    Resume
                  </Link>
                  <button
                    onClick={(elem) => handleDelete(elem, app.id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
          {loading ? (
            <div className=" w-full flex col-span-2 justify-center text-gray-800">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;
