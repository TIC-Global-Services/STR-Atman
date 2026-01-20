"use client";

import Footer from "@/components/Reuseable/Footer2";
import Navbar from "@/components/Reuseable/Navbar";
import PageLoader from "@/components/Reuseable/PageLoader";
import ScrollProvider from "@/provider/ScrollProvider";
import { useRef, useState } from "react";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <PageLoader onFinish={() => setLoading(false)} />}
      <Navbar />
      <ScrollProvider>{children}</ScrollProvider>
      <Footer />
    </>
  );
}
