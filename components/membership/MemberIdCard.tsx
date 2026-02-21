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
      
      {/* CARD CONTAINER */}
      <div
        ref={cardRef}
        className="relative w-full max-w-[520px] aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white bg-neutral-950"
      >
        {/* TOGGLE */}
        {!showBack ? (
          <>
            {/* ================= FRONT ================= */}
            <div className="absolute inset-y-0 left-0 w-[55%] pointer-events-none">
              <Image
                src="/STR/Str-2b.png"
                alt="STR Background"
                fill
                className="object-contain object-left opacity-70 scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-950/80 to-neutral-950" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
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

            <div className="absolute bottom-4 right-6 text-[60px] sm:text-[90px] font-black text-white/5 tracking-widest pointer-events-none">
              STR
            </div>
          </>
        ) : (
          <>
            {/* ================= BACK  ================= */}

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_0)] bg-[size:20px_20px]" />

            <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">

              {/* Header */}
              <div className="text-center space-y-2">
                <h3 className="text-xs uppercase tracking-[0.4em] text-neutral-400">
                  DIGITAL VERIFICATION
                </h3>
                <p className="text-xs text-neutral-500">
                  Scan QR to verify authenticity of this membership card
                </p>
              </div>

              {/* QR Section */}
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

              {/* Footer */}
              <div className="text-center border-t border-white/10 pt-4 space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    OFFICIAL MEMBERS IDENTIFICATOR
                  </span>
                </div>

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