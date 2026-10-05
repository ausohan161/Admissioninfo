import noticeData from "@/data/notices.json";

/** Mutable on purpose: `applyContent` replaces the contents at runtime from `content.json`. */
export const notices: string[] = [...noticeData.notices];
