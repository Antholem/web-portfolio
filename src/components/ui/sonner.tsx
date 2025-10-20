"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastType = "default" | "success" | "error" | "loading";

interface ToastOptions {
  id?: string;
  duration?: number | null;
  type?: ToastType;
}

interface ToastEntry {
  id: string;
  message: string;
  type: ToastType;
  duration: number | null;
  createdAt: number;
}

const DEFAULT_DURATION = 4000;

const toastRegistry = new Map<string, ToastEntry>();
const timers = new Map<string, number>();
const subscribers = new Set<() => void>();

function emit() {
  subscribers.forEach((listener) => listener());
}

function scheduleDismiss(entry: ToastEntry) {
  const timerId = timers.get(entry.id);
  if (timerId) {
    window.clearTimeout(timerId);
    timers.delete(entry.id);
  }

  if (entry.duration !== null) {
    const timeoutId = window.setTimeout(() => {
      toast.dismiss(entry.id);
    }, entry.duration);
    timers.set(entry.id, timeoutId);
  }
}

function upsertToast(message: string, options: ToastOptions = {}) {
  const id = options.id ?? `toast-${Math.random().toString(36).slice(2, 10)}`;
  const existing = toastRegistry.get(id);

  const entry: ToastEntry = {
    id,
    message,
    type: options.type ?? existing?.type ?? "default",
    createdAt: existing?.createdAt ?? Date.now(),
    duration:
      options.duration !== undefined
        ? options.duration
        : options.type === "loading"
          ? null
          : existing?.duration ?? DEFAULT_DURATION,
  };

  toastRegistry.set(id, entry);

  if (typeof window !== "undefined") {
    scheduleDismiss(entry);
  }

  emit();

  return id;
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => upsertToast(message, options),
  {
    success(message: string, options?: ToastOptions) {
      return upsertToast(message, { ...options, type: "success" });
    },
    error(message: string, options?: ToastOptions) {
      return upsertToast(message, { ...options, type: "error", duration: options?.duration ?? 6000 });
    },
    loading(message: string, options?: ToastOptions) {
      return upsertToast(message, { ...options, type: "loading", duration: null });
    },
    dismiss(id?: string) {
      if (id) {
        const timerId = timers.get(id);
        if (timerId && typeof window !== "undefined") {
          window.clearTimeout(timerId);
          timers.delete(id);
        }
        if (toastRegistry.delete(id)) {
          emit();
        }
        return;
      }

      Array.from(toastRegistry.keys()).forEach((key) => toast.dismiss(key));
    },
    subscribe(listener: () => void) {
      subscribers.add(listener);
      return () => {
        subscribers.delete(listener);
      };
    },
    getToasts() {
      return Array.from(toastRegistry.values()).sort((a, b) => a.createdAt - b.createdAt);
    },
  },
);

function useToastStore() {
  const [snapshot, setSnapshot] = useState<ToastEntry[]>(() => toast.getToasts());

  useEffect(() => {
    const unsubscribe = toast.subscribe(() => {
      setSnapshot(toast.getToasts());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return snapshot;
}

function ToastIcon({ type }: { type: ToastType }) {
  if (type === "success") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
    );
  }

  if (type === "error") {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white">!</span>
    );
  }

  if (type === "loading") {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground" />
      </span>
    );
  }

  return null;
}

export function Toaster() {
  const toasts = useToastStore();
  const portalTarget = useMemo(() => {
    if (typeof document === "undefined") {
      return null;
    }

    const existing = document.getElementById("custom-sonner-root");
    if (existing) {
      return existing;
    }

    const container = document.createElement("div");
    container.id = "custom-sonner-root";
    document.body.appendChild(container);
    return container;
  }, []);

  useEffect(() => {
    return () => {
      if (portalTarget && portalTarget.parentNode) {
        portalTarget.parentNode.removeChild(portalTarget);
      }
    };
  }, [portalTarget]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed bottom-6 left-6 z-[100] flex w-80 max-w-full flex-col gap-2">
      {toasts.map((item) => (
        <div
          key={item.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 rounded-md border border-border bg-background/95 p-4 text-sm shadow-lg transition", 
            item.type === "success" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
            item.type === "error" && "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          <ToastIcon type={item.type} />
          <span className="flex-1 text-left text-sm text-foreground">{item.message}</span>
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
            onClick={() => toast.dismiss(item.id)}
          >
            Close
          </button>
        </div>
      ))}
    </div>,
    portalTarget,
  );
}
