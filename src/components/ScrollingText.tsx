import React from "react";

const ScrollingText = () => {
    const linksArr = ['/microsoft.png','/facebook.png','/samsung.png','/spotify.webp','/twitter.png','/lenovo.png','/google.png','/amazon.png']
  return (
    <div className=" w-full mt-24 md:px-8">
      <p className="text-lg my-4 md:pl-10 text-gray-500">companies that want&apos;s to work with us</p>
      <div className="w-full my-7  justify-items-center grid md:grid-cols-8 gap-4 grid-cols-4 ">
        {linksArr.map((e,i)=><div key={i}
          style={{ backgroundImage: `url(${e})` }}
          className="md:w-24 md:h-24 w-12 h-12 bg-contain bg-center bg-no-repeat rounded-xl bg-zinc-100"
        ></div>)}
        
      </div>
    </div>
  );
};

export default ScrollingText;
