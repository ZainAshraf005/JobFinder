"use client";
import Account from "@/components/Account";
import AppliedJobs from "@/components/AppliedJobs";
import CreateJobs from "@/components/CreateJobs";
import Drawer from "@/components/Drawer";
import MyJobs from "@/components/MyJobs";
import NewJobs from "@/components/NewJobs";
import { useAppSelector } from "@/redux/hooks/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState("account");
  const selected = useAppSelector((state) => state.selected.selected);
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setPage(selected);
  }, [page, selected]);

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      toast.error("Unauthorized attempt, access denied");
      router.push("/");
    }
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex h-screen ">
      <Drawer />
      <div className="w-full  h-screen flex justify-center items-center">
        {page === "account" && <Account />}
        {page === "applied" && <AppliedJobs />}
        {page === "new_jobs" && <NewJobs />}
        {page === "create" && <CreateJobs />}
        {page === "my_jobs" && <MyJobs />}
      </div>
    </div>
  );
};

export default Page;
