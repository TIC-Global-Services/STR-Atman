"use client";

import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../reuseable/PrimaryButton";
import { useState } from "react";

/* ---------------- Sub components ---------------- */

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  onChange,
}: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-black placeholder:text-gray-300 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 transition-all duration-300 outline-none text-sm"
    />
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
  const [formData, setFormData] = useState({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Member Data:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
        {showPopup && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4  "
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 max-w-4xl w-full my-auto relative shadow-2xl z-99 border border-white/20 max-h-[90dvh] md:max-h-[80dvh] overflow-y-auto no-scrollbar"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-10 text-center md:text-left ">
                <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-none mb-3">
                  MEMBERSHIP <span className=" text-primary">APPLICATION</span>
                </h2>
                <p className="text-gray-500 font-medium  max-w-lg">
                  A verified STR community built on admiration and respect,
                  where fans connect and stay updated through official moments.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 "
              >
                <SectionHeader title="Personal Identity" />
                <FormField
                  label="Full Name"
                  name="name"
                  placeholder="Enter name"
                  required
                  onChange={handleChange}
                />
                <FormField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  required
                  onChange={handleChange}
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 ml-1">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:border-black outline-none appearance-none text-sm"
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
                </div>
                <FormField
                  label="Occupation"
                  name="occupation"
                  placeholder="Your profession"
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="Aadhar Number"
                  name="aadhar"
                  placeholder="0000 0000 0000"
                  onChange={handleChange}
                  required
                />

                <SectionHeader title="Contact Information" />
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                  onChange={handleChange}
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91"
                  required
                  onChange={handleChange}
                />

                <SectionHeader title="Location Details" />
                <div className="col-span-full">
                  <FormField
                    label="Residential Address"
                    name="address"
                    placeholder="Door No, Street, Area..."
                    onChange={handleChange}
                    required
                  />
                </div>
                <FormField
                  label="Zone"
                  name="zone"
                  placeholder="e.g. South"
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="District"
                  name="district"
                  placeholder="District name"
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="State"
                  name="state"
                  placeholder="State name"
                  onChange={handleChange}
                  required
                />

                <SectionHeader title="Social Presence" />
                <FormField
                  label="Instagram ID"
                  name="instagram"
                  placeholder="@handle"
                  onChange={handleChange}
                />
                <FormField
                  label="X (Twitter) ID"
                  name="xTwitter"
                  placeholder="@handle"
                  onChange={handleChange}
                />

                <div className="col-span-full flex flex-col items-center gap-4 mt-8">
                  <PrimaryButton
                    title="Complete Registration"
                    className="w-full md:w-auto px-16 py-4  rounded-2xl font-bold text-lg shadow-xl shadow-black/10  transition-colors hover:scale-105"
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
