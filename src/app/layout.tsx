import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/components/layout/ContentProvider";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bangla",
  display: "swap",
});

const SITE_URL = "https://admission-calendar.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "অ্যাডমিশন ক্যালেন্ডার | বিশ্ববিদ্যালয় ভর্তি পরীক্ষার তারিখ ও তথ্য",
  description:
    "বাংলাদেশের মেডিকেল, ইঞ্জিনিয়ারিং ও সাধারণ বিশ্ববিদ্যালয়ের আবেদন, ভর্তি পরীক্ষার তারিখ, বাকি দিন, যোগ্যতা ও ভর্তি সংক্রান্ত গুরুত্বপূর্ণ তথ্য একনজরে দেখুন।",
  openGraph: {
    title: "অ্যাডমিশন ক্যালেন্ডার | বিশ্ববিদ্যালয় ভর্তি পরীক্ষার তারিখ ও তথ্য",
    description:
      "বাংলাদেশের মেডিকেল, ইঞ্জিনিয়ারিং ও সাধারণ বিশ্ববিদ্যালয়ের আবেদন, ভর্তি পরীক্ষার তারিখ, বাকি দিন, যোগ্যতা ও ভর্তি সংক্রান্ত গুরুত্বপূর্ণ তথ্য একনজরে দেখুন।",
    locale: "bn_BD",
    type: "website",
    siteName: "অ্যাডমিশন ক্যালেন্ডার",
  },
  twitter: {
    card: "summary",
    title: "অ্যাডমিশন ক্যালেন্ডার",
    description: "একনজরে বিশ্ববিদ্যালয়সমূহের ভর্তি পরীক্ষার সূচি ও তথ্য",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="min-h-screen antialiased">
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
