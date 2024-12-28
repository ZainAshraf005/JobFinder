'use client'
import JobDetails from "@/components/JobDetails";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { id } = useParams();
  const router = useRouter()

  const handleBack = ()=>{
    router.back()
  }

  // Pass the ID or fetched data as a prop
  return (
    <div>
      <div onClick={handleBack} className="absolute z-40 px-2 py-1 left-4 top-2 cursor-pointer rounded-2xl border">
        back
      </div>
      <JobDetails id={id as string} />
    </div>
  );
};

export default Page;
