"use client";

import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../reuseable/PrimaryButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ---------------- Sub components ---------------- */

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  onChange,
  value,
  error,
}: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-xl text-black text-sm outline-none transition-all duration-300
        ${
          error
            ? "border border-red-500 bg-red-50"
            : "bg-gray-50 border border-gray-100 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5"
        }`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="col-span-full flex items-center gap-4 pt-4 pb-1">
    <span className="text-[11px] font-black text-black/30 uppercase tracking-[0.2em] whitespace-nowrap">
      {title}
    </span>
    <div className="h-[1px] w-full bg-gray-100" />
  </div>
);

/* ---------------- Component ---------------- */

interface MembershipFormProps {
  showPopup: boolean;
  onClose: () => void;
}

const MembershipForm = ({ showPopup, onClose }: MembershipFormProps) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmailVerified(false);
      setOtpSent(false);
      setOtp("");
      setTimer(0);
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const sendOtp = async () => {
    if (!formData.email) {
      toast.error("Enter email first");
      return;
    }

    try {
      setOtpLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent to your email");
      setOtpSent(true);
      setTimer(60);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6 digit OTP");
      return;
    }

    try {
      setVerifyLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            otp,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success("Email verified successfully");
      setEmailVerified(true);
      setOtpSent(false);
    } catch {
      toast.error("Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const newErrors: any = {};

    if (!formData.fullName || formData.fullName.length < 3)
      newErrors.fullName = "Minimum 3 characters required";

    if (!formData.dob) newErrors.dob = "Date of birth required";

    if (!formData.bloodGroup)
      newErrors.bloodGroup = "Please select blood group";

    if (!formData.occupation) newErrors.occupation = "Occupation required";

    if (!/^\d{12}$/.test((formData.aadharNumber || "").replace(/\s/g, "")))
      newErrors.aadharNumber = "Aadhar must be 12 digits";

    if (!/^\S+@\S+\.\S+$/.test(formData.email || ""))
      newErrors.email = "Invalid email address";

    if (!/^[6-9]\d{9}$/.test(formData.phone || ""))
      newErrors.phone = "Invalid phone number";

    if (!formData.address) newErrors.address = "Address required";

    if (!formData.zone) newErrors.zone = "Zone required";

    if (!formData.district) newErrors.district = "District required";

    if (!formData.state) newErrors.state = "State required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email before submitting");
      return;
    }
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/membership/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Application failed");
        return;
      }

      toast.success("Application submitted successfully 🎉");
      onClose();
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 max-w-4xl w-full my-auto relative shadow-2xl border max-h-[90dvh] md:max-h-[80dvh] overflow-y-auto no-scrollbar"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300"
            >
              ✕
            </button>

            {/* TITLE PRESERVED */}
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-none mb-3">
                MEMBERSHIP <span className=" text-primary">APPLICATION</span>
              </h2>
              <p className="text-gray-500 font-medium max-w-lg">
                A verified STR community built on admiration and respect, where
                fans connect and stay updated through official moments.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <SectionHeader title="Personal Identity" />

              <FormField
                label="Full Name"
                name="fullName"
                required
                onChange={handleChange}
                value={formData.fullName}
                error={errors.fullName}
              />
              <FormField
                label="Date of Birth"
                name="dob"
                type="date"
                required
                onChange={handleChange}
                value={formData.dob}
                error={errors.dob}
              />

              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl text-sm outline-none
                    ${
                      errors.bloodGroup
                        ? "border border-red-500 bg-red-50"
                        : "bg-gray-50 border border-gray-100 focus:bg-white focus:border-black"
                    }`}
                >
                  <option value="">Select Group</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ),
                  )}
                </select>
                {errors.bloodGroup && (
                  <span className="text-xs text-red-500">
                    {errors.bloodGroup}
                  </span>
                )}
              </div>

              <FormField
                label="Occupation"
                name="occupation"
                required
                onChange={handleChange}
                value={formData.occupation}
                error={errors.occupation}
              />
              <FormField
                label="Aadhar Number"
                name="aadharNumber"
                required
                onChange={handleChange}
                value={formData.aadharNumber}
                error={errors.aadharNumber}
              />

              <SectionHeader title="Contact Information" />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                onChange={handleChange}
                value={formData.email}
                error={errors.email}
                disabled={emailVerified}
              />

              {/* OTP Section */}
              {!emailVerified && (
                <div className="col-span-full flex flex-col gap-3">
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpLoading}
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm w-fit"
                    >
                      {otpLoading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Enter 6 digit OTP"
                          value={otp}
                          maxLength={6}
                          onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                          }
                          className="px-4 py-2 border rounded-lg text-sm"
                        />

                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={verifyLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                        >
                          {verifyLoading ? "Verifying..." : "Verify"}
                        </button>
                      </div>

                      {timer > 0 ? (
                        <span className="text-xs text-gray-500">
                          Resend in {timer}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={sendOtp}
                          className="text-xs text-blue-600"
                        >
                          Resend OTP
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {emailVerified && (
                <span className="text-green-600 text-sm font-semibold col-span-full">
                  ✓ Email Verified
                </span>
              )}
              <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                required
                onChange={handleChange}
                value={formData.phone}
                error={errors.phone}
              />

              <SectionHeader title="Location Details" />

              <div className="col-span-full">
                <FormField
                  label="Residential Address"
                  name="address"
                  required
                  onChange={handleChange}
                  value={formData.address}
                  error={errors.address}
                />
              </div>

              <FormField
                label="Zone"
                name="zone"
                required
                onChange={handleChange}
                value={formData.zone}
                error={errors.zone}
              />
              <FormField
                label="District"
                name="district"
                required
                onChange={handleChange}
                value={formData.district}
                error={errors.district}
              />
              <FormField
                label="State"
                name="state"
                required
                onChange={handleChange}
                value={formData.state}
                error={errors.state}
              />

              <SectionHeader title="Social Presence" />

              <FormField
                label="Instagram ID"
                name="instagramId"
                onChange={handleChange}
                value={formData.instagramId}
              />
              <FormField
                label="X (Twitter) ID"
                name="xTwitterId"
                onChange={handleChange}
                value={formData.xTwitterId}
              />

              <div className="col-span-full flex flex-col items-center gap-4 mt-8">
                <PrimaryButton
                  title={loading ? "Submitting..." : "Complete Registration"}
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Secure & Verified Environment
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MembershipForm;
