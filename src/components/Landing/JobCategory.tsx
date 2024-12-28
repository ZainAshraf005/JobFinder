import React from "react";
import ScrollingText from "../ScrollingText";

const JobCategory = () => {
  return (
    <div className="bg-primary-content px-4 pb-10 w-full h-screen text-white  justify-center flex flex-col items-center ">
      <h1 className="md:text-6xl text-3xl text-gray-200 md:mt-16 mb-12  font-semibold leading-10">
        <div className="inline">
          Land your Dream Job <br /> with
        </div>
        <div className="bg-pink-600 -z-10 inline-block"> &quot;Ease and Speed&quot;</div>
      </h1>
      <ScrollingText />
    </div>
  );
};

export default JobCategory;
