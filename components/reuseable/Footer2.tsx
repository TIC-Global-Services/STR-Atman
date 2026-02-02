import React from "react";
import Image from "next/image";
import Link from "next/link";
import ContourBackground from "./ContourBackground";

const Footer = () => {
  const footerLinks = [
    { title: "Home", slug: "/" },
    { title: "About", slug: "/about" },
    { title: "Press Desk", slug: "/press" },
    { title: "Music Journey", slug: "/music-journey" },
    { title: "Membership", slug: "/membership" },
    { title: "Merch Store", slug: "/store" },
  ];

  const socialLinks = [
    { title: "Instagram", href: "https://www.instagram.com/silambarasantrofficial/?hl=en" },
    { title: "X", href: "https://x.com/SilambarasanTR_" },
    { title: "Spotify", href: "https://open.spotify.com/artist/5Hn84AFwiTEi8eMoI5B9AS?si=byETKeXhQmmj5HZb0GGzFQ" },
  ];

  return (
    <div className="px-4 sm:px-8 mx-auto w-full bg-[#000] pt-16 sm:pt-20 pb-6 md:pb-0">
      {/* MASKED FOOTER */}
      <div
        className="
          relative flex justify-center overflow-hidden rounded-2xl
          aspect-[375/680] md:aspect-1688/896
          bg-[#ffffff]

          mask-[url(/footer/mask-mob.svg)]
          mask-contain mask-no-repeat mask-center
          md:mask-[url(/footer/mask-desk.svg)]
        "
      >
        <div className="absolute inset-0 z-0">
          {/* PATTERN */}
          <ContourBackground
            lineColor="rgba(0,0,0,0.35)"
            speed={0.05}
            resolution={9}
            levels={8}
            lineWidth={1}
          />
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between">
          {/* ================= MOBILE TOP ROW ================= */}
          <div className="flex md:hidden justify-around px-6 pt-[30%] z-50">
            {/* Pages */}
            <div className="text-center">
              <span className="text-[#474747] text-xs block mb-2">Pages</span>
              {footerLinks.slice(0, 3).map((link, idx) => (
                <div key={idx}>
                  <Link
                    href={link.slug}
                    className=" font-medium hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </div>
              ))}
            </div>

            {/* Follow On */}
            <div className="text-center">
              <span className="text-[#474747] text-xs block mb-2">
                Follow On
              </span>
              {socialLinks.map((social, idx) => (
                <div key={idx}>
                  <Link
                    href={social.href}
                    target="_blank"
                    className=" font-medium hover:text-primary"
                  >
                    {social.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ================= DESKTOP LEFT ================= */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[7%] xl:left-[15%] z-50 text-center">
            <span className="text-[#474747] text-xs block mb-2">Pages</span>
            {footerLinks.map((link, idx) => (
              <div key={idx}>
                <Link
                  href={link.slug}
                  className="font-medium text-lg 2xl:text-xl hover:text-primary"
                >
                  {link.title}
                </Link>
              </div>
            ))}
          </div>

          {/* ================= CENTER ================= */}
          <div className="relative w-full flex flex-col md:justify-start text-center px-4">
            {/* Overlay Text */}
            <div className="z-20 pb-[100%] md:pb-0 md:pt-[10%]">
              <h2 className="text-3xl lg:text-[80px] font-medium uppercase leading-tighter lg:leading-20">
                <span className="text-primary">Stronger</span> than <br />
                Yesterday
              </h2>
            </div>

            {/* Simbu Image */}
            <Image
              src="/Str_footer.png"
              alt="STR"
              width={400}
              height={400}
              priority
              className="
                pointer-events-none
                object-contain
                absolute bottom-0 z-50
                left-1/2 -translate-x-1/2
                w-[85%] sm:w-[60%] md:w-[37%]
              "
            />
          </div>

          {/* ================= DESKTOP RIGHT ================= */}
          <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-[7%] xl:right-[15%] z-50 text-center">
            <span className="text-[#474747] text-xs block mb-2">Follow On</span>
            {socialLinks.map((social, idx) => (
              <div key={idx}>
                <Link
                  href={social.href}
                  target="_blank"
                  className="font-medium text-lg 2xl:text-xl hover:text-primary"
                >
                  {social.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="absolute  z-50 flex flex-col sm:flex-row gap-2  md:w-[75%] items-end md:items-end justify-between bottom-0 md:bottom-[8dvh] right-2 md:right-6 text-[clamp(0.75rem,0.4rem+0.4vw,0.95rem)] text-[#FDFDFD] px-4 ">
        <p>© {new Date().getFullYear()} Silambarasan TR. All rights reserved</p>
        <p>
          Designed & Developed by{" "}
          <Link
            href="https://www.theinternetcompany.one/"
            target="_blank"
            className="underline underline-offset-4 hover:opacity-80"
          >
            TIC Global Services
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Footer;
