"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import {
  FaBars,
  FaTimes,
  FaInfoCircle,
  FaStar,
  FaTools,
  FaProjectDiagram,
  FaEnvelope,
} from "react-icons/fa";

const navItems = [
  { href: "#about", label: "About", icon: FaInfoCircle },
  { href: "#features", label: "Features", icon: FaStar },
  { href: "#skills", label: "Skills", icon: FaTools },
  { href: "#projects", label: "Projects", icon: FaProjectDiagram },
  { href: "#contacts", label: "Contacts", icon: FaEnvelope },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((o) => !o);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center space-x-1 hover:text-primary"
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
          <ThemeToggle />
        </div>
        <div className="md:hidden flex items-center">
          <ThemeToggle className="mr-2" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes /> : <FaBars />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col space-y-2 p-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center space-x-2 py-2 hover:text-primary"
                onClick={() => setOpen(false)}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
