import { Inbox } from "lucide-react";
import { texts } from "@/lib/texts";

export function EmptyState({
  title = texts.emptyDefaultTitle,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300">
        <Inbox className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && <p className="max-w-sm text-xs text-slate-400">{description}</p>}
    </div>
  );
}
