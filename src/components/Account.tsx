import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import { useAppSelector } from "@/redux/hooks/hooks";
import ApplyForm from "./ApplyForm";
import UpdateProfile from "./UpdateProfile";
import Tooltip from "./Tooltip";

const Account = () => {
  const user = useAppSelector((state) => state.user.user);
  const [slider, setSlider] = useState(false);
  const [profileSlider, setProfileSlider] = useState(false);
  const [imgBg, setImgBg] = useState(
    `/uploads/${user?.email}/profile/profile.png`
  );
  const handleResumeClick = () => {
    setSlider(!slider);
  };
  useEffect(() => {
    if (user?.email) setImgBg(`/uploads/${user?.email}/profile/profile.png`);
  }, [user?.email]);

  return (
    <div className="w-full relative overflow-y-hidden h-full">
      <ApplyForm slider={slider} setSlider={setSlider} />
      <UpdateProfile slider={profileSlider} setSlider={setProfileSlider} />
      <div>
        <FileUpload cImage={imgBg as string} />

        <hr />
      </div>
      <div className="  m-6 h-96 flex flex-col text-base md:text-lg capitalize text-center gap-5 pt-5">
        <Tooltip text="click to update name">
          <div className="border-b cursor-pointer border-gray-800">
            <div
              onClick={() => setProfileSlider(!profileSlider)}
              className="flex justify-between  p-3 gap-4   lg:w-[50%] mx-auto "
            >
              <div className="w-full ">name</div>
              <div className="w-full ">{user?.name}</div>
            </div>
          </div>
        </Tooltip>
        <div className="border-b border-gray-800">
          <div className="flex justify-between   p-3 gap-4  lg:w-[50%] mx-auto ">
            <div className="w-full">email</div>
            <div className="w-full normal-case">{user?.email}</div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between   p-3 gap-4   lg:w-[50%] mx-auto ">
            <div className="w-full">role</div>
            <div className="w-full">{user?.role}</div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between   p-3 gap-4   lg:w-[50%] mx-auto ">
            <div className="w-full">photo</div>
            <div className="w-full normal-case">
              {user?.photo ? user?.photo : "no picture selected"}
            </div>
          </div>
        </div>
        {user?.role === "job seeker" && (
          <Tooltip text="click to upload resume">
            <div className="border-b border-gray-800">
              <div
                onClick={handleResumeClick}
                className="flex justify-between cursor-pointer p-3 gap-4 lg:w-[50%] mx-auto "
              >
                <div className="w-full">resume</div>
                <div className="w-full normal-case">
                  {user?.resume ? "resume.pdf" : "no resume uploaded"}
                </div>
              </div>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Account;
