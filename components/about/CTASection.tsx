"use client";
import Image from "next/image";
import Link from "next/link";
import PrimaryLinkButton from "../reuseable/PrimaryLinkButton";

const CTASection = () => {
  return (
    <section className=" light relative w-full overflow-hidden px-4 sm:px-6 lg:px-[3vw] py-[6vh]">
      {/* Container */}
      <div
        className="relative w-full mx-auto overflow-hidden rounded-[clamp(16px,2vw,24px)] aspect-4/4 md:aspect-16/6"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/membership/membership-03.png"
            alt="CTA Background"
            fill
            className="object-cover object-[80%_580%] md:object-right"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end md:items-start px-[clamp(1rem,4vw,4rem)]">
          <div className="w-full flex flex-col gap-[clamp(1rem,5vw,4rem)] py-10">
            {/* Text */}
            <h2
              className="
                text-white font-normal leading-tight
                text-[clamp(1.2rem,3.5vw,2.1rem)]
                max-w-[65ch]
              "
            >
              Get a first look at upcoming films, trailers, and music
              <br className="hidden sm:block" />
              that mark the next phase of the journey.
            </h2>

            {/* Actions */}
            <div className="flex flex-col lg:flex-row items-start gap-[clamp(1.5rem,4vw,4rem)]">
              

              <PrimaryLinkButton title="View Updates" href="/press" />

              {/* Signature */}
              {/* <div
                className="absolute top-[60%] md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full max-w-[clamp(220px,45vw,420px)]"
                style={{ aspectRatio: "420 / 184" }}
              >
                <Image
                  src="/strsign.png"
                  alt="STR Signature"
                  fill
                  className="object-contain"
                  style={{
                    filter:
                      "brightness(0) saturate(100%) invert(88%) sepia(85%) saturate(1352%) hue-rotate(360deg) brightness(104%) contrast(101%)",
                  }}
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
