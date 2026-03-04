export interface ApplyMembershipPayload {
  fullName: string;
  dob: string;
  bloodGroup?: string;
  aadhaarNumber: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  existingClub?: string;
  fanClubName?: string;
  chapterLocation?: string;
  willingToJoin?: string;
  chapterLead?: string;
  fanDuration?: string;
  favoriteMovie?: string;
  favoriteSong?: string;
  socialHandle?: string;
  tshirtSize?: string;
  membershipType: string;
  agreeTerms: boolean;
  ageConfirm: boolean;
}

export const membershipApi = {
  sendOtp: async (email: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/send-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to send OTP");
    }

    return res.json();
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Invalid OTP");
    }

    return res.json();
  },

  apply: async (payload: any) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/membership/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to apply");
    }

    return res.json();
  },
};