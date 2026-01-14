import localFont from "next/font/local";


export const Halfre = localFont({
  src: [{ path: "./halfre/halfre.otf", weight: "400", style: "normal" }],
  variable: "--font-halfre",
  display: "swap",
});
