"use client";

import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CategoryId } from "@/data/types";
import { getCategoryById } from "@/data/categories";
import { getUniversitiesByCategory, getUniversityById } from "@/data/universities";
import { CategoryGrid } from "@/components/category/CategoryGrid";
import { CategoryPills } from "@/components/category/CategoryPills";
import { EmptyState } from "@/components/ui/EmptyState";
import { UniversityPicker } from "./UniversityPicker";
import { UniversityInfoPanel } from "./UniversityInfoPanel";
import { texts } from "@/lib/texts";

export function InfoTab() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | null>(null);

  const universityList = useMemo(
    () => (selectedCategory ? getUniversitiesByCategory(selectedCategory) : []),
    [selectedCategory]
  );
  const category = selectedCategory ? getCategoryById(selectedCategory) : null;
  const selectedUniversity = selectedUniversityId ? getUniversityById(selectedUniversityId) : null;

  return (
    <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" className="space-y-5">
      {!selectedCategory ? (
        <CategoryGrid onSelect={setSelectedCategory} />
      ) : !selectedUniversity ? (
        <>
          <CategoryPills
            active={selectedCategory}
            onSelect={(id) => {
              setSelectedCategory(id);
              setSelectedUniversityId(null);
            }}
            onBack={() => setSelectedCategory(null)}
          />
          <div>
            <h2 className="mb-3 text-sm font-bold text-navy-900 sm:text-base">{category?.nameBn}</h2>
            {universityList.length === 0 ? (
              <EmptyState title={texts.emptyCategory} />
            ) : (
              <UniversityPicker universityList={universityList} onSelect={setSelectedUniversityId} />
            )}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedUniversityId(null)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {texts.backToList}
          </button>
          <UniversityInfoPanel university={selectedUniversity} />
        </div>
      )}
    </div>
  );
}
