"use client";

import Footer from "@/components/reuseable/Footer2";
import Navbar from "@/components/reuseable/navbar";
import PageLoader from "@/components/reuseable/PageLoader";
import ScrollProvider from "@/provider/ScrollProvider";
import { useEffect, useState } from "react";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  return (
    <>
      {/* APP CONTENT (always rendered and visible) */}
      <div id="app-root" className="relative">
        <Navbar />
        <ScrollProvider>{children}</ScrollProvider>
        <Footer />
      </div>

      {/* LOADER OVERLAY (on top) */}
      {/* {loading && (
        <PageLoader
          onFinish={() => {
            setLoading(false);
          }}
        />
      )} */}
    </>
  );
}