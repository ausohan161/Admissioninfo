import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UniversityCard } from "@/components/category/UniversityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getUniversitiesByCategory } from "@/data/universities";
import { texts } from "@/lib/texts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "পাওয়া যায়নি | অ্যাডমিশন ক্যালেন্ডার" };
  return {
    title: `${category.nameBn} | অ্যাডমিশন ক্যালেন্ডার`,
    description: `${category.nameBn} বিভাগের বিশ্ববিদ্যালয়সমূহের ভর্তি পরীক্ষার তারিখ ও তথ্য।`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const universityList = getUniversitiesByCategory(category.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {texts.backHome}
        </Link>
        <h1 className="mb-4 text-lg font-bold text-navy-900 sm:text-xl">{category.nameBn}</h1>
        {universityList.length === 0 ? (
          <EmptyState title={texts.emptyCategory} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {universityList.map((u) => (
              <UniversityCard key={u.id} university={u} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
