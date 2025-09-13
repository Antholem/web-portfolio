"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetTrigger,
    SheetContent
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { FaMoon, FaSun } from "react-icons/fa"
import Image from "next/image"
import { useEffect } from "react"
import { useThemeStore } from "@/lib/theme-store"

const links = [
    { href: "/", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contacts", label: "Contacts" },
]

export default function Navbar() {
    const theme = useThemeStore((state) => state.theme)
    const setTheme = useThemeStore((state) => state.setTheme)
    const toggleTheme = useThemeStore((state) => state.toggleTheme)

    useEffect(() => {
        const stored = window.localStorage.getItem("theme") as "light" | "dark" | null
        const initial = stored === "dark" ? "dark" : "light"
        setTheme(initial)
    }, [setTheme])

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src={theme === "dark" ? "/logo-light.svg" : "/logo-dark.svg"} alt="Logo" width={24} height={24} />
                </Link>

                <nav className="hidden md:flex items-center gap-4">
                    {links.map((l) => (
                        <Button key={l.href} variant="ghost" asChild>
                            <Link href={l.href}>{l.label}</Link>
                        </Button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="size-8" onClick={toggleTheme}>
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                    </Button>
                </div>

                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="grid gap-4 py-4">
                                {links.map((l) => (
                                    <Button key={l.href} variant="ghost" asChild>
                                        <Link href={l.href}>{l.label}</Link>
                                    </Button>
                                ))}
                                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                                    {theme === "dark" ? <FaSun /> : <FaMoon />}
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
