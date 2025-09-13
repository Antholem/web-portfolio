"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { FaBars, FaTimes } from "react-icons/fa";

const links = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contacts", label: "Contacts" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
          <span className="sr-only">Home</span>
        </Link>
        <ul className="hidden gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block py-2 text-sm font-medium">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
