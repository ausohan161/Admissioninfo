import type { Metadata } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/components/layout/ContentProvider";
import { texts } from "@/lib/texts";

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-bangla",
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
    <html lang="bn" className={notoBengali.variable}>
      <body className="min-h-screen antialiased">
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
