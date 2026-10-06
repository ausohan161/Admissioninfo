import { Fragment, ReactNode } from "react";

/**
 * Safe inline formatting for admin-edited text. Nothing is parsed as HTML:
 *   **bold**   *italic*   ~~strike~~   [c=#dc2626]coloured[/c]
 * Anything else is shown as plain text.
 */
const TOKEN = /\*\*([\s\S]+?)\*\*|~~([\s\S]+?)~~|\*([^*\n]+?)\*|\[c=(#[0-9a-fA-F]{6})\]([\s\S]+?)\[\/c\]/;

export function richNodes(input: string, keyPrefix = "r"): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = input;
  let i = 0;
  while (rest.length > 0) {
    const m = TOKEN.exec(rest);
    if (!m) {
      out.push(<Fragment key={`${keyPrefix}-${i++}`}>{rest}</Fragment>);
      break;
    }
    if (m.index > 0) out.push(<Fragment key={`${keyPrefix}-${i++}`}>{rest.slice(0, m.index)}</Fragment>);
    const key = `${keyPrefix}-${i++}`;
    if (m[1] !== undefined) out.push(<strong key={key}>{richNodes(m[1], key)}</strong>);
    else if (m[2] !== undefined) out.push(<s key={key}>{richNodes(m[2], key)}</s>);
    else if (m[3] !== undefined) out.push(<em key={key}>{richNodes(m[3], key)}</em>);
    else out.push(<span key={key} style={{ color: m[4] }}>{richNodes(m[5], key)}</span>);
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function Rich({ text }: { text: string }) {
  return <>{richNodes(text)}</>;
}
