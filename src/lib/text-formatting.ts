import { BULLET_ITEM, ORDERED_ITEM } from "./rich-text";

export type TextEdit = {
  value: string;
  selectionStart: number;
  selectionEnd: number;
};

export type InlineMarker = "**" | "_";
export type ListKind = "bullet" | "ordered";

const LIST_MARKER = /^(\s*)(?:[-*•]|\d{1,3}[.)])\s+/;

/** Wraps the selection in a marker, or unwraps it when it is already wrapped. */
export function toggleInline(
  { value, selectionStart: start, selectionEnd: end }: TextEdit,
  marker: InlineMarker,
): TextEdit {
  const m = marker.length;
  const selected = value.slice(start, end);

  // Markers just outside the selection: **|word|** → word
  if (
    value.slice(start - m, start) === marker &&
    value.slice(end, end + m) === marker
  ) {
    return {
      value: value.slice(0, start - m) + selected + value.slice(end + m),
      selectionStart: start - m,
      selectionEnd: end - m,
    };
  }

  // Markers inside the selection: |**word**| → word
  if (
    selected.length >= m * 2 &&
    selected.startsWith(marker) &&
    selected.endsWith(marker)
  ) {
    const inner = selected.slice(m, -m);
    return {
      value: value.slice(0, start) + inner + value.slice(end),
      selectionStart: start,
      selectionEnd: start + inner.length,
    };
  }

  // Keep surrounding whitespace outside the markers so they stay valid Markdown.
  const lead = selected.length - selected.trimStart().length;
  const trail = selected.length - selected.trimEnd().length;
  const core = selected.trim();
  const from = start + lead;
  const to = end - trail;

  return {
    value: value.slice(0, from) + marker + core + marker + value.slice(to),
    selectionStart: from + m,
    selectionEnd: from + m + core.length,
  };
}

/** Turns the selected lines into a list, or back into plain lines. */
export function toggleList(
  { value, selectionStart: start, selectionEnd: end }: TextEdit,
  kind: ListKind,
): TextEdit {
  const blockStart = value.lastIndexOf("\n", start - 1) + 1;
  const endBreak = value.indexOf("\n", end > start ? end - 1 : end);
  const blockEnd = endBreak === -1 ? value.length : endBreak;
  const lines = value.slice(blockStart, blockEnd).split("\n");
  const pattern = kind === "bullet" ? BULLET_ITEM : ORDERED_ITEM;

  const content = lines.filter((line) => line.trim());
  const alreadyList =
    content.length > 0 && content.every((line) => pattern.test(line));

  // A lone blank line is where a new list starts; blank lines inside a
  // multi-line selection are separators and stay unmarked.
  const startingList = lines.length === 1 && !lines[0].trim();

  let n = 0;
  const next = lines
    .map((line) => {
      const bare = line.replace(LIST_MARKER, "$1");
      if (alreadyList || (!line.trim() && !startingList)) return bare;
      n += 1;
      return `${kind === "bullet" ? "-" : `${n}.`} ${bare.trimStart()}`;
    })
    .join("\n");

  const caretOnly = start === end && lines.length === 1;
  return {
    value: value.slice(0, blockStart) + next + value.slice(blockEnd),
    selectionStart: caretOnly ? blockStart + next.length : blockStart,
    selectionEnd: blockStart + next.length,
  };
}

/**
 * Enter inside a list item: continue the list, or end it when the item is
 * empty. Returns null when Enter should behave normally.
 */
export function continueList({
  value,
  selectionStart: start,
  selectionEnd: end,
}: TextEdit): TextEdit | null {
  if (start !== end) return null;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const line = value.slice(lineStart, start);

  const bullet = /^(\s*)([-*•])\s+(.*)$/.exec(line);
  const ordered = bullet ? null : /^(\s*)(\d{1,3})([.)])\s+(.*)$/.exec(line);
  if (!bullet && !ordered) return null;

  const itemText = bullet ? bullet[3] : ordered![4];
  if (!itemText.trim()) {
    return {
      value: value.slice(0, lineStart) + value.slice(start),
      selectionStart: lineStart,
      selectionEnd: lineStart,
    };
  }

  const marker = bullet
    ? `${bullet[1]}${bullet[2]} `
    : `${ordered![1]}${Number(ordered![2]) + 1}${ordered![3]} `;
  const insert = `\n${marker}`;
  return {
    value: value.slice(0, start) + insert + value.slice(end),
    selectionStart: start + insert.length,
    selectionEnd: start + insert.length,
  };
}
