"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { FaMoon, FaSun } from "react-icons/fa"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useThemeStore } from "@/lib/theme-store"

const links = [
    { href: "/", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contacts", label: "Contacts" },
]

export default function Navbar({ initialTheme }: { initialTheme?: "light" | "dark" }) {
    const theme = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        if (initialTheme) {
            setTheme(initialTheme)
        }
        setMounted(true)
    }, [initialTheme, setTheme])

    const currentTheme = mounted ? theme : initialTheme || theme

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 shadow-[0_1px_0_hsla(0,0%,100%,0.6)_inset,0_18px_45px_-30px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-colors dark:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_45px_-30px_rgba(0,0,0,0.65)]">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 border-border/60 bg-background/95 backdrop-blur-xl">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <SheetDescription className="sr-only">
                                Site navigation links
                            </SheetDescription>
                            <nav className="grid gap-2 py-4">
                                {links.map((l) => (
                                    <Button
                                        key={l.href}
                                        variant="ghost"
                                        className="justify-start rounded-xl bg-muted/40 text-foreground shadow-[0_18px_40px_-35px_rgba(15,23,42,0.55)] hover:bg-accent/60 hover:text-foreground dark:bg-white/[0.04]"
                                        asChild
                                    >
                                        <Link href={l.href}>{l.label}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="relative h-6 w-6">
                        <Image
                            src="/logo-dark.svg"
                            alt="Logo"
                            fill
                            sizes="24px"
                            className="object-contain dark:hidden"
                        />
                        <Image
                            src="/logo-light.svg"
                            alt="Logo"
                            fill
                            sizes="24px"
                            className="hidden object-contain dark:block"
                        />
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-1 py-1 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.75)] transition-colors dark:bg-background/40">
                    {links.map((l) => (
                        <Button
                            key={l.href}
                            variant="ghost"
                            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground"
                            asChild
                        >
                            <Link href={l.href}>{l.label}</Link>
                        </Button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full border border-border/40 bg-background/70 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.75)] transition-transform hover:-translate-y-0.5 hover:border-primary/40 hover:bg-transparent hover:text-primary"
                        onClick={toggleTheme}
                    >
                        {currentTheme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>
            </div>
        </header>
    )
}
