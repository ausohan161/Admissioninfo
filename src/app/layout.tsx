import type { Metadata } from "next";
import { Hind_Siliguri, Lato, Baloo_Da_2 } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/components/layout/ContentProvider";
import { texts } from "@/lib/texts";

// Same families as udvash.com: Hind Siliguri for Bengali text, Lato for Latin text
// and digits, Baloo Da 2 for headings.
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});
const balooDa2 = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const SITE_URL = "https://ausohan.com/admissioninfo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: texts.pageTitle,
  description:
    "বাংলাদেশের মেডিকেল, ইঞ্জিনিয়ারিং ও সাধারণ বিশ্ববিদ্যালয়ের আবেদন, ভর্তি পরীক্ষার তারিখ, বাকি দিন, যোগ্যতা ও ভর্তি সংক্রান্ত গুরুত্বপূর্ণ তথ্য একনজরে দেখুন।",
  openGraph: {
    title: texts.pageTitle,
    description:
      "বাংলাদেশের মেডিকেল, ইঞ্জিনিয়ারিং ও সাধারণ বিশ্ববিদ্যালয়ের আবেদন, ভর্তি পরীক্ষার তারিখ, বাকি দিন, যোগ্যতা ও ভর্তি সংক্রান্ত গুরুত্বপূর্ণ তথ্য একনজরে দেখুন।",
    locale: "bn_BD",
    type: "website",
    siteName: texts.appName,
  },
  twitter: {
    card: "summary",
    title: texts.appName,
    description: texts.appTagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hindSiliguri.variable} ${lato.variable} ${balooDa2.variable}`}>
      <body className="min-h-screen antialiased">
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
