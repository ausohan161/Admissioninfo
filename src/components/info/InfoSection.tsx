import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { texts } from "@/lib/texts";

export function InfoSection({
  title,
  icon: Icon,
  children,
  isEmpty,
  emptyText = texts.notPublished,
}: {
  title: string;
  icon?: LucideIcon;
  children?: ReactNode;
  isEmpty: boolean;
  emptyText?: string;
}) {
  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <h4 className="mb-3 flex items-center gap-2 text-base font-extrabold text-navy-900 sm:text-lg">
        {Icon && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        {title}
      </h4>
      {isEmpty ? (
        <p className="text-base font-medium text-slate-400">{emptyText}</p>
      ) : (
        <div className="text-base text-slate-700">{children}</div>
      )}
    </div>
  );
}
