"use client";

import { useState } from "react";
import PrimaryButton from "../reuseable/PrimaryButton";
import MemberIdCard from "./MemberIdCard";

interface VerifyResponse {
  valid: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  message?: string;
  rejectionReason?: string;

  // Approved fields (flat structure)
  membershipId?: string;
  fullName?: string;
  zone?: string;
  district?: string;
  state?: string;
  membershipYear?: number;
  verifiedAt?: string;
}

const TrackMembershipSection = () => {
  const [memberId, setMemberId] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!memberId) return;

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/verify/${memberId}`
      );

      const data: VerifyResponse = await res.json();
      setResult(data);
    } catch {
      setResult({
        valid: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-10">

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">
            Track Your Membership
          </h2>
          <p className="text-neutral-500">
            Enter your Member ID to check your application status
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Member ID"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <PrimaryButton
            title={loading ? "Checking..." : "Check Status"}
            onClick={checkStatus}
            className="w-full md:w-auto"
          />
        </div>

        {/* INVALID */}
        {result && !result.valid && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600">
            {result.message}
          </div>
        )}

        {/* PENDING */}
        {result?.valid && result.status === "PENDING" && (
          <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-700">
            <h3 className="text-xl font-semibold">Application Pending</h3>
            <p className="text-sm mt-2">
              Your membership request is currently under review.
            </p>
          </div>
        )}

        {/* REJECTED */}
        {result?.valid && result.status === "REJECTED" && (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600">
            <h3 className="text-xl font-semibold">Application Rejected</h3>
            <p className="text-sm mt-2">
              {result.rejectionReason || "No reason provided."}
            </p>
          </div>
        )}

        {/* APPROVED */}
        {result?.valid && result.status === "APPROVED" && (
          <div className="mt-8 flex justify-center">
            <MemberIdCard data={result} />
          </div>
        )}

      </div>
    </section>
  );
};

export default TrackMembershipSection;