import { ChevronRight } from "lucide-react";
import { University } from "@/data/types";

export function UniversityPicker({
  universityList,
  onSelect,
}: {
  universityList: University[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {universityList.map((u) => (
        <button
          key={u.id}
          onClick={() => onSelect(u.id)}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-soft transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold leading-snug text-navy-900">{u.nameBn}</p>
            <p className="text-sm font-bold text-slate-600">{u.shortName}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" aria-hidden />
        </button>
      ))}
    </div>
  );
}
