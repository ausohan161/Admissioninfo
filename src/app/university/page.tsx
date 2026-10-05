"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UniversityInfoPanel } from "@/components/info/UniversityInfoPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { universities } from "@/data/universities";
import { texts } from "@/lib/texts";

function UniversityDetail() {
  const id = useSearchParams().get("id");
  const university = universities.find((u) => u.id === id);

  useEffect(() => {
    document.title = university ? `${university.nameBn} | ${texts.appName}` : `${texts.notFoundTitle} | ${texts.appName}`;
  }, [university]);

  return (
    <>
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {texts.backHome}
      </Link>
      {university ? (
        <UniversityInfoPanel university={university} />
      ) : (
        <EmptyState title={texts.notFoundTitle} />
      )}
    </>
  );
}

export default function UniversityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <Suspense fallback={null}>
          <UniversityDetail />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
