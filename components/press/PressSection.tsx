"use client";

import Image from "next/image";

const PressSection = () => {
  return (
    <section className="relative w-full bg-transparent py-20 light">
      <div className=" px-6 lg:px-12">
        <div className=" flex justify-between gap-6  lg:gap-20 items-end relative">
          {/* Left Column - Title and Description (Larger) */}
          <div className="  flex gap-4 md:gap-6 items-start flex-col max-w-2xl border-r md:border-none">
            <h2 className="text-black text-2xl md:text-5xl">Press Synopsis</h2>

            <p className="text-[#646464] text-sm md:text-[28px] leading-tight pr-[40px]">
              STR&apos;s media journey across cinema, interviews, headlines and
              iconic public moments.
            </p>

            {/* <Image
              src="/strsign.png"
              alt="Signature"
              width={200}
              height={200}
              className=" absolute left-[20%] w-20 md:w-40 h-20 md:h-40"
            /> */}
          </div>

          {/* Right Column - Additional Description (Smaller) */}
          <div>
            <div className="text-left max-w-md ">
              <p className="text-[black] text-sm md:text-[20px] leading-tight">
                From press meets and exclusive interviews to headline-making
                coverage... STR&apos;s most impactful media moments curated into
                a single archive
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PressSection;
