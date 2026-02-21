"use client";

import Image from "next/image";
import { useRef } from "react";
import { toPng } from "html-to-image";
import PrimaryButton from "../reuseable/PrimaryButton";

interface Props {
  data: {
    membershipId?: string;
    fullName?: string;
    zone?: string;
    district?: string;
    state?: string;
    membershipYear?: number;
    verifiedAt?: string;
  };
}

export default function MemberIdCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3, // high quality export
    });

    const link = document.createElement("a");
    link.download = `${data.membershipId}-membership-card.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <section className=" light w-full flex flex-col items-center gap-6">
      {/* CARD */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[520px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white bg-neutral-950"
      >
        {/* Left STR Image */}
        <div className="absolute inset-y-0 left-0 w-[55%] pointer-events-none">
          <Image
            src="/STR/Str-2b.png"
            alt="STR Background"
            fill
            className="object-contain object-left opacity-70 scale-110"
            priority
          />

          {/* Smooth Fade Blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/80 to-neutral-950" />
        </div>

        {/* Green Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent" />

        <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start text-start">
            <div>
              <h3 className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-neutral-400">
                STR OFFICIAL MEMBERSHIP
              </h3>
              <h2 className="text-lg sm:text-2xl font-semibold mt-2 tracking-wide">
                {data.fullName}
              </h2>
            </div>

            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] text-neutral-500">
                Member Since
              </p>
              <p className="text-xs sm:text-sm font-medium">
                {data.membershipYear}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm mt-2">
            <div className="flex justify-between">
              <span className="text-neutral-400">Member ID</span>
              <span className="font-medium tracking-wide">
                {data.membershipId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">Zone</span>
              <span>{data.zone}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">District</span>
              <span>{data.district}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-neutral-400">State</span>
              <span>{data.state}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-emerald-400">
                VERIFIED
              </span>
            </div>

            {data.verifiedAt && (
              <span className="text-[9px] sm:text-[10px] text-neutral-500">
                Verified {new Date(data.verifiedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* STR Watermark */}
        <div className="absolute bottom-4 right-6 text-[60px] sm:text-[90px] font-black text-white/5 tracking-widest pointer-events-none">
          STR
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <PrimaryButton
        title="Download Membership Card"
        onClick={handleDownload}
      />
    </section>
  );
}
