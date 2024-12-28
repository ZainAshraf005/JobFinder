import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import { useAppSelector } from "@/redux/hooks/hooks";

const Account = () => {
  const user = useAppSelector((state) => state.user.user);
  const [imgBg, setImgBg] = useState("/default-profile.png");
  useEffect(() => {
    if (user?.email) setImgBg(`/uploads/${user?.email}/profile/profile.png`);
  }, [user]);

  return (
    <div className="w-full relative overflow-y-hidden h-full">
      <div>
        <FileUpload cImage={imgBg} />

        <hr />
      </div>
      <div className="  m-6 h-96 flex flex-col gap-5 pt-5">
        <div className="border-b border-gray-800">
          <div className="flex justify-between text-lg capitalize p-3 gap-4 w-[50%] mx-auto ">
            <div className="w-full">name</div>
            <div className="w-full">{user?.name}</div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between text-lg capitalize p-3 gap-4 w-[50%] mx-auto ">
            <div className="w-full">email</div>
            <div className="w-full normal-case">{user?.email}</div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between text-lg capitalize p-3 gap-4 w-[50%] mx-auto ">
            <div className="w-full">role</div>
            <div className="w-full">{user?.role}</div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between text-lg capitalize p-3 gap-4 w-[50%] mx-auto ">
            <div className="w-full">photo</div>
            <div className="w-full normal-case">
              {user?.photo ? user?.photo : "no picture selected"}
            </div>
          </div>
        </div>
        <div className="border-b border-gray-800">
          <div className="flex justify-between text-lg capitalize p-3 gap-4 w-[50%] mx-auto ">
            <div className="w-full">resume</div>
            <div className="w-full normal-case">no resume uploaded</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
