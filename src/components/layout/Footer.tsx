import { texts } from "@/lib/texts";
export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6">
        <p className="text-sm font-bold text-navy-800">{texts.appName}</p>
        <p className="mt-1 text-xs text-slate-500">
          {texts.appTagline}
        </p>
        <p className="mt-4 text-xs text-slate-400">
          {texts.footerNote1}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {texts.footerNote2}
        </p>
      </div>
    </footer>
  );
}
