import { Libre_Baskerville, Open_Sans } from "next/font/google";

export const headingFont = Open_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const bodyFont = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
