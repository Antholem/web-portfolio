"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

const RESUME_URL = "/assets/resume.pdf";

export function ResumeButton() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex items-stretch">
      <Button
        asChild
        size="lg"
        variant="outline"
        className="rounded-r-none"
        aria-label="Download Sam Antholem Manalo's resume"
      >
        <a href={RESUME_URL} download>
          Download Resume
        </a>
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="rounded-l-none border-l-0 px-2"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="sr-only">Open resume options</span>
        <ChevronDown className="h-4 w-4" aria-hidden />
      </Button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-md border bg-background text-sm shadow-lg"
        >
          <Link
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="block px-3 py-2 transition hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            View Resume
          </Link>
        </div>
      ) : null}
    </div>
  );
}
