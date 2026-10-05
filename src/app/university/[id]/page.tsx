import Link from "next/link";
import { texts } from "@/lib/texts";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UniversityInfoPanel } from "@/components/info/UniversityInfoPanel";
import { getUniversityById, universities } from "@/data/universities";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return universities.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const university = getUniversityById(id);
  if (!university) return { title: "পাওয়া যায়নি | অ্যাডমিশন ক্যালেন্ডার" };
  return {
    title: `${university.nameBn} | অ্যাডমিশন ক্যালেন্ডার`,
    description: `${university.nameBn} (${university.shortName}) — ভর্তি পরীক্ষার তারিখ, আবেদনের সময়সীমা ও বিস্তারিত তথ্য।`,
  };
}

export default async function UniversityPage({ params }: PageProps) {
  const { id } = await params;
  const university = getUniversityById(id);
  if (!university) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {texts.backHome}
        </Link>
        {/* UniversityInfoPanel reads the `?unit=` query on the client (useSearchParams),
            which Next.js requires to be wrapped in Suspense for static export. */}
        <Suspense fallback={null}>
          <UniversityInfoPanel university={university} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
