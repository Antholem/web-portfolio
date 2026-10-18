import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-padded two-digit index, e.g. `1` → `"01"`. */
export function padIndex(value: number) {
  return String(value).padStart(2, "0");
}
