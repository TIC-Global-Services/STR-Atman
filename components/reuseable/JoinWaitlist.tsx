"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PrimaryButton from "../reuseable/PrimaryButton";

/* ---------------- Sub components ---------------- */

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
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

/* ---------------- Component ---------------- */

interface JoinWaitlistFormProps {
  showPopup: boolean;
  onClose: () => void;
}

const JoinWaitlistForm = ({ showPopup, onClose }: JoinWaitlistFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waitlist Data:", formData);
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
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl p-6 md:p-10 max-w-lg w-full relative shadow-2xl border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-black text-black tracking-tight mb-2">
                JOIN <span className="text-primary">WAITLIST</span>
              </h2>
              <p className="text-gray-500 font-medium">
                Be the first to know when memberships open.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <FormField
                label="Full Name"
                name="name"
                placeholder="Enter your name"
                required
                onChange={handleChange}
              />

              <FormField
                label="Email Address"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
                onChange={handleChange}
              />

              <div className="mt-6 flex flex-col items-center gap-3">
                <PrimaryButton
                  title="Join Waitlist"
                  className="w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-black/10 hover:scale-105 transition-transform"
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                  No spam. Only official updates.
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinWaitlistForm;
