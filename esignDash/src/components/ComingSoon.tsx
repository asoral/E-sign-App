import React from "react";

const ComingSoon: React.FC = () => {
  return (
    <section className="w-[80vw] h-full flex items-center justify-center bg-zinc-100  relative ">
      <div className="relative">
        <h1 className="text-[90px] leading-[100px] uppercase p-5 bg-[#283C42] text-zinc-200 skew-y-[-10deg] font-semibold">
          Coming Soon
        </h1>
        <h2 className="absolute right-0 bottom-[-44px] text-[30px] leading-[30px] uppercase p-5 bg-white text-[#283C42] skew-y-[-10deg] font-semibold shadow-lg">
          Under Development
        </h2>
      </div>
    </section>
  );
};

export default ComingSoon;
