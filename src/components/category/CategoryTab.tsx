"use client";

import { useMemo, useState } from "react";
import { CategoryId } from "@/data/types";
import { getCategoryById } from "@/data/categories";
import { getUniversitiesByCategory } from "@/data/universities";
import { CategoryGrid } from "./CategoryGrid";
import { CategoryPills } from "./CategoryPills";
import { UniversityCard } from "./UniversityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { texts } from "@/lib/texts";

export function CategoryTab() {
  const [selected, setSelected] = useState<CategoryId | null>(null);

  const universityList = useMemo(
    () => (selected ? getUniversitiesByCategory(selected) : []),
    [selected]
  );
  const category = selected ? getCategoryById(selected) : null;

  return (
    <div id="panel-category" role="tabpanel" aria-labelledby="tab-category" className="space-y-5">
      {!selected ? (
        <CategoryGrid onSelect={setSelected} />
      ) : (
        <>
          <CategoryPills active={selected} onSelect={setSelected} onBack={() => setSelected(null)} />

          <div>
            <h2 className="mb-3 text-sm font-bold text-navy-900 sm:text-base">{category?.nameBn}</h2>
            {universityList.length === 0 ? (
              <EmptyState title={texts.emptyCategory} />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {universityList.map((u) => (
                  <UniversityCard key={u.id} university={u} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
