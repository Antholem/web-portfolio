"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./nav-bar.module.css";

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
      <nav className={styles.navBar}>
        <div className={styles.container}>
          <Link href="/" className={styles.brand}>
            <Image src="/favicon.ico" alt="Logo" width={24} height={24} />
            <span className={styles.srOnly}>Home</span>
          </Link>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.toggleGroup}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className={styles.mobileButton}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <FaTimes size={20} /> : <FaBars size={20} />}
            </Button>
          </div>
        </div>
        {open && (
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileLinks}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.mobileLink}>
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
