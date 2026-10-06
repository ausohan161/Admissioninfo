import { ExternalLink, FileX2 } from "lucide-react";
import { texts } from "@/lib/texts";

export function CircularButton({
  url,
  solidClassName = "bg-indigo-600 hover:bg-indigo-700",
}: {
  url: string | null;
  /** Complete literal Tailwind classes for the solid background + hover state. */
  solidClassName?: string;
}) {
  if (!url) {
    return (
      <button
        disabled
        className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-400"
      >
        <FileX2 className="h-4 w-4" aria-hidden />
        {texts.circularNotPublished}
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${solidClassName}`}
    >
      {texts.viewCircular}
      <ExternalLink className="h-4 w-4" aria-hidden />
    </a>
  );
}
