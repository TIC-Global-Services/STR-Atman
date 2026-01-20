import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const footerLinks = [
    { title: "Home", slug: "/" },
    { title: "About", slug: "/about" },
    { title: "Press Desk", slug: "/press-desk" },
    { title: "Music Journey", slug: "/music-journey" },
    { title: "Membership", slug: "/membership" },
    { title: "Merch Store", slug: "/" },
  ];

  const socialLinks = [
    { title: "Instagram", href: "/" },
    { title: "X", href: "/" },
    { title: "Spotify", href: "/" },
  ];

  return (
    <div className="px-4 sm:px-8 mx-auto w-full bg-[#B0BD91] pt-16 sm:pt-20 pb-10">
      {/* MASKED FOOTER */}
      <div
        className="
          relative flex justify-center overflow-hidden rounded-2xl
          aspect-[375/680] md:aspect-1688/896
          bg-[#bbc6a1]

          mask-[url(/footer/mask-mob.svg)]
          mask-contain mask-no-repeat mask-center
          md:mask-[url(/footer/mask-desk1440-2.svg)]
        "
      >
        {/* PATTERN */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/footer/pattern.jpg"
            alt="Pattern"
            fill
            className="object-cover opacity-20 pointer-events-none"
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
                <span className="text-white">Stronger</span> than <br />
                Yesterday
              </h2>
            </div>

            {/* Simbu Image */}
            <Image
              src="/footersimbu.png"
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
            <span className="text-[#474747] text-xs block mb-2">
              Follow On
            </span>
            {socialLinks.map((social, idx) => (
              <div key={idx}>
                <Link
                  href={social.href}
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
      <div className="relative z-50 md:-mt-4 xl:-mt-10 mt-6 flex flex-col sm:flex-row gap-2 w-full items-center justify-between text-[clamp(0.75rem,0.6rem+0.4vw,0.95rem)]">
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
