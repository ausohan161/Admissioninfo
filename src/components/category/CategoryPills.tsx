import { ArrowLeft } from "lucide-react";
import { categories } from "@/data/categories";
import { CategoryId } from "@/data/types";
import { getCategoryTheme } from "@/lib/categoryTheme";
import { texts } from "@/lib/texts";

export function CategoryPills({
  active,
  onSelect,
  onBack,
}: {
  active: CategoryId;
  onSelect: (id: CategoryId) => void;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onBack}
        aria-label={texts.backToCategoryAria}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
      </button>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = cat.id === active;
          const theme = getCategoryTheme(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium shadow-sm sm:text-sm ${
                isActive ? theme.activePill : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.shortNameBn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
