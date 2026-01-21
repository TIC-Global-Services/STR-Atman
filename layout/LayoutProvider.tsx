"use client";

import Footer from "@/components/reuseable/Footer2";
import Navbar from "@/components/reuseable/navbar";
import PageLoader from "@/components/reuseable/PageLoader";
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
