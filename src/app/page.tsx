"use client";

import Footer from "@/components/Landing/Footer";
import HowItWorks from "@/components/Landing/HowItWorks";
import JobCategory from "@/components/Landing/JobCategory";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main
      style={{ backgroundImage: "url(/bg)" }}
      className="w-full bg-cover bg-no-repeat  flex flex-col justify-center items-center"
    >
      <Navbar />

      <JobCategory />
      <HowItWorks />
      <Footer />
    </main>
  );
}
