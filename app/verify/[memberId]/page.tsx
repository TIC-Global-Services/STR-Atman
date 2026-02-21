// app/verify/[memberId]/page.tsx

interface VerifyResponse {
  valid: boolean;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  fullName?: string;
  membershipId?: string;
  zone?: string;
  district?: string;
  state?: string;
  membershipYear?: number;
  verifiedAt?: string;
}

async function verifyMember(memberId: string): Promise<VerifyResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/verify/${memberId}`,
      { cache: "no-store" }
    );

    if (!res.ok) return { valid: false };

    return res.json();
  } catch (err) {
    console.error("Verification error:", err);
    return { valid: false };
  }
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  // ✅ UNWRAP PARAMS (required in your Next version)
  const { memberId } = await params;

  const data = await verifyMember(memberId);

  /* ================= INVALID ================= */
  if (!data.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-red-500/10 border border-red-500/30 text-center">
          <h2 className="text-2xl font-bold text-red-400">
            Invalid Membership
          </h2>
          <p className="mt-3 text-neutral-400">
            This Member ID is not registered.
          </p>
        </div>
      </div>
    );
  }

  /* ================= NOT APPROVED ================= */
  if (data.status !== "APPROVED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-yellow-500/10 border border-yellow-500/30 text-center">
          <h2 className="text-2xl font-bold text-yellow-400">
            Membership Not Approved
          </h2>
          <p className="mt-3 text-neutral-400">
            This membership is under review or rejected.
          </p>
        </div>
      </div>
    );
  }

  /* ================= APPROVED ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white p-6">
      <div className="max-w-lg w-full p-10 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center shadow-xl">

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-400 rounded-full animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold text-emerald-400">
            Verified Member
          </h2>
        </div>

        <div className="mt-8 space-y-3 text-neutral-300 text-sm">
          <p className="text-lg font-semibold text-white">
            {data.fullName}
          </p>

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Member ID</span>
              <span>{data.membershipId}</span>
            </div>

            {data.zone && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Zone</span>
                <span>{data.zone}</span>
              </div>
            )}

            {data.district && (
              <div className="flex justify-between">
                <span className="text-neutral-500">District</span>
                <span>{data.district}</span>
              </div>
            )}

            {data.state && (
              <div className="flex justify-between">
                <span className="text-neutral-500">State</span>
                <span>{data.state}</span>
              </div>
            )}

            {data.membershipYear && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Member Since</span>
                <span>{data.membershipYear}</span>
              </div>
            )}

            {data.verifiedAt && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Verified On</span>
                <span>
                  {new Date(data.verifiedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-neutral-500">
          Official STR Digital Membership Verification System
        </p>
      </div>
    </div>
  );
}