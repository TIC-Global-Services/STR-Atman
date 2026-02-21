'use client'
import Image from "next/image";
import React, { useState } from "react";
import PrimaryButton from "../reuseable/PrimaryButton";
import MembershipForm from "./MembershipForm";
import Link from "next/link";

const BecomeAMember = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section className=" light">
      <div className=" flex items-center flex-col justify-center space-y-4 text-center ">
        <h1 className=" text-3xl md:text-5xl">Become a Verified Member</h1>
        <p className=" text-neutral-500 text-xl max-w-lg">
          Gain access to exclusive benefits, priority support, and full fan
          privileges.
        </p>
        <Image
          src={"/membership/fans.webp"}
          alt="Fans Malyasia Meet"
          width={500}
          height={500}
          className=" w-[90%] md:w-[70%] aspect-square md:aspect-video object-cover rounded-xl"
        />

        <div className=" space-y-4 py-4">
          <PrimaryButton
            onClick={() => setShowPopup(true)}
            title="Apply for Membership"
            className="mx-auto"
          />

          <p>Already applied? <Link href={'/membership#track'} className=" text-primary hover:underline">Track your application →</Link></p>
        </div>
      </div>
      <MembershipForm
        showPopup={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
};

export default BecomeAMember;
