import { apiHandler } from "@/handlers/apiErrorHandler";
import { setSelected } from "@/redux/features/selectedSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { GoChevronRight } from "react-icons/go";

const Drawer: React.FC = () => {
  const selected = useAppSelector((state) => state.selected.selected);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string>("account");
  const buttonRef = useRef<HTMLLabelElement | null>(null);
  const changePage = (page: string) => {
    if (buttonRef.current) buttonRef.current.click();
    dispatch(setSelected(page));
  };

  useEffect(() => {
    setActiveButton(selected);
  }, [selected]);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.post("/api/auth/delete", { id });
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/logout");
      }
    } catch (error: unknown) {
      apiHandler(error);
    }
  };

  const getButtonStyle = (page: string) => {
    return activeButton === page
      ? { backgroundColor: "rgb(39 44 51)", color: "white" }
      : { backgroundColor: "transparent", color: "white" };
  };
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-2"
            ref={buttonRef}
            className=" drawer-button z-10 lg:hidden border border-l-0 text-xl rounded-r-full p-1 absolute top-3 left-0"
          >
            <GoChevronRight />
          </label>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 flex flex-col gap-2 text-base-content min-h-full w-80 p-4">
            {/* user content here */}
            <Link
              className="px-3 py-1 border-zinc-600 rounded-xl border w-fit"
              href={"/"}
            >
              HomePage
            </Link>

            <li
              className="rounded-lg mt-5"
              onClick={() => changePage("account")}
              style={getButtonStyle("account")}
            >
              <a>My Account</a>
            </li>
            {user?.role === "job seeker" && (
              <>
                <li
                  className="rounded-lg"
                  onClick={() => changePage("applied")}
                  style={getButtonStyle("applied")}
                >
                  <a>Applied Jobs</a>
                </li>
                <li
                  className="rounded-lg"
                  onClick={() => changePage("new_jobs")}
                  style={getButtonStyle("new_jobs")}
                >
                  <a>Find Jobs</a>
                </li>
              </>
            )}
            {user?.role === "employer" && (
              <>
                <li
                  className="rounded-lg"
                  onClick={() => changePage("my_jobs")}
                  style={getButtonStyle("my_jobs")}
                >
                  <a>My Jobs</a>
                </li>
                <li
                  className="rounded-lg"
                  onClick={() => changePage("create")}
                  style={getButtonStyle("create")}
                >
                  <a>Add New Job </a>
                </li>
              </>
            )}

            <Link className="btn btn-success" href={"/logout"}>
              Logout
            </Link>
            <div>
              {/* Open the modal using document.getElementById('ID').showModal() method */}
              <button
                className="btn btn-error btn-block"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Delete Account
              </button>

              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Reminder!</h3>
                  <p className="py-4 text-lg">
                    This will permanently delete your account
                  </p>
                  <div className="modal-action">
                    <button
                      onClick={() => handleDelete(user?.id as string)}
                      className="btn btn-error"
                    >
                      delete
                    </button>
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
