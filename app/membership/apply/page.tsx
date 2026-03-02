"use client";

import MembershipForm from "@/components/membership/MembershipForm";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-neutral-900 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
          STR GLOBAL FAN REGISTRY
        </h1>

        <p className="max-w-2xl mx-auto text-neutral-400 text-lg">
          Become an officially registered member of the STR global community.
          Connect, celebrate, and experience exclusive moments.
        </p>
      </section>

      {/* Form Section */}
      <section className="relative z-10 pb-32 px-6">
        <div className="max-w-4xl mx-auto bg-white text-black rounded-3xl p-8 md:p-14 shadow-2xl">
          <MembershipForm />
        </div>
      </section>
    </div>
  );
}