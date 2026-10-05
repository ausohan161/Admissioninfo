import { AlertTriangle } from "lucide-react";
import { texts } from "@/lib/texts";

export function ErrorState({
  title = texts.errorTitle,
  description = texts.errorDesc,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/40 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-400">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </div>
      <p className="text-sm font-medium text-red-700">{title}</p>
      <p className="max-w-sm text-xs text-red-400">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          {texts.retry}
        </button>
      )}
    </div>
  );
}
