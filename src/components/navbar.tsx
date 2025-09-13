"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/theme";
import {
  FaUser,
  FaListAlt,
  FaTools,
  FaFolderOpen,
  FaEnvelope,
  FaBars,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const links = [
  { href: "#about", label: "About", icon: FaUser },
  { href: "#features", label: "Features", icon: FaListAlt },
  { href: "#skills", label: "Skills", icon: FaTools },
  { href: "#projects", label: "Projects", icon: FaFolderOpen },
  { href: "#contacts", label: "Contacts", icon: FaEnvelope },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between border-b px-4 py-2">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/favicon.ico" alt="logo" width={32} height={32} />
      </Link>
      <div className="hidden md:flex items-center gap-6">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <FaMoon className="h-5 w-5" />
          ) : (
            <FaSun className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <FaBars className="h-5 w-5" />
        </Button>
      </div>
      {open && (
        <div className="absolute top-full left-0 w-full border-b bg-background md:hidden">
          <div className="flex flex-col p-4 gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 py-2"
                onClick={() => setOpen(false)}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FaMoon className="h-5 w-5" />
              ) : (
                <FaSun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
