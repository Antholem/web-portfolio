/**
 * The contact message's formatting: a deliberately tiny Markdown subset —
 * **bold**, _italic_, "- " bullets and "1. " numbered lists. Small enough to
 * parse without a dependency, and the raw source still reads well as plain text.
 */

export type InlineRun = { text: string; bold: boolean; italic: boolean };

export type MessageBlock =
  | { type: "paragraph"; lines: InlineRun[][] }
  | { type: "bullet-list" | "ordered-list"; items: InlineRun[][] };

export const BULLET_ITEM = /^\s*[-*•]\s+(.*)$/;
export const ORDERED_ITEM = /^\s*(\d{1,3})[.)]\s+(.*)$/;

// `_` only counts at word edges so snake_case and URLs stay intact.
const INLINE = /\*\*(.+?)\*\*|(?<![\p{L}\p{N}_])_(.+?)_(?![\p{L}\p{N}_])/gu;

export function parseInline(
  text: string,
  style: Omit<InlineRun, "text"> = { bold: false, italic: false },
): InlineRun[] {
  const runs: InlineRun[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last)
      runs.push({ text: text.slice(last, match.index), ...style });
    runs.push(
      ...(match[1] !== undefined
        ? parseInline(match[1], { ...style, bold: true })
        : parseInline(match[2], { ...style, italic: true })),
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), ...style });
  return runs;
}

export function parseMessage(source: string): MessageBlock[] {
  const blocks: MessageBlock[] = [];
  // Widened explicitly: TS would otherwise narrow the initial null across the loop.
  let current = null as MessageBlock | null;

  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const bullet = BULLET_ITEM.exec(line);
    const ordered = bullet ? null : ORDERED_ITEM.exec(line);

    if (!line.trim()) {
      current = null;
    } else if (bullet || ordered) {
      const type = bullet ? "bullet-list" : "ordered-list";
      const item = parseInline((bullet ? bullet[1] : ordered![2]).trim());
      if (current?.type === type) current.items.push(item);
      else blocks.push((current = { type, items: [item] }));
    } else {
      const content = parseInline(line.trim());
      if (current?.type === "paragraph") current.lines.push(content);
      else blocks.push((current = { type: "paragraph", lines: [content] }));
    }
  }
  return blocks;
}
