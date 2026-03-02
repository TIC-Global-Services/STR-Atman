"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Country, State, City } from "country-state-city";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */

const COUNTRY_CODES = [
  { code: "+91",  flag: "🇮🇳", name: "India" },
  { code: "+1",   flag: "🇺🇸", name: "USA" },
  { code: "+44",  flag: "🇬🇧", name: "UK" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+65",  flag: "🇸🇬", name: "Singapore" },
  { code: "+60",  flag: "🇲🇾", name: "Malaysia" },
  { code: "+61",  flag: "🇦🇺", name: "Australia" },
  { code: "+1",   flag: "🇨🇦", name: "Canada" },
  { code: "+49",  flag: "🇩🇪", name: "Germany" },
  { code: "+33",  flag: "🇫🇷", name: "France" },
  { code: "+81",  flag: "🇯🇵", name: "Japan" },
  { code: "+82",  flag: "🇰🇷", name: "South Korea" },
  { code: "+86",  flag: "🇨🇳", name: "China" },
  { code: "+94",  flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+92",  flag: "🇵🇰", name: "Pakistan" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+977", flag: "🇳🇵", name: "Nepal" },
  { code: "+27",  flag: "🇿🇦", name: "South Africa" },
  { code: "+55",  flag: "🇧🇷", name: "Brazil" },
  { code: "+52",  flag: "🇲🇽", name: "Mexico" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+31",  flag: "🇳🇱", name: "Netherlands" },
  { code: "+46",  flag: "🇸🇪", name: "Sweden" },
  { code: "+41",  flag: "🇨🇭", name: "Switzerland" },
];

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

const TIER_INFO: Record<string, { icon: string; perks: string }> = {
  Free:     { icon: "⭐", perks: "Digital card · Newsletter" },
  Silver:   { icon: "🥈", perks: "Free + Priority updates · Forum access" },
  Gold:     { icon: "🥇", perks: "Silver + Exclusive merch · Early tickets" },
  Platinum: { icon: "💎", perks: "Gold + Meet & greet · VIP events" },
};

const READABLE: Record<string, string> = {
  fullName: "Full Name", dob: "Date of Birth", country: "Country",
  state: "State", city: "City", bloodGroup: "Blood Group",
  aadhaar: "Aadhaar / ID", phone: "Phone", email: "Email",
  existingClub: "Fan Club Member", fanClubName: "Club Name",
  chapterLocation: "Chapter Location", willingToJoin: "Join Chapter",
  chapterLead: "Chapter Lead", fanDuration: "Fan Since",
  favoriteMovie: "Fav Movie", favoriteSong: "Fav Song",
  socialHandle: "Social Handle", tshirtSize: "T-Shirt Size",
  membershipType: "Membership Tier",
};

/* ═══════════════════════════════════════
   TYPES
═══════════════════════════════════════ */

type FieldKind =
  | "text" | "email" | "dob" | "phone" | "aadhaar"
  | "dropdown" | "cascadeCountry" | "cascadeState" | "cascadeCity"
  | "bloodGroup" | "radio" | "otp" | "review";

interface FieldDef {
  kind: FieldKind;
  name: string;
  label: string;
  placeholder?: string;
  options?: string[];
  optional?: boolean;
}

/* ═══════════════════════════════════════
   FIELD DEFINITIONS
═══════════════════════════════════════ */

const ALL_FIELDS: FieldDef[] = [
  { kind: "text",           name: "fullName",        label: "What's your full name?",                    placeholder: "e.g. Arjun Kumar" },
  { kind: "dob",            name: "dob",             label: "When were you born?" },
  { kind: "cascadeCountry", name: "country",         label: "Which country are you from?" },
  { kind: "cascadeState",   name: "state",           label: "Which state / province / emirate?" },
  { kind: "cascadeCity",    name: "city",            label: "And your city?" },
  { kind: "bloodGroup",     name: "bloodGroup",      label: "What's your blood group?" },
  { kind: "aadhaar",        name: "aadhaar",         label: "Aadhaar / National ID number",             placeholder: "12-digit Aadhaar or passport no." },
  { kind: "phone",          name: "phone",           label: "Your phone number" },
  { kind: "email",          name: "email",           label: "Your email address",                       placeholder: "you@example.com" },
  { kind: "otp",            name: "otp",             label: "Verify your email" },
  {
    kind: "radio", name: "existingClub", label: "Are you part of an existing STR fan club?",
    options: ["yes|🎭|Yes, I'm already in a club", "no|🌟|No, I'm a free agent"],
  },
  { kind: "text",  name: "fanClubName",      label: "Fan club name?",          placeholder: "e.g. STR Fans Mumbai" },
  { kind: "text",  name: "chapterLocation",  label: "Chapter location?",       placeholder: "e.g. Mumbai" },
  {
    kind: "radio", name: "willingToJoin", label: "Willing to join a local chapter near you?",
    options: ["yes|🙌|Yes, sign me up!", "no|🙏|Maybe later"],
  },
  {
    kind: "radio", name: "chapterLead", label: "Interested in becoming a Chapter Lead?",
    options: ["yes|⚡|Yes, I'd love to lead!", "no|👀|Not for now"],
  },
  {
    kind: "dropdown", name: "fanDuration", label: "How long have you been an STR fan?",
    options: ["Less than 1 year", "1–5 years", "5–10 years", "10+ years"],
  },
  { kind: "text",     name: "favoriteMovie", label: "Favorite STR movie?",    placeholder: "e.g. Manmadhan, Vinnaithaandi...", optional: true },
  { kind: "text",     name: "favoriteSong",  label: "Favorite STR song?",     placeholder: "e.g. Venmathi...",                optional: true },
  { kind: "text",     name: "socialHandle",  label: "Instagram / X handle",   placeholder: "@yourhandle",                     optional: true },
  {
    kind: "dropdown", name: "tshirtSize", label: "T-shirt size for merch?",
    options: ["XS", "S", "M", "L", "XL", "XXL"],
    optional: true,
  },
  {
    kind: "dropdown", name: "membershipType", label: "Choose your membership tier",
    options: ["Free", "Silver", "Gold", "Platinum"],
  },
  { kind: "review", name: "review", label: "" },
];

const MANDATORY = new Set([
  "fullName","dob","country","state","city","bloodGroup","aadhaar",
  "phone","email","existingClub","willingToJoin","chapterLead","fanDuration","membershipType",
]);

/* ═══════════════════════════════════════
   VISIBILITY LOGIC
═══════════════════════════════════════ */

const shouldShow = (f: FieldDef, d: Record<string, any>): boolean => {
  if (f.kind === "review") return true;
  if (f.name === "fanClubName" || f.name === "chapterLocation") return d.existingClub === "yes";
  if (f.name === "willingToJoin" || f.name === "chapterLead")   return d.existingClub === "no";
  if (f.name === "state") return !!d.country && !!d.countryISO;
  if (f.name === "city")  return !!d.state;
  return true;
};

/* ═══════════════════════════════════════
   SUB COMPONENTS
═══════════════════════════════════════ */

const OkButton = ({
  onClick, label = "OK",
}: { onClick: () => void; label?: string }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="mt-6 inline-flex items-center gap-2 bg-black text-white px-7 py-3 rounded-2xl text-sm font-semibold select-none"
    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}
  >
    {label}
    <span style={{ color: "#0de65a" }} className="font-black text-base leading-none">↵</span>
  </motion.button>
);

/* Reusable searchable list for country/state/city */
const SearchList = ({
  items, selected, onSelect, placeholder = "Search...",
}: {
  items: string[]; selected?: string;
  onSelect: (v: string) => void; placeholder?: string;
}) => {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Small delay so AnimatePresence settle before focusing
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = items.filter(i => i.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          ref={inputRef}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full border-2 border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm font-medium outline-none transition-colors"
          style={{ caretColor: "#0de65a" }}
          onFocus={e => (e.currentTarget.style.borderColor = "#0de65a")}
          onBlur={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
        />
      </div>
      <div className="max-h-[220px] overflow-y-auto flex flex-col gap-1.5 pr-0.5 custom-scroll">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6">No results for "{q}"</p>
        )}
        {filtered.map(item => (
          <motion.button
            key={item}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(item)}
            className={`choice-card ${selected === item ? "choice-card--selected" : ""}`}
          >
            <span className="text-sm font-medium flex-1 text-left">{item}</span>
            {selected === item && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="text-xs font-black ml-2 flex-shrink-0"
                style={{ color: "#0de65a" }}
              >✓</motion.span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */

const MembershipForm = () => {
  const [data, setData]     = useState<Record<string, any>>({ countryCode: "+91", countryFlag: "🇮🇳" });
  const [fieldIndex, setFieldIndex] = useState(0);
  const [direction, setDirection]   = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  /* OTP – stored as array of 6 digits for reliable controlled input */
  const [otpDigits, setOtpDigits]         = useState<string[]>(["","","","","",""]);
  const [otpSent, setOtpSent]             = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [timer, setTimer]                 = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Country code picker */
  const [ccOpen, setCcOpen]   = useState(false);
  const [ccSearch, setCcSearch] = useState("");
  const ccRef = useRef<HTMLDivElement>(null);

  /* Close CC picker on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ccRef.current && !ccRef.current.contains(e.target as Node)) setCcOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* OTP countdown */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* ── Helpers ── */
  const set = (k: string, v: any) => setData(prev => ({ ...prev, [k]: v }));

  const visibleFields = ALL_FIELDS.filter(f => shouldShow(f, data));
  const current  = visibleFields[fieldIndex];
  const totalQ   = visibleFields.length - 1; // exclude review
  const progress = Math.round((fieldIndex / (visibleFields.length - 1)) * 100);

  const goNext = () => { setDirection(1);  setFieldIndex(i => Math.min(i + 1, visibleFields.length - 1)); };
  const goPrev = () => { setDirection(-1); setFieldIndex(i => Math.max(i - 1, 0)); };

  const advance = () => {
    if (current.kind === "otp") {
      if (!emailVerified) { toast.error("Please verify your OTP first"); return; }
      goNext(); return;
    }
    if (MANDATORY.has(current.name) && !data[current.name]) {
      toast.error("This field is required");
      return;
    }
    goNext();
  };

  const sendOtp = () => {
    if (!data.email) { toast.error("Enter email first"); return; }
    toast.success("OTP sent! (demo mode)");
    setOtpSent(true); setTimer(60);
  };

  const handleOtpInput = (val: string, idx: number) => {
    // Strip non-digits, take last char so replacing a filled box works correctly
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtpDigits(prev => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    // Advance focus only when a digit was entered
    if (digit && idx < 5) {
      setTimeout(() => otpRefs.current[idx + 1]?.focus(), 0);
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      if (otpDigits[idx]) {
        // Clear current box first
        setOtpDigits(prev => { const n = [...prev]; n[idx] = ""; return n; });
      } else if (idx > 0) {
        // Move to previous box and clear it
        setOtpDigits(prev => { const n = [...prev]; n[idx - 1] = ""; return n; });
        setTimeout(() => otpRefs.current[idx - 1]?.focus(), 0);
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = ["","","","","",""];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    // Focus the box after the last pasted digit (or last box)
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => otpRefs.current[focusIdx]?.focus(), 0);
  };

  const verifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length < 6) { toast.error("Enter the full 6-digit code"); return; }
    setEmailVerified(true);
    toast.success("Email verified ✓");
    setTimeout(goNext, 700);
  };

  const handleSubmit = () => {
    if (!data.agreeTerms || !data.ageConfirm) {
      toast.error("Please accept both declarations to submit");
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  /* ═══════════════════════════════════════
     SUCCESS SCREEN
  ═══════════════════════════════════════ */
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center py-16 text-center gap-5"
      >
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
          className="text-8xl select-none"
        >🎉</motion.div>

        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to the family!</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
            Your application has been received. Check your inbox for confirmation and next steps.
          </p>
        </div>

        <div
          className="mt-1 px-5 py-2 rounded-full text-xs font-black tracking-widest border-2 select-none"
          style={{ borderColor: "#0de65a", color: "#0de65a" }}
        >
          SILAMBARASAN TR · OFFICIAL FAN
        </div>

        {data.membershipType && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500"
          >
            <span>{TIER_INFO[data.membershipType]?.icon}</span>
            {data.membershipType} Member
          </motion.div>
        )}
      </motion.div>
    );
  }

  /* ═══════════════════════════════════════
     FIELD RENDERER
  ═══════════════════════════════════════ */
  const renderField = (f: FieldDef) => {
    switch (f.kind) {

      /* ── Text / Email / Aadhaar ── */
      case "text":
      case "email":
      case "aadhaar":
        return (
          <div>
            <input
              autoFocus
              type={f.kind === "email" ? "email" : "text"}
              placeholder={f.placeholder}
              value={data[f.name] || ""}
              onChange={e => set(f.name, e.target.value)}
              onKeyDown={e => e.key === "Enter" && advance()}
              className="typeform-input"
            />
            <OkButton onClick={advance} label={f.optional ? "OK / Skip" : "OK"} />
          </div>
        );

      /* ── DOB — react-datepicker ── */
      case "dob": {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 5);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 100);

        return (
          <div className="flex flex-col gap-4">
            <div className="datepicker-wrapper">
              <DatePicker
                selected={data.dob ? new Date(data.dob + "T00:00:00") : null}
                onChange={(date: Date | null) => {
                  if (!date) return;
                  const iso = date.toISOString().split("T")[0];
                  set("dob", iso);
                }}
                dateFormat="dd MMMM yyyy"
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                maxDate={maxDate}
                minDate={minDate}
                placeholderText="Select your date of birth"
                className="typeform-input"
                wrapperClassName="w-full"
                calendarClassName="str-calendar"
                popperPlacement="bottom-start"
              />
            </div>

            {data.dob && (
              <motion.p
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold flex items-center gap-1.5"
                style={{ color: "#0de65a" }}
              >
                <span className="text-base">✓</span>
                {new Date(data.dob + "T00:00:00").toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </motion.p>
            )}

            <OkButton onClick={advance} />
          </div>
        );
      }

      /* ── Phone + Country Code ── */
      case "phone": {
        const selectedCc = COUNTRY_CODES.find(
          c => c.code === data.countryCode && c.flag === data.countryFlag
        ) || COUNTRY_CODES[0];

        const filteredCc = COUNTRY_CODES.filter(c =>
          c.name.toLowerCase().includes(ccSearch.toLowerCase()) ||
          c.code.includes(ccSearch)
        );

        return (
          <div className="flex flex-col gap-4">
            <div className="flex gap-2.5 items-center">

              {/* Country Code Trigger */}
              <div ref={ccRef} className="relative flex-shrink-0">
                <motion.button
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setCcOpen(v => !v); setCcSearch(""); }}
                  className="flex items-center gap-1.5 px-3 h-[50px] rounded-xl border-2 text-sm font-bold select-none"
                  style={{ borderColor: ccOpen ? "#0de65a" : "#e5e7eb" }}
                >
                  <span className="text-xl leading-none">{selectedCc.flag}</span>
                  <span className="text-gray-800 tracking-tight">{selectedCc.code}</span>
                  <svg
                    className="w-3 h-3 text-gray-400 transition-transform"
                    style={{ transform: ccOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  ><polyline points="6 9 12 15 18 9"/></svg>
                </motion.button>

                <AnimatePresence>
                  {ccOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute top-[calc(100%+6px)] left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                      style={{ boxShadow: "0 16px 60px rgba(0,0,0,0.14)" }}
                    >
                      <div className="p-3 border-b border-gray-100">
                        <input
                          autoFocus
                          value={ccSearch}
                          onChange={e => setCcSearch(e.target.value)}
                          placeholder="Search country or code..."
                          className="w-full text-sm rounded-lg px-3 py-2 outline-none bg-gray-50"
                          style={{ caretColor: "#0de65a" }}
                        />
                      </div>
                      <div className="max-h-56 overflow-y-auto custom-scroll">
                        {filteredCc.map((c, i) => {
                          const isActive = c.code === data.countryCode && c.flag === data.countryFlag;
                          return (
                            <motion.button
                              key={i}
                              whileHover={{ backgroundColor: "#f0fff6" }}
                              onClick={() => {
                                set("countryCode", c.code);
                                set("countryFlag", c.flag);
                                setCcOpen(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                              style={{ background: isActive ? "#f0fff6" : undefined }}
                            >
                              <span className="text-xl leading-none">{c.flag}</span>
                              <span className="font-medium flex-1 text-gray-800">{c.name}</span>
                              <span className="text-gray-400 font-mono text-xs tabular-nums">{c.code}</span>
                              {isActive && <span className="text-xs font-black" style={{ color: "#0de65a" }}>✓</span>}
                            </motion.button>
                          );
                        })}
                        {filteredCc.length === 0 && (
                          <p className="text-xs text-gray-400 px-4 py-4 text-center">No results</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Number field */}
              <input
                type="tel"
                placeholder="XXXXX XXXXX"
                value={data.phone || ""}
                onChange={e => set("phone", e.target.value.replace(/\D/g, "").slice(0, 13))}
                onKeyDown={e => e.key === "Enter" && advance()}
                className="typeform-input flex-1"
              />
            </div>
            <OkButton onClick={advance} />
          </div>
        );
      }

      /* ── Blood Group Grid ── */
      case "bloodGroup":
        return (
          <div className="grid grid-cols-4 gap-3">
            {BLOOD_GROUPS.map(bg => (
              <motion.button
                key={bg}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => { set("bloodGroup", bg); setTimeout(goNext, 300); }}
                className="flex flex-col items-center justify-center py-5 rounded-2xl border-2 font-black text-base select-none transition-all"
                style={{
                  borderColor: data.bloodGroup === bg ? "#0de65a" : "#e5e7eb",
                  background:  data.bloodGroup === bg ? "#f0fff6"  : "white",
                  color:       data.bloodGroup === bg ? "#111"      : "#374151",
                  boxShadow:   data.bloodGroup === bg ? "0 4px 20px rgba(13,230,90,0.2)" : "none",
                }}
              >
                {bg}
              </motion.button>
            ))}
          </div>
        );

      /* ── Cascade Country (country-state-city library) ── */
      case "cascadeCountry": {
        const countries = Country.getAllCountries();
        return (
          <SearchList
            items={countries.map(c => c.name)}
            selected={data.country}
            placeholder="Search country..."
            onSelect={name => {
              const found = countries.find(c => c.name === name);
              set("country",    name);
              set("countryISO", found?.isoCode ?? "");
              set("state",    "");
              set("stateISO", "");
              set("city",     "");
              setTimeout(goNext, 350);
            }}
          />
        );
      }

      /* ── Cascade State ── */
      case "cascadeState": {
        const states = data.countryISO ? State.getStatesOfCountry(data.countryISO) : [];
        if (states.length === 0) {
          return (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-400 italic">No states found for {data.country}. You can skip this.</p>
              <OkButton onClick={goNext} label="Skip" />
            </div>
          );
        }
        return (
          <SearchList
            items={states.map(s => s.name)}
            selected={data.state}
            placeholder="Search state / province..."
            onSelect={name => {
              const found = states.find(s => s.name === name);
              set("state",    name);
              set("stateISO", found?.isoCode ?? "");
              set("city",     "");
              setTimeout(goNext, 350);
            }}
          />
        );
      }

      /* ── Cascade City ── */
      case "cascadeCity": {
        const cities = (data.countryISO && data.stateISO)
          ? City.getCitiesOfState(data.countryISO, data.stateISO)
          : [];
        if (cities.length === 0) {
          return (
            <div className="flex flex-col gap-4">
              <input
                autoFocus
                placeholder="Type your city name"
                value={data.city || ""}
                onChange={e => set("city", e.target.value)}
                onKeyDown={e => e.key === "Enter" && advance()}
                className="typeform-input"
              />
              <OkButton onClick={advance} />
            </div>
          );
        }
        return (
          <SearchList
            items={cities.map(c => c.name)}
            selected={data.city}
            placeholder="Search city..."
            onSelect={name => {
              set("city", name);
              setTimeout(goNext, 350);
            }}
          />
        );
      }

      /* ── Radio ── */
      case "radio":
        return (
          <div className="flex flex-col gap-3">
            {(f.options || []).map(raw => {
              const [value, icon, label] = raw.split("|");
              const isSelected = data[f.name] === value;
              return (
                <motion.button
                  key={value}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { set(f.name, value); setTimeout(goNext, 360); }}
                  className={`choice-card ${isSelected ? "choice-card--selected" : ""}`}
                >
                  <span className="text-xl leading-none select-none">{icon}</span>
                  <span className="font-semibold text-sm flex-1 text-left">{label}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-xs font-black ml-auto flex-shrink-0"
                      style={{ color: "#0de65a" }}
                    >✓</motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      /* ── Generic Dropdown List ── */
      case "dropdown":
        return (
          <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto custom-scroll pr-0.5">
            {(f.options || []).map(opt => {
              const isSelected = data[f.name] === opt;
              const tier = TIER_INFO[opt];
              return (
                <motion.button
                  key={opt}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { set(f.name, opt); setTimeout(goNext, 320); }}
                  className={`choice-card ${isSelected ? "choice-card--selected" : ""}`}
                >
                  {tier && <span className="text-xl leading-none select-none">{tier.icon}</span>}
                  <div className="flex flex-col items-start flex-1">
                    <span className="font-semibold text-sm">{opt}</span>
                    {tier && <span className="text-xs text-gray-400 mt-0.5 leading-tight">{tier.perks}</span>}
                  </div>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-xs font-black ml-2 flex-shrink-0"
                      style={{ color: "#0de65a" }}
                    >✓</motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      /* ── OTP ── */
      case "otp":
        return (
          <div className="flex flex-col gap-5">
            {!otpSent && !emailVerified && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-500 leading-relaxed">
                  We'll send a 6-digit code to{" "}
                  <strong className="text-gray-800 font-semibold">{data.email}</strong>
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={sendOtp}
                  className="self-start bg-black text-white px-7 py-3 rounded-2xl text-sm font-semibold"
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.16)" }}
                >
                  Send OTP
                </motion.button>
              </div>
            )}

            {otpSent && !emailVerified && (
              <div className="flex flex-col gap-4">
                <p className="text-xs text-gray-500">Enter the 6-digit code sent to your email</p>
                <div className="flex gap-2.5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpDigits[i]}
                      autoFocus={i === 0}
                      onChange={e => handleOtpInput(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      onPaste={handleOtpPaste}
                      className="otp-box"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={verifyOtp}
                    className="bg-black text-white px-7 py-3 rounded-2xl text-sm font-semibold"
                  >
                    Verify OTP
                  </motion.button>
                  {timer > 0 ? (
                    <span className="text-xs text-gray-400 tabular-nums">Resend in {timer}s</span>
                  ) : (
                    <button
                      onClick={sendOtp}
                      className="text-xs text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {emailVerified && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 text-sm font-semibold"
                style={{ color: "#0de65a" }}
              >
                <span className="text-2xl leading-none">✓</span>
                Email verified successfully
              </motion.div>
            )}
          </div>
        );

      /* ── Review ── */
      case "review":
        return (
          <div className="flex flex-col gap-5">
            {/* Data summary */}
            <div className="rounded-2xl overflow-hidden border border-gray-100">
              {Object.entries(data)
                .filter(([k]) => READABLE[k] && k !== "countryFlag")
                .map(([key, val], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className="flex justify-between items-center px-4 py-3 text-sm"
                    style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}
                  >
                    <span className="text-gray-400 font-medium flex-shrink-0">{READABLE[key]}</span>
                    <span className="font-semibold text-right ml-4 max-w-[55%] truncate">
                      {key === "phone" ? `${data.countryCode} ${val}` : String(val)}
                    </span>
                  </motion.div>
                ))}
            </div>

            {/* Consent checkboxes */}
            <div className="flex flex-col gap-2">
              {[
                { name: "agreeTerms", label: "I agree to STR Global Fan Club Terms & Conditions" },
                { name: "ageConfirm", label: "I confirm I am 18+ or have parental consent" },
              ].map(item => (
                <motion.button
                  key={item.name}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => set(item.name, !data[item.name])}
                  className={`choice-card ${data[item.name] ? "choice-card--selected" : ""}`}
                >
                  <div
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: data[item.name] ? "#0de65a" : "#d1d5db",
                      background:  data[item.name] ? "#0de65a" : "transparent",
                    }}
                  >
                    {data[item.name] && (
                      <svg className="w-3 h-3" viewBox="0 0 12 10" fill="none">
                        <polyline points="1 5 4.5 8.5 11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs font-medium text-left leading-snug">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all select-none"
              style={{
                background: loading ? "#e5e7eb" : "black",
                color: loading ? "#9ca3af" : "white",
                boxShadow: loading ? "none" : "0 4px 24px rgba(0,0,0,0.2)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70"/>
                  </svg>
                  Submitting your application...
                </span>
              ) : (
                "Submit Application 🎉"
              )}
            </motion.button>
          </div>
        );

      default:
        return null;
    }
  };

  /* ═══════════════════════════════════════
     LAYOUT
  ═══════════════════════════════════════ */

  const questionNumber = fieldIndex + 1;
  const isOptional = !!current.optional;
  const isRequired = MANDATORY.has(current.name) && current.kind !== "review";

  return (
    <div className="w-full" data-lenis-prevent>

      {/* ── Progress Bar ── */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {current.kind !== "review" ? `${questionNumber} / ${totalQ}` : "Review"}
            </span>
            {isOptional && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-semibold">
                optional
              </span>
            )}
            {isRequired && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: "#f0fff6", color: "#0de65a" }}
              >
                required
              </span>
            )}
          </div>
          <span className="text-xs font-black tabular-nums" style={{ color: "#0de65a" }}>
            {progress}%
          </span>
        </div>

        {/* Bar */}
        <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#0de65a" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* ── Question Slide ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={fieldIndex}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, y: d > 0 ? 44 : -44 }),
            center: { opacity: 1, y: 0 },
            exit:  (d: number) => ({ opacity: 0, y: d > 0 ? -44 : 44 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[300px] flex flex-col justify-start"
        >
          {/* Question heading */}
          {current.kind !== "review" && (
            <div className="mb-5">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xs font-black tracking-widest flex-shrink-0"
                  style={{ color: "#0de65a" }}
                >
                  {questionNumber}&nbsp;→
                </span>
                <h3 className="text-xl font-black tracking-tight leading-snug text-gray-900">
                  {current.label}
                </h3>
              </div>
              {isOptional && (
                <p className="text-xs text-gray-400 mt-1.5 ml-7">Press OK to skip</p>
              )}
            </div>
          )}

          {/* Review heading */}
          {current.kind === "review" && (
            <div className="mb-5">
              <h3 className="text-xl font-black tracking-tight">Almost done! ✨</h3>
              <p className="text-xs text-gray-400 mt-1">Review your details before submitting.</p>
            </div>
          )}

          {renderField(current)}
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Navigation ── */}
      <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-100">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={goPrev}
          disabled={fieldIndex === 0}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 disabled:opacity-0 transition-all select-none"
        >
          ↑ Back
        </motion.button>

        {/* Pill dots */}
        <div className="flex gap-1.5 overflow-hidden max-w-[50%]">
          {visibleFields.slice(0, -1).map((_, i) => (
            <div
              key={i}
              className="rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                width:      i === fieldIndex ? 18 : 6,
                height:     6,
                background: i <= fieldIndex ? "#0de65a" : "#e5e7eb",
              }}
            />
          ))}
        </div>

        {isOptional && current.kind === "text" ? (
          <motion.button
            whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="text-xs font-semibold text-gray-400 select-none"
          >
            Skip ↓
          </motion.button>
        ) : (
          <div className="w-12" />
        )}
      </div>

      {/* ═══════════════════════════════════════
          GLOBAL STYLES
      ═══════════════════════════════════════ */}
      <style>{`
        /* ── Typeform underline input ── */
        .typeform-input {
          width: 100%;
          border: none;
          border-bottom: 2.5px solid #e5e7eb;
          background: transparent;
          font-size: 1.1rem;
          font-weight: 600;
          color: #111;
          padding: 10px 2px;
          outline: none;
          transition: border-color 0.2s;
          caret-color: #0de65a;
        }
        .typeform-input:focus { border-color: #0de65a; }
        .typeform-input::placeholder { color: #d1d5db; font-weight: 400; }

        /* ── OTP boxes ── */
        .otp-box {
          width: 44px; height: 56px;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          outline: none;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #0de65a;
          color: #111;
        }
        .otp-box:focus {
          border-color: #0de65a;
          box-shadow: 0 0 0 3px rgba(13,230,90,0.14);
        }

        /* ── Choice cards ── */
        .choice-card {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 14px;
          background: white;
          cursor: pointer; text-align: left; width: 100%;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .choice-card:hover {
          border-color: #9ca3af;
          box-shadow: 0 2px 14px rgba(0,0,0,0.07);
        }
        .choice-card--selected {
          border-color: #0de65a !important;
          background: #f0fff6 !important;
        }

        /* ── Scrollbars ── */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 99px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

        /* ── react-datepicker overrides ── */
        .datepicker-wrapper { position: relative; }
        .datepicker-wrapper .react-datepicker-wrapper { display: block; width: 100%; }
        .datepicker-wrapper .react-datepicker__input-container { width: 100%; }

        .react-datepicker {
          font-family: inherit !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 18px !important;
          box-shadow: 0 16px 60px rgba(0,0,0,0.14) !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background: #fff !important;
          border-bottom: 1.5px solid #f3f4f6 !important;
          border-radius: 0 !important;
          padding: 12px 0 8px !important;
        }
        .react-datepicker__current-month {
          font-weight: 800 !important;
          font-size: 0.875rem !important;
          color: #111 !important;
        }
        .react-datepicker__navigation { top: 14px !important; }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #0de65a !important;
          color: #000 !important;
          font-weight: 700 !important;
          border-radius: 8px !important;
        }
        .react-datepicker__day:hover {
          background-color: #f0fff6 !important;
          border-radius: 8px !important;
        }
        .react-datepicker__day { border-radius: 8px !important; }
        .react-datepicker__day-name { color: #9ca3af !important; font-weight: 600 !important; font-size: 0.7rem !important; }
        .react-datepicker__month-dropdown,
        .react-datepicker__year-dropdown {
          background: white !important;
          border: 1.5px solid #e5e7eb !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
        }
        .react-datepicker__month-option:hover,
        .react-datepicker__year-option:hover {
          background: #f0fff6 !important;
        }
        .react-datepicker__month-option--selected_month,
        .react-datepicker__year-option--selected_year {
          background: #0de65a !important;
          color: #000 !important;
          font-weight: 700 !important;
        }
        .react-datepicker__month-read-view--down-arrow,
        .react-datepicker__year-read-view--down-arrow,
        .react-datepicker__navigation-icon::before {
          border-color: #9ca3af !important;
        }
        .react-datepicker__triangle { display: none !important; }
      `}</style>
    </div>
  );
};

export default MembershipForm;