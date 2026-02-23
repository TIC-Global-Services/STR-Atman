"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";
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
  const [showBack, setShowBack] = useState(false);

  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${data.membershipId}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const dataUrl = await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 3,
    });

    const link = document.createElement("a");
    link.download = `${data.membershipId}-membership-card.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <section className="w-full flex flex-col items-center gap-6">

      <div
        ref={cardRef}
        className="relative w-full max-w-[520px] h-[30dvh] md:h-[40dvh] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl  text-white bg-neutral-950"
      >
        {!showBack ? (
          <>
            {/* FRONT SIDE */}

            <div className="absolute inset-y-0 left-0 w-[80%] h-full pointer-events-none">
              <Image
                src="/IdCard/str-idcard-3.jpg"
                alt="STR Background"
                fill
                className="object-cover object-left opacity-70 scale-[100%]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/50 to-neutral-950 w-full" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-[#C6A85E]/10 via-transparent to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">

              {/* Header */}
              <div className="flex justify-between items-start text-start">
                <div>
                  <h3 className="
                    text-[10px] sm:text-xs uppercase tracking-[0.3em]
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                  ">
                    STR OFFICIAL MEMBERSHIP
                  </h3>

                  <h2 className="
                    text-lg sm:text-2xl font-semibold mt-2 tracking-wide
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                    drop-shadow-[0_0_6px_rgba(230,200,120,0.3)]
                  ">
                    {data.fullName}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-[9px] sm:text-[10px] text-neutral-500">
                    Member Since
                  </p>
                  <p className="text-xs sm:text-sm font-medium bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent">
                    {data.membershipYear}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-xs sm:text-sm mt-2">
                <div className="flex justify-between">
                  <span className="text-neutral-200">Member ID</span>
                  <span className="
                    font-medium tracking-wide
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                  ">
                    {data.membershipId}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-200">Zone</span>
                  <span className="
                    font-medium tracking-wide
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                  ">{data.zone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-200">District</span>
                  <span className="
                    font-medium tracking-wide
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                  ">{data.district}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-neutral-200">State</span>
                  <span className="
                    font-medium tracking-wide
                    bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                    bg-clip-text text-transparent
                  ">{data.state}</span>
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

            <div className="absolute bottom-4 right-6 text-[70px] sm:text-[90px] font-black text-white/5 tracking-widest pointer-events-none">
              STR
            </div>
          </>
        ) : (
          <>
            {/* BACK SIDE */}

            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:20px_20px]" />

            <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">

              <div className="text-center space-y-2">
                <h3 className="
                  text-xs uppercase tracking-[0.4em]
                  bg-gradient-to-r from-[#C6A85E] via-[#E6C878] to-[#B88A2E]
                  bg-clip-text text-transparent
                ">
                  DIGITAL VERIFICATION
                </h3>

                <p className="text-xs text-neutral-500">
                  Scan QR to verify authenticity of this membership card
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 py-2">
                <div className="bg-white p-3 rounded-lg shadow-xl">
                  <QRCodeCanvas
                    value={verificationUrl}
                    size={100}
                    level="H"
                  />
                </div>

                <p className="text-[10px] text-neutral-500 break-all text-center">
                  {verificationUrl}
                </p>
              </div>

              <div className="text-center border-t border-white/10 pt-4 space-y-2">

                <p className="text-[10px] text-neutral-500">
                  If QR does not validate, this card is not legitimate.
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 right-6 text-[70px] font-black text-white/5 tracking-widest pointer-events-none">
              STR
            </div>
          </>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4">
        <PrimaryButton
          title={showBack ? "Show Front" : "Show Back"}
          onClick={() => setShowBack(!showBack)}
        />
        <PrimaryButton
          title="Download Card"
          onClick={handleDownload}
        />
      </div>
    </section>
  );
}